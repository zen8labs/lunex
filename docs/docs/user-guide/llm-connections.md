---
sidebar_position: 4
---

# LLM Connections

Nexo supports multiple Large Language Model (LLM) providers. You can connect to different providers and switch between them seamlessly.

## Supported Providers

Nexo supports the following LLM providers:

- **OpenAI**: GPT-4, GPT-3.5, and other OpenAI models
- **Anthropic**: Claude 3.5 Sonnet, Claude 3 Opus, and other Claude models
- **Google**: Gemini Pro and other Google models
- **Ollama**: Local models running via Ollama
- **Custom**: Any OpenAI-compatible API endpoint

## Adding a Connection

1. Navigate to **Settings** → **LLM Connections**
2. Click **Add Connection**
3. Fill in the connection details:
   - **Name**: A descriptive name for this connection
   - **Provider**: Select the provider type
   - **API Key**: Your API key for the provider
   - **Base URL**: The API endpoint (usually auto-filled)
   - **Custom Headers**: Optional custom headers (JSON format)
4. Click **Test Connection** to verify the connection works
5. Click **Save** to add the connection

## Testing a Connection

Before saving a connection, always test it:

1. Fill in the connection details
2. Click **Test Connection**
3. Wait for the test result:
   - **Success**: Connection is working
   - **Error**: Check your API key and endpoint

## Editing a Connection

1. Navigate to **Settings** → **LLM Connections**
2. Click the **Edit** icon next to the connection
3. Modify the connection details
4. Click **Test Connection** to verify changes
5. Click **Save**

## Setting Default Connection

Set a default connection for new workspaces:

1. Navigate to **Settings** → **LLM Connections**
2. Click the **Star** icon next to the connection you want as default

The default connection will be used for new workspaces unless overridden.

## Using Custom Endpoints

For custom or self-hosted LLM providers:

1. Select **Custom** as the provider type
2. Enter your **Base URL** (e.g., `https://api.example.com/v1`)
3. Ensure your endpoint is OpenAI-compatible
4. Add any required **Custom Headers**:
   ```json
   {
     "Authorization": "Bearer your-token",
     "X-Custom-Header": "value"
   }
   ```

## Connection Security

- **API Keys**: Stored locally in SQLite database
- **No Cloud Storage**: All credentials remain on your device
- **Encryption**: Consider encrypting your database for additional security

## Troubleshooting

### Connection Test Fails

- Verify your API key is correct
- Check that the base URL is correct
- Ensure your internet connection is working
- For custom endpoints, verify OpenAI-compatibility

### Rate Limits

If you encounter rate limit errors:

- Check your API provider's rate limits
- Consider upgrading your API plan
- Reduce the frequency of requests

### Authentication Errors

- Verify your API key hasn't expired
- Check if your API key has the required permissions
- For custom headers, ensure the format is correct JSON
