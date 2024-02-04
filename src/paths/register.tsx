import React, { useState } from "react";
import styles from "../register.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData, toggleRedirect } from "../reduxConfig/slices/todoSlices";
import { ToastContainer, toast } from "react-toastify";
import { emailRegex } from "../helpers/constant";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  interface formFormat {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  const [formData, setFormData] = useState<formFormat>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  type error = Record<string, string>;
  const [errorData, setErrorData] = useState<error>({});
  const [loader, setLoader] = useState<Boolean>(false);
  interface PF {
    password: Boolean;
    cPassword: Boolean;
  }
  const [showPassword, setShowPassword] = useState<PF>({
    password: false,
    cPassword: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateData = (data: formFormat) => {
    let error: Record<string, string> = {}; // Define the type of the error object
    if (!data?.name || data?.name?.length <= 0) {
      error["name"] = "Please Enter name";
    } else if (data?.name?.length > 20) {
      error["name"] = "Maximum 20 length allowed for name";
    }
    if (!data?.email || data?.email?.length <= 0) {
      error["email"] = "Please Enter email";
    } else if (data?.email?.length > 40) {
      error["email"] = "Maximum 40 length allowed";
    } else if (!emailRegex.test(data?.email)) {
      error["email"] = "Invalid Email";
    }

    if (!data?.password || data?.password?.length <= 0) {
      error["password"] = "Password can not be empty";
    } else if (data?.password?.length > 20) {
      error["password"] = "Maximum 20 length allowed";
    }

    if (!data?.confirmPassword || data?.confirmPassword?.length <= 0) {
      error["confirmPassword"] = "confirmPassword can not be empty";
    } else if (data?.confirmPassword?.length > 20) {
      error["confirmPassword"] = "Maximum 20 length allowed";
    }

    if (data?.password !== data?.confirmPassword) {
      error["confirmPassword"] = "Password did not match";
    }

    return error;
  };

  const sendDataToBackEnd = async () => {
    const dataToBeSend = JSON.parse(JSON.stringify(formData));
    delete dataToBeSend.confirmPassword;
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToBeSend),
        credentials: "include", // Include credentials for cross-origin requests
      });
      if (response?.status !== 200) {
        setLoader(false);
      } else {
        const jsonData = await response.json();
        if (
          jsonData?.hasOwnProperty("rData") &&
          Object.keys(jsonData?.rData)?.length > 0
        ) {
          dispatch(setUserData({ tokenData: jsonData?.rData }));
        }
        dispatch(toggleRedirect(false));
        navigate("/");
      }
    } catch (error) {
      toast.error("Something Went Wrong!");
      console.log("error is =>", error);
      setLoader(false);
    }
  };
  const onSubmitForm = (e: React.FormEvent) => {
    setLoader(true);
    e.preventDefault();
    const errorList = validateData(formData);
    if (Object.keys(errorList)?.length > 0) {
      setLoader(false);
      return setErrorData(errorList);
    }
    setErrorData({});
    sendDataToBackEnd();
  };

  const showPasswordOrNot = (type: string) => {
    if (type === "password") {
      setShowPassword((prev: PF) => {
        let obj = { ...prev };
        obj[type] = !obj.password;
        return obj;
      });
    } else {
      setShowPassword((prev: PF) => {
        let obj = { ...prev };
        obj.cPassword = !obj.cPassword;
        return obj;
      });
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className="mt-5">
          <h3>Create your account</h3>
          <div>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Enter your Name
              </label>
              <div className="input-group ">
                <div className="input-group-text">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-person"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664z" />
                  </svg>
                </div>
                <input
                  onChange={(e) => handleChange(e)}
                  name="name"
                  type="email"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="John"
                  className={`form-control ${
                    errorData?.name ? "is-invalid " : ""
                  }`}
                />
              </div>
              {errorData?.name ? (
                <div className="text-danger">{errorData?.name}</div>
              ) : (
                ""
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Enter your Email
              </label>

              <div className="input-group">
                <div className="input-group-text">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-envelope"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                  </svg>
                </div>
                <input
                  type="email"
                  onChange={handleChange}
                  name="email"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="abc@gmail.com"
                  className={`form-control ${
                    errorData?.email ? "is-invalid " : ""
                  }`}
                />
              </div>
              {errorData?.email ? (
                <div className="text-danger">{errorData?.email}</div>
              ) : (
                ""
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Enter Password
              </label>
              <div className="input-group ">
                <div className="input-group-text">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-lock"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
                  </svg>
                </div>
                <input
                  type={showPassword?.password ? "text" : "password"}
                  id="exampleInputPassword1"
                  placeholder="**********"
                  onChange={handleChange}
                  name="password"
                  className={`form-control ${
                    errorData?.password ? "is-invalid " : ""
                  }`}
                />
                <div className="input-group-text">
                  {!showPassword?.password ? (
                    <i
                      onClick={() => showPasswordOrNot("password")}
                      className="fa-solid fa-eye"
                    ></i>
                  ) : (
                    <i
                      onClick={() => showPasswordOrNot("password")}
                      className="fa-solid fa-eye-slash fa-sm"
                    ></i>
                  )}
                </div>
              </div>
              {errorData?.password ? (
                <div className="text-danger">{errorData?.password}</div>
              ) : (
                ""
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Confirm Password
              </label>
              <div className="input-group mb-3">
                <div className="input-group-text">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-lock"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
                  </svg>
                </div>
                <input
                  type={showPassword?.cPassword ? "text" : "password"}
                  id="exampleInputPassword1"
                  placeholder="**********"
                  onChange={handleChange}
                  name="confirmPassword"
                  className={`form-control ${
                    errorData?.confirmPassword ? "is-invalid " : ""
                  }`}
                />

                <div className="input-group-text">
                  {!showPassword?.cPassword ? (
                    <i
                      onClick={() => showPasswordOrNot("cPassword")}
                      className="fa-solid fa-eye"
                    ></i>
                  ) : (
                    <i
                      onClick={() => showPasswordOrNot("cPassword")}
                      className="fa-solid fa-eye-slash fa-sm"
                    ></i>
                  )}
                </div>
              </div>
              {errorData?.confirmPassword ? (
                <div className="text-danger">{errorData?.confirmPassword}</div>
              ) : (
                ""
              )}
            </div>

            {loader ? (
              <div
                className="spinner-border text-primary  d-flex justify-content-center mx-auto "
                role="status"
              ></div>
            ) : (
              <button
                onClick={onSubmitForm}
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%" }}
              >
                Submit
              </button>
            )}
            <p className="mt-2">
              Already Member ? <a href="/login">log In now</a>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
