// ============================================================
// GoodsReceiptNoteItemList.jsx
// ============================================================

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


// ============================================================
// GOODS RECEIPT NOTE ITEM COMPONENTS
// ============================================================

import GoodsReceiptNoteItemToolbar
    from "./GoodsReceiptNoteItemToolbar";

import GoodsReceiptNoteItemStatistics
    from "./GoodsReceiptNoteItemStatistics";

import GoodsReceiptNoteItemSearch
    from "./GoodsReceiptNoteItemSearch";

import GoodsReceiptNoteItemTable
    from "./GoodsReceiptNoteItemTable";

import GoodsReceiptNoteItemPagination
    from "./GoodsReceiptNoteItemPagination";

import GoodsReceiptNoteItemModal
    from "./GoodsReceiptNoteItemModal";

import GoodsReceiptNoteItemView
    from "./GoodsReceiptNoteItemView";

import DeleteGoodsReceiptNoteItemDialog
    from "./DeleteGoodsReceiptNoteItemDialog";


// ============================================================
// NODE SERVER
// ============================================================

const SERVER_URL =
    "http://localhost:5000";


// ============================================================
// GOODS RECEIPT NOTE ITEM API
// ============================================================

const API_URL =
    `${SERVER_URL}/api/goods-receipt-note-items`;


// ============================================================
// COMPONENT
// ============================================================

