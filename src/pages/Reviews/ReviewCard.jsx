import React from "react";

import PropTypes from "prop-types";

import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Chip,
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
    Delete,
    Image,
    Reply,
    Store,
    ThumbUp,
    Verified,
    Visibility,
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


    return parsedDate.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
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
// ReviewCard Component
// ======================================================

const ReviewCard = ({
    review,

    onView,
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


    const safeVerifiedBuyer =
        verifiedBuyer === true ||
        verifiedBuyer === "true" ||
        verifiedBuyer === "Yes";


    const safeReviewImages =
        Array.isArray(reviewImages)
            ? reviewImages.filter(
                (image) =>
                    typeof image === "string" &&
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
    // Safe Rating
    // ==================================================

    const displayRating =
        Math.min(
            5,
            Math.max(
                0,
                safeRating
            )
        );


    // ==================================================
    // Event Handlers
    // ==================================================

    const handleView = () => {

        if (onView) {
            onView(review);
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

        <Card
            elevation={3}
            sx={{
                borderRadius: 3,
                mb: 2,

                transition:
                    "box-shadow 0.25s, transform 0.25s",

                "&:hover": {
                    boxShadow: 8,
                    transform:
                        "translateY(-2px)",
                },
            }}
        >

            {/* ==================================================
                Customer Header
            ================================================== */}

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
                    >
                        {
                            safeCustomerName
                                .charAt(0)
                                .toUpperCase()
                        }
                    </Avatar>

                }

                title={

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        spacing={1}
                        alignItems={{
                            xs: "flex-start",
                            sm: "center",
                        }}
                    >

                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            {
                                safeCustomerName
                            }
                        </Typography>


                        {safeVerifiedBuyer && (

                            <Chip
                                size="small"
                                color="success"
                                icon={
                                    <Verified />
                                }
                                label="Verified Buyer"
                            />

                        )}

                    </Stack>

                }

                subheader={
                    formatDate(
                        createdDate
                    )
                }

            />


            <Divider />


            {/* ==================================================
                Review Content
            ================================================== */}

            <CardContent>

                <Grid
                    container
                    spacing={3}
                >

                    {/* ==================================================
                        Product Section
                    ================================================== */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <Stack
                            direction="row"
                            spacing={2}
                            alignItems="flex-start"
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
                                    width: 72,
                                    height: 72,
                                    flexShrink: 0,
                                }}
                            >
                                <Image />
                            </Avatar>


                            {/* Product Information */}

                            <Box
                                sx={{
                                    minWidth: 0,
                                }}
                            >

                                <Typography
                                    variant="subtitle1"
                                    fontWeight={700}
                                    sx={{
                                        wordBreak:
                                            "break-word",
                                    }}
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


                                <Box
                                    mt={1}
                                >

                                    <MarketplaceChip
                                        marketplace={
                                            marketplace
                                        }
                                    />

                                </Box>

                            </Box>

                        </Stack>

                    </Grid>


                    {/* ==================================================
                        Review Details
                    ================================================== */}

                    <Grid
                        item
                        xs={12}
                        md={8}
                    >

                        <Stack
                            spacing={1}
                        >

                            {/* ==========================================
                                Rating
                            ========================================== */}

                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                            >

                                <Rating
                                    value={
                                        displayRating
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


                            {/* ==========================================
                                Review Title
                            ========================================== */}

                            <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{
                                    wordBreak:
                                        "break-word",
                                }}
                            >
                                {
                                    reviewTitle ||
                                    "Review"
                                }
                            </Typography>


                            {/* ==========================================
                                Review Text
                            ========================================== */}

                            <Typography
                                variant="body2"
                                color="text.secondary"
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


                            {/* ==========================================
                                Status & Helpful Count
                            ========================================== */}

                            <Stack
                                direction={{
                                    xs: "column",
                                    sm: "row",
                                }}
                                spacing={2}
                                mt={1}
                                alignItems={{
                                    xs: "flex-start",
                                    sm: "center",
                                }}
                            >

                                <StatusChip
                                    status={
                                        status
                                    }
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
                                        {
                                            safeHelpfulCount
                                        }{" "}
                                        Helpful
                                    </Typography>

                                </Stack>

                            </Stack>

                        </Stack>

                    </Grid>

                </Grid>


                {/* ==================================================
                    Review Images
                ================================================== */}

                {safeReviewImages.length >
                    0 && (

                    <>

                        <Divider
                            sx={{
                                my: 2,
                            }}
                        />


                        <Box>

                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                mb={1}
                            >
                                Review Images
                            </Typography>


                            <ImageList
                                cols={{
                                    xs: 2,
                                    sm: 3,
                                    md: 4,
                                }}
                                gap={8}
                                rowHeight={120}
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
                                                            8,
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


                {/* ==================================================
                    Seller Reply
                ================================================== */}

                {sellerReplyText && (

                    <>

                        <Divider
                            sx={{
                                my: 2,
                            }}
                        />


                        <Box
                            sx={{
                                backgroundColor:
                                    "action.hover",

                                borderRadius: 2,

                                p: 2,

                                border:
                                    "1px solid",

                                borderColor:
                                    "divider",
                            }}
                        >

                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                mb={1}
                            >

                                <Avatar
                                    sx={{
                                        width: 32,
                                        height: 32,
                                    }}
                                >
                                    <Store
                                        fontSize="small"
                                    />
                                </Avatar>


                                <Typography
                                    variant="subtitle1"
                                    fontWeight={700}
                                >
                                    Seller Reply
                                </Typography>

                            </Stack>


                            <Typography
                                variant="body2"
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


                                {sellerReplyDate && (

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        {
                                            formatDate(
                                                sellerReplyDate
                                            )
                                        }
                                    </Typography>

                                )}

                            </Stack>

                        </Box>

                    </>

                )}

            </CardContent>


            <Divider />


            {/* ==================================================
                Card Actions
            ================================================== */}

            <CardActions
                sx={{
                    justifyContent:
                        "space-between",

                    flexWrap:
                        "wrap",

                    gap: 1,

                    px: 2,

                    py: 1.5,
                }}
            >

                {/* ==================================================
                    Icon Actions
                ================================================== */}

                <Stack
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                >

                    {/* ==========================================
                        View
                    ========================================== */}

                    <Tooltip
                        title="View Review"
                    >

                        <IconButton
                            color="primary"
                            onClick={
                                handleView
                            }
                            aria-label="View review"
                        >
                            <Visibility />
                        </IconButton>

                    </Tooltip>


                    {/* ==========================================
                        Reply
                    ========================================== */}

                    <Tooltip
                        title="Reply"
                    >

                        <IconButton
                            color="secondary"
                            onClick={
                                handleReply
                            }
                            aria-label="Reply"
                        >
                            <Reply />
                        </IconButton>

                    </Tooltip>


                    {/* ==========================================
                        Approve
                    ========================================== */}

                    <Tooltip
                        title="Approve"
                    >

                        <IconButton
                            color="success"
                            onClick={
                                handleApprove
                            }
                            aria-label="Approve"
                        >
                            <CheckCircle />
                        </IconButton>

                    </Tooltip>


                    {/* ==========================================
                        Reject
                    ========================================== */}

                    <Tooltip
                        title="Reject"
                    >

                        <IconButton
                            color="warning"
                            onClick={
                                handleReject
                            }
                            aria-label="Reject"
                        >
                            <Cancel />
                        </IconButton>

                    </Tooltip>


                    {/* ==========================================
                        Delete
                    ========================================== */}

                    <Tooltip
                        title="Delete"
                    >

                        <IconButton
                            color="error"
                            onClick={
                                handleDelete
                            }
                            aria-label="Delete"
                        >
                            <Delete />
                        </IconButton>

                    </Tooltip>

                </Stack>


                {/* ==================================================
                    Main Actions
                ================================================== */}

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    spacing={1}
                    sx={{
                        width: {
                            xs: "100%",
                            sm: "auto",
                        },
                    }}
                >

                    {/* ==========================================
                        Reply Button
                    ========================================== */}

                    <Button
                        variant="outlined"
                        startIcon={
                            <Reply />
                        }
                        onClick={
                            handleReply
                        }
                        fullWidth={{
                            xs: true,
                            sm: false,
                        }}
                    >
                        Reply
                    </Button>


                    {/* ==========================================
                        View Details Button
                    ========================================== */}

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={
                            <Visibility />
                        }
                        onClick={
                            handleView
                        }
                        fullWidth={{
                            xs: true,
                            sm: false,
                        }}
                    >
                        View Details
                    </Button>

                </Stack>

            </CardActions>

        </Card>
    );
};


// ======================================================
// PropTypes
// ======================================================

ReviewCard.propTypes = {

    review:
        PropTypes.shape({

            reviewId:
                PropTypes.oneOfType([
                    PropTypes.number,
                    PropTypes.string,
                ]),

            productName:
                PropTypes.string,

            productSku:
                PropTypes.string,

            productImage:
                PropTypes.string,

            customerName:
                PropTypes.string,

            customerImage:
                PropTypes.string,

            verifiedBuyer:
                PropTypes.oneOfType([
                    PropTypes.bool,
                    PropTypes.string,
                ]),

            reviewTitle:
                PropTypes.string,

            reviewText:
                PropTypes.string,

            rating:
                PropTypes.oneOfType([
                    PropTypes.number,
                    PropTypes.string,
                ]),

            status:
                PropTypes.string,

            marketplace:
                PropTypes.string,

            helpfulCount:
                PropTypes.oneOfType([
                    PropTypes.number,
                    PropTypes.string,
                ]),

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

            createdDate:
                PropTypes.string,

        }),


    onView:
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

ReviewCard.defaultProps = {

    review: null,

    onView:
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

export default ReviewCard;
