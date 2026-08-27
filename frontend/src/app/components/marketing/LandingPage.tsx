import dynamic from "next/dynamic";

import LandingNav from "./landing/LandingNav";
import HeroSection from "./landing/HeroSection";
import ProofStrip from "./landing/ProofStrip";
import { HairlineDivider } from "./landing/primitives";
import { INK, SURFACE } from "./landing/tokens";

/** Below-the-fold sections — code-split so first paint only loads hero + nav. */
const PracticeSection = dynamic(() => import("./landing/PracticeSection"));
const CoursesSection = dynamic(() => import("./landing/CoursesSection"));
const CoachingSection = dynamic(() => import("./landing/CoachingSection"));
const ComingSoonSection = dynamic(() => import("./landing/ComingSoonSection"));
const TestimonialsSection = dynamic(
  () => import("./landing/TestimonialsSection")
);
const AboutSection = dynamic(() => import("./landing/AboutSection"));
const ClosingSection = dynamic(() => import("./landing/ClosingSection"));

/**
 * Marketing landing page (route: `/[locale]`).
 * Server component shell — only above-the-fold sections load in the initial bundle.
 */
export default function LandingPage() {
  return (
    <div
      style={{
        backgroundColor: SURFACE.base,
        color: INK[800],
        scrollBehavior: "smooth",
      }}
      className="landing-page"
    >
      <LandingNav />
      <HeroSection />
      <ProofStrip />
      <PracticeSection />
      <HairlineDivider />
      <CoursesSection />
      <CoachingSection />
      <ComingSoonSection />
      <TestimonialsSection />
      <AboutSection />
      <ClosingSection />
    </div>
  );
}
