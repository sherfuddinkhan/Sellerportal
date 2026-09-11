import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import axios from "axios";

import {
    Box,
    CircularProgress,
    Alert,
    Snackbar
} from "@mui/material";

import DeliveryChallanItemToolbar
    from "./DeliveryChallanItemToolbar";

import DeliveryChallanItemStatistics
    from "./DeliveryChallanItemStatistics";

import DeliveryChallanItemSearch
    from "./DeliveryChallanItemSearch";

import DeliveryChallanItemTable
    from "./DeliveryChallanItemTable";

import DeliveryChallanItemPagination
    from "./DeliveryChallanItemPagination";

import DeliveryChallanItemModal
    from "./DeliveryChallanItemModal";

import DeliveryChallanItemView
    from "./DeliveryChallanItemView";

import DeleteDeliveryChallanItemDialog
    from "./DeleteDeliveryChallanItemDialog";


// ================================================================
// SERVER
// ================================================================

const SERVER_URL = "http://localhost:5000";


// ================================================================
// COMPONENT
// ================================================================

const DeliveryChallanItemList = () => {

    // ============================================================
    // STATE
    // ============================================================

    const [
        deliveryChallanItems,
        setDeliveryChallanItems
    ] = useState([]);

    const [loading, setLoading] =
        useState(false);

    const [searchText, setSearchText] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [pageSize, setPageSize] =
        useState(10);

    const [
        selectedDeliveryChallanItem,
        setSelectedDeliveryChallanItem
    ] = useState(null);

    const [modalOpen, setModalOpen] =
        useState(false);

    const [viewOpen, setViewOpen] =
        useState(false);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            message: "",
            severity: "success"
        });


    // ============================================================
    // LOAD DELIVERY CHALLAN ITEMS
    // Node:
    // GET /api/delivery-challan-items
    //
    // ASP.NET:
    // GET /api/DeliveryChallanItem
    // ============================================================

    const loadDeliveryChallanItems = async () => {

        try {

            setLoading(true);

            console.log(
                "================================================"
            );

            console.log(
                "GET DELIVERY CHALLAN ITEMS"
            );

            console.log(
                "URL:",
                `${SERVER_URL}/api/delivery-challan-items`
            );

            console.log(
                "================================================"
            );


            const response = await axios.get(
                `${SERVER_URL}/api/delivery-challan-items`,
                {
                    headers: {
                        Accept: "application/json"
                    }
                }
            );


            console.log(
                "DELIVERY CHALLAN ITEM RESPONSE:",
                response.data
            );


            // ----------------------------------------------------
            // ASP.NET returns an array
            // ----------------------------------------------------

            const data = Array.isArray(response.data)
                ? response.data
                : [];


            setDeliveryChallanItems(data);

        }
        catch (error) {

            console.error(
                "Delivery Challan Item Load Error:",
                error
            );


            console.error(
                "Status:",
                error.response?.status
            );


            console.error(
                "Response:",
                error.response?.data
            );


            setDeliveryChallanItems([]);


            setSnackbar({
                open: true,
                message:
                    error.response?.data?.message ||
                    "Failed to load Delivery Challan Items.",
                severity: "error"
            });

        }
        finally {

            setLoading(false);

        }
    };


    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {

        loadDeliveryChallanItems();

    }, []);


    // ============================================================
    // SEARCH
    //
    // Search is performed locally against the loaded list.
    // ============================================================

    const filteredDeliveryChallanItems =
        useMemo(() => {

            const search =
                searchText
                    .trim()
                    .toLowerCase();


            if (!search) {

                return deliveryChallanItems;

            }


            return deliveryChallanItems.filter(
                (item) => {

                    const deliveryChallanItemId =
                        item.deliveryChallanItemId ??
                        item.DeliveryChallanItemId ??
                        "";

                    const deliveryChallanId =
                        item.deliveryChallanId ??
                        item.DeliveryChallanId ??
                        "";

                    const productId =
                        item.productId ??
                        item.ProductId ??
                        "";

                    const quantity =
                        item.quantity ??
                        item.Quantity ??
                        "";

                    const unitPrice =
                        item.unitPrice ??
                        item.UnitPrice ??
                        "";

                    const discount =
                        item.discount ??
                        item.Discount ??
                        "";

                    const taxAmount =
                        item.taxAmount ??
                        item.TaxAmount ??
                        "";

                    const totalAmount =
                        item.totalAmount ??
                        item.TotalAmount ??
                        "";

                    const remarks =
                        item.remarks ??
                        item.Remarks ??
                        "";


                    return (

                        String(deliveryChallanItemId)
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(deliveryChallanId)
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(productId)
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(quantity)
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(unitPrice)
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(discount)
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(taxAmount)
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(totalAmount)
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(remarks)
                            .toLowerCase()
                            .includes(search)

                    );

                }
            );

        }, [
            deliveryChallanItems,
            searchText
        ]);


    // ============================================================
    // STATISTICS
    // ============================================================

    const statistics = useMemo(() => {

        const totalItems =
            deliveryChallanItems.length;


        const totalQuantity =
            deliveryChallanItems.reduce(
                (sum, item) =>
                    sum +
                    Number(
                        item.quantity ??
                        item.Quantity ??
                        0
                    ),
                0
            );


        const totalAmount =
            deliveryChallanItems.reduce(
                (sum, item) =>
                    sum +
                    Number(
                        item.totalAmount ??
                        item.TotalAmount ??
                        0
                    ),
                0
            );


        const totalTax =
            deliveryChallanItems.reduce(
                (sum, item) =>
                    sum +
                    Number(
                        item.taxAmount ??
                        item.TaxAmount ??
                        0
                    ),
                0
            );


        const totalDiscount =
            deliveryChallanItems.reduce(
                (sum, item) =>
                    sum +
                    Number(
                        item.discount ??
                        item.Discount ??
                        0
                    ),
                0
            );


        return {

            totalItems,

            totalQuantity,

            totalAmount,

            totalTax,

            totalDiscount

        };

    }, [
        deliveryChallanItems
    ]);


    // ============================================================
    // PAGINATION
    // ============================================================

    const totalRecords =
        filteredDeliveryChallanItems.length;


    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalRecords / pageSize
            )
        );


    const paginatedDeliveryChallanItems =
        filteredDeliveryChallanItems.slice(
            (page - 1) * pageSize,
            page * pageSize
        );


    // ============================================================
    // ADD
    // ============================================================

    const handleAdd = () => {

        setSelectedDeliveryChallanItem(
            null
        );

        setModalOpen(true);

    };


    // ============================================================
    // EDIT
    // ============================================================

    const handleEdit = (item) => {

        setSelectedDeliveryChallanItem(
            item
        );

        setModalOpen(true);

    };


    // ============================================================
    // VIEW
    // ============================================================

    const handleView = (item) => {

        setSelectedDeliveryChallanItem(
            item
        );

        setViewOpen(true);

    };


    // ============================================================
    // DELETE
    // ============================================================

    const handleDelete = (item) => {

        setSelectedDeliveryChallanItem(
            item
        );

        setDeleteOpen(true);

    };


    // ============================================================
    // SAVE
    //
    // Node:
    // POST /api/delivery-challan-items
    // PUT  /api/delivery-challan-items/:id
    // ============================================================

    const handleSave = async (data) => {

        try {

            // ----------------------------------------------------
            // Normalize data from modal
            // ----------------------------------------------------

            const itemId =
                Number(
                    data.deliveryChallanItemId ??
                    data.DeliveryChallanItemId ??
                    0
                );


            const payload = {

                deliveryChallanId:
                    Number(
                        data.deliveryChallanId ??
                        data.DeliveryChallanId ??
                        0
                    ),

                productId:
                    Number(
                        data.productId ??
                        data.ProductId ??
                        0
                    ),

                quantity:
                    Number(
                        data.quantity ??
                        data.Quantity ??
                        0
                    ),

                unitPrice:
                    Number(
                        data.unitPrice ??
                        data.UnitPrice ??
                        0
                    ),

                discount:
                    Number(
                        data.discount ??
                        data.Discount ??
                        0
                    ),

                taxAmount:
                    Number(
                        data.taxAmount ??
                        data.TaxAmount ??
                        0
                    ),

                // ------------------------------------------------
                // TotalAmount is recalculated by ASP.NET service.
                // This value is sent only for model compatibility.
                // ------------------------------------------------

                totalAmount:
                    Number(
                        data.totalAmount ??
                        data.TotalAmount ??
                        0
                    ),

                remarks:
                    (
                        data.remarks ??
                        data.Remarks ??
                        ""
                    ).trim() || null

            };


            console.log(
                "DELIVERY CHALLAN ITEM SAVE PAYLOAD:",
                payload
            );


            // ====================================================
            // UPDATE
            // ====================================================

            if (itemId > 0) {

                const response =
                    await axios.put(
                        `${SERVER_URL}/api/delivery-challan-items/${itemId}`,
                        payload,
                        {
                            headers: {
                                Accept:
                                    "application/json",
                                "Content-Type":
                                    "application/json"
                            }
                        }
                    );


                console.log(
                    "UPDATE RESPONSE:",
                    response.data
                );


                setSnackbar({
                    open: true,
                    message:
                        "Delivery Challan Item updated successfully.",
                    severity: "success"
                });

            }

            // ====================================================
            // CREATE
            // ====================================================

            else {

                const response =
                    await axios.post(
                        `${SERVER_URL}/api/delivery-challan-items`,
                        payload,
                        {
                            headers: {
                                Accept:
                                    "application/json",
                                "Content-Type":
                                    "application/json"
                            }
                        }
                    );


                console.log(
                    "CREATE RESPONSE:",
                    response.data
                );


                setSnackbar({
                    open: true,
                    message:
                        "Delivery Challan Item created successfully.",
                    severity: "success"
                });

            }


            // ----------------------------------------------------
            // Close modal
            // ----------------------------------------------------

            setModalOpen(false);


            setSelectedDeliveryChallanItem(
                null
            );


            // ----------------------------------------------------
            // Reload
            // ----------------------------------------------------

            await loadDeliveryChallanItems();


        }
        catch (error) {

            console.error(
                "Delivery Challan Item Save Error:",
                error
            );


            console.error(
                "Status:",
                error.response?.status
            );


            console.error(
                "Response:",
                error.response?.data
            );


            setSnackbar({
                open: true,
                message:
                    error.response?.data?.message ||
                    "Failed to save Delivery Challan Item.",
                severity: "error"
            });

        }

    };


    // ============================================================
    // DELETE CONFIRM
    //
    // Node:
    // DELETE /api/delivery-challan-items/:id
    // ============================================================

    const handleDeleted = async (id) => {

        try {

            const itemId =
                Number(id);


            if (!Number.isInteger(itemId) ||
                itemId <= 0) {

                throw new Error(
                    "Invalid DeliveryChallanItemId."
                );

            }


            console.log(
                "DELETE DELIVERY CHALLAN ITEM:",
                itemId
            );


            const response =
                await axios.delete(
                    `${SERVER_URL}/api/delivery-challan-items/${itemId}`,
                    {
                        headers: {
                            Accept:
                                "application/json"
                        }
                    }
                );


            console.log(
                "DELETE RESPONSE:",
                response.data
            );


            setSnackbar({
                open: true,
                message:
                    "Delivery Challan Item deleted successfully.",
                severity: "success"
            });


            setDeleteOpen(false);


            setSelectedDeliveryChallanItem(
                null
            );


            await loadDeliveryChallanItems();

        }
        catch (error) {

            console.error(
                "Delivery Challan Item Delete Error:",
                error
            );


            console.error(
                "Status:",
                error.response?.status
            );


            console.error(
                "Response:",
                error.response?.data
            );


            setSnackbar({
                open: true,
                message:
                    error.response?.data?.message ||
                    "Failed to delete Delivery Challan Item.",
                severity: "error"
            });

        }

    };


    // ============================================================
    // REFRESH
    // ============================================================

    const handleRefresh = () => {

        loadDeliveryChallanItems();

    };


    // ============================================================
    // PAGE CHANGE
    // ============================================================

    const handlePageChange = (newPage) => {

        setPage(newPage);

    };


    // ============================================================
    // PAGE SIZE CHANGE
    // ============================================================

    const handlePageSizeChange = (size) => {

        setPageSize(
            Number(size)
        );

        setPage(1);

    };


    // ============================================================
    // RENDER
    // ============================================================

    return (

        <Box
            className="delivery-challan-item-container"
        >

            {/* ==================================================
                TOOLBAR
            ================================================== */}

            <DeliveryChallanItemToolbar
                onAdd={handleAdd}
                onRefresh={handleRefresh}
            />


            {/* ==================================================
                STATISTICS
            ================================================== */}

            <DeliveryChallanItemStatistics
                statistics={statistics}
            />


            {/* ==================================================
                SEARCH
            ================================================== */}

            <DeliveryChallanItemSearch
                searchText={searchText}
                setSearchText={(value) => {

                    setPage(1);

                    setSearchText(value);

                }}
            />


            {/* ==================================================
                TABLE / LOADING
            ================================================== */}

            {loading ? (

                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    mt={5}
                >

                    <CircularProgress />

                </Box>

            ) : (

                <DeliveryChallanItemTable
                    items={
                        paginatedDeliveryChallanItems
                    }
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

            )}


            {/* ==================================================
                PAGINATION
            ================================================== */}

            <DeliveryChallanItemPagination
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalRecords={totalRecords}
                onPageChange={handlePageChange}
                onPageSizeChange={
                    handlePageSizeChange
                }
            />


            {/* ==================================================
                CREATE / EDIT MODAL
            ================================================== */}

            <DeliveryChallanItemModal
                open={modalOpen}
                deliveryChallanItem={
                    selectedDeliveryChallanItem
                }
                onClose={() => {

                    setModalOpen(false);

                    setSelectedDeliveryChallanItem(
                        null
                    );

                }}
                onSave={handleSave}
            />


            {/* ==================================================
                VIEW
            ================================================== */}

            <DeliveryChallanItemView
                open={viewOpen}
                deliveryChallanItem={
                    selectedDeliveryChallanItem
                }
                onClose={() =>
                    setViewOpen(false)
                }
            />


            {/* ==================================================
                DELETE
            ================================================== */}

            <DeleteDeliveryChallanItemDialog
                open={deleteOpen}
                deliveryChallanItem={
                    selectedDeliveryChallanItem
                }
                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedDeliveryChallanItem(
                        null
                    );

                }}
                onDeleted={handleDeleted}
            />


            {/* ==================================================
                SNACKBAR
            ================================================== */}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() =>
                    setSnackbar({
                        ...snackbar,
                        open: false
                    })
                }
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                }}
            >

                <Alert
                    severity={
                        snackbar.severity
                    }
                    variant="filled"
                    onClose={() =>
                        setSnackbar({
                            ...snackbar,
                            open: false
                        })
                    }
                >

                    {snackbar.message}

                </Alert>

            </Snackbar>

        </Box>

    );

};


export default DeliveryChallanItemList;
