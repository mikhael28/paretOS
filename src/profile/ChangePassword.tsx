import { useState, useContext } from "react";
import { Auth } from "@aws-amplify/auth";
import { I18n } from "@aws-amplify/core";
import LoaderButton from "../components/LoaderButton";
import {
  FormControl,
  FormLabel,
  TextField
} from "@mui/material";
import { useForm } from "react-hook-form";
import {
  object as yupObject,
  string as yupString,
  ref as yupRef
} from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastMsgContext } from "../state/ToastContext";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";

/**
 * Change your password through Cognito
 */


 const useStyles = makeStyles(() => ({
  root: {
    "& .MuiFormControl-root": {
      width: "100%",
      marginBottom: 5
    }
  }
}));

 type changePasswordType = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const ChangePassword = () => {
  const [isChanging, setIsChanging] = useState(false);
  const navigate = useNavigate();
  const classes = useStyles();

  const validationSchema = yupObject().shape({
    oldPassword: yupString()
    .required("Password is required"),
    newPassword: yupString()
      .required("New password is required")
      .min(8, "Password must be at least 8 characters")
      .max(40, "Password must not exceed 40 characters"),
    confirmPassword: yupString()
      .required("Confirm Password is required")
      .oneOf([yupRef("newPassword"), null], "Confirm Password does not match"),
  });

  const {
    register,
    formState: { isValid, errors },
    handleSubmit
  } = useForm<changePasswordType>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  const handleChangePasswordSubmit = async (data: changePasswordType) => {
    setIsChanging(true);
    try {      
      const currentUser = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(currentUser, data.oldPassword, data.newPassword);
      handleShowSuccess("Password successfully changed.");
      navigate("/");
    } catch (e) {
      handleShowError(e as Error);
      setIsChanging(false);
    }
  };

  const { handleShowSuccess, handleShowError } = useContext(ToastMsgContext);

  return (
    <form className={`${classes.root} Form`} onSubmit={handleSubmit(handleChangePasswordSubmit)}>
      <FormControl>
        <FormLabel htmlFor="oldPassword">{I18n.get("oldPassword")}</FormLabel>
        <TextField
          type="password"
          id="oldPassword"
          error={!!errors.oldPassword?.message}
          label={errors.oldPassword?.message}
          {...register("oldPassword")}
        />
      </FormControl>
      <hr />
      <FormControl>
        <FormLabel htmlFor="newPassword">{I18n.get("newPassword")}</FormLabel>
        <TextField
          type="password"
          id="newPassword"
          error={!!errors.newPassword?.message}
          label={errors.newPassword?.message}
          {...register("newPassword")}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="confirmPassword">{I18n.get("confirm")}</FormLabel>
        <TextField
          type="password"
          id="confirmPassword"
          error={!!errors.confirmPassword?.message}
          label={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </FormControl>
      <LoaderButton
        block="true"
        type="submit"
        size="large"
        text={I18n.get("confirm")}
        loadingText={I18n.get("confirming")}
        disabled={!isValid}
        isLoading={isChanging}
      />
    </form>
  );
};

export default ChangePassword;
