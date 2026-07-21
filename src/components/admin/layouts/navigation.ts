import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  User,
} from "lucide-react";

export const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: FolderTree },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Profile", href: "/admin/profile", icon: User },
];
export default navItems;
