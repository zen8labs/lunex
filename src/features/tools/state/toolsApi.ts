import { baseApi } from '@/app/api/baseApi';
import { TauriCommands } from '@/bindings/commands';

export interface UnifiedToolInfo {
  name: string;
  serverName: string;
  description?: string;
}

export const toolsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveToolsForWorkspace: builder.query<UnifiedToolInfo[], string>({
      query: (workspaceId) => ({
        command: TauriCommands.GET_ACTIVE_TOOLS_FOR_WORKSPACE,
        args: { workspaceId },
      }),
      providesTags: (result, _error, workspaceId) =>
        result
          ? [
              ...result.map(({ name }) => ({
                type: 'WorkspaceActiveTool' as const,
                id: `${workspaceId}-${name}`,
              })),
              { type: 'WorkspaceActiveTool', id: workspaceId },
            ]
          : [{ type: 'WorkspaceActiveTool', id: workspaceId }],
    }),
  }),
});

export const { useGetActiveToolsForWorkspaceQuery } = toolsApi;
