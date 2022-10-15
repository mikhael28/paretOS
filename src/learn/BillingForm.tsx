import { ComponentProps, ComponentType, FormEvent, useState } from "react";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import { CardElement, injectStripe } from "react-stripe-elements";
import LoaderButton from "../components/LoaderButton";

/**
 * This is the Billing form, where payment is processed for the Starter pack. This hides in the paywall.
 * @TODO Issue #50
 */

interface BillingFormProps extends ComponentProps<any> {
  stripe: any;
  onSubmit: any;
  loading: boolean;
}

interface BillingState {
  name?: string;
  storage?: number | string;
  isProcessing?: boolean;
  isCardComplete?: boolean;
  street?: string;
  city?: string;
  zip?: string;
}

const BillingForm = ({ loading, onSubmit, stripe }: BillingFormProps) => {
  const [billingForm, setBillingForm] = useState<BillingState>({
    name: "",
    storage: 1,
    isProcessing: false,
    isCardComplete: false,
    street: "",
    city: "",
    zip: "",
  });

  const validateForm = () => {
    return (
      billingForm.name !== "" &&
      billingForm.storage !== "" &&
      billingForm.isCardComplete
    );
  };

  const handleFieldChange = (event: FormEvent<FormControl>) => {
    setBillingForm(
      (...prevState) =>
        ({
          ...prevState,
          [(event.target as HTMLInputElement).id]: (
            event.target as HTMLInputElement
          ).value,
        } as BillingState)
    );
  };

  const handleCardFieldChange = (event: any) => {
    setBillingForm((...prevState) => ({
      ...prevState,
      isCardComplete: event.complete,
    }));
  };

  const handleSubmitClick = async (event: FormEvent<HTMLFormElement>) => {
    (event as any).preventDefault();

    setBillingForm((...prevState) => ({ ...prevState, isProcessing: true }));

    const { token, error } = await stripe.createToken({ name });

    setBillingForm((...prevState) => ({ ...prevState, isProcessing: false }));

    onSubmit(billingForm.storage, { token, error });
  };

  const isLoading = billingForm.isProcessing || loading;

  return (
    <form className="BillingForm" onSubmit={handleSubmitClick}>
      <FormGroup bsSize="large" controlId="name">
        <ControlLabel>Cardholder&apos;s name</ControlLabel>
        <FormControl
          type="text"
          value={billingForm.name}
          onChange={handleFieldChange}
          placeholder="Name on the card"
        />
      </FormGroup>
      <FormGroup bsSize="large" controlId="street">
        <ControlLabel>Street Address</ControlLabel>
        <FormControl
          type="text"
          value={billingForm.street}
          onChange={handleFieldChange}
          placeholder="Street Address"
        />
      </FormGroup>
      <FormGroup bsSize="large" controlId="city">
        <ControlLabel>City</ControlLabel>
        <FormControl
          type="text"
          value={billingForm.city}
          onChange={handleFieldChange}
          placeholder="City"
        />
      </FormGroup>
      <FormGroup bsSize="large" controlId="zip">
        <ControlLabel>Zip Code</ControlLabel>
        <FormControl
          type="text"
          value={billingForm.zip}
          onChange={handleFieldChange}
          placeholder="Zip Code"
        />
      </FormGroup>
      <ControlLabel>Credit Card Info</ControlLabel>
      <CardElement
        className="card-field"
        onChange={handleCardFieldChange}
        style={{
          base: {
            fontSize: "18px",
            fontFamily: '"Futura Std Book", sans-serif',
          },
        }}
      />
      <LoaderButton
        block
        size="large"
        type="submit"
        text="Purchase"
        isLoading={isLoading}
        loadingText="Purchasing…"
        disabled={!validateForm()}
      />
    </form>
  );
};

export default injectStripe(
  BillingForm as ComponentType<BillingFormProps & any>
);
