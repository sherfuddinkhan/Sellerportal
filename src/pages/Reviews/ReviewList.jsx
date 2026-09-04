import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import axios from "axios";

import {
    Alert,
    Box,
    CircularProgress,
    Snackbar,
} from "@mui/material";

import ReviewToolbar from "./ReviewToolbar";
import ReviewStatistics from "./ReviewStatistics";
import ReviewSearch from "./ReviewSearch";
import ReviewTable from "./ReviewTable";
import ReviewPagination from "./ReviewPagination";
import ReviewView from "./ReviewView";
import DeleteReviewDialog from "./DeleteReviewDialog";


// ======================================================
// API Configuration
// ======================================================

const SERVER_URL =
    "http://localhost:5000";


// ======================================================
// Review API Routes
// ======================================================

const REVIEW_API =
    `${SERVER_URL}/api/reviews`;


// ======================================================
// Default Filters
// ======================================================

const DEFAULT_FILTERS = {

    search: "",

    status: "All",

    rating: "All",

    marketplace: "All",

    verifiedBuyer: "All",

};


// ======================================================
// Default Statistics
// ======================================================

const DEFAULT_STATISTICS = {

    totalReviews: 0,

    averageRating: 0,

    pendingReviews: 0,

    approvedReviews: 0,

    rejectedReviews: 0,

    fiveStarReviews: 0,

    verifiedBuyerReviews: 0,

    reviewsWithImages: 0,

};


// ======================================================
// ReviewList Component
// ======================================================