const GoodsReceiptNoteItemList = () => {

    // ========================================================
    // STATE
    // ========================================================

    const [items, setItems] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [searchText, setSearchText] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [pageSize, setPageSize] =
        useState(10);

    const [selectedItem, setSelectedItem] =
        useState(null);

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


    // ========================================================
    // LOAD ALL GNI ITEMS
    //
    // NODE:
    // GET /api/goods-receipt-note-items
    //
    // .NET:
    // GET /api/GoodsReceiptItems
    // ========================================================

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
                "NODE URL:",
                API_URL
            );

            const response =
                await axios.get(
                    API_URL
                );

            console.log(
                "GNI RESPONSE STATUS:",
                response.status
            );

            console.log(
                "GNI RESPONSE DATA:",
                response.data
            );

            let data = [];

            if (
                Array.isArray(
                    response.data
                )
            ) {

                data =
                    response.data;

            }
            else if (
                Array.isArray(
                    response.data?.data
                )
            ) {

                data =
                    response.data.data;

            }
            else if (
                Array.isArray(
                    response.data?.items
                )
            ) {

                data =
                    response.data.items;

            }

            console.log(
                "NORMALIZED GNI ITEMS:",
                data
            );

            console.log(
                "TOTAL GNI ITEMS:",
                data.length
            );

            setItems(data);

            setPage(1);

        }
        catch (error) {

            console.error(
                "GET ALL GNI ITEMS ERROR:",
                error
            );

            console.error(
                "ERROR STATUS:",
                error?.response?.status
            );

            console.error(
                "ERROR RESPONSE:",
                error?.response?.data
            );

            setItems([]);

            setSnackbar({
                open: true,
                message:
                    error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    "Failed to load GNI Items.",
                severity: "error"
            });

        }
        finally {

            setLoading(false);

        }

    };


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        loadGoodsReceiptNoteItems();

    }, []);


    // ========================================================
    // SEARCH
    // ========================================================

    const filteredItems =
        useMemo(() => {

            const search =
                String(
                    searchText ?? ""
                )
                    .trim()
                    .toLowerCase();

            if (!search) {

                return items;

            }

            return items.filter(
                (item) => {

                    if (!item) {

                        return false;

                    }

                    const searchableValues = [

                        // GNI ID
                        item?.goodsReceiptNoteItemId,
                        item?.GoodsReceiptNoteItemId,

                        item?.goodsReceiptItemId,
                        item?.GoodsReceiptItemId,

                        // GRN ID
                        item?.goodsReceiptNoteId,
                        item?.GoodsReceiptNoteId,

                        // PO ITEM ID
                        item?.purchaseOrderItemId,
                        item?.PurchaseOrderItemId,

                        // SELLER
                        item?.sellerId,
                        item?.SellerId,

                        // CUSTOMER
                        item?.customerId,
                        item?.CustomerId,

                        // SUPPLIER
                        item?.supplierId,
                        item?.SupplierId,

                        // PRODUCT
                        item?.productId,
                        item?.ProductId,

                        // LINE NUMBER
                        item?.lineNumber,
                        item?.LineNumber,

                        // QUANTITIES
                        item?.receivedQuantity,
                        item?.ReceivedQuantity,

                        item?.acceptedQuantity,
                        item?.AcceptedQuantity,

                        item?.rejectedQuantity,
                        item?.RejectedQuantity,

                        // PRICE
                        item?.unitPrice,
                        item?.UnitPrice,

                        // TOTAL
                        item?.totalAmount,
                        item?.TotalAmount,

                        // STATUS
                        item?.status,
                        item?.Status,

                        // REMARKS
                        item?.remarks,
                        item?.Remarks

                    ];

                    return searchableValues.some(
                        (value) =>
                            String(
                                value ?? ""
                            )
                                .trim()
                                .toLowerCase()
                                .includes(search)
                    );

                }
            );

        }, [
            items,
            searchText
        ]);


    // ========================================================
    // RESET PAGE WHEN SEARCH CHANGES
    // ========================================================

    useEffect(() => {

        setPage(1);

    }, [
        searchText
    ]);


    // ========================================================
    // PAGINATION
    // ========================================================

    const totalRecords =
        filteredItems.length;

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalRecords /
                pageSize
            )
        );

    const paginatedItems =
        filteredItems.slice(
            (page - 1) * pageSize,
            page * pageSize
        );


    // ========================================================
    // KEEP PAGE VALID
    // ========================================================

    useEffect(() => {

        if (
            page >
            totalPages
        ) {

            setPage(
                totalPages
            );

        }

    }, [
        page,
        totalPages
    ]);


    // ========================================================
    // STATISTICS
    // ========================================================

    const statistics =
        useMemo(() => {

            const totalReceived =
                items.reduce(
                    (
                        sum,
                        item
                    ) =>
                        sum +
                        Number(
                            item?.receivedQuantity ??
                            item?.ReceivedQuantity ??
                            0
                        ),
                    0
                );

            const totalAccepted =
                items.reduce(
                    (
                        sum,
                        item
                    ) =>
                        sum +
                        Number(
                            item?.acceptedQuantity ??
                            item?.AcceptedQuantity ??
                            0
                        ),
                    0
                );

            const totalRejected =
                items.reduce(
                    (
                        sum,
                        item
                    ) =>
                        sum +
                        Number(
                            item?.rejectedQuantity ??
                            item?.RejectedQuantity ??
                            0
                        ),
                    0
                );

            const totalAmount =
                items.reduce(
                    (
                        sum,
                        item
                    ) =>
                        sum +
                        Number(
                            item?.totalAmount ??
                            item?.TotalAmount ??
                            0
                        ),
                    0
                );

            return {

                totalItems:
                    items.length,

                totalReceived,

                totalAccepted,

                totalRejected,

                totalAmount

            };

        }, [
            items
        ]);


    // ========================================================
    // ADD
    // ========================================================

    const handleAdd = () => {

        setSelectedItem(null);

        setModalOpen(true);

    };


    // ========================================================
    // EDIT
    // ========================================================

    const handleEdit = (item) => {

        setSelectedItem(
            item
        );

        setModalOpen(true);

    };


    // ========================================================
    // SAVE
    // ========================================================

    const handleSave = async (
        data
    ) => {

        try {

            console.log(
                "================================================="
            );

            console.log(
                "SAVE GOODS RECEIPT NOTE ITEM"
            );

            console.log(
                "DATA:",
                data
            );


            // =================================================
            // GET ID
            // =================================================

            const rawId =
                data?.goodsReceiptNoteItemId ??
                data?.GoodsReceiptNoteItemId ??
                data?.goodsReceiptItemId ??
                data?.GoodsReceiptItemId ??
                null;

            const itemId =
                Number(rawId);


            // =================================================
            // UPDATE
            // =================================================

            if (
                Number.isInteger(
                    itemId
                ) &&
                itemId > 0
            ) {

                console.log(
                    "UPDATE GNI ITEM ID:",
                    itemId
                );

                console.log(
                    "PUT URL:",
                    `${API_URL}/${itemId}`
                );

                await axios.put(
                    `${API_URL}/${itemId}`,
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
                        "GNI Item updated successfully.",
                    severity: "success"
                });

            }

            // =================================================
            // CREATE
            // =================================================

            else {

                console.log(
                    "CREATE GNI ITEM"
                );

                console.log(
                    "POST URL:",
                    API_URL
                );

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
                        "GNI Item created successfully.",
                    severity: "success"
                });

            }


            // =================================================
            // CLOSE MODAL
            // =================================================

            setModalOpen(false);

            setSelectedItem(null);


            // =================================================
            // RELOAD
            // =================================================

            await loadGoodsReceiptNoteItems();

        }
        catch (error) {

            console.error(
                "SAVE GNI ITEM ERROR:",
                error
            );

            console.error(
                "STATUS:",
                error?.response?.status
            );

            console.error(
                "SERVER RESPONSE:",
                error?.response?.data
            );

            setSnackbar({
                open: true,
                message:
                    error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    "Failed to save GNI Item.",
                severity: "error"
            });

        }

    };


    // ========================================================
    // VIEW
    // ========================================================

    const handleView = (
        item
    ) => {

        setSelectedItem(
            item
        );

        setViewOpen(true);

    };


    // ========================================================
    // DELETE
    // ========================================================

    const handleDelete = (
        item
    ) => {

        setSelectedItem(
            item
        );

        setDeleteOpen(true);

    };


    // ========================================================
    // CONFIRM DELETE
    // ========================================================

    const confirmDelete =
        async (
            id
        ) => {

            try {

                const itemId =
                    Number(id);

                if (
                    !Number.isInteger(
                        itemId
                    ) ||
                    itemId <= 0
                ) {

                    setSnackbar({
                        open: true,
                        message:
                            "Valid GNI Item ID is required.",
                        severity: "error"
                    });

                    return;

                }

                console.log(
                    "================================================="
                );

                console.log(
                    "DELETE GNI ITEM"
                );

                console.log(
                    "ID:",
                    itemId
                );

                console.log(
                    "URL:",
                    `${API_URL}/${itemId}`
                );


                await axios.delete(
                    `${API_URL}/${itemId}`
                );


                setDeleteOpen(false);

                setSelectedItem(null);


                await loadGoodsReceiptNoteItems();


                setSnackbar({
                    open: true,
                    message:
                        "GNI Item deleted successfully.",
                    severity: "success"
                });

            }
            catch (error) {

                console.error(
                    "DELETE GNI ITEM ERROR:",
                    error
                );

                console.error(
                    "STATUS:",
                    error?.response?.status
                );

                console.error(
                    "SERVER RESPONSE:",
                    error?.response?.data
                );

                setSnackbar({
                    open: true,
                    message:
                        error?.response?.data?.message ||
                        error?.response?.data?.error ||
                        "Failed to delete GNI Item.",
                    severity: "error"
                });

            }

        };


    // ========================================================
    // PAGE CHANGE
    // ========================================================

    const handlePageChange =
        (value) => {

            const newPage =
                Number(value) || 1;

            setPage(
                newPage
            );

        };


    // ========================================================
    // PAGE SIZE CHANGE
    // ========================================================

    const handlePageSizeChange =
        (value) => {

            const newPageSize =
                Number(value) || 10;

            setPageSize(
                newPageSize
            );

            setPage(1);

        };


    // ========================================================
    // SEARCH CHANGE
    // ========================================================

    const handleSearchChange =
        (value) => {

            setSearchText(
                value ?? ""
            );

            setPage(1);

        };


    // ========================================================
    // CLOSE SNACKBAR
    // ========================================================

    const handleSnackbarClose =
        () => {

            setSnackbar(
                previous => ({
                    ...previous,
                    open: false
                })
            );

        };


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <Box
            className="
                goods-receipt-note-items-container
            "
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
                onAdd={
                    handleAdd
                }
                onRefresh={
                    loadGoodsReceiptNoteItems
                }
            />


            {/* =================================================
                STATISTICS
            ================================================= */}

            <GoodsReceiptNoteItemStatistics
                statistics={
                    statistics
                }
            />


            {/* =================================================
                SEARCH
            ================================================= */}

            <GoodsReceiptNoteItemSearch
                searchText={
                    searchText
                }
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
                        minHeight="300px"
                    >

                        <CircularProgress />

                    </Box>

                ) : (

                    <GoodsReceiptNoteItemTable
                        items={
                            paginatedItems
                        }
                        onView={
                            handleView
                        }
                        onEdit={
                            handleEdit
                        }
                        onDelete={
                            handleDelete
                        }
                    />

                )
            }


            {/* =================================================
                PAGINATION
            ================================================= */}

            <GoodsReceiptNoteItemPagination
                page={
                    page
                }
                totalPages={
                    totalPages
                }
                pageSize={
                    pageSize
                }
                totalRecords={
                    totalRecords
                }
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
                open={
                    modalOpen
                }
                item={
                    selectedItem
                }
                onClose={() => {

                    setModalOpen(false);

                    setSelectedItem(null);

                }}
                onSave={
                    handleSave
                }
            />


            {/* =================================================
                VIEW
            ================================================= */}

            <GoodsReceiptNoteItemView
                open={
                    viewOpen
                }
                item={
                    selectedItem
                }
                onClose={() => {

                    setViewOpen(false);

                    setSelectedItem(null);

                }}
            />


            {/* =================================================
                DELETE
            ================================================= */}

            <DeleteGoodsReceiptNoteItemDialog
                open={
                    deleteOpen
                }
                item={
                    selectedItem
                }
                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedItem(null);

                }}
                onDeleted={
                    confirmDelete
                }
            />


            {/* =================================================
                SNACKBAR
            ================================================= */}

            <Snackbar
                open={
                    snackbar.open
                }
                autoHideDuration={
                    3000
                }
                onClose={
                    handleSnackbarClose
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >

                <Alert
                    severity={
                        snackbar.severity
                    }
                    onClose={
                        handleSnackbarClose
                    }
                    variant="filled"
                >
                    {
                        snackbar.message
                    }
                </Alert>

            </Snackbar>

        </Box>

    );

};


export default GoodsReceiptNoteItemList;