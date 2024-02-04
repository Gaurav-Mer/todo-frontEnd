import React, { Suspense, useEffect, useState } from "react";

interface SuggestionDataProps {
  showBox?: boolean;
  useSuggestionBox: React.RefObject<HTMLDivElement>;
  clickOnItem?: (name: string) => void;
  debounceval: string;
}

interface ApiResponse {
  rData: { email: string; name: string }[];
}

const SuggestionData: React.FC<SuggestionDataProps> = ({
  showBox = false,
  useSuggestionBox,
  clickOnItem,
  debounceval,
}) => {
  const [listing, setListing] = useState<{ email: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEmailData = async (input: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/validateEmail/users?email=${input}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const jsonData: ApiResponse = await response.json();
        setListing(jsonData?.rData || []);
        setLoading(false);
      } else {
        setLoading(false);
        setListing([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setListing([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmailData(debounceval);
  }, [debounceval]);

  return (
    <div
      className={`t-2 ${showBox ? "d-block" : "d-none"} `}
      ref={useSuggestionBox}
    >
      {loading ? (
        "LOADING.."
      ) : (
        <ul className="list-group">
          <Suspense fallback={"loading........."}>
            {listing?.length > 0
              ? listing.map((item) => (
                <SingleItemListing
                  key={item.email}
                  item={item}
                  clickOnItem={clickOnItem}
                />
              ))
              : "no data found"}
          </Suspense>
        </ul>
      )}
    </div>
  );
};

interface SingleItemProps {
  clickOnItem?: (name: string) => void;
  item: { email: string; name: string };
}

const SingleItemListing: React.FC<SingleItemProps> = ({
  clickOnItem,
  item,
}) => {
  return (
    <li onClick={() => clickOnItem?.(item.email)} className="list-group-item">
      {item.email}
    </li>
  );
};

export default SuggestionData;
