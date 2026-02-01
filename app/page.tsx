import { Hero } from "@/components/landing/Hero";
import { StatsBar } from "@/components/landing/StatsBar";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { SkillSection } from "@/components/landing/SkillSection";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <StatsBar />
      <FeatureCards />
      <SkillSection />
    </div>
  );
}
