import { useState } from "react";
import { RestAPI } from "@aws-amplify/api-rest";
// import { Elements, StripeProvider } from "react-stripe-elements";
import { Button } from "@mui/material";
import BillingForm from "./BillingForm";
import { createExperience } from "../utils/createExperience";
import { User } from "../types/ProfileTypes";
import { useNavigate } from "react-router-dom";

/**
 * Parent component of the Billing form.
 * @TODO Issue #50
 */

interface OrderProps {
  user: User;
  initialFetch: (id: string) => void;
  stripeKey: string;
  navigate: (arg0: string) => void;
}

const Order = ({ user, initialFetch, stripeKey, ...props }: OrderProps) => {
  console.log(props);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const billUser = (details: any) => {
    let route;
    if (import.meta.env.NODE_ENV === "development") {
      route = "/billing-dev";
    } else {
      route = "/billing";
    }
    return RestAPI.post("util", route, {
      body: details,
    });
  };

  const unlockLearning = async () => {
    let body = {
      learningPurchase: true,
    };

    let updatedUser = await RestAPI.put("pareto", `/users/${user.id}`, {
      body,
    });
    console.log(updatedUser);

    let apprenticeParams = {
      userId: user.id,
      type: "Apprenticeship",
      title: "Dev Onboarding",
      description: "Learning the tools, habits and workflows of development.",
    };
    const createApprenticeship = await createExperience(apprenticeParams);
    console.log("Created Apprenticeship: ", createApprenticeship);
    let productParams = {
      userId: user.id,
      type: "Product",
      title: "Capstone Project",
      description:
        "The critical piece of your portfolio that will get you the interview, and help you demonstrate your skills and potential.",
    };
    const createProduct = await createExperience(productParams);
    console.log("Created Product: ", createProduct);
    let interviewingParams = {
      userId: user.id,
      type: "Interviewing",
      title: "Interviewing",
      description:
        "The computer science you need to pass technical interviews.",
    };
    const createInterviewing = await createExperience(interviewingParams);
    console.log(createInterviewing);

  };

  const handleFormSubmit = async (
    storage: any,
    { token, error }: { token: any; error: Error }
  ) => {
    if (error) {
      alert(error);
      return;
    }

    setIsLoading(true);

    try {
      let billing = await billUser({
        storage,
        source: token.id,
      });
      console.log("bill: ", billing);
      // handleShowSuccess(
      //   "Your card has been charged successfully! We are creating your learning account."
      // );

      if (billing.status === true) {
        // create learning account info
        await unlockLearning();
      }

      await initialFetch(user._id);
      navigate("/training");
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
  };

  const handleFreeUnlock = async () => {
    setIsLoading(true);

    try {
      await unlockLearning();
      await initialFetch(user._id);
      navigate("/training");
    } catch (e) {
      alert(e);
    }
  };

  return (
    <>
      <div className="Form">

      </div>
      {/* <Button onClick={handleFreeUnlock}>No Donation</Button> */}
    </>
  );
};

export default Order;

//(property) loading: boolean
//Type '{
//      loading: boolean;
//       onSubmit: (storage: any, { token, error }: { token: any; error: any; }) => Promise<void>; }' is not assignable to type 'IntrinsicAttributes & object'.
// Property 'loading' does not exist on type 'IntrinsicAttributes & object'.ts(2322)
