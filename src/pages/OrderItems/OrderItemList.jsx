
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
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
import OrderItemModal from "./OrderItemModal";
import OrderItemView from "./OrderItemView";
import DeleteOrderItemDialog from "./DeleteOrderItemDialog";

const SERVER_URL = "http://localhost:5000";
const API_URL = `${SERVER_URL}/api/OrderItem`;

const OrderItemList = () => {
    const [orderItems, setOrderItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const showMessage = (message, severity = "success") => {
        setSnackbar({ open: true, message, severity });
    };
    
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

        const responseData = error.response?.data;

        showMessage(
            responseData?.backendResponse?.title ||
            responseData?.backendResponse?.message ||
            responseData?.message ||
            error.message ||
            "Failed to load order items.",
            "error"
        );
    } finally {
        setLoading(false);
    }
}, []);


    useEffect(() => {
        loadOrderItems();
    }, [loadOrderItems]);

    useEffect(() => {
        const search = searchText.trim().toLowerCase();

        const result = orderItems.filter((item) => {
            if (!search) return true;

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

    const handleSave = async (data) => {
        try {
            const id = data.orderItemId ?? data.OrderItemId;

            const payload = {
                orderId: Number(data.orderId ?? data.OrderId),
                productId: Number(data.productId ?? data.ProductId),
                quantity: Number(data.quantity ?? data.Quantity),
                unitPrice: Number(data.unitPrice ?? data.UnitPrice)
            };

            if (
                !Number.isFinite(payload.orderId) ||
                payload.orderId <= 0 ||
                !Number.isFinite(payload.productId) ||
                payload.productId <= 0 ||
                !Number.isFinite(payload.quantity) ||
                payload.quantity <= 0 ||
                !Number.isFinite(payload.unitPrice) ||
                payload.unitPrice <= 0
            ) {
                showMessage(
                    "Enter valid Order ID, Product ID, Quantity, and Unit Price.",
                    "error"
                );
                return;
            }

            if (id != null && id !== "") {
                await axios.put(`${API_URL}/${id}`, payload);
                showMessage("Order item updated successfully.");
            } else {
                await axios.post(API_URL, payload);
                showMessage("Order item created successfully.");
            }

            setModalOpen(false);
            setSelectedItem(null);
            await loadOrderItems();
        } catch (error) {
            console.error(
                "SAVE ORDER ITEM ERROR:",
                error.response?.data || error.message
            );

            showMessage(
                error.response?.data?.message ||
                "Failed to save order item. Check the API response.",
                "error"
            );
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);

            setDeleteOpen(false);
            setSelectedItem(null);

            await loadOrderItems();

            showMessage("Order item deleted successfully.");
        } catch (error) {
            console.error(
                "DELETE ORDER ITEM ERROR:",
                error.response?.data || error.message
            );

            showMessage(
                error.response?.data?.message ||
                "Failed to delete order item.",
                "error"
            );
        }
    };

    const getItemId = (item) =>
        item?.orderItemId ?? item?.OrderItemId;

    return (
        <Box sx={{ p: 3 }}>
            <OrderItemToolbar
                onAdd={() => {
                    setSelectedItem(null);
                    setModalOpen(true);
                }}
                onRefresh={loadOrderItems}
                onExport={() => {
                    const headers = [
                        "OrderItemId",
                        "OrderId",
                        "ProductId",
                        "Quantity",
                        "UnitPrice",
                        "TotalAmount"
                    ];

                    const rows = orderItems.map((item) => [
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

                    const blob = new Blob([csv], {
                        type: "text/csv;charset=utf-8;"
                    });

                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");

                    link.href = url;
                    link.download = "order-items.csv";
                    link.click();

                    URL.revokeObjectURL(url);
                }}
            />

            <OrderItemStatistics items={orderItems} />

            <OrderItemSearch
                searchText={searchText}
                setSearchText={setSearchText}
            />

            {loading && orderItems.length === 0 ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <OrderItemTable
                    items={pagedItems}
                    loading={loading}
                    onView={(row) => {
                        setSelectedItem(row);
                        setViewOpen(true);
                    }}
                    onEdit={(row) => {
                        setSelectedItem(row);
                        setModalOpen(true);
                    }}
                    onDelete={(row) => {
                        setSelectedItem(row);
                        setDeleteOpen(true);
                    }}
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

            <OrderItemModal
                open={modalOpen}
                item={selectedItem}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedItem(null);
                }}
                onSave={handleSave}
            />

            <OrderItemView
                open={viewOpen}
                item={selectedItem}
                onClose={() => {
                    setViewOpen(false);
                    setSelectedItem(null);
                }}
            />

            <DeleteOrderItemDialog
                open={deleteOpen}
                item={selectedItem}
                onClose={() => {
                    setDeleteOpen(false);
                    setSelectedItem(null);
                }}
                onDeleted={handleDelete}
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
