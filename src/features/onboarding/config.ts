import { TourSteps } from './types';

export const ONBOARDING_STEPS: TourSteps = {
  welcomeFlow: [
    {
      target: 'body',
      content:
        'Chào mừng bạn đến với Nexo! Hãy cùng điểm qua vài bước thiết lập cơ bản để bắt đầu sử dụng AI Agent mạnh mẽ này nhé.',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="settings-nav"]',
      content:
        'Đây là nơi bạn quản lý các cài đặt, bao gồm việc kết nối API Key cho các mô hình AI.',
    },
    {
      target: '[data-tour="new-chat-btn"]',
      content: 'Bấm vào đây để bắt đầu một cuộc hội thoại mới với Agent.',
    },
  ],
  agentActionFlow: [],
  communityToolFlow: [],
};
