# Nexo Business Documentation

**Last Updated:** 2025-01-27  
**Version:** 0.1.0-alpha.14

## Executive Summary

Nexo is a cross-platform desktop AI assistant that provides users with a powerful, privacy-focused interface for interacting with multiple Large Language Model (LLM) providers. Unlike cloud-based AI assistants, Nexo operates on a local-first architecture, giving users complete control over their data and conversations.

### Value Proposition

**For Users:**

- **Freedom**: Use any LLM provider with your own API keys - no vendor lock-in
- **Privacy**: All conversations stored locally - no data sent to third parties
- **Flexibility**: Organize work into workspaces with custom settings per workspace
- **Extensibility**: Connect to MCP servers for unlimited tool possibilities
- **Cost-Effective**: Pay only for LLM API usage - no subscription fees

**For Developers:**

- **Open Source**: MIT License - full control and customization
- **Extensible**: MCP protocol support + Python/Node runtime
- **Modern Stack**: React + Rust + Tauri for performance and reliability

## Target Users

### Primary User Personas

1. **Power Users / Developers**
   - Need multiple LLM providers for different use cases
   - Want to integrate custom tools via MCP
   - Require workspace organization for different projects
   - Value privacy and data control

2. **Content Creators / Writers**
   - Need consistent AI personality per project (workspace)
   - Want to save and reuse custom prompts
   - Require markdown rendering with code execution
   - Value offline capability

3. **Researchers / Analysts**
   - Need to organize conversations by topic (workspaces)
   - Want to track usage and costs
   - Require advanced features like thinking mode
   - Value data privacy for sensitive research

4. **General Users**
   - Want a simple, clean AI assistant interface
   - Need basic chat functionality
   - Value ease of use and setup
   - Prefer local-first for privacy

## Core Features

### 1. Multi-LLM Support

**Description:** Connect to multiple LLM providers simultaneously and switch between them seamlessly.

**Key Capabilities:**

- Support for OpenAI, Anthropic, Google, Ollama, and other providers
- Multiple connection configurations
- Connection testing before saving
- Custom headers and API endpoints
- Model selection per workspace

**Business Value:**

- No vendor lock-in
- Cost optimization (use cheaper models when appropriate)
- Flexibility to use best model for each task
- Future-proof (add new providers easily)

**User Flow:**

1. Navigate to Settings → LLM Connections
2. Click "Add Connection"
3. Select provider type
4. Enter API key and base URL
5. Test connection
6. Save connection
7. Select as default for workspace (optional)

### 2. Workspace Management

**Description:** Organize conversations into separate workspaces, each with its own settings and chat history.

**Key Capabilities:**

- Create multiple workspaces
- Workspace-specific system prompts
- Workspace-specific LLM model selection
- Workspace-specific MCP tool configuration
- Isolated chat history per workspace
- Workspace deletion with cascade to chats

**Business Value:**

- Organization for different projects/contexts
- Separation of concerns (personal vs. work)
- Custom AI personality per workspace
- Better data organization

**User Flow:**

1. Launch app → Welcome screen
2. Create first workspace (or use default)
3. Name workspace (e.g., "Personal", "Coding", "Writing")
4. Configure workspace settings:
   - Select default LLM connection
   - Set system prompt
   - Enable/disable MCP tools
   - Configure tool permissions
5. Start chatting in workspace context

### 3. Advanced Chat Features

**Description:** Rich chat interface with markdown rendering, code execution, and advanced AI features.

**Key Capabilities:**

- Markdown rendering with syntax highlighting
- LaTeX and mathematical notation (KaTeX)
- Mermaid diagram support
- Code execution (Python, JavaScript)
- Thinking mode (for reasoning models)
- Message editing and resending
- Chat search
- Export conversations

**Business Value:**

- Professional document creation
- Technical documentation support
- Code collaboration
- Enhanced productivity

**User Flow:**

1. Select workspace
2. Create new chat or select existing
3. Type message in chat input
4. Send message (Enter or click Send)
5. View streaming response in real-time
6. Interact with rendered content:
   - View formatted markdown
   - Execute code blocks
   - View diagrams
   - Copy code snippets
7. Edit and resend messages if needed
8. Search chat history

### 4. MCP (Model Context Protocol) Integration

**Description:** Connect to MCP servers to extend AI capabilities with custom tools.

**Key Capabilities:**

