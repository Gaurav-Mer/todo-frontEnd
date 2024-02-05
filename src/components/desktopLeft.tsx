import React from "react";
import { taskType } from "../helpers/constant";
import styles from "../register.module.css";
import { useNavigate } from "react-router-dom";

interface StateProps {
  setTodoList: React.Dispatch<React.SetStateAction<any>>;
  userData: Record<any, any>;
  pageType?: string;
  callBackFunc?: (val?: any) => void;
}

const DesktopLeft: React.FC<StateProps> = ({
  pageType,
  callBackFunc,
}) => {
  const navigator = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search);
  const tType = queryParameters.get("tType");


  const handleRoute = (type: any) => {
    if (type) {
      navigator(`?tType=${type}`);
    } else {
      const pathName = window.location.pathname;
      navigator(pathName);
    }

    if (pageType && pageType !== "DesktopView" && callBackFunc) {
      callBackFunc();
    }
  };

  const handleClick = () => {
    if (pageType && callBackFunc) {
      callBackFunc("openDialog");
    }
  };

  return (
    <div className={`bg-white vh-100 p-4 `} style={{ position: 'fixed', top: 50 }}>
      <div
        onClick={handleClick}
        className="bg-primary p-2 rounded-3 d-flex gap-4"
        style={{ cursor: "pointer" }}
      >
        <button
          className="bg-white fw-bold  rounded-2 text-primary "
          style={{ border: "none" }}
        >
          <i className="fa-solid fw-bold fa-list fa-sm"></i>{" "}
        </button>
        <span className="text-white">
          Create New <i className="fa-solid fa-plus ms-2 fa-sm "></i>
        </span>
      </div>
      <button className="border-0 bg-transparent text-secondary fs-5 mt-4">
        <i className="fa-solid fa-list-check fa-sm "></i>
        <span className="m-2" style={{ fontSize: 18, fontWeight: "600" }}>
          Assign to
        </span>
      </button>
      <ul className={styles.nested}>
        <li
          onClick={() => navigator("/")}
          style={{
            color: window.location.pathname === "/" ? "#0d6efd" : "",
            fontWeight: window.location.pathname === "/" ? "500" : "",
            background: window.location.pathname === "/" ? "#f2f2f2" : "",
            padding: window.location.pathname === "/" ? 5 : "",
            borderRadius: window.location.pathname === "/" ? 5 : "",
          }}
        >
          <i className="fa-solid   fa-user fa-sm"></i> self
        </li>
        <li
          onClick={() => navigator("/team")}
          style={{
            color: window.location.pathname === "/team" ? "#0d6efd" : "",
            fontWeight: window.location.pathname === "/team" ? "500" : "",
            background: window.location.pathname === "/team" ? "#f2f2f2" : "",
            padding: window.location.pathname === "/team" ? 5 : "",
            borderRadius: window.location.pathname === "/team" ? 5 : "",
          }}
        >
          <i
            className="fa-solid fa-user-group  me-1"
            style={{ fontSize: 12 }}
          ></i>
          Team <i className="fa-solid fa-lock fa-sm ms-3"></i>
        </li>
      </ul>
      <button className="border-0 bg-transparent text-secondary fs-5 mt-2">
        <i className="fa-solid fa-clipboard-list fa-sm"></i>
        <span className="m-2" style={{ fontSize: 18, fontWeight: "600" }}>
          Task Type
        </span>
      </button>
      <ul className={styles.nested}>
        <li
          onClick={() => handleRoute("")}
          style={{
            color: !tType ? "#0d6efd" : "",
            fontWeight: !tType ? "500" : "",
            background: !tType ? "#f2f2f2" : "",
            padding: !tType ? 5 : "",
            borderRadius: !tType ? 5 : "",
          }}
        >
          All
        </li>
        {Object.keys(taskType)?.map((item: string, index) => {
          const todoVal = (taskType as any)[item];
          return (
            <li
              style={{
                color:
                  tType?.toLowerCase() === todoVal?.toLowerCase()
                    ? "#0d6efd"
                    : "",
                fontWeight:
                  tType?.toLowerCase() === todoVal?.toLowerCase() ? "500" : "",
                background:
                  tType?.toLowerCase() === todoVal?.toLowerCase()
                    ? "#f2f2f2"
                    : "",
                padding:
                  tType?.toLowerCase() === todoVal?.toLowerCase() ? 5 : "",
                borderRadius:
                  tType?.toLowerCase() === todoVal?.toLowerCase() ? 5 : "",
              }}
              onClick={() => handleRoute(todoVal)}
              key={index}
            >
              {(taskType as any)[item]}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DesktopLeft;
