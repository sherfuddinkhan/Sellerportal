// =========================================================
// CatalogReviews.jsx
// Product-specific Reviews
// =========================================================

import React, { useEffect, useState } from "react";

import {
    Alert,
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Rating,
    Stack,
    Typography,
} from "@mui/material";

import {
    Person,
    Verified,
} from "@mui/icons-material";

// =========================================================
// CONFIGURATION
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const CatalogReviews = ({
    productId,
    sellerId = 6,
    customerId = 3,
}) => {

    // =====================================================
    // STATE
    // =====================================================

    const [reviews, setReviews] = useState([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    // =====================================================
    // LOAD REVIEWS
    // =====================================================

    const loadReviews = async () => {

        if (!productId) {
            setReviews([]);
            return;
        }

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${SERVER_URL}/api/catalog/${productId}/reviews?sellerId=${sellerId}&customerId=${customerId}`
            );

            if (!response.ok) {

                throw new Error(
                    `Failed to load reviews (${response.status})`
                );

            }

            const data =
                await response.json();

            // =================================================
            // HANDLE DIFFERENT API RESPONSE FORMATS
            // =================================================

            const reviewData =
                Array.isArray(data)
                    ? data
                    : Array.isArray(data?.data)
                        ? data.data
                        : Array.isArray(data?.reviews)
                            ? data.reviews
                            : Array.isArray(data?.items)
                                ? data.items
                                : Array.isArray(data?.$values)
                                    ? data.$values
                                    : [];

            setReviews(reviewData);

        } catch (err) {

            console.error(
                "Catalog reviews error:",
                err
            );

            setError(
                err.message ||
                "Unable to load product reviews."
            );

            setReviews([]);

        } finally {

            setLoading(false);

        }
    };

    // =====================================================
    // LOAD WHEN PRODUCT CHANGES
    // =====================================================

    useEffect(() => {

        loadReviews();

    }, [
        productId,
        sellerId,
        customerId,
    ]);

    // =====================================================
    // FORMAT DATE
    // =====================================================

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

    // =====================================================
    // STATUS
    // =====================================================

    const getStatusColor = (status) => {

        switch (
            String(status || "")
                .toLowerCase()
        ) {

            case "approved":
                return "success";

            case "rejected":
                return "error";

            case "pending":
                return "warning";

            default:
                return "default";
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <Box
                sx={{
                    width: "100%",
                    minHeight: 250,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >

                <Stack
                    spacing={2}
                    alignItems="center"
                >

                    <CircularProgress />

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Loading reviews...
                    </Typography>

                </Stack>

            </Box>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (
            <Alert
                severity="error"
                sx={{ mb: 2 }}
            >
                {error}
            </Alert>
        );
    }

    // =====================================================
    // EMPTY
    // =====================================================

    if (!reviews.length) {

        return (
            <Card
                variant="outlined"
            >
                <CardContent>

                    <Stack
                        spacing={1}
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            minHeight: 180,
                            textAlign: "center",
                        }}
                    >

                        <Person
                            sx={{
                                fontSize: 50,
                                color: "text.secondary",
                            }}
                        />

                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >
                            No Reviews Found
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            This product does not have
                            any reviews yet.
                        </Typography>

                    </Stack>

                </CardContent>
            </Card>
        );
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box
            sx={{
                width: "100%",
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    mb: 2,
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight={700}
                >
                    Product Reviews
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    {reviews.length} review
                    {reviews.length === 1
                        ? ""
                        : "s"}
                </Typography>

            </Box>

            {/* =================================================
                REVIEWS
            ================================================= */}

            <Stack spacing={2}>

                {reviews.map(
                    (review, index) => {

                        const reviewId =
                            review?.reviewId ??
                            review?.ReviewId ??
                            index;

                        const customerName =
                            review?.customerName ??
                            review?.CustomerName ??
                            "Customer";

                        const customerImage =
                            review?.customerImage ??
                            review?.CustomerImage ??
                            "";

                        const verifiedBuyer =
                            review?.verifiedBuyer ??
                            review?.VerifiedBuyer ??
                            false;

                        const rating =
                            Number(
                                review?.rating ??
                                review?.Rating ??
                                0
                            );

                        const title =
                            review?.reviewTitle ??
                            review?.ReviewTitle ??
                            "";

                        const text =
                            review?.reviewText ??
                            review?.ReviewText ??
                            "";

                        const marketplace =
                            review?.marketplace ??
                            review?.Marketplace ??
                            "";

                        const status =
                            review?.status ??
                            review?.Status ??
                            "Pending";

                        const createdDate =
                            review?.createdDate ??
                            review?.CreatedDate;

                        return (

                            <Card
                                key={reviewId}
                                variant="outlined"
                            >

                                <CardContent>

                                    <Stack
                                        spacing={2}
                                    >

                                        {/* =================================
                                            CUSTOMER
                                        ================================= */}

                                        <Stack
                                            direction="row"
                                            spacing={2}
                                            alignItems="center"
                                        >

                                            <Avatar
                                                src={
                                                    customerImage
                                                }
                                            >
                                                {customerName
                                                    ?.charAt(0)
                                                    ?.toUpperCase()}
                                            </Avatar>

                                            <Box
                                                sx={{
                                                    flex: 1,
                                                }}
                                            >

                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    alignItems="center"
                                                    flexWrap="wrap"
                                                >

                                                    <Typography
                                                        fontWeight={700}
                                                    >
                                                        {
                                                            customerName
                                                        }
                                                    </Typography>

                                                    {verifiedBuyer && (

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

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {
                                                        formatDate(
                                                            createdDate
                                                        )
                                                    }
                                                </Typography>

                                            </Box>

                                            {/* STATUS */}

                                            <Chip
                                                size="small"
                                                label={
                                                    status
                                                }
                                                color={
                                                    getStatusColor(
                                                        status
                                                    )
                                                }
                                            />

                                        </Stack>

                                        <Divider />

                                        {/* =================================
                                            RATING
                                        ================================= */}

                                        <Stack
                                            direction="row"
                                            spacing={2}
                                            alignItems="center"
                                            flexWrap="wrap"
                                        >

                                            <Rating
                                                value={
                                                    rating
                                                }
                                                precision={
                                                    0.5
                                                }
                                                readOnly
                                            />

                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                            >
                                                {rating}
                                                /5
                                            </Typography>

                                            {marketplace && (

                                                <Chip
                                                    size="small"
                                                    label={
                                                        marketplace
                                                    }
                                                    variant="outlined"
                                                />

                                            )}

                                        </Stack>

                                        {/* =================================
                                            TITLE
                                        ================================= */}

                                        {title && (

                                            <Typography
                                                variant="h6"
                                                fontWeight={700}
                                            >
                                                {title}
                                            </Typography>

                                        )}

                                        {/* =================================
                                            REVIEW TEXT
                                        ================================= */}

                                        {text && (

                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    whiteSpace:
                                                        "pre-wrap",
                                                }}
                                            >
                                                {text}
                                            </Typography>

                                        )}

                                        {/* =================================
                                            SELLER REPLY
                                        ================================= */}

                                        {review?.sellerReply && (

                                            <Box
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 1,
                                                    bgcolor:
                                                        "action.hover",
                                                }}
                                            >

                                                <Typography
                                                    variant="subtitle2"
                                                    fontWeight={700}
                                                    sx={{
                                                        mb: 0.5,
                                                    }}
                                                >
                                                    Seller Reply
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                >
                                                    {
                                                        review
                                                            ?.sellerReply
                                                            ?.replyText
                                                    }
                                                </Typography>

                                            </Box>

                                        )}

                                    </Stack>

                                </CardContent>

                            </Card>

                        );
                    }
                )}

            </Stack>

        </Box>
    );
};

export default CatalogReviews;

