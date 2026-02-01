import { Hero } from "@/components/landing/Hero";
import { SkillSection } from "@/components/landing/SkillSection";
import { StatsBar } from "@/components/landing/StatsBar";
import { FeatureCards } from "@/components/landing/FeatureCards";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <SkillSection />
      <StatsBar />
      <FeatureCards />
    </div>
  );
}
