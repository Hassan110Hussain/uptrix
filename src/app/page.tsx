import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { UptimeMonitoring } from "@/components/landing/UptimeMonitoring";
import { CheckIntervals } from "@/components/landing/CheckIntervals";
import { Analytics } from "@/components/landing/Analytics";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="bg-[#10221c] min-h-screen">
      <Navbar />
      <Hero />
      <UptimeMonitoring />
      <CheckIntervals />
      <Analytics />
      <CtaBanner />
      <Footer />
    </div>
  );
}
