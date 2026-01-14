import { Menu } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useIsMobile } from '../ui/use-mobile';

export function MobileMenuButton() {
  const toggleSidebar = useStore((state) => state.toggleSidebar);
  const sidebarOpen = useStore((state) => state.sidebarOpen);
  const isMobile = useIsMobile();

  if (!isMobile || sidebarOpen) return null;

  return (
    <div className="fixed left-0 top-0 z-50 w-full pointer-events-none">
      <button
        onClick={toggleSidebar}
        className="pointer-events-auto absolute left-6 top-6 p-2.5 rounded-xl bg-white/95 backdrop-blur-sm border border-slate-200/80 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-white hover:border-slate-300 active:scale-95"
        aria-label="Abrir menu"
      >
        <Menu className="size-7 text-slate-700" />
      </button>
    </div>
  );
}