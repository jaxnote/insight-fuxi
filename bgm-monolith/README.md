# BGM Monolith

Data Coding Workspace — 自然语言数据分析平台

## 架构

- **Frontend**: React 18 + TypeScript + Vite + Zustand + Monaco Editor + ECharts
- **Backend**: Python 3.10+ + FastAPI + SQLAlchemy + WebSocket
- **Database**: MySQL 8.0（MVP）/ 可切换 ES、Milvus、GraphDB
- **File Storage**: 本地文件系统（MVP）/ 可切换 S3、GitLab、GitHub

## 快速启动

### 开发模式

```bash
# 后端
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
uvicorn app.main:app --reload

# 前端
cd frontend
npm install
npm run dev
```

### Docker 模式

```bash
cd bgm-monolith
docker compose up -d
# 访问 http://localhost (前端) 或 http://localhost:8000 (后端 API)
```

## 测试

```bash
# 后端测试（37 个，含单元+API集成）
cd backend && .venv/bin/python -m pytest ../tests/ -v

# 前端测试（25 个，含路由+UI+集成）
cd frontend && npx vitest run

# 全量测试报告
cd backend && .venv/bin/python -m pytest ../tests/ --cov=app --cov-report=html:../reports/backend/coverage
cd frontend && npx vitest run --coverage
```

## 测试覆盖

| 层级 | 用例数 | 状态 |
|------|--------|------|
| 后端 单元测试 | 21 | ✅ |
| 后端 API 集成（YAML） | 16 | ✅ |
| 前端 UI 测试（YAML） | 17 | ✅ |
| 前端 集成测试 | 5 | ✅ |
| E2E | 待执行 | ⬜ |
