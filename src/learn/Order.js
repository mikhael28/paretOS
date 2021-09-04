import React, { Component } from "react";
import API from "@aws-amplify/api";
import { Elements, StripeProvider } from "react-stripe-elements";
import BillingForm from "./BillingForm";
import { successToast } from "../libs/toasts";
import { createExperience } from "../libs/createExperience";

/**
 * Parent component of the Billing form.
 * @TODO Issue #50
 */

export default class Order extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      stripeKey: null,
    };
  }

  componentDidMount() {
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === "development") {
      this.setState({ stripeKey: process.env.REACT_APP_STRIPE_DEV });
    } else {
      this.setState({ stripeKey: process.env.REACT_APP_STRIPE_PROD });
    }
  }

  billUser(details) {
    let route;
    if (process.env.NODE_ENV === "development") {
      route = "/billing-dev";
    } else {
      route = "/billing";
    }
    return API.post("util", route, {
      body: details,
    });
  }

  handleFormSubmit = async (storage, { token, error }) => {
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

        let body = {
          learningPurchase: true,
        };

        let updatedUser = await API.put(
          "pareto",
          `/users/${this.props.user.id}`,
          { body }
        );
        console.log(updatedUser);

        let apprenticeParams = {
          expId: this.props.user.apprenticeshipId,
          userId: this.props.user.id,
          type: "Apprenticeship",
          title: "Dev Onboarding",
          description:
            "Learning the tools, habits and workflows of development.",
        };
        const createApprenticeship = await createExperience(apprenticeParams);
        console.log("Created Apprenticeship: ", createApprenticeship);
        let productParams = {
          expId: this.props.user.productId,
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
      }

      await this.props.initialFetch(this.props.user.id);
      this.props.history.push("/training");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  };

  render() {
    return (
      <div className="Form">
        <StripeProvider apiKey={this.state.stripeKey}>
          <Elements>
            <BillingForm
              loading={this.state.isLoading}
              onSubmit={this.handleFormSubmit}
            />
          </Elements>
        </StripeProvider>
      </div>
    );
  }
}
