import React from "react";
import HomeLayout from "../components/homeLayout";

type OverAllSt = Record<string | any, string | any>;
const Home: React.FC<OverAllSt> = ({ userData }) => {
  return <HomeLayout userData={userData} Ptype="home" />;
};

export default Home;
