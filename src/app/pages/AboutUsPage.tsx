import { useNavigate } from 'react-router';
import { ArrowLeft, Heart, Target, Star } from 'lucide-react';
import { PageFooter } from '../components/PageFooter';
import { PageSEO } from '../components/PageSEO';
import { CONTACT_EMAIL, FOUNDED_YEAR, LOCATION, SITE_OWNER } from '../data/site';

const values = [
  {
    id: 1,
    icon: '🌿',
    title: 'Accesibilidad',
    description: 'Creemos que comer bien no debe ser un privilegio. Todas las recetas están diseñadas para ser económicas y con ingredientes fáciles de conseguir.',
  },
  {
    id: 2,
    icon: '❤️',
    title: 'Amor por la cocina',
    description: 'Cada receta que publico ha sido preparada, probada y perfeccionada con amor en una cocina real.',
  },
  {
    id: 3,
    icon: '🌍',
    title: 'Sostenibilidad',
    description: 'Promuevo el uso de ingredientes de temporada, locales y de productores salteños, reduciendo el impacto ambiental de nuestra alimentación.',
  },
  {
    id: 4,
    icon: '👨‍👩‍👧‍👦',
    title: 'Familia primero',
    description: 'Todo lo que creo está pensado para compartirse en la mesa familiar. La cocina es el corazón del hogar.',
  },
];

const milestones = [
  { year: FOUNDED_YEAR, event: 'Lanzamiento de Recetas Sencillas como portal remoto de recetas' },
  { year: FOUNDED_YEAR, event: 'Publicación de las primeras recetas organizadas por categorías' },
  { year: FOUNDED_YEAR, event: 'Inicio del blog, tips de cocina y sección de recetas económicas' },
];

export function AboutUsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-green-50">
      <PageSEO
        title="Quiénes Somos - Recetas Sencillas | Cocina fácil y económica"
        description="Conoce al creador de Recetas Sencillas: recetas fáciles, económicas y nutritivas desde Salta. Nuestra misión es hacer la cocina accesible para toda la familia."
        path="/quienes-somos"
      />
      <header className="bg-green-700 text-white py-6 px-4 shadow-lg">
        <div className="container mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Inicio</span>
          </button>
          <div>
            <h1 className="text-3xl">Quiénes Somos</h1>
            <p className="text-green-200 text-sm mt-1">Conoce al creador de Recetas Sencillas</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-5xl">
        <section className="mb-12">
          <h2 className="text-2xl text-green-800 mb-6 border-b-2 border-green-300 pb-2 flex items-center gap-2">
            <Target className="w-6 h-6" />
            Nuestra Misión
          </h2>

          <div className="bg-white rounded-xl shadow-md p-8">
            <p className="text-gray-700 leading-relaxed mb-4 text-lg">
              En <strong>Recetas Sencillas</strong> creo que cocinar debe ser una experiencia placentera,
              accesible y nutritiva para todos. Este portal gastronómico remoto de {LOCATION} nació en {FOUNDED_YEAR}
              con la misión de llevar recetas fáciles, económicas y deliciosas a cada hogar.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Sé que el ritmo de vida moderno hace difícil cocinar saludablemente. Por eso
              me enfoco en recetas que se pueden preparar en poco tiempo, con ingredientes
              que encuentras en cualquier tienda o mercado, y con costos razonables.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Recién este año me dedico con entusiasmo a la cocina, aprendiendo y compartiendo
              <br />
              cada receta que pruebo en casa.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl text-green-800 mb-6 border-b-2 border-green-300 pb-2">
            Sobre mí
          </h2>

          <article className="bg-white rounded-xl shadow-md p-8 flex gap-5">
            <div className="text-5xl shrink-0">👨‍🍳</div>
            <div>
              <h3 className="text-green-800 mb-1">{SITE_OWNER}</h3>
              <h4 className="text-green-600 text-sm mb-3">Creador de Recetas Sencillas</h4>
              <p className="text-gray-600 leading-relaxed mb-3">
                Soy de {LOCATION} y en {FOUNDED_YEAR} comencé a dedicarme a la cocina casera.
                <br />
                Este sitio es mi forma de compartir lo que voy aprendiendo con recetas sencillas y accesibles.
              </p>
              <p className="text-gray-600 text-sm">
                Contacto: <a href={`mailto:${CONTACT_EMAIL}`} className="text-green-700 hover:underline">{CONTACT_EMAIL}</a>
              </p>
            </div>
          </article>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl text-green-800 mb-6 border-b-2 border-green-300 pb-2 flex items-center gap-2">
            <Heart className="w-6 h-6" />
            Mis Valores
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value) => (
              <article key={value.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="text-4xl mb-3">{value.icon}</div>
                <h3 className="text-green-700 mb-2">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{value.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl text-green-800 mb-6 border-b-2 border-green-300 pb-2 flex items-center gap-2">
            <Star className="w-6 h-6" />
            Nuestra Historia
          </h2>

          <div className="bg-white rounded-xl shadow-md p-6">
            {milestones.map((m, idx) => (
              <div key={`${m.year}-${idx}`} className="flex gap-4 mb-6 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="bg-green-600 text-white w-16 h-8 rounded-full flex items-center justify-center text-xs shrink-0">
                    {m.year}
                  </div>
                  {idx < milestones.length - 1 && (
                    <div className="w-0.5 bg-green-200 flex-1 mt-2" style={{ minHeight: '20px' }} />
                  )}
                </div>
                <p className="text-gray-700 pt-1 text-sm leading-relaxed">{m.event}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl text-green-800 mb-6 border-b-2 border-green-300 pb-2">
            Recetas Sencillas en Números
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { number: '+18', label: 'Recetas publicadas' },
              { number: '6', label: 'Categorías disponibles' },
              { number: '1', label: 'Proyecto personal remoto' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-5 text-center">
                <div className="text-3xl text-green-700 mb-1">{stat.number}</div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="bg-green-700 text-white rounded-xl p-8 text-center">
          <h3 className="text-white mb-3">¿Quieres explorar las recetas?</h3>
          <p className="text-green-100 mb-4">
            Descubre platos sencillos de la cocina salteña y comparte tu experiencia al cocinarlos.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-white text-green-700 px-8 py-3 rounded-lg hover:bg-green-50 transition-colors"
          >
            Explorar Recetas
          </button>
        </div>
      </main>

      <PageFooter currentPage="/quienes-somos" />
    </div>
  );
}
