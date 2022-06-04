import { useState, useContext } from "react";
import { RestAPI } from "@aws-amplify/api-rest";
import { Elements, StripeProvider } from "react-stripe-elements";
import { Button } from "@mui/material";
import BillingForm from "./BillingForm";
import { ToastMsgContext } from "../state/ToastContext";
import { createExperience } from "../libs/createExperience";

/**
 * Parent component of the Billing form.
 * @TODO Issue #50
 */

export default function Order(props) {
  const { handleShowSuccess } = useContext(ToastMsgContext);

  const [isLoading, setIsLoading] = useState(false);

  function billUser(details) {
    let route;
    if (import.meta.env.NODE_ENV === "development") {
      route = "/billing-dev";
    } else {
      route = "/billing";
    }
    return RestAPI.post("util", route, {
      body: details,
    });
  }

  async function unlockLearning() {
    let body = {
      learningPurchase: true,
    };

    let updatedUser = await RestAPI.put(
      "pareto",
      `/users/${props.user.id}`,
      {
        body,
      }
    );
    console.log(updatedUser);

    let apprenticeParams = {
      expId: props.user.apprenticeshipId,
      userId: props.user.id,
      type: "Apprenticeship",
      title: "Dev Onboarding",
      description: "Learning the tools, habits and workflows of development.",
    };
    const createApprenticeship = await createExperience(apprenticeParams);
    console.log("Created Apprenticeship: ", createApprenticeship);
    let productParams = {
      expId: props.user.productId,
      userId: props.user.id,
      type: "Product",
      title: "Capstone Project",
      description:
        "The critical piece of your portfolio that will get you the interview, and help you demonstrate your skills and potential.",
    };
    const createProduct = await createExperience(productParams);
    console.log("Created Product: ", createProduct);
    let interviewingParams = {
      expId: props.user.masteryId,
      userId: props.user.id,
      type: "Interviewing",
      title: "Interviewing",
      description:
        "The computer science you need to pass technical interviews.",
    };
    const createInterviewing = await createExperience(interviewingParams);
    console.log(createInterviewing);

    // const defaultMentor = await API.post('pareto', '/relationship', {
    // 	body: {
    // 		id: `${admin.id}_${newUser.id}`,
    // 		mentee: newUser,
    // 		mentor: admin,
    // 		tasks: [],
    // 		coachId: admin.id,
    // 		athleteId: newUser.id,
    // 		resources: [],
    // 		events: [],
    // 		reminders: [],
    // 		accepted: true,
    // 		completed: false,
    // 		createdAt: new Date()
    // 	}
    // });

    // console.log('New mentor: ', defaultMentor);
  };

  async function handleFormSubmit(storage, { token, error }) {
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
      handleShowSuccess(
        "Your card has been charged successfully! We are creating your learning account."
      );

      if (billing.status === true) {
        // create learning account info
        await unlockLearning();
      }

      await props.initialFetch(props.user.id);
      props.history.push("/training");
    } catch (e) {
      // eslint-disable-next-line no-undef
      alert(e);
    }
  };

  async function handleFreeUnlock() {
    setIsLoading(true);
    try {
      await unlockLearning();
      await props.initialFetch(props.user.id);
      props.history.push("/training");
    } catch (e) {
      // eslint-disable-next-line no-undef
      alert(e);
    }
  };

  return (
    <>
      <div className="Form">
        <StripeProvider apiKey={props.stripeKey}>
          <Elements>
            <BillingForm
              loading={isLoading}
              onSubmit={handleFormSubmit}
            />
          </Elements>
        </StripeProvider>
      </div>
      <Button onClick={handleFreeUnlock}>No Donation</Button>
    </>
  );
}
