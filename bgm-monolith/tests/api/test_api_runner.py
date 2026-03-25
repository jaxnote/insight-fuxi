import pytest
from tests.case_loader import load_cases
from tests.api_case_runner import run_api_case

conv_cases = load_cases("api/nl-analysis/conversations.cases.yaml")
msg_cases = load_cases("api/nl-analysis/messages.cases.yaml")
proj_cases = load_cases("api/projects/projects.cases.yaml")
file_cases = load_cases("api/projects/files.cases.yaml")

all_cases = conv_cases + msg_cases + proj_cases + file_cases


def _case_id(c: dict) -> str:
    """ID + tags → pytest -k 可同时按 ID 或 tag 过滤。
    Example: API-CONV-001[crud,smoke,regression]
    """
    tags = ",".join(c.get("tags", []))
    return f"{c['id']}[{tags}]" if tags else c["id"]


@pytest.mark.parametrize("case", all_cases, ids=_case_id)
async def test_nl_analysis_api(client, case):
    await run_api_case(client, case)
