import React from "react";

import PropTypes from "prop-types";

import {
    Box,
    Card,
    CardContent,
    Grid,
    LinearProgress,
    Stack,
    Typography,
} from "@mui/material";

import {
    Cancel,
    CheckCircle,
    Image,
    Pending,
    Reviews,
    Star,
    Verified,
} from "@mui/icons-material";


// ======================================================
// Statistic Card
// ======================================================

const StatisticCard = ({
    title,
    value,
    icon,
    color,
    progress,
}) => {

    // ==================================================
    // Safely Clamp Progress
    // ==================================================

    const safeProgress =
        Number.isFinite(Number(progress))
            ? Math.min(
                100,
                Math.max(
                    0,
                    Number(progress)
                )
            )
            : 0;


    return (

        <Card
            elevation={2}
            sx={{
                height: "100%",
                borderRadius: 3,
                transition: "transform 0.25s, box-shadow 0.25s",

                "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: 6,
                },
            }}
        >

            <CardContent>

                {/* ======================================
                    Header
                ====================================== */}

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                >

                    {/* ==================================
                        Statistic Information
                    ================================== */}

                    <Box
                        sx={{
                            minWidth: 0,
                        }}
                    >

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                        >
                            {title}
                        </Typography>


                        <Typography
                            variant="h4"
                            fontWeight={700}
                            mt={1}
                        >
                            {value}
                        </Typography>

                    </Box>


                    {/* ==================================
                        Statistic Icon
                    ================================== */}

                    <Box
                        sx={{
                            bgcolor: `${color}.light`,
                            color: `${color}.main`,
                            p: 1.5,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        {icon}
                    </Box>

                </Stack>


                {/* ======================================
                    Progress Bar
                ====================================== */}

                {progress !== undefined && (

                    <LinearProgress
                        variant="determinate"
                        value={safeProgress}
                        sx={{
                            mt: 2,
                            height: 8,
                            borderRadius: 4,
                        }}
                    />

                )}

            </CardContent>

        </Card>
    );
};


// ======================================================
// ReviewStatistics Component
// ======================================================

const ReviewStatistics = ({
    statistics,
}) => {

    // ==================================================
    // Empty Statistics Protection
    // ==================================================

    if (!statistics) {
        return null;
    }


    // ==================================================
    // Statistics Values
    // ==================================================

    const {
        totalReviews = 0,
        averageRating = 0,

        pendingReviews = 0,
        approvedReviews = 0,
        rejectedReviews = 0,

        fiveStarReviews = 0,

        verifiedBuyerReviews = 0,
        reviewsWithImages = 0,

    } = statistics;


    // ==================================================
    // Safe Numeric Values
    // ==================================================

    const total =
        Number(totalReviews) || 0;

    const average =
        Number(averageRating) || 0;

    const pending =
        Number(pendingReviews) || 0;

    const approved =
        Number(approvedReviews) || 0;

    const rejected =
        Number(rejectedReviews) || 0;

    const fiveStar =
        Number(fiveStarReviews) || 0;

    const verified =
        Number(verifiedBuyerReviews) || 0;

    const withImages =
        Number(reviewsWithImages) || 0;


    // ==================================================
    // Percentage Helper
    // ==================================================

    const getPercentage = (value) => {

        if (total <= 0) {
            return 0;
        }

        return Math.min(
            100,
            Math.max(
                0,
                (value / total) * 100
            )
        );

    };


    // ==================================================
    // Average Rating Progress
    // ==================================================

    const ratingProgress =
        Math.min(
            100,
            Math.max(
                0,
                (average / 5) * 100
            )
        );


    // ==================================================
    // JSX
    // ==================================================

    return (

        <Box
            sx={{
                mb: 3,
            }}
        >

            <Grid
                container
                spacing={3}
            >

                {/* ======================================
                    Total Reviews
                ====================================== */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <StatisticCard
                        title="Total Reviews"
                        value={total}
                        color="primary"
                        icon={
                            <Reviews
                                fontSize="large"
                            />
                        }
                    />

                </Grid>


                {/* ======================================
                    Average Rating
                ====================================== */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <StatisticCard
                        title="Average Rating"
                        value={average.toFixed(1)}
                        color="warning"
                        icon={
                            <Star
                                fontSize="large"
                            />
                        }
                        progress={
                            ratingProgress
                        }
                    />

                </Grid>


                {/* ======================================
                    Approved Reviews
                ====================================== */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <StatisticCard
                        title="Approved"
                        value={approved}
                        color="success"
                        icon={
                            <CheckCircle
                                fontSize="large"
                            />
                        }
                        progress={
                            getPercentage(
                                approved
                            )
                        }
                    />

                </Grid>


                {/* ======================================
                    Pending Reviews
                ====================================== */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <StatisticCard
                        title="Pending"
                        value={pending}
                        color="warning"
                        icon={
                            <Pending
                                fontSize="large"
                            />
                        }
                        progress={
                            getPercentage(
                                pending
                            )
                        }
                    />

                </Grid>


                {/* ======================================
                    Rejected Reviews
                ====================================== */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <StatisticCard
                        title="Rejected"
                        value={rejected}
                        color="error"
                        icon={
                            <Cancel
                                fontSize="large"
                            />
                        }
                        progress={
                            getPercentage(
                                rejected
                            )
                        }
                    />

                </Grid>


                {/* ======================================
                    Five Star Reviews
                ====================================== */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <StatisticCard
                        title="★★★★★ Reviews"
                        value={fiveStar}
                        color="warning"
                        icon={
                            <Star
                                fontSize="large"
                            />
                        }
                        progress={
                            getPercentage(
                                fiveStar
                            )
                        }
                    />

                </Grid>


                {/* ======================================
                    Verified Buyers
                ====================================== */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <StatisticCard
                        title="Verified Buyers"
                        value={verified}
                        color="info"
                        icon={
                            <Verified
                                fontSize="large"
                            />
                        }
                        progress={
                            getPercentage(
                                verified
                            )
                        }
                    />

                </Grid>


                {/* ======================================
                    Reviews With Images
                ====================================== */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <StatisticCard
                        title="Reviews With Images"
                        value={withImages}
                        color="secondary"
                        icon={
                            <Image
                                fontSize="large"
                            />
                        }
                        progress={
                            getPercentage(
                                withImages
                            )
                        }
                    />

                </Grid>

            </Grid>

        </Box>
    );
};


// ======================================================
// StatisticCard PropTypes
// ======================================================

StatisticCard.propTypes = {

    title:
        PropTypes.string.isRequired,

    value:
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]).isRequired,

    icon:
        PropTypes.node.isRequired,

    color:
        PropTypes.oneOf([
            "primary",
            "secondary",
            "success",
            "error",
            "warning",
            "info",
        ]),

    progress:
        PropTypes.number,

};


// ======================================================
// StatisticCard Default Props
// ======================================================

StatisticCard.defaultProps = {

    color: "primary",

    progress: undefined,

};


// ======================================================
// ReviewStatistics PropTypes
// ======================================================

ReviewStatistics.propTypes = {

    statistics:
        PropTypes.shape({

            totalReviews:
                PropTypes.number,

            averageRating:
                PropTypes.number,

            pendingReviews:
                PropTypes.number,

            approvedReviews:
                PropTypes.number,

            rejectedReviews:
                PropTypes.number,

            fiveStarReviews:
                PropTypes.number,

            verifiedBuyerReviews:
                PropTypes.number,

            reviewsWithImages:
                PropTypes.number,

        }),

};


// ======================================================
// ReviewStatistics Default Props
// ======================================================

ReviewStatistics.defaultProps = {

    statistics: {

        totalReviews: 0,

        averageRating: 0,

        pendingReviews: 0,

        approvedReviews: 0,

        rejectedReviews: 0,

        fiveStarReviews: 0,

        verifiedBuyerReviews: 0,

        reviewsWithImages: 0,

    },

};


// ======================================================
// Export
// ======================================================

export default ReviewStatistics;
