import { Routes, Route, useLocation } from "react-router-dom";
import { initPixel, trackPageView } from "./utils/metaPixel";
import { initGTM, gtmPageView } from "./utils/googleTagManager";
import { useEffect } from "react";

import AnnouncementBar from "./components/AnnouncementBar";
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
// import NewsletterPopup from "./components/NewsletterPopup";
import ChatWidget from "./components/ChatWidget";


function App() {
  const location = useLocation();

  // ✅ Meta Pixel: a SPA only loads index.html once, so PageView has to fire on
  // each route change or Meta sees a single page per visit.
  useEffect(() => {
    initPixel();
     initGTM();
  }, []);

  useEffect(() => {
    trackPageView();
    // GTM's built-in Page View trigger only fires once in a SPA, so tags that
    // need to run per page use a "Custom Event: route_change" trigger.
    gtmPageView(location.pathname);
  }, [location.pathname]);

  /* The 826 Tampines outlet closed on 4 Oct 2026. Returning customers still
     have its id saved in their browser from a previous visit, so without this
     they'd keep browsing — and ordering — against a closed outlet. Reset any
     stored reference to it, and clear a fulfillment choice that points there. */
  const CLOSED_BRANCH_IDS = ["696b2592f5f3ced6b3de4974"]; // 826 Tampines St 81

  useEffect(() => {
    const savedBranch = localStorage.getItem("selectedBranch");

    if (!savedBranch || CLOSED_BRANCH_IDS.includes(savedBranch)) {
      localStorage.setItem("selectedBranch", DEFAULT_BRANCH.id);
      localStorage.removeItem("selectedBranchData");
    }

    try {
      const fulfillment = JSON.parse(
        localStorage.getItem("fulfillmentData") || "null",
      );
      const branchId = fulfillment?.branch?._id || fulfillment?.branch?.id;
      if (branchId && CLOSED_BRANCH_IDS.includes(branchId)) {
        // Forces the customer to pick again rather than silently
        // collecting from a shop that isn't open.
        localStorage.removeItem("fulfillmentData");
      }
    } catch {
      localStorage.removeItem("fulfillmentData");
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
      <AnnouncementBar />
      <Navbar />
      {/* <NewsletterPopup/> */}

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