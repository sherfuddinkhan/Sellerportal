import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

import {
    Alert,
    Box,
    CircularProgress,
    Snackbar
} from "@mui/material";

import OrderItemToolbar from "./OrderItemToolbar";
import OrderItemStatistics from "./OrderItemStatistics";
import OrderItemSearch from "./OrderItemSearch";
import OrderItemTable from "./OrderItemTable";
import OrderItemPagination from "./OrderItemPagination";

const SERVER_URL = "http://localhost:5000";
const API_URL = `${SERVER_URL}/api/OrderItems`;

const OrderItemList = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [orderItems, setOrderItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const showMessage = useCallback((message, severity = "success") => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    }, []);

    // Show messages returned by Create, Edit, or Delete pages.
    useEffect(() => {
        if (location.state?.message) {
            showMessage(
                location.state.message,
                location.state.severity || "success"
            );

            navigate(location.pathname, {
                replace: true,
                state: null
            });
        }
    }, [
        location.state,
        location.pathname,
        navigate,
        showMessage
    ]);

    // Load all order items.
    const loadOrderItems = useCallback(async () => {
        setLoading(true);

        try {
            console.log("Loading OrderItems from:", API_URL);

            const response = await axios.get(API_URL, {
                timeout: 15000,
                headers: {
                    Accept: "application/json"
                }
            });

            console.log("OrderItems HTTP status:", response.status);
            console.log("OrderItems response:", response.data);

            const data = Array.isArray(response.data)
                ? response.data
                : Array.isArray(response.data?.data)
                    ? response.data.data
                    : Array.isArray(response.data?.items)
                        ? response.data.items
                        : null;

            if (data === null) {
                console.error(
                    "Unexpected OrderItems response format:",
                    response.data
                );

                setOrderItems([]);

                showMessage(
                    "The API did not return an order-items array.",
                    "error"
                );

                return;
            }

            setOrderItems(data);
        } catch (error) {
            console.error("LOAD ORDER ITEMS FAILED");
            console.error("Request URL:", API_URL);
            console.error("Error message:", error.message);
            console.error("HTTP status:", error.response?.status);
            console.error("Response body:", error.response?.data);

            setOrderItems([]);

            showMessage(
                error.response?.data?.message ||
                error.response?.data?.title ||
                error.message ||
                "Failed to load order items.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    }, [showMessage]);

    useEffect(() => {
        loadOrderItems();
    }, [loadOrderItems]);

    // Search by Order Item ID, Order ID, or Product ID.
    useEffect(() => {
        const search = searchText.trim().toLowerCase();

        const result = orderItems.filter((item) => {
            if (!search) {
                return true;
            }

            const orderId = String(
                item.orderId ?? item.OrderId ?? ""
            ).toLowerCase();

            const productId = String(
                item.productId ?? item.ProductId ?? ""
            ).toLowerCase();

            const itemId = String(
                item.orderItemId ?? item.OrderItemId ?? ""
            ).toLowerCase();

            return (
                orderId.includes(search) ||
                productId.includes(search) ||
                itemId.includes(search)
            );
        });

        setFilteredItems(result);
        setPage(1);
    }, [orderItems, searchText]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredItems.length / pageSize)
    );

    const pagedItems = filteredItems.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const getItemId = (item) =>
        item?.orderItemId ?? item?.OrderItemId;

    // Navigate to the Create page.
    const handleCreate = () => {
        navigate("/order-items/create");
    };

    // Navigate to the View page.
    const handleView = (item) => {
        const id = getItemId(item);

        if (id == null) {
            showMessage("Order Item ID was not found.", "error");
            return;
        }

        navigate(`/order-items/${id}/view`);
    };

    // Navigate to the Edit page.
    const handleEdit = (item) => {
        const id = getItemId(item);

        if (id == null) {
            showMessage("Order Item ID was not found.", "error");
            return;
        }

        navigate(`/order-items/${id}/edit`);
    };

    // Navigate to the Delete confirmation page.
    const handleDelete = (item) => {
        const id = getItemId(item);

        if (id == null) {
            showMessage("Order Item ID was not found.", "error");
            return;
        }

        navigate(`/order-items/${id}/delete`);
    };

    // Navigate to the Details page.
    const handleDetails = (item) => {
        const id = getItemId(item);

        if (id == null) {
            showMessage("Order Item ID was not found.", "error");
            return;
        }

        navigate(`/order-items/${id}/details`);
    };

    // Export records to CSV.
    const handleExport = () => {
        const headers = [
            "OrderItemId",
            "OrderId",
            "ProductId",
            "Quantity",
            "UnitPrice",
            "TotalAmount"
        ];

        const rows = filteredItems.map((item) => [
            getItemId(item),
            item.orderId ?? item.OrderId,
            item.productId ?? item.ProductId,
            item.quantity ?? item.Quantity,
            item.unitPrice ?? item.UnitPrice,
            item.totalAmount ?? item.TotalAmount
        ]);

        const csv = [
            headers.join(","),
            ...rows.map((row) =>
                row.map((value) =>
                    `"${String(value ?? "").replace(/"/g, '""')}"`
                ).join(",")
            )
        ].join("\n");

        const blob = new Blob(
            ["\uFEFF" + csv],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "order-items.csv";
        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    };

    return (
        <Box sx={{ p: 3 }}>
            <OrderItemToolbar
                onAdd={handleCreate}
                onRefresh={loadOrderItems}
                onExport={handleExport}
            />

            <OrderItemStatistics items={orderItems} />

            <OrderItemSearch
                searchText={searchText}
                setSearchText={setSearchText}
            />

            {loading && orderItems.length === 0 ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        p: 4
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <OrderItemTable
                    items={pagedItems}
                    loading={loading}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onDetails={handleDetails}
                />
            )}

            <OrderItemPagination
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalRecords={filteredItems.length}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPage(1);
                }}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() =>
                    setSnackbar((previous) => ({
                        ...previous,
                        open: false
                    }))
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    onClose={() =>
                        setSnackbar((previous) => ({
                            ...previous,
                            open: false
                        }))
                    }
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default OrderItemList;
