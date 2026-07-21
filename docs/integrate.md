# Frontend & Backend Integration Guide

This guide details the blueprint to connect the BuildCart client-side customer storefront and administrator dashboard with the server-side API routes and Mongoose models.

---

## 1. Discrepancies & Missing Features

Before performing direct integrations, resolve the following structural disparities between the frontend mock schemas and the backend Mongoose models.

### A. Schema Fields Mismatch

| Model | Frontend Property | Mongoose Schema Property | Integration Fix Required |
| :--- | :--- | :--- | :--- |
| **Product** | `product.image` (String) | `product.images` (Array of Strings) | Modify frontend cards to reference `product.images[0]` as the thumbnail and update Admin forms to save arrays. |
| **Category** | Icon tags based on `category.slug` | `category.name`, `category.slug`, `category.description` | Add an `icon` string field to Mongoose `CategorySchema` to map custom Lucide icons, or default to a generic workspace tag. |
| **Admin** | Local state context | `models/Admin.ts` schema | Ensure the login service queries the Mongoose Admin model. |

### B. Missing Features in Backend
1. **Catalog Searching, Filtering, & Sorting**:
   * **The Issue**: The customer product API `/api/products` directly executes `getAllPublicProducts()` which fetches all active products with no filter options.
   * **Requirement**: Update the GET controller to parse URL query parameters:
     * `?search=...`: Bind a Mongoose regex query `{ name: { $regex: query, $options: 'i' } }`.
     * `?category=...`: Query products by category ObjectId or slug.
     * `?sort=...`: Apply Mongoose sorting logic (`.sort({ price: 1 })`, etc.).
2. **Session / Auth Cookie Middleware**:
   * **The Issue**: Admin login is simulated in the client provider.
   * **Requirement**: The backend admin routes need verification checking to ensure requests to `/api/admin/...` routes contain validation headers or session cookies set by `/api/admin/login`.

---

## 2. Step-by-Step Feature Integration Plan

### Feature 1: Customer Product Catalog & Detail Pages
* **Current State**: Storefront pages fetch directly from `mockProducts` in `src/lib/mock/data.ts`.
* **Step 1**: Update `/api/products/route.ts` to parse query params and implement filters in Mongoose query:
  ```typescript
  // src/app/api/(customer)/products/route.ts
  export async function GET(request: NextRequest) {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");
    
    // Construct query filters
    const filter: any = { isActive: true };
    if (category && category !== "all") {
      const catObj = await categoryModel.findOne({ slug: category });
      if (catObj) filter.category = catObj._id;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
    
    let query = productModel.find(filter).populate("category");
    
    // Apply sorting
    if (sort === "price-asc") query = query.sort({ price: 1 });
    else if (sort === "price-desc") query = query.sort({ price: -1 });
    else query = query.sort({ createdAt: -1 });
    
    const products = await query;
    return NextResponse.json({ products });
  }
  ```
* **Step 2**: Convert `src/app/(store)/products/page.tsx` and `src/app/page.tsx` from raw mock arrays to dynamic `fetch()` queries.
  * *Tip*: Since these are Next.js Client Components, replace raw arrays with `useEffect` fetch hooks pulling from `/api/products`.

---

### Feature 2: Shopping Cart & Checkout Submission
* **Current State**: `checkout/page.tsx` submits with a local mock `setTimeout` timer.
* **Step 1**: Replace the `handleSubmit` method inside [checkout/page.tsx](file:///d:/COURSES/Web%20Development/Projects%20Lists/Backend/buildcart/src/app/(store)/checkout/page.tsx) with a fetch POST request to `/api/orders`:
  ```typescript
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      shippingAddress: formData.address,
      products: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to submit order");
  }
  
  const data = await response.json();
  const newOrderId = data.order._id;
  ```
* **Step 2**: Handle validation feedback. If the backend reports stock exhaustion (returns HTTP 400), display an out-of-stock toast in the checkout form.

---

### Feature 3: Global Command Palette Search (CmdK)
* **Current State**: `SearchModal.tsx` filters mock products array on the client side.
* **Step 1**: To maintain instantaneous search response speeds without overloading MongoDB on every keystroke, configure the client-side search to fetch the complete active catalog index from `/api/products` once on mount and cache it locally in a React context, or query the `/api/products?search=...` endpoint with a 300ms debounce handler:
  ```typescript
  // Debounced search logic in SearchModal
  useEffect(() => {
    if (!query.trim()) return;
    const delay = setTimeout(async () => {
      const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.products);
    }, 300);
    return () => clearTimeout(delay);
  }, [query]);
  ```

---

### Feature 4: Admin Dashboard CRUD Operations
* **Current State**: `AdminContext.tsx` reads and writes state to the browser's `localStorage` directly.
* **Step 1**: Connect Admin Authentication. Swap out the mock checks inside `login()` and `logout()` for fetch calls matching the suggested commented code inside `AdminContext.tsx`:
  ```typescript
  const login = async (email: string, password: string) => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error("Invalid admin credentials");
    const data = await res.json();
    setIsAuthenticated(true);
    setAdminUser(data.user);
    return true;
  };
  ```
* **Step 2**: Connect Category & Product Actions. Replace state adjustments in `addCategory()`, `updateCategory()`, `deleteCategory()`, `addProduct()`, `updateProduct()`, and `deleteProduct()` with REST queries pointing to `/api/admin/products` and `/api/admin/categories` paths.
* **Step 3**: Connect Order Status Management. Replace `updateOrderStatus()` with a `PATCH` request pointing to `/api/admin/orders/${id}/status`.
