import re


async def run_api_case(client, case: dict):
    """通用 API 用例执行器：setup → input → assert expected。"""
    saved = {}
    # 执行 setup 步骤
    for step in case.get("setup", []):
        body = _resolve_vars(step.get("body"), saved)
        path = _resolve_vars(step["path"], saved)
        resp = await client.request(step["method"], path, json=body)
        if "save_as" in step:
            saved[step["save_as"]] = resp.json()

    # 执行 input
    inp = case["input"]
    body = _resolve_vars(inp.get("body"), saved)
    path = _resolve_vars(inp["path"], saved)
    resp = await client.request(inp["method"], path, json=body, params=inp.get("params"))

    # 断言 expected
    exp = case["expected"]
    assert resp.status_code == exp["status"], f'{case["id"]}: expected {exp["status"]}, got {resp.status_code}'
    if "body" in exp:
        _assert_body(resp.json(), exp["body"], case["id"])


def _resolve_vars(obj, saved: dict):
    """替换 ${var.field} 占位符，对 dict/list 递归处理，只替换字符串叶子节点。"""
    if obj is None:
        return obj
    if isinstance(obj, dict):
        return {k: _resolve_vars(v, saved) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_resolve_vars(item, saved) for item in obj]
    if isinstance(obj, str):
        for match in re.finditer(r"\$\{(\w+)\.(\w+)\}", obj):
            var_name, field = match.groups()
            if var_name in saved:
                obj = obj.replace(match.group(), str(saved[var_name][field]))
        return obj
    return obj


def _assert_body(actual: dict, expected: dict, case_id: str):
    for key, val in expected.items():
        if key.endswith("_count"):
            real_key = key.replace("_count", "")
            assert real_key in actual, f'{case_id}: 响应中缺少字段 "{real_key}"'
            assert len(actual[real_key]) == val, f"{case_id}: {key} expected {val}, got {len(actual[real_key])}"
        elif "[" in key:
            parts = re.match(r"(\w+)\[(\d+)\]\.(\w+)", key)
            if parts:
                arr, idx, field = parts.group(1), int(parts.group(2)), parts.group(3)
                assert arr in actual, f'{case_id}: 响应中缺少字段 "{arr}"'
                assert len(actual[arr]) > idx, f"{case_id}: {arr} 长度不足，期望至少 {idx + 1} 项"
                assert actual[arr][idx][field] == val, f"{case_id}: {key} expected {val}, got {actual[arr][idx].get(field)}"
        else:
            assert key in actual, f'{case_id}: 响应中缺少字段 "{key}"'
            assert actual[key] == val, f"{case_id}: {key} expected {val}, got {actual.get(key)}"
