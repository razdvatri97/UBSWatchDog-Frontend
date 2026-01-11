import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  AlertTriangle,
  FileText,
  LogOut,
  Shield,
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export function Sidebar() {
  const location = useLocation();
  const logout = useStore((state) => state.logout);

  const menuItems = [
    { path: '/home', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/clients', label: 'Clientes', icon: Users },
    { path: '/transactions', label: 'Transações', icon: ArrowLeftRight },
    { path: '/alerts', label: 'Alertas', icon: AlertTriangle },
    { path: '/reports', label: 'Relatórios', icon: FileText },
  ];

  return (
    <div className="w-64 bg-[#1a1a1a] text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-3">
          <Shield className="size-8 text-[#e60028]" />
          <div>
            <h1 className="font-bold text-lg">UBS Watchdog</h1>
            <p className="text-xs text-slate-400">Sistema de Monitoramento & Compliance.</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
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
      </nav>

      <div className="p-4 border-t border-[#2a2a2a]">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-slate-300 hover:bg-[#2a2a2a] hover:text-white transition-colors"
        >
          <LogOut className="size-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}
