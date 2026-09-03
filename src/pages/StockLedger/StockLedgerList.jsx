// =========================================================
// StockLedgerList.jsx
//
// React
//   ↓
// Axios
//   ↓
// Node server.js :5000
//   ↓
// ASP.NET Core :7203
// =========================================================

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
    // Fetches ALL records at once.
    // =====================================================

    const loadStockLedgers = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${STOCK_LEDGER_API}/all`
            );

            console.log(
                "Stock Ledger Response:",
                response.data
            );

            const data = response.data;

            let items = [];

            if (Array.isArray(data)) {

                items = data;

            }
            else if (
                Array.isArray(data?.items)
            ) {

                items = data.items;

            }
            else if (
                Array.isArray(data?.data)
            ) {

                items = data.data;

            }

            setLedgers(items);

            // Reset to first page after reload
            setPage(1);

        }
        catch (error) {

            console.error(
                "Stock Ledger Load Error:",
                error
            );

            setLedgers([]);

            setSnackbar({
                open: true,
                message:
                    error?.response?.data?.message ||
                    "Failed to load stock ledger data.",
                severity: "error"
            });

        }
        finally {

            setLoading(false);

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
                    item.StockLedgerId ?? ""
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    item.SellerId ?? ""
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    item.CustomerId ?? ""
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    item.ProductId ?? ""
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    item.WarehouseId ?? ""
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    item.TransactionType ?? ""
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    item.ReferenceNumber ?? ""
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    item.Remarks ?? ""
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
    //
    // Pagination happens in React.
    // Backend already returned ALL records.
    // =====================================================

    const totalRecords =
        filteredLedgers.length;


    const totalPages =
        Math.ceil(
            totalRecords / pageSize
        );


    const paginatedLedgers =
        filteredLedgers.slice(
            (page - 1) * pageSize,
            page * pageSize
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
    // POST /api/stock-ledgers
    // PUT  /api/stock-ledgers/{id}
    // =====================================================

    const handleSave = async (data) => {

        try {

            if (data.StockLedgerId) {

                await axios.put(
                    `${STOCK_LEDGER_API}/${data.StockLedgerId}`,
                    data
                );

                setSnackbar({
                    open: true,
                    message:
                        "Stock Ledger updated successfully.",
                    severity: "success"
                });

            }
            else {

                await axios.post(
                    STOCK_LEDGER_API,
                    data
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
                    "Save failed.",
                severity: "error"
            });

        }

    };


    // =====================================================
    // DELETE
    //
    // DELETE /api/stock-ledgers/{id}
    // =====================================================

    const handleDeleted = async (id) => {

        try {

            await axios.delete(
                `${STOCK_LEDGER_API}/${id}`
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
                    "Delete failed.",
                severity: "error"
            });

        }

    };


    // =====================================================
    // REFRESH
    // =====================================================

    const handleRefresh = () => {

        loadStockLedgers();

    };


    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handlePageChange = (newPage) => {

        setPage(newPage);

    };


    // =====================================================
    // PAGE SIZE
    // =====================================================

    const handlePageSizeChange = (size) => {

        setPageSize(size);

        setPage(1);

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
                                    item.Quantity || 0
                                ),
                            0
                        ),

                    totalBalance:
                        ledgers.reduce(
                            (sum, item) =>
                                sum +
                                Number(
                                    item.BalanceQuantity || 0
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
                        alignItems: "center"
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
                        page={page}
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
