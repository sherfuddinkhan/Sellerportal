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
    Cancel,
    CheckCircle,
    Close,
    Delete,
    Image,
    Reply,
    Store,
    ThumbUp,
    Verified,
} from "@mui/icons-material";


// ======================================================
// Date Formatter
// ======================================================

const formatDate = (date) => {

    if (!date) {
        return "-";
    }


    const parsedDate =
        new Date(date);


    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {
        return "-";
    }


    return parsedDate.toLocaleString(
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

    const statusColor = {

        Approved: "success",

        Rejected: "error",

        Pending: "warning",

    };


    return (

        <Chip
            size="small"
            label={
                status || "Pending"
            }
            color={
                statusColor[
                    status
                ] || "default"
            }
        />

    );
};


// ======================================================
// Marketplace Chip
// ======================================================

const MarketplaceChip = ({
    marketplace,
}) => {

    if (!marketplace) {
        return null;
    }


    return (

        <Chip
            size="small"
            color="primary"
            icon={
                <Store />
            }
            label={
                marketplace
            }
        />

    );
};


// ======================================================
// ReviewView Component
// ======================================================

const ReviewView = ({
    open = false,
    review = null,

    onClose,
    onReply,
    onApprove,
    onReject,
    onDelete,
}) => {


    // ==================================================
    // Empty Review Protection
    // ==================================================

    if (!review) {
        return null;
    }


    // ==================================================
    // Review Data
    // ==================================================

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

        reviewImages,

        sellerReply,

        createdDate,

    } = review;


    // ==================================================
    // Safe Values
    // ==================================================

    const safeCustomerName =
        customerName ||
        "Customer";


    const safeProductName =
        productName ||
        "Unknown Product";


    const safeRating =
        Number(rating) || 0;


    const safeHelpfulCount =
        Number(helpfulCount) || 0;


    const safeReviewImages =
        Array.isArray(reviewImages)
            ? reviewImages.filter(
                (image) =>
                    typeof image ===
                    "string" &&
                    image.trim() !== ""
            )
            : [];


    // ==================================================
    // Seller Reply
    // ==================================================

    const sellerReplyText =
        typeof sellerReply === "string"
            ? sellerReply
            : sellerReply?.replyText;


    const sellerReplyDate =
        typeof sellerReply === "object"
            ? sellerReply?.replyDate
            : null;


    // ==================================================
    // Event Handlers
    // ==================================================

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


    // ==================================================
    // JSX
    // ==================================================

    return (

        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="lg"
            scroll="paper"
        >

            {/* ==================================================
                Dialog Title
            ================================================== */}

            <DialogTitle>

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                >

                    {/* ==========================================
                        Title
                    ========================================== */}

                    <Box
                        sx={{
                            minWidth: 0,
                        }}
                    >

                        <Typography
                            variant="h5"
                            fontWeight={700}
                        >
                            Review Details
                        </Typography>


                        <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                        >
                            Review ID:{" "}
                            {reviewId ?? "-"}
                        </Typography>

                    </Box>


                    {/* ==========================================
                        Close Button
                    ========================================== */}

                    <Tooltip
                        title="Close"
                    >

                        <IconButton
                            onClick={
                                handleClose
                            }
                            aria-label="Close"
                        >
                            <Close />
                        </IconButton>

                    </Tooltip>

                </Stack>

            </DialogTitle>


            <Divider />


            {/* ==================================================
                Dialog Content
            ================================================== */}

            <DialogContent dividers>

                <Grid
                    container
                    spacing={3}
                >

                    {/* ==================================================
                        Customer Information
                    ================================================== */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <Card
                            variant="outlined"
                            sx={{
                                height: "100%",
                            }}
                        >

                            <CardHeader

                                avatar={

                                    <Avatar
                                        src={
                                            customerImage ||
                                            undefined
                                        }
                                        alt={
                                            safeCustomerName
                                        }
                                        sx={{
                                            width: 60,
                                            height: 60,
                                        }}
                                    >
                                        {
                                            safeCustomerName
                                                .charAt(0)
                                                .toUpperCase()
                                        }
                                    </Avatar>

                                }

                                title={

                                    <Typography
                                        fontWeight={700}
                                    >
                                        {
                                            safeCustomerName
                                        }
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

                                <Stack
                                    spacing={2}
                                >

                                    {/* ==================================
                                        Verified Buyer
                                    ================================== */}

                                    {verifiedBuyer && (

                                        <Chip
                                            color="success"
                                            icon={
                                                <Verified />
                                            }
                                            label="Verified Buyer"
                                        />

                                    )}


                                    {/* ==================================
                                        Marketplace
                                    ================================== */}

                                    <MarketplaceChip
                                        marketplace={
                                            marketplace
                                        }
                                    />


                                    {/* ==================================
                                        Status
                                    ================================== */}

                                    <StatusChip
                                        status={
                                            status
                                        }
                                    />


                                    {/* ==================================
                                        Helpful Count
                                    ================================== */}

                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                    >

                                        <ThumbUp
                                            color="primary"
                                        />

                                        <Typography>
                                            Helpful:{" "}
                                            {
                                                safeHelpfulCount
                                            }
                                        </Typography>

                                    </Stack>


                                    {/* ==================================
                                        Created Date
                                    ================================== */}

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Created:{" "}
                                        {
                                            formatDate(
                                                createdDate
                                            )
                                        }
                                    </Typography>

                                </Stack>

                            </CardContent>

                        </Card>

                    </Grid>


                    {/* ==================================================
                        Product & Review
                    ================================================== */}

                    <Grid
                        item
                        xs={12}
                        md={8}
                    >

                        <Card
                            variant="outlined"
                        >

                            <CardContent>

                                <Stack
                                    spacing={2}
                                >

                                    {/* ==================================
                                        Product Information
                                    ================================== */}

                                    <Stack
                                        direction={{
                                            xs: "column",
                                            sm: "row",
                                        }}
                                        spacing={2}
                                        alignItems={{
                                            xs: "flex-start",
                                            sm: "center",
                                        }}
                                    >

                                        {/* Product Image */}

                                        <Avatar
                                            src={
                                                productImage ||
                                                undefined
                                            }
                                            alt={
                                                safeProductName
                                            }
                                            variant="rounded"
                                            sx={{
                                                width: 90,
                                                height: 90,
                                            }}
                                        >
                                            <Image />
                                        </Avatar>


                                        {/* Product Details */}

                                        <Box
                                            sx={{
                                                minWidth: 0,
                                            }}
                                        >

                                            <Typography
                                                variant="h6"
                                                fontWeight={700}
                                            >
                                                {
                                                    safeProductName
                                                }
                                            </Typography>


                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                SKU:{" "}
                                                {
                                                    productSku ||
                                                    "-"
                                                }
                                            </Typography>


                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                alignItems="center"
                                                mt={0.5}
                                            >

                                                <Rating
                                                    value={
                                                        Math.min(
                                                            5,
                                                            Math.max(
                                                                0,
                                                                safeRating
                                                            )
                                                        )
                                                    }
                                                    precision={0.5}
                                                    readOnly
                                                />

                                                <Typography
                                                    variant="body2"
                                                    fontWeight={600}
                                                >
                                                    {
                                                        safeRating.toFixed(
                                                            1
                                                        )
                                                    }
                                                </Typography>

                                            </Stack>

                                        </Box>

                                    </Stack>


                                    <Divider />


                                    {/* ==================================
                                        Review Title
                                    ================================== */}

                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                    >
                                        {
                                            reviewTitle ||
                                            "Review"
                                        }
                                    </Typography>


                                    {/* ==================================
                                        Review Text
                                    ================================== */}

                                    <Typography
                                        variant="body1"
                                        sx={{
                                            whiteSpace:
                                                "pre-wrap",
                                            wordBreak:
                                                "break-word",
                                        }}
                                    >
                                        {
                                            reviewText ||
                                            "No review text provided."
                                        }
                                    </Typography>


                                    {/* ==================================
                                        Review Images
                                    ================================== */}

                                    {safeReviewImages.length >
                                        0 && (

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
                                                    cols={{
                                                        xs: 1,
                                                        sm: 2,
                                                        md: 3,
                                                    }}
                                                    gap={10}
                                                    rowHeight={180}
                                                >

                                                    {
                                                        safeReviewImages.map(
                                                            (
                                                                image,
                                                                index
                                                            ) => (

                                                                <ImageListItem
                                                                    key={
                                                                        `${reviewId}-image-${index}`
                                                                    }
                                                                >

                                                                    <img
                                                                        src={
                                                                            image
                                                                        }
                                                                        alt={
                                                                            `Review image ${index + 1}`
                                                                        }
                                                                        loading="lazy"
                                                                        style={{
                                                                            borderRadius:
                                                                                10,
                                                                            cursor:
                                                                                "pointer",
                                                                            objectFit:
                                                                                "cover",
                                                                            width:
                                                                                "100%",
                                                                            height:
                                                                                "100%",
                                                                        }}
                                                                    />

                                                                </ImageListItem>

                                                            )
                                                        )
                                                    }

                                                </ImageList>

                                            </Box>

                                        </>

                                    )}


                                    {/* ==================================
                                        Seller Reply
                                    ================================== */}

                                    {sellerReplyText && (

                                        <>

                                            <Divider />

                                            <Card
                                                variant="outlined"
                                                sx={{
                                                    bgcolor:
                                                        "action.hover",
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
                                                        sellerReplyDate
                                                            ? formatDate(
                                                                sellerReplyDate
                                                            )
                                                            : undefined
                                                    }

                                                />


                                                <Divider />


                                                <CardContent>

                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            whiteSpace:
                                                                "pre-wrap",
                                                            wordBreak:
                                                                "break-word",
                                                        }}
                                                    >
                                                        {
                                                            sellerReplyText
                                                        }
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


            {/* ==================================================
                Dialog Actions
            ================================================== */}

            <DialogActions
                sx={{
                    px: 3,
                    py: 2,
                    justifyContent:
                        "space-between",
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >

                {/* ==================================================
                    Review Actions
                ================================================== */}

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    spacing={1}
                    width={{
                        xs: "100%",
                        sm: "auto",
                    }}
                >

                    {/* ==================================
                        Reply
                    ================================== */}

                    <Button
                        variant="outlined"
                        startIcon={
                            <Reply />
                        }
                        onClick={
                            handleReply
                        }
                    >
                        Reply
                    </Button>


                    {/* ==================================
                        Approve
                    ================================== */}

                    <Button
                        variant="contained"
                        color="success"
                        startIcon={
                            <CheckCircle />
                        }
                        onClick={
                            handleApprove
                        }
                    >
                        Approve
                    </Button>


                    {/* ==================================
                        Reject
                    ================================== */}

                    <Button
                        variant="contained"
                        color="warning"
                        startIcon={
                            <Cancel />
                        }
                        onClick={
                            handleReject
                        }
                    >
                        Reject
                    </Button>


                    {/* ==================================
                        Delete
                    ================================== */}

                    <Button
                        variant="contained"
                        color="error"
                        startIcon={
                            <Delete />
                        }
                        onClick={
                            handleDelete
                        }
                    >
                        Delete
                    </Button>

                </Stack>


                {/* ==================================================
                    Close
                ================================================== */}

                <Button
                    variant="outlined"
                    onClick={
                        handleClose
                    }
                >
                    Close
                </Button>

            </DialogActions>

        </Dialog>
    );
};


// ======================================================
// PropTypes
// ======================================================

ReviewView.propTypes = {

    open:
        PropTypes.bool,

    review:
        PropTypes.shape({

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
                PropTypes.oneOfType([
                    PropTypes.bool,
                    PropTypes.string,
                ]),

            productName:
                PropTypes.string,

            productSku:
                PropTypes.string,

            productImage:
                PropTypes.string,

            marketplace:
                PropTypes.string,

            rating:
                PropTypes.oneOfType([
                    PropTypes.number,
                    PropTypes.string,
                ]),

            reviewTitle:
                PropTypes.string,

            reviewText:
                PropTypes.string,

            helpfulCount:
                PropTypes.oneOfType([
                    PropTypes.number,
                    PropTypes.string,
                ]),

            status:
                PropTypes.string,

            createdDate:
                PropTypes.string,

            reviewImages:
                PropTypes.arrayOf(
                    PropTypes.string
                ),

            sellerReply:
                PropTypes.oneOfType([

                    PropTypes.string,

                    PropTypes.shape({

                        replyText:
                            PropTypes.string,

                        replyDate:
                            PropTypes.string,

                    }),

                ]),

        }),

    onClose:
        PropTypes.func,

    onReply:
        PropTypes.func,

    onApprove:
        PropTypes.func,

    onReject:
        PropTypes.func,

    onDelete:
        PropTypes.func,

};


// ======================================================
// Default Props
// ======================================================

ReviewView.defaultProps = {

    open: false,

    review: null,

    onClose:
        () => {},

    onReply:
        () => {},

    onApprove:
        () => {},

    onReject:
        () => {},

    onDelete:
        () => {},

};


// ======================================================
// Export
// ======================================================

export default ReviewView;
