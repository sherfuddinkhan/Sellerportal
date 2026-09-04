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

import {
    PurchaseOrderItemToolbar,
    PurchaseOrderItemStatistics,
    PurchaseOrderItemSearch,
    PurchaseOrderItemTable,
    PurchaseOrderItemPagination,
    PurchaseOrderItemModal,
    PurchaseOrderItemView,
    DeletePurchaseOrderItemDialog
} from "./index";


/* =========================================================
   SERVER URL
========================================================= */

const SERVER_URL = "http://localhost:5000";


/* =========================================================
   PURCHASE ORDER ITEM LIST
========================================================= */

const PurchaseOrderItemList = () => {

    /* =====================================================
       STATE
    ===================================================== */

    const [items, setItems] = useState([]);

    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [page, setPage] = useState(1);

    const [pageSize, setPageSize] = useState(10);

    const [selectedItem, setSelectedItem] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);

    const [viewOpen, setViewOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });


    /* =====================================================
       LOAD ALL PURCHASE ORDER ITEMS
       
       GET
       http://localhost:5000/api/purchase-order-items
    ===================================================== */

    const loadItems = async () => {

        try {

            setLoading(true);

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

            setItems([]);

            setSnackbar({
                open: true,
                message:
                    error.response?.data?.message ||
                    "Unable to load Purchase Order Items",
                severity: "error"
            });

        }
        finally {

            setLoading(false);

        }
    };


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {

        loadItems();

    }, []);


    /* =====================================================
       SEARCH
       
       Client-side search because all records are loaded
       with one API call.
    ===================================================== */

    const filteredItems = useMemo(() => {

        if (!searchText.trim()) {

            return items;

        }

        const search = searchText
            .toLowerCase()
            .trim();

        return items.filter((item) => {

            return (

                String(
                    item.PurchaseOrderItemId ?? ""
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    item.PurchaseOrderId ?? ""
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    item.ProductId ?? ""
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    item.Quantity ?? ""
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    item.UnitPrice ?? ""
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    item.TotalAmount ?? ""
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    item.TaxAmount ?? ""
                )
                    .toLowerCase()
                    .includes(search)

            );

        });

    }, [
        items,
        searchText
    ]);


    /* =====================================================
       RESET PAGE WHEN SEARCH CHANGES
    ===================================================== */

    useEffect(() => {

        setPage(1);

    }, [searchText]);


    /* =====================================================
       PAGINATION
    ===================================================== */

    const totalRecords = filteredItems.length;

    const totalPages = Math.max(
        1,
        Math.ceil(totalRecords / pageSize)
    );

    const pagedItems = filteredItems.slice(
        (page - 1) * pageSize,
        page * pageSize
    );


    /* =====================================================
       STATISTICS
    ===================================================== */

    const statistics = useMemo(() => {

        return {

            totalItems: items.length,

            totalQuantity: items.reduce(
                (sum, item) =>
                    sum + Number(
                        item.Quantity || 0
                    ),
                0
            ),

            totalAmount: items.reduce(
                (sum, item) =>
                    sum + Number(
                        item.TotalAmount || 0
                    ),
                0
            ),

            totalTax: items.reduce(
                (sum, item) =>
                    sum + Number(
                        item.TaxAmount || 0
                    ),
                0
            )

        };

    }, [items]);


    /* =====================================================
       ADD
    ===================================================== */

    const handleAdd = () => {

        setSelectedItem(null);

        setModalOpen(true);

    };


    /* =====================================================
       EDIT
    ===================================================== */

    const handleEdit = (item) => {

        setSelectedItem(item);

        setModalOpen(true);

    };


    /* =====================================================
       VIEW
    ===================================================== */

    const handleView = (item) => {

        setSelectedItem(item);

        setViewOpen(true);

    };


    /* =====================================================
       DELETE
    ===================================================== */

    const handleDelete = (item) => {

        setSelectedItem(item);

        setDeleteOpen(true);

    };


    /* =====================================================
       CREATE / UPDATE
       
       POST
       /api/purchase-order-items
       
       PUT
       /api/purchase-order-items/:id
    ===================================================== */

    const handleSave = async (data) => {

        try {

            if (
                data.PurchaseOrderItemId
            ) {

                await axios.put(
                    `${SERVER_URL}/api/purchase-order-items/${data.PurchaseOrderItemId}`,
                    data
                );

            }
            else {

                await axios.post(
                    `${SERVER_URL}/api/purchase-order-items`,
                    data
                );

            }


            /* ---------------------------------------------
               Close modal
            --------------------------------------------- */

            setModalOpen(false);

            setSelectedItem(null);


            /* ---------------------------------------------
               Reload data
            --------------------------------------------- */

            await loadItems();


            /* ---------------------------------------------
               Success message
            --------------------------------------------- */

            setSnackbar({
                open: true,
                message:
                    data.PurchaseOrderItemId
                        ? "Purchase Order Item updated successfully"
                        : "Purchase Order Item created successfully",
                severity: "success"
            });

        }
        catch (error) {

            console.error(
                "SAVE PURCHASE ORDER ITEM ERROR:",
                error
            );

            setSnackbar({
                open: true,
                message:
                    error.response?.data?.message ||
                    "Failed to save Purchase Order Item",
                severity: "error"
            });

        }

    };


    /* =====================================================
       DELETE CONFIRM
       
       DELETE
       /api/purchase-order-items/:id
    ===================================================== */

    const handleDeleteConfirm = async (id) => {

        try {

            await axios.delete(
                `${SERVER_URL}/api/purchase-order-items/${id}`
            );


            /* ---------------------------------------------
               Close dialog
            --------------------------------------------- */

            setDeleteOpen(false);

            setSelectedItem(null);


            /* ---------------------------------------------
               Reload
            --------------------------------------------- */

            await loadItems();


            /* ---------------------------------------------
               Success
            --------------------------------------------- */

            setSnackbar({
                open: true,
                message:
                    "Purchase Order Item deleted successfully",
                severity: "success"
            });

        }
        catch (error) {

            console.error(
                "DELETE PURCHASE ORDER ITEM ERROR:",
                error
            );

            setSnackbar({
                open: true,
                message:
                    error.response?.data?.message ||
                    "Failed to delete Purchase Order Item",
                severity: "error"
            });

        }

    };


    /* =====================================================
       CLOSE SNACKBAR
    ===================================================== */

    const handleSnackbarClose = () => {

        setSnackbar((previous) => ({
            ...previous,
            open: false
        }));

    };


    /* =====================================================
       LOADING
    ===================================================== */

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


    /* =====================================================
       UI
    ===================================================== */

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
                CREATE / EDIT MODAL
            ================================================= */}

            <PurchaseOrderItemModal
                open={modalOpen}
                item={selectedItem}
                onClose={() => {

                    setModalOpen(false);

                    setSelectedItem(null);

                }}
                onSave={handleSave}
            />


            {/* =================================================
                VIEW
            ================================================= */}

            <PurchaseOrderItemView
                open={viewOpen}
                item={selectedItem}
                onClose={() => {

                    setViewOpen(false);

                    setSelectedItem(null);

                }}
            />


            {/* =================================================
                DELETE
            ================================================= */}

            <DeletePurchaseOrderItemDialog
                open={deleteOpen}
                item={selectedItem}
                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedItem(null);

                }}
                onDeleted={handleDeleteConfirm}
            />


            {/* =================================================
                SNACKBAR
            ================================================= */}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
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