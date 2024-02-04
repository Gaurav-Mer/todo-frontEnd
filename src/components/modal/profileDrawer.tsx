import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import imageCompression from "browser-image-compression";
import { useDispatch } from "react-redux";
import { setUserData } from "../../reduxConfig/slices/todoSlices";

interface OuterFace {
  onClose: any;
  show: any; // Define the type for onClick
  isEdit?: boolean;
  userData?: Record<any, any>;
}

type AvatarIf = Record<any, any>;

const ProfileDrawer: React.FC<OuterFace> = ({ onClose, show, userData }) => {
  const [loader, setLoader] = useState(false);
  const [userAvatar, setUserAvatar] = useState<AvatarIf>({
    data: null,
    isChange: false,
    tempImg: null,
  });
  const dispatch = useDispatch();

  const submitForm = async (e: any) => {
    setLoader(false);
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("avatar", userAvatar?.data);
      formData.append("id", userData?.id || userData?._id);
      formData.append(
        "image_id",
        userData?.avatar ? userData?.avatar?.path : ""
      );

      // return;
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/uploadAvatar`, {
        method: "POST",

        body: formData,
      });
      if (response?.status === 200) {
        //update the avatar in the context :-
        const jsonnData = await response.json();
        const respData = jsonnData?.rData;
        dispatch(setUserData({ tokenData: respData }));
        onClose();
      }
    } catch (error) {
      console.error("Error during file upload:", error);
    }
  };

  const handleImage = async (file: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = file?.target?.files ? file.target.files[0] : null;

    try {
      const options = {
        maxSizeMB: 0.5,
        useWebWorker: true,
      };
      if (selectedFile) {
        const compressedImage = await imageCompression(selectedFile, options);
        setUserAvatar((prev) => ({
          ...prev,
          data: compressedImage,
          isChange: true,
          tempImg: URL.createObjectURL(selectedFile),
        }));
      }
    } catch (error) {
      console.error("Error compressing image:", error);
    }
  };

  //setting image any
  useEffect(() => {
    if (
      userData &&
      userData?.hasOwnProperty("avatar") &&
      userData?.avatar?.data
    ) {
      setUserAvatar((prev) => ({ ...prev, data: userData?.avatar?.data }));
    }
  }, [userData]);

  return (
    <>
      <Modal
        show={show}
        // size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="bg-primary bg-gradient modal-close">
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="text-white"
          >
            Edit Profile
          </Modal.Title>
          <i
            onClick={onClose}
            style={{ cursor: "pointer" }}
            className="fa-solid fa-xmark fa-xl text-white"
          ></i>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={submitForm}
            action="/upload"
            method="post"
            encType="multipart/form-data"
          >
            <div className="row g-3">
              <div className="col-5">
                <div className="d-flex justify-content-center ">
                  {userAvatar?.data ? (
                    <div>
                      <img
                        //   src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                        src={
                          !userAvatar?.isChange
                            ? `${import.meta.env.VITE_BACKEND_URL}/avatar/${userAvatar?.data}`
                            : userAvatar?.tempImg
                        }
                        className="rounded-2 bg-secondary d-flex justify-content-center  my-auto"
                        style={{
                          width: "auto",
                          height: "100%",
                          maxHeight: "140px",
                          maxWidth: "170px",
                        }}
                        alt="Avatar"
                      />

                      <label
                        className="input-group-text bg-transparent w-100 mt-2 "
                        htmlFor="inputGroupFile01"
                        style={{ cursor: "pointer" }}
                      >
                        <i className="fa-solid fa-cloud-arrow-up my-auto fa-2xl text-primary "></i>
                        <p className="my-auto ms-2">Upload</p>
                      </label>
                      <input
                        onChange={handleImage}
                        style={{ display: "none" }}
                        type="file"
                        className="form-control"
                        id="inputGroupFile01"
                      />
                    </div>
                  ) : (
                    <div
                      className="container  d-flex justify-content-center w-100 rounded-2"
                      style={{
                        height: "160px",
                        //   border: "1px dotted grey",
                        background: "#b5bfd091",
                      }}
                    >
                      <label
                        className="input-group-text bg-transparent w-100 "
                        htmlFor="inputGroupFile01"
                        style={{ cursor: "pointer" }}
                      >
                        <i className="fa-solid fa-cloud-arrow-up my-auto fa-2xl text-primary "></i>
                        <p className="my-auto ms-2">Upload </p>
                      </label>
                      <input
                        onChange={handleImage}
                        style={{ display: "none" }}
                        type="file"
                        className="form-control"
                        id="inputGroupFile01"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="col-7">
                <div className="mb-3">
                  <label htmlFor="formGroupExampleInput" className="form-label">
                    Name{" "}
                  </label>
                  <input
                    type="text"
                    readOnly={true}
                    value={userData?.name}
                    className="form-control"
                    id="formGroupExampleInput"
                    placeholder="Example input placeholder"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Email
                  </label>
                  <div className="input-group w-100">
                    <div className="input-group-text ">
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
                      type="email"
                      readOnly={true}
                      value={userData?.email}
                      className="form-control"
                      id="formGroupExampleInput"
                      placeholder="Example input placeholder"
                    />
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="d-flex justify-content-end  gap-3">
              <Button onClick={onClose} variant="outline-danger">
                Cancel
              </Button>{" "}
              {loader ? (
                <div
                  className="spinner-border text-primary  d-flex justify-content-center mx-auto "
                  role="status"
                ></div>
              ) : (
                <Button disabled={!userAvatar?.isChange} type="submit">
                  Update
                </Button>
              )}
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default ProfileDrawer;
