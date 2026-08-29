import React, {
  useEffect,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  Cancel,
  CheckCircle,
  Close,
  Delete,
  Reply,
  Store,
  Verified,
} from "@mui/icons-material";


// ======================================================
// Date Formatter
// ======================================================

const formatDate = (date) => {

  if (!date) {
    return "-";
  }

  return new Date(date).toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};


// ======================================================
// Status Chip
// ======================================================

const StatusChip = ({
  status,
}) => {

  const color =
    status === "Approved"
      ? "success"
      : status === "Rejected"
        ? "error"
        : "warning";

  return (
    <Chip
      size="small"
      color={color}
      label={status}
    />
  );
};


// ======================================================
// Review Modal
// ======================================================

const ReviewModal = ({
  open = false,
  mode = "reply",
  review = null,
  loading = false,
  onClose,
  onSubmit,
}) => {

  // ====================================================
  // FORM STATE
  // ====================================================

  const [
    formData,
    setFormData,
  ] = useState({
    action: "Reply",
    sellerReply: "",
    rejectionReason: "",
    internalRemarks: "",
  });


  const [
    errors,
    setErrors,
  ] = useState({});


  // ====================================================
  // POPULATE FORM
  // ====================================================

  useEffect(() => {

    if (!review) {
      return;
    }

    setFormData({

      action:
        mode.charAt(0).toUpperCase() +
        mode.slice(1),

      sellerReply:
        review.sellerReply?.replyText ||
        "",

      rejectionReason:
        "",

      internalRemarks:
        "",
    });

    setErrors({});

  }, [
    review,
    mode,
  ]);


  // ====================================================
  // NO REVIEW
  // ====================================================

  if (!review) {
    return null;
  }


  // ====================================================
  // REVIEW DATA
  // ====================================================

  const {
    reviewId,
    customerName,
    customerImage,
    verifiedBuyer,
    productName,
    productSku,
    productImage,
    rating,
    reviewTitle,
    reviewText,
    marketplace,
    status,
    createdDate,
  } = review;


  // ====================================================
  // FORM CHANGE
  // ====================================================

  const handleChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;

    setFormData(
      (prev) => ({
        ...prev,
        [name]: value,
      })
    );


    if (errors[name]) {

      setErrors(
        (prev) => ({
          ...prev,
          [name]: "",
        })
      );

    }
  };


  // ====================================================
  // VALIDATION
  // ====================================================

  const validate = () => {

    const validationErrors = {};


    // --------------------------------------------------
    // Seller Reply
    // --------------------------------------------------

    if (
      (
        mode === "reply" ||
        mode === "approve"
      ) &&
      !formData.sellerReply.trim()
    ) {

      validationErrors.sellerReply =
        "Seller reply is required.";

    }


    // --------------------------------------------------
    // Rejection Reason
    // --------------------------------------------------

    if (
      mode === "reject" &&
      !formData.rejectionReason.trim()
    ) {

      validationErrors.rejectionReason =
        "Rejection reason is required.";

    }


    setErrors(
      validationErrors
    );


    return (
      Object.keys(
        validationErrors
      ).length === 0
    );
  };


  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit = () => {

    if (!validate()) {
      return;
    }


    if (onSubmit) {

      onSubmit({

        reviewId,

        action: mode,

        sellerReply:
          formData.sellerReply,

        rejectionReason:
          formData.rejectionReason,

        internalRemarks:
          formData.internalRemarks,

      });

    }
  };


  // ====================================================
  // CLOSE
  // ====================================================

  const handleClose = () => {

    setErrors({});

    if (onClose) {
      onClose();
    }
  };


  // ====================================================
  // JSX
  // ====================================================

  return (

    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >

      {/* ==================================================
          DIALOG TITLE
      ================================================== */}

      <DialogTitle>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >

          <Typography
            variant="h5"
            fontWeight={700}
          >

            {mode === "reply" &&
              "Reply to Review"}

            {mode === "approve" &&
              "Approve Review"}

            {mode === "reject" &&
              "Reject Review"}

            {mode === "delete" &&
              "Delete Review"}

          </Typography>


          <IconButton
            onClick={handleClose}
          >
            <Close />
          </IconButton>

        </Stack>

      </DialogTitle>


      <Divider />


      {/* ==================================================
          DIALOG CONTENT
      ================================================== */}

      <DialogContent dividers>

        {/* ==================================================
            REVIEW DETAILS
        ================================================== */}

        <Card
          variant="outlined"
          sx={{
            mb: 3,
          }}
        >

          <CardContent>

            <Grid
              container
              spacing={3}
            >

              {/* ==================================================
                  CUSTOMER INFORMATION
              ================================================== */}

              <Grid
                item
                xs={12}
                md={4}
              >

                <Stack
                  spacing={2}
                  alignItems="center"
                >

                  <Avatar
                    src={customerImage}
                    sx={{
                      width: 80,
                      height: 80,
                    }}
                  >
                    {customerName?.charAt(0)}
                  </Avatar>


                  <Typography
                    variant="h6"
                    fontWeight={700}
                    textAlign="center"
                  >
                    {customerName}
                  </Typography>


                  {verifiedBuyer && (

                    <Chip
                      color="success"
                      icon={<Verified />}
                      label="Verified Buyer"
                    />

                  )}


                  <StatusChip
                    status={status}
                  />


                  <Chip
                    color="primary"
                    icon={<Store />}
                    label={
                      marketplace ||
                      "-"
                    }
                  />


                  <Typography
                    variant="caption"
                    color="text.secondary"
                    textAlign="center"
                  >
                    {formatDate(
                      createdDate
                    )}
                  </Typography>

                </Stack>

              </Grid>


              {/* ==================================================
                  PRODUCT & REVIEW
              ================================================== */}

              <Grid
                item
                xs={12}
                md={8}
              >

                <Stack
                  spacing={2}
                >

                  <Stack
                    direction="row"
                    spacing={2}
                  >

                    <Avatar
                      src={productImage}
                      variant="rounded"
                      sx={{
                        width: 90,
                        height: 90,
                      }}
                    />


                    <Box>

                      <Typography
                        variant="h6"
                        fontWeight={700}
                      >
                        {productName}
                      </Typography>


                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        SKU : {productSku}
                      </Typography>


                      <Rating
                        value={
                          Number(rating) || 0
                        }
                        precision={0.5}
                        readOnly
                        sx={{
                          mt: 1,
                        }}
                      />

                    </Box>

                  </Stack>


                  <Divider />


                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    {reviewTitle}
                  </Typography>


                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace:
                        "pre-wrap",
                    }}
                  >
                    {reviewText}
                  </Typography>


                  {/* ==================================================
                      MODE MESSAGE
                  ================================================== */}

                  <Alert
                    severity={
                      mode === "approve"
                        ? "success"
                        : mode === "reject"
                          ? "warning"
                          : mode === "delete"
                            ? "error"
                            : "info"
                    }
                    variant="outlined"
                  >

                    {mode === "reply" &&
                      "Reply to the customer's review."}

                    {mode === "approve" &&
                      "Approving this review will make it publicly visible."}

                    {mode === "reject" &&
                      "Rejected reviews will not be displayed publicly."}

                    {mode === "delete" &&
                      "Deleting a review is permanent and cannot be undone."}

                  </Alert>

                </Stack>

              </Grid>

            </Grid>

          </CardContent>

        </Card>


        {/* ==================================================
            MODERATION FORM
        ================================================== */}

        <Card variant="outlined">

          <CardContent>

            <Stack
              spacing={3}
            >

              {/* ==================================================
                  SELLER REPLY
              ================================================== */}

              {(
                mode === "reply" ||
                mode === "approve"
              ) && (

                <TextField
                  fullWidth
                  multiline
                  minRows={5}
                  maxRows={10}
                  name="sellerReply"
                  label="Seller Reply"
                  placeholder="Enter your response to the customer..."
                  value={
                    formData.sellerReply
                  }
                  onChange={
                    handleChange
                  }
                  error={
                    !!errors.sellerReply
                  }
                  helperText={
                    errors.sellerReply
                  }
                />

              )}


              {/* ==================================================
                  REJECTION REASON
              ================================================== */}

              {mode === "reject" && (

                <TextField
                  select
                  fullWidth
                  name="rejectionReason"
                  label="Rejection Reason"
                  value={
                    formData.rejectionReason
                  }
                  onChange={
                    handleChange
                  }
                  error={
                    !!errors.rejectionReason
                  }
                  helperText={
                    errors.rejectionReason
                  }
                >

                  <MenuItem value="">
                    Select Reason
                  </MenuItem>

                  <MenuItem value="Spam">
                    Spam
                  </MenuItem>

                  <MenuItem value="Offensive Content">
                    Offensive Content
                  </MenuItem>

                  <MenuItem value="Fake Review">
                    Fake Review
                  </MenuItem>

                  <MenuItem value="Duplicate Review">
                    Duplicate Review
                  </MenuItem>

                  <MenuItem value="Irrelevant">
                    Irrelevant
                  </MenuItem>

                  <MenuItem value="Policy Violation">
                    Policy Violation
                  </MenuItem>

                  <MenuItem value="Other">
                    Other
                  </MenuItem>

                </TextField>

              )}


              {/* ==================================================
                  INTERNAL REMARKS
              ================================================== */}

              {(
                mode === "reply" ||
                mode === "approve" ||
                mode === "reject"
              ) && (

                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  maxRows={6}
                  name="internalRemarks"
                  label="Internal Remarks"
                  placeholder="Optional internal notes (not visible to customers)..."
                  value={
                    formData.internalRemarks
                  }
                  onChange={
                    handleChange
                  }
                />

              )}


              {/* ==================================================
                  DELETE CONFIRMATION
              ================================================== */}

              {mode === "delete" && (

                <Alert
                  severity="error"
                  variant="filled"
                >
                  You are about to permanently
                  delete this review. This action
                  cannot be undone.
                </Alert>

              )}

            </Stack>

          </CardContent>

        </Card>

      </DialogContent>


      {/* ==================================================
          DIALOG ACTIONS
      ================================================== */}

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          justifyContent:
            "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >

        {/* ==================================================
            LEFT SIDE
        ================================================== */}

        <Stack
          direction="row"
          spacing={1}
        >

          <Button
            variant="outlined"
            color="inherit"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>

        </Stack>


        {/* ==================================================
            RIGHT SIDE
        ================================================== */}

        <Stack
          direction="row"
          spacing={1}
        >

          {/* ==================================================
              REPLY
          ================================================== */}

          {mode === "reply" && (

            <Button
              variant="contained"
              color="primary"
              startIcon={<Reply />}
              onClick={handleSubmit}
              disabled={loading}
            >

              {loading
                ? "Sending..."
                : "Send Reply"}

            </Button>

          )}


          {/* ==================================================
              APPROVE
          ================================================== */}

          {mode === "approve" && (

            <Button
              variant="contained"
              color="success"
              startIcon={
                <CheckCircle />
              }
              onClick={handleSubmit}
              disabled={loading}
            >

              {loading
                ? "Approving..."
                : "Approve Review"}

            </Button>

          )}


          {/* ==================================================
              REJECT
          ================================================== */}

          {mode === "reject" && (

            <Button
              variant="contained"
              color="warning"
              startIcon={<Cancel />}
              onClick={handleSubmit}
              disabled={loading}
            >

              {loading
                ? "Rejecting..."
                : "Reject Review"}

            </Button>

          )}


          {/* ==================================================
              DELETE
          ================================================== */}

          {mode === "delete" && (

            <Button
              variant="contained"
              color="error"
              startIcon={<Delete />}
              onClick={handleSubmit}
              disabled={loading}
            >

              {loading
                ? "Deleting..."
                : "Delete Review"}

            </Button>

          )}

        </Stack>

      </DialogActions>

    </Dialog>
  );
};


