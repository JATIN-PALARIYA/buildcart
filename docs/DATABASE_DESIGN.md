# DATABASE_DESIGN.md

# Database Design

## Project

**Production-Style Single Store E-commerce Application**

### Objective

Design a clean, scalable database for a production-style e-commerce application using MongoDB. The design should support the current MVP while making future expansion into a Shopify-like multi-tenant SaaS straightforward.

---

# Why Database Design Comes First

The database is the foundation of the application.

Every feature—including APIs, authentication, business logic, and the frontend—depends on how the data is organized.

A well-designed database should:

* Avoid duplicate data
* Maintain data integrity
* Be easy to extend
* Represent real business entities
* Support future requirements with minimal changes

---

# Collections

## 1. Admin

### Purpose

Stores administrator accounts that manage the store.

### Responsibilities

* Login
* Manage products
* Manage categories
* Manage orders

### Data Stored

* ID
* Username
* Email
* Password Hash
* Role
* Created At
* Updated At

### Future Expansion

* Multiple administrators
* Staff accounts
* Role-based permissions
* Profile image
* Last login
* Two-factor authentication

---

## 2. Category

### Purpose

Groups products into logical sections.

### Responsibilities

* Organize products
* Support product filtering
* Improve storefront navigation

### Data Stored

* ID
* Name
* Slug
* Description
* Created At
* Updated At

### Design Decisions

* Category names should be unique.
* Products reference categories using `categoryId`.
* Do not store product count.
* Do not store a list of products.

### Future Expansion

* Parent-child categories
* Featured categories
* SEO metadata
* Category images

---

## 3. Product

### Purpose

Represents an item available for sale.

### Responsibilities

* Display in storefront
* Support searching and filtering
* Track inventory
* Belong to one category

### Data Stored

* ID
* Name
* Slug
* Description
* Image URL
* Price
* Stock
* Category ID
* Active Status
* Created At
* Updated At

### Design Decisions

* Store `categoryId` instead of category name.
* Products remain in the database even if stock reaches zero.
* Products may later use soft deletion instead of permanent deletion.

### Future Expansion

* Multiple images
* Product gallery
* Reviews
* Ratings
* Product variants
* SKU
* Brand
* Discount pricing
* Inventory history

---

## 4. Order

### Purpose

Stores customer purchases.

### Responsibilities

* Record customer information
* Record purchased products
* Preserve purchase history
* Track order status

### Data Stored

#### Customer Information

* Customer Name
* Phone Number
* Delivery Address

#### Product Snapshot

* Product ID
* Product Name
* Product Price

#### Order Information

* Quantity
* Total Price
* Status
* Created At
* Updated At

### Order Status

* Pending
* Completed

### Design Decisions

* Store the product's name and price at the time of purchase.
* Orders should never change because a product changes later.
* Orders should remain even if a product is deleted.

### Future Expansion

* Multiple products per order
* Payment information
* Shipping information
* Tracking ID
* Coupons
* Refunds
* Returns

---

# Relationships

```
Admin
│
├── manages ─────────► Products
│
├── manages ─────────► Categories
│
└── manages ─────────► Orders


Category
│
└── contains ────────► Products


Product
│
├── belongs to ──────► Category
│
└── appears in ──────► Orders
```

---

# Important Database Design Decisions

## Password Security

Store only password hashes.

Never store plain-text passwords.

---

## Roles

Include a role field from the beginning to support future permissions.

Examples:

* Owner
* Manager
* Staff

---

## Slugs

Use slugs instead of product names in URLs.

Example:

```
/products/iphone-16-pro-max
```

Benefits:

* URL-friendly
* SEO-friendly
* Easy to read
* Avoids spaces and special characters

---

## Category Reference

Products store `categoryId` instead of the category name.

Benefits:

* Avoids duplicate data
* Renaming a category updates only one document
* Maintains consistency

---

## Product Availability

Do not delete products when stock reaches zero.

Instead:

* Mark as Out of Stock
* Keep product history
* Allow future restocking

---

## Historical Orders

Orders are business records.

Deleting a product should never remove previous orders.

Orders preserve:

* Customer history
* Accounting
* Reporting
* Auditing

---

## Category Deletion

A category containing products should not be deleted until those products are reassigned or removed.

This prevents orphaned records.

---

## Price Snapshot

Store the product name and price inside the order at purchase time.

Future price changes should not affect historical orders.

---

# MVP Collections

The MVP uses only four collections:

* Admin
* Category
* Product
* Order

Customer authentication is intentionally excluded from the MVP.

Customer information is stored inside the Order collection.

---

# Future Expansion

Potential additions after the MVP:

* Customer accounts
* Shopping cart
* Wishlist
* Product reviews
* Product variants
* Multiple product images
* Coupons
* Payment gateway
* Shipping
* Inventory management
* Analytics
* Multi-store (Tenant)
* Subscription plans
* Theme management
* Staff permissions
