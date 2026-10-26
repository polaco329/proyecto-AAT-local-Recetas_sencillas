import { Recipe } from '../context/RecipesContext';

export const allRecipes: Recipe[] = [
  // Postres
  {
    id: 'postre-1',
    name: 'Brownie de Chocolate',
    category: 'Postres',
    description: 'Delicioso brownie casero con chocolate fundido',
    ingredients: ['200g chocolate', '150g mantequilla', '3 huevos', '200g azúcar', '100g harina', '1 cdta vainilla'],
    steps: [
      'Derretir el chocolate con la mantequilla a baño maría',
      'Batir los huevos con el azúcar hasta blanquear',
      'Mezclar el chocolate derretido con los huevos',
      'Agregar la harina y vainilla',
      'Hornear a 180°C por 25 minutos'
    ],
    price: 4500,
    prepTime: '40 min',
    servings: 8
  },
  {
    id: 'postre-2',
    name: 'Flan de Vainilla',
    category: 'Postres',
    description: 'Flan cremoso con caramelo casero',
    ingredients: ['1 litro leche', '5 huevos', '200g azúcar para el flan', '150g azúcar para caramelo', '1 cdta vainilla'],
    steps: [
      'Hacer el caramelo con 150g de azúcar',
      'Batir huevos con azúcar y vainilla',
      'Calentar la leche y mezclar con los huevos',
      'Verter en molde con caramelo',
      'Cocinar a baño maría por 1 hora a 160°C'
    ],
    price: 3200,
    prepTime: '1h 30min',
    servings: 6
  },
  {
    id: 'postre-3',
    name: 'Galletas de Avena',
    category: 'Postres',
    description: 'Galletas crujientes y saludables',
    ingredients: ['200g avena', '100g harina', '150g azúcar morena', '100g mantequilla', '1 huevo', '1 cdta canela'],
    steps: [
      'Mezclar ingredientes secos',
      'Derretir mantequilla y mezclar con huevo',
      'Unir todo y formar bolitas',
      'Aplastar en bandeja',
      'Hornear 15 minutos a 180°C'
    ],
    price: 2800,
    prepTime: '30 min',
    servings: 20
  },

  // Carnes
  {
    id: 'carne-1',
    name: 'Pollo al Horno con Hierbas',
    category: 'Carnes',
    description: 'Pollo jugoso marinado con hierbas aromáticas',
    ingredients: ['1 pollo entero', '4 dientes ajo', 'Romero', 'Tomillo', 'Aceite de oliva', 'Sal y pimienta'],
    steps: [
      'Marinar el pollo con hierbas, ajo y aceite por 2 horas',
      'Precalentar horno a 200°C',
      'Colocar el pollo en bandeja',
      'Hornear por 1 hora, bañando cada 20 minutos',
      'Dejar reposar 10 minutos antes de servir'
    ],
    price: 8500,
    prepTime: '1h 20min',
    servings: 4
  },
  {
    id: 'carne-2',
    name: 'Albóndigas en Salsa',
    category: 'Carnes',
    description: 'Albóndigas tiernas en salsa de tomate casera',
    ingredients: ['500g carne molida', '1 huevo', 'Pan rallado', '2 latas tomate triturado', 'Cebolla', 'Ajo', 'Orégano'],
    steps: [
      'Mezclar carne con huevo y pan rallado',
      'Formar albóndigas y dorar en sartén',
      'Sofreír cebolla y ajo',
      'Agregar tomate y especias',
      'Cocinar albóndigas en salsa por 30 minutos'
    ],
    price: 6200,
    prepTime: '50 min',
    servings: 4
  },
  {
    id: 'carne-3',
    name: 'Carne Asada Marinada',
    category: 'Carnes',
    description: 'Bistec jugoso con marinado especial',
    ingredients: ['4 bistecs', 'Salsa soja', 'Miel', 'Ajo', 'Jengibre', 'Aceite'],
    steps: [
      'Mezclar salsa soja, miel, ajo y jengibre',
      'Marinar la carne por 4 horas',
      'Calentar parrilla o sartén',
      'Cocinar 4 minutos por lado',
      'Dejar reposar antes de cortar'
    ],
    price: 12000,
    prepTime: '4h 15min',
    servings: 4
  },

  // Vegano
  {
    id: 'vegano-1',
    name: 'Curry de Garbanzos',
    category: 'Vegano',
    description: 'Curry cremoso y aromático con garbanzos',
    ingredients: ['2 latas garbanzos', '400ml leche de coco', 'Pasta de curry', 'Cebolla', 'Tomate', 'Espinaca'],
    steps: [
      'Sofreír cebolla hasta dorar',
      'Agregar pasta de curry y tomate',
      'Añadir garbanzos y leche de coco',
      'Cocinar 20 minutos',
      'Agregar espinaca al final'
    ],
    price: 4800,
    prepTime: '35 min',
    servings: 4
  },
  {
    id: 'vegano-2',
    name: 'Hamburguesa de Lentejas',
    category: 'Vegano',
    description: 'Hamburguesa proteica y deliciosa',
    ingredients: ['200g lentejas cocidas', 'Avena', 'Cebolla', 'Ajo', 'Comino', 'Pimentón'],
    steps: [
      'Triturar lentejas dejando textura',
      'Mezclar con avena y especias',
      'Formar hamburguesas',
      'Refrigerar 30 minutos',
      'Cocinar en sartén 5 minutos por lado'
    ],
    price: 2500,
    prepTime: '45 min',
    servings: 4
  },
  {
    id: 'vegano-3',
    name: 'Bowl de Quinoa y Vegetales',
    category: 'Vegano',
    description: 'Bowl nutritivo y colorido',
    ingredients: ['1 taza quinoa', 'Brócoli', 'Zanahoria', 'Aguacate', 'Garbanzos tostados', 'Tahini'],
    steps: [
      'Cocinar quinoa según instrucciones',
      'Asar brócoli y zanahoria',
      'Tostar garbanzos con especias',
      'Preparar salsa de tahini',
      'Montar bowl con todos los ingredientes'
    ],
    price: 5200,
    prepTime: '35 min',
    servings: 2
  },

  // Rápido
  {
    id: 'rapido-1',
    name: 'Pasta Aglio e Olio',
    category: 'Rápido',
    description: 'Pasta italiana con ajo y aceite',
    ingredients: ['400g pasta', '6 dientes ajo', 'Aceite de oliva', 'Perejil', 'Hojuelas de chile'],
    steps: [
      'Cocinar pasta al dente',
      'Dorar ajo laminado en aceite',
      'Agregar hojuelas de chile',
      'Mezclar con pasta y agua de cocción',
      'Servir con perejil'
    ],
    price: 3500,
    prepTime: '15 min',
    servings: 4
  },
  {
    id: 'rapido-2',
    name: 'Quesadillas Express',
    category: 'Rápido',
    description: 'Quesadillas rápidas y deliciosas',
    ingredients: ['Tortillas', 'Queso rallado', 'Frijoles refritos', 'Pico de gallo'],
    steps: [
      'Calentar tortilla en sartén',
      'Agregar queso y frijoles',
      'Doblar y dorar por ambos lados',
      'Cortar en triángulos',
      'Servir con pico de gallo'
    ],
    price: 4200,
    prepTime: '10 min',
    servings: 2
  },
  {
    id: 'rapido-3',
    name: 'Arroz Frito Express',
    category: 'Rápido',
    description: 'Arroz frito al estilo asiático',
    ingredients: ['3 tazas arroz cocido frío', '2 huevos', 'Vegetales congelados', 'Salsa soja', 'Aceite de sésamo'],
    steps: [
      'Revolver huevos en wok caliente',
      'Agregar vegetales y saltear',
      'Añadir arroz frío',
      'Condimentar con salsa soja',
      'Finalizar con aceite de sésamo'
    ],
    price: 4500,
    prepTime: '12 min',
    servings: 3
  },

  // Desayuno
  {
    id: 'desayuno-1',
    name: 'Pancakes Esponjosos',
    category: 'Desayuno',
    description: 'Pancakes perfectos para comenzar el día',
    ingredients: ['200g harina', '2 huevos', '250ml leche', '2 cdtas polvo de hornear', 'Azúcar', 'Mantequilla'],
    steps: [
      'Mezclar ingredientes secos',
      'Batir huevos con leche',
      'Unir ambas mezclas sin batir demasiado',
      'Cocinar en sartén con mantequilla',
      'Servir con miel o jarabe'
    ],
    price: 3800,
    prepTime: '20 min',
    servings: 4
  },
  {
    id: 'desayuno-2',
    name: 'Smoothie Bowl Tropical',
    category: 'Desayuno',
    description: 'Bowl refrescante lleno de energía',
    ingredients: ['2 bananas congeladas', 'Mango', 'Leche de almendras', 'Granola', 'Coco rallado', 'Frutas frescas'],
    steps: [
      'Licuar bananas y mango con leche',
      'Servir en bowl',
      'Decorar con granola',
      'Agregar coco y frutas frescas',
      'Servir inmediatamente'
    ],
    price: 4600,
    prepTime: '8 min',
    servings: 2
  },
  {
    id: 'desayuno-3',
    name: 'Tostadas Francesas',
    category: 'Desayuno',
    description: 'Tostadas dulces y doradas',
    ingredients: ['4 rebanadas pan', '2 huevos', '100ml leche', 'Canela', 'Vainilla', 'Mantequilla'],
    steps: [
      'Batir huevos con leche, canela y vainilla',
      'Remojar pan en la mezcla',
      'Dorar en sartén con mantequilla',
      'Cocinar hasta dorar ambos lados',
      'Servir con frutas y azúcar glass'
    ],
    price: 3200,
    prepTime: '15 min',
    servings: 2
  },

  // Merienda
  {
    id: 'merienda-1',
    name: 'Muffins de Arándanos',
    category: 'Merienda',
    description: 'Muffins tiernos con arándanos frescos',
    ingredients: ['250g harina', '2 huevos', '120ml leche', '100g azúcar', '80g mantequilla', '150g arándanos'],
    steps: [
      'Mezclar ingredientes secos',
      'Batir huevos con leche y mantequilla derretida',
      'Unir mezclas suavemente',
      'Agregar arándanos',
      'Hornear a 180°C por 20 minutos'
    ],
    price: 4200,
    prepTime: '35 min',
    servings: 12
  },
  {
    id: 'merienda-2',
    name: 'Hummus Casero',
    category: 'Merienda',
    description: 'Hummus cremoso para dipear',
    ingredients: ['1 lata garbanzos', 'Tahini', 'Jugo de limón', 'Ajo', 'Comino', 'Aceite de oliva'],
    steps: [
      'Escurrir garbanzos guardando líquido',
      'Procesar con tahini, limón y ajo',
      'Agregar comino y sal',
      'Añadir líquido hasta cremosidad deseada',
      'Servir con aceite de oliva encima'
    ],
    price: 2900,
    prepTime: '10 min',
    servings: 6
  },
  {
    id: 'merienda-3',
    name: 'Mini Pizzas de Pan',
    category: 'Merienda',
    description: 'Pizzas rápidas sobre pan',
    ingredients: ['Pan tajado', 'Salsa de tomate', 'Queso mozzarella', 'Pepperoni', 'Orégano'],
    steps: [
      'Tostar ligeramente el pan',
      'Untar salsa de tomate',
      'Agregar queso y pepperoni',
      'Hornear hasta que derrita el queso',
      'Espolvorear orégano'
    ],
    price: 3600,
    prepTime: '12 min',
    servings: 4
  },

  // Recetas para Niños
  {
    id: 'kids-1',
    name: 'Sándwich Creativo de Caras',
    category: 'Merienda',
    description: 'Sándwiches divertidos decorados como caras con vegetales',
    ingredients: [
      'Pan de molde',
      'Queso crema',
      'Jamón o pavo',
      'Queso en tajadas',
      'Tomates cherry',
      'Aceitunas',
      'Zanahoria rallada',
    ],
    steps: [
      'Untar el pan con queso crema',
      'Agregar jamón o pavo',
      'Cortar el tomate cherry a la mitad para los ojos',
      'Usar aceitunas para hacer la nariz',
      'Hacer la boca con zanahoria rallada',
      'Dejar que los niños decoren sus propias caras',
    ],
    price: 3500,
    prepTime: '15 min',
    servings: 2,
  },
  {
    id: 'kids-2',
    name: 'Pizza Personal en Pan Pita',
    category: 'Merienda',
    description: 'Mini pizzas que los niños pueden preparar ellos mismos',
    ingredients: [
      'Pan pita',
      'Salsa de tomate',
      'Queso mozzarella rallado',
      'Ingredientes variados (jamón, piña, champiñones)',
    ],
    steps: [
      'Precalentar horno a 180°C',
      'Untar salsa de tomate en el pan pita',
      'Dejar que los niños agreguen sus ingredientes favoritos',
      'Cubrir con queso',
      'Hornear 10 minutos hasta que el queso se derrita',
    ],
    price: 3800,
    prepTime: '20 min',
    servings: 4,
  },
  {
    id: 'kids-3',
    name: 'Batido de Frutas Arcoíris',
    category: 'Desayuno',
    description: 'Batido colorido y nutritivo sin usar licuadora caliente',
    ingredients: [
      '1 banana',
      'Fresas',
      'Mango',
      'Yogurt natural',
      'Miel',
      'Leche',
    ],
    steps: [
      'Colocar frutas en la licuadora',
      'Agregar yogurt y leche',
      'Endulzar con miel al gusto',
      'Licuar hasta que esté suave (supervisión adulta)',
      'Servir en vasos decorados',
    ],
    price: 4200,
    prepTime: '8 min',
    servings: 2,
  },
  {
    id: 'kids-4',
    name: 'Bolitas de Avena sin Cocción',
    category: 'Merienda',
    description: 'Snack saludable que los niños pueden hacer sin usar el horno',
    ingredients: [
      '2 tazas avena',
      '1/2 taza mantequilla de maní',
      '1/3 taza miel',
      'Chips de chocolate',
      '1 cdta vainilla',
    ],
    steps: [
      'Mezclar todos los ingredientes en un bowl',
      'Refrigerar la mezcla 30 minutos',
      'Formar bolitas con las manos',
      'Refrigerar hasta servir',
      'No requiere cocción',
    ],
    price: 4500,
    prepTime: '40 min',
    servings: 12,
  },
  {
    id: 'kids-5',
    name: 'Gelatina de Colores en Capas',
    category: 'Postres',
    description: 'Postre divertido y colorido sin necesidad de horno',
    ingredients: [
      '3 sobres de gelatina de diferentes colores',
      'Agua caliente (preparada por adultos)',
      'Moldes individuales',
    ],
    steps: [
      'Preparar la primera gelatina según instrucciones',
      'Verter en moldes y refrigerar hasta que cuaje',
      'Repetir con el segundo color sobre la primera capa',
      'Agregar tercera capa cuando la segunda cuaje',
      'Refrigerar hasta servir',
    ],
    price: 2800,
    prepTime: '3 horas',
    servings: 6,
  },
  {
    id: 'kids-6',
    name: 'Rollitos de Tortilla con Frutas',
    category: 'Desayuno',
    description: 'Desayuno fácil y sin cocción',
    ingredients: [
      'Tortillas de harina',
      'Queso crema',
      'Fresas cortadas',
      'Banana en rodajas',
      'Miel',
    ],
    steps: [
      'Untar tortilla con queso crema',
      'Colocar frutas en el centro',
      'Rociar un poco de miel',
      'Enrollar la tortilla',
      'Cortar en rueditas',
    ],
    price: 3200,
    prepTime: '10 min',
    servings: 3,
  },
];

export function getRecipesByCategory(category: string): Recipe[] {
  return allRecipes.filter((recipe) => recipe.category === category);
}

export function getEconomicRecipes(): Recipe[] {
  return allRecipes.filter((recipe) => recipe.price < 5000);
}
