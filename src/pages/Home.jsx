import Hero from "../components/Hero";
import FestivalSection from "../components/FestivalSection";
import BestSellerSection from "../components/BestSellerSection";
import TestimonialSection from "../components/TestimonialSection";
import FindUsSection from "../components/FindUsSection";
import Test from "../components/Taste"
import CategoryPage from "./CategoryPage";
import TreatsSection from "../components/TreatsSection";
import Highlights from "../components/Highlights";
import CateringSection from "../components/CateringSection";
import AboutUsSection from "../components/AboutUsSection";



const Home = () => {
//   <Helmet>
//   <title>ONE18 Bakery | Artisan Cakes Singapore</title>
//   <meta name="description"
//     content="Order premium artisan cakes and pastries in Singapore." />
// </Helmet>

    const branchId = localStorage.getItem("selectedBranch");

 return (
    <div>
      <Hero />
     
      <CategoryPage />
       <BestSellerSection />
       <FestivalSection />
     
      <TreatsSection />
      <Highlights />
      <CateringSection />
      <AboutUsSection />
      
      <TestimonialSection />
      {/* <Test/> */}


      {/* Load ONLY if branch is selected */}
      
    </div>
  );
};

export default Home;
