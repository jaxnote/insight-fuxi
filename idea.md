

1、Claws AI架构

- CLAWS管理层：大管家与总调度室
- LLM Agents：执行具体任务的执行者
- LLM 基础模型：纯粹的推理引擎


2、Engineering工程

- Harness Engineering（2026）：关注“构建什么环境让 AI 工作，这个环境如何保证它的产出是可靠的”比 Context Engineering 更进一步，不仅管理输入给模型的信息，还包括模型之外的整个执行环境。
- Context Engineering（2025）：关注“给 AI 看什么信息”不再只盯措辞，而是设计整个信息环境：系统提示、对话历史、记忆、RAG 检索结果、工具调用输出。
- Prompt Engineering（2023-2024）：关注“怎么跟 AI 说话”精心设计一段提示词，希望模型给出理想输出。Prompt Engineering 是优化一次性的输入-输出对。局限很明显：一条消息能塞的信息有限，任务一复杂就失控。

source: [https://x.com/dotey/status/2027156511555027252](https://x.com/dotey/status/2027156511555027252)



3、IDE变化

- OrgCode（2026-Agent管理学，指挥室）：多Agent编排与协同，IDE从"代码编辑器"变为"Agent控制平面"。多角色协作模拟"产品+架构师+设计师+前端+后端+测试+运维"的团队流程，并行执行不同专业任务。当前IDE不适应，需要从面向文件Coding，变成面向Agent Coding。
- Agent IDE（2025-Agent执行，工作室）：Agent自主执行，AI从"辅助写代码"跨越到"自主完成任务"。核心能力是全库索引 + 工具调用（编译/测试/调试）+ 基于错误日志自我修正，运行在Plan-Act-Observe-Reflect循环中。
- LLM Copilot（2023-2024）：代码补全与行间建议，以插件形式嵌入已有IDE。只能看到当前打开的文件（"钥匙孔"视角），无法感知跨文件的代码关系，任务一复杂就失控。

source: [https://cursor.com/cn/blog/third-era](https://cursor.com/cn/blog/third-era)
