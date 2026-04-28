const media = {
  collections: {
    anarkali: "/media/collections/anarkali-style-gown.webp",
    salwar: "/media/collections/salwar-suit.webp",
    blouse: "/media/collections/blouse.webp",
    saree: "/media/collections/saree.webp",
  },
  posts: {
    bridalLehenga: "/media/posts/bridal-lehenga-set.webp",
    pastelLehenga: "/media/posts/pastel-embroidered-lehenga.webp",
    pinkBlouse: "/media/posts/pink-puff-sleeve-blouse.webp",
    ivoryBlouse: "/media/posts/ivory-v-neck-blouse.webp",
    silverBlouse: "/media/posts/silver-cutwork-blouse.webp",
    marbleSaree: "/media/posts/marble-drape-saree.webp",
  },
};

export const initialCategories = [
  {
    id: "fallback-category-1",
    name: "Anarkali-style gown",
    emoji: "*",
    category: "Lehenga",
    desc: "Flowing Anarkali-style gowns designed with graceful flare, elegant structure, and occasion-ready detailing.",
    img: media.collections.anarkali,
  },
  {
    id: "fallback-category-2",
    name: "Salwar Suit",
    emoji: "*",
    category: "Kurti",
    desc: "Graceful salwar suits tailored with refined finishing, timeless comfort, and an elegant festive presence.",
    img: media.collections.salwar,
  },
  {
    id: "fallback-category-3",
    name: "Blouse",
    emoji: "*",
    category: "Blouse",
    desc: "Bespoke blouse designs from classic to bold, tailored for statement backs, precise fitting, and rich detail.",
    img: media.collections.blouse,
  },
  {
    id: "fallback-category-4",
    name: "Saree",
    emoji: "*",
    category: "Western Wear",
    desc: "Elegant drapes styled for timeless beauty, fluid fall, and an elevated celebratory look.",
    img: media.collections.saree,
  },
];

export const initialAddress = {
  line1: "A-24, Shree Gopal Nagar, Benad Road",
  line2: "Near Dhangbaag Garden, Jaipur, Rajasthan 302012",
  phone: "+91 9928281971",
  email: "nandaniboutique772@gmail.com",
  hours: "Open all days, 24 hours",
  social: {
    instagram: "https://www.instagram.com/nandani_boutique_center/",
  },
};

export const dynamicWords = [
  "Love",
  "Anarkali",
  "Blouse",
  "Salwar Suit",
  "Bridal wear",
  "Kid's dress",
  "Designer gown",
];

export function buildSocialLinks(social = {}) {
  return [
    { key: "instagram", name: "Instagram", href: social.instagram || "" },
  ].filter((link) => link.href);
}

export const initialInstagramPosts = [
  {
    id: "fallback-post-1",
    title: "Bridal Lehenga Set",
    name: "Bridal Lehenga Set",
    caption:
      "A vibrant bridal lehenga set with rich gold detailing, structured blouse work, and a full celebratory flare.",
    date: "Mar 2026",
    postedDate: "2026-03-01",
    img: media.posts.bridalLehenga,
    imageUrl: media.posts.bridalLehenga,
    url: "https://www.instagram.com/p/C3k9-example-1/",
    instagramUrl: "https://www.instagram.com/p/C3k9-example-1/",
    type: "image",
    isFeatured: true,
    containsPerson: true,
  },
  {
    id: "fallback-post-2",
    title: "Pastel Embroidered Lehenga",
    name: "Pastel Embroidered Lehenga",
    caption:
      "A soft pastel lehenga with delicate embroidery and tassel accents for graceful festive dressing.",
    date: "Feb 2026",
    postedDate: "2026-02-01",
    img: media.posts.pastelLehenga,
    imageUrl: media.posts.pastelLehenga,
    url: "https://www.instagram.com/p/C3k9-example-2/",
    instagramUrl: "https://www.instagram.com/p/C3k9-example-2/",
    type: "image",
    isFeatured: false,
    containsPerson: true,
  },
  {
    id: "fallback-post-3",
    title: "Pink Puff-Sleeve Blouse",
    name: "Pink Puff-Sleeve Blouse",
    caption:
      "A bright pink designer blouse featuring puff sleeves, a statement back, and playful festive energy.",
    date: "Jan 2026",
    postedDate: "2026-01-01",
    img: media.posts.pinkBlouse,
    imageUrl: media.posts.pinkBlouse,
    url: "https://www.instagram.com/p/C3k9-example-3/",
    instagramUrl: "https://www.instagram.com/p/C3k9-example-3/",
    type: "image",
    isFeatured: false,
    containsPerson: true,
  },
  {
    id: "fallback-post-4",
    title: "Ivory V-Neck Blouse",
    name: "Ivory V-Neck Blouse",
    caption:
      "An elegant ivory blouse with a deep V-neck, soft embroidery, and a clean modern finish.",
    date: "Dec 2025",
    postedDate: "2025-12-01",
    img: media.posts.ivoryBlouse,
    imageUrl: media.posts.ivoryBlouse,
    url: "https://www.instagram.com/p/C3k9-example-4/",
    instagramUrl: "https://www.instagram.com/p/C3k9-example-4/",
    type: "image",
    isFeatured: false,
    containsPerson: true,
  },
  {
    id: "fallback-post-5",
    title: "Silver Cutwork Blouse",
    name: "Silver Cutwork Blouse",
    caption:
      "A silver-toned blouse design with sculpted tailoring and a bold cutwork back made for festive styling.",
    date: "Nov 2025",
    postedDate: "2025-11-01",
    img: media.posts.silverBlouse,
    imageUrl: media.posts.silverBlouse,
    url: "https://www.instagram.com/p/C3k9-example-5/",
    instagramUrl: "https://www.instagram.com/p/C3k9-example-5/",
    type: "image",
    isFeatured: false,
    containsPerson: true,
  },
  {
    id: "fallback-post-6",
    title: "Marble Drape Saree",
    name: "Marble Drape Saree",
    caption:
      "A graceful marble-drape saree look styled with understated elegance, fluid fall, and timeless charm.",
    date: "Oct 2025",
    postedDate: "2025-10-01",
    img: media.posts.marbleSaree,
    imageUrl: media.posts.marbleSaree,
    url: "https://www.instagram.com/p/C3k9-example-6/",
    instagramUrl: "https://www.instagram.com/p/C3k9-example-6/",
    type: "image",
    isFeatured: true,
    containsPerson: true,
  },
];
