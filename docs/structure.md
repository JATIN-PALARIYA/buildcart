# Project Directory Structure (`src/`)

Below is the complete file and folder structure of the refactored `src/` directory, illustrating modular layouts, decoupled table components, and backend database route mappings.

```text
src/
├── app/
│   ├── (admin)/
│   │   └── admin/
│   │       ├── categories/
│   │       │   └── page.tsx
│   │       ├── login/
│   │       │   └── page.tsx
│   │       ├── orders/
│   │       │   └── page.tsx
│   │       ├── products/
│   │       │   └── page.tsx
│   │       ├── profile/
│   │       │   └── page.tsx
│   │       ├── layout.tsx
│   │       ├── loading.tsx
│   │       └── page.tsx
│   ├── api/
│   │   └── admin/
│   │       ├── categories/
│   │       │   ├── [id]/
│   │       │   │   └── route.ts
│   │       │   └── route.ts
│   │       ├── login/
│   │       │   └── route.ts
│   │       ├── orders/
│   │       │   ├── [id]/
│   │       │   │   └── route.ts
│   │       │   └── route.ts
│   │       └── products/
│   │           ├── [id]/
│   │           │   └── route.ts
│   │           └── route.ts
│   ├── globals.css
│   └── layout.tsx
├── components/
│   └── admin/
│       ├── drawers/
│       │   └── OrderDetailDrawer.tsx
│       ├── forms/
│       │   ├── CategoryFormModal.tsx
│       │   ├── LoginForm.tsx
│       │   ├── ProductFormModal.tsx
│       │   ├── ProfileForm.tsx
│       │   └── SecurityForm.tsx
│       ├── layouts/
│       │   ├── AdminHeader.tsx
│       │   ├── AdminMobileDrawer.tsx
│       │   ├── AdminMobileHeader.tsx
│       │   ├── AdminSidebar.tsx
│       │   └── navigation.ts
│       ├── sections/
│       │   ├── AdminIdentityCard.tsx
│       │   ├── DashboardMetrics.tsx
│       │   ├── RecentOrders.tsx
│       │   ├── SalesTrendChart.tsx
│       │   └── StoreDetailsCard.tsx
│       ├── tables/
│       │   ├── CategoryTable.tsx
│       │   ├── OrderTable.tsx
│       │   └── ProductTable.tsx
│       ├── ui/
│       │   ├── Badge.tsx
│       │   ├── Card.tsx
│       │   └── Modal.tsx
│       ├── AdminContext.tsx
│       ├── Icons.tsx (deprecated)
│       └── ThemeProvider.tsx
├── constants/
├── lib/
│   ├── db.ts
│   ├── hash.ts
│   └── jwt.ts
├── middlewares/
│   └── auth.middleware.ts
├── models/
│   ├── Admin.ts
│   ├── Category.ts
│   ├── Order.ts
│   └── Product.ts
├── services/
│   ├── admin.service.ts
│   ├── category.service.ts
│   ├── order.service.ts
│   └── product.service.ts
├── types/
│   ├── category.types.ts
│   ├── order.types.ts
│   └── product.types.ts
├── utils/
│   └── slug.ts
└── validators/
```
