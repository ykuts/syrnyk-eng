# API Documentation

## Base URL
```
https://syrnyk-eng-api.up.railway.app
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. Protected routes require a Bearer token in the Authorization header.

### Request Header Format
```
Authorization: Bearer <token>
```

### Roles
- `CLIENT` (default)
- `ADMIN`

## Common Error Responses

```json
// 400 Bad Request
{
  "message": "Error description"
}

// 401 Unauthorized
{
  "message": "Authentication required"
}

// 403 Forbidden
{
  "message": "Access denied. Admin rights required."
}

// 500 Server Error
{
  "message": "Error message",
  "error": "Detailed error in development mode"
}
```

## Endpoints

### Authentication

#### POST /api/users/register
Creates a new user account.

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "phone": "string?"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "number",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string?",
    "role": "CLIENT|ADMIN",
    "createdAt": "datetime"
  },
  "token": "string"
}
```

#### POST /api/users/login
Authenticates a user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "number",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "role": "CLIENT|ADMIN"
  },
  "token": "string"
}
```

### User Management

#### GET /api/users/profile
Gets the authenticated user's profile.

**Required Authentication:** Yes

#### PUT /api/users/profile
Updates user profile.

**Required Authentication:** Yes

**Request Body:**
```json
{
  "firstName": "string?",
  "lastName": "string?",
  "phone": "string?",
  "preferredDeliveryLocation": "string?"
}
```

#### PUT /api/users/password
Changes user password.

**Required Authentication:** Yes

**Request Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

### Products

#### GET /api/products
Gets all products.

**Response:** Array of products with categories

#### GET /api/products/:id
Gets a single product.

#### POST /api/products/add
Creates a new product.

**Required Role:** ADMIN

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "descriptionFull": "string",
  "price": "decimal",
  "weight": "string",
  "image": "string",
  "images": "string[]",
  "umovy": "string",
  "recipe": "string",
  "assortment": "string[]",
  "stock": "number",
  "categoryId": "number",
  "isActive": "boolean"
}
```

#### PUT /api/products/:id
Updates a product.

**Required Role:** ADMIN

#### DELETE /api/products/:id
Deletes a product.

**Required Role:** ADMIN

### Orders

#### POST /api/orders
Creates a new order.

**Required Authentication:** Yes

**Request Body:**
```json
{
  "deliveryType": "PICKUP|ADDRESS|RAILWAY_STATION",
  "totalAmount": "decimal",
  "paymentMethod": "CREDIT_CARD|DEBIT_CARD|BANK_TRANSFER|TWINT|CASH",
  "notesClient": "string?",
  "items": [{
    "productId": "number",
    "quantity": "number",
    "price": "decimal"
  }],
  "addressDelivery": {
    "street": "string",
    "house": "string",
    "apartment": "string?",
    "city": "string",
    "postalCode": "string"
  },
  "stationDelivery": {
    "stationId": "number",
    "meetingTime": "datetime"
  },
  "pickupDelivery": {
    "storeId": "number",
    "pickupTime": "datetime"
  }
}
```

#### GET /api/orders
Gets user's orders.

**Required Authentication:** Yes

#### PATCH /api/orders/:orderId/status
Updates order status.

**Required Role:** ADMIN

**Request Body:**
```json
{
  "status": "PENDING|CONFIRMED|DELIVERED|CANCELLED"
}
```

### Cart

#### GET /api/cart
Gets user's cart.

**Required Authentication:** Yes

#### POST /api/cart/add
Adds item to cart.

**Required Authentication:** Yes

**Request Body:**
```json
{
  "productId": "number",
  "quantity": "number"
}
```

#### DELETE /api/cart/remove/:id
Removes item from cart.

**Required Authentication:** Yes

### Categories

#### GET /api/categories
Gets all categories.

#### POST /api/categories
Creates a new category.

**Required Role:** ADMIN

**Request Body:**
```json
{
  "name": "string",
  "description": "string?"
}
```

### Railway Stations

#### GET /api/railway-stations
Gets all stations.

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `city`: Filter by city

#### GET /api/railway-stations/:id
Gets station by ID.

#### GET /api/railway-stations/by-city/:city
Gets stations by city.

#### POST /api/railway-stations
Creates a new station.

**Required Role:** ADMIN

**Request Body:**
```json
{
  "city": "string",
  "name": "string",
  "meetingPoint": "string",
  "photo": "string?"
}
```

### File Upload

#### POST /api/upload/products
Uploads product images.

**Required Role:** ADMIN

**Content-Type:** multipart/form-data
- `images`: Up to 10 image files (jpeg, jpg, png, webp)

#### POST /api/upload/stations
Uploads station image.

**Required Role:** ADMIN

**Content-Type:** multipart/form-data
- `photo`: Single image file (jpeg, jpg, png, webp)

## Notes

- All timestamps are in ISO 8601 format
- File size limit: 10MB per file
- Supported image formats: JPEG, JPG, PNG, WebP
