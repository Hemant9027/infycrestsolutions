import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedWork from "@/components/FeaturedWork";
import WhatWeBuild from "@/components/WhatWeBuild";
import BusinessOutcomes from "@/components/BusinessOutcomes";
import TechMarquee from "@/components/TechMarquee";
import Products from "@/components/Products";
import IndustrySolutions from "@/components/IndustrySolutions";
import WhyInfyCrest from "@/components/WhyInfyCrest";
import Pricing from "@/components/Pricing";
import Process from "@/components/Process";
import TrustFAQ from "@/components/TrustFAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedWork />
        <WhatWeBuild />
        <BusinessOutcomes />
        <Products />
        <IndustrySolutions />
        <WhyInfyCrest />
        <Process />
        <TechMarquee />
        <Pricing />
        <TrustFAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
