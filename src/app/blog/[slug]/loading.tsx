import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageSkeleton from "@/components/ui/PageSkeleton";

export default function Loading() {
  return (
    <>
      <Navbar />
      <PageSkeleton kind="article" />
      <Footer />
    </>
  );
}
