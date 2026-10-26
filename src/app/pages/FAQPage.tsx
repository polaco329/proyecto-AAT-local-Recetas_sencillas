import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { PageFooter } from '../components/PageFooter';
import { PageHeader } from '../components/PageHeader';
import { PageSEO } from '../components/PageSEO';
import { CONTACT_EMAIL, FOUNDED_YEAR, LOCATION, SITE_OWNER } from '../data/site';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    id: 1,
    category: 'Sobre el sitio',
    question: '¿Qué es Recetas Sencillas?',
    answer:
      `Recetas Sencillas es un portal gastronómico remoto de ${LOCATION} creado por ${SITE_OWNER}. Ofrece recetas accesibles, económicas y nutritivas organizadas en 6 categorías: postres, carnes, vegano, rápido, desayuno y merienda. También incluye curso en línea, blog y tips de cocina.`,
  },
  {
    id: 2,
    category: 'Sobre el sitio',
    question: '¿Las recetas son gratuitas?',
    answer:
      'Sí, todas las recetas del sitio son completamente gratuitas. Puedes acceder a ellas sin crear una cuenta. Para guardar tus recetas favoritas, usa la función de "Recetas guardadas".',
  },
  {
    id: 3,
    category: 'Sobre el sitio',
    question: '¿Con qué frecuencia se publican nuevas recetas?',
    answer:
      `Publico nuevas recetas y artículos de forma regular desde ${FOUNDED_YEAR}. El sitio es un proyecto personal que voy ampliando a medida que pruebo y documento recetas en casa.`,
  },
  {
    id: 4,
    category: 'Recetas',
    question: '¿Qué son las "Recetas económicas"?',
    answer:
      'Las recetas económicas son aquellas cuyo costo de ingredientes es menor a $5.000 pesos argentinos por porción. Están diseñadas para que cualquier familia pueda comer bien sin gastar demasiado.',
  },
  {
    id: 5,
    category: 'Recetas',
    question: '¿Las recetas para niños son seguras?',
    answer:
      'Las recetas de la sección "Recetas para niños" están pensadas para cocinar en familia. Evitan ingredientes peligrosos para niños, como mariscos crudos, frutos secos enteros o exceso de azúcar o picante.',
  },
  {
    id: 6,
    category: 'Recetas',
    question: '¿Puedo guardar mis recetas favoritas?',
    answer:
      'Sí. En cada receta encontrarás un botón para guardarla. Las recetas guardadas aparecerán en la sección "Recetas guardadas" del menú durante tu sesión actual.',
  },
  {
    id: 7,
    category: 'Curso',
    question: '¿El curso en línea tiene certificado?',
    answer:
      'El curso es material educativo complementario del sitio. Por ahora no emite certificados oficiales.',
  },
  {
    id: 8,
    category: 'Curso',
    question: '¿Cuánto tiempo se tarda en completar el curso?',
    answer:
      'El curso está pensado para avanzar a tu propio ritmo. Puedes dedicarle el tiempo que prefieras según tu disponibilidad.',
  },
  {
    id: 9,
    category: 'Contacto',
    question: '¿Cómo puedo contactarte?',
    answer:
      `Puedes escribirme a ${CONTACT_EMAIL}. Recetas Sencillas es un proyecto remoto, sin atención presencial ni por teléfono.`,
  },
];

export function FAQPage() {
  const [expandedId, setExpandedId] = useState<number | null>(1);

  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  return (
    <div className="min-h-screen bg-green-50">
      <PageSEO
        title="Preguntas Frecuentes | Recetas Sencillas"
        description="Respuestas a las dudas más comunes sobre Recetas Sencillas: recetas gratuitas, económicas, curso de cocina, recetas para niños y contacto."
        path="/faq"
      />
      <PageHeader
        title="Preguntas Frecuentes"
        subtitle="Respuestas a las dudas más comunes sobre recetas sencillas"
      />

      <main className="container mx-auto px-4 py-8 sm:py-10 max-w-3xl">
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl text-green-800 mb-4 border-b-2 border-green-300 pb-2 flex items-center gap-2">
            <HelpCircle className="w-6 h-6" aria-hidden="true" />
            ¿En qué puedo ayudarte?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Aquí encontrarás respuestas a las preguntas más comunes sobre Recetas Sencillas.
            Si no encuentras lo que buscas, escríbeme a <strong>{CONTACT_EMAIL}</strong>
          </p>
        </section>

        {categories.map((category) => (
          <section key={category} className="mb-8">
            <h3 className="text-green-700 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true" />
              {category}
            </h3>

            <div className="space-y-3">
              {faqs
                .filter((f) => f.category === category)
                .map((faq) => (
                  <article key={faq.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <button
                      onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-green-50 transition-colors gap-3"
                      aria-expanded={expandedId === faq.id}
                    >
                      <h4 className="text-gray-800 pr-2 text-sm sm:text-base">{faq.question}</h4>
                      {expandedId === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-green-600 shrink-0" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-green-600 shrink-0" aria-hidden="true" />
                      )}
                    </button>

                    {expandedId === faq.id && (
                      <div className="px-4 sm:px-5 pb-5">
                        <hr className="border-gray-100 mb-4" />
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{faq.answer}</p>
                      </div>
                    )}
                  </article>
                ))}
            </div>
          </section>
        ))}

      </main>

      <PageFooter currentPage="/faq" />
    </div>
  );
}
