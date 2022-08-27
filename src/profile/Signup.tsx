// hooks import
import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Auth } from "@aws-amplify/auth";
import { I18n } from "@aws-amplify/core";
import { FormControl, FormHelperText, Input, InputLabel, TextField, useTheme } from "@mui/material";
import logo from "../assets/Pareto_Lockup-01.png";
import LoaderButton from "../components/LoaderButton";
import { User } from "@sentry/react";
import { ToastMsgContext } from "../state/ToastContext";
import { useForm } from "react-hook-form";
import { makeStyles } from "@mui/styles";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    width: 300,

    "& .css-36njyd-MuiInputBase-root-MuiFilledInput-root": {
      backgroundColor: theme.palette.background.paper,
    },
    "& .MuiFormControl-root": {
      marginTop: theme.spacing(1),
    },
    "& .MuiTextField-root": {
      width: 300,
    },
    "& .MuiFormLabel-root": {
      fontSize: 16,
      color: theme.palette.primary.main,
    },
    "& .MuiInputBase-input": {
      fontSize: 16,
    },
    "& .MuiButtonBase-root": {
      marginTop: theme.spacing(1),
      fontSize: 16,
    },
    "& .error": {
      marginTop: theme.spacing(1),
      fontSize: 14,
      color: "rgb(220, 66, 45)",
    },
  },
}));

type UserSignUpForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

type CodeConfirmationForm = {
  confirmationCode: string;
};

const Signup = () => {
  const theme = useTheme();
  const classes = useStyles();
  const { handleShowError, handleShowSuccess } = useContext(ToastMsgContext);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email is required')
      .email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), null], 'Confirm Password does not match'),
  });

  const _validationSchema = Yup.object().shape({
    confirmationCode: Yup.string()
      .required('Confirmation code is required')
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch
  } = useForm<UserSignUpForm>({ resolver: yupResolver(validationSchema) });

  const {
    register: _register,
    formState: { errors: _errors },
    handleSubmit: _handleSubmit,
  } = useForm<CodeConfirmationForm>({ resolver: yupResolver(_validationSchema) });

  const [formValues, setFormValues] = useState({email: "", password: ""});
  const [newUser, setNewUser] = useState({} as User);
  const [isLoading, setIsLoading] = useState(false);
  const [disabled] = useState(false);


  // for redirect to new route
  const history = useHistory();

  const handleConfirmationSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      await Auth.confirmSignUp(formValues.email, data.confirmationCode);
      await Auth.signIn(formValues.email, formValues.password);
      handleShowSuccess("Sign up complete");
      history.push("/onboarding/user");
    } catch (e) {
      handleShowError(e as Error);
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      const newUser = await Auth.signUp({
        username: data.email,
        password: data.password,
      });
      setFormValues({
        email: data.email,
        password: data.password,
      });
      setNewUser(newUser);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderConfirmationForm = () => (
    <div className="Form">
      <div className="flex-center">
        <img
          src={logo}
          alt="Pareto"
          height="45"
          width="180"
          style={{
            marginTop: 32,
            filter:
              theme.palette.mode !== "dark" ? "" : "invert() brightness(150%)",
          }}
        />
      </div>
      <form className={classes.root} onSubmit={_handleSubmit(handleConfirmationSubmit)}>
        <FormControl>
          <TextField
            id="confirmationCode"
            variant="outlined"
            size="medium"
            type="tel"
            label={I18n.get("confirmationCode")}
            {..._register("confirmationCode")}
          />
          <span className="error">{_errors.confirmationCode?.message}</span>
        </FormControl>
        <span>{formValues.email}</span>
        <LoaderButton
          text={I18n.get("verify")}
          loadingText={I18n.get("nowVerifying")}
          isLoading={isLoading}
          disabled={disabled}
          type="submit"
          color="primary"
          variant="contained"
        />
      </form>
    </div>
  );

  const renderForm = () => (
    <div>
      <div className="flex-center">
        <img
          src={logo}
          alt="Pareto"
          height="45"
          width="180"
          style={{
            marginTop: 32,
            filter:
              theme.palette.mode !== "dark" ? "" : "invert() brightness(150%)",
          }}
        />
      </div>

      <form className={classes.root} onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <TextField 
            id="email"
            variant="outlined"
            size="medium"
            autoFocus={true}
            label={I18n.get("email")}
            {...register("email")}            
          />
          <span className="error">{errors.email?.message}</span>
        </FormControl>

        <FormControl>
          <TextField
            id="password"
            variant="outlined"
            size="medium"
            type="password"
            label={I18n.get("password")}
            {...register("password")}
          />
          <span className="error">{errors.password?.message}</span>
        </FormControl>

        <FormControl>
          <TextField
            id="confirmPassword"
            variant="outlined"
            size="medium"
            type="password"
            label={I18n.get("confirm")}
            {...register("confirmPassword")}
          />
          <span className="error">{errors.confirmPassword?.message}</span>        
        </FormControl>

        <LoaderButton
          text={I18n.get("signup")}
          loadingText={I18n.get("signingUp")}
          isLoading={isLoading}
          disabled={disabled}
          type="submit"
          color="primary"
          variant="contained"
        />
      </form>
    </div>
  );

  return (
    <div className="Form">
      {Object.keys(newUser).length === 0
        ? renderForm()
        : renderConfirmationForm()}
    </div>
  );
};

export default Signup;
