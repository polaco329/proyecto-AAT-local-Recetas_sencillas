import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Menu,
  Search,
  Bookmark,
  DollarSign,
  Lightbulb,
  Baby,
  BookOpen,
  Rss,
  FileText,
  HelpCircle,
  Users,
  Mail,
  UserRound,
  ChefHat,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function MenuDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const mainItems = [
    { id: 1, label: 'Contacto', icon: Mail, path: '/supplier-contact' },
    { id: 2, label: user ? 'Mi cuenta' : 'Iniciar sesión', icon: UserRound, path: user ? '/account' : '/login' },
    { id: 3, label: 'Búsqueda avanzada', icon: Search, path: '/advanced-search' },
    { id: 4, label: 'Recetas guardadas', icon: Bookmark, path: '/saved-recipes' },
    { id: 5, label: 'Recetas económicas', icon: DollarSign, path: '/economic-recipes' },
    { id: 6, label: 'Tips de cocina', icon: Lightbulb, path: '/cooking-tips' },
    { id: 7, label: 'Recetas para niños', icon: Baby, path: '/kids-recipes' },
    { id: 8, label: 'Publicar receta', icon: ChefHat, path: '/publish-recipe' },
  ];
  if (user?.role === 'admin') {
    mainItems.push({ id: 9, label: 'Administrar recetas', icon: ChefHat, path: '/admin/recetas' });
  }

  const extraItems = [
    { id: 7, label: 'Curso de Cocina', icon: BookOpen, path: '/curso' },
    { id: 8, label: 'Blog', icon: Rss, path: '/blog' },
    { id: 9, label: 'CV Chef', icon: FileText, path: '/cv' },
    { id: 10, label: 'Preguntas Frecuentes', icon: HelpCircle, path: '/faq' },
    { id: 11, label: 'Quiénes Somos', icon: Users, path: '/quienes-somos' },
  ];

  const handleMenuClick = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="main-navigation-menu"
        aria-haspopup="menu"
        aria-label={isOpen ? 'Cerrar menú principal' : 'Abrir menú principal'}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg transition-colors duration-200"
      >
        <Menu className="w-5 h-5" />
        <span className="font-medium">Menú</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          <div
            id="main-navigation-menu"
            role="menu"
            className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-2xl z-20 overflow-hidden border border-gray-200"
          >
            {mainItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.path)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors duration-150 text-left border-b border-gray-100"
              >
                <item.icon className="w-5 h-5 text-green-600" />
                <span className="text-gray-700 font-medium">{item.label}</span>
              </button>
            ))}

            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Más páginas</p>
            </div>

            {extraItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors duration-150 text-left ${
                  idx < extraItems.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <item.icon className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700 font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
