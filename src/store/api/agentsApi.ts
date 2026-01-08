import { baseApi } from './baseApi';
import { TauriCommands } from '@/bindings/commands';
import type { InstalledAgent } from '@/store/types';

export const agentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInstalledAgents: builder.query<InstalledAgent[], void>({
      query: () => ({
        command: TauriCommands.GET_INSTALLED_AGENTS,
      }),
      keepUnusedDataFor: 300, // Keep in cache for 5 minutes
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ manifest }) => ({
                type: 'Agent' as const,
                id: manifest.id,
              })),
              { type: 'Agent', id: 'LIST' },
            ]
          : [{ type: 'Agent', id: 'LIST' }],
    }),
  }),
});

export const { useGetInstalledAgentsQuery } = agentsApi;
