import { BrowserRouter, useLocation } from "react-router-dom";

// COMPONENT
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// ROUTES
import AppRoutes from "./routes/AppRoutes";

function AppWrapper() {
  const location = useLocation();
  const authPaths = ["/login", "/register", "/forgot-password", "/reset-password"];
  const isAuthPage = authPaths.includes(location.pathname);

  return (
    <>
      {!isAuthPage && <Navbar />}

      <AppRoutes />

      {!isAuthPage && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}
