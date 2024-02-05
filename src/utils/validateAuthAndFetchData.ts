import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "../reduxConfig/slices/todoSlices";

const validateAuthAndFetchData = (initalData = {}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const dispatch = useDispatch();

    const validateAuthAndFetchData = async () => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/setAuth`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Include credentials for cross-origin requests
            });
            const jsonData = await response.json();
            if (response?.status === 200) {
                if (jsonData?.hasOwnProperty("rData")) {
                    if (jsonData?.rData?.id) {
                        const profileData = await fetch(
                            `${import.meta.env.VITE_BACKEND_URL}/api/fetchProfileData?id=${jsonData?.rData?.id}`
                        );
                        if (profileData) {
                            const rData = await profileData.json();

                            if (profileData?.status === 200) {
                                setLoading(false);
                                //here user is loggedin and setting its detail in store:-
                                return dispatch(setUserData({ tokenData: rData?.rData }));
                            }
                        }
                    }
                }
                setLoading(false);
                dispatch(setUserData({ tokenData: jsonData?.rData }));
            } else {
                //here it means that user is not login 
                setLoading(false);
            }
        } catch (error) {
            setError(true);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (Object.keys(initalData)?.length <= 0) {
            validateAuthAndFetchData();
        }
    }, [initalData]);

    return { loading, error };
};

export default validateAuthAndFetchData;