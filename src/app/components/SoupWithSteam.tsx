import './SoupWithSteam.css';

export function SoupWithSteam() {
  return (
    <div className="relative flex justify-center items-end">
      {/* Humo animado */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2">
        <div className="steam steam-1"></div>
        <div className="steam steam-2"></div>
        <div className="steam steam-3"></div>
      </div>

      {/* Sopa */}
      <div className="relative">
        {/* Plato de sopa */}
        <div className="w-48 h-32 bg-gradient-to-b from-orange-400 to-orange-500 rounded-full shadow-2xl relative overflow-hidden">
          {/* Superficie de la sopa con brillo */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-300/50 via-transparent to-transparent"></div>
          
          {/* Detalles de la sopa (vegetales flotando) */}
          <div className="absolute top-8 left-12 w-6 h-6 bg-green-500 rounded-full opacity-70"></div>
          <div className="absolute top-10 right-16 w-4 h-4 bg-red-400 rounded-full opacity-70"></div>
          <div className="absolute bottom-8 left-20 w-5 h-5 bg-yellow-400 rounded-full opacity-70"></div>
        </div>

        {/* Base del plato */}
        <div className="w-52 h-8 bg-gradient-to-b from-gray-100 to-gray-200 rounded-full -mt-2 shadow-lg border-t-4 border-white"></div>
      </div>
    </div>
  );
}
