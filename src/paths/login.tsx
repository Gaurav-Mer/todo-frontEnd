import React, { useState } from "react";
import styles from "../register.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData, toggleRedirect } from "../reduxConfig/slices/todoSlices";
import { ToastContainer, toast } from "react-toastify";
import { emailRegex } from "../helpers/constant";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  interface formFormat {
    email: string;
    password: string;
  }
  const [formData, setFormData] = useState<formFormat>({
    email: "",
    password: "",
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

    if (!data?.password || data?.password?.length <= 0) {
      error["password"] = "Password can not be empty";
    } else if (data?.password?.length > 20) {
      error["password"] = "Maximum 20 length allowed";
    }

    if (!data?.email || data?.email?.length <= 0) {
      error["email"] = "Please Enter email";
    } else if (data?.email?.length > 40) {
      error["email"] = "Maximum 40 length allowed";
    } else if (!emailRegex.test(data?.email)) {
      error["email"] = "Invalid Email";
    }

    return error;
  };

  const sendDataToBackEnd = async () => {
    const dataToBeSend = JSON.parse(JSON.stringify(formData));
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToBeSend),
        credentials: "include", // Include credentials for cross-origin requests
      });
      const jsonData = await response.json();
      setErrorData(jsonData?.msg);

      if (response?.status !== 200) {
        setLoader(false);
      } else {
        if (
          jsonData?.hasOwnProperty("rData") &&
          Object.keys(jsonData?.rData)?.length > 0
        ) {
          dispatch(setUserData({ tokenData: jsonData?.rData }));
          toast.success("Login Successfully!");
        }
        dispatch(toggleRedirect(false));
        navigate("/");
      }
    } catch (error) {
      console.log("error is =>", error);
      toast.error("Something Went Wrong!");
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
      <div className={`${styles.container}`}>
        <div className="mt-5">
          <h3 className="text-center">Login to Todo </h3>
          <div>
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
              Don't have account ? <a href="/register">Create new</a>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
