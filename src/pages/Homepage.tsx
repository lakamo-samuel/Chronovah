// import AboutSection from "../components/AboutUs";
import Footer from "../components/Footer";
import CTAComponent from "../features/Hopepage/CTA";
import Features from "../features/Hopepage/Feature";
// import Hero from "../features/Hopepage/Hero";
// import SecuritySection from "../features/Hopepage/SecuritySection";
import UserFeedback from "../features/Hopepage/UserFeedback";
import HowItWorks from "../features/Hopepage/HowItWork";
import Faq from "../features/Hopepage/Faq";
import FaqButton from "../ui/FaqButton";

function Homepage() {
  return (
    <>
      <Features />
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