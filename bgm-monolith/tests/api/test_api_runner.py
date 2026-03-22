import pytest
from tests.case_loader import load_cases
from tests.api_case_runner import run_api_case

conv_cases = load_cases("api/nl-analysis/conversations.cases.yaml")
msg_cases = load_cases("api/nl-analysis/messages.cases.yaml")


@pytest.mark.parametrize("case", conv_cases + msg_cases, ids=lambda c: c["id"])
async def test_nl_analysis_api(client, case):
    await run_api_case(client, case)
