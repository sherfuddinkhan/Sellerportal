import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import axios from "axios";

import {
    Box,
    Typography,
    CircularProgress,
    Snackbar,
    Alert
} from "@mui/material";

import {
    GoodsReceiptNoteItemToolbar,
    GoodsReceiptNoteItemStatistics,
    GoodsReceiptNoteItemSearch,
    GoodsReceiptNoteItemTable,
    GoodsReceiptNoteItemPagination,
    GoodsReceiptNoteItemModal,
    GoodsReceiptNoteItemView,
    DeleteGoodsReceiptNoteItemDialog
} from "./index";


/* =========================================================
   NODE SERVER
========================================================= */

const SERVER_URL = "http://localhost:5000";


/* =========================================================
   GOODS RECEIPT NOTE ITEM API
========================================================= */

const API_URL =
    `${SERVER_URL}/api/goods-receipt-note-items`;


/* =========================================================
   COMPONENT
========================================================= */

const GoodsReceiptNoteItemList = () => {

    /* =====================================================
       STATE
    ===================================================== */

    const [items, setItems] = useState([]);

    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [page, setPage] = useState(1);

    const [pageSize, setPageSize] = useState(10);

    const [selectedItem, setSelectedItem] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);

    const [viewOpen, setViewOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });


    /* =====================================================
       LOAD ALL GRN ITEMS
    ===================================================== */

    const loadGoodsReceiptNoteItems = async () => {

        try {

            setLoading(true);

            console.log(
                "================================================="
            );

            console.log(
                "GET ALL GOODS RECEIPT NOTE ITEMS"
            );

            console.log(
                "URL:",
                API_URL
            );

            const response = await axios.get(
                API_URL
            );

            console.log(
                "GRN ITEMS RESPONSE:",
                response.data
            );

            /*
             * Handle normal array response
             */

            if (Array.isArray(response.data)) {

                setItems(response.data);

            }

            /*
             * Handle wrapped API response
             */

            else if (
                Array.isArray(response.data?.data)
            ) {

                setItems(
                    response.data.data
                );

            }

            else if (
                Array.isArray(response.data?.items)
            ) {

                setItems(
                    response.data.items
                );

            }

            else {

                setItems([]);

            }

        }

        catch (error) {

            console.error(
                "GET ALL GRN ITEMS ERROR:",
                error
            );

            console.error(
                "ERROR RESPONSE:",
                error?.response?.data
            );

            setItems([]);

            setSnackbar({
                open: true,
                message:
                    "Failed to load Goods Receipt Note Items",
                severity: "error"
            });

        }

        finally {

            setLoading(false);

        }

    };


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {

        loadGoodsReceiptNoteItems();

    }, []);


    /* =====================================================
       SEARCH
    ===================================================== */

    const filteredItems = useMemo(() => {

        if (!searchText.trim()) {

            return items;

        }

        const search =
            searchText
                .trim()
                .toLowerCase();

        return items.filter(
            (item) => {

                return (

                    String(
                        item.GoodsReceiptNoteItemId ?? ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.GoodsReceiptNoteId ?? ""
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
                        item.ProductName ?? ""
                    )
                        .toLowerCase()
                        .includes(search)

                );

            }
        );

    }, [
        items,
        searchText
    ]);


    /* =====================================================
       PAGINATION
    ===================================================== */

    const totalRecords =
        filteredItems.length;

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalRecords / pageSize
            )
        );

    const paginatedItems =
        filteredItems.slice(
            (page - 1) * pageSize,
            page * pageSize
        );


    /* =====================================================
       RESET PAGE WHEN SEARCH CHANGES
    ===================================================== */

    useEffect(() => {

        setPage(1);

    }, [searchText]);


    /* =====================================================
       KEEP PAGE VALID
    ===================================================== */

    useEffect(() => {

        if (page > totalPages) {

            setPage(totalPages);

        }

    }, [
        page,
        totalPages
    ]);


    /* =====================================================
       STATISTICS
    ===================================================== */

    const statistics = useMemo(() => {

        return {

            totalItems:
                items.length,

            totalReceived:
                items.reduce(
                    (
                        sum,
                        item
                    ) => {

                        return (
                            sum +
                            Number(
                                item.ReceivedQuantity || 0
                            )
                        );

                    },
                    0
                ),

            totalRejected:
                items.reduce(
                    (
                        sum,
                        item
                    ) => {

                        return (
                            sum +
                            Number(
                                item.RejectedQuantity || 0
                            )
                        );

                    },
                    0
                ),

            totalAmount:
                items.reduce(
                    (
                        sum,
                        item
                    ) => {

                        return (
                            sum +
                            Number(
                                item.TotalAmount || 0
                            )
                        );

                    },
                    0
                )

        };

    }, [items]);


    /* =====================================================
       ADD
    ===================================================== */

    const handleAdd = () => {

        setSelectedItem(null);

        setModalOpen(true);

    };


    /* =====================================================
       EDIT
    ===================================================== */

    const handleEdit = (item) => {

        setSelectedItem(item);

        setModalOpen(true);

    };


    /* =====================================================
       SAVE
    ===================================================== */

    const handleSave = async (data) => {

        try {

            console.log(
                "SAVE GRN ITEM:",
                data
            );


            /* =============================================
               UPDATE
            ============================================= */

            if (
                data.GoodsReceiptNoteItemId
            ) {

                const id =
                    data.GoodsReceiptNoteItemId;


                await axios.put(
                    `${API_URL}/${id}`,
                    data
                );


                setSnackbar({
                    open: true,
                    message:
                        "GRN Item updated successfully",
                    severity: "success"
                });

            }


            /* =============================================
               CREATE
            ============================================= */

            else {

                await axios.post(
                    API_URL,
                    data
                );


                setSnackbar({
                    open: true,
                    message:
                        "GRN Item created successfully",
                    severity: "success"
                });

            }


            /* =============================================
               CLOSE MODAL
            ============================================= */

            setModalOpen(false);

            setSelectedItem(null);


            /* =============================================
               RELOAD
            ============================================= */

            await loadGoodsReceiptNoteItems();

        }

        catch (error) {

            console.error(
                "SAVE GRN ITEM ERROR:",
                error
            );

            console.error(
                "SERVER RESPONSE:",
                error?.response?.data
            );

            setSnackbar({
                open: true,
                message:
                    error?.response?.data?.message ||
                    "Failed to save GRN Item",
                severity: "error"
            });

        }

    };


    /* =====================================================
       VIEW
    ===================================================== */

    const handleView = (item) => {

        setSelectedItem(item);

        setViewOpen(true);

    };


    /* =====================================================
       DELETE
    ===================================================== */

    const handleDelete = (item) => {

        setSelectedItem(item);

        setDeleteOpen(true);

    };


    /* =====================================================
       CONFIRM DELETE
    ===================================================== */

    const confirmDelete = async (id) => {

        try {

            console.log(
                "DELETE GRN ITEM:",
                id
            );


            await axios.delete(
                `${API_URL}/${id}`
            );


            setSnackbar({
                open: true,
                message:
                    "GRN Item deleted successfully",
                severity: "success"
            });


            setDeleteOpen(false);

            setSelectedItem(null);


            await loadGoodsReceiptNoteItems();

        }

        catch (error) {

            console.error(
                "DELETE GRN ITEM ERROR:",
                error
            );

            console.error(
                "SERVER RESPONSE:",
                error?.response?.data
            );

            setSnackbar({
                open: true,
                message:
                    error?.response?.data?.message ||
                    "Delete failed",
                severity: "error"
            });

        }

    };


    /* =====================================================
       PAGE CHANGE
    ===================================================== */

    const handlePageChange = (
        value
    ) => {

        setPage(value);

    };


    /* =====================================================
       PAGE SIZE CHANGE
    ===================================================== */

    const handlePageSizeChange = (
        value
    ) => {

        setPageSize(value);

        setPage(1);

    };


    /* =====================================================
       SEARCH CHANGE
    ===================================================== */

    const handleSearchChange = (
        value
    ) => {

        setSearchText(value);

        setPage(1);

    };


    /* =====================================================
       SNACKBAR CLOSE
    ===================================================== */

    const handleSnackbarClose = () => {

        setSnackbar(
            (previous) => ({
                ...previous,
                open: false
            })
        );

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Box
            className="goods-receipt-note-items-container"
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <Typography
                variant="h4"
                fontWeight="bold"
                mb={3}
            >
                Goods Receipt Note Items
            </Typography>


            {/* =================================================
                TOOLBAR
            ================================================= */}

            <GoodsReceiptNoteItemToolbar
                onAdd={handleAdd}
                onRefresh={
                    loadGoodsReceiptNoteItems
                }
            />


            {/* =================================================
                STATISTICS
            ================================================= */}

            <GoodsReceiptNoteItemStatistics
                statistics={statistics}
            />


            {/* =================================================
                SEARCH
            ================================================= */}

            <GoodsReceiptNoteItemSearch
                searchText={searchText}
                setSearchText={
                    handleSearchChange
                }
            />


            {/* =================================================
                TABLE
            ================================================= */}

            {
                loading ? (

                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        mt={5}
                    >

                        <CircularProgress />

                    </Box>

                ) : (

                    <GoodsReceiptNoteItemTable
                        items={paginatedItems}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                )
            }


            {/* =================================================
                PAGINATION
            ================================================= */}

            <GoodsReceiptNoteItemPagination
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


            {/* =================================================
                CREATE / EDIT MODAL
            ================================================= */}

            <GoodsReceiptNoteItemModal
                open={modalOpen}
                item={selectedItem}
                onClose={() => {

                    setModalOpen(false);

                    setSelectedItem(null);

                }}
                onSave={handleSave}
            />


            {/* =================================================
                VIEW
            ================================================= */}

            <GoodsReceiptNoteItemView
                open={viewOpen}
                item={selectedItem}
                onClose={() => {

                    setViewOpen(false);

                    setSelectedItem(null);

                }}
            />


            {/* =================================================
                DELETE
            ================================================= */}

            <DeleteGoodsReceiptNoteItemDialog
                open={deleteOpen}
                item={selectedItem}
                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedItem(null);

                }}
                onDeleted={confirmDelete}
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
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >

                <Alert
                    onClose={
                        handleSnackbarClose
                    }
                    severity={
                        snackbar.severity
                    }
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>

            </Snackbar>

        </Box>

    );

};


export default GoodsReceiptNoteItemList;

