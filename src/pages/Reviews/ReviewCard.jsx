import React from "react";
import PropTypes from "prop-types";
import {Avatar,Box,Card,CardContent,CardHeader,CardActions,Chip,Divider,Grid,IconButton,ImageList,ImageListItem,Rating,Stack,Tooltip,Typography,Button} from "@mui/material";
import {CheckCircle,Cancel,Delete,Reply,Visibility,Verified,ThumbUp,Store,Image} from "@mui/icons-material";

//======================================================
// Date Formatter
//======================================================
const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

//======================================================
// Status Chip
//======================================================

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
      label={status}
      color={color}
    />
  );
};

//======================================================
// Marketplace Chip
//======================================================

const MarketplaceChip = ({ marketplace }) => (
  <Chip
    size="small"
    color="primary"
    icon={<Store />}
    label={marketplace}
  />

);
//======================================================
// ReviewCard Component
//======================================================

const ReviewCard = ({
  review,

  onView,
  onReply,
  onApprove,
  onReject,
  onDelete,
}) => {

  if (!review) return null;

  const {
    reviewId,
    productName,
    productSku,
    productImage,

    customerName,
    customerImage,
    verifiedBuyer,

    reviewTitle,
    reviewText,
    rating,

    status,
    marketplace,

    helpfulCount,
    reviewImages,

    sellerReply,

    createdDate,
  } = review;

  //====================================================
  // Event Handlers
  //====================================================

  const handleView = () => {
    if (onView) onView(review);
  };

  const handleReply = () => {
    if (onReply) onReply(review);
  };

  const handleApprove = () => {
    if (onApprove) onApprove(review);
  };

  const handleReject = () => {
    if (onReject) onReject(review);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(review);
  };

  //====================================================
  // JSX
  //====================================================

  return (

    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        mb: 2,
        transition: "0.25s",

        "&:hover": {
          boxShadow: 8,
        },
      }}
    >

      <CardHeader

        avatar={
          <Avatar
            src={customerImage}
          >
            {customerName?.charAt(0)}
          </Avatar>
        }

        title={
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >

            <Typography
              variant="h6"
            >
              {customerName}
            </Typography>

            {verifiedBuyer && (

              <Chip
                size="small"
                color="success"
                icon={<Verified />}
                label="Verified Buyer"
              />

            )}

          </Stack>
        }

        subheader={
          formatDate(createdDate)
        }

      />

      <Divider />

      <CardContent>

        <Grid
          container
          spacing={3}
        >

          {/* Product Section */}

          <Grid
            item
            xs={12}
            md={4}
          >

            <Stack
              direction="row"
              spacing={2}
            >

              <Avatar
                src={productImage}
                variant="rounded"
                sx={{
                  width: 72,
                  height: 72,
                }}
              >
                <Image />
              </Avatar>

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
                  SKU : {productSku}
                </Typography>

                <Box mt={1}>
                  <MarketplaceChip
                    marketplace={marketplace}
                  />
                </Box>

              </Box>

            </Stack>

          </Grid>

          {/* Review Details */}

          <Grid
            item
            xs={12}
            md={8}
          >

            <Stack spacing={1}>

              <Rating
                value={rating}
                precision={0.5}
                readOnly
              />

              <Typography
                variant="h6"
                fontWeight={700}
              >
                {reviewTitle}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {reviewText}
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                mt={1}
                alignItems="center"
              >

                <StatusChip
                  status={status}
                />

                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                >

                  <ThumbUp
                    color="primary"
                    fontSize="small"
                  />

                  <Typography
                    variant="body2"
                  >
                    {helpfulCount || 0}
                  </Typography>

                </Stack>

              </Stack>

            </Stack>

          </Grid>

        </Grid>
                  {/* ============================================
              Review Images
          ============================================ */}

          {reviewImages?.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />

              <Box>

                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  mb={1}
                >
                  Review Images
                </Typography>

                <ImageList
                  cols={4}
                  gap={8}
                  rowHeight={120}
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
                          borderRadius: 8,
                          cursor: "pointer",
                          objectFit: "cover",
                        }}
                      />

                    </ImageListItem>

                  ))}
                </ImageList>

              </Box>
            </>
          )}

          {/* ============================================
              Seller Reply
          ============================================ */}

          {sellerReply && (
            <>
              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  backgroundColor: "#F5F5F5",
                  borderRadius: 2,
                  p: 2,
                }}
              >

                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  gutterBottom
                >
                  Seller Reply
                </Typography>

                <Typography
                  variant="body2"
                >
                  {sellerReply.replyText}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  mt={1}
                  alignItems="center"
                >

                  <Chip
                    size="small"
                    color="primary"
                    label="Seller"
                  />

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {formatDate(
                      sellerReply.replyDate
                    )}
                  </Typography>

                </Stack>

              </Box>
            </>
          )}

      </CardContent>

      <Divider />
            <CardActions
        sx={{
          justifyContent: "space-between",
          flexWrap: "wrap",
          px: 2,
          py: 1.5,
        }}
      >
        {/* Left Side */}

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
        >
          <Tooltip title="View Review">
            <IconButton
              color="primary"
              onClick={handleView}
            >
              <Visibility />
            </IconButton>
          </Tooltip>

          <Tooltip title="Reply">
            <IconButton
              color="secondary"
              onClick={handleReply}
            >
              <Reply />
            </IconButton>
          </Tooltip>

          <Tooltip title="Approve">
            <IconButton
              color="success"
              onClick={handleApprove}
            >
              <CheckCircle />
            </IconButton>
          </Tooltip>

          <Tooltip title="Reject">
            <IconButton
              color="warning"
              onClick={handleReject}
            >
              <Cancel />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={handleDelete}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Right Side */}

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
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
            color="primary"
            startIcon={<Visibility />}
            onClick={handleView}
          >
            View Details
          </Button>
        </Stack>
      </CardActions>

    </Card>
  );
};

//======================================================
// PropTypes
//======================================================

ReviewCard.propTypes = {
  review: PropTypes.shape({
    reviewId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    productName: PropTypes.string,
    productSku: PropTypes.string,
    productImage: PropTypes.string,

    customerName: PropTypes.string,
    customerImage: PropTypes.string,

    verifiedBuyer: PropTypes.bool,

    reviewTitle: PropTypes.string,
    reviewText: PropTypes.string,

    rating: PropTypes.number,

    status: PropTypes.string,
    marketplace: PropTypes.string,

    helpfulCount: PropTypes.number,

    reviewImages: PropTypes.arrayOf(
      PropTypes.string
    ),

    sellerReply: PropTypes.shape({
      replyText: PropTypes.string,
      replyDate: PropTypes.string,
    }),

    createdDate: PropTypes.string,
  }),

  onView: PropTypes.func,
  onReply: PropTypes.func,
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
  onDelete: PropTypes.func,
};

//======================================================
// Default Props
//======================================================

ReviewCard.defaultProps = {
  review: null,

  onView: () => {},
  onReply: () => {},
  onApprove: () => {},
  onReject: () => {},
  onDelete: () => {},
};

//======================================================
// Export
//======================================================

export default ReviewCard;