import { Sidebar } from "primereact/sidebar";
import React from "react";
import DesktopLeft from "./desktopLeft";

interface Props {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<any>>;
  setTodoList: React.Dispatch<React.SetStateAction<any>>;
  userData: Record<any, any>;
  toggleModal: () => void
}

const MobileSideBar: React.FC<Props> = ({
  visible,
  setVisible,
  userData,
  setTodoList,
  toggleModal
}) => {

  const handleCallBack = (data = "") => {
    if (data === "openDialog") {
      toggleModal()
    }
    setVisible(false);
  }
  return (
    <>
      <Sidebar
        header={<>HEADER</>}
        visible={visible}
        onHide={() => setVisible(false)}
      // icons={customIcons}
      >
        <DesktopLeft
          pageType="MobileView"
          callBackFunc={handleCallBack}
          setTodoList={setTodoList}
          userData={userData}
        />
      </Sidebar>
    </>
  );
};

export default MobileSideBar;
