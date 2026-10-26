import { useNavigate } from 'react-router';
import { Mail } from 'lucide-react';
import { PageFooter } from '../components/PageFooter';
import { PageHeader } from '../components/PageHeader';
import { PageSEO } from '../components/PageSEO';
import { CONTACT_EMAIL, FOUNDED_YEAR, LOCATION, SITE_OWNER } from '../data/site';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function CVPage() {
  const navigate = useNavigate();

  const interests = [
    'Recetas caseras salteñas',
    'Cocina económica para el día a día',
    'Postres y meriendas sencillas',
    'Organización básica en la cocina',
  ];

  return (
    <div className="min-h-screen bg-green-50">
      <PageSEO
        title="CV Chef | Francisco S. Sfiligoy Borkoski"
        description="Conoce al creador de Recetas Sencillas: cocinero casero de Salta, Argentina. Perfil, intereses culinarios y contacto profesional."
        path="/cv"
      />
      <PageHeader
        title="Currículum Vitae"
        subtitle="Perfil del creador de Recetas Sencillas"
      />

      <main className="container mx-auto px-4 py-8 sm:py-10 max-w-4xl">
        <section className="bg-white rounded-xl shadow-md p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&q=80"
              alt="Francisco S. Sfiligoy Borkoski - Chef creador de Recetas Sencillas en Salta, Argentina"
              loading="lazy"
              width={112}
              height={112}
              className="w-28 h-28 rounded-full object-cover shrink-0 mx-auto md:mx-0"
            />
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-green-800 mb-1">{SITE_OWNER}</h2>
              <p className="text-green-600 mb-3">Cocinero casero · Creador de Recetas Sencillas</p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Recién en {FOUNDED_YEAR} empecé a dedicarme a la comida y a compartir recetas sencillas en este portal remoto.
                Todavía no tengo experiencia profesional en cocina, pero aprendo cada día probando platos accesibles
                y pensados para la mesa familiar.
              </p>
              <address className="not-italic text-sm text-gray-600">
                <span className="flex items-center justify-center md:justify-start gap-2">
                  <Mail className="w-4 h-4 text-green-600" aria-hidden="true" />
                  <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-green-700 break-all">
                    {CONTACT_EMAIL}
                  </a>
                </span>
                <p className="mt-2">{LOCATION} · Proyecto remoto</p>
              </address>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl text-green-800 mb-6 border-b-2 border-green-300 pb-2">
            Experiencia laboral en cocina
          </h2>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-600 leading-relaxed">
              Por ahora no cuento con experiencia laboral en cocina profesional.
              Mi recorrido comenzó este año con la creación de Recetas Sencillas y la práctica constante en casa.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl text-green-800 mb-6 border-b-2 border-green-300 pb-2">
            Intereses culinarios
          </h2>
          <div className="bg-white rounded-xl shadow-md p-6">
            <ul className="space-y-2">
              {interests.map((item) => (
                <li key={item} className="flex items-start gap-2 text-gray-600 text-sm">
                  <span className="text-green-500 mt-1" aria-hidden="true">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl text-green-800 mb-6 border-b-2 border-green-300 pb-2">
            Formación en cocina casera
          </h2>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-600 leading-relaxed">
              Autodidacta en cocina casera desde {FOUNDED_YEAR}.
              Aprendo mediante práctica, lectura de recetas tradicionales y experimentación en mi cocina.
            </p>
          </div>
        </section>

        <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
          <p className="text-gray-600 text-sm">
            ¿Quieres escribirme?
            Envíame un correo a <strong>{CONTACT_EMAIL}</strong>
          </p>
        </div>
      </main>

      <PageFooter currentPage="/cv" />
    </div>
  );
}
