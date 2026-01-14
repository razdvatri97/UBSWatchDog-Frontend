import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  AlertTriangle,
  FileText,
  LogOut,
  X,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useIsMobile } from '../ui/use-mobile';

export function Sidebar() {
  const location = useLocation();
  const logout = useStore((state) => state.logout);
  const sidebarOpen = useStore((state) => state.sidebarOpen);
  const setSidebarOpen = useStore((state) => state.setSidebarOpen);
  const isMobile = useIsMobile();

  const menuItems = [
    { path: '/home', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/clients', label: 'Clientes', icon: Users },
    { path: '/transactions', label: 'Transações', icon: ArrowLeftRight },
    { path: '/alerts', label: 'Alertas', icon: AlertTriangle },
    { path: '/reports', label: 'Relatórios', icon: FileText },
  ];

  const isVisible = !isMobile || sidebarOpen;

  if (!isVisible) return null;

  return (
    <>
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`bg-[#1a1a1a] text-white flex flex-col ${
          isMobile
            ? `fixed left-0 top-0 w-64 z-50 transition-transform duration-300 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`
            : 'w-64'
        }`}
        style={isMobile ? { height: '100vh' } : {}}
      >
        <div className="p-6 border-b border-[#2a2a2a] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/UBS_Logo_branco_minimal.png" alt="UBS Watchdog Logo" style={{ height: '35px' }} />
            <div>
              <h1 className="font-bold text-lg">UBS Watchdog</h1>
              <p className="text-xs text-slate-400">Compliance System</p>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="size-6" />
            </button>
          )}
        </div>

        <nav className="flex-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => isMobile && setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  isActive
                    ? 'bg-[#e60028] text-white'
                    : 'text-slate-300 hover:bg-[#2a2a2a] hover:text-white'
                }`}
              >
                <Icon className="size-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="mt-6 pt-4 border-t border-[#2a2a2a]">
            <button
              onClick={() => {
                logout();
                if (isMobile) setSidebarOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-slate-300 hover:bg-[#2a2a2a] hover:text-white transition-colors"
            >
              <LogOut className="size-5" />
              <span>Sair</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}