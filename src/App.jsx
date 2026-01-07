import { BrowserRouter, Routes, Route } from "react-router-dom";

import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Festival from "./pages/Festival";
import ProductDetail from "./pages/ProductDetail";
import BestSellers from "./pages/BestSellers";
import FindUsSection from "./components/FindUsSection";
import Footer from "./components/Footer";
import Checkout from "./pages/Checkout";
import Menu from "./pages/Menu";
import CategoryPage from "./pages/CategoryPage";
import BranchSelect from "./components/BranchSelect";
import { useEffect } from "react";
import { DEFAULT_BRANCH } from "./config/defaultBranch";


function App() {
   useEffect(() => {
    const savedBranch = localStorage.getItem("selectedBranch");

    if (!savedBranch) {
      localStorage.setItem("selectedBranch", DEFAULT_BRANCH.id);
    }
  }, []);
  return (
    
      <>
      

       <Navbar/>
        <Routes>
           <Route path="/" element={<Home/>} />
          <Route path="/menu" element={<Menu/>} /> 
          <Route path="/cart" element={<Cart />} />
          <Route path="/festival/:slug" element={<Festival />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/best-sellers" element={<BestSellers />} />
          <Route path="/find-us" element={<FindUsSection />} />
          <Route path="/checkout" element={<Checkout />} /> 
          <Route path="/products" element={<CategoryPage />} />
<Route path="/menu/:categoryId" element={<Menu />} />
<Route path="/order" element={<BranchSelect />} />


          


        </Routes>
        <Footer/>
        
     
     </>
  );
}

export default App;
