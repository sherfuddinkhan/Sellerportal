import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import axios from "axios";

import {
    Alert,
    Box,
    CircularProgress,
    Snackbar
} from "@mui/material";

import StockLedgerToolbar from "./StockLedgerToolbar";
import StockLedgerStatistics from "./StockLedgerStatistics";
import StockLedgerSearch from "./StockLedgerSearch";
import StockLedgerTable from "./StockLedgerTable";
import StockLedgerPagination from "./StockLedgerPagination";
import StockLedgerModal from "./StockLedgerModal";
import StockLedgerView from "./StockLedgerView";
import DeleteStockLedgerDialog from "./DeleteStockLedgerDialog";

// =========================================================
// NODE SERVER
// =========================================================

const SERVER_URL = "http://localhost:5000";

const STOCK_LEDGER_API =
    `${SERVER_URL}/api/stock-ledgers`;

// =========================================================
// COMPONENT
// =========================================================

const StockLedgerList = () => {

    // =====================================================
    // STATE
    // =====================================================

    const [ledgers, setLedgers] = useState([]);

    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [page, setPage] = useState(1);

    const [pageSize, setPageSize] = useState(10);

    const [selectedLedger, setSelectedLedger] =
        useState(null);

    const [modalOpen, setModalOpen] =
        useState(false);

    const [viewOpen, setViewOpen] =
        useState(false);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    // =====================================================
    // LOAD ALL STOCK LEDGERS
    //
    // GET
    // /api/stock-ledgers/all
    //
    // React
    //   ↓
    // Node :5000
    //   ↓
    // ASP.NET :7203
    // =====================================================

    const loadStockLedgers = async () => {

        console.log(
            "========================================"
        );

        console.log(
            "STOCK LEDGER LOAD START"
        );

        try {

            setLoading(true);

            console.log(
                "Calling:",
                `${STOCK_LEDGER_API}/all`
            );

            const response = await axios.get(
                `${STOCK_LEDGER_API}/all`,
                {
                    timeout: 15000
                }
            );

            console.log(
                "Stock Ledger Response:",
                response
            );

            console.log(
                "Stock Ledger Response Data:",
                response.data
            );

            const data = response.data;

            let items = [];

            // =================================================
            // RESPONSE FORMAT 1
            // Array
            // =================================================

            if (Array.isArray(data)) {

                items = data;

            }

            // =================================================
            // RESPONSE FORMAT 2
            // { items: [] }
            // =================================================

            else if (
                Array.isArray(data?.items)
            ) {

                items = data.items;

            }

            // =================================================
            // RESPONSE FORMAT 3
            // { data: [] }
            // =================================================

            else if (
                Array.isArray(data?.data)
            ) {

                items = data.data;

            }

            // =================================================
            // RESPONSE FORMAT 4
            // { success: true, data: [] }
            // =================================================

            else if (
                Array.isArray(data?.result)
            ) {

                items = data.result;

            }

            console.log(
                "Final Stock Ledger Items:",
                items
            );

            setLedgers(items);

            // Reset pagination after loading
            setPage(1);

            console.log(
                `Loaded ${items.length} stock ledger records.`
            );

        }
        catch (error) {

            console.error(
                "========================================"
            );

            console.error(
                "STOCK LEDGER LOAD ERROR"
            );

            console.error(
                "Error:",
                error
            );

            console.error(
                "Message:",
                error?.message
            );

            console.error(
                "Status:",
                error?.response?.status
            );

            console.error(
                "Response Data:",
                error?.response?.data
            );

            console.error(
                "Request URL:",
                `${STOCK_LEDGER_API}/all`
            );

            setLedgers([]);

            let errorMessage =
                "Failed to load stock ledger data.";

            if (
                error?.code === "ECONNABORTED"
            ) {

                errorMessage =
                    "Stock Ledger request timed out. Check the Node server and ASP.NET API.";

            }
            else if (
                error?.response?.data?.message
            ) {

                errorMessage =
                    error.response.data.message;

            }
            else if (
                error?.message
            ) {

                errorMessage =
                    error.message;

            }

            setSnackbar({
                open: true,
                message: errorMessage,
                severity: "error"
            });

        }
        finally {

            console.log(
                "STOCK LEDGER LOAD FINISHED"
            );

            setLoading(false);

            console.log(
                "========================================"
            );
        }
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadStockLedgers();

    }, []);

    // =====================================================
    // SEARCH
    // =====================================================

    const filteredLedgers = useMemo(() => {

        if (!searchText.trim()) {

            return ledgers;

        }

        const search =
            searchText
                .trim()
                .toLowerCase();

        return ledgers.filter((item) => {

            return (

                String(
                    item?.StockLedgerId ??
                    item?.stockLedgerId ??
                    ""
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    item?.SellerId ??
                    item?.sellerId ??
                    ""
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    item?.CustomerId ??
                    item?.customerId ??
                    ""
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    item?.ProductId ??
                    item?.productId ??
                    ""
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    item?.WarehouseId ??
                    item?.warehouseId ??
                    ""
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    item?.TransactionType ??
                    item?.transactionType ??
                    ""
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    item?.ReferenceNumber ??
                    item?.referenceNumber ??
                    ""
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    item?.Remarks ??
                    item?.remarks ??
                    ""
                )
                    .toLowerCase()
                    .includes(search)

            );

        });

    }, [
        ledgers,
        searchText
    ]);

    // =====================================================
    // PAGINATION
    // =====================================================

    const totalRecords =
        filteredLedgers.length;

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalRecords / pageSize
            )
        );

    // Prevent invalid page
    const safePage =
        Math.min(
            Math.max(page, 1),
            totalPages
        );

    const paginatedLedgers =
        filteredLedgers.slice(
            (safePage - 1) * pageSize,
            safePage * pageSize
        );

    // =====================================================
    // ADD
    // =====================================================

    const handleAdd = () => {

        setSelectedLedger(null);

        setModalOpen(true);

    };

    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = (ledger) => {

        setSelectedLedger(ledger);

        setModalOpen(true);

    };

    // =====================================================
    // VIEW
    // =====================================================

    const handleView = (ledger) => {

        setSelectedLedger(ledger);

        setViewOpen(true);

    };

    // =====================================================
    // DELETE OPEN
    // =====================================================

    const handleDelete = (ledger) => {

        setSelectedLedger(ledger);

        setDeleteOpen(true);

    };

    // =====================================================
    // CREATE / UPDATE
    //
    // POST
    // /api/stock-ledgers
    //
    // PUT
    // /api/stock-ledgers/{id}
    // =====================================================

    const handleSave = async (data) => {

        try {

            console.log(
                "Saving Stock Ledger:",
                data
            );

            const ledgerId =
                data?.StockLedgerId ??
                data?.stockLedgerId;

            // =================================================
            // UPDATE
            // =================================================

            if (ledgerId !== undefined &&
                ledgerId !== null &&
                String(ledgerId).trim() !== "") {

                console.log(
                    "Updating Stock Ledger:",
                    ledgerId
                );

                await axios.put(
                    `${STOCK_LEDGER_API}/${encodeURIComponent(ledgerId)}`,
                    data,
                    {
                        timeout: 15000
                    }
                );

                setSnackbar({
                    open: true,
                    message:
                        "Stock Ledger updated successfully.",
                    severity: "success"
                });

            }

            // =================================================
            // CREATE
            // =================================================

            else {

                console.log(
                    "Creating Stock Ledger"
                );

                await axios.post(
                    STOCK_LEDGER_API,
                    data,
                    {
                        timeout: 15000
                    }
                );

                setSnackbar({
                    open: true,
                    message:
                        "Stock Ledger created successfully.",
                    severity: "success"
                });

            }

            setModalOpen(false);

            setSelectedLedger(null);

            await loadStockLedgers();

        }
        catch (error) {

            console.error(
                "Stock Ledger Save Error:",
                error
            );

            setSnackbar({
                open: true,
                message:
                    error?.response?.data?.message ||
                    error?.message ||
                    "Save failed.",
                severity: "error"
            });

        }

    };

    // =====================================================
    // DELETE
    //
    // DELETE
    // /api/stock-ledgers/{id}
    // =====================================================

    const handleDeleted = async (id) => {

        try {

            console.log(
                "Deleting Stock Ledger:",
                id
            );

            await axios.delete(
                `${STOCK_LEDGER_API}/${encodeURIComponent(id)}`,
                {
                    timeout: 15000
                }
            );

            setSnackbar({
                open: true,
                message:
                    "Stock Ledger deleted successfully.",
                severity: "success"
            });

            setDeleteOpen(false);

            setSelectedLedger(null);

            await loadStockLedgers();

        }
        catch (error) {

            console.error(
                "Stock Ledger Delete Error:",
                error
            );

            setSnackbar({
                open: true,
                message:
                    error?.response?.data?.message ||
                    error?.message ||
                    "Delete failed.",
                severity: "error"
            });

        }

    };

    // =====================================================
    // REFRESH
    // =====================================================

    const handleRefresh = () => {

        if (!loading) {

            loadStockLedgers();

        }

    };

    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handlePageChange = (newPage) => {

        const numericPage =
            Number(newPage);

        if (
            Number.isFinite(numericPage)
        ) {

            setPage(
                Math.min(
                    Math.max(
                        numericPage,
                        1
                    ),
                    totalPages
                )
            );

        }

    };

    // =====================================================
    // PAGE SIZE
    // =====================================================

    const handlePageSizeChange = (size) => {

        const numericSize =
            Number(size);

        if (
            Number.isFinite(numericSize) &&
            numericSize > 0
        ) {

            setPageSize(numericSize);

            setPage(1);

        }

    };

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box
            className="stock-ledger-container"
            sx={{
                width: "100%",
                maxWidth: "100%",
                minWidth: 0
            }}
        >

            {/* =================================================
                TOOLBAR
            ================================================= */}

            <StockLedgerToolbar
                onAdd={handleAdd}
                onRefresh={handleRefresh}
            />

            {/* =================================================
                STATISTICS
            ================================================= */}

            <StockLedgerStatistics
                statistics={{
                    totalTransactions:
                        ledgers.length,

                    totalQuantity:
                        ledgers.reduce(
                            (sum, item) =>
                                sum +
                                Number(
                                    item?.Quantity ??
                                    item?.quantity ??
                                    0
                                ),
                            0
                        ),

                    totalBalance:
                        ledgers.reduce(
                            (sum, item) =>
                                sum +
                                Number(
                                    item?.BalanceQuantity ??
                                    item?.balanceQuantity ??
                                    0
                                ),
                            0
                        )
                }}
            />

            {/* =================================================
                SEARCH
            ================================================= */}

            <StockLedgerSearch
                searchText={searchText}
                setSearchText={(value) => {

                    setPage(1);

                    setSearchText(value);

                }}
            />

            {/* =================================================
                TABLE
            ================================================= */}

            {loading ? (

                <Box
                    sx={{
                        minHeight: 300,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        gap: 2
                    }}
                >

                    <CircularProgress />

                </Box>

            ) : (

                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "100%",
                        minWidth: 0,
                        overflowX: "auto"
                    }}
                >

                    <StockLedgerTable
                        items={paginatedLedgers}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                </Box>

            )}

            {/* =================================================
                PAGINATION
            ================================================= */}

            {!loading &&
                totalRecords > 0 && (

                    <StockLedgerPagination
                        page={safePage}
                        totalPages={totalPages}
                        pageSize={pageSize}
                        totalRecords={totalRecords}
                        onPageChange={
                            handlePageChange
                        }
                        onPageSizeChange={
                            handlePageSizeChange
                        }
                    />

                )}

            {/* =================================================
                CREATE / EDIT MODAL
            ================================================= */}

            <StockLedgerModal
                open={modalOpen}
                ledger={selectedLedger}
                onClose={() => {

                    setModalOpen(false);

                    setSelectedLedger(null);

                }}
                onSave={handleSave}
            />

            {/* =================================================
                VIEW
            ================================================= */}

            <StockLedgerView
                open={viewOpen}
                ledger={selectedLedger}
                onClose={() => {

                    setViewOpen(false);

                    setSelectedLedger(null);

                }}
            />

            {/* =================================================
                DELETE
            ================================================= */}

            <DeleteStockLedgerDialog
                open={deleteOpen}
                ledger={selectedLedger}
                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedLedger(null);

                }}
                onDeleted={handleDeleted}
            />

            {/* =================================================
                SNACKBAR
            ================================================= */}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => {

                    setSnackbar((previous) => ({
                        ...previous,
                        open: false
                    }));

                }}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >

                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    onClose={() => {

                        setSnackbar((previous) => ({
                            ...previous,
                            open: false
                        }));

                    }}
                >

                    {snackbar.message}

                </Alert>

            </Snackbar>

        </Box>

    );

};

export default StockLedgerList;
