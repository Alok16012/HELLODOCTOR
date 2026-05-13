import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StreamSection from "@/components/StreamSection";
import FeaturedColleges from "@/components/FeaturedColleges";
import ScholarshipPreview from "@/components/ScholarshipPreview";
import BlogPreview from "@/components/BlogPreview";
import StatsSection from "@/components/StatsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <StreamSection />
      <FeaturedColleges />
      <ScholarshipPreview />
      <BlogPreview />
      <StatsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
