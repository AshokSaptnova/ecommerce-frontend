// Fallback products data - used when API is not available
export const fallbackProducts = [
  {
    product_id: "saptnova_capsules",
    id: 1,
    name: "SAPTNOVA",
    slug: "saptnova-capsules",
    category: { name: "General Health", id: 1 },
    type: "Capsules",
    tagline: "Standard prescription for General Fatigue, Weakness, Anemia, Frequent Illness, Malnutrition...",
    description: "SAPTNOVA is a comprehensive health supplement designed to combat general fatigue, weakness, and anemia. This powerful formulation combines the wisdom of Ayurveda with modern nutritional science to provide essential vitamins, minerals, and herbal extracts that support overall health and vitality.",
    short_description: "Premium Ayurvedic supplement for general health, fatigue, and nutritional support",
    images: [
      { image_url: "/images/saptnova.jpg", alt_text: "SAPTNOVA Capsules", is_primary: true },
      { image_url: "/images/placeholder.jpg", alt_text: "SAPTNOVA Benefits" }
    ],
    image_url: "/images/saptnova.jpg",
    packing: "60 Veg. Capsules & 20 Veg. Capsules",
    price: 299,
    mrp: 299,
    compare_price: 350,
    old_mrp: 350,
    stock_quantity: 45,
    weight: 120,
    dimensions: { length: 10, width: 6, height: 3 },
    sku: "SAPT-001",
    dosage: "1-2 Capsule twice a day or as directed by the physician",
    specifications: {
      organic: true,
      certifications: ["AYUSH", "GMP"],
      stats: {
        immunity_boost: { percentage: "95%", title: "Immunity Boost", description: "Enhances natural immune response and disease resistance" },
        energy_levels: { percentage: "88%", title: "Energy Enhancement", description: "Improves stamina and reduces fatigue significantly" },
        nutrient_absorption: { percentage: "92%", title: "Nutrient Absorption", description: "Optimizes vitamin and mineral absorption in the body" }
      },
      usage_instructions: [
        "Take 1-2 capsules twice daily with water",
        "Preferably consume 30 minutes before meals",
        "Continue for 2-3 months for best results",
        "Store in a cool, dry place away from sunlight"
      ],
      dosage: "1-2 capsules twice daily or as directed by physician",
      precautions: "Consult healthcare professional before use if pregnant, nursing, or taking medications"
    },
    benefits: [
      { text: "Helps to Prevent Deficiency of Vitamins", icon: "💊", description: "Provides essential vitamins A, B-complex, C, D, and E for optimal health", id: 1 },
      { text: "Rich Source of Iron, Improves Hemoglobin Level", icon: "🩸", description: "Contains bioavailable iron to combat anemia and boost blood health", id: 2 }, 
      { text: "Maintain Normal function of Bones & Muscles", icon: "💪", description: "Supports calcium absorption and muscle strength with vitamin D and magnesium", id: 3 },
      { text: "Protect Body Tissues from Oxidative Damage", icon: "🛡️", description: "Antioxidant properties help neutralize free radicals and prevent cellular damage", id: 4 },
      { text: "Boosts Natural Immunity", icon: "🌿", description: "Strengthens immune system with natural herbs and adaptogens", id: 5 },
      { text: "Enhances Energy & Vitality", icon: "⚡", description: "Combats fatigue and improves overall energy levels naturally", id: 6 }
    ],
    ingredients: [
      { name: "Ashwagandha", latin: "Withania somnifera", quantity: "50 mg", description: "Adaptogenic herb that helps reduce stress, boost energy, and support immune resilience", id: 1 },
      { name: "Safed Musli", latin: "Chlorophytum borivilianum", quantity: "40 mg", description: "Natural tonic that enhances stamina, physical strength, and immune function", id: 2 },
      { name: "Shatavari", latin: "Asparagus racemosus", quantity: "40 mg", description: "Rejuvenative herb that supports hormonal balance and strengthens immunity", id: 3 },
      { name: "Brahmi", latin: "Bacopa monnieri", quantity: "30 mg", description: "Brain tonic that improves memory, concentration, and mental clarity", id: 4 },
      { name: "Amalaki", latin: "Emblica officinalis", quantity: "100 mg", description: "Rich source of Vitamin C and natural antioxidants for immune support", id: 5 }
    ],
    reviews: [
      {
        user: { full_name: "Rajesh Kumar", username: "rajesh_k" },
        rating: 5,
        title: "Excellent Results!",
        comment: "Been using SAPTNOVA for 3 months. Significant improvement in energy levels and overall health. Highly recommended!",
        is_verified_purchase: true,
        created_at: "2024-12-15T10:30:00Z"
      },
      {
        user: { full_name: "Priya Sharma", username: "priya_s" },
        rating: 4,
        title: "Good Product",
        comment: "Good quality supplement. Noticed improvement in my iron levels after 2 months of use.",
        is_verified_purchase: true,
        created_at: "2024-12-10T15:45:00Z"
      },
      {
        user: { full_name: "Amit Patel", username: "amit_p" },
        rating: 5,
        title: "Amazing Quality",
        comment: "Pure ingredients, no side effects. My doctor also approved this supplement. Worth every penny!",
        is_verified_purchase: true,
        created_at: "2024-12-05T08:20:00Z"
      }
    ],
    vendor: {
      business_name: "SAPTNOVA Health Sciences",
      name: "SAPTNOVA"
    },
    requires_shipping: true,
    is_featured: true,
    tags: ["Ayurvedic", "Natural", "Immunity", "Energy", "Vitamins", "Iron", "Herbal"]
  },
  {
    product_id: "mvnova_tablets",
    id: 2,
    name: "MVNova",
    slug: "mvnova-multivitamin-tablets",
    category: { name: "Multivitamins", id: 2 },
    type: "Tablets",
    tagline: "Complete Multivitamins with Calcium & Iron for Daily Wellness",
    description: "MVNova is a comprehensive multivitamin supplement formulated to bridge nutritional gaps in your daily diet. Packed with essential vitamins, minerals, calcium, and iron, it supports bone health, energy metabolism, and overall vitality for active individuals.",
    short_description: "Complete daily multivitamin with calcium and iron for optimal health",
    images: [
      { image_url: "/images/mv-nova.jpg", alt_text: "MVNova Tablets", is_primary: true },
      { image_url: "/images/placeholder.jpg", alt_text: "MVNova Benefits" }
    ],
    image_url: "/images/mv-nova.jpg",
    packing: "60 Tablets",
    price: 199,
    mrp: 199,
    compare_price: 220,
    old_mrp: 220,
    stock_quantity: 32,
    weight: 80,
    dimensions: { length: 8, width: 5, height: 2 },
    sku: "MVN-002",
    dosage: "1-2 tablets daily or as directed by physician",
    specifications: {
      organic: false,
      certifications: ["GMP", "ISO"],
      stats: {
        daily_nutrition: { percentage: "100%", title: "Daily Nutrition", description: "Provides 100% RDA of essential vitamins and minerals" },
        bone_strength: { percentage: "85%", title: "Bone Support", description: "Calcium and Vitamin D for stronger bones and teeth" },
        energy_boost: { percentage: "78%", title: "Energy Support", description: "B-vitamins and iron for sustained energy throughout the day" }
      },
      usage_instructions: [
        "Take 1-2 tablets daily with or after meals",
        "Swallow whole with water, do not chew",
        "Best taken in the morning for energy support",
        "Store below 25°C in a dry place"
      ],
      dosage: "1-2 tablets daily with meals",
      precautions: "Do not exceed recommended dose. Keep out of reach of children."
    },
    benefits: [
      { text: "Complete multivitamin supplement", icon: "💊", description: "Contains all essential vitamins and minerals for daily health", id: 5 },
      { text: "Rich in Calcium and Iron", icon: "🦴", description: "Supports bone health and prevents iron deficiency anemia", id: 6 },
      { text: "Supports bone health", icon: "🏃", description: "Calcium, magnesium, and vitamin D for strong bones and mobility", id: 7 },
      { text: "Boosts energy levels", icon: "⚡", description: "B-complex vitamins and iron combat fatigue and improve stamina", id: 8 },
      { text: "Immune System Support", icon: "🛡️", description: "Vitamin C, D, and zinc strengthen immune defense", id: 9 },
      { text: "Antioxidant Protection", icon: "🌟", description: "Vitamins A, C, E protect against oxidative stress", id: 10 }
    ],
    ingredients: [
      { name: "Vitamin A", latin: "Retinol", quantity: "800 mcg", description: "Essential for vision, immune function, and skin health", id: 6 },
      { name: "Vitamin C", latin: "Ascorbic Acid", quantity: "60 mg", description: "Powerful antioxidant that boosts immunity and collagen production", id: 7 },
      { name: "Vitamin D3", latin: "Cholecalciferol", quantity: "400 IU", description: "Crucial for calcium absorption and bone health", id: 8 },
      { name: "Calcium Carbonate", latin: "", quantity: "200 mg", description: "Essential mineral for strong bones and teeth", id: 9 },
      { name: "Iron Fumarate", latin: "", quantity: "15 mg", description: "Prevents iron deficiency and supports oxygen transport", id: 10 },
      { name: "Vitamin B12", latin: "Cyanocobalamin", quantity: "2.5 mcg", description: "Important for nerve function and red blood cell formation", id: 11 }
    ],
    reviews: [
      {
        user: { full_name: "Sneha Gupta", username: "sneha_g" },
        rating: 5,
        title: "Best Daily Supplement",
        comment: "Taking MVNova for 6 months now. Great energy throughout the day and no more vitamin deficiencies!",
        is_verified_purchase: true,
        created_at: "2024-12-12T14:20:00Z"
      },
      {
        user: { full_name: "Vikram Singh", username: "vikram_s" },
        rating: 4,
        title: "Good Value for Money",
        comment: "Affordable multivitamin with good quality. Noticed improvement in my energy levels.",
        is_verified_purchase: true,
        created_at: "2024-12-08T09:15:00Z"
      }
    ],
    vendor: {
      business_name: "SAPTNOVA Health Sciences",
      name: "SAPTNOVA"
    },
    requires_shipping: true,
    is_featured: false,
    tags: ["Multivitamin", "Calcium", "Iron", "Energy", "Bones", "Daily Health"]
  },
  {
    product_id: "yakritnova_capsules",
    id: 3,
    name: "YakritNova",
    slug: "yakritnova-liver-health-capsules",
    category: { name: "Liver Health", id: 3 },
    type: "Capsules",
    tagline: "High Potent Herbal Extracts in Veg. Capsule for Liver Detox and Enzyme Support",
    description: "YakritNova is a specialized Ayurvedic formulation designed to support liver health and detoxification. This powerful blend of herbal extracts helps cleanse the liver, improve bile production, and protect against liver damage caused by toxins, alcohol, and poor lifestyle choices.",
    short_description: "Premium liver detox and hepatoprotective herbal supplement",
    images: [
      { image_url: "/images/yakrit-nova.jpg", alt_text: "YakritNova Capsules", is_primary: true },
      { image_url: "/images/placeholder.jpg", alt_text: "YakritNova Liver Benefits" }
    ],
    image_url: "/images/yakrit-nova.jpg",
    packing: "60 Veg. Capsules & 20 Veg. Capsules",
    price: 249,
    mrp: 249,
    compare_price: 280,
    old_mrp: 280,
    stock_quantity: 18,
    weight: 95,
    dimensions: { length: 9, width: 5, height: 3 },
    sku: "YKT-003",
    dosage: "1-2 Capsule twice a day or as directed by the physician",
    specifications: {
      organic: true,
      certifications: ["AYUSH", "Organic", "GMP"],
      stats: {
        liver_detox: { percentage: "90%", title: "Liver Detoxification", description: "Cleanses toxins and improves liver health naturally" },
        inflammation_reduction: { percentage: "84%", title: "Inflammation Reduction", description: "Reduces liver inflammation and protects cells from damage" },
        bile_production: { percentage: "81%", title: "Bile Enhancement", description: "Increases bile production for better fat digestion" }
      },
      usage_instructions: [
        "Take 1-2 capsules twice daily with warm water",
        "Consume 30 minutes before meals for better absorption",
        "Continue for 3-6 months for optimal liver health",
        "Avoid alcohol and processed foods during treatment"
      ],
      dosage: "1-2 capsules twice daily before meals",
      precautions: "Not recommended during pregnancy and breastfeeding. Consult physician if taking other medications."
    },
    benefits: [
      { text: "Helps to Detoxify Liver & Kidney", icon: "🌿", description: "Natural herbs eliminate toxins and support kidney function", id: 9 },
      { text: "Helps to Increase the Production of Bile", icon: "💚", description: "Improves bile secretion for better fat digestion and absorption", id: 10 },
      { text: "Promotes Alcohol Metabolism & Prevents Liver Damage", icon: "🛡️", description: "Protects liver cells from alcohol-induced damage and oxidative stress", id: 11 },
      { text: "Cure Jaundice & Lack of Appetite", icon: "🌟", description: "Helps treat jaundice symptoms and restores healthy appetite", id: 12 },
      { text: "Supports Fatty Liver Management", icon: "⚡", description: "Helps reduce liver fat accumulation and improves liver function", id: 13 },
      { text: "Boosts Liver Enzyme Function", icon: "🔬", description: "Enhances liver enzyme activity for optimal detoxification", id: 14 }
    ],
    ingredients: [
      { name: "Chitraka Mool", latin: "Plumbago zeylanica", quantity: "60mg", description: "Stimulates liver function, improves digestion, and enhances metabolism", id: 4 },
      { name: "Pitpapda", latin: "Fumaria parviflora", quantity: "50mg", description: "Supports liver detoxification, relieves skin disorders, and purifies blood", id: 5 },
      { name: "Kutki", latin: "Picrorhiza kurroa", quantity: "75mg", description: "Powerful hepatoprotective herb that shields liver from toxins", id: 12 },
      { name: "Bhumi Amla", latin: "Phyllanthus niruri", quantity: "40mg", description: "Natural liver tonic that supports liver regeneration and function", id: 13 },
      { name: "Kalmegh", latin: "Andrographis paniculata", quantity: "35mg", description: "Bitter herb that stimulates liver function and boosts immunity", id: 14 }
    ],
    reviews: [
      {
        user: { full_name: "Dr. Suresh Mehta", username: "dr_suresh" },
        rating: 5,
        title: "Excellent for Liver Health",
        comment: "As a physician, I recommend YakritNova to my patients with fatty liver. Excellent results in liver function tests!",
        is_verified_purchase: true,
        created_at: "2024-12-14T11:30:00Z"
      },
      {
        user: { full_name: "Ravi Agarwal", username: "ravi_a" },
        rating: 4,
        title: "Helped with Jaundice Recovery",
        comment: "Used during my jaundice recovery. Definitely helped improve my appetite and energy levels.",
        is_verified_purchase: true,
        created_at: "2024-12-09T16:45:00Z"
      },
      {
        user: { full_name: "Meera Nair", username: "meera_n" },
        rating: 5,
        title: "Pure Ayurvedic Quality",
        comment: "Excellent quality herbs. My liver function improved significantly after 3 months of use.",
        is_verified_purchase: true,
        created_at: "2024-12-06T12:15:00Z"
      }
    ],
    vendor: {
      business_name: "SAPTNOVA Health Sciences",
      name: "SAPTNOVA"
    },
    requires_shipping: true,
    is_featured: true,
    tags: ["Liver Health", "Detox", "Ayurvedic", "Hepatoprotective", "Jaundice", "Bile", "Herbal"],
    variants: [
      {
        id: "ykt_60",
        name: "Pack of 1 (60 Capsules)",
        quantity: 1,
        price_adjustment: 0,
        stock_quantity: 18,
        discount_percentage: 11
      },
      {
        id: "ykt_120",
        name: "Pack of 2 (120 Capsules)",
        quantity: 2,
        price_adjustment: 50,
        stock_quantity: 12,
        discount_percentage: 15,
        description: "Great value pack"
      }
    ]
  }
];

export default fallbackProducts;