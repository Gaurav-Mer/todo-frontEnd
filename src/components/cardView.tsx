import { Card } from "primereact/card";
import React, { useEffect, useState } from "react";
import { convertTo12HourFormat } from "../helpers/validate";
import { Badge } from "primereact/badge";
import CreateTodoModal from "./modal/createTodoModal";

interface OverAllSt {
  todo: Record<string, string>;
  setTodoList: React.Dispatch<React.SetStateAction<any>>;
  userData: Record<any, any>
}

const CardView: React.FC<OverAllSt> = ({ setTodoList, todo, userData }) => {
  const [showMore, setShowMore] = useState<Boolean>(false);
  const [isCompleted, setIsComplted] = useState<any>(false);
  const [editTodo, setEditTodo] = useState({
    open: false,
    data: {},
    complete: false,
  });


  const currentUser = todo?.associateWith ? (todo?.associateWith as any)?.find((data: any) => data?.email === userData?.email) : {}


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

  const footer = (
    <div className="d-flex justify-content-between ">
      <div className={currentUser?.role !== "admin" ? "d-none" : ""}>
        <button
          onClick={() =>
            setEditTodo((prev) => ({ ...prev, open: true, data: todo }))
          }
          className="border-0  bg-primary text-white rounded p-1"
        >
          <span className="d-none d-xl-inline">Edit</span>  {<i className="fa-regular fa-pen-to-square p-1"></i>}
        </button>
        <button
          onClick={() => handleDeleteTodo(todo?._id)}
          className="border-0 ms-3  bg-danger text-white rounded p-1"
        >
          <span className="d-none d-xl-inline">Delete</span> {<i className="fa-regular fa-trash-can p-1"></i>}
        </button>
      </div>
      <Badge value={todo?.level} className={`${badgeColor} mt-1`} />
    </div>
  );

  //basic calcuation :--
  const timeFormat =
    todo?.dueDate && todo?.dueTime
      ? `${todo?.dueDate} ${convertTo12HourFormat(todo?.dueTime)}`
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

  const spliceLength = 50;
  const truncatedContent = showMore
    ? todo?.description
    : todo?.description?.slice(0, spliceLength);

  const showMoreButton =
    todo?.description?.length > 50 ? (
      <button
        className={`text-primary bg-transparent  fw-bold border-0 rounded-1 `}
        onClick={() => setShowMore((prev) => !prev)}
      >
        {showMore ? "less" : "more"}
        {showMore ? (
          <i className="fa-solid fa-caret-up ms-2"></i>
        ) : (
          <i className="fa-solid fa-caret-down ms-2"></i>
        )}
      </button>
    ) : (
      ""
    );

  return (
    <div className="row gx-2 ">
      <Card
        className="m-0 p-0 "
        title={isCompleted ? <s>{todo?.title}</s> : todo?.title}
        subTitle={
          <>
            <span>
              Due Date: <span>{timeFormat}</span>
            </span>
          </>
        }
        footer={footer}
      >
        <p className="m-0" style={{ minHeight: 60 }}>
          {truncatedContent} {showMoreButton}{" "}
        </p>
      </Card>

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
    </div>
  );
};

export default CardView;
