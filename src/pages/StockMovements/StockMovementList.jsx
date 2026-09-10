import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import axios from "axios";

import {
    Alert,
    Box,
    Paper,
    Snackbar
} from "@mui/material";

import {
    useNavigate
} from "react-router-dom";

import StockMovementToolbar
    from "./StockMovementToolbar";

import StockMovementStatistics
    from "./StockMovementStatistics";

import StockMovementSearch
    from "./StockMovementSearch";

import StockMovementFilters
    from "./StockMovementFilters";

import StockMovementTable
    from "./StockMovementTable";

import StockMovementPagination
    from "./StockMovementPagination";

import StockMovementDeleteDialog
    from "./StockMovementDeleteDialog";


const SERVER_URL =
    "http://localhost:5000";


const StockMovementList = () => {

    const navigate = useNavigate();

    const [movements, setMovements] =
        useState([]);

    const [statistics, setStatistics] =
        useState(null);

    const [searchText, setSearchText] =
        useState("");

    const [movementType, setMovementType] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [limit, setLimit] =
        useState(15);

    const [total, setTotal] =
        useState(0);

    const [loading, setLoading] =
        useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] =
        useState(false);

    const [selectedMovement, setSelectedMovement] =
        useState(null);

    const [deleteLoading, setDeleteLoading] =
        useState(false);

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            message: "",
            severity: "success"
        });


    const showMessage = (
        message,
        severity = "success"
    ) => {

        setSnackbar({
            open: true,
            message,
            severity
        });

    };


    // =====================================================
    // GET ALL
    // =====================================================

    const loadAll = useCallback(
        async () => {

            try {

                setLoading(true);

                const response =
                    await axios.get(
                        `${SERVER_URL}/api/stock-movements`
                    );

                const data =
                    Array.isArray(response.data)
                        ? response.data
                        : response.data?.data ?? [];

                setMovements(data);

                setTotal(data.length);

            } catch (error) {

                console.error(
                    "GET ALL STOCK MOVEMENTS ERROR:",
                    error
                );

                showMessage(
                    "Failed to load stock movements",
                    "error"
                );

            } finally {

                setLoading(false);

            }

        },
        []
    );


    // =====================================================
    // GET STATISTICS
    // =====================================================

    const loadStatistics =
        useCallback(
            async () => {

                try {

                    const response =
                        await axios.get(
                            `${SERVER_URL}/api/stock-movements/statistics`
                        );

                    setStatistics(
                        response.data
                    );

                } catch (error) {

                    console.error(
                        "STOCK MOVEMENT STATISTICS ERROR:",
                        error
                    );

                }

            },
            []
        );


    // =====================================================
    // SEARCH
    // =====================================================

    const handleSearch =
        async () => {

            if (!searchText.trim()) {

                await loadAll();

                return;
            }

            try {

                setLoading(true);

                const response =
                    await axios.get(
                        `${SERVER_URL}/api/stock-movements/search`,
                        {
                            params: {
                                search:
                                    searchText.trim()
                            }
                        }
                    );

                const data =
                    Array.isArray(response.data)
                        ? response.data
                        : response.data?.data ?? [];

                setMovements(data);

                setTotal(data.length);

                setPage(1);

            } catch (error) {

                console.error(
                    "SEARCH STOCK MOVEMENTS ERROR:",
                    error
                );

                showMessage(
                    "Failed to search stock movements",
                    "error"
                );

            } finally {

                setLoading(false);

            }

        };


    // =====================================================
    // MOVEMENT TYPE
    // =====================================================

    const handleMovementType =
        async (type) => {

            if (!type) {

                await loadAll();

                return;
            }

            try {

                setLoading(true);

                const response =
                    await axios.get(
                        `${SERVER_URL}/api/stock-movements/movement/${encodeURIComponent(type)}`
                    );

                const data =
                    Array.isArray(response.data)
                        ? response.data
                        : response.data?.data ?? [];

                setMovements(data);

                setTotal(data.length);

                setPage(1);

            } catch (error) {

                console.error(
                    "MOVEMENT TYPE ERROR:",
                    error
                );

                showMessage(
                    "Failed to filter stock movements",
                    "error"
                );

            } finally {

                setLoading(false);

            }

        };


    useEffect(() => {

        handleMovementType(
            movementType
        );

    }, [movementType]);


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadAll();
        loadStatistics();

    }, [
        loadAll,
        loadStatistics
    ]);


    // =====================================================
    // PAGINATION
    // =====================================================

    const loadPage =
        async () => {

            try {

                setLoading(true);

                const response =
                    await axios.get(
                        `${SERVER_URL}/api/stock-movements/page`,
                        {
                            params: {
                                page,
                                limit
                            }
                        }
                    );

                const result =
                    response.data;

                const data =
                    Array.isArray(result)
                        ? result
                        : result?.data ??
                          result?.items ??
                          result?.Items ??
                          [];

                setMovements(data);

                const count =
                    result?.total ??
                    result?.Total ??
                    result?.totalCount ??
                    result?.TotalCount ??
                    data.length;

                setTotal(count);

            } catch (error) {

                console.error(
                    "PAGINATION ERROR:",
                    error
                );

                showMessage(
                    "Failed to load stock movement page",
                    "error"
                );

            } finally {

                setLoading(false);

            }

        };


    useEffect(() => {

        if (
            !searchText &&
            !movementType
        ) {

            loadPage();

        }

    }, [
        page,
        limit
    ]);


    // =====================================================
    // CLEAR SEARCH
    // =====================================================

    const handleClearSearch =
        () => {

            setSearchText("");

            setPage(1);

            loadAll();

        };


    // =====================================================
    // VIEW
    // =====================================================

    const handleView =
        (id) => {

            navigate(
                `/stock-movements/details/${id}`
            );

        };


    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit =
        (id) => {

            navigate(
                `/stock-movements/edit/${id}`
            );

        };


    // =====================================================
    // DELETE OPEN
    // =====================================================

    const handleDelete =
        (movement) => {

            setSelectedMovement(
                movement
            );

            setDeleteDialogOpen(
                true
            );

        };


    // =====================================================
    // DELETE
    // =====================================================

    const handleConfirmDelete =
        async () => {

            const id =
                selectedMovement?.stockMovementId ??
                selectedMovement?.StockMovementId;

            if (!id) {

                showMessage(
                    "Invalid stock movement ID",
                    "error"
                );

                return;
            }

            try {

                setDeleteLoading(true);

                await axios.delete(
                    `${SERVER_URL}/api/stock-movements/${id}`
                );

                showMessage(
                    "Stock movement deleted successfully"
                );

                setDeleteDialogOpen(false);

                setSelectedMovement(null);

                await loadAll();

                await loadStatistics();

            } catch (error) {

                console.error(
                    "DELETE STOCK MOVEMENT ERROR:",
                    error
                );

                showMessage(
                    error.response?.data?.message ??
                    "Failed to delete stock movement",
                    "error"
                );

            } finally {

                setDeleteLoading(false);

            }

        };


    // =====================================================
    // REFRESH
    // =====================================================

    const handleRefresh =
        async () => {

            setSearchText("");

            setMovementType("");

            setPage(1);

            await loadAll();

            await loadStatistics();

        };


    return (

        <Box sx={{ p: 2 }}>

            <StockMovementToolbar
                onCreate={() =>
                    navigate(
                        "/stock-movements/create"
                    )
                }
                onRefresh={handleRefresh}
            />

            <StockMovementStatistics
                statistics={statistics}
            />

            <Paper
                sx={{
                    p: 2,
                    mb: 2
                }}
            >

                <StockMovementSearch
                    searchText={searchText}
                    setSearchText={setSearchText}
                    onSearch={handleSearch}
                    onClear={handleClearSearch}
                />

                <StockMovementFilters
                    movementType={movementType}
                    setMovementType={setMovementType}
                />

            </Paper>

            <StockMovementTable
                movements={movements}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <StockMovementPagination
                page={page}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
                total={total}
            />

            <StockMovementDeleteDialog
                open={deleteDialogOpen}
                movement={selectedMovement}
                onClose={() =>
                    setDeleteDialogOpen(false)
                }
                onConfirm={handleConfirmDelete}
                loading={deleteLoading}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() =>
                    setSnackbar({
                        ...snackbar,
                        open: false
                    })
                }
            >

                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    onClose={() =>
                        setSnackbar({
                            ...snackbar,
                            open: false
                        })
                    }
                >
                    {snackbar.message}
                </Alert>

            </Snackbar>

        </Box>
    );
};

export default StockMovementList;