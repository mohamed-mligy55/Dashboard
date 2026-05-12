import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const DEFAULT = {
  title: "Lamadmin — Admin dashboard",
  description:
    "Operations dashboard for users, orders, analytics, and account management.",
};

function resolveSeo(pathname) {
  if (pathname === "/")
    return {
      title: "Dashboard | Lamadmin",
      description:
        "Overview of KPIs, revenue charts, and latest transactions in one place.",
    };
  if (pathname === "/lists")
    return {
      title: "Customers | Lamadmin",
      description:
        "Browse and manage customer accounts, statuses, and contact details.",
    };
  if (pathname === "/new")
    return {
      title: "Add new | Lamadmin",
      description: "Create a new product or user record using the guided form.",
    };
  if (pathname.startsWith("/user/"))
    return {
      title: "User profile | Lamadmin",
      description: "View customer profile details and related information.",
    };
  if (pathname.startsWith("/users/"))
    return {
      title: "Edit user | Lamadmin",
      description: "Update user profile, contact information, and preferences.",
    };
  return DEFAULT;
}

export default function RouteMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const { title, description } = resolveSeo(pathname);
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description);
  }, [pathname]);

  return null;
}
