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

import PurchaseOrderToolbar from "./PurchaseOrderToolbar";
import PurchaseOrderStatistics from "./PurchaseOrderStatistics";
import PurchaseOrderSearch from "./PurchaseOrderSearch";
import PurchaseOrderTable from "./PurchaseOrderTable";
import PurchaseOrderPagination from "./PurchaseOrderPagination";
import PurchaseOrderModal from "./PurchaseOrderModal";
import PurchaseOrderView from "./PurchaseOrderView";
import DeletePurchaseOrderDialog from "./DeletePurchaseOrderDialog";

import "./PurchaseOrders.css";

const DEFAULT_PAGE_SIZE = 10;

const PurchaseOrderList = () => {

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
                await apiService.getPurchaseOrders();

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
                    "Failed to load Purchase Orders."

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

                String(item.PurchaseOrderId)
                    .toLowerCase()
                    .includes(value)

                ||

                String(item.PurchaseOrderNumber || "")
                    .toLowerCase()
                    .includes(value)

                ||

                String(item.SellerId)
                    .includes(value)

                ||

                String(item.SupplierId)
                    .includes(value)

                ||

                String(item.Status || "")
                    .toLowerCase()
                    .includes(value)

                ||

                String(item.Remarks || "")
                    .toLowerCase()
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
        const handleSave = async (purchaseOrder) => {

        try {

            if (purchaseOrder.PurchaseOrderId) {

                await apiService.updatePurchaseOrder(

                    purchaseOrder.PurchaseOrderId,

                    purchaseOrder

                );

                setSnackbar({

                    open: true,

                    severity: "success",

                    message: "Purchase Order updated successfully."

                });

            }
            else {

                await apiService.createPurchaseOrder(
                    purchaseOrder
                );

                setSnackbar({

                    open: true,

                    severity: "success",

                    message: "Purchase Order created successfully."

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

                message: "Unable to save Purchase Order."

            });

        }

    };

    const handleDeleteConfirm = async (id) => {

        try {

            await apiService.deletePurchaseOrder(id);

            setDeleteOpen(false);

            setSnackbar({

                open: true,

                severity: "success",

                message: "Purchase Order deleted successfully."

            });

            loadItems();

        }
        catch (error) {

            console.error(error);

            setSnackbar({

                open: true,

                severity: "error",

                message: "Unable to delete Purchase Order."

            });

        }

    };

    const statistics = useMemo(() => {

        const totalOrders =
            items.length;

        const totalAmount =
            items.reduce(

                (sum, item) =>

                    sum +
                    Number(item.TotalAmount || 0),

                0

            );

        const pendingOrders =
            items.filter(

                x =>

                    (x.Status || "")
                        .toLowerCase() ===
                    "pending"

            ).length;

        const completedOrders =
            items.filter(

                x =>

                    (x.Status || "")
                        .toLowerCase() ===
                    "completed"

            ).length;

        return {

            totalOrders,

            totalAmount,

            pendingOrders,

            completedOrders

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

        <Box className="purchase-orders-container">

            <Typography
                variant="h4"
                fontWeight="bold"
                mb={3}
            >

                Purchase Orders

            </Typography>

            <PurchaseOrderToolbar
                onAdd={handleAdd}
                onRefresh={loadItems}
            />

            <PurchaseOrderStatistics
                statistics={statistics}
            />

            <PurchaseOrderSearch
                searchText={searchText}
                setSearchText={setSearchText}
            />

            <Grid
                container
                spacing={3}
            >

                <Grid item xs={12}>

                    <PurchaseOrderTable
                        items={pagedItems}
                        loading={loading}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                </Grid>

            </Grid>

            <PurchaseOrderPagination
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

            <PurchaseOrderModal
                open={modalOpen}
                item={selectedItem}
                onClose={() =>
                    setModalOpen(false)
                }
                onSave={handleSave}
            />

            <PurchaseOrderView
                open={viewOpen}
                item={selectedItem}
                onClose={() =>
                    setViewOpen(false)
                }
            />

            <DeletePurchaseOrderDialog
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

export default PurchaseOrderList;