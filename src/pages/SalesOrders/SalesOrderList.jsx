import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Box,
    Grid,
    Snackbar,
    Alert,
    CircularProgress,
    Typography
} from "@mui/material";

import apiService from "../../services/apiService";

import SalesOrderToolbar from "./SalesOrderToolbar";
import SalesOrderStatistics from "./SalesOrderStatistics";
import SalesOrderSearch from "./SalesOrderSearch";
import SalesOrderTable from "./SalesOrderTable";
import SalesOrderPagination from "./SalesOrderPagination";
import SalesOrderModal from "./SalesOrderModal";
import SalesOrderView from "./SalesOrderView";
import DeleteSalesOrderDialog from "./DeleteSalesOrderDialog";
import SalesOrderCard from "./SalesOrderCard";

import "./SalesOrders.css";

const DEFAULT_PAGE_SIZE = 10;

const SalesOrderList = () => {

    const [salesOrders, setSalesOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchText, setSearchText] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

    const [modalOpen, setModalOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedOrder, setSelectedOrder] = useState(null);

    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: "success",
        message: ""
    });

    const loadSalesOrders = async () => {

        try {

            setLoading(true);

            const response =
                await apiService.getSalesOrders();

            setSalesOrders(
                response.data || []
            );

        }
        catch (error) {

            console.error(error);

            setSnackbar({
                open: true,
                severity: "error",
                message: "Failed to load Sales Orders."
            });

        }
        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadSalesOrders();

    }, []);

    const filteredOrders = useMemo(() => {

        if (!searchText.trim())
            return salesOrders;

        const value = searchText.toLowerCase();

        return salesOrders.filter((order) =>

            order.SalesOrderNumber
                ?.toLowerCase()
                .includes(value)

            ||

            order.Status
                ?.toLowerCase()
                .includes(value)

            ||

            order.Remarks
                ?.toLowerCase()
                .includes(value)

            ||

            String(order.SalesOrderId)
                .includes(value)

            ||

            String(order.SellerId)
                .includes(value)

            ||

            String(order.CustomerId)
                .includes(value)

        );

    }, [salesOrders, searchText]);

    const totalRecords =
        filteredOrders.length;

    const totalPages =
        Math.max(
            1,
            Math.ceil(totalRecords / pageSize)
        );

    const pagedOrders =
        filteredOrders.slice(
            (page - 1) * pageSize,
            page * pageSize
        );

    useEffect(() => {

        if (page > totalPages) {

            setPage(1);

        }

    }, [page, totalPages]);

    const handleAdd = () => {

        setSelectedOrder(null);
        setModalOpen(true);

    };

    const handleEdit = (order) => {

        setSelectedOrder(order);
        setModalOpen(true);

    };

    const handleView = (order) => {

        setSelectedOrder(order);
        setViewOpen(true);

    };

    const handleDelete = (order) => {

        setSelectedOrder(order);
        setDeleteOpen(true);

    };
        const handleSave = async (order) => {

        try {

            if (order.SalesOrderId) {

                await apiService.updateSalesOrder(
                    order.SalesOrderId,
                    order
                );

                setSnackbar({
                    open: true,
                    severity: "success",
                    message: "Sales Order updated successfully."
                });

            } else {

                await apiService.createSalesOrder(order);

                setSnackbar({
                    open: true,
                    severity: "success",
                    message: "Sales Order created successfully."
                });

            }

            setModalOpen(false);

            loadSalesOrders();

        }
        catch (error) {

            console.error(error);

            setSnackbar({
                open: true,
                severity: "error",
                message: "Unable to save Sales Order."
            });

        }

    };

    const handleDeleteConfirm = async (id) => {

        try {

            await apiService.deleteSalesOrder(id);

            setDeleteOpen(false);

            setSnackbar({
                open: true,
                severity: "success",
                message: "Sales Order deleted successfully."
            });

            loadSalesOrders();

        }
        catch (error) {

            console.error(error);

            setSnackbar({
                open: true,
                severity: "error",
                message: "Unable to delete Sales Order."
            });

        }

    };

    const statistics = useMemo(() => {

        const totalOrders =
            salesOrders.length;

        const totalAmount =
            salesOrders.reduce(
                (sum, item) =>
                    sum + Number(item.TotalAmount || 0),
                0
            );

        const completedOrders =
            salesOrders.filter(
                (item) =>
                    item.Status?.toLowerCase() ===
                    "completed"
            ).length;

        const pendingOrders =
            salesOrders.filter(
                (item) =>
                    item.Status?.toLowerCase() ===
                    "pending"
            ).length;

        return {

            totalOrders,

            totalAmount,

            completedOrders,

            pendingOrders

        };

    }, [salesOrders]);

    if (loading) {

        return (

            <Box
                display="flex"
                justifyContent="center"
                mt={5}
            >

                <CircularProgress />

            </Box>

        );

    }

    return (

        <Box className="sales-orders-container">

            <Typography
                variant="h4"
                fontWeight="bold"
                mb={3}
            >

                Sales Orders

            </Typography>

            <SalesOrderToolbar
                onAdd={handleAdd}
                onRefresh={loadSalesOrders}
            />

            <SalesOrderStatistics
                statistics={statistics}
            />

            <SalesOrderSearch
                searchText={searchText}
                setSearchText={setSearchText}
            />

            <Grid container spacing={3}>

                <Grid item xs={12}>

                    <SalesOrderTable
                        items={pagedOrders}
                        loading={loading}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                </Grid>

            </Grid>

            <SalesOrderPagination
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

            <SalesOrderModal
                open={modalOpen}
                item={selectedOrder}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
            />

            <SalesOrderView
                open={viewOpen}
                item={selectedOrder}
                onClose={() => setViewOpen(false)}
            />

            <DeleteSalesOrderDialog
                open={deleteOpen}
                item={selectedOrder}
                onClose={() => setDeleteOpen(false)}
                onDeleted={handleDeleteConfirm}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() =>
                    setSnackbar({
                        ...snackbar,
                        open: false
                    })
                }
            >

                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                >

                    {snackbar.message}

                </Alert>

            </Snackbar>

        </Box>

    );

};

export default SalesOrderList;