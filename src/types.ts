export interface CustomizationOption {
  label: string;
  price?: number;
}

export interface ProductCustomizations {
  guarnicion?: string;
  ensalada?: string;
  cremas?: string[];
  notas?: string;
}

export type OrderType = 'delivery' | 'local';

export interface CartItem {
  id: string; // unique for cart instances
  productId: string;
  name: string;
  price: number;
  quantity: number;
  customizations?: ProductCustomizations;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  avatar: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'pollo' | 'mostrito' | 'complemento' | 'bebida' | 'combo';
  tag?: 'Popular' | 'Recomendado' | 'Nuevo' | 'Top Ventas';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  options?: ChatOption[];
  productId?: string; // ID for quick add to cart
}

export interface ChatOption {
  label: string;
  value: string;
  action: 'recommend' | 'close' | 'link' | 'cart';
  target?: string;
}

export const MENU_PRODUCTS: Product[] = [
  // POLLOS A LA BRASA
  {
    id: 'p1',
    name: '1/8 de Pollo a la Brasa',
    description: 'La porción ideal para un antojo rápido. Incluye papas fritas crocantes y ensalada fresca.',
    price: 15.00,
    image: 'https://shoppicture.ww-api.com/pretty_pict/v1/800x1200/50x50/v1/commerce_pict/2228286/1651381622115_31/octavodepollo.png',
    category: 'pollo',
  },
  {
    id: 'p2',
    name: '1/4 de Pollo a la Brasa',
    description: 'El clásico preferido. Pierna o encuentro con papas y ensalada. ¡Sabor inigualable!',
    price: 22.00,
    image: 'https://tofuu.getjusto.com/orioneat-local/resized2/Gfo9LDxGKcw3TeHEA-300-x.webp',
    category: 'pollo',
    tag: 'Popular',
  },
  {
    id: 'p3',
    name: '1/2 Pollo a la Brasa',
    description: 'Para los que tienen buen diente o para compartir entre dos. Con doble ración de papas y ensalada.',
    price: 42.00,
    image: 'https://tofuu.getjusto.com/orioneat-local/resized2/anQaPp9nyDFBguzta-1080-x.webp',
    category: 'pollo',
  },
  {
    id: 'p4',
    name: 'Pollo Entero a la Brasa',
    description: 'El banquete familiar por excelencia. Incluye ración grande de papas, ensalada y nuestras cremas secretas.',
    price: 78.00,
    image: 'https://imgmedia.buenazo.pe/1200x660/buenazo/original/2023/07/14/64ac3e8c599470217672a906.jpg',
    category: 'pollo',
    tag: 'Recomendado',
  },

  // MOSTRITOS
  {
    id: 'm1',
    name: 'Mostrito Clásico',
    description: 'Pollo a la brasa + Arroz Chaufa + Papas Fritas. La combinación que lo tiene todo.',
    price: 25.00,
    image: 'https://comedera.com/wp-content/uploads/sites/9/2023/05/mostrito-peruano.jpg',
    category: 'mostrito',
    tag: 'Top Ventas',
  },
  {
    id: 'm2',
    name: 'Mostrito Especial',
    description: 'Mostrito clásico repotenciado con huevo frito y salchicha. ¡Para los valientes!',
    price: 28.00,
    image: 'https://terrazaalabrasaexpress.com/imagenes_productos/subir%20salchicha.png',
    category: 'mostrito',
    tag: 'Nuevo',
  },
  {
    id: 'm3',
    name: 'Mostrito Familiar',
    description: 'Pollo entero + Fuente de Arroz Chaufa + Papas Familiares. ¡Nadie se queda con hambre!',
    price: 85.00,
    image: 'https://res.cloudinary.com/dcnynnstm/image/upload/q_auto/f_auto/v1776439779/MOSTRITO_FAMILIART_j93len.jpg',
    category: 'mostrito',
  },

  // COMPLEMENTOS
  {
    id: 'c1',
    name: 'Porción de Papas Fritas',
    description: 'Papas nacionales seleccionadas, fritas al momento y bien crocantes.',
    price: 10.00,
    image: 'https://metroio.vtexassets.com/arquivos/ids/412048-800-auto?v=638278972104430000&width=800&height=auto&aspect=true',
    category: 'complemento',
  },
  {
    id: 'c2',
    name: 'Arroz Chaufa de la Casa',
    description: 'Salteado al wok con el toque ahumado perfecto.',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800',
    category: 'complemento',
  },

  // BEBIDAS
  {
    id: 'b1',
    name: 'Chicha Morada Helada',
    description: 'Receta tradicional con maíz morado, piña y un toque de canela. 1 Litro.',
    price: 12.00,
    image: 'https://www.lovferments.com/wp-content/uploads/2021/04/beb_chicha.jpg',
    category: 'bebida',
    tag: 'Popular',
  },
  {
    id: 'b2',
    name: 'Inca Kola 1.5L',
    description: 'La bebida de sabor nacional, perfecta para acompañar tu pollo.',
    price: 10.00,
    image: 'https://metroio.vtexassets.com/arquivos/ids/547069-800-auto?v=638633469969270000&width=800&height=auto&aspect=true',
    category: 'bebida',
  },

  // COMBOS
  {
    id: 'co1',
    name: 'Combo Personal Dorado',
    description: '1/4 Pollo + Papas + Ensalada + Gaseosa Personal.',
    price: 25.00,
    image: 'https://wongfood.vtexassets.com/arquivos/ids/652982/567991-01-124180.jpg?v=638285926378170000',
    category: 'combo',
    tag: 'Recomendado',
  },
  {
    id: 'co2',
    name: 'Combo Familiar Pollo Dorado',
    description: 'Pollo Entero + Papas Familiares + Ensalada + Chicha 1L + Cremas.',
    price: 89.00,
    image: 'https://metroio.vtexassets.com/arquivos/ids/419880-800-auto?v=638279888326170000&width=800&height=auto&aspect=true',
    category: 'combo',
  },
];
