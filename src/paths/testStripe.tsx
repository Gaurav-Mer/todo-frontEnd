import { loadStripe } from "@stripe/stripe-js";
import SubscriptionModal from "../components/teststripe/subscriptionModal";
import { Elements } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";

const stripePromise = loadStripe("pk_test_51Od8BaSIKJo0jsm4hjkw7PHFv230XtvL1t4BqIolACjtvX7WDlYpWfcJwcE0STH0vmLBzXxKKnuRn0ad7515ohLA00XltJ9uTO");

const TestStripe = () => {
    const [subsList, setSubsList] = useState<Record<any, any>[]>([])
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/createSubscription');
                const data = await response.json();
                console.log("SUBSCRIPTION MODAL DATA IS ", data);
                if (response?.status === 200 && data?.rData) {
                    setSubsList(data?.rData)
                }
            } catch (error) {
                console.error("ERROR HAI :--", error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div>
            <Elements stripe={stripePromise}>
                <SubscriptionModal subsList={subsList} />
            </Elements>
        </div>
    )
}

export default TestStripe;