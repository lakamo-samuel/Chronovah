import Footer from "../components/Footer";
import Header from "../components/Header";
import CTAComponent from "../features/Hopepage/CTA";
import Features from "../features/Hopepage/Feature";
import Hero from "../features/Hopepage/Hero";
import UserFeedback from "../features/Hopepage/UserFeedback";
import HowItWorks from "../features/Hopepage/HowItWork";
import Faq from "../features/Hopepage/Faq";
import FaqButton from "../ui/FaqButton";
import PricingSection from "../features/Hopepage/PricingSection";

function Homepage() {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <PricingSection />
      <HowItWorks />

      <UserFeedback />
      <Faq />
      <CTAComponent />
      <Footer />
      <FaqButton />
    </>
  );
}

export default Homepage;