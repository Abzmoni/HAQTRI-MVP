import Header from "../components/Header/Header";
import StickyCta from "../components/StickyCta/StickyCta";
import MobileMenu from "../components/MobileMenu/MobileMenu";
import Footer from "../components/Footer/Footer";
import BackToTop from "../components/BackToTop/BackToTop";

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <StickyCta />
      <MobileMenu />
      <main>{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}
