import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

import ReviewToolbar from "./ReviewToolbar";
import ReviewStatistics from "./ReviewStatistics";
import ReviewSearch from "./ReviewSearch";
import ReviewTable from "./ReviewTable";
import ReviewPagination from "./ReviewPagination";
import ReviewView from "./ReviewView";
import ReviewCard from "./ReviewCard";

import ReviewService from "./ReviewService";
//======================================================
// ReviewList Component
//======================================================

const ReviewList = () => {

  //====================================================
  // Data
  //====================================================

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  //====================================================
  // Pagination
  //====================================================

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  //====================================================
  // Selection
  //====================================================

  const [selectedRows, setSelectedRows] =
    useState([]);

  //====================================================
  // Filters
  //====================================================

  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    rating: "All",
    marketplace: "All",
    verifiedBuyer: "All",
  });

  //====================================================
  // Statistics
  //====================================================

  const [statistics, setStatistics] =
    useState({
      totalReviews: 0,
      averageRating: 0,

      pendingReviews: 0,
      approvedReviews: 0,
      rejectedReviews: 0,

      fiveStarReviews: 0,

      verifiedBuyerReviews: 0,
      reviewsWithImages: 0,
    });

  //====================================================
  // Review View Dialog
  //====================================================

  const [viewOpen, setViewOpen] =
    useState(false);

  const [selectedReview, setSelectedReview] =
    useState(null);

  //====================================================
  // Snackbar
  //====================================================

  const [snackbar, setSnackbar] =
    useState({
      open: false,
      severity: "success",
      message: "",
    });

  //====================================================
  // Filter Handler
  //====================================================

  const handleFilterChange = (
    name,
    value
  ) => {

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  //====================================================
  // Selection Handler
  //====================================================

  const handleSelectionChange = (
    selection
  ) => {

    setSelectedRows(selection);

  };

  //====================================================
  // Pagination Handlers
  //====================================================

  const handlePageChange = (
    newPage
  ) => {

    setPage(newPage);

  };

  const handlePageSizeChange = (
    newSize
  ) => {

    setPageSize(newSize);
    setPage(1);

  };

  //====================================================
  // Review View
  //====================================================

  const handleView = (review) => {

    setSelectedReview(review);
    setViewOpen(true);

  };

  const handleCloseView = () => {

    setSelectedReview(null);
    setViewOpen(false);

  };

  //====================================================
  // Snackbar
  //====================================================

  const closeSnackbar = () => {

    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));

  };

  //====================================================
  // Filtered Reviews
  //====================================================

  const filteredReviews = useMemo(() => {

    let data = [...reviews];

    if (filters.search) {

      const keyword =
        filters.search.toLowerCase();

      data = data.filter((item) =>
        item.customerName
          ?.toLowerCase()
          .includes(keyword) ||

        item.productName
          ?.toLowerCase()
          .includes(keyword) ||

        item.reviewTitle
          ?.toLowerCase()
          .includes(keyword)
      );

    }

    if (filters.status !== "All") {

      data = data.filter(
        (x) => x.status === filters.status
      );

    }

    if (filters.marketplace !== "All") {

      data = data.filter(
        (x) =>
          x.marketplace ===
          filters.marketplace
      );

    }

    if (filters.verifiedBuyer !== "All") {

      data = data.filter(
        (x) =>
          filters.verifiedBuyer === "Yes"
            ? x.verifiedBuyer
            : !x.verifiedBuyer
      );

    }

    if (filters.rating !== "All") {

      const ratingValue = parseInt(
        filters.rating,
        10
      );

      if (!Number.isNaN(ratingValue)) {

        data = data.filter(
          (x) =>
            Math.floor(x.rating) ===
            ratingValue
        );

      }

    }

    return data;

  }, [reviews, filters]);
    //====================================================
  // Load Reviews
  //====================================================

  const loadReviews = async () => {

    try {

      setLoading(true);

      const response =
        await ReviewService.getReviews({
          page,
          pageSize,
          ...filters,
        });

      const rows =
        response?.data ??
        response?.items ??
        response ??
        [];

      setReviews(rows);

      setTotalItems(
        response?.totalItems ??
        rows.length
      );

    } catch (error) {

      console.error(error);

      setSnackbar({
        open: true,
        severity: "error",
        message: "Unable to load reviews.",
      });

    } finally {

      setLoading(false);

    }

  };

  //====================================================
  // Calculate Statistics
  //====================================================

  useEffect(() => {

    const totalReviews =
      filteredReviews.length;

    const approvedReviews =
      filteredReviews.filter(
        (x) => x.status === "Approved"
      ).length;

    const pendingReviews =
      filteredReviews.filter(
        (x) => x.status === "Pending"
      ).length;

    const rejectedReviews =
      filteredReviews.filter(
        (x) => x.status === "Rejected"
      ).length;

    const fiveStarReviews =
      filteredReviews.filter(
        (x) => Number(x.rating) >= 5
      ).length;

    const verifiedBuyerReviews =
      filteredReviews.filter(
        (x) => x.verifiedBuyer
      ).length;

    const reviewsWithImages =
      filteredReviews.filter(
        (x) =>
          x.reviewImages &&
          x.reviewImages.length > 0
      ).length;

    const averageRating =
      totalReviews === 0
        ? 0
        : (
            filteredReviews.reduce(
              (sum, item) =>
                sum + Number(item.rating || 0),
              0
            ) / totalReviews
          ).toFixed(1);

    setStatistics({
      totalReviews,
      averageRating: Number(averageRating),

      pendingReviews,
      approvedReviews,
      rejectedReviews,

      fiveStarReviews,

      verifiedBuyerReviews,
      reviewsWithImages,
    });

  }, [filteredReviews]);

  //====================================================
  // Initial Load
  //====================================================

  useEffect(() => {

    loadReviews();

  }, [page, pageSize]);

  //====================================================
  // Search
  //====================================================

  const handleSearch = () => {

    setPage(1);

    loadReviews();

  };

  //====================================================
  // Clear Filters
  //====================================================

  const handleClear = () => {

    setFilters({
      search: "",
      status: "All",
      rating: "All",
      marketplace: "All",
      verifiedBuyer: "All",
    });

    setPage(1);

  };

  //====================================================
  // Refresh
  //====================================================

  const handleRefresh = () => {

    loadReviews();

  };

  //====================================================
  // Review Actions
  //====================================================

  const handleApprove = async (review) => {

    try {

      await ReviewService.approveReview(
        review.reviewId
      );

      setSnackbar({
        open: true,
        severity: "success",
        message: "Review approved.",
      });

      loadReviews();

    } catch {

      setSnackbar({
        open: true,
        severity: "error",
        message: "Approval failed.",
      });

    }

  };

  const handleReject = async (review) => {

    try {

      await ReviewService.rejectReview(
        review.reviewId
      );

      setSnackbar({
        open: true,
        severity: "success",
        message: "Review rejected.",
      });

      loadReviews();

    } catch {

      setSnackbar({
        open: true,
        severity: "error",
        message: "Reject failed.",
      });

    }

  };

  const handleDelete = async (review) => {

    try {

      await ReviewService.deleteReview(
        review.reviewId
      );

      setSnackbar({
        open: true,
        severity: "success",
        message: "Review deleted.",
      });

      loadReviews();

    } catch {

      setSnackbar({
        open: true,
        severity: "error",
        message: "Delete failed.",
      });

    }

  };

  const handleReply = (review) => {

    console.log(
      "Reply Review:",
      review
    );

    // TODO:
    // Open Reply Dialog

  };
    //====================================================
  // JSX
  //====================================================

  return (
    <Box sx={{ p: 3 }}>

      {/*==============================================
          Toolbar
      ==============================================*/}

      <ReviewToolbar
        searchText={filters.search}
        onSearchChange={(value) =>
          handleFilterChange("search", value)
        }

        selectedRows={selectedRows}
        loading={loading}

        onRefresh={handleRefresh}

        onApproveSelected={() => {}}
        onRejectSelected={() => {}}
        onDeleteSelected={() => {}}

        onExportExcel={() =>
          console.log("Export Excel")
        }

        onExportPdf={() =>
          console.log("Export PDF")
        }

        onPrint={() =>
          window.print()
        }
      />

      {/*==============================================
          Statistics
      ==============================================*/}

      <ReviewStatistics
        statistics={statistics}
      />

      {/*==============================================
          Search Filters
      ==============================================*/}

      <ReviewSearch
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onClear={handleClear}
      />

      {/*==============================================
          Loading
      ==============================================*/}

      {loading ? (

        <Box
          sx={{
            py: 8,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>

      ) : (

        <>
          {/*==========================================
              Review Table
          ==========================================*/}

          <ReviewTable
            rows={filteredReviews}
            loading={loading}
            selectedRows={selectedRows}
            onSelectionChange={
              handleSelectionChange
            }

            onView={handleView}
            onReply={handleReply}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
          />

          {/*==========================================
              Empty State
          ==========================================*/}

          {!filteredReviews.length && (

            <Box
              sx={{
                py: 6,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              No reviews found.
            </Box>

          )}

          {/*==========================================
              Pagination
          ==========================================*/}

          <ReviewPagination
            page={page}
            pageSize={pageSize}
            totalItems={totalItems}

            onPageChange={handlePageChange}
            onPageSizeChange={
              handlePageSizeChange
            }
          />

        </>
      )}

      {/*==============================================
          Review View Dialog
      ==============================================*/}

      <ReviewView
        open={viewOpen}
        review={selectedReview}

        onClose={handleCloseView}

        onReply={handleReply}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
      />

      {/*==============================================
          Snackbar
      ==============================================*/}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={closeSnackbar}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default ReviewList;