// ======================================================
// StatusChip PropTypes
// ======================================================

StatusChip.propTypes = {
  status: PropTypes.oneOf([
    "Pending",
    "Approved",
    "Rejected",
  ]),
};


StatusChip.defaultProps = {
  status: "Pending",
};


// ======================================================
// ReviewModal PropTypes
// ======================================================

ReviewModal.propTypes = {

  open: PropTypes.bool,

  mode: PropTypes.oneOf([
    "reply",
    "approve",
    "reject",
    "delete",
  ]),

  loading: PropTypes.bool,

  review: PropTypes.shape({

    reviewId:
      PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),

    customerName:
      PropTypes.string,

    customerImage:
      PropTypes.string,

    verifiedBuyer:
      PropTypes.bool,

    productName:
      PropTypes.string,

    productSku:
      PropTypes.string,

    productImage:
      PropTypes.string,

    marketplace:
      PropTypes.string,

    rating:
      PropTypes.number,

    reviewTitle:
      PropTypes.string,

    reviewText:
      PropTypes.string,

    status:
      PropTypes.string,

    createdDate:
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]),

    sellerReply:
      PropTypes.shape({

        replyText:
          PropTypes.string,

        replyDate:
          PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.instanceOf(Date),
          ]),

      }),

  }),

  onClose:
    PropTypes.func,

  onSubmit:
    PropTypes.func,
};


// ======================================================
// Default Props
// ======================================================

ReviewModal.defaultProps = {

  open: false,

  mode: "reply",

  loading: false,

  review: null,

  onClose: () => {},

  onSubmit: () => {},

};


// ======================================================
// EXPORT
// ======================================================

export default ReviewModal;
