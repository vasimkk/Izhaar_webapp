import React from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "./UserLayout";
import SlideSection from "./SlideSection";
import FeaturesSection from "./FeaturesSection";
import OurServices from "./OurServices";
import Magazine from "../../Magazine";
import Gifts from "../Gifts";

export default function UnifiedDashboard() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };




  return (
    <UserLayout showHeader={true}>

      {/* Slide Section */}
      <div className="container-fuild ">
        <SlideSection />
      </div>

  {/* Our Services Section */}
      <OurServices />

      <Magazine/>

    </UserLayout>
  );
}
