// =========================================================
// SellerList.jsx
// Marketplace Seller Portal
// =========================================================

import React, {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    Alert,
    Box,
    CircularProgress,
    Paper,
    Typography,
} from "@mui/material";

import {
    useNavigate,
} from "react-router-dom";

import axios from "axios";

import SellerToolbar from "./SellerToolbar";
import SellerStatistics from "./SellerStatistics";
import SellerFilters from "./SellerFilters";
import SellerTable from "./SellerTable";
import SellerPagination from "./SellerPagination";

// =========================================================
// NODE SERVER
// =========================================================

const API_URL = "http://localhost:5000/api";

// =========================================================
// COMPONENT
// =========================================================

const SellerList = () => {

    const navigate = useNavigate();

    // =====================================================
    // DATA
    // =====================================================

    const [sellers, setSellers] = useState([]);

    // =====================================================
    // FILTERS
    // =====================================================

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    // =====================================================
    // PAGINATION
    // =====================================================

    const [page, setPage] = useState(1);

    const [limit, setLimit] = useState(15);

    const [totalCount, setTotalCount] =
        useState(0);

    // =====================================================
    // UI
    // =====================================================

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    // =====================================================
    // STATISTICS
    // =====================================================

    const [statistics, setStatistics] =
        useState(null);

    // =====================================================
    // LOAD SELLERS
    // =====================================================

    const loadSellers = useCallback(
        async () => {

            try {

                setLoading(true);
                setError("");

                const params = {};

                // -----------------------------
                // SEARCH
                // -----------------------------

                if (search.trim()) {

                    params.search =
                        search.trim();
                }

                // -----------------------------
                // STATUS
                // -----------------------------

                if (
                    statusFilter &&
                    statusFilter !== "All"
                ) {

                    params.status =
                        statusFilter.toLowerCase();
                }

                // -----------------------------
                // PAGINATION
                // -----------------------------

                params.page = page;
                params.limit = limit;

                console.log(
                    "GET SELLERS:",
                    params
                );

                const response =
                    await axios.get(
                        `${API_URL}/sellers`,
                        {
                            params,
                            timeout: 30000,
                        }
                    );

                console.log(
                    "SELLERS RESPONSE:",
                    response.data
                );

                // =================================================
                // PAGED RESPONSE
                // =================================================

                if (
                    response.data &&
                    Array.isArray(
                        response.data.items
                    )
                ) {

                    setSellers(
                        response.data.items
                    );

                    setTotalCount(
                        Number(
                            response.data.totalCount
                        ) || 0
                    );

                }

                // =================================================
                // ARRAY RESPONSE
                // =================================================

                else if (
                    Array.isArray(
                        response.data
                    )
                ) {

                    setSellers(
                        response.data
                    );

                    setTotalCount(
                        response.data.length
                    );

                }

                else {

                    setSellers([]);

                    setTotalCount(0);
                }

            }
            catch (err) {

                console.error(
                    "SELLER LOAD ERROR:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Unable to load sellers."
                );

                setSellers([]);

            }
            finally {

                setLoading(false);
            }

        },
        [
            search,
            statusFilter,
            page,
            limit,
        ]
    );

    // =====================================================
    // LOAD STATISTICS
    // =====================================================

    const loadStatistics =
        useCallback(
            async () => {

                try {

                    const response =
                        await axios.get(
                            `${API_URL}/sellers/stats`,
                            {
                                timeout: 30000,
                            }
                        );

                    console.log(
                        "SELLER STATISTICS:",
                        response.data
                    );

                    setStatistics(
                        response.data
                    );

                }
                catch (err) {

                    console.error(
                        "STATISTICS ERROR:",
                        err
                    );

                }

            },
            []
        );

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadSellers();

    }, [loadSellers]);

    useEffect(() => {

        loadStatistics();

    }, [loadStatistics]);

    // =====================================================
    // SEARCH
    // =====================================================

    const handleSearch = () => {

        setPage(1);

        loadSellers();
    };

    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const handleClearFilters = () => {

        setSearch("");

        setStatusFilter("All");

        setPage(1);
    };

    // =====================================================
    // CREATE
    // =====================================================

    const handleCreate = () => {

        navigate("/sellers/create");
    };

    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = (seller) => {

        const id =
            seller.sellerId ??
            seller.SellerId;

        if (!id) {

            console.error(
                "Seller ID missing:",
                seller
            );

            return;
        }

        navigate(
            `/sellers/edit/${id}`
        );
    };

    // =====================================================
    // VIEW
    // =====================================================

    const handleView = (seller) => {

        const id =
            seller.sellerId ??
            seller.SellerId;

        if (!id) return;

        navigate(
            `/sellers/view/${id}`
        );
    };

    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (seller) => {

        const id =
            seller.sellerId ??
            seller.SellerId;

        if (!id) return;

        const confirmed =
            window.confirm(
                `Delete seller "${seller.sellerName ?? seller.SellerName}"?`
            );

        if (!confirmed) return;

        try {

            setError("");

            await axios.delete(
                `${API_URL}/sellers/${id}`,
                {
                    timeout: 30000,
                }
            );

            await loadSellers();

            await loadStatistics();

        }
        catch (err) {

            console.error(
                "DELETE SELLER ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to delete seller."
            );
        }
    };

    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handlePageChange =
        (_, value) => {

            setPage(value);
        };

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box
            sx={{
                width: "100%",
                minHeight: "100vh",
                p: {
                    xs: 2,
                    sm: 3,
                    md: 4,
                },
                boxSizing: "border-box",
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    mb: 3,
                    textAlign: "center",
                }}
            >

                <Typography
                    variant="h4"
                    fontWeight={700}
                >
                    Sellers
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{
                        mt: 0.5,
                    }}
                >
                    Manage marketplace sellers
                </Typography>

            </Box>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <SellerStatistics
                statistics={statistics}
            />


            {/* =================================================
                TOOLBAR
            ================================================= */}

            <SellerToolbar
                search={search}
                setSearch={setSearch}
                onSearch={handleSearch}
                onClear={handleClearFilters}
                onCreate={handleCreate}
            />


            {/* =================================================
                FILTERS
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                }}
            >

                <SellerFilters
                    statusFilter={statusFilter}
                    setStatusFilter={
                        (value) => {

                            setStatusFilter(value);
                            setPage(1);
                        }
                    }
                />

            </Paper>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                    }}
                >
                    {error}
                </Alert>

            )}


            {/* =================================================
                TABLE
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    width: "100%",
                    overflow: "hidden",
                    borderRadius: 3,
                }}
            >

                {loading ? (

                    <Box
                        sx={{
                            minHeight: 300,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >

                        <CircularProgress />

                    </Box>

                ) : (

                    <SellerTable
                        sellers={sellers}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                )}

            </Paper>


            {/* =================================================
                PAGINATION
            ================================================= */}

            {totalCount > 0 && (

                <SellerPagination
                    page={page}
                    limit={limit}
                    totalCount={totalCount}
                    onPageChange={
                        handlePageChange
                    }
                    onLimitChange={
                        (value) => {

                            setLimit(value);
                            setPage(1);
                        }
                    }
                />

            )}

        </Box>
    );
};

export default SellerList;
