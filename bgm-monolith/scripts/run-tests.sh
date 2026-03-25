#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REPORTS_DIR="$PROJECT_ROOT/reports"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

usage() {
  cat <<EOF
用法: ./scripts/run-tests.sh [选项]

选项:
  (无参数)      跑全部测试 + 生成报告
  --smoke       只跑 smoke 标签（快速冒烟）
  --regression  只跑 regression 标签（全量回归）
  --backend     只跑后端
  --frontend    只跑前端
  --summary     跑全部 + 生成 summary.json
  --open        跑完后自动打开覆盖率 HTML
  -h, --help    显示帮助

示例:
  ./scripts/run-tests.sh                     # 日常全量
  ./scripts/run-tests.sh --smoke             # 提交前冒烟
  ./scripts/run-tests.sh --summary --open    # Chunk 完成，生成报告并打开
  ./scripts/run-tests.sh --backend --smoke   # 只跑后端冒烟
EOF
  exit 0
}

SCOPE="all"
TAG=""
GEN_SUMMARY=false
AUTO_OPEN=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --smoke)      TAG="smoke"; shift ;;
    --regression) TAG="regression"; shift ;;
    --backend)    SCOPE="backend"; shift ;;
    --frontend)   SCOPE="frontend"; shift ;;
    --summary)    GEN_SUMMARY=true; shift ;;
    --open)       AUTO_OPEN=true; shift ;;
    -h|--help)    usage ;;
    *)            echo "未知参数: $1"; usage ;;
  esac
done

mkdir -p "$REPORTS_DIR/backend" "$REPORTS_DIR/frontend" "$REPORTS_DIR/e2e/screenshots"

BACKEND_EXIT=0
FRONTEND_EXIT=0

run_backend() {
  echo -e "\n${CYAN}━━━ 后端测试 ━━━${NC}\n"

  local pytest_args=(
    ../tests/ -v
    --cov=app
    --cov-report=html:../reports/backend/coverage
    --cov-report=term-missing
    --junitxml=../reports/backend/junit.xml
  )

  if [[ -n "$TAG" ]]; then
    pytest_args+=(-k "$TAG")
    echo -e "${YELLOW}Tag 过滤: -k $TAG${NC}"
  fi

  cd "$PROJECT_ROOT/backend"
  if pytest "${pytest_args[@]}"; then
    echo -e "\n${GREEN}后端测试全部通过${NC}"
  else
    BACKEND_EXIT=$?
    echo -e "\n${RED}后端测试有失败${NC}"
  fi
}

run_frontend() {
  echo -e "\n${CYAN}━━━ 前端测试 ━━━${NC}\n"

  local vitest_args=(
    run
    --coverage
    --coverage.reportsDirectory=../reports/frontend/coverage
    --reporter=junit --outputFile=../reports/frontend/junit.xml
    --reporter=default
  )

  if [[ -n "$TAG" ]]; then
    vitest_args+=(--grep "$TAG")
    echo -e "${YELLOW}Tag 过滤: --grep $TAG${NC}"
  fi

  cd "$PROJECT_ROOT/frontend"
  if npx vitest "${vitest_args[@]}"; then
    echo -e "\n${GREEN}前端测试全部通过${NC}"
  else
    FRONTEND_EXIT=$?
    echo -e "\n${RED}前端测试有失败${NC}"
  fi
}

generate_summary() {
  echo -e "\n${CYAN}━━━ 生成 summary.json ━━━${NC}\n"

  for layer in backend frontend; do
    local junit_file="$REPORTS_DIR/$layer/junit.xml"
    local summary_file="$REPORTS_DIR/$layer/summary.json"

    if [[ ! -f "$junit_file" ]]; then
      echo -e "${YELLOW}跳过 $layer: junit.xml 不存在${NC}"
      continue
    fi

    python3 -c "
import xml.etree.ElementTree as ET
import json
from datetime import datetime, timezone

tree = ET.parse('$junit_file')
root = tree.getroot()

total = int(root.get('tests', 0))
failures = int(root.get('failures', 0))
errors = int(root.get('errors', 0))
skipped = int(root.get('skipped', 0))
time_sec = float(root.get('time', 0))

# 如果顶层没有 tests 属性，从 testsuite 子元素汇总
if total == 0:
    for ts in root.iter('testsuite'):
        total += int(ts.get('tests', 0))
        failures += int(ts.get('failures', 0))
        errors += int(ts.get('errors', 0))
        skipped += int(ts.get('skipped', 0))
        time_sec += float(ts.get('time', 0))

passed = total - failures - errors - skipped

failed_cases = []
for tc in root.iter('testcase'):
    fail = tc.find('failure')
    if fail is not None:
        failed_cases.append({
            'id': tc.get('name', ''),
            'error': (fail.get('message', '') or fail.text or '')[:200]
        })

summary = {
    'timestamp': datetime.now(timezone.utc).isoformat(),
    'layer': '$layer',
    'total_cases': total,
    'passed': passed,
    'failed': failures + errors,
    'skipped': skipped,
    'duration_sec': round(time_sec, 2),
    'failed_cases': failed_cases,
}

with open('$summary_file', 'w') as f:
    json.dump(summary, f, indent=2, ensure_ascii=False)

print(f'  $layer: {passed}/{total} passed, {failures+errors} failed, {round(time_sec,1)}s')
"
  done

  echo -e "\n${GREEN}summary.json 已生成到 reports/*/summary.json${NC}"
}

print_report_paths() {
  echo -e "\n${CYAN}━━━ 报告路径 ━━━${NC}"
  echo ""
  echo "  后端覆盖率:  reports/backend/coverage/index.html"
  echo "  后端 JUnit:  reports/backend/junit.xml"
  echo "  前端覆盖率:  reports/frontend/coverage/index.html"
  echo "  前端 JUnit:  reports/frontend/junit.xml"

  if [[ "$GEN_SUMMARY" == true ]]; then
    echo "  后端摘要:    reports/backend/summary.json"
    echo "  前端摘要:    reports/frontend/summary.json"
  fi
  echo ""
}

open_reports() {
  if command -v open &>/dev/null; then
    open "$REPORTS_DIR/backend/coverage/index.html" 2>/dev/null || true
    open "$REPORTS_DIR/frontend/coverage/index.html" 2>/dev/null || true
  elif command -v xdg-open &>/dev/null; then
    xdg-open "$REPORTS_DIR/backend/coverage/index.html" 2>/dev/null || true
    xdg-open "$REPORTS_DIR/frontend/coverage/index.html" 2>/dev/null || true
  fi
}

echo -e "${CYAN}BGM Monolith · 测试运行器${NC}"
echo -e "范围: ${SCOPE}  标签: ${TAG:-全部}  summary: ${GEN_SUMMARY}"
echo ""

if [[ "$SCOPE" == "all" || "$SCOPE" == "backend" ]]; then
  run_backend
fi

if [[ "$SCOPE" == "all" || "$SCOPE" == "frontend" ]]; then
  run_frontend
fi

if [[ "$GEN_SUMMARY" == true ]]; then
  generate_summary
fi

print_report_paths

if [[ "$AUTO_OPEN" == true ]]; then
  open_reports
fi

TOTAL_EXIT=$((BACKEND_EXIT + FRONTEND_EXIT))
if [[ $TOTAL_EXIT -eq 0 ]]; then
  echo -e "${GREEN}全部通过${NC}"
else
  echo -e "${RED}有测试失败（后端: $BACKEND_EXIT, 前端: $FRONTEND_EXIT）${NC}"
fi

exit $TOTAL_EXIT
