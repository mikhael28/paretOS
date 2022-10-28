import { useEffect, useRef, useState } from "react";
import { DialogContent, Button } from "@mui/material";
import Order from "./Order";
import { User } from "../types/ProfileTypes";
import { useNavigate } from "react-router-dom";
/**
 * Paywall modal that shows advertising/marketing copy for the Pareto Full-Stack Starter Kit.
 */

interface LoadingModalProps {
  user: User;
  initialFetch: (id: string) => {};
  navigate: typeof useNavigate;
}

function LoadingModal({ user, initialFetch, ...props }: LoadingModalProps) {
  const [stripeKey, setStripeKey] = useState(null);
  const navigate = useNavigate();

  console.log(props);

  useEffect(() => {
    if (import.meta.env.NODE_ENV === "development") {
      setStripeKey(import.meta.env.VITE_STRIPE_DEV);
    } else {
      setStripeKey(import.meta.env.VITE_STRIPE_PROD);
    }
  }, []);

  const [showPayment, setShowPayment] = useState(false);

  const modalRef = useRef();

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Pareto Full-Stack Starter Kit</h1>
      <iframe
        width="100%"
        height="160"
        src="https://www.youtube.com/embed/ukMisjPq7ec"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ alignSelf: "center" }}
        title="A video showing the Pareto Full Stack Starter Kit"
      />
      {showPayment === false ? (
        <DialogContent ref={modalRef} style={{ fontSize: 12 }}>
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
            <Button className="btn-cancel" onClick={() => navigate("/")}>
              Cancel
            </Button>
            <Button className="btn" 
            // onClick={() => setShowPayment(true)}
            >
              Purchase (Locked Temporarily)
            </Button>
          </div>
        </DialogContent>
      ) : (
        <DialogContent ref={modalRef} style={{ textAlign: "start" }}>
          <div>
            <Order
              navigate={navigate}
              user={user}
              initialFetch={initialFetch}
              stripeKey={stripeKey || ""}

            />
          </div>
        </DialogContent>
      )}
    </>
  );
}

export default LoadingModal;
