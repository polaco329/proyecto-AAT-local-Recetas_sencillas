import { useNavigate } from 'react-router';
import { BookOpen, CheckCircle, Clock, Users } from 'lucide-react';
import { PageFooter } from '../components/PageFooter';
import { PageHeader } from '../components/PageHeader';
import { PageSEO } from '../components/PageSEO';

const courseModules = [
  {
    id: 1,
    title: 'Módulo 1: Fundamentos de la Cocina',
    subtopics: [
      {
        title: '1.1 Herramientas básicas de cocina',
        details: [
          'Tipos de cuchillos y su uso correcto',
          'Tablas de corte: materiales y mantenimiento',
          'Ollas, sartenes y utensilios esenciales',
          'Medidores y balanzas de cocina',
        ],
      },
      {
        title: '1.2 Técnicas de corte',
        details: [
          'Juliana, brunoise, chiffonade y otras técnicas',
          'Seguridad con el cuchillo',
          'Cómo afilar un cuchillo correctamente',
          'Práctica: corte de vegetales básicos',
        ],
      },
      {
        title: '1.3 Organización en la cocina (Mise en place)',
        details: [
          'Qué es el mise en place y por qué importa',
          'Planificación antes de cocinar',
          'Organización del espacio de trabajo',
          'Práctica: preparar ingredientes antes de cocinar',
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Módulo 2: Técnicas de Cocción',
    subtopics: [
      {
        title: '2.1 Calor húmedo',
        details: [
          'Hervido y pochado',
          'Vapor: técnicas y utensilios',
          'Guisos y estofados',
          'Diferencias entre cada técnica y cuándo usarlas',
        ],
      },
      {
        title: '2.2 Calor seco',
        details: [
          'Salteado y sofrito',
          'Horneado y asado al horno',
          'Dorado y sellado de carnes',
          'Fritura: tipos y temperatura del aceite',
        ],
      },
      {
        title: '2.3 Control de temperatura',
        details: [
          'Termómetros de cocina',
          'Temperaturas seguras para carnes',
          'Cocción perfecta de diferentes alimentos',
          'Práctica: punto de cocción en carnes y vegetales',
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Módulo 3: Ingredientes y Sabores',
    subtopics: [
      {
        title: '3.1 Las 5 sensaciones del gusto',
        details: [
          'Dulce, salado, ácido, amargo y umami',
          'Cómo equilibrar sabores',
          'Especias y hierbas aromáticas',
          'Caldo base: el secreto de muchos platillos',
        ],
      },
      {
        title: '3.2 Ingredientes de temporada',
        details: [
          'Importancia de los productos de temporada',
          'Cómo elegir frutas y verduras en su punto',
          'Conservación correcta de alimentos frescos',
          'Sustituciones inteligentes en la cocina',
        ],
      },
    ],
  },
  {
    id: 4,
    title: 'Módulo 4: Recetas Prácticas',
    subtopics: [
      {
        title: '4.1 Desayunos nutritivos',
        details: [
          'Avena cremosa con frutas',
          'Huevos de distintas formas: revueltos, poché, fritos',
          'Tostadas con aguacate y variaciones',
          'Batidos saludables y nutritivos',
        ],
      },
      {
        title: '4.2 Almuerzos rápidos y económicos',
        details: [
          'Arroz básico y variaciones',
          'Sopas y cremas de vegetales',
          'Pasta en 20 minutos',
          'Ensaladas completas y nutritivas',
        ],
      },
      {
        title: '4.3 Postres sencillos',
        details: [
          'Natilla sin horno',
          'Galletas caseras básicas',
          'Brownies de chocolate fáciles',
          'Frutas al horno con miel y canela',
        ],
      },
    ],
  },
];

const recipeCode = `// Receta básica: Pasta con salsa de tomate
ingredientes = {
  pasta: "200g",
  tomates: "3 unidades",
  ajo: "2 dientes",
  aceite: "2 cucharadas",
  sal: "al gusto",
  albahaca: "fresca"
}

pasos = [
  "1. Hervir agua con sal",
  "2. Cocinar pasta 8 minutos",
  "3. Sofreír ajo en aceite",
  "4. Agregar tomates picados",
  "5. Sazonar y servir"
]`;

export function CoursePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-green-50">
      <PageSEO
        title="Curso de Cocina en Línea | Aprende desde cero"
        description="Curso de cocina en línea gratuito: fundamentos, técnicas de cocción, ingredientes y recetas prácticas. Aprende a cocinar recetas sencillas a tu ritmo."
        path="/curso"
      />
      <PageHeader
        title="Curso de Cocina en Línea"
        subtitle="Aprende a cocinar recetas sencillas desde cero, a tu ritmo"
      />

      <main className="container mx-auto px-4 py-8 sm:py-10 max-w-5xl">
        {/* Course Overview */}
        <section className="mb-12">
          <h2 className="text-2xl text-green-800 mb-6 border-b-2 border-green-300 pb-2">
            Descripción del Curso
          </h2>

          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              Bienvenido al <strong>Curso de Cocina en Línea de Recetas Sencillas</strong>. Este programa está
              diseñado para enseñarte desde los fundamentos básicos hasta técnicas intermedias de cocina.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              No necesitas experiencia previa. Solo necesitas ganas de aprender, los ingredientes correctos,
              y seguir cada módulo con atención. Al finalizar el curso serás capaz de preparar recetas
              variadas, nutritivas y deliciosas.
            </p>
            <p className="text-gray-600 text-sm italic">
              Duración estimada: 8 semanas · Nivel: Principiante a Intermedio · Modalidad: 100% en línea
            </p>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <BookOpen className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <h3 className="text-green-800">4 Módulos</h3>
                <p className="text-gray-500 text-sm">Contenido estructurado</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <h3 className="text-green-800">+40 Horas</h3>
                <p className="text-gray-500 text-sm">De contenido práctico</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <h3 className="text-green-800">Comunidad</h3>
                <p className="text-gray-500 text-sm">Aprende con otros</p>
              </div>
            </div>
          </div>
        </section>

        {/* Study Guide */}
        <section className="mb-12">
          <h2 className="text-2xl text-green-800 mb-6 border-b-2 border-green-300 pb-2">
            Guía de Estudio Completa
          </h2>

          {courseModules.map((module) => (
            <article key={module.id} className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-green-700 mb-4 flex items-center gap-2">
                <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0">
                  {module.id}
                </span>
                {module.title}
              </h3>

              {module.subtopics.map((sub, idx) => (
                <div key={idx} className="mb-6 pl-4 border-l-4 border-green-200">
                  <h4 className="text-gray-800 mb-3">{sub.title}</h4>
                  <ul className="space-y-2">
                    {sub.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2 text-gray-600 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </article>
          ))}
        </section>

        {/* Code Example with pre */}
        <section className="mb-12">
          <h2 className="text-2xl text-green-800 mb-6 border-b-2 border-green-300 pb-2">
            Ejemplo Práctico: Estructura de una Receta
          </h2>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-800 mb-3">Cómo organizar una receta paso a paso:</h3>
            <p className="text-gray-600 mb-4">
              A continuación verás cómo estructurar mentalmente una receta antes de cocinar.
              Piensa en ingredientes primero, luego en los pasos:
            </p>
            <pre className="bg-gray-900 text-green-300 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed">
              {recipeCode}
            </pre>
            <p className="text-gray-500 text-sm mt-3 italic">
              Organizar los ingredientes y pasos antes de empezar es la clave del éxito en la cocina.
            </p>
          </div>
        </section>

        {/* Enrollment CTA */}
        <section className="bg-green-700 text-white rounded-xl p-8 text-center mb-12">
          <h2 className="text-white mb-3">¿Listo para empezar?</h2>
          <p className="text-green-100 mb-6 text-lg">
            Únete a cientos de estudiantes que ya están cocinando mejor gracias a este curso.
            <br />
            Inscríbete hoy y recibe acceso inmediato al Módulo 1 de forma gratuita.
          </p>
          <button
            onClick={() => navigate('/supplier-contact')}
            className="bg-white text-green-700 px-8 py-3 rounded-lg hover:bg-green-50 transition-colors"
          >
            Inscribirme Ahora
          </button>
        </section>
      </main>

      <PageFooter currentPage="/curso" />
    </div>
  );
}
