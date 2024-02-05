import React, { useEffect, useRef, useState } from "react";
import MobileSideBar from "./mobileSidebar";
import { Button } from "primereact/button";
import Navbar from "./navbar";
import DesktopLeft from "./desktopLeft";
import TodoLoader from "./loader/todoLoader";
import RightSide from "./rightSide";
import styles from "../register.module.css";
import { useLocation } from "react-router-dom";
import { InfiniteScroll } from "./infiniteScroll";
import CreateTodoModal from "./modal/createTodoModal";

interface Props {
  Ptype: string;
  userData: Record<any, any>;
}

const HomeLayout: React.FC<Props> = ({ Ptype, userData }) => {
  const [loader, setLoader] = useState(false);
  const [todoList, setTodoList] = useState<Record<any, any>[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const intersectionRef = useRef<any>(null);
  const [pageQuery, setPageQuery] = useState<number>(1);
  const [modalShow, setModalShow] = useState(false);
  //ref is for infiniteScroll
  const isDataFetchRef = InfiniteScroll(intersectionRef);

  const location = useLocation();

  const fetchAllTodos = async (type: any, signal: any) => {
    try {
      let url =
        Ptype === "team"
          ? `${import.meta.env.VITE_BACKEND_URL}/api/getTodos?todoType=team&page=${pageQuery}`
          : `${import.meta.env.VITE_BACKEND_URL}/api/getTodos?page=${pageQuery
          }`;
      if (type && type !== null) {
        url =
          Ptype === "team"
            ? `${import.meta.env.VITE_BACKEND_URL}/api/getTodos?filter=${type}&todoType=team&page=${pageQuery}`
            : `${import.meta.env.VITE_BACKEND_URL}/api/getTodos?filter=${type}&page=${pageQuery}`;
      }
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include", // Include credentials for cross-origin requests

        signal,
      });
      if (response.status === 200) {
        const respData = await response.json();
        if (respData?.success) {
          setLoader(false);
          if (intersectionRef && respData?.rData?.length < 9) {
            intersectionRef.current.style.display = "none"
          }
          if (pageQuery > 1) {
            return setTodoList(prev => [...prev, ...respData?.rData])
          } else {
            return setTodoList(respData?.rData);
          }
        }
      }
      setLoader(false);
      return setTodoList([]);
    } catch (error) {
      console.log("error is ", error);
      setLoader(false);
      return [];
    }
  };

  const toggleModal = () => {
    setModalShow(prev => !prev)
  };
  

  // const openDialogDesktop = () => {
  //   setModalShow(prev => !prev)
  // }

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const params = new URLSearchParams(location.search);
    // const { pType } = Object.f1romEntries(params);
    const tType = params.get("tType");
    fetchAllTodos(tType, signal);
    return () => controller.abort();
  }, [location?.search, pageQuery]);


  useEffect(() => {
    if (todoList?.length > 0 && isDataFetchRef) {
      setPageQuery(prev => prev + 1)
    }
  }, [isDataFetchRef]);

  console.log("modalShow", modalShow);


  return (
    <div className={`container-fluid p-0 ${styles.bg}`} style={{ minHeight: "100vh" }}>
      <Navbar userData={userData} />
      <div className="container-fluid">
        <div className="row">
          <div className="d-none d-md-block   col-3  col-xl-2  p-0 mt-2" >
            <DesktopLeft pageType="DesktopView" callBackFunc={toggleModal} setTodoList={setTodoList} userData={userData} />
          </div>
          <div className="col-12  col-md-9 col-xl-10 mt-5">
            {loader ? (
              <TodoLoader />
            ) : (
              <RightSide
                setTodoList={setTodoList}
                todoList={todoList}
                userData={userData}
                forwardRef={intersectionRef}
              />
            )}
          </div>
        </div>
      </div>
      <Button
        className="border-0 rounded-circle  d-block d-md-none"
        onClick={() => setVisible((prev) => !prev)}
        style={{ position: "fixed", right: 20, bottom: 30 }}
        icon={<i className="fa-solid fa-plus fa-lg"></i>}
      />
      {visible ?
        <MobileSideBar
          userData={userData}
          setTodoList={setTodoList}
          visible={visible}
          setVisible={setVisible}
          toggleModal={toggleModal}
        />
        : ""}

      {modalShow ? (
        <CreateTodoModal
          setTodoList={setTodoList}
          show={modalShow}
          onClose={toggleModal}
        />
      ) : (
        ""
      )}


    </div>
  );
};
export default HomeLayout;