const ReviewList = () => {


    // ==================================================
    // Reviews
    // ==================================================

    const [reviews, setReviews] =
        useState([]);


    const [loading, setLoading] =
        useState(false);


    // ==================================================
    // Pagination
    //
    // Pagination is now CLIENT-SIDE because
    // GET /api/reviews returns ALL reviews.
    // ==================================================

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    // ==================================================
    // Selected Rows
    // ==================================================
    const [selectedRows, setSelectedRows] = useState([]);
    // ==================================================
    // Filters
    // ==================================================

    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    // ==================================================
    // Statistics
    // ==================================================

    const [statistics, setStatistics] = useState(DEFAULT_STATISTICS);


    // ==================================================
    // Review View
    // ==================================================

    const [viewOpen, setViewOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    // ==================================================
    // Delete Dialog
    // ==================================================
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteReview, setDeleteReview] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    // ==================================================
    // Snackbar
    // ==================================================

    const [snackbar, setSnackbar] =
        useState({

            open: false,

            severity: "success",

            message: "",

        });


    // ==================================================
    // Snackbar Helper
    // ==================================================

    const showSnackbar = useCallback(
        (
            severity,
            message
        ) => {

            setSnackbar({

                open: true,

                severity,

                message,

            });

        },
        []
    );


    // ==================================================
    // Close Snackbar
    // ==================================================

    const closeSnackbar = () => {

        setSnackbar(
            (previous) => ({

                ...previous,

                open: false,

            })
        );

    };


    // ==================================================
    // Filter Change
    // ==================================================

    const handleFilterChange = (
        name,
        value
    ) => {

        setFilters(
            (previous) => ({

                ...previous,

                [name]: value,

            })
        );


        // Reset pagination whenever
        // a filter changes.

        setPage(1);

        setSelectedRows([]);

    };


    // ==================================================
    // Selection Change
    // ==================================================

    const handleSelectionChange = (
        selection
    ) => {

        setSelectedRows(
            selection
        );

    };


    // ==================================================
    // Page Change
    // ==================================================

    const handlePageChange = (
        newPage
    ) => {

        setPage(
            Number(newPage) || 1
        );

        setSelectedRows([]);

    };


    // ==================================================
    // Page Size Change
    // ==================================================

    const handlePageSizeChange = (
        newSize
    ) => {

        setPageSize(
            Number(newSize) || 10
        );

        setPage(1);

        setSelectedRows([]);

    };


    // ==================================================
    // View Review
    // ==================================================

    const handleView = (
        review
    ) => {

        setSelectedReview(
            review
        );

        setViewOpen(true);

    };


    // ==================================================
    // Close Review View
    // ==================================================

    const handleCloseView = () => {

        setViewOpen(false);

        setSelectedReview(null);

    };


    // ==================================================
    // Open Delete Dialog
    // ==================================================

    const handleDelete = (
        review
    ) => {

        setDeleteReview(
            review
        );

        setDeleteOpen(true);

    };


    // ==================================================
    // Close Delete Dialog
    // ==================================================

    const handleCloseDelete = () => {

        if (deleteLoading) {

            return;

        }


        setDeleteOpen(false);

        setDeleteReview(null);

    };


    // ==================================================
    // LOAD ALL REVIEWS
    //
    // GET /api/reviews
    //
    // IMPORTANT:
    //
    // No page
    // No pageSize
    // No search
    // No rating
    // No status
    // No marketplace
    // No verifiedBuyer
    //
    // Backend returns ALL reviews at once.
    // ==================================================

    const loadReviews = useCallback(
        async () => {

            try {

                setLoading(true);


                // ==========================================
                // GET ALL REVIEWS
                // ==========================================

                const response =
                    await axios.get(
                        REVIEW_API
                    );


                // ==========================================
                // API Response
                // ==========================================

                const responseData =
                    response?.data;


                // ==========================================
                // Extract Rows
                //
                // Supports:
                //
                // []
                // { data: [] }
                // { reviews: [] }
                // { items: [] }
                // ==========================================

                const rows =
                    responseData?.data ??
                    responseData?.reviews ??
                    responseData?.items ??
                    responseData ??
                    [];


                // ==========================================
                // Normalize
                // ==========================================

                const normalizedRows =
                    Array.isArray(rows)
                        ? rows
                        : [];


                setReviews(
                    normalizedRows
                );


                // Reset page after reload

                setPage(1);

                setSelectedRows([]);


            } catch (error) {

                console.error(
                    "LOAD REVIEWS ERROR:",
                    error
                );


                setReviews([]);


                showSnackbar(
                    "error",
                    error?.response?.data?.message ||
                    "Unable to load reviews."
                );

            } finally {

                setLoading(false);

            }

        },
        [
            showSnackbar,
        ]
    );


    // ==================================================
    // INITIAL LOAD
    // ==================================================

    useEffect(() => {

        loadReviews();

    }, [
        loadReviews,
    ]);


    // ==================================================
    // CLIENT-SIDE FILTERING
    // ==================================================

    const filteredReviews =
        useMemo(() => {

            let data = [
                ...reviews
            ];


            // ==========================================
            // SEARCH
            // ==========================================

            if (
                filters.search?.trim()
            ) {

                const keyword =
                    filters.search
                        .trim()
                        .toLowerCase();


                data =
                    data.filter(
                        (item) => {

                            return (

                                item.customerName
                                    ?.toLowerCase()
                                    .includes(keyword)

                                ||

                                item.productName
                                    ?.toLowerCase()
                                    .includes(keyword)

                                ||

                                item.productSku
                                    ?.toLowerCase()
                                    .includes(keyword)

                                ||

                                item.reviewTitle
                                    ?.toLowerCase()
                                    .includes(keyword)

                                ||

                                item.reviewText
                                    ?.toLowerCase()
                                    .includes(keyword)

                                ||

                                item.marketplace
                                    ?.toLowerCase()
                                    .includes(keyword)

                            );

                        }
                    );

            }


            // ==========================================
            // STATUS
            // ==========================================

            if (
                filters.status !== "All"
            ) {

                data =
                    data.filter(
                        (item) => {

                            return (
                                String(
                                    item.status || ""
                                ).toLowerCase()
                                ===
                                String(
                                    filters.status
                                ).toLowerCase()
                            );

                        }
                    );

            }


            // ==========================================
            // MARKETPLACE
            // ==========================================

            if (
                filters.marketplace !==
                "All"
            ) {

                data =
                    data.filter(
                        (item) => {

                            return (
                                String(
                                    item.marketplace || ""
                                ).toLowerCase()
                                ===
                                String(
                                    filters.marketplace
                                ).toLowerCase()
                            );

                        }
                    );

            }


            // ==========================================
            // VERIFIED BUYER
            // ==========================================

            if (
                filters.verifiedBuyer !==
                "All"
            ) {

                data =
                    data.filter(
                        (item) => {

                            const verified =
                                item.verifiedBuyer === true ||
                                item.verifiedBuyer === "true" ||
                                item.verifiedBuyer === "True" ||
                                item.verifiedBuyer === "Yes" ||
                                item.verifiedBuyer === 1;


                            if (
                                filters.verifiedBuyer ===
                                "Yes"
                            ) {

                                return verified;

                            }


                            return !verified;

                        }
                    );

            }


            // ==========================================
            // RATING
            // ==========================================

            if (
                filters.rating !==
                "All"
            ) {

                const ratingValue =
                    Number(
                        filters.rating
                    );


                if (
                    Number.isFinite(
                        ratingValue
                    )
                ) {

                    data =
                        data.filter(
                            (item) => {

                                return (
                                    Math.floor(
                                        Number(
                                            item.rating || 0
                                        )
                                    ) ===
                                    ratingValue
                                );

                            }
                        );

                }

            }


            return data;

        }, [
            reviews,
            filters,
        ]);


    // ==================================================
    // TOTAL FILTERED ITEMS
    // ==================================================

    const totalItems =
        filteredReviews.length;


    // ==================================================
    // CLIENT-SIDE PAGINATION
    // ==================================================

    const paginatedReviews =
        useMemo(() => {

            const startIndex =
                (page - 1) *
                pageSize;


            const endIndex =
                startIndex +
                pageSize;


            return filteredReviews.slice(
                startIndex,
                endIndex
            );

        }, [
            filteredReviews,
            page,
            pageSize,
        ]);


    // ==================================================
    // CALCULATE STATISTICS
    // ==================================================

    useEffect(() => {

        const totalReviews =
            filteredReviews.length;


        const approvedReviews =
            filteredReviews.filter(
                (item) =>
                    String(
                        item.status || ""
                    ).toLowerCase() ===
                    "approved"
            ).length;


        const pendingReviews =
            filteredReviews.filter(
                (item) =>
                    String(
                        item.status || ""
                    ).toLowerCase() ===
                    "pending"
            ).length;


        const rejectedReviews =
            filteredReviews.filter(
                (item) =>
                    String(
                        item.status || ""
                    ).toLowerCase() ===
                    "rejected"
            ).length;


        const fiveStarReviews =
            filteredReviews.filter(
                (item) =>
                    Number(
                        item.rating || 0
                    ) >= 5
            ).length;


        const verifiedBuyerReviews =
            filteredReviews.filter(
                (item) => {

                    return (
                        item.verifiedBuyer === true ||
                        item.verifiedBuyer === "true" ||
                        item.verifiedBuyer === "True" ||
                        item.verifiedBuyer === "Yes" ||
                        item.verifiedBuyer === 1
                    );

                }
            ).length;


        const reviewsWithImages =
            filteredReviews.filter(
                (item) => {

                    return (
                        Array.isArray(
                            item.reviewImages
                        ) &&
                        item.reviewImages.length >
                        0
                    );

                }
            ).length;


        const ratingTotal =
            filteredReviews.reduce(
                (
                    sum,
                    item
                ) => {

                    return (
                        sum +
                        Number(
                            item.rating || 0
                        )
                    );

                },
                0
            );


        const averageRating =
            totalReviews === 0
                ? 0
                : Number(
                    (
                        ratingTotal /
                        totalReviews
                    ).toFixed(1)
                );


        setStatistics({

            totalReviews,

            averageRating,

            pendingReviews,

            approvedReviews,

            rejectedReviews,

            fiveStarReviews,

            verifiedBuyerReviews,

            reviewsWithImages,

        });

    }, [
        filteredReviews,
    ]);


    // ==================================================
    // SEARCH
    // ==================================================

    const handleSearch = () => {

        setPage(1);

        setSelectedRows([]);

    };


    // ==================================================
    // CLEAR FILTERS
    // ==================================================

    const handleClear = () => {

        setFilters({
            ...DEFAULT_FILTERS
        });

        setPage(1);

        setSelectedRows([]);

    };


    // ==================================================
    // REFRESH
    // ==================================================

    const handleRefresh = () => {

        loadReviews();

    };


    // ==================================================
    // APPROVE REVIEW
    // ==================================================

    const handleApprove = async (
        review
    ) => {

        if (!review?.reviewId) {

            showSnackbar(
                "error",
                "Invalid review ID."
            );

            return;

        }


        try {

            setLoading(true);


            await axios.put(
                `${REVIEW_API}/${review.reviewId}/approve`
            );


            showSnackbar(
                "success",
                "Review approved successfully."
            );


            await loadReviews();

        } catch (error) {

            console.error(
                "APPROVE REVIEW ERROR:",
                error
            );


            showSnackbar(
                "error",
                error?.response?.data?.message ||
                "Approval failed."
            );

        } finally {

            setLoading(false);

        }

    };


    // ==================================================
    // REJECT REVIEW
    // ==================================================

    const handleReject = async (
        review
    ) => {

        if (!review?.reviewId) {

            showSnackbar(
                "error",
                "Invalid review ID."
            );

            return;

        }


        try {

            setLoading(true);


            await axios.put(
                `${REVIEW_API}/${review.reviewId}/reject`
            );


            showSnackbar(
                "success",
                "Review rejected successfully."
            );


            await loadReviews();

        } catch (error) {

            console.error(
                "REJECT REVIEW ERROR:",
                error
            );


            showSnackbar(
                "error",
                error?.response?.data?.message ||
                "Reject failed."
            );

        } finally {

            setLoading(false);

        }

    };


    // ==================================================
    // DELETE REVIEW
    // ==================================================

    const handleConfirmDelete =
        async () => {

            if (
                !deleteReview?.reviewId
            ) {

                showSnackbar(
                    "error",
                    "Invalid review ID."
                );

                return;

            }


            try {

                setDeleteLoading(
                    true
                );


                await axios.delete(
                    `${REVIEW_API}/${deleteReview.reviewId}`
                );


                showSnackbar(
                    "success",
                    "Review deleted successfully."
                );


                setSelectedRows(
                    (previous) =>
                        previous.filter(
                            (id) =>
                                id !==
                                deleteReview.reviewId
                        )
                );


                setDeleteOpen(
                    false
                );


                setDeleteReview(
                    null
                );


                await loadReviews();

            } catch (error) {

                console.error(
                    "DELETE REVIEW ERROR:",
                    error
                );


                showSnackbar(
                    "error",
                    error?.response?.data?.message ||
                    "Delete failed."
                );

            } finally {

                setDeleteLoading(
                    false
                );

            }

        };


    // ==================================================
    // REPLY REVIEW
    // ==================================================

    const handleReply = (
        review
    ) => {

        console.log(
            "Reply Review:",
            review
        );

        /*
            Connect your Reply dialog here.

            Example:

            setSelectedReview(review);
            setReplyOpen(true);
        */

    };


    // ==================================================
    // APPROVE SELECTED
    // ==================================================

    const handleApproveSelected =
        async () => {

            if (
                !selectedRows.length
            ) {

                showSnackbar(
                    "warning",
                    "Please select at least one review."
                );

                return;

            }


            try {

                setLoading(true);


                for (
                    const reviewId
                    of selectedRows
                ) {

                    await axios.put(
                        `${REVIEW_API}/${reviewId}/approve`
                    );

                }


                showSnackbar(
                    "success",
                    "Selected reviews approved."
                );


                setSelectedRows([]);


                await loadReviews();

            } catch (error) {

                console.error(
                    "APPROVE SELECTED ERROR:",
                    error
                );


                showSnackbar(
                    "error",
                    error?.response?.data?.message ||
                    "Unable to approve selected reviews."
                );

            } finally {

                setLoading(false);

            }

        };


    // ==================================================
    // REJECT SELECTED
    // ==================================================

    const handleRejectSelected =
        async () => {

            if (
                !selectedRows.length
            ) {

                showSnackbar(
                    "warning",
                    "Please select at least one review."
                );

                return;

            }


            try {

                setLoading(true);


                for (
                    const reviewId
                    of selectedRows
                ) {

                    await axios.put(
                        `${REVIEW_API}/${reviewId}/reject`
                    );

                }


                showSnackbar(
                    "success",
                    "Selected reviews rejected."
                );


                setSelectedRows([]);


                await loadReviews();

            } catch (error) {

                console.error(
                    "REJECT SELECTED ERROR:",
                    error
                );


                showSnackbar(
                    "error",
                    error?.response?.data?.message ||
                    "Unable to reject selected reviews."
                );

            } finally {

                setLoading(false);

            }

        };


    // ==================================================
    // DELETE SELECTED
    // ==================================================

    const handleDeleteSelected =
        async () => {

            if (
                !selectedRows.length
            ) {

                showSnackbar(
                    "warning",
                    "Please select at least one review."
                );

                return;

            }


            try {

                setLoading(true);


                for (
                    const reviewId
                    of selectedRows
                ) {

                    await axios.delete(
                        `${REVIEW_API}/${reviewId}`
                    );

                }


                showSnackbar(
                    "success",
                    "Selected reviews deleted."
                );


                setSelectedRows([]);


                await loadReviews();

            } catch (error) {

                console.error(
                    "DELETE SELECTED ERROR:",
                    error
                );


                showSnackbar(
                    "error",
                    error?.response?.data?.message ||
                    "Unable to delete selected reviews."
                );

            } finally {

                setLoading(false);

            }

        };


    // ==================================================
    // EXPORT EXCEL
    // ==================================================

    const handleExportExcel = () => {

        console.log(
            "Export Excel",
            filteredReviews
        );

    };


    // ==================================================
    // EXPORT PDF
    // ==================================================

    const handleExportPdf = () => {

        console.log(
            "Export PDF",
            filteredReviews
        );

    };


    // ==================================================
    // PRINT
    // ==================================================

    const handlePrint = () => {

        window.print();

    };


    // ==================================================
    // JSX
    // ==================================================

    return (

        <Box
            sx={{
                p: 3,
            }}
        >

            {/* ==================================================
                Toolbar
            ================================================== */}

            <ReviewToolbar

                searchText={
                    filters.search
                }

                onSearchChange={
                    (value) =>
                        handleFilterChange(
                            "search",
                            value
                        )
                }

                selectedRows={
                    selectedRows
                }

                loading={
                    loading
                }

                onRefresh={
                    handleRefresh
                }

                onApproveSelected={
                    handleApproveSelected
                }

                onRejectSelected={
                    handleRejectSelected
                }

                onDeleteSelected={
                    handleDeleteSelected
                }

                onExportExcel={
                    handleExportExcel
                }

                onExportPdf={
                    handleExportPdf
                }

                onPrint={
                    handlePrint
                }

            />


            {/* ==================================================
                Statistics
            ================================================== */}

            <ReviewStatistics
                statistics={
                    statistics
                }
            />


            {/* ==================================================
                Search & Filters
            ================================================== */}

            <ReviewSearch

                filters={
                    filters
                }

                onFilterChange={
                    handleFilterChange
                }

                onSearch={
                    handleSearch
                }

                onClear={
                    handleClear
                }

            />


            {/* ==================================================
                Loading
            ================================================== */}

            {loading ? (

                <Box
                    sx={{
                        py: 8,

                        display:
                            "flex",

                        justifyContent:
                            "center",
                    }}
                >

                    <CircularProgress />

                </Box>

            ) : (

                <>

                    {/* ==================================================
                        Review Table
                    ================================================== */}

                    <ReviewTable

                        rows={
                            paginatedReviews
                        }

                        loading={
                            loading
                        }

                        selectedRows={
                            selectedRows
                        }

                        onSelectionChange={
                            handleSelectionChange
                        }

                        onView={
                            handleView
                        }

                        onReply={
                            handleReply
                        }

                        onApprove={
                            handleApprove
                        }

                        onReject={
                            handleReject
                        }

                        onDelete={
                            handleDelete
                        }

                    />


                    {/* ==================================================
                        Empty State
                    ================================================== */}

                    {!filteredReviews.length && (

                        <Box
                            sx={{
                                py: 6,

                                textAlign:
                                    "center",

                                color:
                                    "text.secondary",
                            }}
                        >
                            No reviews found.
                        </Box>

                    )}


                    {/* ==================================================
                        Pagination
                    ================================================== */}

                    {filteredReviews.length > 0 && (

                        <ReviewPagination

                            page={
                                page
                            }

                            pageSize={
                                pageSize
                            }

                            totalItems={
                                totalItems
                            }

                            onPageChange={
                                handlePageChange
                            }

                            onPageSizeChange={
                                handlePageSizeChange
                            }

                        />

                    )}

                </>

            )}


            {/* ==================================================
                Review View
            ================================================== */}

            <ReviewView

                open={
                    viewOpen
                }

                review={
                    selectedReview
                }

                onClose={
                    handleCloseView
                }

                onReply={
                    handleReply
                }

                onApprove={
                    handleApprove
                }

                onReject={
                    handleReject
                }

                onDelete={
                    handleDelete
                }

            />


            {/* ==================================================
                Delete Review Dialog
            ================================================== */}

            <DeleteReviewDialog

                open={
                    deleteOpen
                }

                review={
                    deleteReview
                }

                loading={
                    deleteLoading
                }

                onClose={
                    handleCloseDelete
                }

                onDelete={
                    handleConfirmDelete
                }

            />


            {/* ==================================================
                Snackbar
            ================================================== */}

            <Snackbar

                open={
                    snackbar.open
                }

                autoHideDuration={
                    3000
                }

                onClose={
                    closeSnackbar
                }

                anchorOrigin={{
                    vertical:
                        "bottom",

                    horizontal:
                        "right",
                }}

            >

                <Alert

                    severity={
                        snackbar.severity
                    }

                    variant="filled"

                    onClose={
                        closeSnackbar
                    }

                >
                    {
                        snackbar.message
                    }

                </Alert>

            </Snackbar>

        </Box>
    );
};


// ======================================================
// Export
// ======================================================

export default ReviewList;
