import React from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { User } from "../../types/ProfileTypes";

/**
 * This is an MVP, of a component to accept payments in Ugandan UGX - to replace the Stripe payment component in the paywall for the UG market.
 * @TODO Either implement this component, or take it down. This boilerplate code won't go anywhere, and it will be available for a while.
 * @returns
 */

export default function Flutterwave(props: { user: User }) {
  const config = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PK,
    tx_ref: Date.now().toString(),
    amount: 100,
    currency: "UGX",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: props.user.email,
      phonenumber: props.user.phone,
      name: `${props.user.fName} ${props.user.lName}`,
    },
    customizations: {
      title: "UG Full-Stack Starter Purchase",
      description: "Payment for access to educational products and modules",
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  return (
    <div className="App">
      <h1>Hello Test user</h1>

      <button
        onClick={() => {
          handleFlutterPayment({
            callback: (response) => {
              console.log(response);
              closePaymentModal(); // this will close the modal programmatically
            },
            onClose: () => { },
          });
        }}
      >
        Payment with React hooks
      </button>
    </div>
  );
}
