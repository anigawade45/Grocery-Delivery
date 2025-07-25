import React from "react";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

const App = () => { 
  return (
    <>
      <Navbar />
      <AppRoutes />
      <Footer />
    </>
  );
};

export default App;