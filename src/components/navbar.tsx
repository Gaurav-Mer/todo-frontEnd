import React, { useState } from "react";
import ProfileDrawer from "./modal/profileDrawer";

type OverAllSt = Record<string, string | any>;
const Navbar: React.FC<OverAllSt> = ({ userData }) => {
  const [loader, setLoader] = useState<boolean>(false);
  const [editProfile, setEditProfile] = useState({ open: false });

  const logoutUser = async () => {
    try {
      setLoader(true);
      let url = `${import.meta.env.VITE_BACKEND_URL}/api/logout`;
      const resp = await fetch(url, {
        method: "GET",
        headers: {
          "Context-type": "application/json",
        },
        credentials: "include",
      });

      if (resp && resp.status === 200) {
        window.location.reload();
      } else {
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      console.log("error is =>", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-primary bg-gradient  text-white" style={{ position: 'fixed', width: "100%", zIndex: 2 }}>
      <div className="container-fluid">
        <a className="navbar-brand text-white fw-bold " href="#">
          Todo List
        </a>

        <div className="d-flex gap-4">
          {userData?.avatar ? (
            <img
              onClick={() =>
                setEditProfile((prev) => ({ ...prev, open: true }))
              }
              src={`${import.meta.env.VITE_BACKEND_URL}/avatar/${userData?.avatar?.data}`} // Replace with your server and avatar folder
              className="rounded-2"
              style={{ width: 40, height: 40 }}
              alt="Avatar"
            />
          ) : (
            <div
              onClick={() =>
                setEditProfile((prev) => ({ ...prev, open: true }))
              }
              className="rounded-2 bg-warning container me-2  fw-bold d-flex align-items-center justify-content-center"
              style={{ width: 35, height: 35 }}
            >
              {userData?.name ? userData?.name[0] : ""}
            </div>
          )}
          {loader ? (
            <div className="me-4 mt-2">
              <div
                style={{ width: 20, height: 20 }}
                className="spinner-border ms-4  d-flex justify-content-center mx-auto "
                role="status"
              ></div>
            </div>
          ) : (
            <button
              onClick={logoutUser}
              className="text-white align-items-center d-flex container border-0 bg-transparent"
            >
              <span className="d-none d-sm-block ">logout</span>{" "}
              <i className="fa-solid fa-right-from-bracket ms-2  mt-1 "></i>
            </button>
          )}
        </div>
      </div>
      <ProfileDrawer
        show={editProfile?.open}
        onClose={() => setEditProfile((prev) => ({ ...prev, open: false }))}
        isEdit={true}
        userData={userData}
      />
    </nav>
  );
};

export default Navbar;
