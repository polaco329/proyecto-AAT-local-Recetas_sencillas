import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Cake,
  Beef,
  Leaf,
  Zap,
  Coffee,
  Cookie,
  BookOpen,
  Rss,
  FileText,
  HelpCircle,
  Users,
  ChefHat,
  ChevronDown,
  ChevronUp,
  SunMedium,
  MoonStar,
} from 'lucide-react';
import { CategoryCard } from '../components/CategoryCard';
import { PastaPackage } from '../components/PastaPackage';
import { MenuDropdown } from '../components/MenuDropdown';
import { CONTACT_EMAIL, DEFAULT_DESCRIPTION, FOUNDED_YEAR, LOCATION, SITE_KEYWORD, SITE_NAME, SITE_OWNER } from '../data/site';
import { PageSEO } from '../components/PageSEO';
import { useAuth } from '../context/AuthContext';

const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    alt: 'Plato de ensalada fresca',
  },
  {
    src: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80',
    alt: 'Pastas caseras sobre mesa',
  },
  {
    src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    alt: 'Cocina con ingredientes listos',
  },
  {
    src: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1200&q=80',
    alt: 'Postre con frutas',
  },
];

const accordionSections = [
  {
    id: 1,
    title: 'Cómo empezar a cocinar en casa',
    content: 'Organiza tus ingredientes, prepara la receta paso a paso y mantén la limpieza del espacio para cocinar con más calma.',
  },
  {
    id: 2,
    title: 'Consejos para ahorrar tiempo',
    content: 'Haz listas de compra semanales, reutiliza ingredientes y elige recetas rápidas de una sola olla para comidas más sencillas.',
  },
  {
    id: 3,
    title: 'Recetas ideales para la familia',
    content: 'Busca opciones nutritivas, visualmente atractivas y fáciles de adaptar según la edad y los gustos de cada integrante.',
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [openSection, setOpenSection] = useState<number | null>(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [expandedImage, setExpandedImage] = useState(galleryImages[0]);
  const [formData, setFormData] = useState({
    name: '',
    message: '',
  });
  const [errors, setErrors] = useState<{ name?: string; message?: string }>({});
  const [formStatus, setFormStatus] = useState('');
  const [gmailUrl, setGmailUrl] = useState('');
  const [isLocalNavVisible, setIsLocalNavVisible] = useState(false);

  useEffect(() => {
    const navigation = document.getElementById('site-navigation-links');
    setIsLocalNavVisible(navigation !== null && !navigation.hidden);
  }, []);

  useEffect(() => {
    window.alert('¡Hola! Bienvenido a Recetas Sencillas.');
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const categories = [
    { id: 1, name: 'Postres', icon: Cake, color: 'bg-pink-100' },
    { id: 2, name: 'Carnes', icon: Beef, color: 'bg-red-100' },
    { id: 3, name: 'Vegano', icon: Leaf, color: 'bg-green-100' },
    { id: 4, name: 'Rápido', icon: Zap, color: 'bg-yellow-100' },
    { id: 5, name: 'Desayuno', icon: Coffee, color: 'bg-orange-100' },
    { id: 6, name: 'Merienda', icon: Cookie, color: 'bg-amber-100' },
  ];

  const extraPages = [
    { id: 1, label: 'Curso de Cocina', icon: BookOpen, path: '/curso', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700' },
    { id: 2, label: 'Blog', icon: Rss, path: '/blog', color: 'bg-purple-50 hover:bg-purple-100 text-purple-700' },
    { id: 3, label: 'CV Chef', icon: FileText, path: '/cv', color: 'bg-teal-50 hover:bg-teal-100 text-teal-700' },
    { id: 4, label: 'Preguntas Frecuentes', icon: HelpCircle, path: '/faq', color: 'bg-orange-50 hover:bg-orange-100 text-orange-700' },
    { id: 5, label: 'Quiénes Somos', icon: Users, path: '/quienes-somos', color: 'bg-pink-50 hover:bg-pink-100 text-pink-700' },
    ...(!isLocalNavVisible ? [
      { id: 6, label: 'Publicar receta', icon: BookOpen, path: '/publish-recipe', color: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700' },
    ] : []),
    ...(user?.role === 'admin' && !isLocalNavVisible
      ? [
        { id: 7, label: 'Administrar recetas', icon: ChefHat, path: '/admin/recetas', color: 'bg-green-100 hover:bg-green-200 text-green-800' },
        { id: 8, label: 'Administrar blogs', icon: BookOpen, path: '/blog#blog-admin-form', color: 'bg-purple-100 hover:bg-purple-200 text-purple-800' },
      ]
      : []),
  ];

  const validateField = (name: string, value: string) => {
    if (!value.trim()) {
      return 'Este campo es obligatorio.';
    }

    if (name === 'message' && value.trim().length > 2000) {
      return 'El mensaje no puede superar los 2000 caracteres.';
    }

    return '';
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
    setFormStatus('');
    setGmailUrl('');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = {
      name: validateField('name', formData.name),
      message: validateField('message', formData.message),
    };

    setErrors(nextErrors);
    setFormStatus('');

    const hasErrors = Object.values(nextErrors).some(Boolean);
    if (hasErrors) {
      return;
    }

    const subject = `Mensaje desde Recetas Sencillas de ${formData.name.trim()}`;
    const body = [
      `Nombre: ${formData.name.trim()}`,
      `Correo de la cuenta: ${user?.email ?? 'No disponible'}`,
      '',
      formData.message.trim(),
    ].join('\n');
    const gmailUrl = new URL('https://mail.google.com/mail/');
    gmailUrl.search = new URLSearchParams({
      view: 'cm',
      fs: '1',
      to: CONTACT_EMAIL,
      su: subject,
      body,
    }).toString();

    const composeUrl = gmailUrl.toString();
    window.open(composeUrl, '_blank', 'noopener,noreferrer');
    setGmailUrl(composeUrl);
    setFormStatus('Revisa el borrador y pulsa Enviar en Gmail para completar el envío.');
  };

  const handleNextImage = () => {
    const nextIndex = (selectedImage + 1) % galleryImages.length;
    setSelectedImage(nextIndex);
    setExpandedImage(galleryImages[nextIndex]);
  };

  const handlePreviousImage = () => {
    const previousIndex = (selectedImage - 1 + galleryImages.length) % galleryImages.length;
    setSelectedImage(previousIndex);
    setExpandedImage(galleryImages[previousIndex]);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-white' : 'bg-green-50 text-slate-800'}`}>
      <PageSEO
        title={`${SITE_NAME} | ${SITE_KEYWORD} fáciles y económicas`}
        description={DEFAULT_DESCRIPTION}
        path="/"
      />
      <header className={`grid w-full grid-cols-1 items-center gap-4 px-4 py-6 text-center sm:px-6 md:mx-auto md:max-w-6xl md:grid-cols-[1fr_auto_1fr] ${darkMode ? 'bg-slate-800' : 'bg-green-50'}`}>
        <div className="min-w-0 md:col-start-2">
          <h1 className={`text-3xl sm:text-4xl md:text-5xl ${darkMode ? 'text-emerald-300' : 'text-green-800'}`}>
            {SITE_KEYWORD} fáciles y económicas
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-emerald-200' : 'text-green-600'}`}>
            Cocina casera, nutritiva y deliciosa para toda la familia en {LOCATION}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 md:col-start-3 md:justify-self-end">
          <button
            type="button"
            onClick={() => setDarkMode((current) => !current)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 shadow-sm transition-colors ${darkMode ? 'bg-amber-400 text-slate-900' : 'bg-slate-200 text-slate-700'}`}
            aria-label="Cambiar tema"
          >
            {darkMode ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            {darkMode ? 'Modo claro' : 'Modo oscuro'}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">
        <section aria-label="Ilustración de bienvenida" className="flex flex-col items-center mb-12">
          <PastaPackage />
          <p className={`mt-6 text-center ${darkMode ? 'text-emerald-200' : 'text-green-700'}`}>
            Cómo aprender a cocinar:{' '}
            <a
              href="https://www.youtube.com/watch?v=gnkLCnBizqo"
              target="_blank"
              rel="noopener noreferrer"
              className={`underline ${darkMode ? 'text-emerald-100 hover:text-white' : 'text-green-800 hover:text-green-900'}`}
            >
              https://www.youtube.com/watch?v=gnkLCnBizqo
            </a>
          </p>
        </section>

        <section className="mb-12">
          <h2 className={`text-center text-2xl mb-8 ${darkMode ? 'text-emerald-300' : 'text-green-700'}`}>Explorar por categoría</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                name={category.name}
                icon={category.icon}
                color={category.color}
                onClick={() => navigate(`/category/${category.name}`)}
              />
            ))}
          </div>
        </section>

        <section className={`max-w-3xl mx-auto mb-12 rounded-xl shadow-md p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <h2 className={`mb-4 ${darkMode ? 'text-emerald-300' : 'text-green-800'}`}>Bienvenido a Recetas Sencillas</h2>
          <p className={`leading-relaxed mb-3 ${darkMode ? 'text-slate-200' : 'text-gray-700'}`}>
            Soy <strong>{SITE_OWNER}</strong> y este es un portal gastronómico remoto de {LOCATION},
            <br />
            fundado en {FOUNDED_YEAR} para compartir recetas fáciles, nutritivas y económicas.
          </p>
          <p className={`leading-relaxed mb-3 ${darkMode ? 'text-slate-200' : 'text-gray-700'}`}>
            Encuentra recetas para cada momento del día: desde un desayuno energético hasta
            <br />
            una merienda perfecta para los niños. Todas incluyen ingredientes, tiempo de preparación y costo aproximado.
          </p>
          <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
            Explora las categorías, guarda tus recetas favoritas
            <br />
            y vuelve cuando quieras cocinar algo nuevo.
          </p>
        </section>

        <section className="mb-12 max-w-4xl mx-auto">
          <h2 className={`text-center text-2xl mb-6 ${darkMode ? 'text-emerald-300' : 'text-green-700'}`}>Más en nuestro sitio</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {extraPages.map((page) => (
              <button
                key={page.id}
                onClick={() => {
                  if (page.path.endsWith('.php')) {
                    window.location.assign(`${window.APP_BASE_PATH || ''}${page.path}`);
                    return;
                  }
                  navigate(page.path);
                }}
                className={`${page.color} rounded-xl p-4 flex flex-col items-center gap-2 transition-colors shadow-sm`}
              >
                <page.icon className="w-7 h-7" />
                <span className="text-sm text-center leading-tight">{page.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto mb-12 grid gap-6 lg:grid-cols-2">
          <div className={`rounded-2xl p-6 shadow-md ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-emerald-300' : 'text-green-700'}`}>Fecha y hora</h3>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${darkMode ? 'bg-emerald-900 text-emerald-100' : 'bg-emerald-100 text-emerald-700'}`}>
                En vivo
              </span>
            </div>
            <p className={`text-lg mb-2 ${darkMode ? 'text-slate-100' : 'text-slate-700'}`}>
              {currentTime.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className={`text-3xl font-bold ${darkMode ? 'text-emerald-300' : 'text-green-700'}`}>
              {currentTime.toLocaleTimeString('es-ES')}
            </p>
          </div>

          <div className={`rounded-2xl p-6 shadow-md ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-emerald-300' : 'text-green-700'}`}>Menú interactivo</h3>
            <div className="space-y-3">
              {accordionSections.map((section) => {
                const isOpen = openSection === section.id;

                return (
                  <div key={section.id} className={`rounded-xl border ${darkMode ? 'border-slate-700 bg-slate-900' : 'border-green-100 bg-green-50'}`}>
                    <button
                      type="button"
                      onClick={() => setOpenSection(isOpen ? null : section.id)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left"
                    >
                      <span className={darkMode ? 'text-slate-100' : 'text-slate-700'}>{section.title}</span>
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    {isOpen && <p className={`px-4 pb-4 text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{section.content}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className={`max-w-5xl mx-auto mb-12 rounded-2xl p-6 shadow-md ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <h3 className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-emerald-300' : 'text-green-700'}`}>Galería de imágenes</h3>
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <div className="overflow-hidden rounded-xl border border-green-200">
              <img src={expandedImage.src} alt={expandedImage.alt} className="h-[300px] w-full object-cover" />
            </div>
            <div className="space-y-3">
              {galleryImages.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => {
                    setSelectedImage(index);
                    setExpandedImage(image);
                  }}
                  className={`overflow-hidden rounded-xl border-2 ${selectedImage === index ? 'border-emerald-500' : 'border-transparent'} w-full`}
                  aria-label={`Ver imagen ${index + 1}`}
                >
                  <img src={image.src} alt={image.alt} className="h-20 w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-4">
            <button type="button" onClick={handlePreviousImage} className="rounded-full bg-green-600 px-4 py-2 text-white hover:bg-green-700">Anterior</button>
            <button type="button" onClick={handleNextImage} className="rounded-full bg-green-600 px-4 py-2 text-white hover:bg-green-700">Siguiente</button>
          </div>
        </section>

        <section className={`max-w-3xl mx-auto mb-12 rounded-2xl p-6 shadow-md ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <h3 className={`text-2xl font-semibold mb-2 ${darkMode ? 'text-emerald-300' : 'text-green-700'}`}>Formulario de contacto</h3>
          <p className={`mb-5 text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
            Se abrirá Gmail dirigido a <strong>{CONTACT_EMAIL}</strong>. El correo de tu cuenta se incluirá en el mensaje: <strong>{user?.email}</strong>.
          </p>
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="name" className={`block mb-1 text-sm font-medium ${darkMode ? 'text-slate-200' : 'text-gray-700'}`}>
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                maxLength={120}
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full rounded-lg border px-3 py-2 outline-none ${darkMode ? 'border-slate-600 bg-slate-900 text-white' : 'border-gray-300 bg-white text-gray-900'} ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Escribe tu nombre"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="message" className={`block mb-1 text-sm font-medium ${darkMode ? 'text-slate-200' : 'text-gray-700'}`}>
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                maxLength={2000}
                className={`w-full rounded-lg border px-3 py-2 outline-none ${darkMode ? 'border-slate-600 bg-slate-900 text-white' : 'border-gray-300 bg-white text-gray-900'} ${errors.message ? 'border-red-500' : ''}`}
                placeholder="Cuéntanos cuál receta te gustaría probar"
              />
              {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
              <p className={`mt-1 text-right text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                {formData.message.length}/2000
              </p>
            </div>

            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-white hover:bg-emerald-700"
            >
              Enviar formulario
            </button>
          </form>

          {formStatus && (
            <div role="status" className={`mt-5 rounded-xl border p-4 text-sm ${darkMode ? 'border-emerald-700 bg-slate-900 text-emerald-200' : 'border-emerald-200 bg-emerald-50 text-green-800'}`}>
              <p>{formStatus}</p>
              {gmailUrl && (
                <a
                  href={gmailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block font-semibold underline underline-offset-2"
                >
                  Si Gmail no se abrió, haz clic aquí
                </a>
              )}
            </div>
          )}
        </section>

        <section className="max-w-3xl mx-auto mb-8">
          <h2 className={`text-green-700 mb-3 text-center ${darkMode ? 'text-emerald-300' : 'text-green-700'}`}>Tip de la semana: arroz perfecto</h2>
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-green-800'} rounded-xl p-5`}>
            <pre className={`text-sm whitespace-pre-wrap font-sans leading-relaxed ${darkMode ? 'text-emerald-100' : 'text-green-100'}`}>
{`Para que el arroz quede suelto y perfecto:

1. Lava el arroz en agua fría hasta que el agua salga transparente
2. Usa la proporción 1 taza de arroz : 2 tazas de agua
3. Agrega sal y una cucharada de aceite al agua
4. Cuando hierva, baja el fuego al mínimo y tapa
5. Cocina 18 minutos sin destapar

¡El resultado: arroz perfecto cada vez!`}
            </pre>
          </div>
        </section>
      </main>

    </div>
  );
}
