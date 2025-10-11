# Vendor Panel Documentation

## Overview
The Vendor Panel is a comprehensive dashboard for vendors to manage their products, inventory, orders, and store profile in the multi-vendor eCommerce platform.

## Features

### 1. **Vendor Login**
- Secure authentication with email and password
- Role-based access control (vendors only)
- Automatic vendor profile retrieval
- Beautiful gradient design with green theme

### 2. **Dashboard**
- **Store Information Card**: Displays business details, contact info, and store status
- **Quick Stats**: 
  - Total Products count
  - Active Products count
  - Total Stock quantity
  - Low Stock alerts (items with < 10 units)
- **Recent Products**: Table view of latest products with name, price, stock, and status
- **Quick Actions**: Fast access buttons for common tasks

### 3. **Navigation Sidebar**
- Dashboard
- My Products (Product management)
- Add Product (Create new products)
- Orders (Order tracking)
- Inventory (Stock management)
- Store Profile (Edit vendor information)
- Reports (Analytics and insights)
- Settings (Account and store settings)

## How to Access

### URL
Navigate to: `http://localhost:3000/vendor`

### Login Credentials
To test the vendor panel, you need to:

1. **Create a vendor user in the database**:
```python
# Run this in your backend
python -c "
from app.database import SessionLocal
from app.models import User, Vendor, UserRole
from app.auth import get_password_hash

db = SessionLocal()

# Create vendor user
vendor_user = User(
    email='vendor@example.com',
    hashed_password=get_password_hash('vendor123'),
    role=UserRole.VENDOR,
    is_active=True
)
db.add(vendor_user)
db.commit()
db.refresh(vendor_user)

# Create vendor profile
vendor = Vendor(
    user_id=vendor_user.id,
    business_name='Sample Store',
    contact_email='vendor@example.com',
    contact_number='+1234567890',
    address='123 Business St, City, Country',
    is_active=True
)
db.add(vendor)
db.commit()

print(f'Vendor created: {vendor_user.email}')
db.close()
"
```

2. **Login with**:
   - Email: `vendor@example.com`
   - Password: `vendor123`

## Design Features

### Color Scheme
- **Primary**: Green gradient (#11998e to #38ef7d)
- **Background**: Light gray (#f5f5f7)
- **Cards**: White with subtle shadows
- **Warning**: Pink/Red gradient for low stock alerts

### Responsive Design
- Desktop: Full sidebar + content area
- Tablet: Narrower sidebar
- Mobile: Stacked layout with full-width sidebar

### User Experience
- Smooth transitions and hover effects
- Loading states for data fetching
- Error handling with user-friendly messages
- Status badges (Active/Inactive)
- Quick action buttons
- Intuitive navigation

## API Integration

The vendor panel integrates with the following backend endpoints:

### Authentication
- `POST /auth/login` - Vendor login
- `GET /auth/me` - Get current user info

### Vendor Operations
- `GET /vendors/me` - Get vendor profile
- `GET /vendors/{vendor_id}/products` - Get vendor's products
- `PUT /vendors/me` - Update vendor profile

## File Structure

```
frontend/src/components/
├── VendorPanel.js          # Main container component
├── VendorPanel.css         # Panel layout styles
├── VendorLogin.js          # Login component
├── VendorLogin.css         # Login styles
├── VendorDashboard.js      # Dashboard component
├── VendorDashboard.css     # Dashboard styles
├── VendorSidebar.js        # Navigation sidebar
└── VendorSidebar.css       # Sidebar styles
```

## Future Enhancements

The following sections are placeholders and will be implemented:

1. **My Products**: Full product listing with search, filter, and edit capabilities
2. **Add Product**: Form to create new products with image upload
3. **Orders**: Order management with status updates
4. **Inventory**: Advanced stock management and alerts
5. **Store Profile**: Edit vendor information and settings
6. **Reports**: Sales analytics, revenue charts, and insights
7. **Settings**: Account preferences and notification settings

## Differences from Admin Panel

| Feature | Admin Panel | Vendor Panel |
|---------|-------------|--------------|
| Color Theme | Purple/Blue | Green |
| Access Level | Platform-wide | Vendor-specific |
| User Management | ✅ | ❌ |
| Vendor Management | ✅ | ❌ |
| Product Management | All products | Own products only |
| Order Management | All orders | Own orders only |
| System Settings | ✅ | ❌ |

## Security

- Token-based authentication (JWT)
- Role verification on login
- Protected API endpoints
- Secure password handling
- Session management with localStorage

## Testing

To test the vendor panel:

1. Start the backend server:
```bash
cd backend
python start_server.py
```

2. Start the frontend:
```bash
cd frontend
npm start
```

3. Navigate to `http://localhost:3000/vendor`

4. Login with vendor credentials

5. Explore the dashboard and navigation

## Support

For issues or questions:
- Check the browser console for error messages
- Verify backend server is running on port 8000
- Ensure vendor user exists in the database
- Contact: support@ecommerce.com

---

**Version**: 1.0.0  
**Last Updated**: October 3, 2025  
**Author**: eCommerce Platform Team
