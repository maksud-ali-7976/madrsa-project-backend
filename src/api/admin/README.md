# Admin API Routes Documentation

This document provides comprehensive documentation for all admin API routes in the Qahween application.

## Base URL

All admin routes are prefixed with `/admin`

## Authentication

All admin routes require authentication using a Bearer token. The token must be included in the Authorization header:

```
Authorization: Bearer <your-token>
```

Admin authentication uses a separate Admin model with integer adminId and password fields.

## Admin Model

The Admin model has the following structure:

- `adminId` (number) - Unique integer identifier for the admin
- `password` (string) - Hashed password
- `isActive` (boolean) - Whether the admin account is active
- `createdAt` (Date) - Account creation timestamp
- `updatedAt` (Date) - Last update timestamp

## Routes Overview

### 1. Authentication (`/admin/auth`)

- **POST** `/admin/auth/login` - Admin login using adminId and password

### 2. Admin Management (`/admin/admins`)

- **GET** `/admin/admins` - Get all admin accounts with pagination
- **GET** `/admin/admins/:adminId` - Get admin by adminId
- **POST** `/admin/admins` - Create new admin account
- **PUT** `/admin/admins/:adminId` - Update admin account
- **DELETE** `/admin/admins/:adminId` - Delete admin account
- **GET** `/admin/admins/stats/overview` - Get admin statistics

### 3. Users Management (`/admin/users`)

- **GET** `/admin/users` - Get all users with pagination
- **GET** `/admin/users/:id` - Get user by ID
- **POST** `/admin/users` - Create new user
- **PUT** `/admin/users/:id` - Update user
- **DELETE** `/admin/users/:id` - Soft delete user
- **GET** `/admin/users/stats/overview` - Get user statistics

### 4. Plans Management (`/admin/plans`)

- **GET** `/admin/plans` - Get all plans with pagination
- **GET** `/admin/plans/:id` - Get plan by ID
- **POST** `/admin/plans` - Create new plan
- **PUT** `/admin/plans/:id` - Update plan
- **DELETE** `/admin/plans/:id` - Delete plan
- **GET** `/admin/plans/stats/overview` - Get plan statistics

### 5. Subscriptions Management (`/admin/subscriptions`)

- **GET** `/admin/subscriptions` - Get all subscriptions with pagination
- **GET** `/admin/subscriptions/:id` - Get subscription by ID
- **POST** `/admin/subscriptions` - Create new subscription
- **PUT** `/admin/subscriptions/:id` - Update subscription
- **DELETE** `/admin/subscriptions/:id` - Delete subscription
- **GET** `/admin/subscriptions/stats/overview` - Get subscription statistics

### 6. Revenue Management (`/admin/revenue`)

- **GET** `/admin/revenue` - Get all revenue records with pagination
- **GET** `/admin/revenue/:id` - Get revenue record by ID
- **POST** `/admin/revenue` - Create new revenue record
- **PUT** `/admin/revenue/:id` - Update revenue record
- **DELETE** `/admin/revenue/:id` - Delete revenue record
- **GET** `/admin/revenue/stats/overview` - Get revenue statistics

### 7. Readings Management (`/admin/readings`)

- **GET** `/admin/readings` - Get all readings with pagination
- **GET** `/admin/readings/:id` - Get reading by ID
- **POST** `/admin/readings` - Create new reading
- **PUT** `/admin/readings/:id` - Update reading
- **DELETE** `/admin/readings/:id` - Delete reading
- **GET** `/admin/readings/stats/overview` - Get reading statistics

### 8. User Images Management (`/admin/user-images`)

- **GET** `/admin/user-images` - Get all user images with pagination
- **GET** `/admin/user-images/:id` - Get user image by ID
- **POST** `/admin/user-images` - Create new user image
- **PUT** `/admin/user-images/:id` - Update user image
- **DELETE** `/admin/user-images/:id` - Delete user image
- **GET** `/admin/user-images/stats/overview` - Get user image statistics

### 9. Plan Languages Management (`/admin/plan-languages`)

- **GET** `/admin/plan-languages` - Get all plan languages with pagination
- **GET** `/admin/plan-languages/:id` - Get plan language by ID
- **POST** `/admin/plan-languages` - Create new plan language
- **PUT** `/admin/plan-languages/:id` - Update plan language
- **DELETE** `/admin/plan-languages/:id` - Delete plan language
- **GET** `/admin/plan-languages/stats/overview` - Get plan language statistics

### 10. Dashboard (`/admin/dashboard`)

- **GET** `/admin/dashboard/overview` - Get comprehensive dashboard statistics
- **GET** `/admin/dashboard/recent-activities` - Get recent activities

## Common Query Parameters

Most list endpoints support the following query parameters:

