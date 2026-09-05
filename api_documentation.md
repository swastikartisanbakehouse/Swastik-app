# Swastik Platform - Mobile App API Documentation

API specification and database model schemas for the Swastik Mobile App & Admin integration.

---

## 1. Data Model Schemas

### 1.1 User Model (`User`)

| Field Name | Data Type | Requirement | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Read-only | Unique User ID |
| `name` | String | Optional | Customer full name |
| `email` | String (Email) | Required | Customer email address (Primary auth identifier) |
| `mobile_number` | String | Optional | Customer phone number |
| `whatsapp_number` | String | Optional | Mapped WhatsApp contact number |
| `addresses` | Array of Objects | Optional | Saved delivery addresses e.g. `[{"type": "Home", "address_line1": "Flat 402", "city": "Jaipur", "pincode": "302001", "is_default": true}]` |
| `is_staff` | Boolean | Read-only | Flag indicating if user is an Administrator |
| `is_superuser` | Boolean | Read-only | Superuser status flag |
| `created_at` | String (ISO DateTime) | Read-only | Account creation timestamp |

---

### 1.2 Category Model (`Category`)

| Field Name | Data Type | Requirement | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Read-only | Unique Category ID |
| `name` | String | Required | Category display name |
| `sector` | String (Enum) | Required | Sector choice: `BAKERY`, `DAIRY`, `SWEETS`, `CONFECTIONERY` |
| `sector_display` | String | Read-only | Human-readable sector name (e.g. "Dairy / Milk") |
| `description` | String | Optional | Category description |
| `image` | String (URL) | Optional | Cover image URL |
| `is_active` | Boolean | Optional | Active status flag (Default `true`) |
| `metadata` | Object (JSON) | Optional | Sector rules e.g. `{"supports_subscriptions": true, "supports_customization": true}` |
| `created_at` | String (ISO DateTime) | Read-only | Category creation timestamp |

---

### 1.3 Product Model (`Product`)

| Field Name | Data Type | Requirement | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Read-only | Unique Product ID |
| `sku` | String | Required | Unique Stock Keeping Unit code (e.g. `SW-BAK-001`, `SW-DAI-001`) |
| `name` | String | Required | Product display name |
| `category_id` | Integer | Write-only | Parent Category ID (used when creating/updating) |
| `category_detail` | Object (`Category`) | Read-only | Nested parent category details |
| `subcategory_name` | String | Optional | Subcategory classification (e.g. "Milk", "Cakes", "Namkeen") |
| `description` | String | Optional | Detailed product description |
| `price` | String (Decimal) | Required | Regular base price in INR |
| `discount_price` | String (Decimal) | Optional | Offer/Discounted price in INR |
| `tax_percentage` | String (Decimal) | Optional | Applicable GST/tax percentage (e.g. `5.00`, `18.00`) |
| `unit` | String | Required | Pack size/unit size (e.g. `1 L`, `500 g`, `400 g`, `2 Pcs`) |
| `stock_quantity` | Integer | Optional | Available stock quantity (Default `100`) |
| `is_available` | Boolean | Optional | In-stock status flag for ordering (Default `true`) |
| `is_active` | Boolean | Optional | Active catalog status flag (Default `true`) |
| `image` | String (URL) | Optional | Main product image URL |
| `brand` | String | Optional | Brand name (Default `"Swastik"`) |
| `tags` | Array of Strings | Optional | Search & filter tags e.g. `["fresh", "bestseller", "subscription-eligible"]` |
| `attributes` | Object (JSON) | Optional | Sector-specific custom attributes e.g. `{"fat_content": "6.0%", "shelf_life_days": 3, "eggless": true}` |
| `created_at` | String (ISO DateTime) | Read-only | Product creation timestamp |

---

## 2. API Endpoints Reference

### 2.1 Authentication APIs

#### 2.1.1 Register Customer
- **Method**: `POST`
- **URL**: `/api/auth/register/`
- **Auth**: None (Public)
- **Request Body**:
  ```json
  {
    "name": "John Customer",
    "email": "customer@swastik.com",
    "password": "CustomerPass123",
    "mobile_number": "9876543210",
    "whatsapp_number": "9876543210"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "token": "9944b09199c62bcf9418ad846d0e4bb7c16c408e",
    "user": {
      "id": 2,
      "name": "John Customer",
      "email": "customer@swastik.com",
      "mobile_number": "9876543210",
      "whatsapp_number": "9876543210",
      "addresses": [],
      "is_staff": false,
      "is_superuser": false,
      "created_at": "2026-08-30T19:23:54.120Z"
    }
  }
  ```

