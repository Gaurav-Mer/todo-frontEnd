import React, { useEffect, useState } from "react";
import { convertTo12HourFormat } from "../helpers/validate";
import CreateTodoModal from "./modal/createTodoModal";

interface OverAllSt {
  todo: Record<string, string>;
  setTodoList: React.Dispatch<React.SetStateAction<any>>;
  userData?: Record<any, any>
}

const SingleTodo: React.FC<OverAllSt> = ({ todo, setTodoList, userData }) => {
  const [showMore, setShowMore] = useState<Boolean>(false);
  const [isCompleted, setIsComplted] = useState<any>(false);
  const [editTodo, setEditTodo] = useState({
    open: false,
    data: {},
    complete: false,
  });

  //basic calcuation :--
  const timeFormat =
    todo?.dueDate && todo?.dueTime
      ? `${todo?.dueDate} ${convertTo12HourFormat(todo?.dueTime)}`
      : "";
  const badgeColor = todo?.level
    ? todo?.level?.toLowerCase() === "new"
      ? "bg-primary bg-gradient"
      : todo?.level?.toLowerCase() === "completed"
        ? "bg-success bg-gradient"
        : todo?.level?.toLowerCase() === "pending"
          ? "bg-info bg-gradient"
          : todo?.level?.toLowerCase() === "review"
            ? "bg-warning bg-gradient"
            : todo?.level?.toLowerCase() === "on hold"
              ? "bg-secondary bg-gradient"
              : "bg-danger bg-gradient"
    : "";

  const handleDeleteTodo = async (id: any) => {
    try {
      let url = `${import.meta.env.VITE_BACKEND_URL}/api/createTodo/delete`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
        credentials: "include", // Include credentials for cross-origin requests
      });
      if (response?.status !== 200) {
      } else {
        setTodoList((prev: Record<any, any>[]) => {
          let obj = [...prev];
          const findId = obj.findIndex((data) => data?._id === id);
          if (findId > -1) {
            obj.splice(findId, 1);
          }
          return obj;
        });
      }
      //udpate the state here
    } catch (error) {
      console.log("error is =>", error);
    }
  };

  // ALL STATES :--
  useEffect(() => {
    if (todo?.level && todo?.level?.toLowerCase() === "completed") {
      setIsComplted(true);
    } else {
      setIsComplted(false);
    }
  }, [todo?.level]);
    const currentUser = todo?.associateWith ? (todo?.associateWith as any)?.find((data: any) => data?.email === userData?.email) : {}

  return (
    <>
      <div className="card text-center mt-2 ">
        <div className="card-body">
          <div className="row">
            <div className="col-10">
              <div className="form-check d-flex gap-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  // value={isCompleted}
                  checked={isCompleted}
                  id="flexCheckDefault"
                  onClick={() =>
                    setEditTodo((prev) => ({
                      ...prev,
                      open: true,
                      data: todo,
                      complete: true,
                    }))
                  }
                />
                <label
                  className={`form-check-label`}
                  htmlFor="flexCheckDefault"
                >
                  {isCompleted ? <s>{todo?.title}</s> : todo?.title}
                </label>
              </div>
            </div>
            <div
              className="col-2 "
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <div>
                <div className={`badge ${badgeColor} bg-bg-gradient `}>
                  {todo?.level}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <div className="d-flex">
                <span className="mt-1 fw-bold ">Due date</span>
              </div>
              <div className="d-flex  text-secondary" style={{ fontSize: 13 }}>
                {timeFormat}
              </div>
            </div>

            <div className="col-6 d-flex justify-content-end ">
              <div>
                <div className="d-flex">
                  <span className="mt-1 fw-bold ">Assing to</span>
                </div>
                <div
                  className="d-flex  fw-bold  text-secondary position-relative "
                  style={{ fontSize: 13 }}
                >
                  {todo?.assignTo?.toUpperCase()}
                  {todo?.assignTo === "team" ? (
                    <span className="ms-1  badge rounded bg-secondary mt-1">
                      {todo?.associateWith?.length}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between mx-3">
          <p
            onClick={() => setShowMore((prev) => !prev)}
            className="text-primary"
            style={{ cursor: "pointer" }}
          >
            see more
          </p>
          {currentUser?.role && currentUser?.role === "admin" ?
            <div className="d-flex gap-4">
              <i
                onClick={() =>
                  setEditTodo((prev) => ({ ...prev, open: true, data: todo }))
                }
                className="fa-solid fa-pen-to-square text-primary "
                style={{ cursor: "pointer" }}
              ></i>
              <i
                onClick={() => handleDeleteTodo(todo?._id)}
                className="fa-solid fa-trash text-danger "
                style={{ cursor: "pointer" }}
              ></i>
            </div>
            : ""}
        </div>
        <div
          className="card-footer container"
          style={{ display: showMore ? "block" : "none" }}
        >
          <div className="col-12">{todo?.description}</div>
        </div>
      </div>
      {editTodo?.open ? (
        <CreateTodoModal
          show={editTodo?.open}
          onClose={() =>
            setEditTodo({ open: false, data: {}, complete: false })
          }
          isEdit={true}
          editData={todo}
          isCompleted={editTodo?.complete}
          setTodoList={setTodoList}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default SingleTodo;
