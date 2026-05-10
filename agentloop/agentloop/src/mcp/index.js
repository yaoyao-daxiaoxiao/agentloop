export class MCPManager {
  constructor() {
    this.servers = new Map();
  }

  registerServer(name, server) {
    this.servers.set(name, server);
  }

  getServer(name) {
    return this.servers.get(name);
  }

  getAllServers() {
    return Array.from(this.servers.entries());
  }

  async callTool(serverName, toolName, args) {
    const server = this.servers.get(serverName);
    if (!server) {
      return { success: false, error: `MCP server ${serverName} not found` };
    }
    return await server.callTool(toolName, args);
  }

  getTools() {
    const tools = [];
    for (const [name, server] of this.servers) {
      tools.push(...server.getTools().map(t => ({ ...t, server: name })));
    }
    return tools;
  }
}
