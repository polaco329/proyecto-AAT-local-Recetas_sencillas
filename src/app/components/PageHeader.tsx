import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="bg-green-700 text-white py-4 sm:py-6 px-4 shadow-lg">
      <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-3 py-2 rounded-lg transition-colors shrink-0"
          aria-label="Volver al inicio"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Inicio</span>
        </button>
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl break-words">{title}</h1>
          <p className="text-green-200 text-sm mt-1">{subtitle}</p>
        </div>
      </div>
    </header>
  );
}
