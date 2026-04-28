const bcrypt = require("bcryptjs");
const env = require("../config/env");
const { connectDB, mongoose } = require("../config/db");
const Category = require("../models/Category");
const BusinessInfo = require("../models/BusinessInfo");
const InstagramPost = require("../models/InstagramPost");
const Review = require("../models/Review");
const AdminUser = require("../models/AdminUser");

const seedCategories = [
  {
    name: "Anarkali-style gown",
    emoji: "*",
    category: "Lehenga",
    desc: "Flowing Anarkali-style gowns designed with graceful flare, elegant structure, and occasion-ready detailing.",
    img: "/media/collections/anarkali-style-gown.webp",
  },
  {
    name: "Salwar Suit",
    emoji: "*",
    category: "Kurti",
    desc: "Graceful salwar suits tailored with refined finishing, timeless comfort, and an elegant festive presence.",
    img: "/media/collections/salwar-suit.webp",
  },
  {
    name: "Blouse",
    emoji: "*",
    category: "Blouse",
    desc: "Bespoke blouse designs from classic to bold, tailored for statement backs, precise fitting, and rich detail.",
    img: "/media/collections/blouse.webp",
  },
  {
    name: "Saree",
    emoji: "*",
    category: "Western Wear",
    desc: "Elegant drapes styled for timeless beauty, fluid fall, and an elevated celebratory look.",
    img: "/media/collections/saree.webp",
  },
];

const seedBusinessInfo = {
  key: "main",
  line1: "A-24, shree gopal nagar, Benad road",
  line2: "Near dhangbaag garden, Jaipur, Rajasthan 302012",
  phone: "+91 9928281971",
  email: "nandaniboutique772@gmail.com",
  hours: "Open all days, 24 hours",
  social: {
    instagram: "https://www.instagram.com/nandani_boutique_center/",
  },
};

const seedInstagramPosts = [
  {
    title: "Bridal Lehenga Set",
    caption:
      "A vibrant bridal lehenga set with rich gold detailing, structured blouse work, and a full celebratory flare.",
    imageUrl: "/media/posts/bridal-lehenga-set.webp",
    instagramUrl: "https://www.instagram.com/p/C3k9-example-1/",
    postedDate: new Date("2026-03-01"),
    type: "image",
    isFeatured: true,
    containsPerson: true,
  },
  {
    title: "Pastel Embroidered Lehenga",
    caption:
      "A soft pastel lehenga with delicate embroidery and tassel accents for graceful festive dressing.",
    imageUrl: "/media/posts/pastel-embroidered-lehenga.webp",
    instagramUrl: "https://www.instagram.com/p/C3k9-example-2/",
    postedDate: new Date("2026-02-01"),
    type: "image",
    isFeatured: false,
    containsPerson: true,
  },
  {
    title: "Pink Puff-Sleeve Blouse",
    caption:
      "A bright pink designer blouse featuring puff sleeves, a statement back, and playful festive energy.",
    imageUrl: "/media/posts/pink-puff-sleeve-blouse.webp",
    instagramUrl: "https://www.instagram.com/p/C3k9-example-3/",
    postedDate: new Date("2026-01-01"),
    type: "image",
    isFeatured: false,
    containsPerson: true,
  },
  {
    title: "Ivory V-Neck Blouse",
    caption:
      "An elegant ivory blouse with a deep V-neck, soft embroidery, and a clean modern finish.",
    imageUrl: "/media/posts/ivory-v-neck-blouse.webp",
    instagramUrl: "https://www.instagram.com/p/C3k9-example-4/",
    postedDate: new Date("2025-12-01"),
    type: "image",
    isFeatured: false,
    containsPerson: true,
  },
  {
    title: "Silver Cutwork Blouse",
    caption:
      "A silver-toned blouse design with sculpted tailoring and a bold cutwork back made for festive styling.",
    imageUrl: "/media/posts/silver-cutwork-blouse.webp",
    instagramUrl: "https://www.instagram.com/p/C3k9-example-5/",
    postedDate: new Date("2025-11-01"),
    type: "image",
    isFeatured: false,
    containsPerson: true,
  },
  {
    title: "Marble Drape Saree",
    caption:
      "A graceful marble-drape saree look styled with understated elegance, fluid fall, and timeless charm.",
    imageUrl: "/media/posts/marble-drape-saree.webp",
    instagramUrl: "https://www.instagram.com/p/C3k9-example-6/",
    postedDate: new Date("2025-10-01"),
    type: "image",
    isFeatured: true,
    containsPerson: true,
  },
];

const seedReviews = [
  {
    name: "Priya Sharma",
    location: "Jaipur",
    rating: 5,
    text: "Absolutely breathtaking work. My bridal lehenga was stitched to perfection.",
    avatar: "PS",
    isApproved: true,
  },
  {
    name: "Ananya Mehta",
    location: "Mumbai",
    rating: 5,
    text: "I ordered a custom blouse and the craftsmanship was excellent.",
    avatar: "AM",
    isApproved: true,
  },
  {
    name: "Ritu Agarwal",
    location: "Delhi",
    rating: 5,
    text: "Premium fabric, immaculate stitching, and a very flattering silhouette.",
    avatar: "RA",
    isApproved: true,
  },
];

async function run() {
  await connectDB();

  await Promise.all([
    Category.deleteMany({}),
    BusinessInfo.deleteMany({}),
    InstagramPost.deleteMany({}),
    Review.deleteMany({}),
  ]);

  await Category.insertMany(seedCategories);
  await BusinessInfo.create(seedBusinessInfo);
  await InstagramPost.insertMany(seedInstagramPosts);
  await Review.insertMany(seedReviews);

  const email = env.adminEmail.toLowerCase().trim();
  const passwordHash = await bcrypt.hash(env.adminPassword, 12);
  await AdminUser.findOneAndUpdate(
    { email },
    { email, passwordHash, role: "admin" },
    { upsert: true, returnDocument: "after" },
  );

  console.log("Seed complete");
  await mongoose.connection.close();
}

run().catch(async (error) => {
  console.error("Seed failed:", error.message);
  await mongoose.connection.close();
  process.exit(1);
});
