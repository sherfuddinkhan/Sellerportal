import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Box,
    Grid,
    Typography,
    CircularProgress,
    Snackbar,
    Alert
} from "@mui/material";

import apiService from "../../services/apiService";

import SalesOrderItemToolbar from "./SalesOrderItemToolbar";
import SalesOrderItemStatistics from "./SalesOrderItemStatistics";
import SalesOrderItemSearch from "./SalesOrderItemSearch";
import SalesOrderItemTable from "./SalesOrderItemTable";
import SalesOrderItemPagination from "./SalesOrderItemPagination";
import SalesOrderItemModal from "./SalesOrderItemModal";
import SalesOrderItemView from "./SalesOrderItemView";
import DeleteSalesOrderItemDialog from "./DeleteSalesOrderItemDialog";

import "./SalesOrderItems.css";

const DEFAULT_PAGE_SIZE = 10;

const SalesOrderItemList = () => {

    const [items, setItems] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [searchText, setSearchText] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [pageSize, setPageSize] =
        useState(DEFAULT_PAGE_SIZE);

    const [modalOpen, setModalOpen] =
        useState(false);

    const [viewOpen, setViewOpen] =
        useState(false);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [selectedItem, setSelectedItem] =
        useState(null);

    const [snackbar, setSnackbar] =
        useState({

            open: false,

            severity: "success",

            message: ""

        });

    const loadItems = async () => {

        try {

            setLoading(true);

            const response =
                await apiService.getSalesOrderItems();

            setItems(
                response.data || []
            );

        }
        catch (error) {

            console.error(error);

            setSnackbar({

                open: true,

                severity: "error",

                message:
                    "Failed to load Sales Order Items."

            });

        }
        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadItems();

    }, []);

    const filteredItems =
        useMemo(() => {

            if (!searchText.trim())
                return items;

            const value =
                searchText.toLowerCase();

            return items.filter((item) =>

                String(item.SalesOrderItemId)
                    .includes(value)

                ||

                String(item.SalesOrderId)
                    .includes(value)

                ||

                String(item.ProductId)
                    .includes(value)

                ||

                String(item.Quantity)
                    .includes(value)

                ||

                String(item.UnitPrice)
                    .includes(value)

                ||

                String(item.TotalAmount)
                    .includes(value)

            );

        }, [items, searchText]);

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

    useEffect(() => {

        if (page > totalPages) {

            setPage(1);

        }

    }, [page, totalPages]);

    const handleAdd = () => {

        setSelectedItem(null);

        setModalOpen(true);

    };

    const handleEdit = (item) => {

        setSelectedItem(item);

        setModalOpen(true);

    };

    const handleView = (item) => {

        setSelectedItem(item);

        setViewOpen(true);

    };

    const handleDelete = (item) => {

        setSelectedItem(item);

        setDeleteOpen(true);

    };
        const handleSave = async (item) => {

        try {

            if (item.SalesOrderItemId) {

                await apiService.updateSalesOrderItem(
                    item.SalesOrderItemId,
                    item
                );

                setSnackbar({
                    open: true,
                    severity: "success",
                    message: "Sales Order Item updated successfully."
                });

            } else {

                await apiService.createSalesOrderItem(item);

                setSnackbar({
                    open: true,
                    severity: "success",
                    message: "Sales Order Item created successfully."
                });

            }

            setModalOpen(false);

            loadItems();

        }
        catch (error) {

            console.error(error);

            setSnackbar({
                open: true,
                severity: "error",
                message: "Unable to save Sales Order Item."
            });

        }

    };

    const handleDeleteConfirm = async (id) => {

        try {

            await apiService.deleteSalesOrderItem(id);

            setDeleteOpen(false);

            setSnackbar({
                open: true,
                severity: "success",
                message: "Sales Order Item deleted successfully."
            });

            loadItems();

        }
        catch (error) {

            console.error(error);

            setSnackbar({
                open: true,
                severity: "error",
                message: "Unable to delete Sales Order Item."
            });

        }

    };

    const statistics = useMemo(() => {

        const totalItems =
            items.length;

        const totalQuantity =
            items.reduce(
                (sum, item) =>
                    sum + Number(item.Quantity || 0),
                0
            );

        const totalAmount =
            items.reduce(
                (sum, item) =>
                    sum + Number(item.TotalAmount || 0),
                0
            );

        const totalTax =
            items.reduce(
                (sum, item) =>
                    sum + Number(item.TaxAmount || 0),
                0
            );

        return {

            totalItems,

            totalQuantity,

            totalAmount,

            totalTax

        };

    }, [items]);

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

        <Box className="sales-order-items-container">

            <Typography
                variant="h4"
                fontWeight="bold"
                mb={3}
            >

                Sales Order Items

            </Typography>

            <SalesOrderItemToolbar
                onAdd={handleAdd}
                onRefresh={loadItems}
            />

            <SalesOrderItemStatistics
                statistics={statistics}
            />

            <SalesOrderItemSearch
                searchText={searchText}
                setSearchText={setSearchText}
            />

            <Grid container spacing={3}>

                <Grid item xs={12}>

                    <SalesOrderItemTable
                        items={pagedItems}
                        loading={loading}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                </Grid>

            </Grid>

            <SalesOrderItemPagination
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

            <SalesOrderItemModal
                open={modalOpen}
                item={selectedItem}
                onClose={() =>
                    setModalOpen(false)
                }
                onSave={handleSave}
            />

            <SalesOrderItemView
                open={viewOpen}
                item={selectedItem}
                onClose={() =>
                    setViewOpen(false)
                }
            />

            <DeleteSalesOrderItemDialog
                open={deleteOpen}
                item={selectedItem}
                onClose={() =>
                    setDeleteOpen(false)
                }
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

export default SalesOrderItemList;