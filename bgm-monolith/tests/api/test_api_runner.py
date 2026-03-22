import pytest
from tests.case_loader import load_cases
from tests.api_case_runner import run_api_case

conv_cases = load_cases("api/nl-analysis/conversations.cases.yaml")
msg_cases = load_cases("api/nl-analysis/messages.cases.yaml")
proj_cases = load_cases("api/projects/projects.cases.yaml")
file_cases = load_cases("api/projects/files.cases.yaml")

all_cases = conv_cases + msg_cases + proj_cases + file_cases


@pytest.mark.parametrize("case", all_cases, ids=lambda c: c["id"])
async def test_nl_analysis_api(client, case):
    await run_api_case(client, case)
