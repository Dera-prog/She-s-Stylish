export type Category =
  | 'Jeans and Leather Skirt'
  | 'Jeans and Leather Trouser'
  | 'Barrel Pants'
  | 'Adire and Aso Oke Skirt'
  | 'Knit Tops'
  | 'Blazer Jacket'
  | 'Corporate Dresses';

export type Product = {
  id: string;
  name: string;
  price: number;
  category: Category;
  sub: string;
  image: string;
  badge?: 'NEW' | 'BESTSELLER';
  rating: number;
  reviews: number;
  colours: { name: string; hex: string }[];
  sizes: string[];
  desc: string;
  fabric: string;
  care: string;
  collection: string;
  model?: string;
};

const img = (slug: string) => `/assets/products/${slug}.jpg`;

export const products: Product[] = [
  {
    id: 'red-stitch-denim-skirt',
    name: 'Red-stitch indigo denim midi',
    price: 76000,
    category: 'Jeans and Leather Skirt',
    sub: 'Denim',
    image: img('red-stitch-denim-skirt'),
    badge: 'NEW',
    rating: 4.7,
    reviews: 9,
    colours: [
      { name: 'Deep Indigo', hex: '#22283c' },
      { name: 'Red Thread', hex: '#b03a34' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'Raw indigo denim cut to a clean midi with a front walk slit, every seam picked out in red topstitch. Structured enough for the office, easy enough for a Saturday.',
    fabric: 'Rigid cotton denim, unlined',
    care: 'Machine wash cold, inside out',
    collection: 'The Soft Power Edit',
  },
  {
    id: 'two-tone-denim-skirt',
    name: 'Two-tone denim pencil skirt',
    price: 88000,
    category: 'Jeans and Leather Skirt',
    sub: 'Denim',
    image: img('two-tone-denim-skirt'),
    badge: 'NEW',
    rating: 4.8,
    reviews: 14,
    colours: [
      { name: 'Washed Blue', hex: '#93b3cc' },
      { name: 'Navy', hex: '#1f2a44' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'A light-wash yoke buttoned in brass over a deep navy pencil. Two denims, one clean line, and a back vent that keeps the stride honest.',
    fabric: 'Cotton denim panels, unlined',
    care: 'Machine wash cold, hang dry',
    collection: 'The Soft Power Edit',
  },
  {
    id: 'asymmetric-denim-skirt',
    name: 'Asymmetric-hem denim midi',
    price: 94000,
    category: 'Jeans and Leather Skirt',
    sub: 'Denim',
    image: img('asymmetric-denim-skirt'),
    badge: 'NEW',
    rating: 4.6,
    reviews: 8,
    colours: [
      { name: 'Dark Indigo', hex: '#2a3145' },
      { name: 'Stone', hex: '#b9c3cc' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'A skirt that moves like a spiral — the seam sweeps across the front and releases into an asymmetric hem with a pale denim underside.',
    fabric: 'Cotton denim, contrast reverse',
    care: 'Machine wash cold, inside out',
    collection: 'The Boardroom Edit',
  },
  {
    id: 'button-front-denim-maxi',
    name: 'Button-front denim A-line maxi',
    price: 82000,
    category: 'Jeans and Leather Skirt',
    sub: 'Denim',
    image: img('button-front-denim-maxi'),
    badge: 'NEW',
    rating: 4.7,
    reviews: 16,
    colours: [
      { name: 'Mid Blue', hex: '#3f6ea8' },
      { name: 'Indigo', hex: '#2c4a72' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'A full A-line in mid-wash denim, closed by a run of brass shank buttons from waist to hem. Wear it buttoned to the ankle or open over a slip.',
    fabric: 'Cotton denim, unlined',
    care: 'Machine wash cold, hang dry',
    collection: 'The Boardroom Edit',
  },
  {
    id: 'denim-peplum-skirt',
    name: 'Denim peplum midi skirt',
    price: 90000,
    category: 'Jeans and Leather Skirt',
    sub: 'Denim',
    image: img('denim-peplum-skirt'),
    badge: 'NEW',
    rating: 4.5,
    reviews: 6,
    colours: [
      { name: 'Mid Blue', hex: '#4b7cae' },
      { name: 'Ecru', hex: '#e9e2d2' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'Fitted through the hip, then gathered into a peplum flare from the knee. The button placket runs the whole way down and opens at the front slit.',
    fabric: 'Stretch cotton denim, unlined',
    care: 'Machine wash cold, inside out',
    collection: 'Lavender Hour',
  },
  {
    id: 'crystal-bow-denim-skirt',
    name: 'Crystal-bow denim midi',
    price: 98000,
    category: 'Jeans and Leather Skirt',
    sub: 'Denim',
    image: img('crystal-bow-denim-skirt'),
    badge: 'BESTSELLER',
    rating: 4.9,
    reviews: 11,
    colours: [
      { name: 'Light Blue', hex: '#7fa6c9' },
      { name: 'Silver', hex: '#c9ced6' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'Five crystal bows climb the front of a light-wash denim midi, balanced by a full-length button placket and a walking slit. Quiet sparkle, no fuss.',
    fabric: 'Cotton denim, crystal embellishment',
    care: 'Hand wash cold, dry flat',
    collection: 'Lavender Hour',
  },
  {
    id: 'side-button-denim-skirt',
    name: 'Side-placket denim midi',
    price: 74000,
    category: 'Jeans and Leather Skirt',
    sub: 'Denim',
    image: img('side-button-denim-skirt'),
    rating: 4.6,
    reviews: 7,
    colours: [
      { name: 'Mid Blue', hex: '#5b83b3' },
      { name: 'Indigo', hex: '#33425e' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'The button placket sits off-centre, opening into a long side slit. Clean at the waist, softly washed, and built to be worn with everything.',
    fabric: 'Cotton denim, unlined',
    care: 'Machine wash cold, inside out',
    collection: 'The Soft Power Edit',
  },
  {
    id: 'leather-wrap-maxi',
    name: 'Chocolate leather wrap maxi',
    price: 148000,
    category: 'Jeans and Leather Skirt',
    sub: 'Leather',
    image: img('leather-wrap-maxi'),
    badge: 'NEW',
    rating: 4.8,
    reviews: 10,
    colours: [
      { name: 'Espresso', hex: '#4a2c1d' },
      { name: 'Cognac', hex: '#8a5a35' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'Glazed leather folds over a suede column, held at the hip by a hand-braided cord. It falls to the ankle and moves like one continuous piece.',
    fabric: 'Glazed leather front, suede body',
    care: 'Specialist leather clean only',
    collection: 'The Boardroom Edit',
  },
  {
    id: 'blush-draped-skirt',
    name: 'Blush draped asymmetric skirt',
    price: 118000,
    category: 'Jeans and Leather Skirt',
    sub: 'Cotton sateen',
    image: img('blush-draped-skirt'),
    rating: 4.6,
    reviews: 5,
    colours: [
      { name: 'Blush', hex: '#efc9c5' },
      { name: 'Navy', hex: '#20283a' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'A high-neck waistband, a utility pocket, and a length of navy webbing cinching the drape at one side. Soft volume, sharply edited.',
    fabric: 'Cotton sateen, webbing trim',
    care: 'Dry clean recommended',
    collection: 'The Soft Power Edit',
  },
  {
    id: 'scarlet-stripe-skirt',
    name: 'Scarlet asymmetric skirt',
    price: 104000,
    category: 'Jeans and Leather Skirt',
    sub: 'Wool crepe',
    image: img('scarlet-stripe-skirt'),
    rating: 4.7,
    reviews: 8,
    colours: [
      { name: 'Scarlet', hex: '#ad1f2c' },
      { name: 'Stripe', hex: '#6f8bb5' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'A scarlet crepe wrap that hinges on the diagonal, revealing a striped cotton lining at the split. Belt it high and let the hem do the talking.',
    fabric: 'Wool-blend crepe, striped cotton lining',
    care: 'Dry clean only',
    collection: 'The Soft Power Edit',
  },
  {
    id: 'fern-leather-pencil-skirt',
    name: 'Fern green leather pencil skirt',
    price: 138000,
    category: 'Jeans and Leather Skirt',
    sub: 'Leather',
    image: img('fern-leather-pencil-skirt'),
    badge: 'NEW',
    rating: 4.9,
    reviews: 13,
    colours: [
      { name: 'Fern', hex: '#3f7a37' },
      { name: 'Black', hex: '#16181a' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'Lamba leather in a confident green, closed by a covered button placket and opening into a floor-skimming side slit. Lined in cupro so it glides.',
    fabric: 'Lamba leather, cupro lining',
    care: 'Specialist leather clean only',
    collection: 'The Boardroom Edit',
  },
  {
    id: 'colourblock-knit-skirt',
    name: 'Colour-block knit midi',
    price: 86000,
    category: 'Jeans and Leather Skirt',
    sub: 'Knit',
    image: img('colourblock-knit-skirt'),
    rating: 4.5,
    reviews: 9,
    colours: [
      { name: 'Pink / Red', hex: '#e2595f' },
      { name: 'Sky', hex: '#a9c8dd' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    desc: 'Graphic diamonds in red, sky and blush over a pleated navy hem. A knit that behaves like a statement, with enough stretch to sit and move in.',
    fabric: 'Viscose-blend knit, pleated hem',
    care: 'Hand wash cold, dry flat',
    collection: 'The Soft Power Edit',
  },
  {
    id: 'geometric-print-skirt',
    name: 'Geometric print A-line midi',
    price: 92000,
    category: 'Jeans and Leather Skirt',
    sub: 'Print',
    image: img('geometric-print-skirt'),
    badge: 'NEW',
    rating: 4.6,
    reviews: 6,
    colours: [
      { name: 'Forest', hex: '#15603f' },
      { name: 'Cream', hex: '#f1ead9' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'Colour-blocked shapes in forest, cream and marigold, cut in a clean A-line with a front split. The print is loud; the silhouette keeps it composed.',
    fabric: 'Structured twill',
    care: 'Dry clean recommended',
    collection: 'The Boardroom Edit',
  },
  {
    id: 'sunlit-graphic-skirt',
    name: 'Sunlit graphic silk skirt',
    price: 96000,
    category: 'Jeans and Leather Skirt',
    sub: 'Silk',
    image: img('sunlit-graphic-skirt'),
    rating: 4.8,
    reviews: 7,
    colours: [
      { name: 'Sunlight', hex: '#e0a324' },
      { name: 'Ivory', hex: '#f4f0e6' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'A handkerchief hem in printed silk, all golden light and graphite lines. It catches the air as you walk and settles into the most flattering drape.',
    fabric: 'Printed silk, unlined',
    care: 'Dry clean only',
    collection: 'Lavender Hour',
  },
  {
    id: 'rose-aline-maxi',
    name: 'Rose gathered A-line maxi',
    price: 112000,
    category: 'Jeans and Leather Skirt',
    sub: 'Duchess satin',
    image: img('rose-aline-maxi'),
    rating: 4.7,
    reviews: 5,
    colours: [
      { name: 'Rose', hex: '#c4647a' },
      { name: 'Ivory', hex: '#f2ead9' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'A fitted waist with soft gathers released from each hip, falling in a wide floor-length sweep. Built for entrances, and for sitting still in them.',
    fabric: 'Duchess satin, lined',
    care: 'Dry clean only',
    collection: 'Lavender Hour',
  },
  {
    id: 'ivory-pleated-skirt',
    name: 'Ivory pleated print skirt',
    price: 106000,
    category: 'Jeans and Leather Skirt',
    sub: 'Silk',
    image: img('ivory-pleated-skirt'),
    rating: 4.6,
    reviews: 4,
    colours: [
      { name: 'Ivory', hex: '#efe9dc' },
      { name: 'Multi', hex: '#8aa38b' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'A knife-pleated ivory skirt with a wrap waistband and painterly prints drifting up from the hem. Uneven length, quietly romantic.',
    fabric: 'Pleated silk-blend, unlined',
    care: 'Dry clean only',
    collection: 'The Soft Power Edit',
  },
  {
    id: 'marigold-feather-skirt',
    name: 'Marigold feather-embellished skirt',
    price: 156000,
    category: 'Jeans and Leather Skirt',
    sub: 'Silk',
    image: img('marigold-feather-skirt'),
    badge: 'NEW',
    rating: 4.9,
    reviews: 12,
    colours: [
      { name: 'Marigold', hex: '#e0a41c' },
      { name: 'Butter', hex: '#f0d48a' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'Hand-cut silk feathers stitched down a column of marigold crepe, each with a long thread that moves as you do. The kind of piece you keep for the night.',
    fabric: 'Silk crepe with silk feather appliqué',
    care: 'Dry clean only',
    collection: 'Lavender Hour',
  },
  {
    id: 'emerald-draped-maxi',
    name: 'Emerald draped maxi skirt',
    price: 128000,
    category: 'Jeans and Leather Skirt',
    sub: 'Faille',
    image: img('emerald-draped-maxi'),
    rating: 4.7,
    reviews: 6,
    colours: [
      { name: 'Emerald', hex: '#2f9a4d' },
      { name: 'Black', hex: '#181a18' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'Emerald faille gathered into a knot at one hip and left to fall in long, serious folds to the floor. One seam, one knot, no restraint.',
    fabric: 'Technical faillet, unlined',
    care: 'Dry clean recommended',
    collection: 'The Soft Power Edit',
  },
  {
    id: 'pinstripe-peplum-skirt',
    name: 'Pinstripe peplum skirt',
    price: 124000,
    category: 'Jeans and Leather Skirt',
    sub: 'Wool',
    image: img('pinstripe-peplum-skirt'),
    rating: 4.8,
    reviews: 9,
    colours: [
      { name: 'Ivory', hex: '#eeeae1' },
      { name: 'Charcoal', hex: '#4b4e52' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'A high ivory column broken by a pinstriped peplum that circles the hip and folds back on itself. Tailoring with a sense of humour.',
    fabric: 'Wool-blend suiting, lined',
    care: 'Dry clean only',
    collection: 'The Boardroom Edit',
  },
  {
    id: 'lilac-ribbed-maxi',
    name: 'Lilac ribbed mermaid maxi',
    price: 108000,
    category: 'Jeans and Leather Skirt',
    sub: 'Knit',
    image: img('lilac-ribbed-maxi'),
    badge: 'BESTSELLER',
    rating: 4.9,
    reviews: 15,
    colours: [
      { name: 'Lilac', hex: '#b48ad6' },
      { name: 'Black', hex: '#1a1a1d' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'Fine ribbing holds the body from waist to knee, then breaks into a cascade of ruffled, coiled frills at the hem. It hugs, it flares, it stays.',
    fabric: 'Ribbed viscose knit',
    care: 'Hand wash cold, dry flat',
    collection: 'Lavender Hour',
  },
  {
    id: 'denim-midi-skirt',
    name: 'Indigo denim midi skirt',
    price: 68000,
    category: 'Jeans and Leather Skirt',
    sub: 'Denim',
    image: img('denim-midi-skirt'),
    badge: 'BESTSELLER',
    rating: 4.7,
    reviews: 12,
    colours: [
      { name: 'Deep Indigo', hex: '#2b3a52' },
      { name: 'Washed Blue', hex: '#6d83a3' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'A deep-indigo denim cut high at the waist and falling to a clean midi hem, with a front slit that moves when you do. It softens with every wear and never loses its line.',
    fabric: '100% cotton denim, unlined',
    care: 'Machine wash cold, inside out',
    collection: 'The Soft Power Edit',
    model: '/assets/model-office.png',
  },
  {
    id: 'butter-mini-skirt',
    name: 'Butter leather mini skirt',
    price: 88000,
    category: 'Jeans and Leather Skirt',
    sub: 'Skirts',
    image: img('butter-mini-skirt'),
    rating: 4.6,
    reviews: 8,
    colours: [{ name: 'Butter Yellow', hex: '#efd79a' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'Soft leather in butter yellow, high-waisted with a side slit that moves. Wears like a second skin, reads like sunlight.',
    fabric: 'Lamb leather, satin lining',
    care: 'Leather specialist clean only',
    collection: 'Lavender Hour',
    model: '/assets/model-lavender.png',
  },
];

export const byId = (id: string) => products.find((p) => p.id === id);

export const formatN = (v: number) => `₦${v.toLocaleString('en-NG')}`;

export type Ad = {
  id: string;
  index: string;
  eyebrow: string;
  title: [string, string];
  copy: string;
  model: string;
  accent: string;
  tone: 'warm' | 'cool';
  cta: string;
};

export const ads: Ad[] = [
  {
    id: 'ad-1',
    index: '01',
    eyebrow: 'The Soft Power Edit',
    title: ['Power,', 'softened.'],
    copy: 'Powder-blue poplin beneath midnight ribbed knit. Authority, with a pulse.',
    model: '/assets/model-office.png',
    accent: '#d8c7b2',
    tone: 'warm',
    cta: 'Continue',
  },
  {
    id: 'ad-2',
    index: '02',
    eyebrow: 'The Boardroom Edit',
    title: ['Tailored,', 'never tamed.'],
    copy: 'Prince-of-Wales check, a chocolate silk tie, a gold-capped heel that means business.',
    model: '/assets/model-check.png',
    accent: '#c9b49d',
    tone: 'warm',
    cta: 'Continue',
  },
  {
    id: 'ad-3',
    index: '03',
    eyebrow: 'Lavender Hour',
    title: ['A little joy,', 'elegantly worn.'],
    copy: 'Brushed lavender fleece, butter-soft leather, and gold that catches the evening light.',
    model: '/assets/model-lavender.png',
    accent: '#e3d3b2',
    tone: 'warm',
    cta: 'Enter the boutique',
  },
];

export const collections = [
  {
    id: 'soft-power',
    name: 'The Soft Power Edit',
    note: 'Quietly bold. Entirely you.',
    look: '/assets/looks/look-office.jpg',
    lookAlt:
      'Lookbook plate: midnight navy ribbed knit midi dress layered over a powder-blue striped shirt, with patent bow pumps, a black top-handle bag and gold jewellery.',
  },
  {
    id: 'boardroom',
    name: 'The Boardroom Edit',
    note: 'Tailoring, with teeth.',
    look: '/assets/looks/look-check.jpg',
    lookAlt:
      'Lookbook plate: Prince-of-Wales check tailored blazer and mini skirt with a white cotton shirt, chocolate silk necktie, gold-cap pumps and espresso leather handbag.',
  },
  {
    id: 'lavender',
    name: 'Lavender Hour',
    note: 'A softer kind of power.',
    look: '/assets/looks/look-lavender.jpg',
    lookAlt:
      'Lookbook plate: oversized brushed lavender fleece sweatshirt with a butter-yellow leather mini skirt, matching pumps and shoulder bag, gradient sunglasses and gold jewellery.',
  },
];

export const categories: { name: Category | 'All pieces'; image?: string; note: string }[] = [
  { name: 'All pieces', image: '/assets/products/denim-midi-skirt.jpg', note: 'The full wardrobe' },
  { name: 'Jeans and Leather Skirt', image: '/assets/products/denim-midi-skirt.jpg', note: 'Denim, leather, statement cuts' },
  { name: 'Jeans and Leather Trouser', note: 'Sleek, sharp, worn soft' },
  { name: 'Barrel Pants', note: 'The new trouser line' },
  { name: 'Adire and Aso Oke Skirt', note: 'Indigo and handwoven texture' },
  { name: 'Knit Tops', note: 'Soft layers, everyday' },
  { name: 'Blazer Jacket', note: 'Shoulders and structure' },
  { name: 'Corporate Dresses', note: 'Tailored for the room' },
];

export const occasionIds = [
  'leather-wrap-maxi',
  'scarlet-stripe-skirt',
  'marigold-feather-skirt',
  'emerald-draped-maxi',
  'rose-aline-maxi',
  'lilac-ribbed-maxi',
  'crystal-bow-denim-skirt',
  'sunlit-graphic-skirt',
];

export const popularSearches = [
  'Denim midi',
  'Leather skirt',
  'Crystal bow',
  'Asymmetric',
  'Lilac',
  'Midi',
];

