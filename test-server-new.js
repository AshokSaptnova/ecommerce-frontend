// Simple test server for development - run with: node test-server-new.js
const http = require('http');
const url = require('url');

// Sample products data matching your real API structure
const sampleProducts = [
  {
    "product_id": "insuwish_granules",
    "name": "InsuWish – Ayurvedic Diabetes Care Granules",
    "tagline": "Balances Sugar Naturally, Revitalizes Health with Potent Ayurvedic Herbs and Wisdom.",
    "category": "Diabetes Care",
    "type": "Granules",
    "packing": "100 Gm",
    "mrp": 218,
    "old_mrp": 233,
    "dosage": "5 Gm Granules 1-2 times a day with luke warm water or as directed by the physician.",
    "image_url": "https://raw.githubusercontent.com/AshokSaptnova/saptnova-assets/refs/heads/main/InsuWish.jpg",
    "id": 1,
    "benefits": [
      {
        "text": "Manage Diabetes Naturally",
        "id": 9
      },
      {
        "text": "Helps to stimulate insulin release in pancreas",
        "id": 10
      },
      {
        "text": "Improve Physical Weakness",
        "id": 11
      },
      {
        "text": "Support metabolism management",
        "id": 12
      },
      {
        "text": "Helps to Lower Cholesterol Naturally",
        "id": 13
      }
    ],
    "ingredients": [
      {
        "name": "Gurmar",
        "latin": "Gymnema sylvestre",
        "quantity": "2200Mg",
        "description": "Helps reduce blood sugar levels by suppressing sweet taste and enhancing insulin function.",
        "id": 6
      },
      {
        "name": "Karela Beej",
        "latin": "Momordica charantia",
        "quantity": "600Mg",
        "description": "Supports glucose metabolism and improves insulin sensitivity.",
        "id": 7
      }
    ]
  },
  {
    "product_id": "madhunova_powder",
    "name": "MadhuNova – Herbal Diabetes Care Powder",
    "tagline": "Manage Diabetes & Lower Cholesterol Naturally.",
    "category": "Diabetes Care",
    "type": "Powder",
    "packing": "100 Gm",
    "mrp": 187,
    "old_mrp": 200,
    "dosage": "5 Gm Powder 1-2 times a day with luke warm water or as directed by the physician.",
    "image_url": "https://raw.githubusercontent.com/AshokSaptnova/saptnova-assets/refs/heads/main/MadhuNova%20Powder.jpg",
    "id": 3,
    "benefits": [
      {
        "text": "Helps stimulate insulin release in pancreas.",
        "id": 14
      },
      {
        "text": "May manage metabolism management.",
        "id": 15
      },
      {
        "text": "Helps to Lower Cholesterol Naturally.",
        "id": 16
      },
      {
        "text": "Improve Physical Weakness.",
        "id": 17
      }
    ],
    "ingredients": [
      {
        "name": "Gurmar",
        "latin": "Gymnema sylvestre",
        "quantity": "220mg",
        "description": "Helps reduce sugar cravings and supports healthy blood sugar levels by promoting insulin function.",
        "id": 8
      },
      {
        "name": "Karela Beej",
        "latin": "Momordica charantia",
        "quantity": "100mg",
        "description": "Contains polypeptide-p that mimics insulin, aiding in lowering blood glucose levels.",
        "id": 9
      },
      {
        "name": "Shilajit",
        "latin": "Asphaltum punjabianum",
        "quantity": "70mg",
        "description": "Enhances energy, supports pancreatic function, and improves glucose metabolism.",
        "id": 10
      },
      {
        "name": "Chirata",
        "latin": "Swertia chirata",
        "quantity": "55mg",
        "description": "Detoxifies the body and helps in naturally lowering elevated blood sugar.",
        "id": 11
      },
      {
        "name": "Ashwagandha",
        "latin": "Withania somnifera",
        "quantity": "50mg",
        "description": "Reduces stress-induced hyperglycemia and supports adrenal and metabolic health.",
        "id": 12
      }
    ]
  },
  // Sample SAPTNOVA product for testing existing components
  {
    "product_id": "saptnova_capsules",
    "name": "SAPTNOVA",
    "tagline": "Standard prescription for General Fatigue, Weakness, Anemia, Frequent Illness, Malnutrition...",
    "category": "General Health",
    "type": "Capsules",
    "packing": "60 Veg. Capsules",
    "mrp": 299,
    "old_mrp": 350,
    "dosage": "1-2 Capsules twice daily or as directed by the physician.",
    "image_url": "https://raw.githubusercontent.com/AshokSaptnova/saptnova-assets/refs/heads/main/SAPTNOVA.jpg",
    "id": 2,
    "benefits": [
      {
        "text": "Helps to Prevent Deficiency of Vitamins",
        "id": 1
      },
      {
        "text": "Rich Source of Iron, Improves Hemoglobin Level",
        "id": 2
      },
      {
        "text": "Maintain Normal function of Bones & Muscles",
        "id": 3
      },
      {
        "text": "Protect Body Tissues from Oxidative Damage",
        "id": 4
      }
    ],
    "ingredients": [
      {
        "name": "Ashwagandha",
        "latin": "Withania somnifera",
        "quantity": "50 mg",
        "description": "Adaptogenic herb that helps reduce stress, boost energy, and support immune resilience",
        "id": 1
      },
      {
        "name": "Safed Musli",
        "latin": "Chlorophytum borivilianum",
        "quantity": "40 mg",
        "description": "Natural tonic that enhances stamina, physical strength, and immune function",
        "id": 2
      },
      {
        "name": "Shatavari",
        "latin": "Asparagus racemosus",
        "quantity": "40 mg",
        "description": "Rejuvenative herb that supports hormonal balance and strengthens immunity",
        "id": 3
      }
    ]
  }
];

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;

  console.log(`${req.method} ${path}`);

  if (path === '/products' && req.method === 'GET') {
    // Return all products
    res.writeHead(200);
    res.end(JSON.stringify(sampleProducts));
  } 
  else if (path.match(/^\/products\/\d+$/) && req.method === 'GET') {
    // Return single product by ID
    const id = parseInt(path.split('/')[2]);
    const product = sampleProducts.find(p => p.id === id);
    
    if (product) {
      res.writeHead(200);
      res.end(JSON.stringify(product));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Product not found' }));
    }
  }
  else if (path === '/products/search' && req.method === 'GET') {
    // Search products
    let results = sampleProducts;
    
    if (query.q) {
      const searchTerm = query.q.toLowerCase();
      results = results.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.tagline.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    }
    
    if (query.category && query.category !== 'all') {
      results = results.filter(product => product.category === query.category);
    }
    
    res.writeHead(200);
    res.end(JSON.stringify(results));
  }
  else {
    // 404 for unknown routes
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const PORT = 8000;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ Test server running on http://127.0.0.1:${PORT}`);
  console.log(`📊 Sample data loaded: ${sampleProducts.length} products`);
  console.log('🌐 CORS enabled for localhost:3000');
  console.log('📋 Available endpoints:');
  console.log('   GET /products - Get all products');
  console.log('   GET /products/:id - Get product by ID');
  console.log('   GET /products/search?q=query&category=cat - Search products');
});