- Connect to MCP servers (SSE, stdio, HTTP-streamable)
- Automatic tool discovery
- Tool permission management
- Per-workspace tool configuration
- Tool execution in chat context

**Business Value:**

- Unlimited extensibility
- Integration with external services
- Custom workflows
- Enhanced AI capabilities

**User Flow:**

1. Navigate to Settings → MCP Servers
2. Click "Add MCP Server"
3. Enter connection details:
   - Name
   - URL or command
   - Transport type
   - Headers (if needed)
   - Runtime path (for stdio)
4. Connect and discover tools
5. Enable tools in workspace settings
6. Configure tool permissions (ask/allow/deny)
7. Use tools in chat (AI automatically calls when needed)

### 5. Custom Prompt Management

**Description:** Create, save, and reuse custom prompt templates.

**Key Capabilities:**

- Create prompt templates
- Edit and update prompts
- Delete prompts
- Use prompts in system messages

**Business Value:**

- Consistency across conversations
- Time savings
- Standardization
- Reusability

**User Flow:**

1. Navigate to Settings → Prompts
2. Click "Create Prompt"
3. Enter prompt name and content
4. Save prompt
5. Use in workspace system prompt (copy/paste or reference)

### 6. Usage Tracking

**Description:** Track token usage and costs per message and workspace.

**Key Capabilities:**

- Token count tracking (input, output, total)
- Cost estimation
- Latency tracking
- Per-workspace statistics
- Per-model statistics
- Export usage data

**Business Value:**

- Cost management
- Usage optimization
- Budget planning
- Performance monitoring

**User Flow:**

1. Navigate to Settings → Usage
2. View usage statistics:
   - Total tokens used
   - Total cost
   - Usage by workspace
   - Usage by model
   - Usage over time
3. Export data (if needed)

### 7. Privacy & Security

**Description:** Local-first architecture with complete data control.

**Key Capabilities:**

- All data stored locally in SQLite
- No cloud synchronization
- No telemetry or data collection
- API keys stored encrypted locally
- User controls all data

**Business Value:**

- Complete privacy
- Data sovereignty
- Compliance (GDPR, etc.)
- Security for sensitive information

## User Journeys

### Journey 1: First-Time User Setup

**Goal:** Get started with Nexo and send first message

**Steps:**

1. **Launch Application**
   - User downloads and installs Nexo
   - Opens application
   - Sees welcome screen

2. **Create Workspace**
   - Clicks "Get Started" on welcome screen
   - Creates first workspace (or uses default)
   - Names workspace (e.g., "Personal")

3. **Configure LLM Connection**
   - Navigates to Settings → LLM Connections
   - Clicks "Add Connection"
   - Selects provider (e.g., OpenAI)
   - Enters API key
   - Tests connection
   - Saves connection

4. **Start First Chat**
   - Returns to chat interface
   - Types first message
   - Receives AI response
   - Successfully completes setup

**Success Criteria:**

- User can create workspace
- User can configure LLM connection
- User can send and receive messages
- User understands basic interface

### Journey 2: Power User - Multi-Workspace Setup

**Goal:** Set up multiple workspaces for different projects with custom configurations

**Steps:**

1. **Create Multiple Workspaces**
   - Creates "Coding" workspace
   - Creates "Writing" workspace
   - Creates "Research" workspace

2. **Configure Each Workspace**
   - **Coding Workspace:**
     - Sets system prompt: "You are a senior software engineer..."
     - Selects coding-focused LLM model
     - Enables code execution tools
   - **Writing Workspace:**
     - Sets system prompt: "You are a professional writer..."
     - Selects writing-focused model
     - Enables writing assistance tools
   - **Research Workspace:**
     - Sets system prompt: "You are a research assistant..."
     - Enables research tools via MCP

3. **Use Workspaces**
   - Switches between workspaces as needed
   - Each workspace maintains separate chat history
   - Each workspace uses appropriate AI personality

**Success Criteria:**

- User can create and manage multiple workspaces
- Each workspace has distinct configuration
- User can switch between workspaces seamlessly
- Chat history is properly isolated

### Journey 3: Developer - MCP Integration

**Goal:** Connect MCP server and use custom tools in chat

**Steps:**

1. **Set Up MCP Server**
   - Has MCP server running (local or remote)
   - Knows connection details (URL, type, headers)

2. **Configure MCP Connection**
   - Navigates to Settings → MCP Servers
   - Adds new MCP server connection
   - Enters connection details
   - Connects and discovers tools

