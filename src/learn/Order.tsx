import { Component } from "react";
import { RestAPI } from "@aws-amplify/api-rest";
import { Elements, StripeProvider } from "react-stripe-elements";
import { Button } from "@mui/material";
import BillingForm from "./BillingForm";
import { successToast } from "../utils/toasts";
import { createExperience } from "../utils/createExperience";
import { User } from "../types/ProfileTypes";
import { RouterHistory } from "@sentry/react/types/reactrouter";

/**
 * Parent component of the Billing form.
 * @TODO Issue #50
 */

interface OrderProps {
  user: User,
  initialFetch: (id: string) => void;
  history: RouterHistory; 
  stripeKey: string;
}

export default class Order extends Component<OrderProps, { isLoading: boolean }> {
  constructor(props: OrderProps) {
    super(props);

    this.state = {
      isLoading: false,
    };
  }

  billUser(details: any) {
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

  unlockLearning = async () => {
    let body = {
      learningPurchase: true,
    };

    let updatedUser = await RestAPI.put(
      "pareto",
      `/users/${this.props.user.id}`,
      {
        body,
      }
    );
    console.log(updatedUser);

    let apprenticeParams = {
      expId: this.props.user.apprenticeshipId || "",
      userId: this.props.user.id,
      type: "Apprenticeship",
      title: "Dev Onboarding",
      description: "Learning the tools, habits and workflows of development.",
    };
    const createApprenticeship = await createExperience(apprenticeParams);
    console.log("Created Apprenticeship: ", createApprenticeship);
    let productParams = {
      expId: this.props.user.productId || "",
      userId: this.props.user.id,
      type: "Product",
      title: "Capstone Project",
      description:
        "The critical piece of your portfolio that will get you the interview, and help you demonstrate your skills and potential.",
    };
    const createProduct = await createExperience(productParams);
    console.log("Created Product: ", createProduct);
    let interviewingParams = {
      expId: this.props.user.masteryId,
      userId: this.props.user.id,
      type: "Interviewing",
      title: "Interviewing",
      description:
        "The computer science you need to pass technical interviews.",
    };
    const createInterviewing = await createExperience(interviewingParams);
    console.log(createInterviewing);

    // const defaultMentor = await API.post('pareto', '/relationship', {
    // 	body: {
    // 		id: `${this.state.admin.id}_${newUser.id}`,
    // 		mentee: newUser,
    // 		mentor: this.state.admin,
    // 		tasks: [],
    // 		coachId: this.state.admin.id,
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

  handleFormSubmit = async (storage: any, { token, error }: {token: any, error: Error}) => {
    if (error) {
      alert(error);
      return;
    }

    this.setState({ isLoading: true });

    try {
      let billing = await this.billUser({
        storage,
        source: token.id,
      });
      console.log("bill: ", billing);
      successToast(
        "Your card has been charged successfully! We are creating your learning account."
      );

      if (billing.status === true) {
        // create learning account info
        await this.unlockLearning();
      }

      await this.props.initialFetch(this.props.user._id);
      this.props.history.push("/training");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  };

  handleFreeUnlock = async () => {
    this.setState({ isLoading: true });

    try {
      await this.unlockLearning();
      await this.props.initialFetch(this.props.user._id);
      this.props.history.push("/training");
    } catch (e) {
      alert(e);
    }
  };

  render() {
    return (
      <>
        <div className="Form">
          <StripeProvider apiKey={this.props.stripeKey}>
            <Elements>
              <BillingForm
                loading={this.state.isLoading}
                onSubmit={this.handleFormSubmit}
              />
            </Elements>
          </StripeProvider>
        </div>
        <Button onClick={this.handleFreeUnlock}>No Donation</Button>
      </>
    );
  }
}

//(property) loading: boolean
//Type '{ 
//      loading: boolean; 
//       onSubmit: (storage: any, { token, error }: { token: any; error: any; }) => Promise<void>; }' is not assignable to type 'IntrinsicAttributes & object'.
 // Property 'loading' does not exist on type 'IntrinsicAttributes & object'.ts(2322)