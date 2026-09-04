
import React, {
    useEffect,
    useState
} from "react";

import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    ImageList,
    ImageListItem,
    Rating,
    Stack,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Delete,
    Edit,
    Image as ImageIcon,
    Verified
} from "@mui/icons-material";

import axios from "axios";

import {
    useNavigate,
    useParams
} from "react-router-dom";


/* =========================================================
   API CONFIGURATION
========================================================= */

const SERVER_URL = "http://localhost:5000";

const REVIEW_API = `${SERVER_URL}/api/reviews`;


/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (value) => {

    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};


/* =========================================================
   STATUS CHIP
========================================================= */

const StatusChip = ({ status }) => {

    const normalizedStatus =
        String(status || "Pending").toLowerCase();

    let color = "warning";

    if (normalizedStatus === "approved") {
        color = "success";
    }

    if (normalizedStatus === "rejected") {
        color = "error";
    }

    return (
        <Chip
            label={status || "Pending"}
            color={color}
            size="small"
            sx={{
                fontWeight: 600
            }}
        />
    );
};


/* =========================================================
   MARKETPLACE CHIP
========================================================= */

const MarketplaceChip = ({ marketplace }) => {

    return (
        <Chip
            label={marketplace || "—"}
            variant="outlined"
            size="small"
            sx={{
                fontWeight: 600
            }}
        />
    );
};


/* =========================================================
   CUSTOMER SECTION
========================================================= */

const CustomerSection = ({ review }) => {

    const customerName =
        review?.customerName || "Customer";

    const customerImage =
        review?.customerImage || "";

    const firstLetter =
        customerName.charAt(0).toUpperCase();

    const verified =
        review?.verifiedBuyer === true ||
        review?.verifiedBuyer === "true" ||
        review?.verifiedBuyer === "True" ||
        review?.verifiedBuyer === "Yes" ||
        review?.verifiedBuyer === 1;

    return (
        <Stack
            direction={{
                xs: "column",
                sm: "row"
            }}
            spacing={2}
            alignItems={{
                xs: "flex-start",
                sm: "center"
            }}
        >

            <Avatar
                src={customerImage || undefined}
                alt={customerName}
                sx={{
                    width: 72,
                    height: 72,
                    fontSize: 28
                }}
            >
                {firstLetter}
            </Avatar>

            <Box>

                <Typography
                    variant="h6"
                    fontWeight={700}
                >
                    {customerName}
                </Typography>

                {verified && (
                    <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                        sx={{
                            mt: 0.5
                        }}
                    >

                        <Verified
                            sx={{
                                fontSize: 18,
                                color: "success.main"
                            }}
                        />

                        <Typography
                            variant="body2"
                            color="success.main"
                            fontWeight={600}
                        >
                            Verified Buyer
                        </Typography>

                    </Stack>
                )}

            </Box>

        </Stack>
    );
};


/* =========================================================
   PRODUCT SECTION
========================================================= */

const ProductSection = ({ review }) => {

    const productName =
        review?.productName || "Product";

    const productImage =
        review?.productImage || "";

    const productSku =
        review?.productSku || "—";

    return (
        <Stack
            direction={{
                xs: "column",
                sm: "row"
            }}
            spacing={2}
            alignItems={{
                xs: "flex-start",
                sm: "center"
            }}
        >

            <Avatar
                variant="rounded"
                src={productImage || undefined}
                alt={productName}
                sx={{
                    width: 90,
                    height: 90
                }}
            >
                {productName
                    .charAt(0)
                    .toUpperCase()}
            </Avatar>

            <Box
                sx={{
                    minWidth: 0
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight={700}
                >
                    {productName}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 0.5
                    }}
                >
                    SKU: {productSku}
                </Typography>

            </Box>

        </Stack>
    );
};


/* =========================================================
   REVIEW RATING
========================================================= */

const ReviewRating = ({ rating }) => {

    const value =
        Number(rating) || 0;

    return (
        <Stack
            direction="row"
            spacing={1}
            alignItems="center"
        >

            <Rating
                value={value}
                precision={0.5}
                readOnly
                size="medium"
            />

            <Typography
                variant="body1"
                fontWeight={700}
            >
                {value.toFixed(1)} / 5
            </Typography>

        </Stack>
    );
};


/* =========================================================
   REVIEW IMAGES
========================================================= */

const ReviewImages = ({ images }) => {

    if (!Array.isArray(images) || images.length === 0) {
        return (
            <Typography
                variant="body2"
                color="text.secondary"
            >
                No review images available.
            </Typography>
        );
    }

    return (
        <ImageList
            cols={3}
            gap={12}
            sx={{
                width: "100%",
                maxWidth: 700
            }}
        >

            {images.map((image, index) => (

                <ImageListItem
                    key={`${image}-${index}`}
                    sx={{
                        borderRadius: 2,
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: "divider",
                        backgroundColor: "grey.100"
                    }}
                >

                    <img
                        src={image}
                        alt={`Review ${index + 1}`}
                        loading="lazy"
                        style={{
                            width: "100%",
                            height: 180,
                            objectFit: "cover"
                        }}
                        onError={(event) => {
                            event.currentTarget.style.display =
                                "none";
                        }}
                    />

                </ImageListItem>

            ))}

        </ImageList>
    );
};


