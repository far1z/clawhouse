import { Hero } from "@/components/landing/Hero";
import { SkillSection } from "@/components/landing/SkillSection";
import { ActiveRooms } from "@/components/landing/ActiveRooms";
import { FeatureCards } from "@/components/landing/FeatureCards";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <SkillSection />
      <ActiveRooms />
      <FeatureCards />
    </div>
  );
}
