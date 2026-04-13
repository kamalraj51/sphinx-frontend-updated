import { LayoutContainer, MainContainer } from "../styles/Layoutstyle";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "sonner";

function Layout({ children }) {
  return (
    <>
      <Header />
      <MainContainer>
        {/* <Toaster /> */}
        <LayoutContainer>{children}</LayoutContainer>
        <Footer />
      </MainContainer>
    </>
  );
}

export default Layout;
