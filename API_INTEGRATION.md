# SAPTNOVA Product Catalog - API Integration Guide

## 🚀 Dynamic Backend Integration

Your React application now fetches product data dynamically from your backend API at `http://127.0.0.1:8000/products`.

## 📡 API Endpoints Expected

### 1. Get All Products
```
GET http://127.0.0.1:8000/products
```
**Response Format:**
```json
[
  {
    "id": 1,
    "name": "SAPTNOVA",
    "category": "General Health",
    "tagline": "Standard prescription for General Fatigue...",
    "image": "/images/saptnova.jpg",
    "packing": "60 Veg. Capsules & 20 Veg. Capsules",
    "dosage": "1-2 Capsule twice a day...",
    "benefits": [
      "Helps to Prevent Deficiency of Vitamins",
      "Rich Source of Iron..."
    ],
    "ingredients": [
      {
        "name": "Ashwagandha (Withania somnifera)",
        "amount": "50 mg",
        "description": "Adaptogenic herb that helps reduce stress..."
      }
    ]
  }
]
```

### 2. Get Single Product
```
GET http://127.0.0.1:8000/products/{id}
```

### 3. Search Products (Optional)
```
GET http://127.0.0.1:8000/products/search?q=saptnova&category=General Health
```

## 🔧 Features Implemented

### ✅ **Fallback System**
- If API is not available, app uses fallback data
- No crashes or blank screens
- Seamless user experience

### ✅ **Loading States** 
- Beautiful loading spinners
- Product catalog shows "Loading products..."
- Presentation mode shows "Loading Presentation..."

### ✅ **Error Handling**
- User-friendly error messages
- Retry buttons for failed requests
- Graceful degradation

### ✅ **Real-time Updates**
- Data refreshes from API on each visit
- No need to rebuild app for content changes
- Dynamic product management

## 🛠 Backend Requirements

Your backend should return JSON data matching this structure:

```javascript
{
  id: number,                    // Unique product ID
  name: string,                 // Product name (e.g., "SAPTNOVA")
  category: string,             // Category (e.g., "General Health")
  tagline: string,              // Main description
  image: string,                // Image URL/path
  packing: string,              // Packing info
  dosage: string,               // Dosage instructions
  benefits: string[],           // Array of benefit strings
  ingredients: [                // Array of ingredient objects
    {
      name: string,             // Ingredient name
      amount: string,           // Dosage amount
      description: string       // Description
    }
  ]
}
```

## 🔄 CORS Configuration

Add these headers to your backend API:

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## 🚀 Testing the Integration

1. **Start your backend server** on `http://127.0.0.1:8000`
2. **Start React app**: `npm start`
3. **Check browser console** for API calls
4. **Verify data** appears in both catalog and presentation modes

## 📝 Configuration

Edit `src/config/index.js` to change API settings:

```javascript
export const config = {
  api: {
    baseUrl: 'http://127.0.0.1:8000',  // Your API URL
    timeout: 10000,
    enableFallback: true               // Use fallback data if API fails
  }
};
```

## 🎯 Next Steps

1. **Populate your backend** with all 30+ products
2. **Add product images** to your backend/storage
3. **Test API endpoints** with tools like Postman
4. **Deploy backend** and update API URL
5. **Add authentication** if needed

## 🔍 Debugging

### Check if API is working:
```bash
curl http://127.0.0.1:8000/products
```

### Common issues:
- ❌ **CORS errors**: Configure backend CORS
- ❌ **Network errors**: Check if backend is running
- ❌ **404 errors**: Verify API endpoint URLs
- ❌ **JSON format**: Ensure response matches expected structure

## 🎉 Benefits of Dynamic Integration

- ✅ **No app rebuilds** needed for content updates
- ✅ **Real-time product management**
- ✅ **Scalable architecture**
- ✅ **SEO-friendly** with proper server-side rendering
- ✅ **Content management** through backend dashboard

Your product catalog is now **fully dynamic** and ready for production! 🚀