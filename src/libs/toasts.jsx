import { Snackbar, Alert } from "@mui/material";

/**
 * Toast notification for errors, and assorted messages.
 */

export default function ToastMsg({ msg, type, open, handleCloseSnackbar }) {
  const handleClose = () => {
    handleCloseSnackbar();
  };

  if (!type) {
    type = "info";
  }

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={type} sx={{ width: "100%", p: 3 }}>
        {msg}
      </Alert>
    </Snackbar>
  );
}
