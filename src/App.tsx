import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./paths/home";
import Register from "./paths/register";
import Login from "./paths/login";
import Testing from "./paths/testing";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserData, toggleRedirect } from "./reduxConfig/slices/todoSlices";
import { RootState } from "./reduxConfig/store";
import ProtectedRoute from "./paths/protectedRoute";
import Team from "./paths/team";
import SuspenseExample from "./paths/suspenseExample";
import StripeError from "./paths/stripeError";
import Success from "./paths/success";

const AppRouter: React.FC = () => {
  const store = useSelector((state: RootState) => state);
  const [loadELement, setLoadElement] = useState(false);

  const dispatch = useDispatch();
  const fetchDataFromToken = async () => {
    try {
      const myurl = `${import.meta.env.VITE_BACKEND_URL}/api/setAuth`;
      console.log("my url is ", myurl);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/setAuth`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include credentials for cross-origin requests
      });
      const jsonData = await response.json();
      if (response?.status === 200) {
        if (jsonData?.hasOwnProperty("rData")) {
          if (jsonData?.rData?.id) {
            const profileData = await fetch(
              `http://localhost:3001/api/fetchProfileData?id=${jsonData?.rData?.id}`
            );
            if (profileData) {
              const rData = await profileData.json();

              if (profileData?.status === 200) {
                return dispatch(setUserData({ tokenData: rData?.rData }));
              }
            }
          }
        }
        dispatch(setUserData({ tokenData: jsonData?.rData }));
      } else {
        dispatch(toggleRedirect(true));
      }
    } catch (error) {
      console.log("error is =>", error);
    }
  };

  useEffect(() => {
    const { userData } = store;
    if (Object.keys(userData)?.length > 0) {
      dispatch(setUserData({ tokenData: userData }));
    } else {
      fetchDataFromToken();
    }
  }, []);

  //this useEffect to load the dom after 100ms so that my userData get fetched and stored in STORE of redux
  useEffect(() => {
    const r = setTimeout(() => {
      setLoadElement(true);
    }, 700);
    return () => clearTimeout(r);
  }, []);
  console.log("hey there", import.meta.env.VITE_BACKEND_URL);

  return (
    <>
      {loadELement ? (
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              // element={
              //   !store?.redirect ? (
              //     <Home userData={store?.userData} />
              //   ) : (
              //     <Navigate replace to={"/login"} />
              //   )
              // }
              // element={<Home />}
              element={
                <ProtectedRoute userData={store?.userData} pageType="home">
                  <Home userData={store?.userData} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/register"
              // element={
              //   store?.redirect ? <Register /> : <Navigate replace to={"/"} />
              // }
              element={
                <ProtectedRoute userData={store?.userData} pageType="register">
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              // element={store?.redirect ? <Login /> : <Navigate replace to={"/"} />}
              element={
                <ProtectedRoute userData={store?.userData} pageType="login">
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route path="/test" element={<Testing />} />
            <Route
              path="/team"
              element={
                <ProtectedRoute userData={store?.userData} pageType="team">
                  <Team userData={store?.userData} />
                </ProtectedRoute>
              }
            />
            <Route path="/suspense" element={<SuspenseExample />} />
            {/* <Route path="/stripe" element={<TestStripe />} /> */}
            <Route path="/stripeError" element={<StripeError />} />
            <Route path="/stripeSuccess" element={<Success />} />

          </Routes>
        </BrowserRouter>
      ) : (
        <div className="bg-main"></div>
      )}
    </>
  );
};

export default AppRouter;
