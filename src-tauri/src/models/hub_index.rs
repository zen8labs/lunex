use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HubIndex {
    pub version: String,
    pub last_updated: String,
    pub hub_name: String,
    pub resources: HubResources,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HubResources {
    pub prompts: Vec<HubPrompt>,
    #[serde(default)]
    pub mcp_servers: Vec<HubMCPServer>,
    #[serde(default)]
    pub agents: Vec<HubAgent>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HubPrompt {
    pub id: String,
    pub name: String,
    pub description: String,
    pub icon: String,
    pub path: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HubMCPServer {
    pub id: String,
    pub name: String,
    pub description: String,
    pub icon: String,
    pub r#type: String, // "stdio" | "sse"
    pub config: HubMCPServerConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HubMCPServerConfig {
    pub command: Option<String>,
    pub args: Option<Vec<String>>,
    pub env: Option<serde_json::Value>, // HashMap<String, String>
    pub url: Option<String>,
    pub headers: Option<serde_json::Value>, // HashMap<String, String>
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HubAgent {
    pub id: String,
    pub name: String,
    pub version: String,
    pub author: String,
    pub description: String,
    pub icon: String,
    pub category: String,
    pub entry_point: String,
    pub git_install: HubGitInstall,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HubGitInstall {
    pub repository_url: String,
    pub revision: String,
    pub subpath: String,
}
