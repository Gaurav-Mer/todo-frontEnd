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
import validateAuthAndFetchData from "./utils/validateAuthAndFetchData";

const AppRouter: React.FC = () => {
  const store = useSelector((state: RootState) => state);
  
  const { error, loading } = validateAuthAndFetchData(store?.userData);
  console.log("error are", error, loading, store.userData);

  if (loading) {
    return <div className="bg-main"></div>
  }

  if (error) {
    return (
      <h1>
        something went wrong!
      </h1>
    )
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute userData={store?.userData} pageType="home">
                <Home userData={store?.userData} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
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
      {/* ) : (
        <div className="bg-main"></div>
      )} */}
    </>
  );
};

export default AppRouter;
