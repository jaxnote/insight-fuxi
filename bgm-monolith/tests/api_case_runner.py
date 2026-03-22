import re
import yaml


async def run_api_case(client, case: dict):
    """通用 API 用例执行器：setup → input → assert expected。"""
    saved = {}
    # 执行 setup 步骤
    for step in case.get("setup", []):
        body = _resolve_vars(step.get("body"), saved)
        resp = await client.request(step["method"], step["path"], json=body)
        if "save_as" in step:
            saved[step["save_as"]] = resp.json()

    # 执行 input
    inp = case["input"]
    body = _resolve_vars(inp.get("body"), saved)
    resp = await client.request(inp["method"], inp["path"], json=body, params=inp.get("params"))

    # 断言 expected
    exp = case["expected"]
    assert resp.status_code == exp["status"], f'{case["id"]}: expected {exp["status"]}, got {resp.status_code}'
    if "body" in exp:
        _assert_body(resp.json(), exp["body"], case["id"])


def _resolve_vars(obj, saved: dict):
    """替换 ${conv_a.id} 等变量引用。"""
    if obj is None:
        return obj
    s = str(obj)
    for match in re.finditer(r"\$\{(\w+)\.(\w+)\}", s):
        var_name, field = match.groups()
        if var_name in saved:
            s = s.replace(match.group(), str(saved[var_name][field]))
    if isinstance(obj, dict):
        return yaml.safe_load(s)
    return s


def _assert_body(actual: dict, expected: dict, case_id: str):
    for key, val in expected.items():
        if key.endswith("_count"):
            real_key = key.replace("_count", "")
            assert len(actual[real_key]) == val, f"{case_id}: {key}"
        elif "[" in key:
            # items[0].title 格式
            parts = re.match(r"(\w+)\[(\d+)\]\.(\w+)", key)
            if parts:
                arr, idx, field = parts.group(1), int(parts.group(2)), parts.group(3)
                assert actual[arr][idx][field] == val, f"{case_id}: {key}"
        else:
            assert actual[key] == val, f"{case_id}: {key} expected {val}, got {actual.get(key)}"
