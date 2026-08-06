import React from "react";
import PropTypes from "prop-types";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  Warning,
  Delete,
  Close,
} from "@mui/icons-material";

//======================================================
// DeleteReviewDialog Component
//======================================================

const DeleteReviewDialog = ({
  open = false,
  review = null,
  loading = false,

  onClose,
  onDelete,
}) => {

  if (!review) return null;

  const {
    customerName,
    productName,
    productImage,
    reviewTitle,
    reviewText,
    rating,
  } = review;

  //====================================================
  // Delete
  //====================================================

  const handleDelete = () => {

    if (onDelete) {
      onDelete(review);
    }

  };

  //====================================================
  // Close
  //====================================================

  const handleClose = () => {

    if (onClose) {
      onClose();
    }

  };
    //====================================================
  // JSX
  //====================================================

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
        >
          <Warning color="error" />

          <Typography
            variant="h6"
            fontWeight={700}
          >
            Delete Review
          </Typography>

        </Stack>

      </DialogTitle>

      <Divider />

      <DialogContent dividers>

        <Stack spacing={3}>

          <Alert
            severity="error"
            variant="filled"
          >
            This action is permanent and cannot be undone.
          </Alert>

          {/*==========================================
              Product Information
          ==========================================*/}

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
          >

            <Avatar
              src={productImage}
              variant="rounded"
              sx={{
                width: 72,
                height: 72,
              }}
            />

            <Box>

              <Typography
                variant="subtitle1"
                fontWeight={700}
              >
                {productName}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Customer: {customerName}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Rating: ⭐ {rating}/5
              </Typography>

            </Box>

          </Stack>

          <Divider />

          {/*==========================================
              Review Content
          ==========================================*/}

          <Box>

            <Typography
              variant="subtitle1"
              fontWeight={700}
              gutterBottom
            >
              {reviewTitle}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                whiteSpace: "pre-wrap",
              }}
            >
              {reviewText}
            </Typography>

          </Box>

        </Stack>

      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
        }}
      >

        <Button
          variant="outlined"
          color="inherit"
          startIcon={<Close />}
          onClick={handleClose}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          startIcon={<Delete />}
          onClick={handleDelete}
          disabled={loading}
        >
          {loading
            ? "Deleting..."
            : "Delete Review"}
        </Button>

      </DialogActions>

    </Dialog>
  );
};
//======================================================
// PropTypes
//======================================================

DeleteReviewDialog.propTypes = {
  open: PropTypes.bool,

  loading: PropTypes.bool,

  review: PropTypes.shape({
    reviewId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    customerName: PropTypes.string,
    productName: PropTypes.string,
    productImage: PropTypes.string,

    reviewTitle: PropTypes.string,
    reviewText: PropTypes.string,

    rating: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  }),

  onClose: PropTypes.func,
  onDelete: PropTypes.func,
};

//======================================================
// Default Props
//======================================================

DeleteReviewDialog.defaultProps = {
  open: false,

  loading: false,

  review: null,

  onClose: () => {},

  onDelete: () => {},
};

//======================================================
// Export
//======================================================

export default DeleteReviewDialog;