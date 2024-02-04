import React, { useState } from "react";
import { emailRegex } from "../helpers/constant";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";

type AssoType = Record<any, any>;
interface TodoDate {
  title: string;
  assignTo: string;
  dueDate: string;
  dueTime: string;
  level: string;
  description: string;
  associateWith: AssoType[];
}

interface Props {
  newTodo: Record<any, any>;
  setNewTodo: React.Dispatch<React.SetStateAction<TodoDate>>;
  handleChangeUser: any;
  userData: Record<any, any>;
  handleSelectUser: any;
}
const AddMore: React.FC<Props> = ({
  newTodo,
  setNewTodo,
  handleChangeUser,
  userData,
  handleSelectUser,
}) => {
  type Error = Record<string, string>;
  const [errorList, setErrorList] = useState<Error>({});

  const valiDateUserEmail = async (email: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/validateEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        //   credentials: "include", // Include credentials for cross-origin requests
      });
      const jsonData = await response.json();
      if (!response || response?.status !== 200 || !jsonData?.success) {
        toast.error(jsonData?.msg);
        return false;
      }
      return true;
    } catch (error) {
      toast.error("Something Went Wrong!");
      return false;
    }
  };

  const addNewUser = async (index: any, type: any) => {
    // if click + => check that all its prev data are filled uf not show error
    if (type !== "desc") {
      for (let i = 0; i < newTodo?.associateWith.length; i++) {
        if (newTodo?.associateWith[i]?.email?.length < 1) {
          return setErrorList({
            email: i.toString(),
            msg: "This field can not be empty",
          });
        }
      }
      //validating the email format
      if (!emailRegex.test(newTodo.associateWith[index]?.email)) {
        return setErrorList({ email: index, msg: "Invalid email" });
      }
    }

    //validate that the enter email is is db or not :-
    const isValid =
      type === "desc"
        ? true
        : await valiDateUserEmail(newTodo.associateWith[index]?.email);


    if (isValid) {
      setNewTodo((prev) => {
        let obj = { ...prev };
        if (type === "desc") {
          //removing the element
          obj.associateWith = obj.associateWith.filter((_, i) => i !== index);
        } else if (obj?.associateWith?.length < 5) {
          obj.associateWith = [
            ...obj.associateWith,
            { email: "", role: "user" },
          ];
        }
        return obj;
      });
    }
  };

  return (
    <>
      {newTodo?.associateWith?.map((item: any, index: number) => {
        return (
          <>
            <div key={index} className="col-6 bg-light border-2  py-2 ">
              <div className="input-group">
                <input
                  name="email"
                  id="inputStateEmail"
                  placeholder="Enter email"
                  onChange={(e) => handleChangeUser(e, index)}
                  value={`${item?.email}`}
                  className={`form-control  ${errorList?.email && Number(errorList?.email) === index
                    ? "is-invalid "
                    : ""
                    }`}
                />
                {item?.email === userData?.email ? (
                  <span className="input-group-text text-danger fw-bold">
                    (you)
                  </span>
                ) : (
                  ""
                )}
              </div>
              {errorList?.email && Number(errorList?.email) === index ? (
                <div className="text-danger d-block ">{errorList?.msg}</div>
              ) : (
                ""
              )}
            </div>
            <div className="col-4 col-md-3 col-xl-4  bg-light border-2 py-2 ">
              <select
                onChange={(e) => handleSelectUser(e, index)}
                value={item?.role}
                id="inputStateRole"
                name="role"
                className={`form-control ${errorList?.level ? "is-invalid " : ""
                  }`}
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            <div className="col-1 pt-2">
              <div className="d-flex gap-2 ">
                {newTodo?.associateWith?.length !== 1 ? (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => addNewUser(index, "desc")}
                  >
                    <i className="fa-solid fa-minus"></i>
                  </Button>
                ) : (
                  ""
                )}
                {newTodo?.associateWith?.length - 1 === index ? (
                  <Button className="d-none d-sm-block" size="sm" onClick={() => addNewUser(index, "inc")}>
                    <i className="fa-solid fa-plus"></i>
                  </Button>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-12">
              {newTodo?.associateWith?.length - 1 === index ? (
                <Button  className=" d-sm-none w-100" size="sm" onClick={() => addNewUser(index, "inc")}>
                  <i className="fa-solid fa-plus"></i> Add member
                </Button>
              ) : (
                ""
              )}
            </div>
          </>
        );
      })}
    </>
  );
};

export default AddMore;
