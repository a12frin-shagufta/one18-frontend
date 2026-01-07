import Hero from "../components/Hero";
import FestivalSection from "../components/FestivalSection";
import BestSellerSection from "../components/BestSellerSection";
import TestimonialSection from "../components/TestimonialSection";
import FindUsSection from "../components/FindUsSection";
import Test from "../components/Taste"
import CategoryPage from "./CategoryPage";
import TreatsSection from "../components/TreatsSection";
import Highlights from "../components/Highlights";


const Home = () => {
    const branchId = localStorage.getItem("selectedBranch");

 return (
    <div>
      <Hero />
      <FestivalSection />
      <CategoryPage />
      <BestSellerSection />
      <TreatsSection />
      <Highlights />
      <TestimonialSection />
      <Test/>


      {/* Load ONLY if branch is selected */}
      
    </div>
  );
};

export default Home;
