# Agent Loop

一个灵活的 AI agent 系统，支持工具调用、技能扩展和 MCP 协议。

## 功能特性

- 🤖 **智能 Agent Loop** - 自动工具调用和任务执行
- 🔧 **内置工具** - 文件操作、命令执行等基础工具
- 🔌 **扩展工具** - 轻松添加自定义工具
- 🎯 **Skills 模块** - 支持技能扩展
- 🔗 **MCP 支持** - 兼容 MCP (Model Context Protocol) 协议
- 💡 **Vibe Coding** - 智能代码风格适配
- 🏗️ **Provider 模块** - 支持多个 LLM 服务商
- 💻 **CLI 接口** - 友好的命令行交互

## 安装

```bash
npm install
```

## 配置

复制 `.env.example` 为 `.env` 并配置你的 API 密钥：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
MODEL=gpt-4o
```

## 使用方法

### 启动交互式聊天

```bash
npm start chat
# 或
node bin/cli.js chat
```

### 使用初始提示启动

```bash
npm start chat -- -p "帮我创建一个 Node.js 项目"
```

### 启用 Vibe Coding 模式

```bash
npm start chat -- -v
```

### 运行单次任务

```bash
npm start run "列出当前目录的文件"
```

### 指定模型

```bash
npm start chat -- -m gpt-4-turbo
```

## 项目结构

```
agentloop/
├── bin/
│   └── cli.js              # CLI 入口
├── src/
│   ├── agent.js            # Agent Loop 核心逻辑
│   ├── index.js            # 主导出文件
│   ├── providers/          # LLM 服务商模块
│   │   ├── base.js         # 基础 Provider 类
│   │   ├── openai.js       # OpenAI Provider
│   │   └── index.js        # Provider 管理器
│   ├── tools/              # 工具模块
│   │   ├── base.js         # 基础 Tool 类
│   │   ├── file.js         # 文件操作工具
│   │   ├── command.js      # 命令执行工具
│   │   └── index.js        # Tool 管理器
│   ├── skills/             # 技能模块
│   │   ├── base.js         # 基础 Skill 类
│   │   └── index.js        # Skill 管理器
│   └── mcp/                # MCP 模块
│       └── index.js        # MCP 管理器
├── package.json
├── .env.example
└── README.md
```

## 架构设计

### 核心模块

#### 1. Agent Loop (`src/agent.js`)

Agent Loop 是系统的核心，负责：
- 管理对话历史
- 协调工具调用
- 处理用户输入和 AI 响应
- 维护系统状态

工作流程：
1. 接收用户消息
2. 调用 LLM 获取响应
3. 如果需要工具调用，执行工具
4. 将工具结果返回给 LLM
5. 重复直到任务完成

#### 2. Providers (`src/providers/`)

管理不同的 LLM 服务商：
- `BaseProvider` - 抽象基类
- `OpenAIProvider` - OpenAI 兼容接口实现
- `ProviderManager` - 服务商注册和管理

扩展新 Provider：
```javascript
import { BaseProvider } from './src/providers/base.js';

class MyProvider extends BaseProvider {
  async chat(messages, options) {
    // 实现调用逻辑
  }
}
```

#### 3. Tools (`src/tools/`)

工具系统允许 Agent 与外部世界交互：

内置工具：
- `read_file` - 读取文件
- `write_file` - 写入文件
- `list_directory` - 列出目录
- `delete_file` - 删除文件
- `file_exists` - 检查文件存在
- `exec_command` - 执行命令

创建自定义工具：
```javascript
import { BaseTool } from './src/tools/base.js';

class MyTool extends BaseTool {
  constructor() {
    super('my_tool', 'Description', {
      param1: { type: 'string', description: '...', required: true }
    });
  }

  async execute(args) {
    // 实现工具逻辑
    return { success: true, result: '...' };
  }
}

// 注册工具
agent.toolManager.registerTool(new MyTool());
```

#### 4. Skills (`src/skills/`)

技能是更高层次的能力组合：

```javascript
import { BaseSkill } from './src/skills/base.js';

class MySkill extends BaseSkill {
  constructor() {
    super('my_skill', 'Skill description');
  }

  async execute(context, args) {
    // 实现技能逻辑
  }
}
```

#### 5. MCP (`src/mcp/`)

支持 MCP 协议的工具集成：

```javascript
agent.mcpManager.registerServer('my_server', mcpServer);
```

#### 6. Vibe Coding

Vibe Coding 模式让 Agent 理解项目的代码风格和架构，生成更一致的代码。

启用方式：
```bash
npm start chat -- -v
```

## API 文档

### AgentLoop 类

```javascript
import { AgentLoop } from './src/index.js';

const agent = new AgentLoop({
  model: 'gpt-4o',
  vibeCoding: false
});

// 启动交互式聊天
await agent.start('Hello!');

// 运行单次任务
await agent.runTask('Create a file');
```

### ToolManager

```javascript
agent.toolManager.registerTool(new MyTool());
agent.toolManager.getTool('tool_name');
agent.toolManager.getAllTools();
await agent.toolManager.executeTool('tool_name', args);
```

## 示例

### 1. 基础使用

```bash
# 安装依赖
npm install

# 配置 .env
cp .env.example .env
# 编辑 .env 添加你的 API key

# 启动聊天
npm start chat
```

### 2. 作为库使用

```javascript
import { AgentLoop } from './src/index.js';

const agent = new AgentLoop();
await agent.runTask('分析当前目录并创建一个 README');
```

### 3. 扩展自定义工具

```javascript
import { AgentLoop, BaseTool } from './src/index.js';

class WeatherTool extends BaseTool {
  constructor() {
    super(
      'get_weather',
      'Get current weather for a city',
      {
        city: { type: 'string', description: 'City name', required: true }
      }
    );
  }

  async execute(args) {
    // 调用天气 API
    return { success: true, temperature: 25, city: args.city };
  }
}

const agent = new AgentLoop();
agent.toolManager.registerTool(new WeatherTool());
await agent.start();
```

## 开发

### 项目脚本

```bash
npm start          # 启动 CLI
npm run dev        # 开发模式（watch 模式）
```

### 代码规范

- 使用 ES Modules (`import`/`export`)
- 遵循现有代码风格
- 添加必要的注释

## 许可证

MIT
