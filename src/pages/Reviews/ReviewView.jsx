import React from "react";
import PropTypes from "prop-types";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  Rating,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  CheckCircle,
  Cancel,
  Close,
  Delete,
  Reply,
  Store,
  ThumbUp,
  Verified,
  Visibility,
  Image,
} from "@mui/icons-material";

//====================================================
// Date Formatter
//====================================================

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

//====================================================
// Status Chip
//====================================================

const StatusChip = ({ status }) => {
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

//====================================================
// Marketplace Chip
//====================================================

const MarketplaceChip = ({ marketplace }) => (
  <Chip
    size="small"
    color="primary"
    icon={<Store />}
    label={marketplace}
  />
);
//====================================================
// ReviewView Component
//====================================================

const ReviewView = ({
  open = false,
  review = null,
  onClose,

  onReply,
  onApprove,
  onReject,
  onDelete,
}) => {

  if (!review) return null;

  const {
    reviewId,

    customerName,
    customerImage,
    verifiedBuyer,

    productName,
    productSku,
    productImage,

    marketplace,

    rating,
    reviewTitle,
    reviewText,

    helpfulCount,

    status,

    reviewImages = [],

    sellerReply,

    createdDate,
  } = review;

  //====================================================
  // Event Handlers
  //====================================================

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleReply = () => {
    if (onReply) {
      onReply(review);
    }
  };

  const handleApprove = () => {
    if (onApprove) {
      onApprove(review);
    }
  };

  const handleReject = () => {
    if (onReject) {
      onReject(review);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(review);
    }
  };

  //====================================================
  // JSX
  //====================================================

  return (

    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
    >

      <DialogTitle>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >

          <Stack spacing={0.5}>

            <Typography
              variant="h5"
              fontWeight={700}
            >
              Review Details
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Review ID : {reviewId}
            </Typography>

          </Stack>

          <IconButton
            onClick={handleClose}
          >
            <Close />
          </IconButton>

        </Stack>

      </DialogTitle>

      <Divider />

      <DialogContent dividers>

        <Grid
          container
          spacing={3}
        >

          {/* ==========================
              Customer Information
          ========================== */}

          <Grid
            item
            xs={12}
            md={4}
          >

            <Card variant="outlined">

              <CardHeader
                avatar={
                  <Avatar
                    src={customerImage}
                    sx={{
                      width: 60,
                      height: 60,
                    }}
                  >
                    {customerName?.charAt(0)}
                  </Avatar>
                }

                title={
                  <Typography
                    fontWeight={700}
                  >
                    {customerName}
                  </Typography>
                }

                subheader={
                  verifiedBuyer
                    ? "Verified Buyer"
                    : "Guest Customer"
                }
              />

              <Divider />

              <CardContent>

                <Stack spacing={2}>

                  {verifiedBuyer && (

                    <Chip
                      color="success"
                      icon={<Verified />}
                      label="Verified Buyer"
                    />

                  )}

                  <MarketplaceChip
                    marketplace={marketplace}
                  />

                  <StatusChip
                    status={status}
                  />

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >

                    <ThumbUp
                      color="primary"
                    />

                    <Typography>

                      Helpful :
                      {" "}
                      {helpfulCount || 0}

                    </Typography>

                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Created :
                    {" "}
                    {formatDate(createdDate)}
                  </Typography>

                </Stack>

              </CardContent>

            </Card>

          </Grid>

          {/* ==========================
              Product & Review
          ========================== */}

          <Grid
            item
            xs={12}
            md={8}
          >

            <Card variant="outlined">

              <CardContent>

                <Stack spacing={2}>

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
                    >
                      <Image />
                    </Avatar>

                    <Box>

                      <Typography
                        variant="h6"
                        fontWeight={700}
                      >
                        {productName}
                      </Typography>

                      <Typography
                        color="text.secondary"
                      >
                        SKU : {productSku}
                      </Typography>

                      <Rating
                        value={rating}
                        precision={0.5}
                        readOnly
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
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {reviewText}
                  </Typography>
                                    {/* ==========================================
                      Review Images
                  ========================================== */}

                  {reviewImages.length > 0 && (
                    <>
                      <Divider />

                      <Box>

                        <Typography
                          variant="h6"
                          fontWeight={700}
                          gutterBottom
                        >
                          Review Images
                        </Typography>

                        <ImageList
                          cols={3}
                          gap={10}
                          rowHeight={180}
                        >
                          {reviewImages.map((image, index) => (

                            <ImageListItem
                              key={index}
                            >

                              <img
                                src={image}
                                alt={`Review ${index + 1}`}
                                loading="lazy"
                                style={{
                                  borderRadius: 10,
                                  cursor: "pointer",
                                  objectFit: "cover",
                                  width: "100%",
                                  height: "100%",
                                }}
                              />

                            </ImageListItem>

                          ))}
                        </ImageList>

                      </Box>
                    </>
                  )}

                  {/* ==========================================
                      Seller Reply
                  ========================================== */}

                  {sellerReply && (
                    <>
                      <Divider />

                      <Card
                        variant="outlined"
                        sx={{
                          bgcolor: "#f9f9f9",
                        }}
                      >

                        <CardHeader
                          avatar={
                            <Avatar>
                              <Store />
                            </Avatar>
                          }

                          title={
                            <Typography
                              fontWeight={700}
                            >
                              Seller Reply
                            </Typography>
                          }

                          subheader={
                            formatDate(
                              sellerReply.replyDate
                            )
                          }
                        />

                        <Divider />

                        <CardContent>

                          <Typography
                            variant="body1"
                            sx={{
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {sellerReply.replyText}
                          </Typography>

                        </CardContent>

                      </Card>
                    </>
                  )}

                </Stack>

              </CardContent>

            </Card>

          </Grid>

        </Grid>

      </DialogContent>
            <DialogActions
        sx={{
          px: 3,
          py: 2,
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {/* Left Actions */}

        <Stack
          direction="row"
          spacing={1}
        >
          <Button
            variant="outlined"
            startIcon={<Reply />}
            onClick={handleReply}
          >
            Reply
          </Button>

          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
            onClick={handleApprove}
          >
            Approve
          </Button>

          <Button
            variant="contained"
            color="warning"
            startIcon={<Cancel />}
            onClick={handleReject}
          >
            Reject
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Stack>

        {/* Right Actions */}

        <Stack
          direction="row"
          spacing={1}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
          >
            Close
          </Button>
        </Stack>
      </DialogActions>

    </Dialog>
  );
};

//====================================================
// PropTypes
//====================================================

ReviewView.propTypes = {
  open: PropTypes.bool,

  review: PropTypes.shape({
    reviewId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    customerName: PropTypes.string,
    customerImage: PropTypes.string,
    verifiedBuyer: PropTypes.bool,

    productName: PropTypes.string,
    productSku: PropTypes.string,
    productImage: PropTypes.string,

    marketplace: PropTypes.string,

    rating: PropTypes.number,

    reviewTitle: PropTypes.string,
    reviewText: PropTypes.string,

    helpfulCount: PropTypes.number,

    status: PropTypes.string,

    createdDate: PropTypes.string,

    reviewImages: PropTypes.arrayOf(
      PropTypes.string
    ),

    sellerReply: PropTypes.shape({
      replyText: PropTypes.string,
      replyDate: PropTypes.string,
    }),
  }),

  onClose: PropTypes.func,
  onReply: PropTypes.func,
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
  onDelete: PropTypes.func,
};

//====================================================
// Default Props
//====================================================

ReviewView.defaultProps = {
  open: false,
  review: null,

  onClose: () => {},
  onReply: () => {},
  onApprove: () => {},
  onReject: () => {},
  onDelete: () => {},
};

//====================================================
// Export
//====================================================

export default ReviewView;