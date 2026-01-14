import { useStore } from '../../store/useStore';
import { User } from 'lucide-react';
import { useIsMobile } from '../ui/use-mobile';

export function Header() {
  const user = useStore((state) => state.user);
  const isMobile = useIsMobile();

  return (
    <header className="bg-white border-b border-slate-200 px-8 md:px-8 py-4">
      <div className={`flex ${isMobile ? 'flex-col gap-4' : 'justify-between items-center'}`}>
        <div className={`flex ${isMobile ? 'flex-col gap-2' : 'items-center gap-4'}`}>
          <div>
            <h2 className="text-xl font-semibold text-[#333333]">
              UBS Watchdog: Monitoramento de Transações & Compliance
            </h2>
            <p className="text-sm text-[#666666]">
              Detecção de atividades suspeitas e gestão de riscos
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-3 bg-[#f5f5f5] px-4 py-2 rounded-lg border border-slate-200 ${isMobile ? 'self-center' : ''}`}>
          <User className="size-5 text-[#666666]" />
          <div>
            <p className="text-sm font-medium text-[#333333]">{user?.name}</p>
            <p className="text-xs text-[#666666]">{user?.username}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
