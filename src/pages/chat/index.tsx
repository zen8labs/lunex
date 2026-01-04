import { ChatSidebar } from '@/ui/ChatSidebar';
import { ChatArea } from '@/ui/chat-area/ChatArea';
import { useAppSelector } from '@/store/hooks';
import { cn } from '@/lib/utils';

export function ChatPage() {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.ui.isSidebarCollapsed
  );

  return (
    <div className="relative flex flex-1 overflow-hidden h-full">
      {/* Sidebar */}
      <div
        className={cn(
          'relative shrink-0 overflow-hidden transition-all duration-300 ease-in-out',
          isSidebarCollapsed ? 'w-0' : 'w-64'
        )}
      >
        <div
          className={cn(
            'h-full transition-opacity duration-300 ease-in-out',
            isSidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
          )}
        >
          <ChatSidebar />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
        <ChatArea />
      </div>

      {/* Sidebar Toggle Button - Floating or persistent */}
      {/* Note: In AppLayout this was in TitleBar, but if we want it here we can add it or rely on TitleBar. 
          The plan is to have TitleBar outside of pages. 
          So TitleBar will handle the sidebar toggle? 
          Wait, AppLayout had TitleBar with leftContent containing the toggle button.
          The TitleBar should remain global in AppLayout. 
          So ChatPage should only contain the content below TitleBar.
       */}
    </div>
  );
}
