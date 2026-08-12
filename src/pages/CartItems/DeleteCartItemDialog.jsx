import React from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

const DeleteCartItemDialog = ({
  open,
  item,
  loading = false,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={
        loading
          ? undefined
          : onClose
      }
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        Delete Cart Item
      </DialogTitle>

      <DialogContent>
        <Typography>
          Are you sure you want to
          remove this cart item?
        </Typography>

        {item && (
          <Typography
            fontWeight={600}
            sx={{ mt: 1 }}
          >
            {item.productName ||
              item.name ||
              "Selected product"}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          color="error"
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading
            ? "Deleting..."
            : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteCartItemDialog;