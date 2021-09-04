import React, { useState, useEffect } from "react";
import Order from "./Order";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "react-bootstrap/lib/Button";

/**
 * Paywall modal that shows advertising/marketing copy for the Pareto Full-Stack Starter Kit.
 * @TODO Issue #49.
 */

function LoadingModal(props) {
  const [stripeKey, setStripeKey] = useState(null);

  useEffect(() => {
    console.log(process.env);
    if (process.env.NODE_ENV === "development") {
      setStripeKey(process.env.REACT_APP_STRIPE_DEV);
    } else {
      setStripeKey(process.env.REACT_APP_STRIPE_PROD);
    }
  }, []);

  const [showPayment, setShowPayment] = useState(false);
  return (
    <React.Fragment>
      <h1 style={{ textAlign: "center" }}>Pareto Full-Stack Starter Kit</h1>
      <iframe
        width="380"
        height="160"
        src="https://www.youtube.com/embed/ukMisjPq7ec"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        style={{ alignSelf: "center" }}
      />
      {showPayment === false ? (
        <DialogContent style={{ fontSize: 12 }}>
          <p>
            Hint: you can change some code in this repo and not pay for this. If
            you can't figure out how to do that... you should invest $89 in your
            education and buy.
          </p>
          <p>
            You get 14 laminated, color-coded cheat sheets. 52 flash cards that
            double as playing cards. Workflow stickers for terminal commands.
            Physical workbook for your capstone project.
          </p>
          <p>
            You also support this open-source project, and can always donate
            your products/curriculum to someone in your life who needs it.
          </p>

          <div className="flex-evenly">
            <Button onClick={() => props.history.push("/")}>Cancel</Button>
            <Button onClick={() => setShowPayment(true)}>Purchase</Button>
          </div>
        </DialogContent>
      ) : (
        <DialogContent style={{ textAlign: "center" }}>
          <Order {...props} stripeKey={stripeKey} />
        </DialogContent>
      )}
    </React.Fragment>
  );
}

export default LoadingModal;
