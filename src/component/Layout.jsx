import { LayoutContainer, MainContainer } from "../styles/Layoutstyle";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "sonner";
import NaviButton from "./NavigateButton";
import UserHeader from "../user/UserHeader";

function Layout({ children }) {
  return (
    <>
      <Header />
      {/* <UserHeader/> */}
      <MainContainer>
        {/* <Toaster /> */}
        <LayoutContainer>{children}</LayoutContainer>
        

        <Footer />
      </MainContainer>
    </>
  );
}

export default Layout;