#### 2.1.2 Login Customer / Admin
- **Method**: `POST`
- **URL**: `/api/auth/login/`
- **Auth**: None (Public)
- **Request Body**:
  ```json
  {
    "email": "customer@swastik.com",
    "password": "CustomerPass123"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "token": "9944b09199c62bcf9418ad846d0e4bb7c16c408e",
    "user": {
      "id": 2,
      "name": "John Customer",
      "email": "customer@swastik.com",
      "mobile_number": "9876543210",
      "whatsapp_number": "9876543210",
      "addresses": [],
      "is_staff": false,
      "is_superuser": false,
      "created_at": "2026-08-30T19:23:54.120Z"
    }
  }
  ```

#### 2.1.3 Get Current User Profile
- **Method**: `GET`
- **URL**: `/api/auth/me/`
- **Auth Header**: `Authorization: Token <token>`
- **Response** (`200 OK`):
  ```json
  {
    "id": 2,
    "name": "John Customer",
    "email": "customer@swastik.com",
    "mobile_number": "9876543210",
    "whatsapp_number": "9876543210",
    "addresses": [
      {
        "type": "Home",
        "address_line1": "Flat 402, Sunshine Apartments",
        "city": "Jaipur",
        "pincode": "302001",
        "is_default": true
      }
    ],
    "is_staff": false,
    "is_superuser": false,
    "created_at": "2026-08-30T19:23:54.120Z"
  }
  ```

#### 2.1.4 Logout
- **Method**: `POST`
- **URL**: `/api/auth/logout/`
- **Auth Header**: `Authorization: Token <token>`
- **Response** (`200 OK`):
  ```json
  {
    "message": "Successfully logged out."
  }
  ```

---

### 2.2 Category APIs

#### 2.2.1 List Active Categories
- **Method**: `GET`
- **URL**: `/api/categories/`
- **Auth**: None (Public)
- **Response** (`200 OK`):
  ```json
  [
    {
      "id": 1,
      "name": "Bakery",
      "sector": "BAKERY",
      "sector_display": "Bakery",
      "description": "Freshly baked breads, artisanal cakes, cookies, and pastries.",
      "image": null,
      "is_active": true,
      "metadata": {
        "supports_preorder": true,
        "supports_customization": true,
        "popular_subcategories": ["Breads", "Cakes", "Pastries", "Cookies"]
      },
      "created_at": "2026-08-30T19:23:54.140Z"
    },
    {
      "id": 2,
      "name": "Dairy / Milk",
      "sector": "DAIRY",
      "sector_display": "Dairy / Milk",
      "description": "Pure farm-fresh milk, paneer, fresh curd, ghee, and butter.",
      "image": null,
      "is_active": true,
      "metadata": {
        "supports_subscriptions": true,
        "subscription_frequencies": ["Daily", "Alternate Days", "Weekly", "Monthly"]
      },
      "created_at": "2026-08-30T19:23:54.145Z"
    }
  ]
  ```

#### 2.2.2 Get Category Details
- **Method**: `GET`
- **URL**: `/api/categories/{id}/`
- **Auth**: None (Public)
- **Response** (`200 OK`): Single `Category` object

#### 2.2.3 Admin Create Category
- **Method**: `POST`
- **URL**: `/api/admin/categories/`
- **Auth Header**: `Authorization: Token <admin_token>`
- **Request Body**:
  ```json
  {
    "name": "Confectionery & Snacks",
    "sector": "CONFECTIONERY",
    "description": "Crispy savouries, namkeens, chocolates, chips, and beverages.",
    "is_active": true,
    "metadata": {
      "supports_combos": true
    }
  }
  ```
- **Response** (`201 Created`): Single `Category` object

#### 2.2.4 Admin Update Category
- **Method**: `PATCH`
- **URL**: `/api/admin/categories/{id}/`
- **Auth Header**: `Authorization: Token <admin_token>`
- **Request Body**: Partial fields to update
- **Response** (`200 OK`): Updated `Category` object

#### 2.2.5 Admin Delete Category
- **Method**: `DELETE`
- **URL**: `/api/admin/categories/{id}/`
- **Auth Header**: `Authorization: Token <admin_token>`
- **Response** (`24 No Content`)

---

