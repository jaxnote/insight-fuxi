import yaml
from pathlib import Path

CASES_DIR = Path(__file__).parent.parent / "test-cases"


def load_cases(suite_path: str, tags: list[str] | None = None) -> list[dict]:
    """加载 YAML 用例文件，可按 tag 过滤。"""
    with open(CASES_DIR / suite_path) as f:
        data = yaml.safe_load(f)
    cases = data["cases"]
    if tags:
        cases = [c for c in cases if set(tags) & set(c.get("tags", []))]
    return cases
