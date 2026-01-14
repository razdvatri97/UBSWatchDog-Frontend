import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

export function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorStatus = 500;
  let errorMessage = 'Erro Interno do Servidor';
  let errorDescription = 'Ocorreu um erro inesperado. Por favor, tente novamente.';

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;

    switch (error.status) {
      case 401:
        errorMessage = 'Não Autorizado';
        errorDescription = 'Você não tem permissão para acessar este recurso.';
        break;
      case 403:
        errorMessage = 'Acesso Negado';
        errorDescription = 'Você não tem permissão para realizar esta ação.';
        break;
      case 404:
        errorMessage = 'Página Não Encontrada';
        errorDescription = 'A página que você está procurando não existe.';
        break;
      default:
        errorMessage = error.statusText || errorMessage;
        errorDescription = error.data?.message || errorDescription;
    }
  } else if (error instanceof Error) {
    errorMessage = 'Erro';
    errorDescription = error.message;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertTriangle className="size-16 text-[#e60028]" />
          </div>
        </div>

        <h1 className="text-6xl font-bold text-[#333333] mb-4">{errorStatus}</h1>
        <h2 className="text-2xl font-semibold text-[#333333] mb-4">{errorMessage}</h2>
        <p className="text-[#666666] mb-8">{errorDescription}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 text-[#333333] rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="size-5" />
            Voltar
          </button>
          <button
            onClick={() => navigate('/home')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#e60028] hover:bg-[#cc0022] text-white rounded-lg transition-colors"
          >
            <Home className="size-5" />
            Ir para Home
          </button>
        </div>

        <div className="mt-8 p-4 bg-[#f5f5f5] rounded-lg">
          <p className="text-xs text-[#666666]">
            Se o problema persistir, entre em contato com o suporte técnico.
          </p>
        </div>
      </div>
    </div>
  );
}