/* =========================================================
   NORMALIZE REVIEW IMAGES
========================================================= */

const normalizeReviewImages = (review) => {

    const images = review?.reviewImages;

    if (Array.isArray(images)) {
        return images.filter(Boolean);
    }

    if (typeof images === "string") {

        const trimmed = images.trim();

        if (!trimmed) {
            return [];
        }

        try {

            const parsed =
                JSON.parse(trimmed);

            if (Array.isArray(parsed)) {
                return parsed.filter(Boolean);
            }

        } catch {
            // Not JSON.
        }

        return trimmed
            .split(/\r?\n|,/)
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return [];
};


/* =========================================================
   REVIEW DETAILS
========================================================= */

const ReviewDetails = () => {

    const {
        id
    } = useParams();

    const navigate =
        useNavigate();


    /* =====================================================
       STATE
    ===================================================== */

    const [review, setReview] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [deleteLoading, setDeleteLoading] =
        useState(false);


    /* =====================================================
       LOAD REVIEW
    ===================================================== */

    const loadReview = async () => {

        if (!id || !/^\d+$/.test(id)) {

            setError(
                "Invalid Review ID."
            );

            setLoading(false);

            return;
        }

        try {

            setLoading(true);

            setError("");

            const response =
                await axios.get(
                    `${REVIEW_API}/${id}`
                );

            console.log(
                "REVIEW DETAILS:",
                response.data
            );

            setReview(
                response.data
            );

        } catch (err) {

            console.error(
                "LOAD REVIEW DETAILS ERROR:",
                err
            );

            const message =
                err?.response?.data?.message ||
                err?.response?.data?.title ||
                "Unable to load review details.";

            setError(message);

            setReview(null);

        } finally {

            setLoading(false);
        }
    };


    /* =====================================================
       LOAD ON MOUNT
    ===================================================== */

    useEffect(() => {

        loadReview();

    }, [id]);


    /* =====================================================
       EDIT REVIEW
    ===================================================== */

    const handleEdit = () => {

        navigate(
            `/reviews/edit/${id}`
        );
    };


    /* =====================================================
       DELETE REVIEW
    ===================================================== */

    const handleDelete = async () => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this review?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setDeleteLoading(true);

            await axios.delete(
                `${REVIEW_API}/${id}`
            );

            navigate(
                "/reviews"
            );

        } catch (err) {

            console.error(
                "DELETE REVIEW ERROR:",
                err
            );

            const message =
                err?.response?.data?.message ||
                err?.response?.data?.title ||
                "Unable to delete review.";

            setError(message);

        } finally {

            setDeleteLoading(false);
        }
    };


    /* =====================================================
       BACK
    ===================================================== */

    const handleBack = () => {

        navigate(
            "/reviews"
        );
    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (
            <Box
                sx={{
                    width: "100%",
                    minHeight: 500,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >

                <Stack
                    spacing={2}
                    alignItems="center"
                >

                    <CircularProgress />

                    <Typography
                        color="text.secondary"
                    >
                        Loading review details...
                    </Typography>

                </Stack>

            </Box>
        );
    }


    /* =====================================================
       ERROR / NOT FOUND
    ===================================================== */

    if (error || !review) {

        return (
            <Box
                sx={{
                    width: "100%",
                    p: 3
                }}
            >

                <Alert
                    severity="error"
                    sx={{
                        mb: 2
                    }}
                >
                    {error ||
                        "Review not found."}
                </Alert>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                >
                    Back to Reviews
                </Button>

            </Box>
        );
    }


    /* =====================================================
       REVIEW IMAGE DATA
    ===================================================== */

    const reviewImages =
        normalizeReviewImages(
            review
        );


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box
            sx={{
                width: "100%",
                p: 3
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <Stack
                direction={{
                    xs: "column",
                    md: "row"
                }}
                justifyContent="space-between"
                alignItems={{
                    xs: "flex-start",
                    md: "center"
                }}
                spacing={2}
                sx={{
                    mb: 3
                }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        Review Details
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 0.5
                        }}
                    >
                        View complete customer review information.
                    </Typography>

                </Box>

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row"
                    }}
                    spacing={1}
                >

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                    >
                        Back
                    </Button>

                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<Edit />}
                        onClick={handleEdit}
                    >
                        Edit
                    </Button>

                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={
                            deleteLoading
                                ? (
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                )
                                : (
                                    <Delete />
                                )
                        }
                        onClick={handleDelete}
                        disabled={deleteLoading}
                    >
                        {deleteLoading
                            ? "Deleting..."
                            : "Delete"}
                    </Button>

                </Stack>

            </Stack>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <Stack
                spacing={3}
            >

                {/* =================================================
                    CUSTOMER + PRODUCT
                ================================================= */}

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "1fr 1fr"
                        },
                        gap: 3
                    }}
                >

                    <Card
                        elevation={2}
                    >

                        <CardContent>

                            <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{
                                    mb: 2
                                }}
                            >
                                Customer
                            </Typography>

                            <CustomerSection
                                review={review}
                            />

                        </CardContent>

                    </Card>


                    <Card
                        elevation={2}
                    >

                        <CardContent>

                            <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{
                                    mb: 2
                                }}
                            >
                                Product
                            </Typography>

                            <ProductSection
                                review={review}
                            />

                        </CardContent>

                    </Card>

                </Box>


                {/* =================================================
                    REVIEW INFORMATION
                ================================================= */}

                <Card
                    elevation={2}
                >

                    <CardContent>

                        <Stack
                            direction={{
                                xs: "column",
                                md: "row"
                            }}
                            justifyContent="space-between"
                            alignItems={{
                                xs: "flex-start",
                                md: "center"
                            }}
                            spacing={2}
                            sx={{
                                mb: 2
                            }}
                        >

                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                Review
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={1}
                                flexWrap="wrap"
                            >

                                <StatusChip
                                    status={
                                        review.status
                                    }
                                />

                                <MarketplaceChip
                                    marketplace={
                                        review.marketplace
                                    }
                                />

                            </Stack>

                        </Stack>

                        <Divider
                            sx={{
                                mb: 3
                            }}
                        />

                        <Typography
                            variant="h5"
                            fontWeight={700}
                            sx={{
                                mb: 1
                            }}
                        >
                            {review.reviewTitle ||
                                "Untitled Review"}
                        </Typography>

                        <ReviewRating
                            rating={
                                review.rating
                            }
                        />

                        <Typography
                            variant="body1"
                            sx={{
                                mt: 3,
                                lineHeight: 1.8,
                                whiteSpace: "pre-wrap"
                            }}
                        >
                            {review.reviewText ||
                                "No review text available."}
                        </Typography>

                    </CardContent>

                </Card>


                {/* =================================================
                    REVIEW METADATA
                ================================================= */}

                <Card
                    elevation={2}
                >

                    <CardContent>

                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{
                                mb: 2
                            }}
                        >
                            Review Information
                        </Typography>

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "1fr 1fr",
                                    md: "1fr 1fr 1fr"
                                },
                                gap: 3
                            }}
                        >

                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Review ID
                                </Typography>

                                <Typography
                                    variant="body1"
                                    fontWeight={600}
                                >
                                    #{review.reviewId}
                                </Typography>

                            </Box>


                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Helpful Count
                                </Typography>

                                <Typography
                                    variant="body1"
                                    fontWeight={600}
                                >
                                    {review.helpfulCount ?? 0}
                                </Typography>

                            </Box>


                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Created Date
                                </Typography>

                                <Typography
                                    variant="body1"
                                    fontWeight={600}
                                >
                                    {formatDate(
                                        review.createdDate
                                    )}
                                </Typography>

                            </Box>


                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Marketplace
                                </Typography>

                                <Typography
                                    variant="body1"
                                    fontWeight={600}
                                >
                                    {review.marketplace ||
                                        "—"}
                                </Typography>

                            </Box>


                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Product SKU
                                </Typography>

                                <Typography
                                    variant="body1"
                                    fontWeight={600}
                                >
                                    {review.productSku ||
                                        "—"}
                                </Typography>

                            </Box>


                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Status
                                </Typography>

                                <Box
                                    sx={{
                                        mt: 0.5
                                    }}
                                >
                                    <StatusChip
                                        status={
                                            review.status
                                        }
                                    />
                                </Box>

                            </Box>

                        </Box>

                    </CardContent>

                </Card>


                {/* =================================================
                    REVIEW IMAGES
                ================================================= */}

                <Card
                    elevation={2}
                >

                    <CardContent>

                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{
                                mb: 2
                            }}
                        >

                            <ImageIcon
                                color="action"
                            />

                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                Review Images
                            </Typography>

                        </Stack>

                        <ReviewImages
                            images={
                                reviewImages
                            }
                        />

                    </CardContent>

                </Card>


                {/* =================================================
                    SELLER REPLY
                ================================================= */}

                <Card
                    elevation={2}
                >

                    <CardContent>

                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{
                                mb: 2
                            }}
                        >
                            Seller Reply
                        </Typography>

                        {review.sellerReply?.replyText ? (

                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor:
                                        "grey.50",
                                    border: "1px solid",
                                    borderColor:
                                        "divider"
                                }}
                            >

                                <Typography
                                    variant="body1"
                                    sx={{
                                        lineHeight: 1.7,
                                        whiteSpace: "pre-wrap"
                                    }}
                                >
                                    {
                                        review
                                            .sellerReply
                                            .replyText
                                    }
                                </Typography>

                                {review
                                    .sellerReply
                                    .replyDate && (
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{
                                            display: "block",
                                            mt: 1.5
                                        }}
                                    >
                                        Replied on{" "}
                                        {formatDate(
                                            review
                                                .sellerReply
                                                .replyDate
                                        )}
                                    </Typography>
                                )}

                            </Box>

                        ) : (

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                No seller reply has been added.
                            </Typography>

                        )}

                    </CardContent>

                </Card>

            </Stack>

        </Box>
    );
};


export default ReviewDetails;

