import { useNavigate } from 'react-router';
import { Lightbulb, ChefHat } from 'lucide-react';
import { PageFooter } from '../components/PageFooter';
import { PageHeader } from '../components/PageHeader';
import { PageSEO } from '../components/PageSEO';

const cookingTips = [
  { id: 1, title: 'Sal al final', description: 'Agrega sal al final de la cocción para evitar que los vegetales se pongan duros y para controlar mejor el sabor final del platillo.', category: 'Técnicas básicas' },
  { id: 2, title: 'Organiza tu mise en place', description: 'Antes de empezar a cocinar, prepara y organiza todos tus ingredientes. Esto te ahorrará tiempo y evitará errores.', category: 'Organización' },
  { id: 3, title: 'Cuchillos afilados', description: 'Un cuchillo afilado es más seguro que uno desafilado. Invierte en un buen afilador y mantén tus cuchillos en óptimas condiciones.', category: 'Herramientas' },
  { id: 4, title: 'Temperatura ambiente', description: 'Saca las carnes del refrigerador 30 minutos antes de cocinarlas. Esto ayuda a que se cocinen de manera más uniforme.', category: 'Carnes' },
  { id: 5, title: 'No sobrecargues la sartén', description: 'Al saltear, asegúrate de no llenar demasiado la sartén. El exceso de alimentos genera vapor en lugar de dorar.', category: 'Técnicas básicas' },
  { id: 6, title: 'Prueba mientras cocinas', description: 'Siempre prueba tu comida durante la cocción. Es la mejor manera de ajustar sabores y evitar sorpresas al servir.', category: 'Sabor' },
  { id: 7, title: 'Calienta bien la sartén', description: 'Una sartén bien caliente antes de agregar los ingredientes evita que se peguen y ayuda a crear mejores texturas.', category: 'Técnicas básicas' },
  { id: 8, title: 'Lee la receta completa', description: 'Antes de empezar, lee toda la receta para entender los pasos y el tiempo necesario. Evitarás sorpresas durante la preparación.', category: 'Organización' },
  { id: 9, title: 'Agrega ácido para balance', description: 'Un toque de limón, vinagre o vino puede equilibrar sabores y hacer que tus platillos brillen.', category: 'Sabor' },
  { id: 10, title: 'Deja reposar las carnes', description: 'Después de cocinar carnes, déjalas reposar 5-10 minutos antes de cortar. Esto redistribuye los jugos y las hace más jugosas.', category: 'Carnes' },
  { id: 11, title: 'Hornea con horno precalentado', description: 'Siempre precalienta el horno antes de hornear. La temperatura correcta desde el inicio es crucial para buenos resultados.', category: 'Horneado' },
  { id: 12, title: 'Usa sal gruesa para pasta', description: 'El agua de la pasta debe ser "salada como el mar". Esto garantiza que la pasta tenga sabor por sí misma.', category: 'Pastas' },
];

const quickReference = `TIEMPOS DE COCCIÓN ORIENTATIVOS
================================
Pasta (al dente):      8-10 minutos
Arroz blanco:          18 minutos
Pechuga de pollo:      20-25 minutos
Carne molida:          10-15 minutos
Vegetales al vapor:    5-8 minutos
Huevo duro:            10 minutos
Papa en cubos:         15-20 minutos`;

export function CookingTipsPage() {
  const navigate = useNavigate();
  const categories = Array.from(new Set(cookingTips.map((tip) => tip.category)));

  return (
    <div className="min-h-screen bg-green-50">
      <PageSEO
        title="Tips de Cocina | Consejos para cocinar mejor"
        description="Consejos prácticos de cocina casera: técnicas básicas, tiempos de cocción y secretos de chefs para preparar recetas sencillas y deliciosas."
        path="/cooking-tips"
      />
      <PageHeader
        title="Tips de Cocina"
        subtitle="Consejos prácticos para cocinar mejor cada día"
      />

      <div className="container mx-auto px-4 py-8">
        <main>
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl text-green-800 mb-4 border-b-2 border-green-300 pb-2 flex items-center gap-2">
              <Lightbulb className="w-6 h-6" aria-hidden="true" />
              Aprende los secretos de la cocina casera
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Los mejores chefs del mundo tienen algo en común: dominan los fundamentos.
              Aquí compartimos los tips más útiles que transformarán tu manera de cocinar recetas sencillas.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg sm:text-xl text-green-800 mb-4">Referencia rápida de tiempos de cocción</h2>
            <div className="bg-gray-900 rounded-xl p-4 sm:p-5 overflow-x-auto">
              <pre className="text-green-300 text-xs sm:text-sm leading-relaxed font-mono">{quickReference}</pre>
            </div>
          </section>

          {categories.map((category) => (
            <section key={category} className="mb-8">
              <h2 className="text-xl sm:text-2xl text-green-700 mb-4 flex items-center gap-2">
                <ChefHat className="w-6 h-6" aria-hidden="true" />
                {category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cookingTips
                  .filter((tip) => tip.category === category)
                  .map((tip) => (
                    <article key={tip.id} className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                          <Lightbulb className="w-5 h-5 text-green-600" aria-hidden="true" />
                        </div>
                        <h3 className="text-gray-800">{tip.title}</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{tip.description}</p>
                    </article>
                  ))}
              </div>
            </section>
          ))}
        </main>
      </div>

      <PageFooter currentPage="/cooking-tips" />
    </div>
  );
}
