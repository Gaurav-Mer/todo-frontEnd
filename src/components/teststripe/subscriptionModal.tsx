import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import React, { useState } from "react";


interface Props {
    subsList: Record<any, any>[] | []
}

const SubscriptionModal: React.FC<Props> = ({ subsList }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const header = (
        <img alt="Card" src="https://primefaces.org/cdn/primereact/images/usercard.png" />
    );


    const handleSubscribe = async (item: any) => {
        if (!stripe || !elements) {
            return;
        }
        setLoading(true);
        const { default_price } = item;

        // Call your server to create a Checkout Session
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/createSubscription`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ priceId: default_price }),
        });
        console.log("RESPONSE IS =>", response);

        if (response.status === 200) {
            const respData = await response.json();
            console.log("RESPDATA is---->", respData);

            if (respData.rData) {
                const session = respData?.rData
                console.log("session", session);

                // Redirect to Checkout page
                const { error } = await stripe.redirectToCheckout({
                    sessionId: session,
                });

                if (error) {
                    console.error(error);
                    setLoading(false);
                }
            }
        };
    }




    return (
        <><div className="row p-5 m-4 ">
            {subsList?.map((item: any) => {
                return (
                    <>
                        <div className="col-3">
                            <div className="card flex justify-content-center">
                                <Card title={item?.name} subTitle={<h3 className="text-success fw-bold">₹{item?.subPrice}</h3>} header={header} className="md:w-25rem">
                                    <Button onClick={() => handleSubscribe(item)} label="Purchase " className="rounded-2 w-100" icon="pi pi-check" />
                                </Card>
                            </div>
                        </div>
                    </>
                )
            })}
        </div>
            <form onSubmit={handleSubscribe}>
                <CardElement />
                <button type="submit" disabled={!stripe || loading}>
                    Subscribe Now
                </button>
            </form>

        </>
    )
}
export default SubscriptionModal;