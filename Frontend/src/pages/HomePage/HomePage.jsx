// import Navbar from "@/components/home/header";
import React from "react";
import HeroSection from "./components/Hero";
import Category from "./components/Category";
import Product from "./components/Product";
import Footer from "@/components/Footer";
// import Navbar from "@/components/home/header";

const HomePage = () => {
  return (
    <div>
      <div>
        <HeroSection />
      </div>
      <div>
        <Category />
      </div>
      <div>
        <Product />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