### 2.3 Product Catalogue APIs

#### 2.3.1 List & Filter Products
- **Method**: `GET`
- **URL**: `/api/products/`
- **Auth**: None (Public)
- **Supported Query Parameters**:
  - `sector`: Filter by sector enum (`BAKERY`, `DAIRY`, `SWEETS`, `CONFECTIONERY`)
  - `category_id`: Filter by integer category ID
  - `sku`: Filter by exact SKU string (e.g. `SW-DAI-001`)
  - `in_stock`: Filter by stock availability (`true` or `false`)
  - `subcategory`: Filter by subcategory string
  - `search`: Keyword search matching name, description, SKU, brand, subcategory
- **Example Requests**:
  - `/api/products/?sector=DAIRY`
  - `/api/products/?search=Milk`
  - `/api/products/?in_stock=true`
- **Response** (`200 OK`):
  ```json
  [
    {
      "id": 3,
      "sku": "SW-DAI-001",
      "name": "Full Cream Fresh Milk",
      "category_id": 2,
      "category_detail": {
        "id": 2,
        "name": "Dairy / Milk",
        "sector": "DAIRY",
        "sector_display": "Dairy / Milk",
        "description": "Pure farm-fresh milk, paneer, fresh curd, ghee, and butter.",
        "image": null,
        "is_active": true,
        "metadata": {
          "supports_subscriptions": true
        },
        "created_at": "2026-08-30T19:23:54.145Z"
      },
      "subcategory_name": "Milk",
      "description": "Pasteurized rich full cream milk delivered fresh every morning.",
      "price": "68.00",
      "discount_price": "65.00",
      "tax_percentage": "0.00",
      "unit": "1 L",
      "stock_quantity": 500,
      "is_available": true,
      "is_active": true,
      "image": null,
      "brand": "Swastik Dairy",
      "tags": [
        "subscription-eligible",
        "daily-fresh",
        "pure-milk"
      ],
      "attributes": {
        "fat_content": "6.0%",
        "snf_content": "9.0%",
        "subscription_eligible": true,
        "delivery_window": "Morning 6:00 AM - 8:00 AM"
      },
      "created_at": "2026-08-30T19:23:54.160Z"
    }
  ]
  ```

#### 2.3.2 Get Product Details
- **Method**: `GET`
- **URL**: `/api/products/{id}/`
- **Auth**: None (Public)
- **Response** (`200 OK`): Single `Product` object

#### 2.3.3 List Products by Category ID
- **Method**: `GET`
- **URL**: `/api/categories/{category_id}/products/`
- **Auth**: None (Public)
- **Response** (`200 OK`): Array of `Product` objects

#### 2.3.4 Admin Create Product
- **Method**: `POST`
- **URL**: `/api/admin/products/`
- **Auth Header**: `Authorization: Token <admin_token>`
- **Request Body**:
  ```json
  {
    "sku": "SW-BAK-003",
    "name": "Butter Croissant (2 Pack)",
    "category_id": 1,
    "subcategory_name": "Pastries",
    "description": "Flaky french butter croissants freshly baked daily.",
    "price": "120.00",
    "discount_price": "105.00",
    "tax_percentage": "5.00",
    "unit": "2 Pcs",
    "stock_quantity": 50,
    "is_available": true,
    "is_active": true,
    "brand": "Swastik Bakery",
    "tags": ["fresh", "french-style", "butter"],
    "attributes": {
      "shelf_life_days": 2,
      "heating_instruction": "Warm for 10 seconds in microwave"
    }
  }
  ```
- **Response** (`201 Created`): Single `Product` object

#### 2.3.5 Admin List All Products (Includes Inactive)
- **Method**: `GET`
- **URL**: `/api/admin/products/`
- **Auth Header**: `Authorization: Token <admin_token>`
- **Response** (`200 OK`): Array of all `Product` objects

#### 2.3.6 Admin Update Product
- **Method**: `PATCH`
- **URL**: `/api/admin/products/{id}/`
- **Auth Header**: `Authorization: Token <admin_token>`
- **Request Body**: Partial fields to update e.g. `{"price": "42.00", "stock_quantity": 200}`
- **Response** (`200 OK`): Updated `Product` object

#### 2.3.7 Admin Delete Product
- **Method**: `DELETE`
- **URL**: `/api/admin/products/{id}/`
- **Auth Header**: `Authorization: Token <admin_token>`
- **Response** (`204 No Content`)
