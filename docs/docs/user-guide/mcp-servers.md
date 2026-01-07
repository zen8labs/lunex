---
sidebar_position: 5
---

# MCP Servers

Model Context Protocol (MCP) is a protocol that allows Nexo to connect to external servers that provide additional tools and capabilities.

## What is MCP?

MCP enables Nexo to:

- Discover and use tools from external servers
- Execute custom functions and operations
- Access external data sources
- Extend functionality beyond built-in features

## Adding an MCP Server

1. Navigate to **Settings** → **MCP Servers**
2. Click **Add Server**
3. Fill in the server details:
   - **Name**: A descriptive name for this server
   - **Command**: The command to start the MCP server
   - **Arguments**: Command-line arguments (optional)
   - **Environment Variables**: Environment variables (JSON format)
4. Click **Test Connection** to verify the server works
5. Click **Save**

## MCP Server Configuration

### Command

The command to start the MCP server. This can be:

- A system command (e.g., `python`, `node`)
- A full path to an executable
- A script file

### Arguments

Command-line arguments passed to the server:

```
--port 8080 --verbose
```

### Environment Variables

Environment variables in JSON format:

```json
{
  "API_KEY": "your-api-key",
  "DATABASE_URL": "postgresql://localhost/db"
}
```

## Enabling/Disabling Servers

1. Navigate to **Settings** → **MCP Servers**
2. Toggle the **Enabled** switch for the server

Disabled servers won't be available in chats, but their configuration is preserved.

## Using MCP Tools

Once an MCP server is enabled, its tools become available in your chats:

1. Start a chat in a workspace
2. The AI can automatically discover and use tools from enabled MCP servers
3. Tool execution requires your permission (configurable in settings)

## Workspace-Specific MCP Configuration

Each workspace can have its own MCP server configuration:

1. Go to **Settings** → **Workspace Settings**
2. Scroll to **MCP Servers**
3. Enable or disable specific servers for this workspace
4. Configure tool permissions

## Tool Permissions

Control which tools can be executed:

1. Navigate to **Settings** → **MCP Servers**
2. Click **Tool Permissions**
3. Configure permissions for each tool:
   - **Allow**: Tool can be executed automatically
   - **Ask**: Prompt for permission before execution
   - **Deny**: Tool cannot be executed

## Example MCP Servers

### File System Server

Access local files and directories:

```json
{
  "command": "npx",
  "arguments": "-y @modelcontextprotocol/server-filesystem /path/to/allowed/directory"
}
```

### Database Server

Query databases:

```json
{
  "command": "python",
  "arguments": "-m mcp_server_database",
  "env": {
    "DATABASE_URL": "postgresql://localhost/mydb"
  }
}
```

## Troubleshooting

### Server Won't Start

- Verify the command path is correct
- Check that required dependencies are installed
- Review environment variables
- Check server logs in the console

### Tools Not Available

- Ensure the server is enabled
- Verify the server is running
- Check workspace-specific MCP configuration
- Review tool permissions

### Permission Errors

- Check file system permissions for file operations
- Verify API keys for external services
- Review environment variable configuration
