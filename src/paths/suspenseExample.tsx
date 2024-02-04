import { Suspense } from "react";
import ItemData from "../components/testing/itemData";
const SuspenseExample = () => {
  return (
    <>
      <Suspense
        fallback={
          <div className="bg-primary w-100  h-100 ">LOADING...........</div>
        }
      >
        <ItemData  />
      </Suspense>
    </>
  );
};

export default SuspenseExample;
