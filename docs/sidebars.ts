import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'User Guide',
      items: [
        'user-guide/getting-started',
        'user-guide/installation',
        'user-guide/workspaces',
        'user-guide/llm-connections',
        'user-guide/mcp-servers',
        'user-guide/features',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/overview',
        'architecture/technology-stack',
        'architecture/layered-architecture',
        'architecture/frontend-architecture',
        'architecture/backend-architecture',
        'architecture/data-flow',
        'architecture/state-management',
      ],
    },
    {
      type: 'category',
      label: 'Development',
      items: [
        'development/setup',
        'development/workflow',
        'development/code-organization',
        'development/adding-commands',
        'development/adding-events',
        'development/database',
        'development/testing',
        'development/debugging',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: ['api/commands', 'api/events', 'api/models'],
    },
    {
      type: 'category',
      label: 'Components',
      items: [
        'components/overview',
        'components/atoms',
        'components/molecules',
        'components/organisms',
      ],
    },
  ],
};

export default sidebars;
