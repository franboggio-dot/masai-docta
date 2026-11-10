/* ============================================================
   MASAI Café · Resto · Bar — Datos editables del sitio
   Todo el contenido comercial vive acá para poder editarse
   desde la sección de administración (persistido en localStorage).
   ============================================================ */

window.MASAI_DEFAULTS = {

  business: {
    name: "MASAI",
    fullName: "MASAI Café · Resto · Bar",
    tagline: "Natural, auténtico y conectado con cada momento del día.",
    phone: "351 743-9039",
    phoneDigits: "5493517439039",
    zone: "barrio Docta, Córdoba",
    addressDisplay: "Docta, Córdoba",
    addressNote: "El directorio indica Manzana 32, lote 15; los afiches de cumpleaños indican Mza. 15, lote 32, local 1. Pendiente de confirmación. No publicar dirección exacta hasta verificarla.",
    hours: [
      { days: "Lunes a jueves", time: "08:00 – 00:00" },
      { days: "Viernes y sábado", time: "08:00 – 01:00" },
      { days: "Domingo", time: "09:00 – 01:00" }
    ]
  },

  /* Cada categoría: id, nombre y lista de productos.
     price se guarda como número entero (18000 = $18.000). */
  menu: [
    {
      group: "Comidas",
      categories: [
        {
          id: "pastas", name: "Pastas",
          items: [
            { name: "Sorrentinos de jamón y queso", price: 18000 },
            { name: "Sorrentinos de espinaca", price: 18000 },
            { name: "Sorrentinos de osobuco al Malbec", price: 19500 },
            { name: "Canelones de acelga y carne / acelga", price: 16000 },
            { name: "Ñoquis de papa", price: 16000 }
          ]
        },
        {
          id: "tablas", name: "Tablas",
          items: [
            { name: "Tabla de Mila para 2", price: 24500, desc: "Milanesa a los tres quesos, cheddar, panceta, napolitana, papas fritas y dips." },
            { name: "Tabla Caliente para 2", price: 25500, desc: "Tiraditos de milanesa, pollo crispy, rabas, bastoncitos de muzzarella, papas fritas, nachos, pan de campo y dips." },
            { name: "Tabla de Campo para 2", price: 20000, desc: "Jamón crudo y cocido, salame de la Colonia, quesos tybo y azul, olivas, pan de campo y dip." },
            { name: "Tabla Caliente", price: 44000, desc: "Tiraditos de milanesa, pollo crispy, rabas, bastoncitos de muzzarella, papas fritas, nachos, pan de campo y dips." },
            { name: "Tabla de Mila", price: 42500, desc: "Milanesa a los tres quesos, cheddar, panceta, napolitana, papas fritas y dips." },
            { name: "Tabla de Campo", price: 36000, desc: "Jamón crudo y cocido, salame de la Colonia, quesos tybo y azul, olivas, pan de campo y dip." }
          ]
        },
        {
          id: "pizzas", name: "Pizzas",
          items: [
            { name: "Rúcula", price: 26000, desc: "Muzzarella, rúcula, jamón crudo y parmesano." },
            { name: "Media pizza Rúcula", price: 15000, desc: "Muzzarella, rúcula, jamón crudo y parmesano." },
            { name: "Champignones", price: 23500, desc: "Muzzarella, champiñones y pesto." },
            { name: "Media pizza Champi", price: 13500, desc: "Muzzarella, champiñones y pesto." },
            { name: "Caprese", price: 23500, desc: "Muzzarella, tomates cherry confitados y pesto." },
            { name: "Media pizza Caprese", price: 13500, desc: "Muzzarella, tomates cherry confitados y pesto." },
            { name: "Cuatro Quesos", price: 26000, desc: "Muzzarella, queso azul, parmesano y tybo." },
            { name: "Media pizza 4 Quesos", price: 14500, desc: "Muzzarella, queso azul, parmesano y tybo." },
            { name: "Fugazzetta", price: 23500, desc: "Salsa de tomate, muzzarella y cebolla caramelizada." },
            { name: "Media pizza Fugazzetta", price: 13500, desc: "Salsa de tomate, cebolla caramelizada y muzzarella." },
            { name: "Napolitana", price: 23500, desc: "Salsa de tomate, muzzarella, tomate en rodajas y provenzal." },
            { name: "Media pizza Napolitana", price: 13500, desc: "Muzzarella, tomates en rodajas y provenzal." },
            { name: "Especial", price: 23500, desc: "Jamón cocido, morrones asados, muzzarella y huevo." },
            { name: "Media pizza Especial", price: 13500, desc: "Jamón cocido, morrones asados, muzzarella y huevo." },
            { name: "Muzzarella", price: 22000, desc: "Salsa de tomate, muzzarella y orégano." },
            { name: "Media pizza Muzzarella", price: 12500, desc: "Salsa de tomate, muzzarella y orégano." }
          ]
        },
        {
          id: "tacc", name: "Pizzas sin TACC", note: "Elaboradas sin TACC. No podemos garantizar ausencia de contaminación cruzada.",
          items: [
            { name: "Especial sin TACC", price: 18000, desc: "Individual, 4 porciones." },
            { name: "Muzzarella sin TACC", price: 17500, desc: "Individual, 4 porciones." }
          ]
        },
        {
          id: "hamburguesas", name: "Hamburguesas",
          items: [
            { name: "Masai", price: 17500, desc: "Pan de papa, medallón de carne, rúcula, cebolla caramelizada, queso azul, tomates cherry confitados y toque de sriracha." },
            { name: "Americana", price: 17500, desc: "Pan de papa, doble medallón, cheddar, panceta, cebolla caramelizada, huevo frito y papas fritas." },
            { name: "Clásica", price: 14500, desc: "Pan de papa, medallón, lechuga, tomate, cheddar y papas fritas." }
          ]
        },
        {
          id: "sandwiches", name: "Sandwiches",
          items: [
            { name: "Sandwich Veggie", price: 19800, desc: "Berenjenas en láminas, pimientos asados, cebolla caramelizada y muzzarella." },
            { name: "Sandwich de Milanesa", price: 18500, desc: "Milanesa de ternera, lechuga, tomate, jamón, queso, huevo y papas fritas." },
            { name: "Vacío Stout", price: 23500, desc: "Pan de masa madre, vacío a la cerveza negra desmenuzado, vegetales asados, mayonesa casera, muzzarella y papas fritas." },
            { name: "Lomo Masai", price: 23500, desc: "Bife de lomo, mayonesa casera, chimi, lechuga, tomate, jamón, muzzarella, huevo y papas fritas." },
            { name: "Lomo", price: 21500, desc: "Bife de lomo, lechuga, tomate, jamón, queso, huevo y papas fritas." }
          ]
        },
        {
          id: "wraps", name: "Wraps",
          items: [
            { name: "Mediterráneo", price: 17600, desc: "Rúcula, tomates cherry confitados, olivas negras, panceta, parmesano y papas fritas." },
            { name: "Vegetariano", price: 16500, desc: "Vegetales asados, queso, lechuga, tomate, mayonesa y papas fritas." },
            { name: "De Pollo", price: 17600, desc: "Pollo rebozado en cubos, vegetales asados, lechuga, tomate, queso, mayonesa y papas fritas." }
          ]
        },
        {
          id: "minutas", name: "Minutas",
          items: [
            { name: "Milanesa de ternera", price: 18500 },
            { name: "Milanesa de ternera a caballo", price: 19500 },
            { name: "Milanesa de ternera a la napolitana", price: 19500 },
            { name: "Milanesa de pollo", price: 18500 },
            { name: "Milanesa de pollo a caballo", price: 19500 },
            { name: "Milanesa a caballo a la napolitana", price: 19500 }
          ]
        },
        {
          id: "principales", name: "Principales",
          items: [
            { name: "Salmón rosado al vino blanco", price: 27500, desc: "Con papas rústicas o ensalada caprese." },
            { name: "Bife de pollo grillado", price: 18000, desc: "Con papas rústicas o ensalada." },
            { name: "Bife de chorizo", price: 27500, desc: "200 g, marinado, con papas o ensalada." }
          ]
        },
        {
          id: "entradas", name: "Entradas",
          items: [
            { name: "Tortilla de papa española", price: 15000 },
            { name: "Bastoncitos de muzzarella", price: 13500 },
            { name: "Pollo crispy", price: 16500, desc: "Pollo rebozado." },
            { name: "Rabas", price: 24500, desc: "Calamar a la tempura con aderezo de la casa." },
            { name: "Provoleta grillada", price: 16500, desc: "Provolone fundido con hongos al ajillo, cherry y miel." }
          ]
        },
        {
          id: "papas", name: "Papas",
          items: [
            { name: "Cuatro Quesos", price: 15500 },
            { name: "Papas Masai", price: 15500, desc: "Cheddar, panceta y verdeo." },
            { name: "Papas Rústicas", price: 12500 }
          ]
        },
        {
          id: "ensaladas", name: "Ensaladas",
          items: [
            { name: "Caesar", price: 17600, desc: "Pollo, parmesano, hojas verdes, tomates cherry y alioli César." },
            { name: "Tibia", price: 17600, desc: "Fideos, mix de verdes, verduras asadas, huevo duro y provolone." },
            { name: "Masai", price: 17600, desc: "Pollo, parmesano, hojas verdes, tomates cherry, croutones y alioli César." }
          ]
        },
        {
          id: "infantil", name: "Menú Infantil",
          items: [
            { name: "Fettuccini con manteca", price: 13200 },
            { name: "Mini burguer con fritas", price: 13200 },
            { name: "Milanesa con fritas", price: 14000 }
          ]
        },
        {
          id: "desayuno", name: "Combos de Desayuno y Merienda",
          items: [
            { name: "Combo 1", price: 9500, desc: "Dos criollos, medialunas o tostadas con manteca y mermelada casera; infusión y jugo de naranja." },
            { name: "Combo 2", price: 11500, desc: "Dos tostadas de pan de campo o integral con jamón, queso y manteca; infusión y jugo de naranja." },
            { name: "Combo 3", price: 13500, desc: "Dos Mafaldas, infusión y jugo de naranja." },
            { name: "Combo 4", price: 15500, desc: "Licuado de banana, frutilla o durazno y tostado de jamón y queso." }
          ]
        },
        {
          id: "individuales", name: "Productos Individuales",
          items: [
            { name: "Licuado de banana, frutilla o durazno", price: 6900 },
            { name: "Exprimido de naranja", price: 4500 },
            { name: "Mafalda", price: 3300 },
            { name: "Croissant", price: 2000 },
            { name: "Criollo", price: 1700 },
            { name: "Medialuna", price: 2000 }
          ]
        },
        {
          id: "postres", name: "Postres",
          items: [
            { name: "Ensalada de frutas de estación", price: 7500 },
            { name: "Panqueques", price: 8500, desc: "Con dulce de leche y helado de crema americana." },
            { name: "Peras al Malbec", price: 8900, desc: "Con bocha de helado." },
            { name: "Brownie casero", price: 9500, desc: "Con helado de crema americana." },
            { name: "Copa helada", price: 8500, desc: "Dos bochas de frutilla, chocolate o crema americana, con salsa." },
            { name: "Flan casero", price: 7500, desc: "Con dulce de leche." }
          ]
        }
      ]
    },
    {
      group: "Bebidas",
      categories: [
        {
          id: "sin-alcohol", name: "Sin Alcohol",
          items: [
            { name: "Red Bull en lata", price: 6600 },
            { name: "Speed en lata", price: 5500 },
            { name: "Jugo de naranja, vaso", price: 4700 },
            { name: "Jugo de naranja, jarra", price: 9000 },
            { name: "Limonada, vaso", price: 4700 },
            { name: "Limonada, jarra", price: 9000 },
            { name: "Coca-Cola, Sprite o Fanta, 330 ml", price: 2800 },
            { name: "Coca-Cola, Sprite o Fanta, 500 ml", price: 4200 },
            { name: "Agua tónica en lata", price: 4100 },
            { name: "Agua saborizada", price: 3800 },
            { name: "Agua con gas", price: 3800 },
            { name: "Agua sin gas", price: 3800 }
          ]
        },
        {
          id: "cervezas-industriales", name: "Cervezas Industriales",
          items: [
            { name: "Heineken 975 cc", price: 11900 },
            { name: "Stella Artois 330 cc", price: 5500 },
            { name: "Stella Artois 975 cc", price: 10900 },
            { name: "Corona 330 cc", price: 7500 },
            { name: "Corona 710 cc", price: 10900 },
            { name: "Balde de 6 Coronas", price: 38500 }
          ]
        },
        {
          id: "cervezas-artesanales", name: "Cervezas Artesanales",
          items: [
            { name: "Session IPA", price: 6500 },
            { name: "Amber Lager", price: 6500 },
            { name: "Light Lager", price: 6500 }
          ]
        },
        {
          id: "vinos", name: "Vinos",
          items: [
            { name: "Rutini Cabernet-Malbec", price: 28000 },
            { name: "Salentein Reserva Malbec", price: 22000 },
            { name: "Trumpeter Cabernet Sauvignon", price: 19000 },
            { name: "Las Perdices Malbec", price: 16500 },
            { name: "Copa de vino Las Perdices", price: 6500 }
          ]
        },
        {
          id: "vinos-blancos", name: "Vinos Blancos",
          items: [
            { name: "Rutini Sauvignon Blanc", price: 25000 },
            { name: "Salentein Chardonnay Reserva", price: 19000 },
            { name: "Trumpeter Torrontés Reserva", price: 18000 }
          ]
        },
        {
          id: "espumantes", name: "Espumantes",
          items: [
            { name: "Baron B", price: 59000 },
            { name: "Salentein Blanc de Blancs", price: 28000 },
            { name: "Salentein Extra Brut", price: 25900 },
            { name: "Salentein Brut Nature Rosé", price: 25900 },
            { name: "Salentein Brut Nature", price: 25900 }
          ]
        },
        {
          id: "whiskies", name: "Whiskies",
          items: [
            { name: "J&B", price: 7500 },
            { name: "Johnnie Walker Black", price: 11500 },
            { name: "Johnnie Walker Red", price: 8500 }
          ]
        },
        {
          id: "clasicos", name: "Clásicos",
          items: [
            { name: "Daiquiri de frutilla o durazno", price: 11000 },
            { name: "Cuba Libre", price: 11000, desc: "Bacardí Carta Oro, Coca-Cola y limón." },
            { name: "Negroni", price: 11000 },
            { name: "Vodka con Red Bull", price: 13500 },
            { name: "Vodka con Speed", price: 9500 },
            { name: "Fernet con Coca-Cola", price: 10000 }
          ]
        },
        {
          id: "cocteleria", name: "Coctelería",
          items: [
            { name: "Jäger Lima", price: 12500, desc: "Jägermeister, Sprite y limón." },
            { name: "Jäger Julep", price: 12500 },
            { name: "Cynar Julep", price: 11000 },
            { name: "Campari Orange", price: 11000 },
            { name: "Ramazzotti Spritz", price: 11500, desc: "Ramazzotti Rosato, espumante, soda y naranja." },
            { name: "Ramazzotti Tonic", price: 10500, desc: "Ramazzotti Rosato, tónica y limón o pomelo." },
            { name: "Vermú Lunfa", price: 11500 },
            { name: "Vermú Ajenjo", price: 10500 },
            { name: "Caipiroska", price: 10000 },
            { name: "Caipi Malibú", price: 11000 },
            { name: "Caipiriña", price: 10000 },
            { name: "Mojito Malibú", price: 11000 },
            { name: "Mojito", price: 11000, desc: "Bacardí Carta Blanca, lima, syrup, menta y soda." },
            { name: "Gancia Batido", price: 10000, desc: "Americano Gancia, limón, syrup y clara de huevo." },
            { name: "Aperol Spritz", price: 11000 },
            { name: "Gin tonic Bombay Sapphire", price: 12000 },
            { name: "Gin tonic Beefeater", price: 10900 },
            { name: "Gin tonic Príncipe de los Apóstoles", price: 9500 }
          ]
        },
        {
          id: "infusiones", name: "Infusiones",
          items: [
            { name: "Submarino", price: 5200 },
            { name: "Cappuccino", price: 5000 },
            { name: "Café frío", price: 5000 },
            { name: "Café a la crema", price: 4300 },
            { name: "Café doble", price: 3900 },
            { name: "Café en jarro", price: 3200 },
            { name: "Café espresso", price: 2800 },
            { name: "Té", price: 12800 }
          ]
        },
        {
          id: "cafeteria", name: "Cafetería",
          items: [
            { name: "Panqueques de avena", price: 12900, desc: "Frutilla, banana y miel." },
            { name: "Omelette", price: 12900, desc: "Jamón y queso." },
            { name: "Tostado mixto", price: 17500, desc: "Jamón y queso con papas." },
            { name: "Tostada proteica", price: 17800, desc: "Dos tostadas integrales o de campo, jamón, queso, huevo y ensalada de frutas." },
            { name: "Tostón avocado", price: 16000, desc: "Tostada con queso crema, huevo, palta y sésamo." }
          ]
        }
      ]
    }
  ],

  promos: [
    { id: "p1", title: "Happy Hour", detail: "Gin, fernet y cerveza.", days: "", hours: "18:00 – 22:00", note: "La pieza no especifica otros días ni condiciones." },
    { id: "p2", title: "2 x 1 en hamburguesas clásicas y wrap de pollo", detail: "Dos al precio de uno en hamburguesas clásicas y wrap de pollo.", days: "Lunes y martes", hours: "20:00 – 23:00" },
    { id: "p3", title: "Papas Masai + 2 cervezas", detail: "Papas Masai con dos cervezas.", price: 20000, days: "", hours: "19:00 – 22:00" },
    {
      id: "p4", title: "Promo de botellas", detail: "", days: "", hours: "",
      items: [
        { name: "Gin Beefeater + 5 tónicas", price: 76000 },
        { name: "Vodka Absolut + 4 Red Bull", price: 80000 },
        { name: "Vodka Smirnoff + 4 Speed", price: 50000 },
        { name: "Fernet Branca + 2 Coca-Colas", price: 50000 }
      ]
    },
    {
      id: "p5", title: "Happy Hour de carta", detail: "", days: "", hours: "",
      items: [
        { name: "2 vasos de gin Príncipe de los Apóstoles", price: 15000 },
        { name: "2 pintas de cerveza artesanal (Light Lager, Amber Lager o Session IPA)", price: 9000 },
        { name: "2 vasos de fernet", price: 16000 }
      ]
    }
  ],

  cumples: [
    {
      id: "c1",
      name: "Promo 1",
      people: 10,
      price: 180000,
      includes: [
        "1 pizza de muzzarella, 1 pizza especial y 1 pizza de rúcula.",
        "4 porciones de papas.",
        "10 pintas o 5 botellas de limonada."
      ],
      gift: "Para quien cumple: champagne de regalo para brindar y 10% de descuento en tragos y botellas."
    },
    {
      id: "c2",
      name: "Promo 2",
      people: 20,
      price: 320000,
      includes: [
        "2 pizzas de muzzarella, 2 pizzas especiales y 2 pizzas de rúcula.",
        "8 porciones de papas con cheddar y panceta.",
        "20 pintas a elección o 10 botellas de limonada."
      ],
      gift: "Para quien cumple: champagne de regalo para brindar y 10% de descuento en tragos y botellas."
    }
  ],

  cumpleNote: "Las piezas promocionales no muestran días de vigencia ni condiciones adicionales de reserva.",

  events: [],

  /* Fotos de ejemplo que acompañan al sitio (fotos del salón / carta). */
  seedPhotos: [
    "assets/img/foto-01.jpg",
    "assets/img/foto-02.jpg",
    "assets/img/foto-03.jpg",
    "assets/img/foto-04.jpg",
    "assets/img/foto-05.jpg",
    "assets/img/foto-06.jpg",
    "assets/img/foto-07.jpg",
    "assets/img/foto-08.jpg",
    "assets/img/foto-09.jpg"
  ]
};
