import { LayoutContainer, MainContainer } from "../styles/Layoutstyle";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "sonner";
import NaviButton from "./NavigateButton";
import { useEffect } from "react";

import UserHeader from "../user/UserHeader";

function Layout({ children }) {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
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
