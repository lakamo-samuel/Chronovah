import Footer from "../components/Footer";
import Header from "../components/Header";
import CTAComponent from "../features/Hopepage/CTA";
import Features from "../features/Hopepage/Feature";
import Hero from "../features/Hopepage/Hero";
import UserFeedback from "../features/Hopepage/UserFeedback";
import HowItWorks from "../features/Hopepage/HowItWork";
import Faq from "../features/Hopepage/Faq";
import FaqButton from "../ui/FaqButton";

/**
 * Renders the homepage by composing header, hero, features, how-it-works, user feedback, FAQ, CTA, footer, and FAQ button in that order.
 *
 * @returns A JSX element containing the assembled homepage sections
 */
function Homepage() {
  return (
    <>
      <Header />
      <Hero />
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