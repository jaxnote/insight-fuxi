---
name: /openspec-timeline
id: openspec-timeline
category: OpenSpec
description: 更新项目时间线与进度文档
---
<!-- OPENSPEC:START -->
**Guardrails**
- 保持 `openspec/timeline.md` 与实际变更状态同步
- 不要删除已有的里程碑定义，只更新状态
- 遵循现有的格式和状态图标约定

**Steps**
1. 运行 `openspec list` 获取所有活跃变更
2. 运行 `openspec list --specs` 获取已有能力规格
3. 检查 `openspec/changes/archive/` 目录获取已归档变更
4. 读取每个活跃变更的 `tasks.md` 判断完成进度：
   - 全部 `[x]` = 🟢 已完成（待归档）
   - 部分 `[x]` = 🟡 进行中
   - 全部 `[ ]` = 🔴 未开始
5. 更新 `openspec/timeline.md` 的以下部分：
   - **项目概览**: 更新统计数据
   - **变更记录**: 同步活跃变更和已归档变更表格
   - **里程碑**: 根据关联的变更状态更新里程碑状态
6. 更新 `最后更新` 日期为当前日期

**输出格式约定**
- 状态图标: 🟢 已完成, 🟡 进行中, 🔴 未开始/阻塞, ⏸️ 暂停
- 日期格式: YYYY-MM-DD
- Change ID 使用反引号包裹

**Reference**
- Timeline 文件位置: `openspec/timeline.md`
- 使用 `rg -l "tasks.md" openspec/changes/` 查找所有任务文件
- 使用 `ls openspec/changes/archive/` 查看已归档变更
<!-- OPENSPEC:END -->
