import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/home/Home"));
const Lists = lazy(() => import("./pages/list/List"));
const New = lazy(() => import("./pages/new/New"));
const EditUser = lazy(() => import("./pages/editUser/EditUser"));
const Productdetails = lazy(() => import("./pages/productdetails/productdetails"));

const PageFallback = () => (
  <div
    style={{
      minHeight: "40vh",
      display: "grid",
      placeItems: "center",
      padding: 24,
      color: "#666",
      fontFamily: "system-ui, sans-serif",
    }}
    role="status"
    aria-live="polite"
  >
    Loading…
  </div>
);

const userInputs = [
  { id: 1, label: "Username", type: "text", placeholder: "john_doe" },
  { id: 2, label: "Name and surname", type: "text", placeholder: "Jane Doe" },
  { id: 3, label: "Email", type: "mail", placeholder: "john_doe@gmail.com" },
  { id: 4, label: "Phone", type: "text", placeholder: "+1 234 567 89" },
  { id: 5, label: "Password", type: "password" },
  { id: 6, label: "Address", type: "text", placeholder: "Elton St. 216 NewYork" },
  { id: 7, label: "Country", type: "text", placeholder: "USA" },
];

function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lists" element={<Lists />} />
        <Route path="/user/:id" element={<Productdetails />} />
        <Route path="/users/:id" element={<EditUser />} />
        <Route
          path="/new"
          element={<New title="Add New Product" inputs={userInputs} />}
        />
      </Routes>
    </Suspense>
  );
}

export default App;
