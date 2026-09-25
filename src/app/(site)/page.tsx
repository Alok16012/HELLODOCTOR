import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StreamSection from "@/components/StreamSection";
import FeaturedColleges from "@/components/FeaturedColleges";
import ScholarshipPreview from "@/components/ScholarshipPreview";
import BlogPreview from "@/components/BlogPreview";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { getBlogs, getColleges, getScholarships } from "@/lib/content";

export const revalidate = 3600;

export default async function HomePage() {
  const [colleges, blogs, scholarships] = await Promise.all([getColleges(), getBlogs(), getScholarships()]);

  return (
    <main>
      <Navbar />
      <HeroSection />
      <StreamSection colleges={colleges} />
      <FeaturedColleges colleges={colleges} />
      <ScholarshipPreview scholarships={scholarships} />
      <BlogPreview blogs={blogs} />
      <CTASection />
      <Footer />
    </main>
  );
}
