# Schema Design

## Purpose

This document defines the schema design for the E-Commerce MVP. It serves as the blueprint for implementing Mongoose models and ensures consistency, scalability, and maintainability across the application.

---

# Objectives

* Design production-ready database schemas.
* Maintain data consistency and integrity.
* Support future scalability.
* Preserve historical business records.
* Prepare the application for future SaaS expansion.

---

# Design Principles

## 1. Separation of Responsibilities

Each collection has a single responsibility.

| Collection | Responsibility                                       |
| ---------- | ---------------------------------------------------- |
| Product    | Store product catalog information                    |
| Category   | Organize products into categories                    |
| Admin      | Store administrator accounts and authentication data |
| Order      | Store completed purchases and transaction history    |

---

## 2. Normalization

Collections reference each other where appropriate to avoid unnecessary data duplication.

Examples:

* Product → Category
* Order → Product (Reference + Snapshot)
* Order → Customer (Reference + Snapshot)

---

## 3. Snapshot Principle

Orders are immutable business records.

When an order is placed, important information is copied into the order so historical records remain accurate even if related data changes later.

### Product Snapshot

Store:

* productId
* productName
* productPrice
* productImage
* quantity
* subtotal

### Customer Snapshot

Store:

* customerId
* name
* email
* phone
* shippingAddress

---

## 4. Historical Accuracy

Historical records should never change.

Examples:

* Product price updates must not affect previous orders.
* Customer profile updates must not modify old invoices.
* Tax or shipping changes must not recalculate completed orders.

---

## 5. Soft Deletion

Entities referenced by historical records should not be permanently deleted.

Instead, use an `isActive` flag.

Benefits:

* Preserves historical data.
* Prevents broken references.
* Maintains reporting and analytics.

---

## 6. Enumerations

Fields with predefined values use enums instead of free-form strings.

Examples:

### Admin Role

* admin

Future:

* manager
* warehouse
* support

### Order Status

* placed
* packed
* shipped
* out_for_delivery
* delivered
* cancelled

### Payment Status

* unpaid
* paid

Future:

* pending
* failed
* refunded

---

# Naming Conventions

* Collection names use PascalCase.
* Field names use camelCase.
* Reference fields end with `Id`.
* Boolean fields start with `is`.
* Date fields use `Date`.
* Monetary values use `Number`.

Examples:

* categoryId
* productId
* customerId
* isActive
* createdAt
* updatedAt

---

# Completed Schemas

## Product

Purpose:

Stores products available for purchase.

Key Fields:

* name
* slug
* description
* price
* stock
* images
* categoryId
* isActive
* createdAt
* updatedAt

---

## Category

Purpose:

Groups products into categories.

Key Fields:

* name
* slug
* isActive
* createdAt
* updatedAt

---

## Admin

Purpose:

Stores administrator accounts and authentication information.

Key Fields:

* username
* email
* password (hashed)
* role
* isActive
* lastLogin
* createdAt
* updatedAt

---

## Order

Purpose:

Stores completed customer purchases as immutable business records.

Sections:

### Order Information

* orderNumber
* orderDate

### Customer Snapshot

* customerId
* name
* email
* phone
* shippingAddress

### Product Snapshot

Each purchased product stores:

* productId
* productName
* productImage
* productPrice
* quantity
* subtotal

### Pricing

* subtotal
* shippingCharge
* discount
* tax
* total

### Payment

* paymentMethod
* paymentStatus
* transactionId

### Delivery

Current Status:

* placed
* packed
* shipped
* out_for_delivery
* delivered
* cancelled

Status History:

Stores every status transition with its timestamp.

### Audit

* createdAt
* updatedAt

---

# Key Design Decisions

* Products reference Categories.
* Orders store product snapshots.
* Orders store customer snapshots.
* Pricing breakdown is stored separately.
* Payment information is independent of delivery information.
* Order status uses enums.
* Status history is preserved.
* Soft deletion is preferred over hard deletion.
* Historical records must remain immutable.

---

# Future Expansion

The schema supports future additions without major redesign.

Planned features:

* Customer accounts
* Shopping cart
* Wishlist
* Coupons
* Product reviews
* Inventory management
* Product variants
* Multiple warehouses
* Shipment tracking
* Payment gateway integration
* Analytics
* Multi-store support
* Multi-tenant SaaS architecture

---

# Implementation Status

| Schema   | Status     |
| -------- | ---------- |
| Product  | ✅ Complete |
| Category | ✅ Complete |
| Admin    | ✅ Complete |
| Order    | ✅ Complete |

---

# Next Phase

After completing schema design:

1. Implement Mongoose schemas.
2. Add validation rules.
3. Configure indexes.
4. Create model relationships.
5. Build the service layer.
6. Design REST APIs.
7. Integrate with the frontend.

This document is the high-level schema design reference. Detailed implementation for each collection should be maintained in their respective files:

* `PRODUCT_SCHEMA.md`
* `CATEGORY_SCHEMA.md`
* `ADMIN_SCHEMA.md`
* `ORDER_SCHEMA.md`
