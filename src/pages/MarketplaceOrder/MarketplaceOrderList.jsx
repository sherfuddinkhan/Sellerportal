
// =========================================================
// MarketplaceOrderList.jsx
// =========================================================

import React, { useEffect, useState } from "react";

import axios from "axios";

import {
    Box,
    Typography,
    Alert,
    CircularProgress,
    Button,
    Paper
} from "@mui/material";

import {
    Add,
    Refresh
} from "@mui/icons-material";

import {
    useNavigate
} from "react-router-dom";

import MarketplaceOrderTable
    from "./MarketplaceOrderTable";

import MarketplaceOrderToolbar
    from "./MarketplaceOrderToolbar";

import MarketplaceOrderStatistics
    from "./MarketplaceOrderStatistics";

import DeleteMarketplaceOrderDialog
    from "./DeleteMarketplaceOrderDialog";


const SERVER_URL = "http://localhost:5000";


const MarketplaceOrderList = () => {

    // =====================================================
    // STATE
    // =====================================================

    const [orders, setOrders] = useState([]);

    const [filteredOrders, setFilteredOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [status, setStatus] =
        useState("all");

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [selectedOrderId, setSelectedOrderId] =
        useState(null);


    const navigate = useNavigate();


    // =====================================================
    // LOAD MARKETPLACE ORDERS
    // =====================================================

    const loadOrders = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await axios.get(
                `${SERVER_URL}/api/MarketplaceOrder`
            );


            const data = Array.isArray(response.data)
                ? response.data
                : response.data?.data ?? [];


            setOrders(data);

        } catch (err) {

            console.error(
                "LOAD MARKETPLACE ORDERS ERROR:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Unable to load marketplace orders."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadOrders();

    }, []);


    // =====================================================
    // SEARCH + STATUS FILTER
    // =====================================================

    useEffect(() => {

        let result = [...orders];


        // -------------------------------------------------
        // SEARCH
        // -------------------------------------------------

        if (search.trim()) {

            const searchValue =
                search.trim().toLowerCase();


            result = result.filter((order) => {

                const orderNumber =
                    order.marketplaceOrderNumber ??
                    order.MarketplaceOrderNumber ??
                    "";


                const externalOrderId =
                    order.externalOrderId ??
                    order.ExternalOrderId ??
                    "";


                const sellerOrderNumber =
                    order.sellerOrderNumber ??
                    order.SellerOrderNumber ??
                    "";


                const buyerName =
                    order.buyerName ??
                    order.BuyerName ??
                    "";


                const buyerEmail =
                    order.buyerEmail ??
                    order.BuyerEmail ??
                    "";


                return (

                    String(orderNumber)
                        .toLowerCase()
                        .includes(searchValue)

                    ||

                    String(externalOrderId)
                        .toLowerCase()
                        .includes(searchValue)

                    ||

                    String(sellerOrderNumber)
                        .toLowerCase()
                        .includes(searchValue)

                    ||

                    String(buyerName)
                        .toLowerCase()
                        .includes(searchValue)

                    ||

                    String(buyerEmail)
                        .toLowerCase()
                        .includes(searchValue)
                );
            });
        }


        // -------------------------------------------------
        // STATUS FILTER
        // -------------------------------------------------

        if (
            status &&
            status !== "all"
        ) {

            result = result.filter((order) => {

                const orderStatus =
                    order.orderStatus ??
                    order.OrderStatus ??
                    "";


                return (
                    String(orderStatus)
                        .toLowerCase() ===
                    String(status)
                        .toLowerCase()
                );

            });
        }


        setFilteredOrders(result);

    }, [
        orders,
        search,
        status
    ]);


    // =====================================================
    // DELETE BUTTON
    // =====================================================

    const handleDelete = (id) => {

        if (!id) {
            return;
        }


        setSelectedOrderId(id);

        setDeleteOpen(true);
    };


    // =====================================================
    // CONFIRM DELETE
    // =====================================================

    const handleConfirmDelete = async () => {

        if (!selectedOrderId) {
            return;
        }


        try {

            setError("");


            await axios.delete(
                `${SERVER_URL}/api/MarketplaceOrder/${selectedOrderId}`
            );


            setDeleteOpen(false);

            setSelectedOrderId(null);


            await loadOrders();

        } catch (err) {

            console.error(
                "DELETE MARKETPLACE ORDER ERROR:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Unable to delete marketplace order."
            );

        }
    };


    // =====================================================
    // CLOSE DELETE DIALOG
    // =====================================================

    const handleCloseDelete = () => {

        setDeleteOpen(false);

        setSelectedOrderId(null);
    };


    // =====================================================
    // REFRESH
    // =====================================================

    const handleRefresh = () => {

        loadOrders();
    };


    // =====================================================
    // CREATE
    // =====================================================

    const handleCreate = () => {

        navigate(
            "/marketplace-orders/create"
        );
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 300
                }}
            >

                <CircularProgress />

            </Box>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <Box sx={{ p: 3 }}>

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "flex-start",
                        sm: "center"
                    },
                    flexDirection: {
                        xs: "column",
                        sm: "row"
                    },
                    gap: 2,
                    mb: 3
                }}
            >

                <Box>

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        Marketplace Orders
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Manage marketplace orders
                    </Typography>

                </Box>


                <Box
                    sx={{
                        display: "flex",
                        gap: 1
                    }}
                >

                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={handleRefresh}
                    >
                        Refresh
                    </Button>


                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleCreate}
                    >
                        Create Order
                    </Button>

                </Box>

            </Box>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    onClose={() =>
                        setError("")
                    }
                >
                    {error}
                </Alert>

            )}


            {/* =================================================
                STATISTICS
            ================================================= */}

            <MarketplaceOrderStatistics
                orders={orders}
            />


            {/* =================================================
                TOOLBAR
            ================================================= */}

            <MarketplaceOrderToolbar
                search={search}
                setSearch={setSearch}
                status={status}
                setStatus={setStatus}
            />


            {/* =================================================
                RESULT COUNT
            ================================================= */}

            <Paper
                elevation={0}
                sx={{
                    p: 1.5,
                    mb: 2,
                    backgroundColor:
                        "background.default"
                }}
            >

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Showing{" "}
                    <strong>
                        {filteredOrders.length}
                    </strong>{" "}
                    of{" "}
                    <strong>
                        {orders.length}
                    </strong>{" "}
                    marketplace orders
                </Typography>

            </Paper>


            {/* =================================================
                TABLE
            ================================================= */}

            <MarketplaceOrderTable
                orders={filteredOrders}
                onDelete={handleDelete}
            />


            {/* =================================================
                DELETE DIALOG
            ================================================= */}

            <DeleteMarketplaceOrderDialog
                open={deleteOpen}
                onClose={handleCloseDelete}
                onConfirm={
                    handleConfirmDelete
                }
            />

        </Box>
    );
};


export default MarketplaceOrderList;

