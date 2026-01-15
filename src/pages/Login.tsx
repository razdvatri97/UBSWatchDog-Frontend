import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Lock, User, LoaderCircle } from 'lucide-react';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useStore((state) => state.login);
  const fetchAllData = useStore((state) => state.fetchAllData);
  const navigate = useNavigate();



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const success = await login(username, password);
      if (success) {
        await fetchAllData();
        navigate('/home');
      } else {
        setError('Credenciais inválidas. Login sem consulta ao backend: admin / admin');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-center mb-6">
            <img src="/assets/UBS_Logo.png" alt="UBS Watchdog Logo" style={{ height: '50px' }} />  
          </div>

          <h1 className="text-3xl font-bold text-center text-[#333333] mb-2">UBS Watchdog</h1>
          <p className="text-center text-[#666666] mb-8">
            Sistema de Monitoramento de Transações & Compliance.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Usuário</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e60028] focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                  placeholder="Digite seu usuário"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e60028] focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                  placeholder="Digite sua senha"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-md"
              style={{
                backgroundColor: isLoading ? '#ff6b6b' : '#e60028',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.8 : 1,
              }}
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="size-5 animate-spin" />
                  <span>Conectando...</span>
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-[#f5f5f5] rounded-lg">
            <p className="text-xs text-[#666666] text-center">Desenvolvido por: Grupo 3</p>
          </div>
        </div>

        <p className="text-center text-slate-300 text-sm mt-6">© 2026 UBS Watchdog.</p>
      </div>
    </div>
  );
}
