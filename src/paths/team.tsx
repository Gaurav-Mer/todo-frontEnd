import React from "react";
import HomeLayout from "../components/homeLayout";

type OverAllSt = Record<string | any, string | any>;

const Team: React.FC<OverAllSt> = ({ userData }) => {
  return <HomeLayout userData={userData} Ptype="team" />;
};
export default Team;
