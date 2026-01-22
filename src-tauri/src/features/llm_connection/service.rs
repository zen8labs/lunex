use super::models::LLMConnection;
use super::repository::LLMConnectionRepository;
use crate::error::AppError;
use std::sync::Arc;

pub struct LLMConnectionService {
    repository: Arc<dyn LLMConnectionRepository>,
}

impl LLMConnectionService {
    pub fn new(repository: Arc<dyn LLMConnectionRepository>) -> Self {
        Self { repository }
    }

    #[allow(clippy::too_many_arguments)]
    pub fn create(
        &self,
        id: String,
        name: String,
        base_url: String,
        provider: String,
        api_key: String,
        models_json: Option<String>,
        default_model: Option<String>,
    ) -> Result<LLMConnection, AppError> {
        let now = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_millis() as i64;

        let connection = LLMConnection {
            id,
            name,
            base_url,
            provider,
            api_key,
            models_json,
            default_model,
            enabled: true, // New connections are enabled by default
            created_at: now,
            updated_at: now,
        };

        self.repository.create(&connection)?;
        Ok(connection)
    }

    pub fn get_all(&self) -> Result<Vec<LLMConnection>, AppError> {
        self.repository.get_all()
    }

    pub fn get_by_id(&self, id: &str) -> Result<Option<LLMConnection>, AppError> {
        self.repository.get_by_id(id)
    }

    #[allow(clippy::too_many_arguments)]
    pub fn update(
        &self,
        id: String,
        name: Option<String>,
        base_url: Option<String>,
        provider: Option<String>,
        api_key: Option<String>,
        models_json: Option<String>,
        default_model: Option<String>,
        enabled: Option<bool>,
    ) -> Result<(), AppError> {
        self.repository.update(
            &id,
            name.as_deref(),
            base_url.as_deref(),
            provider.as_deref(),
            api_key.as_deref(),
            models_json.as_deref(),
            default_model.as_deref(),
            enabled,
        )
    }

    pub fn delete(&self, id: String) -> Result<(), AppError> {
        self.repository.delete(&id)
    }
}
