import React, { Suspense, useRef, useState } from "react";
import { useDebounce } from "../customHooks";
import { useLocation, useSearchParams } from "react-router-dom";
const SuggestionData = React.lazy(() => import("../components/suggestionData"));

// const fetchData = fetch("http://localhost:3001/api/getTodos");

const Testing = () => {
  const useSuggestionBox: any = useRef(null);
  const [value, setValue] = useState("");
  const [showBox, setShowBox] = useState(false);
  const [query] = useSearchParams();
  const location = useLocation();
  console.log(
    "query is ",
    query,
    location.search,
    import.meta.env.VITE_BACKEND_URL
  );
  const handleChange = (e: any) => {
    setValue(e.target.value);
    if (!e.target.value) {
      setShowBox(false);
    } else {
      setShowBox(true);
    }
  };

  const clickOnItem = (val: any) => {
    setValue(val);
    setShowBox(false);
  };

  const debounceData = useDebounce(value);

  return (
    <div>
      {/* <Outlet /> */}
      <div className="row mt-4 ms-4">
        <div className="col-4">
          <div className="row">
            <input
              type="text"
              value={value}
              onChange={handleChange}
              className="form-control bg-body-secondary"
              id="formGroupExampleInput"
              placeholder="Example input placeholder"
            />
            {showBox ? (
              <Suspense fallback="LOADING...">
                <SuggestionData
                  showBox={showBox}
                  useSuggestionBox={useSuggestionBox}
                  clickOnItem={clickOnItem}
                  debounceval={debounceData}
                />
              </Suspense>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testing;
