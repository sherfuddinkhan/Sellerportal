import React, { useEffect, useMemo, useState } from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography
} from "@mui/material";

import {
    Add,
    Refresh,
    ViewList
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import MarketplaceOrderCard from "./MarketplaceOrderCard";
import MarketplaceOrderSearch from "./MarketplaceOrderSearch";
import MarketplaceOrderPagination from "./MarketplaceOrderPagination";

const SERVER_URL = "http://localhost:5000";

const MarketplaceOrderCardPage = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(12);

    const getValue = (order, camelCase, pascalCase, fallback = "") => {
        return order?.[camelCase] ??
            order?.[pascalCase] ??
            fallback;
    };

    const getOrderId = (order) => {
        return getValue(
            order,
            "marketplaceOrderId",
            "MarketplaceOrderId",
            null
        );
    };

    const getOrderStatus = (order) => {
        return getValue(
            order,
            "orderStatus",
            "OrderStatus",
            "Pending"
        );
    };

    const loadOrders = async (showRefresh = false) => {
        try {
            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response = await fetch(
                `${SERVER_URL}/api/MarketplaceOrder`
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to load marketplace orders (${response.status})`
                );
            }

            const responseData = await response.json();

            let data = [];

            if (Array.isArray(responseData)) {
                data = responseData;
            } else if (Array.isArray(responseData?.data)) {
                data = responseData.data;
            } else if (Array.isArray(responseData?.orders)) {
                data = responseData.orders;
            }

            setOrders(data);
        } catch (err) {
            console.error(
                "LOAD MARKETPLACE ORDERS ERROR:",
                err
            );

            setError(
                err.message ||
                "Failed to load marketplace orders."
            );

            setOrders([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const filteredOrders = useMemo(() => {
        const searchText = search
            .trim()
            .toLowerCase();

        return orders.filter((order) => {
            const orderNumber = getValue(
                order,
                "marketplaceOrderNumber",
                "MarketplaceOrderNumber"
            );

            const externalOrderId = getValue(
                order,
                "externalOrderId",
                "ExternalOrderId"
            );

            const sellerOrderNumber = getValue(
                order,
                "sellerOrderNumber",
                "SellerOrderNumber"
            );

            const buyerName = getValue(
                order,
                "buyerName",
                "BuyerName"
            );

            const buyerEmail = getValue(
                order,
                "buyerEmail",
                "BuyerEmail"
            );

            const orderStatus = getOrderStatus(order);

            const matchesSearch =
                !searchText ||
                String(orderNumber)
                    .toLowerCase()
                    .includes(searchText) ||
                String(externalOrderId)
                    .toLowerCase()
                    .includes(searchText) ||
                String(sellerOrderNumber)
                    .toLowerCase()
                    .includes(searchText) ||
                String(buyerName)
                    .toLowerCase()
                    .includes(searchText) ||
                String(buyerEmail)
                    .toLowerCase()
                    .includes(searchText);

            const matchesStatus =
                status === "All" ||
                String(orderStatus).toLowerCase() ===
                    status.toLowerCase();

            return matchesSearch && matchesStatus;
        });
    }, [orders, search, status]);

    useEffect(() => {
        setPage(1);
    }, [search, status]);

    const paginatedOrders = useMemo(() => {
        const startIndex =
            (page - 1) * rowsPerPage;

        const endIndex =
            startIndex + rowsPerPage;

        return filteredOrders.slice(
            startIndex,
            endIndex
        );
    }, [
        filteredOrders,
        page,
        rowsPerPage
    ]);

    const handleView = (order) => {
        const id = getOrderId(order);

        if (!id) {
            return;
        }

        navigate(
            `/marketplace-orders/details/${id}`
        );
    };

    const handleEdit = (order) => {
        const id = getOrderId(order);

        if (!id) {
            return;
        }

        navigate(
            `/marketplace-orders/edit/${id}`
        );
    };

    const handleDelete = async (order) => {
        const id = getOrderId(order);

        if (!id) {
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete marketplace order ${
                getValue(
                    order,
                    "marketplaceOrderNumber",
                    "MarketplaceOrderNumber",
                    id
                )
            }?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            const response = await fetch(
                `${SERVER_URL}/api/MarketplaceOrder/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                const responseText =
                    await response.text();

                throw new Error(
                    responseText ||
                    `Failed to delete order (${response.status})`
                );
            }

            setOrders((previousOrders) =>
                previousOrders.filter(
                    (item) =>
                        getOrderId(item) !== id
                )
            );

            const remainingItems =
                filteredOrders.length - 1;

            const maxPage = Math.max(
                1,
                Math.ceil(
                    remainingItems / rowsPerPage
                )
            );

            setPage((currentPage) =>
                Math.min(currentPage, maxPage)
            );
        } catch (err) {
            console.error(
                "DELETE MARKETPLACE ORDER ERROR:",
                err
            );

            setError(
                err.message ||
                "Failed to delete marketplace order."
            );
        }
    };

    const handleRowsPerPageChange = (
        newRowsPerPage
    ) => {
        setRowsPerPage(newRowsPerPage);
        setPage(1);
    };

    const handleClearFilters = () => {
        setSearch("");
        setStatus("All");
        setPage(1);
    };

    return (
        <Container
            maxWidth="xl"
            sx={{ py: 3 }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "flex-start",
                        md: "center"
                    },
                    flexDirection: {
                        xs: "column",
                        md: "row"
                    },
                    gap: 2,
                    mb: 3
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        Marketplace Orders
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        View marketplace orders in card format
                    </Typography>
                </Box>

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row"
                    }}
                    spacing={1}
                >
                    <Button
                        variant="outlined"
                        startIcon={<ViewList />}
                        onClick={() =>
                            navigate(
                                "/marketplace-orders"
                            )
                        }
                    >
                        Table View
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={() =>
                            loadOrders(true)
                        }
                        disabled={
                            loading ||
                            refreshing
                        }
                    >
                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() =>
                            navigate(
                                "/marketplace-orders/create"
                            )
                        }
                    >
                        Create Order
                    </Button>
                </Stack>
            </Box>

            {/* Filters */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                    mb: 3
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        minWidth: {
                            xs: "100%",
                            sm: 300
                        }
                    }}
                >
                    <MarketplaceOrderSearch
                        value={search}
                        onChange={setSearch}
                    />
                </Box>

                <FormControl
                    size="small"
                    sx={{
                        minWidth: 180
                    }}
                >
                    <InputLabel>
                        Status
                    </InputLabel>

                    <Select
                        value={status}
                        label="Status"
                        onChange={(event) => {
                            setStatus(
                                event.target.value
                            );
                        }}
                    >
                        <MenuItem value="All">
                            All Statuses
                        </MenuItem>

                        <MenuItem value="Pending">
                            Pending
                        </MenuItem>

                        <MenuItem value="Requested">
                            Requested
                        </MenuItem>

                        <MenuItem value="Processing">
                            Processing
                        </MenuItem>

                        <MenuItem value="Shipped">
                            Shipped
                        </MenuItem>

                        <MenuItem value="Delivered">
                            Delivered
                        </MenuItem>

                        <MenuItem value="Cancelled">
                            Cancelled
                        </MenuItem>
                    </Select>
                </FormControl>

                {(search || status !== "All") && (
                    <Button
                        variant="text"
                        onClick={handleClearFilters}
                    >
                        Clear Filters
                    </Button>
                )}
            </Box>

            {/* Error */}
            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            {/* Loading */}
            {loading ? (
                <Box
                    sx={{
                        minHeight: 300,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <Stack
                        alignItems="center"
                        spacing={2}
                    >
                        <CircularProgress />

                        <Typography
                            color="text.secondary"
                        >
                            Loading marketplace orders...
                        </Typography>
                    </Stack>
                </Box>
            ) : filteredOrders.length === 0 ? (
                /* Empty State */
                <Box
                    sx={{
                        minHeight: 300,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        textAlign: "center",
                        border: "1px dashed",
                        borderColor: "divider",
                        borderRadius: 2,
                        p: 4
                    }}
                >
                    <Typography
                        variant="h6"
                        fontWeight={600}
                    >
                        No Marketplace Orders Found
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1, mb: 2 }}
                    >
                        {search || status !== "All"
                            ? "Try changing your search or filters."
                            : "There are no marketplace orders available."}
                    </Typography>

                    {(search ||
                        status !== "All") && (
                        <Button
                            variant="outlined"
                            onClick={
                                handleClearFilters
                            }
                        >
                            Clear Filters
                        </Button>
                    )}
                </Box>
            ) : (
                <>
                    {/* Result Count */}
                    <Box sx={{ mb: 2 }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Showing{" "}
                            {paginatedOrders.length}{" "}
                            of{" "}
                            {filteredOrders.length}{" "}
                            orders
                        </Typography>
                    </Box>

                    {/* Cards */}
                    <Grid
                        container
                        spacing={3}
                    >
                        {paginatedOrders.map(
                            (order) => (
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    lg={3}
                                    key={getOrderId(
                                        order
                                    )}
                                >
                                    <MarketplaceOrderCard
                                        order={order}
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
                                </Grid>
                            )
                        )}
                    </Grid>

                    {/* Pagination */}
                    <MarketplaceOrderPagination
                        page={page}
                        rowsPerPage={
                            rowsPerPage
                        }
                        totalItems={
                            filteredOrders.length
                        }
                        onPageChange={
                            setPage
                        }
                        onRowsPerPageChange={
                            handleRowsPerPageChange
                        }
                    />
                </>
            )}
        </Container>
    );
};

export default MarketplaceOrderCardPage;

