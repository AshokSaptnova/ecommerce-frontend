// Product data structure based on your PDF
export const products = [
  {
    id: 1,
    name: "SAPTNOVA",
    category: "General Health",
    tagline: "Standard prescription for General Fatigue, Weakness, Anemia, Frequent Illness, Malnutrition...",
    image: "/images/saptnova.jpg", // You can add product images later
    packing: "60 Veg. Capsules & 20 Veg. Capsules",
    dosage: "1-2 Capsule twice a day or as directed by the physician",
    benefits: [
      "Helps to Prevent Deficiency of Vitamins",
      "Rich Source of Iron, Improves Hemoglobin Level", 
      "Maintain Normal function of Bones & Muscles",
      "Protect Body Tissues from Oxidative Damage"
    ],
    ingredients: [
      { name: "Ashwagandha (Withania somnifera)", amount: "50 mg", description: "Adaptogenic herb that helps reduce stress, boost energy, and support immune resilience" },
      { name: "Safed Musli (Chlorophytum borivilianum)", amount: "40 mg", description: "Natural tonic that enhances stamina, physical strength, and immune function" },
      { name: "Shatavari (Asparagus racemosus)", amount: "40 mg", description: "Rejuvenative herb that supports hormonal balance and strengthens immunity" },
      { name: "Arjun Chhal (Terminalia arjuna)", amount: "40 mg", description: "Cardioprotective bark rich in antioxidants that promotes heart health and immune support" },
      { name: "Gokshura (Tribulus terrestris)", amount: "40 mg", description: "Vitality booster that supports urinary health and enhances overall strength and immunity" },
      { name: "Loh Bhasma (Purified Iron Calc)", amount: "30 mg", description: "Classical Ayurvedic iron supplement that improves hemoglobin and energy levels" },
      { name: "Shankh Bhasma (Purified Conch Shell Calc)", amount: "30 mg", description: "Natural source of calcium that supports digestion and mineral absorption" },
      { name: "Mandur Bhasma (Purified Iron Oxide Calc)", amount: "30 mg", description: "Iron-rich preparation that helps manage anemia and boosts vitality" },
      { name: "Hadjod (Cissus quadrangularis)", amount: "30 mg", description: "Bone-strengthening herb that aids in bone healing and supports musculoskeletal health" },
      { name: "Sonth (Zingiber officinale)", amount: "30 mg", description: "Digestive stimulant with anti-inflammatory and antioxidant effects to enhance health" },
      { name: "Dashmool (Group of 10 Roots)", amount: "30 mg", description: "Traditional blend of roots known to reduce inflammation and rejuvenate the body" },
      { name: "Shilajit (Asphaltum punjabinum)", amount: "30 mg", description: "Mineral-rich substance that boosts energy, stamina and nutrient assimilation" },
      { name: "Aloe Vera (Aloe barbadensis miller)", amount: "30 mg", description: "Detoxifying and nutrient-rich herb that supports digestive and immune health" },
      { name: "Sat Giloy (Tinospora cordifolia)", amount: "25 mg", description: "Renowned immune modulator that enhances resistance to infections and detoxification" },
      { name: "Amla (Emblica officinalis)", amount: "25 mg", description: "Rich source of natural Vitamin C & antioxidants that strengthen immunity and vitality" }
    ]
  },
  {
    id: 2,
    name: "MVNova",
    category: "Multivitamins",
    tagline: "Multivitamins with Calcium & Iron",
    image: "/images/mvnova.jpg",
    packing: "60 Tablets",
    dosage: "1-2 tablets daily or as directed by physician",
    benefits: [
      "Complete multivitamin supplement",
      "Rich in Calcium and Iron",
      "Supports bone health",
      "Boosts energy levels"
    ],
    ingredients: [
      // Add MVNova specific ingredients here
    ]
  },
  // Add more products here...
  {
    id: 3,
    name: "YakritNova",
    category: "Liver Health",
    tagline: "High Potent Herbal Extracts in Veg. Capsule for Liver Detox and Enzyme Support",
    image: "/images/yakritnova.jpg",
    packing: "60 Veg. Capsules & 20 Veg. Capsules",
    dosage: "1-2 Capsule twice a day or as directed by the physician",
    benefits: [
      "Helps to Detoxify Liver & Kidney",
      "Helps to Increase the Production of Bile",
      "Promotes Alcohol Metabolism & Prevents Liver Damage",
      "Cure Jaundice & Lack of Appetite"
    ],
    ingredients: [
      { name: "Chitraka Mool (Plumbago zeylanica)", amount: "60mg", description: "Stimulates liver function and improves digestion" },
      { name: "Pitpapda (Fumaria parviflora)", amount: "50mg", description: "Supports liver detoxification and relieves skin disorders" },
      { name: "Bhuimi Amla (Phyllanthus niruri)", amount: "50mg", description: "Protects liver cells and helps manage hepatitis and jaundice" },
      { name: "Triphala (Emblica officinalis, Terminalia bellirica, Terminalia chebula)", amount: "50mg", description: "Acts as a gentle cleanser and improves digestive health" },
      { name: "Sarpunkha (Tephrosia purpurea)", amount: "40mg", description: "Aids in liver regeneration and supports bile secretion" },
      { name: "Jeera (Cuminum cyminum)", amount: "30mg", description: "Enhances digestion & relieves bloating & indigestion" },
      { name: "Papaya Fruit (Carica papaya)", amount: "30mg", description: "Aids enzyme production and promotes healthy digestion" },
      { name: "Kasni (Cichorium intybus)", amount: "30mg", description: "Strengthens liver function & acts as a mild laxative" },
      { name: "Punarnava (Boerhavia diffusa)", amount: "30mg", description: "Reduces liver inflammation and supports kidney-liver health" },
      { name: "Ajwain (Trachyspermum ammi)", amount: "30mg", description: "Improves digestive fire and relieves gas and indigestion" },
      { name: "Kutki (Picrorhiza kurroa)", amount: "25mg", description: "Powerful hepatoprotective herb that supports liver detox" },
      { name: "Kalmegh (Andrographis paniculata)", amount: "25mg", description: "Protects liver cells and enhances bile flow" },
      { name: "Makoi (Solanum nigrum)", amount: "25mg", description: "Soothes liver inflammation & helps treat liver disorders" },
      { name: "Pippali (Piper longum)", amount: "15mg", description: "Improves bioavailability of nutrients and supports digestion" },
      { name: "Sat Giloy (Tinospora cordifolia)", amount: "10mg", description: "Boosts immunity and acts as a liver detoxifier" }
    ]
  },
  {
    id: 4,
    name: "MadhuNova", 
    category: "Diabetes Care",
    tagline: "Natural Diabetes Management",
    image: "/images/madhunova.jpg",
    packing: "60 Capsules",
    dosage: "1-2 capsules twice daily",
    benefits: [
      "Helps manage blood sugar",
      "Natural diabetes support",
      "Improves glucose metabolism",
      "Supports pancreatic function"
    ],
    ingredients: []
  },
  {
    id: 5,
    name: "InsuWish",
    category: "Diabetes Care", 
    tagline: "Insulin Support Formula",
    image: "/images/insuwish.jpg",
    packing: "60 Capsules",
    dosage: "1-2 capsules daily",
    benefits: [
      "Supports insulin sensitivity",
      "Helps regulate blood sugar",
      "Natural glucose control",
      "Metabolic support"
    ],
    ingredients: []
  },
  {
    id: 6,
    name: "Cardiowish",
    category: "Heart Health",
    tagline: "Heart Health Support",
    image: "/images/cardiowish.jpg", 
    packing: "60 Capsules",
    dosage: "1-2 capsules twice daily",
    benefits: [
      "Supports cardiovascular health",
      "Maintains healthy blood pressure",
      "Strengthens heart muscles",
      "Improves circulation"
    ],
    ingredients: []
  }
];

// You can add more products following the same structure