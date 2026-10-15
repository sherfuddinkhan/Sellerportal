// ============================================================
// PurchaseOrderItemList.jsx
// ============================================================

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

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

// ============================================================
// NODE PROXY API
// ============================================================

const API_URL =
    "http://localhost:5000/api/purchase-order-items";

// ============================================================
// PURCHASE ORDER ITEM LIST
// ============================================================

const PurchaseOrderItemList = () => {
    const navigate = useNavigate();

    // ========================================================
    // STATE
    // ========================================================

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    // ========================================================
    // SNACKBAR
    // ========================================================

    const showSnackbar = useCallback(
        (message, severity = "success") => {
            setSnackbar({
                open: true,
                message,
                severity
            });
        },
        []
    );

    const handleSnackbarClose = () => {
        setSnackbar((previous) => ({
            ...previous,
            open: false
        }));
    };

    // ========================================================
    // LOAD ALL PURCHASE ORDER ITEMS
    //
    // GET http://localhost:5000/api/purchase-order-items
    // ========================================================

    const loadItems = useCallback(
        async (isRefresh = false) => {
            try {
                if (isRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                const response = await axios.get(API_URL);

                const responseData = response.data;

                const records = Array.isArray(responseData)
                    ? responseData
                    : Array.isArray(responseData?.data)
                        ? responseData.data
                        : Array.isArray(responseData?.items)
                            ? responseData.items
                            : null;

                if (!records) {
                    throw new Error(
                        "The API did not return a valid array of Purchase Order Items."
                    );
                }

                // Keep only the fields returned by the simplified API.
                const normalizedItems = records.map((item) => ({
                    purchaseOrderItemId:
                        item.purchaseOrderItemId ??
                        item.PurchaseOrderItemId ??
                        item.id ??
                        item.Id,

                    purchaseOrderId:
                        item.purchaseOrderId ??
                        item.PurchaseOrderId,

                    sellerId:
                        item.sellerId ??
                        item.SellerId,

                    customerId:
                        item.customerId ??
                        item.CustomerId,

                    productId:
                        item.productId ??
                        item.ProductId,

                    quantity:
                        item.quantity ??
                        item.Quantity ??
                        0,

                    unitPrice:
                        item.unitPrice ??
                        item.UnitPrice ??
                        0,

                    discount:
                        item.discount ??
                        item.Discount ??
                        0,

                    taxAmount:
                        item.taxAmount ??
                        item.TaxAmount ??
                        0,

                    totalAmount:
                        item.totalAmount ??
                        item.TotalAmount ??
                        0
                }));

                setItems(normalizedItems);

                console.log(
                    "PURCHASE ORDER ITEMS:",
                    normalizedItems
                );
            } catch (error) {
                console.error(
                    "LOAD PURCHASE ORDER ITEMS ERROR:",
                    error
                );

                console.error(
                    "API ERROR RESPONSE:",
                    error.response?.data
                );

                setItems([]);

                showSnackbar(
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    error.message ||
                    "Unable to load Purchase Order Items.",
                    "error"
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [showSnackbar]
    );

    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        loadItems();
    }, [loadItems]);

    // ========================================================
    // SEARCH
    // ========================================================

    const filteredItems = useMemo(() => {
        const search = String(searchText || "")
            .trim()
            .toLowerCase();

        if (!search) {
            return items;
        }

        return items.filter((item) => {
            const searchableValues = [
                item.purchaseOrderItemId,
                item.purchaseOrderId,
                item.sellerId,
                item.customerId,
                item.productId,
                item.quantity,
                item.unitPrice,
                item.discount,
                item.taxAmount,
                item.totalAmount
            ];

            return searchableValues.some((value) =>
                String(value ?? "")
                    .toLowerCase()
                    .includes(search)
            );
        });
    }, [items, searchText]);

    // ========================================================
    // RESET PAGE WHEN SEARCH CHANGES
    // ========================================================

    useEffect(() => {
        setPage(1);
    }, [searchText]);

    // ========================================================
    // PAGINATION
    // ========================================================

    const totalRecords = filteredItems.length;

    const totalPages = Math.max(
        1,
        Math.ceil(totalRecords / pageSize)
    );

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    const pagedItems = useMemo(() => {
        const startIndex = (page - 1) * pageSize;

        return filteredItems.slice(
            startIndex,
            startIndex + pageSize
        );
    }, [filteredItems, page, pageSize]);

    // ========================================================
    // STATISTICS
    // ========================================================

    const statistics = useMemo(() => ({
        totalItems: items.length,

        totalQuantity: items.reduce(
            (sum, item) =>
                sum + Number(item.quantity || 0),
            0
        ),

        totalAmount: items.reduce(
            (sum, item) =>
                sum + Number(item.totalAmount || 0),
            0
        ),

        totalTax: items.reduce(
            (sum, item) =>
                sum + Number(item.taxAmount || 0),
            0
        )
    }), [items]);

    // ========================================================
    // GET ITEM ID
    // ========================================================

    const getItemId = (item) => {
        const rawId =
            item?.purchaseOrderItemId ??
            item?.PurchaseOrderItemId ??
            item?.id ??
            item?.Id;

        const id = Number(rawId);

        return Number.isInteger(id) && id > 0
            ? id
            : null;
    };

    // ========================================================
    // CREATE PAGE
    //
    // /purchase-order-items/create
    // ========================================================

    const handleAdd = () => {
        navigate("/purchase-order-items/create");
    };

    // ========================================================
    // VIEW PAGE
    //
    // /purchase-order-items/view/:id
    // ========================================================

    const handleView = (item) => {
        const id = getItemId(item);

        if (!id) {
            showSnackbar(
                "Invalid Purchase Order Item ID.",
                "error"
            );
            return;
        }

        navigate(`/purchase-order-items/view/${id}`);
    };

    // ========================================================
    // DETAILS PAGE
    //
    // /purchase-order-items/details/:id
    // ========================================================

    const handleDetails = (item) => {
        const id = getItemId(item);

        if (!id) {
            showSnackbar(
                "Invalid Purchase Order Item ID.",
                "error"
            );
            return;
        }

        navigate(`/purchase-order-items/details/${id}`);
    };

    // ========================================================
    // EDIT PAGE
    //
    // /purchase-order-items/edit/:id
    // ========================================================

    const handleEdit = (item) => {
        const id = getItemId(item);

        if (!id) {
            showSnackbar(
                "Invalid Purchase Order Item ID.",
                "error"
            );
            return;
        }

        navigate(`/purchase-order-items/edit/${id}`);
    };

    // ========================================================
    // DELETE PAGE
    //
    // /purchase-order-items/delete/:id
    // ========================================================

    const handleDelete = (item) => {
        const id = getItemId(item);

        if (!id) {
            showSnackbar(
                "Invalid Purchase Order Item ID.",
                "error"
            );
            return;
        }

        navigate(`/purchase-order-items/delete/${id}`);
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
        <Box className="purchase-order-items-container">

            {/* TITLE */}

            <Typography
                variant="h4"
                fontWeight="bold"
                mb={3}
            >
                Purchase Order Items
            </Typography>

            {/* TOOLBAR */}

            <PurchaseOrderItemToolbar
                onAdd={handleAdd}
                onRefresh={() => loadItems(true)}
                refreshing={refreshing}
            />

            {/* STATISTICS */}

            <PurchaseOrderItemStatistics
                statistics={statistics}
            />

            {/* SEARCH */}

            <PurchaseOrderItemSearch
                searchText={searchText}
                setSearchText={setSearchText}
            />

            {/* TABLE */}

            <PurchaseOrderItemTable
                items={pagedItems}
                onView={handleView}
                onDetails={handleDetails}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* PAGINATION */}

            <PurchaseOrderItemPagination
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalRecords={totalRecords}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                    const newSize = Number(size);

                    if (
                        Number.isInteger(newSize) &&
                        newSize > 0
                    ) {
                        setPageSize(newSize);
                        setPage(1);
                    }
                }}
            />

            {/* SNACKBAR */}

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
