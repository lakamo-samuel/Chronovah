import AboutSection from "../components/AboutUs";
import Footer from "../components/Footer";
import CTASection from "../features/Hopepage/CTA";
import Features from "../features/Hopepage/Feature";
import Hero from "../features/Hopepage/Hero";
import SecuritySection from "../features/Hopepage/SecuritySection";
import HowItWorks from "../features/HowItWork";
import FaqButton from "../ui/FaqButton";

function Homepage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <Features />
      <HowItWorks />

      <SecuritySection />
      <CTASection />
          <Footer />
          <FaqButton/>
    </>
  );
}

export default Homepage;