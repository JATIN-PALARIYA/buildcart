# E-Commerce SaaS Admin Dashboard: Feature Roadmap & TODOs

This file tracks the delta between the polished frontend features (built on local-storage state mocks) and the backend API architecture, along with recommendations for future UX enhancements.

---

## 1. Frontend Features Pending Backend Implementation

These features are fully simulated in the user interface but require backend APIs, database fields, or third-party integrations to match production specifications.

### A. Product Image Upload Zone (Cloudinary Integration)
* **Current Status**: A drag-and-drop zone converts files to Base64 strings, saving them into local storage to render visual cards.
* **Backend Requirement**:
  - Implement a multipart file parser (e.g. `multer` or Next.js API boundary handler).
  - Connect with **Cloudinary SDK** to receive binary data, upload it, and return a public CDN URL.
  - Alternatively, create a signed upload signature endpoint (`/api/admin/cloudinary-sign`) to allow secure uploads directly from browser state to Cloudinary, reducing server load.

### B. Analytics and Performance Charts (KPIs)
* **Current Status**: Sales trend charts are drawn using static mock coordinate arrays (weekly/monthly view). Revenue metrics are computed client-side in the context over local checkout arrays.
* **Backend Requirement**:
  - Create a sales analytics endpoint (`/api/admin/analytics/sales?timeline=weekly|monthly`) leveraging a MongoDB Aggregation Pipeline (`$group`, `$sum`, `$dateToString`) to group completed order values by weekday or month.
  - Create a summary KPI endpoint (`/api/admin/analytics/metrics`) that reports calculated revenues, active/inactive stock stats, and order counts.

### C. Admin Profile Management & Security Updates
* **Current Status**: Form fields update the active layout header profile details in local storage. Security password changes simulate input match warnings.
* **Backend Requirement**:
  - Create a profile getter (`GET /api/admin/profile`) and updates (`PUT /api/admin/profile`) endpoint linked to the `Admin` Mongoose model.
  - Create a password update endpoint (`POST /api/admin/profile/password`) that runs bcrypt comparisons against the current hash, hashes the new password, and saves the updated document.

### D. Server-Side Table Operations (TanStack Scaling)
* **Current Status**: Searching, sorting, filtering, and pagination are executed entirely on client-side state arrays.
* **Backend Requirement**:
  - When the inventory or order list scales to thousands of entries, update endpoints (`/api/admin/products`, `/api/admin/orders`) to support query parameters:
    - `page` / `limit` (Pagination)
    - `search` (Search query)
    - `sortBy` / `sortOrder` (Sorting columns)
    - `category` (Filter options)
  - Perform dynamic database queries (`Product.find().skip().limit().sort()`).

---

## 2. Recommended UX/UI Suggestions for Future Iterations

To elevate the dashboard into a truly world-class, premium enterprise platform, consider adding these visual and functional enhancements.

### A. Live Sales Broadcast (WebSockets)
* **Description**: Implement real-time push events so that orders placed by customers instantly refresh the admin dashboard without reloading the page.
* **UX Impact**: Render a sleek notification toast at the top-right corner with a soft chime and highlight new rows with a brief glow animation. Useful for warehouses and order processing teams.

### B. Exportable Analytics Reports
* **Description**: Add export actions on lists and data tables (Categories, Products, Orders).
* **UX Impact**: Allow administrators to export records instantly to CSV spreadsheets for accounting or print professional invoices/shipping slips in PDF format directly from the slide-out drawers.

### C. Bulk Inventory Operations
* **Description**: Enable multi-select checkbox lists in the Products and Categories tables.
* **UX Impact**: Allow catalog operators to perform quick batch updates, such as disabling active states, raising prices by a percentage, or bulk deleting obsolete drafts in a single click.

### D. Direct Customer Communications
* **Description**: Integrate an email dispatch agent (e.g. Resend, SendGrid, or Amazon SES) triggered by order status changes.
* **UX Impact**: Automatically send rich HTML transactional emails (e.g. "Order Shipped", "Out for Delivery") containing tracking links when the admin updates an order status select box.
