import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Products from "@/components/Products";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Ready-to-Launch Templates | InfyCrest Solutions",
  description:
    "Explore our curated collection of ready-to-launch website templates for ambitious businesses.",
};

export default function TemplatesPage() {
  return (
    <>
      <Navbar />
      <main>
        <Products showAll hideEyebrow />
      </main>
      <Footer />
    </>
  );
}
