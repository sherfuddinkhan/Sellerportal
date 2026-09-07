import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Box,
    CircularProgress,
    Alert,
    Snackbar
} from "@mui/material";

import axios from "axios";

import MarketplaceReturnToolbar
    from "./MarketplaceReturnToolbar";

import MarketplaceReturnStatistics
    from "./MarketplaceReturnStatistics";

import MarketplaceReturnSearch
    from "./MarketplaceReturnSearch";

import MarketplaceReturnTable
    from "./MarketplaceReturnTable";

import MarketplaceReturnPagination
    from "./MarketplaceReturnPagination";

import MarketplaceReturnModal
    from "./MarketplaceReturnModal";

import MarketplaceReturnView
    from "./MarketplaceReturnView";

import DeleteMarketplaceReturnDialog
    from "./DeleteMarketplaceReturnDialog";


// ==========================================================
// SERVER CONFIGURATION
// ==========================================================

const SERVER_URL = "http://localhost:5000";

const API_URL =
    `${SERVER_URL}/api/marketplace-returns`;


// ==========================================================
// COMPONENT
// ==========================================================

const MarketplaceReturnList = () => {

    // ==========================================================
    // STATE
    // ==========================================================

    const [
        marketplaceReturns,
        setMarketplaceReturns
    ] = useState([]);

    const [loading, setLoading] =
        useState(false);

    const [searchText, setSearchText] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [pageSize, setPageSize] =
        useState(10);

    const [
        selectedMarketplaceReturn,
        setSelectedMarketplaceReturn
    ] = useState(null);

    const [modalOpen, setModalOpen] =
        useState(false);

    const [viewOpen, setViewOpen] =
        useState(false);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            message: "",
            severity: "success"
        });


    // ==========================================================
    // LOAD MARKETPLACE RETURNS
    // GET /api/marketplace-returns
    // ==========================================================

    const loadMarketplaceReturns = async () => {

        try {

            setLoading(true);

            const response =
                await axios.get(API_URL);

            console.log(
                "MARKETPLACE RETURNS RESPONSE:",
                response.data
            );

            const data = response.data;

            // Handle normal array response
            if (Array.isArray(data)) {

                setMarketplaceReturns(data);

            }

            // Handle { items: [] }
            else if (Array.isArray(data?.items)) {

                setMarketplaceReturns(
                    data.items
                );

            }

            // Handle { data: [] }
            else if (Array.isArray(data?.data)) {

                setMarketplaceReturns(
                    data.data
                );

            }

            else {

                setMarketplaceReturns([]);

            }

        }
        catch (error) {

            console.error(
                "MARKETPLACE RETURN LOAD ERROR:",
                error
            );

            console.error(
                "SERVER RESPONSE:",
                error.response?.data
            );

            setMarketplaceReturns([]);

            setSnackbar({

                open: true,

                message:
                    error.response?.data?.message ||
                    "Failed to load Marketplace Returns.",

                severity: "error"

            });

        }
        finally {

            setLoading(false);

        }

    };


    // ==========================================================
    // INITIAL LOAD
    // ==========================================================

    useEffect(() => {

        loadMarketplaceReturns();

    }, []);


    // ==========================================================
    // SEARCH FILTER
    // ==========================================================

    const filteredMarketplaceReturns =
        useMemo(() => {

            if (!searchText.trim()) {

                return marketplaceReturns;

            }

            const search =
                searchText
                    .toLowerCase()
                    .trim();

            return marketplaceReturns.filter(
                (item) => {

                    return (

                        String(
                            item.MarketplaceReturnId ?? ""
                        )
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(
                            item.MarketplaceOrderItemId ?? ""
                        )
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(
                            item.ReturnNumber ?? ""
                        )
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(
                            item.ReturnReason ?? ""
                        )
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(
                            item.ReturnStatus ?? ""
                        )
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(
                            item.QuantityReturned ?? ""
                        )
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(
                            item.RefundAmount ?? ""
                        )
                            .toLowerCase()
                            .includes(search)

                    );

                }
            );

        }, [
            marketplaceReturns,
            searchText
        ]);


    // ==========================================================
    // STATISTICS
    // ==========================================================

    const statistics =
        useMemo(() => {

            return {

                totalReturns:
                    marketplaceReturns.length,

                totalRefundAmount:
                    marketplaceReturns.reduce(
                        (sum, item) =>
                            sum +
                            Number(
                                item.RefundAmount || 0
                            ),
                        0
                    ),

                completedReturns:
                    marketplaceReturns.filter(
                        (item) =>
                            String(
                                item.ReturnStatus || ""
                            )
                                .toLowerCase() ===
                            "completed"
                    ).length,

                pendingReturns:
                    marketplaceReturns.filter(
                        (item) =>
                            String(
                                item.ReturnStatus || ""
                            )
                                .toLowerCase() ===
                            "pending"
                    ).length

            };

        }, [
            marketplaceReturns
        ]);


    // ==========================================================
    // PAGINATION
    // ==========================================================

    const totalRecords =
        filteredMarketplaceReturns.length;

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalRecords / pageSize
            )
        );

    const paginatedMarketplaceReturns =
        filteredMarketplaceReturns.slice(
            (page - 1) * pageSize,
            page * pageSize
        );


    // ==========================================================
    // ADD
    // ==========================================================

    const handleAdd = () => {

        setSelectedMarketplaceReturn(null);

        setModalOpen(true);

    };


    // ==========================================================
    // EDIT
    // ==========================================================

    const handleEdit = (
        marketplaceReturn
    ) => {

        setSelectedMarketplaceReturn(
            marketplaceReturn
        );

        setModalOpen(true);

    };


    // ==========================================================
    // VIEW
    // ==========================================================

    const handleView = (
        marketplaceReturn
    ) => {

        setSelectedMarketplaceReturn(
            marketplaceReturn
        );

        setViewOpen(true);

    };


    // ==========================================================
    // DELETE
    // ==========================================================

    const handleDelete = (
        marketplaceReturn
    ) => {

        setSelectedMarketplaceReturn(
            marketplaceReturn
        );

        setDeleteOpen(true);

    };


    // ==========================================================
    // SAVE
    // CREATE / UPDATE
    // ==========================================================

    const handleSave = async (data) => {

        try {

            const id =
                data.MarketplaceReturnId;


            // --------------------------------------------------
            // UPDATE
            // --------------------------------------------------

            if (id) {

                await axios.put(
                    `${API_URL}/${id}`,
                    data,
                    {
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );

                setSnackbar({

                    open: true,

                    message:
                        "Marketplace Return updated successfully.",

                    severity: "success"

                });

            }


            // --------------------------------------------------
            // CREATE
            // --------------------------------------------------

            else {

                await axios.post(
                    API_URL,
                    data,
                    {
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );

                setSnackbar({

                    open: true,

                    message:
                        "Marketplace Return created successfully.",

                    severity: "success"

                });

            }


            // --------------------------------------------------
            // CLOSE MODAL
            // --------------------------------------------------

            setModalOpen(false);

            setSelectedMarketplaceReturn(
                null
            );


            // --------------------------------------------------
            // RELOAD
            // --------------------------------------------------

            await loadMarketplaceReturns();

        }
        catch (error) {

            console.error(
                "SAVE MARKETPLACE RETURN ERROR:",
                error
            );

            console.error(
                "SERVER RESPONSE:",
                error.response?.data
            );

            setSnackbar({

                open: true,

                message:
                    error.response?.data?.message ||
                    "Failed to save Marketplace Return.",

                severity: "error"

            });

        }

    };


    // ==========================================================
    // DELETE CONFIRM
    // ==========================================================

    const handleDeleted = async (id) => {

        try {

            await axios.delete(
                `${API_URL}/${id}`
            );

            setSnackbar({

                open: true,

                message:
                    "Marketplace Return deleted successfully.",

                severity: "success"

            });

            setDeleteOpen(false);

            setSelectedMarketplaceReturn(
                null
            );

            await loadMarketplaceReturns();

        }
        catch (error) {

            console.error(
                "DELETE MARKETPLACE RETURN ERROR:",
                error
            );

            console.error(
                "SERVER RESPONSE:",
                error.response?.data
            );

            setSnackbar({

                open: true,

                message:
                    error.response?.data?.message ||
                    "Failed to delete Marketplace Return.",

                severity: "error"

            });

        }

    };


    // ==========================================================
    // REFRESH
    // ==========================================================

    const handleRefresh = () => {

        loadMarketplaceReturns();

    };


    // ==========================================================
    // SEARCH CHANGE
    // ==========================================================

    const handleSearchChange = (
        value
    ) => {

        setPage(1);

        setSearchText(value);

    };


    // ==========================================================
    // PAGE SIZE CHANGE
    // ==========================================================

    const handlePageSizeChange = (
        size
    ) => {

        setPageSize(size);

        setPage(1);

    };


    // ==========================================================
    // SNACKBAR CLOSE
    // ==========================================================

    const handleSnackbarClose = () => {

        setSnackbar(
            (previous) => ({
                ...previous,
                open: false
            })
        );

    };


    // ==========================================================
    // RETURN UI
    // ==========================================================

    return (

        <Box
            className="marketplace-return-container"
        >

            {/* =================================================
                TOOLBAR
            ================================================= */}

            <MarketplaceReturnToolbar
                onAdd={handleAdd}
                onRefresh={handleRefresh}
            />


            {/* =================================================
                STATISTICS
            ================================================= */}

            <MarketplaceReturnStatistics
                statistics={statistics}
            />


            {/* =================================================
                SEARCH
            ================================================= */}

            <MarketplaceReturnSearch
                searchText={searchText}
                setSearchText={
                    handleSearchChange
                }
            />


            {/* =================================================
                TABLE / LOADING
            ================================================= */}

            {loading ? (

                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    mt={5}
                    minHeight={200}
                >

                    <CircularProgress />

                </Box>

            ) : (

                <MarketplaceReturnTable
                    marketplaceReturns={
                        paginatedMarketplaceReturns
                    }
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

            )}


            {/* =================================================
                PAGINATION
            ================================================= */}

            <MarketplaceReturnPagination
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalRecords={totalRecords}
                onPageChange={setPage}
                onPageSizeChange={
                    handlePageSizeChange
                }
            />


            {/* =================================================
                CREATE / EDIT MODAL
            ================================================= */}

            <MarketplaceReturnModal
                open={modalOpen}
                marketplaceReturn={
                    selectedMarketplaceReturn
                }
                onClose={() => {

                    setModalOpen(false);

                    setSelectedMarketplaceReturn(
                        null
                    );

                }}
                onSave={handleSave}
            />


            {/* =================================================
                VIEW
            ================================================= */}

            <MarketplaceReturnView
                open={viewOpen}
                marketplaceReturn={
                    selectedMarketplaceReturn
                }
                onClose={() => {

                    setViewOpen(false);

                    setSelectedMarketplaceReturn(
                        null
                    );

                }}
            />


            {/* =================================================
                DELETE
            ================================================= */}

            <DeleteMarketplaceReturnDialog
                open={deleteOpen}
                marketplaceReturn={
                    selectedMarketplaceReturn
                }
                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedMarketplaceReturn(
                        null
                    );

                }}
                onDeleted={handleDeleted}
            />


            {/* =================================================
                SNACKBAR
            ================================================= */}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={
                    handleSnackbarClose
                }
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                }}
            >

                <Alert
                    severity={
                        snackbar.severity
                    }
                    variant="filled"
                    onClose={
                        handleSnackbarClose
                    }
                >

                    {snackbar.message}

                </Alert>

            </Snackbar>

        </Box>

    );

};

export default MarketplaceReturnList;
