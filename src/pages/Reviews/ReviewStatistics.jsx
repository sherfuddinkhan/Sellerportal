import React from "react";
import PropTypes from "prop-types";

import {
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  LinearProgress,
} from "@mui/material";

import {
  Reviews,
  Star,
  CheckCircle,
  Pending,
  Cancel,
  Image,
  Verified,
  TrendingUp,
} from "@mui/icons-material";

//======================================================
// Statistic Card
//======================================================

const StatisticCard = ({
  title,
  value,
  icon,
  color,
  progress,
}) => (
  <Card
    elevation={2}
    sx={{
      height: "100%",
      borderRadius: 3,
      transition: "0.25s",

      "&:hover": {
        transform: "translateY(-3px)",
        boxShadow: 6,
      },
    }}
  >
    <CardContent>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >

        <Box>

          <Typography
            variant="body2"
            color="text.secondary"
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

        <Box
          sx={{
            bgcolor: `${color}.light`,
            color: `${color}.main`,
            p: 1.5,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>

      </Stack>

      {progress !== undefined && (
        <LinearProgress
          variant="determinate"
          value={progress}
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

//======================================================
// ReviewStatistics Component
//======================================================

const ReviewStatistics = ({
  statistics,
}) => {

  if (!statistics) return null;

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
    return (
    <Box sx={{ mb: 3 }}>

      <Grid container spacing={3}>

        {/* Total Reviews */}

        <Grid item xs={12} sm={6} md={3}>
          <StatisticCard
            title="Total Reviews"
            value={totalReviews}
            color="primary"
            icon={<Reviews fontSize="large" />}
          />
        </Grid>

        {/* Average Rating */}

        <Grid item xs={12} sm={6} md={3}>
          <StatisticCard
            title="Average Rating"
            value={Number(averageRating).toFixed(1)}
            color="warning"
            icon={<Star fontSize="large" />}
            progress={(averageRating / 5) * 100}
          />
        </Grid>

        {/* Approved */}

        <Grid item xs={12} sm={6} md={3}>
          <StatisticCard
            title="Approved"
            value={approvedReviews}
            color="success"
            icon={<CheckCircle fontSize="large" />}
            progress={
              totalReviews
                ? (approvedReviews / totalReviews) * 100
                : 0
            }
          />
        </Grid>

        {/* Pending */}

        <Grid item xs={12} sm={6} md={3}>
          <StatisticCard
            title="Pending"
            value={pendingReviews}
            color="warning"
            icon={<Pending fontSize="large" />}
            progress={
              totalReviews
                ? (pendingReviews / totalReviews) * 100
                : 0
            }
          />
        </Grid>

        {/* Rejected */}

        <Grid item xs={12} sm={6} md={3}>
          <StatisticCard
            title="Rejected"
            value={rejectedReviews}
            color="error"
            icon={<Cancel fontSize="large" />}
            progress={
              totalReviews
                ? (rejectedReviews / totalReviews) * 100
                : 0
            }
          />
        </Grid>

        {/* Five Star */}

        <Grid item xs={12} sm={6} md={3}>
          <StatisticCard
            title="★★★★★ Reviews"
            value={fiveStarReviews}
            color="warning"
            icon={<Star fontSize="large" />}
            progress={
              totalReviews
                ? (fiveStarReviews / totalReviews) * 100
                : 0
            }
          />
        </Grid>

        {/* Verified Buyers */}

        <Grid item xs={12} sm={6} md={3}>
          <StatisticCard
            title="Verified Buyers"
            value={verifiedBuyerReviews}
            color="info"
            icon={<Verified fontSize="large" />}
            progress={
              totalReviews
                ? (verifiedBuyerReviews / totalReviews) * 100
                : 0
            }
          />
        </Grid>

        {/* Reviews With Images */}

        <Grid item xs={12} sm={6} md={3}>
          <StatisticCard
            title="Reviews With Images"
            value={reviewsWithImages}
            color="secondary"
            icon={<Image fontSize="large" />}
            progress={
              totalReviews
                ? (reviewsWithImages / totalReviews) * 100
                : 0
            }
          />
        </Grid>

      </Grid>

    </Box>
  );
};
//======================================================
// PropTypes
//======================================================

StatisticCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,

  icon: PropTypes.node.isRequired,

  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "error",
    "warning",
    "info",
  ]),

  progress: PropTypes.number,
};

StatisticCard.defaultProps = {
  color: "primary",
  progress: undefined,
};

//======================================================
// ReviewStatistics PropTypes
//======================================================

ReviewStatistics.propTypes = {
  statistics: PropTypes.shape({
    totalReviews: PropTypes.number,
    averageRating: PropTypes.number,

    pendingReviews: PropTypes.number,
    approvedReviews: PropTypes.number,
    rejectedReviews: PropTypes.number,

    fiveStarReviews: PropTypes.number,

    verifiedBuyerReviews: PropTypes.number,
    reviewsWithImages: PropTypes.number,
  }),
};

//======================================================
// Default Props
//======================================================

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

//======================================================
// Export
//======================================================

export default ReviewStatistics;