- `page` (number, default: 1) - Page number for pagination
- `limit` (number, default: 10) - Number of items per page
- `search` (string) - Search term for filtering
- `sortBy` (string, default: "createdAt") - Field to sort by
- `sortOrder` (string, default: "desc") - Sort order ("asc" or "desc")

## Response Format

All responses follow this standard format:

```json
{
	"status": true,
	"message": "Success message",
	"data": {
		// Response data
	},
	"meta": {
		// Pagination info (for list endpoints)
		"page": 1,
		"limit": 10,
		"total": 100,
		"totalPages": 10,
		"hasNext": true,
		"hasPrev": false
	}
}
```

## Error Responses

Error responses follow this format:

```json
{
	"status": false,
	"message": "Error message",
	"data": {}
}
```

Common HTTP status codes:

- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Models Overview

### Admin

- `adminId` (number) - Unique integer identifier for the admin
- `password` (string) - Hashed password
- `isActive` (boolean) - Whether the admin account is active

### User

- `name` (string) - User's full name
- `email` (string) - User's email address
- `dob` (string) - Date of birth
- `gender` (string) - Gender
- `language` (string) - Preferred language
- `address` (string) - Address
- `subscriptionLevel` (string) - Subscription level (Free, Premium, etc.)
- `availableReadings` (number) - Number of available readings
- `photo` (string) - Profile photo URL
- `isVerified` (boolean) - Email verification status
- `isDeleted` (boolean) - Soft delete flag
- `source` (string) - Registration source (EMAIL, GOOGLE, FACEBOOK, APPLE)

### Plan

- `title` (string) - Plan title
- `price` (number) - Plan price
- `discounted_price` (number) - Discounted price
- `duration` (string) - Plan duration
- `benefit` (string) - Plan benefits
- `productId` (string) - Product ID for payment gateway
- `readings` (number) - Number of readings included

### Subscription

- `user` (ObjectId) - Reference to User
- `plan` (ObjectId) - Reference to Plan
- `startDate` (Date) - Subscription start date
- `endDate` (Date) - Subscription end date
- `status` (string) - Subscription status (active, cancelled, expired)

### Revenue

- `user` (ObjectId) - Reference to User
- `plan` (ObjectId) - Reference to Plan
- `amount` (number) - Transaction amount
- `paymentGateway` (string) - Payment gateway used
- `paymentId` (string) - Payment gateway transaction ID
- `type` (string) - Transaction type

### UserReading

- `content` (string) - Reading content
- `user` (ObjectId) - Reference to User
- `status` (string) - Reading status (pending, completed)
- `message` (string) - Additional message

### UserImage

- `user_reading` (ObjectId) - Reference to UserReading
- `user` (ObjectId) - Reference to User
- `image` (string) - Image URL
- `type` (string) - Image type

### PlanLanguage

- `plan` (ObjectId) - Reference to Plan
- `name` (string) - Localized plan name
- `language` (string) - Language code
- `benefit` (string) - Localized plan benefits

## Usage Examples

### Login as Admin

```bash
curl -X POST http://localhost:3000/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "adminId": 1,
    "password": "admin123"
  }'
```

### Create New Admin Account

```bash
curl -X POST http://localhost:3000/admin/admins \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "adminId": 2,
    "password": "newadmin123",
    "isActive": true
  }'
```

### Get Users with Pagination

```bash
curl -X GET "http://localhost:3000/admin/users?page=1&limit=10&search=john" \
  -H "Authorization: Bearer <your-token>"
```

### Create a New Plan

```bash
curl -X POST http://localhost:3000/admin/plans \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Premium Plan",
    "price": 29.99,
    "discounted_price": 24.99,
    "duration": "30 days",
    "benefit": "Unlimited readings",
    "readings": 100
  }'
```

### Get Dashboard Statistics

```bash
curl -X GET "http://localhost:3000/admin/dashboard/overview?startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer <your-token>"
```

## Default Admin Account

A default admin account is automatically created when the application starts:

- **Admin ID**: 1
- **Password**: admin123
- **Status**: Active

**Important**: Change the default password after first login for security.

## Security Notes

1. All admin routes require authentication
2. Admin authentication uses a separate Admin model with integer adminId
3. Passwords are hashed using bcrypt
4. Sensitive operations (delete, update) are logged
5. Input validation is performed on all endpoints
6. Rate limiting should be implemented in production
7. Admin accounts can be deactivated without deletion

## Development Notes

- All routes use TypeScript for type safety
- MongoDB aggregation pipelines are used for complex queries
- Pagination is implemented using skip/limit pattern
- Soft deletes are used where appropriate
- Population is used to fetch related data efficiently
- Admin passwords are automatically hashed when creating/updating accounts
