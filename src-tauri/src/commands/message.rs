use crate::error::AppError;
use crate::models::Message;
use crate::state::AppState;
use tauri::State;

#[tauri::command]
pub fn create_message(
    id: String,
    chat_id: String,
    role: String,
    content: String,
    timestamp: Option<i64>,
    reasoning: Option<String>,
    tool_calls: Option<String>,
    metadata: Option<String>,
    state: State<'_, AppState>,
) -> Result<Message, AppError> {
    state
        .message_service
        .create(
            id, chat_id, role, content, timestamp, reasoning, tool_calls, metadata,
        )
        .map_err(|e| AppError::Generic(e.to_string()))
}

#[tauri::command]
pub fn get_messages(chat_id: String, state: State<'_, AppState>) -> Result<Vec<Message>, AppError> {
    state
        .message_service
        .get_by_chat_id(&chat_id)
        .map_err(|e| AppError::Generic(e.to_string()))
}

#[tauri::command]
pub fn update_message(
    id: String,
    content: String,
    state: State<'_, AppState>,
) -> Result<(), AppError> {
    state
        .message_service
        .update(id, content, None, None)
        .map_err(|e| AppError::Generic(e.to_string()))
}

#[tauri::command]
pub fn delete_messages_after(
    chat_id: String,
    message_id: String,
    state: State<'_, AppState>,
) -> Result<(), AppError> {
    state
        .message_service
        .delete_messages_after(chat_id, message_id)
        .map_err(|e| AppError::Generic(e.to_string()))
}

#[tauri::command]
pub fn cancel_message(chat_id: String, state: State<'_, AppState>) -> Result<(), AppError> {
    // Send cancellation signal for the chat
    state
        .chat_service
        .cancel_message(&chat_id)
        .map_err(|e| AppError::Generic(e.to_string()))?;

    Ok(())
}
