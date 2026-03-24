# 测试用例目录（YAML）

本目录存放 **声明式用例**：API 集成测试与（规划中）UI/E2E 用例均以 YAML 描述，由 `tests/case_loader.py` 与 `tests/api_case_runner.py` 等加载与执行。

---

## 目录约定

| 类型 | 建议路径 | 说明 |
|------|----------|------|
| API 套件 | `api/*.yaml` | HTTP 请求 + 断言 |
| UI 套件 | `ui/*.yaml`（可选） | 页面/流程描述，需配合 Playwright 等驱动 |

---

## API 用例格式（YAML）

顶层必须包含 `cases` 数组；每个元素是一条用例。

### 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `id` | 是 | 用例唯一标识，失败信息中会输出 |
| `tags` | 否 | 字符串列表；`load_cases(..., tags=[...])` 可按标签过滤 |
| `setup` | 否 | 前置步骤列表（与 `input` 结构相同，用于创建资源并 `save_as`） |
| `input` | 是 | 主请求：`method`、`path`，可选 `body`、`params` |
| `expected` | 是 | `status`：期望 HTTP 状态码；可选 `body`：响应 JSON 子集断言 |

### `setup` / `input` 单步结构

| 字段 | 说明 |
|------|------|
| `method` | HTTP 方法，如 `GET`、`POST` |
| `path` | 路径，如 `/api/v1/conversations` |
| `body` | JSON 请求体（可为 dict，支持变量占位符） |
| `params` | 查询参数（仅 `input` 常用） |
| `save_as` | 仅用于 `setup`：将 `response.json()` 存为变量名，供后续 `${var.field}` 替换 |

### `expected.body` 断言规则

- **扁平键**：`key: value` 表示 `response.json()[key] == value`。
- **`*_count` 后缀**：如 `items_count: 3` 表示 `len(response.json()["items"]) == 3`（实现中取 `items`）。
- **数组下标**：`items[0].title: "foo"` 表示 `response.json()["items"][0]["title"] == "foo"`。

### 变量引用

在 `body` 中可使用占位符 **`${save_as名称.响应字段}`**（正则 `\$\{(\w+)\.(\w+)\}`），例如：

- setup 一步：`save_as: conv_a`，响应 JSON 含 `"id": "uuid-..."`；
- 后续 `body` 中写 `"conversation_id": "${conv_a.id}"`，执行前会替换为实际字符串。

> 注意：当前实现将非 `None` 的 `body` 经字符串替换后，对 **dict** 类型会用 `yaml.safe_load` 解析；复杂嵌套请保持可被 YAML 解析的字符串形式。

### 最小示例

```yaml
suite: conversations_smoke
cases:
  - id: create_list_ok
    tags: [api, smoke]
    setup: []
    input:
      method: GET
      path: /api/v1/conversations
      params:
        limit: 10
    expected:
      status: 200
      body:
        items_count: 0
```

---

## UI 用例格式（规划）

用于端到端或组件级 UI 测试时，建议约定如下（具体字段以接入的 runner 为准）：

| 字段 | 说明 |
|------|------|
| `id` | 用例 ID |
| `tags` | 过滤标签 |
| `given` | 前置：登录态、本地存储、路由等 |
| `when` | 操作序列：点击、输入、导航 |
| `then` | 期望：URL、可见文案、元素状态 |

YAML 仅作**可读规格与批量用例管理**；执行层需映射到 Playwright / Cypress 等步骤。

---

## 与代码的对应关系

- `tests/case_loader.load_cases("api/foo.yaml", tags=[...])`：`CASES_DIR` 为 **`bgm-monolith/test-cases`**（相对 `tests` 的上一级下的 `test-cases`）。
- `tests/api_case_runner.run_api_case(client, case)`：在 pytest 中注入 `client` fixture 后遍历 `cases` 调用。

---

## 变更说明

新增或修改 YAML 时请保持 `id` 唯一，并在评审中说明覆盖的接口与边界（4xx/5xx、空列表等）。
