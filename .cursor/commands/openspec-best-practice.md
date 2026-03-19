---
name: /openspec-best-practice
id: openspec-best-practice
category: OpenSpec
description: 将当前经验教训添加到 best-practices 目录
---

**触发时机**
- 修复了一个值得记录的 Bug
- Code Review 发现了通用问题
- 实现了一个好的设计模式
- 踩了一个坑，想避免团队再次踩到

**Steps**
1. 分析当前对话上下文，提取值得记录的经验教训
2. 判断属于哪个类别：
   - 🔒 安全 → `security.md`
   - 🏗️ 架构 → `architecture.md`
   - ⚡ 性能 → `performance.md`
   - 🛠️ 工具 → `tooling.md`
   - 📝 规范 → `conventions.md`
3. 使用标准模板格式化内容：
   ```markdown
   ### [TAG] 简短标题

   **问题/场景**: 一句话描述

   **解决方案**: 具体做法

   \`\`\`typescript
   // 代码示例
   \`\`\`

   **相关文件**: `path/to/file.ts`
   ```
4. 追加到对应文件的合适位置
5. 更新该文件顶部的"最后更新"日期

**自动判断标签**
- Bug 修复 → `[BUG]`
- 性能问题 → `[PERF]`
- 安全问题 → `[SEC]`
- 架构决策 → `[ARCH]`
- 工具配置 → `[TOOL]`
- 编码规范 → `[CONV]`

**Reference**
- 目录位置: `openspec/best-practices/`
- 模板参考: `openspec/best-practices/README.md`
