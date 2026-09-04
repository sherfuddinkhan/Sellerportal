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
PurchaseOrderItemCreate,
PurchaseOrderItemEdit,
PurchaseOrderItemDetails,
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

const [createOpen, setCreateOpen] = useState(false);

const [editOpen, setEditOpen] = useState(false);

const [detailsOpen, setDetailsOpen] = useState(false);

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
   CLIENT-SIDE SEARCH

   API RESPONSE USES camelCase:
   purchaseOrderItemId
   purchaseOrderId
   productId
   quantity
   unitPrice
   discount
   taxAmount
   totalAmount

   Also searches:
   product.sku
   product.productName
   purchaseOrder.purchaseOrderNumber
   purchaseOrder.status
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
                item.purchaseOrderItemId ?? ""
            )
                .toLowerCase()
                .includes(search)

            ||

            String(
                item.purchaseOrderId ?? ""
            )
                .toLowerCase()
                .includes(search)

            ||

            String(
                item.sellerId ?? ""
            )
                .toLowerCase()
                .includes(search)

            ||

            String(
                item.customerId ?? ""
            )
                .toLowerCase()
                .includes(search)

            ||

            String(
                item.productId ?? ""
            )
                .toLowerCase()
                .includes(search)

            ||

            String(
                item.quantity ?? ""
            )
                .toLowerCase()
                .includes(search)

            ||

            String(
                item.unitPrice ?? ""
            )
                .toLowerCase()
                .includes(search)

            ||

            String(
                item.discount ?? ""
            )
                .toLowerCase()
                .includes(search)

            ||

            String(
                item.taxAmount ?? ""
            )
                .toLowerCase()
                .includes(search)

            ||

            String(
                item.totalAmount ?? ""
            )
                .toLowerCase()
                .includes(search)

            ||

            String(
                item.product?.sku ?? ""
            )
                .toLowerCase()
                .includes(search)

            ||

            String(
                item.product?.productName ?? ""
            )
                .toLowerCase()
                .includes(search)

            ||

            String(
                item.purchaseOrder?.purchaseOrderNumber ?? ""
            )
                .toLowerCase()
                .includes(search)

            ||

            String(
                item.purchaseOrder?.status ?? ""
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
                    item.quantity || 0
                ),
            0
        ),

        totalAmount: items.reduce(
            (sum, item) =>
                sum + Number(
                    item.totalAmount || 0
                ),
            0
        ),

        totalTax: items.reduce(
            (sum, item) =>
                sum + Number(
                    item.taxAmount || 0
                ),
            0
        )

    };

}, [items]);


/* =====================================================
   ADD / CREATE
===================================================== */

const handleAdd = () => {

    setSelectedItem(null);

    setCreateOpen(true);

};


/* =====================================================
   EDIT
===================================================== */

const handleEdit = (item) => {

    setSelectedItem(item);

    setEditOpen(true);

};


/* =====================================================
   VIEW DETAILS
===================================================== */

const handleView = (item) => {

    setSelectedItem(item);

    setDetailsOpen(true);

};


/* =====================================================
   DELETE
===================================================== */

const handleDelete = (item) => {

    setSelectedItem(item);

    setDeleteOpen(true);

};


/* =====================================================
   CREATE PURCHASE ORDER ITEM

   POST
   /api/purchase-order-items
===================================================== */

const handleCreate = async (data) => {

    try {

        console.log(
            "CREATE PURCHASE ORDER ITEM PAYLOAD:",
            data
        );

        await axios.post(
            `${SERVER_URL}/api/purchase-order-items`,
            data,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );


        setCreateOpen(false);

        setSelectedItem(null);


        await loadItems();


        setSnackbar({
            open: true,
            message:
                "Purchase Order Item created successfully",
            severity: "success"
        });

    }
    catch (error) {

        console.error(
            "CREATE PURCHASE ORDER ITEM ERROR:",
            error
        );

        setSnackbar({
            open: true,
            message:
                error.response?.data?.message ||
                "Failed to create Purchase Order Item",
            severity: "error"
        });

    }

};


/* =====================================================
   UPDATE PURCHASE ORDER ITEM

   PUT
   /api/purchase-order-items/:id
===================================================== */

const handleUpdate = async (data) => {

    try {

        const id =
            data.purchaseOrderItemId;

        if (!id) {

            setSnackbar({
                open: true,
                message:
                    "Purchase Order Item ID is required",
                severity: "error"
            });

            return;

        }


        console.log(
            "UPDATE PURCHASE ORDER ITEM PAYLOAD:",
            data
        );


        await axios.put(
            `${SERVER_URL}/api/purchase-order-items/${id}`,
            data,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );


        setEditOpen(false);

        setSelectedItem(null);


        await loadItems();


        setSnackbar({
            open: true,
            message:
                "Purchase Order Item updated successfully",
            severity: "success"
        });

    }
    catch (error) {

        console.error(
            "UPDATE PURCHASE ORDER ITEM ERROR:",
            error
        );

        setSnackbar({
            open: true,
            message:
                error.response?.data?.message ||
                "Failed to update Purchase Order Item",
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

        if (!id) {

            setSnackbar({
                open: true,
                message:
                    "Purchase Order Item ID is required",
                severity: "error"
            });

            return;

        }


        console.log(
            "DELETE PURCHASE ORDER ITEM:",
            id
        );


        await axios.delete(
            `${SERVER_URL}/api/purchase-order-items/${id}`
        );


        setDeleteOpen(false);

        setSelectedItem(null);


        await loadItems();


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
   CLOSE CREATE
===================================================== */

const handleCreateClose = () => {

    setCreateOpen(false);

    setSelectedItem(null);

};


/* =====================================================
   CLOSE EDIT
===================================================== */

const handleEditClose = () => {

    setEditOpen(false);

    setSelectedItem(null);

};


/* =====================================================
   CLOSE DETAILS
===================================================== */

const handleDetailsClose = () => {

    setDetailsOpen(false);

    setSelectedItem(null);

};


/* =====================================================
   CLOSE DELETE
===================================================== */

const handleDeleteClose = () => {

    setDeleteOpen(false);

    setSelectedItem(null);

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
            CREATE
        ================================================= */}

        <PurchaseOrderItemCreate
            open={createOpen}
            onClose={handleCreateClose}
            onSave={handleCreate}
        />


        {/* =================================================
            EDIT
        ================================================= */}

        <PurchaseOrderItemEdit
            open={editOpen}
            item={selectedItem}
            onClose={handleEditClose}
            onSave={handleUpdate}
        />


        {/* =================================================
            DETAILS
        ================================================= */}

        <PurchaseOrderItemDetails
            open={detailsOpen}
            item={selectedItem}
            onClose={handleDetailsClose}
        />


        {/* =================================================
            DELETE
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