3. **Enable Tools in Workspace**
   - Navigates to workspace settings
   - Enables specific MCP tools
   - Configures tool permissions

4. **Use Tools in Chat**
   - Asks AI to perform task requiring tool
   - AI automatically calls appropriate tool
   - User approves tool execution (if permission required)
   - Tool executes and returns result
   - AI continues conversation with tool results

**Success Criteria:**

- User can connect to MCP server
- Tools are discovered and available
- Tools can be enabled per workspace
- Tools execute correctly in chat context

### Journey 4: Content Creator - Custom Prompts

**Goal:** Create and use custom prompt templates for consistent AI behavior

**Steps:**

1. **Create Prompt Template**
   - Navigates to Settings → Prompts
   - Creates new prompt: "Technical Blog Writer"
   - Writes detailed prompt content
   - Saves prompt

2. **Use Prompt in Workspace**
   - Opens workspace settings
   - Copies prompt to system message field
   - Saves workspace settings

3. **Use in Chat**
   - Starts new chat in workspace
   - AI uses custom prompt as system message
   - Gets consistent behavior across conversations

**Success Criteria:**

- User can create and save prompts
- Prompts can be used in workspace settings
- AI behavior matches prompt description
- Prompts are reusable across workspaces

## Feature Matrix

| Feature              | Basic User | Power User     | Developer      | Enterprise     |
| -------------------- | ---------- | -------------- | -------------- | -------------- |
| Multi-LLM Support    | ✅         | ✅             | ✅             | ✅             |
| Workspace Management | ✅ (1-2)   | ✅ (Unlimited) | ✅ (Unlimited) | ✅ (Unlimited) |
| MCP Integration      | ❌         | ✅             | ✅             | ✅             |
| Custom Prompts       | ✅         | ✅             | ✅             | ✅             |
| Code Execution       | ✅         | ✅             | ✅             | ✅             |
| Usage Tracking       | ✅         | ✅             | ✅             | ✅             |
| Export Conversations | ✅         | ✅             | ✅             | ✅             |
| Advanced Settings    | ❌         | ✅             | ✅             | ✅             |

## Competitive Advantages

### vs. ChatGPT Desktop

- ✅ Multi-LLM support (vs. OpenAI only)
- ✅ MCP integration (vs. no integration)
- ✅ Open source (vs. proprietary)
- ✅ Local-first (vs. cloud-based)
- ✅ Workspace management (vs. basic)
- ✅ Cost-effective (vs. subscription)

### vs. Claude Desktop

- ✅ Multi-LLM support (vs. Anthropic only)
- ✅ Open source (vs. proprietary)
- ✅ Local-first (vs. cloud-based)
- ✅ Python/Node runtime (vs. no runtime)
- ✅ Cost-effective (vs. subscription)

### vs. Cursor

- ✅ Open source (vs. proprietary)
- ✅ Local-first (vs. cloud-based)
- ✅ Cost-effective (vs. subscription)
- ✅ General-purpose (vs. code-focused)

## Business Metrics

### Key Performance Indicators (KPIs)

1. **User Engagement**
   - Daily Active Users (DAU)
   - Messages sent per user
   - Workspaces created per user
   - Average session duration

2. **Feature Adoption**
   - % users with multiple LLM connections
   - % users using MCP servers
   - % users creating custom prompts
   - % users using multiple workspaces

3. **User Satisfaction**
   - User retention rate
   - Feature request frequency
   - Issue/bug report rate
   - Community engagement (GitHub stars, discussions)

4. **Technical Metrics**
   - Application startup time
   - Message response latency
   - Error rate
   - Crash rate

## Roadmap Considerations

### Near-Term Enhancements

- Workflow automation
- Data connector integrations
- Enhanced export formats
- Improved search functionality

### Long-Term Vision

- Cloud sync (optional)
- Team collaboration features
- Plugin marketplace
- Mobile companion app

## Support & Documentation

### User Resources

- **Documentation:** Comprehensive guides and tutorials
- **GitHub Issues:** Bug reports and feature requests
- **GitHub Discussions:** Community support and Q&A
- **Website:** Product information and updates

### Developer Resources

- **API Documentation:** Technical architecture docs
- **Contributing Guide:** How to contribute
- **Development Guide:** Setup and development workflow
- **Architecture Docs:** System design and patterns

---

_Documentation generated by BMAD Method Business Analyst workflow_
