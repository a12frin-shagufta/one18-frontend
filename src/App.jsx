import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Festival from "./pages/Festival";
import ProductDetail from "./pages/ProductDetail";
import BestSellers from "./pages/BestSellers";
import CategoryPage from "./pages/CategoryPage";
import FindUsSection from "./components/FindUsSection";
import BranchSelect from "./components/BranchSelect";
import CateringSection from "./components/CateringSection";
import AboutUsSection from "./components/AboutUsSection";
import Confirmation from "./pages/Confirmation";
import PaymentSuccess from "./pages/PaymentSuccess";
import { DEFAULT_BRANCH } from "./config/defaultBranch";
import FulfillmentModal from "./components/FulfillmentModal";
import ThankYou from "./components/ThankYou";
import NewsletterPopup from "./components/NewsletterPopup";
import ChatWidget from "./components/ChatWidget";


function App() {
  const location = useLocation();

  useEffect(() => {
    const savedBranch = localStorage.getItem("selectedBranch");
    if (!savedBranch) {
      localStorage.setItem("selectedBranch", DEFAULT_BRANCH.id);
    }
  }, []);

  // ❌ Pages where footer should NOT appear
  const hideFooterRoutes = [
    "/menu",
    "/cart",
    "/checkout",
    "/order",
  ];

  const shouldHideFooter = hideFooterRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      <Navbar />
      <NewsletterPopup/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:categoryId" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/festival/:slug" element={<Festival />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/best-sellers" element={<BestSellers />} />
        <Route path="/products" element={<CategoryPage />} />
        <Route path="/find-us" element={<FindUsSection />} />
        <Route path="/order" element={<Menu />} />

        <Route path="/catering" element={<CateringSection />} />
        <Route path="/about-us" element={<AboutUsSection />} />
        <Route path="/confirmation" element={<Confirmation />} />
       <Route path="/payment-success" element={<PaymentSuccess />} />
       <Route path="/fulfillment" element={<FulfillmentModal />} />
        <Route path="/thank-you" element={<ThankYou />} />





        
      </Routes>

      {!shouldHideFooter && <Footer />}


<ChatWidget />

    </>

    
  );
}

export default App;
