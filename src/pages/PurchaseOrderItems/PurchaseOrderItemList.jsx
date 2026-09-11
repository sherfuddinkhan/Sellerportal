// ============================================================
// PurchaseOrderItemList.jsx
// ============================================================

import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import axios from "axios";

import {
    useNavigate
} from "react-router-dom";

import {
    Box,
    Typography,
    CircularProgress,
    Snackbar,
    Alert
} from "@mui/material";

// ============================================================
// COMPONENT IMPORTS
// ============================================================

import PurchaseOrderItemToolbar
    from "./PurchaseOrderItemToolbar";

import PurchaseOrderItemStatistics
    from "./PurchaseOrderItemStatistics";

import PurchaseOrderItemSearch
    from "./PurchaseOrderItemSearch";

import PurchaseOrderItemTable
    from "./PurchaseOrderItemTable";

import PurchaseOrderItemPagination
    from "./PurchaseOrderItemPagination";
import DeletePurchaseOrderItemDialog
    from "./DeletePurchaseOrderItemDialog";

// ============================================================
// SERVER URL
// ============================================================

const SERVER_URL = "http://localhost:5000";

// ============================================================
// PURCHASE ORDER ITEM LIST
// ============================================================

const PurchaseOrderItemList = () => {

    const navigate = useNavigate();

    // ========================================================
    // STATE
    // ========================================================

    const [items, setItems] = useState([]);

    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [page, setPage] = useState(1);

    const [pageSize, setPageSize] = useState(10);

    const [selectedItem, setSelectedItem] = useState(null);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    // ========================================================
    // LOAD ALL PURCHASE ORDER ITEMS
    //
    // GET
    // http://localhost:5000/api/purchase-order-items
    // ========================================================

    const loadItems = async () => {

        try {

            setLoading(true);

            console.log(
                "================================================="
            );

            console.log(
                "GET ALL PURCHASE ORDER ITEMS"
            );

            console.log(
                "URL:",
                `${SERVER_URL}/api/purchase-order-items`
            );

            const response = await axios.get(
                `${SERVER_URL}/api/purchase-order-items`
            );

            console.log(
                "ALL PURCHASE ORDER ITEMS:",
                response.data
            );

            const data = Array.isArray(response.data)
                ? response.data
                : [];

            setItems(data);

        }
        catch (error) {

            console.error(
                "GET ALL PURCHASE ORDER ITEMS ERROR:",
                error
            );

            console.error(
                "RESPONSE:",
                error.response?.data
            );

            setItems([]);

            setSnackbar({
                open: true,
                message:
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Unable to load Purchase Order Items.",
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

        loadItems();

    }, []);

    // ========================================================
    // CLIENT-SIDE SEARCH
    // ========================================================

    const filteredItems = useMemo(() => {

        const search =
            (searchText || "")
                .trim()
                .toLowerCase();

        if (!search) {

            return items;

        }

        return items.filter((item) => {

            const searchableValues = [

                item?.purchaseOrderItemId,

                item?.purchaseOrderId,

                item?.productId,

                item?.quantity,

                item?.unitPrice,

                item?.discount,

                item?.taxAmount,

                item?.totalAmount,

                item?.sellerId,

                item?.customerId

            ];

            return searchableValues.some(
                (value) =>
                    String(value ?? "")
                        .toLowerCase()
                        .includes(search)
            );

        });

    }, [
        items,
        searchText
    ]);

    // ========================================================
    // RESET PAGE WHEN SEARCH CHANGES
    // ========================================================

    useEffect(() => {

        setPage(1);

    }, [searchText]);

    // ========================================================
    // PAGINATION
    // ========================================================

    const totalRecords =
        filteredItems.length;

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalRecords / pageSize
            )
        );

    const pagedItems =
        filteredItems.slice(
            (page - 1) * pageSize,
            page * pageSize
        );

    // ========================================================
    // STATISTICS
    // ========================================================

    const statistics = useMemo(() => {

        return {

            totalItems:
                items.length,

            totalQuantity:
                items.reduce(
                    (sum, item) =>
                        sum +
                        Number(
                            item?.quantity || 0
                        ),
                    0
                ),

            totalAmount:
                items.reduce(
                    (sum, item) =>
                        sum +
                        Number(
                            item?.totalAmount || 0
                        ),
                    0
                ),

            totalTax:
                items.reduce(
                    (sum, item) =>
                        sum +
                        Number(
                            item?.taxAmount || 0
                        ),
                    0
                )

        };

    }, [items]);

    // ========================================================
    // ADD / CREATE
    // ========================================================
const handleAdd = () => {

    navigate(
        "/purchase-order-items/create"
    );

};

    // ========================================================
    // VIEW
    //
    // ROUTE:
    // /purchase-order-items/:id
    // ========================================================

    const handleView = (item) => {

        console.log(
            "================================================="
        );

        console.log(
            "VIEW PURCHASE ORDER ITEM"
        );

        console.log(
            "SELECTED ITEM:",
            item
        );

        const rawPurchaseOrderItemId =
            item?.purchaseOrderItemId ??
            item?.PurchaseOrderItemId ??
            item?.id ??
            null;

        const purchaseOrderItemId =
            Number(
                rawPurchaseOrderItemId
            );

        console.log(
            "RAW ITEM ID:",
            rawPurchaseOrderItemId
        );

        console.log(
            "NORMALIZED ITEM ID:",
            purchaseOrderItemId
        );

        if (
            !Number.isInteger(
                purchaseOrderItemId
            ) ||
            purchaseOrderItemId <= 0
        ) {

            setSnackbar({
                open: true,
                message:
                    "Invalid Purchase Order Item ID.",
                severity: "error"
            });

            return;

        }

        const route =
            `/purchase-order-items/${purchaseOrderItemId}`;

        console.log(
            "NAVIGATING TO:",
            route
        );

        navigate(route);

    };

    // ========================================================
    // EDIT
    //
    // ROUTE:
    // /purchase-order-items/edit/:id
    // ========================================================

    const handleEdit = (item) => {

        console.log(
            "================================================="
        );

        console.log(
            "EDIT PURCHASE ORDER ITEM"
        );

        console.log(
            "SELECTED ITEM:",
            item
        );

        const rawPurchaseOrderItemId =
            item?.purchaseOrderItemId ??
            item?.PurchaseOrderItemId ??
            item?.id ??
            null;

        const purchaseOrderItemId =
            Number(
                rawPurchaseOrderItemId
            );

        console.log(
            "RAW PURCHASE ORDER ITEM ID:",
            rawPurchaseOrderItemId
        );

        console.log(
            "NORMALIZED PURCHASE ORDER ITEM ID:",
            purchaseOrderItemId
        );

        if (
            !Number.isInteger(
                purchaseOrderItemId
            ) ||
            purchaseOrderItemId <= 0
        ) {

            setSnackbar({
                open: true,
                message:
                    "Invalid Purchase Order Item ID.",
                severity: "error"
            });

            return;

        }

        const route =
            `/purchase-order-items/edit/${purchaseOrderItemId}`;

        console.log(
            "NAVIGATING TO:",
            route
        );

        navigate(route);

    };

    // ========================================================
    // DELETE
    // ========================================================

    const handleDelete = (item) => {

        console.log(
            "================================================="
        );

        console.log(
            "DELETE PURCHASE ORDER ITEM SELECTED:"
        );

        console.log(
            item
        );

        const rawPurchaseOrderItemId =
            item?.purchaseOrderItemId ??
            item?.PurchaseOrderItemId ??
            item?.id ??
            null;

        const purchaseOrderItemId =
            Number(
                rawPurchaseOrderItemId
            );

        console.log(
            "DELETE ITEM ID:",
            purchaseOrderItemId
        );

        if (
            !Number.isInteger(
                purchaseOrderItemId
            ) ||
            purchaseOrderItemId <= 0
        ) {

            setSnackbar({
                open: true,
                message:
                    "Invalid Purchase Order Item ID.",
                severity: "error"
            });

            return;

        }

        setSelectedItem({

            ...item,

            purchaseOrderItemId

        });

        setDeleteOpen(true);

    };

    // ========================================================
    // CREATE
    //
    // POST
    // /api/purchase-order-items
    // ========================================================

    const handleCreate = async (data) => {

        try {

            console.log(
                "================================================="
            );

            console.log(
                "CREATE PURCHASE ORDER ITEM"
            );

            console.log(
                "PAYLOAD:",
                data
            );

            await axios.post(
                `${SERVER_URL}/api/purchase-order-items`,
                data,
                {
                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );

            console.log(
                "PURCHASE ORDER ITEM CREATED SUCCESSFULLY"
            );

            setCreateOpen(false);

            setSelectedItem(null);

            await loadItems();

            setSnackbar({
                open: true,
                message:
                    "Purchase Order Item created successfully.",
                severity: "success"
            });

        }
        catch (error) {

            console.error(
                "CREATE PURCHASE ORDER ITEM ERROR:",
                error
            );

            console.error(
                "CREATE RESPONSE:",
                error.response?.data
            );

            setSnackbar({
                open: true,
                message:
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Failed to create Purchase Order Item.",
                severity: "error"
            });

        }

    };

    // ========================================================
    // DELETE CONFIRM
    //
    // DELETE
    // /api/purchase-order-items/:id
    // ========================================================

    const handleDeleteConfirm = async (id) => {

        try {

            const purchaseOrderItemId =
                Number(id);

            console.log(
                "================================================="
            );

            console.log(
                "DELETE PURCHASE ORDER ITEM"
            );

            console.log(
                "ITEM ID:",
                purchaseOrderItemId
            );

            console.log(
                "DELETE URL:",
                `${SERVER_URL}/api/purchase-order-items/${purchaseOrderItemId}`
            );

            if (
                !Number.isInteger(
                    purchaseOrderItemId
                ) ||
                purchaseOrderItemId <= 0
            ) {

                setSnackbar({
                    open: true,
                    message:
                        "Purchase Order Item ID is required.",
                    severity: "error"
                });

                return;

            }

            await axios.delete(
                `${SERVER_URL}/api/purchase-order-items/${purchaseOrderItemId}`
            );

            console.log(
                "PURCHASE ORDER ITEM DELETED SUCCESSFULLY"
            );

            setDeleteOpen(false);

            setSelectedItem(null);

            await loadItems();

            setSnackbar({
                open: true,
                message:
                    "Purchase Order Item deleted successfully.",
                severity: "success"
            });

        }
        catch (error) {

            console.error(
                "DELETE PURCHASE ORDER ITEM ERROR:",
                error
            );

            console.error(
                "DELETE RESPONSE:",
                error.response?.data
            );

            setSnackbar({
                open: true,
                message:
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Failed to delete Purchase Order Item.",
                severity: "error"
            });

        }

    };


    // ========================================================
    // CLOSE DELETE
    // ========================================================

    const handleDeleteClose = () => {

        setDeleteOpen(false);

        setSelectedItem(null);

    };

    // ========================================================
    // CLOSE SNACKBAR
    // ========================================================

    const handleSnackbarClose = () => {

        setSnackbar(
            (previous) => ({
                ...previous,
                open: false
            })
        );

    };

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="300px"
            >

                <CircularProgress />

            </Box>

        );

    }

    // ========================================================
    // UI
    // ========================================================

    return (

        <Box
            className="purchase-order-items-container"
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <Typography
                variant="h4"
                fontWeight="bold"
                mb={3}
            >
                Purchase Order Items
            </Typography>

            {/* =================================================
                TOOLBAR
            ================================================= */}

            <PurchaseOrderItemToolbar
                onAdd={handleAdd}
                onRefresh={loadItems}
            />

            {/* =================================================
                STATISTICS
            ================================================= */}

            <PurchaseOrderItemStatistics
                statistics={statistics}
            />

            {/* =================================================
                SEARCH
            ================================================= */}

            <PurchaseOrderItemSearch
                searchText={searchText}
                setSearchText={setSearchText}
            />

            {/* =================================================
                TABLE
            ================================================= */}

            <PurchaseOrderItemTable
                items={pagedItems}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* =================================================
                PAGINATION
            ================================================= */}

            <PurchaseOrderItemPagination
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalRecords={totalRecords}
                onPageChange={setPage}
                onPageSizeChange={(size) => {

                    setPageSize(size);

                    setPage(1);

                }}
            />
            {/* =================================================
                DELETE DIALOG
            ================================================= */}

            <DeletePurchaseOrderItemDialog
                open={deleteOpen}
                item={selectedItem}
                onClose={handleDeleteClose}
                onDeleted={handleDeleteConfirm}
            />

            {/* =================================================
                SNACKBAR
            ================================================= */}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >

                <Alert
                    severity={snackbar.severity}
                    onClose={handleSnackbarClose}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>

            </Snackbar>

        </Box>

    );

};

export default PurchaseOrderItemList;
