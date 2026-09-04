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

import axios from "axios";

import SalesOrderItemToolbar from "./SalesOrderItemToolbar";
import SalesOrderItemStatistics from "./SalesOrderItemStatistics";
import SalesOrderItemSearch from "./SalesOrderItemSearch";
import SalesOrderItemTable from "./SalesOrderItemTable";
import SalesOrderItemPagination from "./SalesOrderItemPagination";
import SalesOrderItemModal from "./SalesOrderItemModal";
import SalesOrderItemView from "./SalesOrderItemView";
import DeleteSalesOrderItemDialog from "./DeleteSalesOrderItemDialog";

import "./SalesOrderItems.css";


// =========================================================
// CONFIGURATION
// =========================================================

const SERVER_URL = "http://localhost:5000";

const API_URL =
    `${SERVER_URL}/api/sales-order-items`;

const DEFAULT_PAGE_SIZE = 10;


// =========================================================
// NORMALIZE API RESPONSE
// Handles camelCase and PascalCase
// =========================================================

const normalizeSalesOrderItem = (item) => {

    if (!item) {
        return null;
    }

    return {

        SalesOrderItemId:
            item.salesOrderItemId ??
            item.SalesOrderItemId ??
            0,

        SalesOrderId:
            item.salesOrderId ??
            item.SalesOrderId ??
            0,

        ProductId:
            item.productId ??
            item.ProductId ??
            0,

        LineNumber:
            item.lineNumber ??
            item.LineNumber ??
            0,

        Quantity:
            Number(
                item.quantity ??
                item.Quantity ??
                0
            ),

        UnitPrice:
            Number(
                item.unitPrice ??
                item.UnitPrice ??
                0
            ),

        TotalAmount:
            Number(
                item.totalAmount ??
                item.TotalAmount ??
                0
            ),

        TaxAmount:
            Number(
                item.taxAmount ??
                item.TaxAmount ??
                0
            ),

        DiscountAmount:
            Number(
                item.discountAmount ??
                item.DiscountAmount ??
                0
            ),

        Remarks:
            item.remarks ??
            item.Remarks ??
            ""

    };

};


// =========================================================
// COMPONENT
// =========================================================

const SalesOrderItemList = () => {


    // =====================================================
    // STATE
    // =====================================================

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


    // =====================================================
    // LOAD SALES ORDER ITEMS
    // =====================================================

    const loadItems = async () => {

        try {

            setLoading(true);


            console.log(
                "GET SALES ORDER ITEMS:",
                API_URL
            );


            const response =
                await axios.get(API_URL);


            console.log(
                "SALES ORDER ITEMS RESPONSE:",
                response.data
            );


            let data = [];


            // ------------------------------------------------
            // API returns array
            // ------------------------------------------------

            if (
                Array.isArray(response.data)
            ) {

                data =
                    response.data;

            }


            // ------------------------------------------------
            // API returns { data: [] }
            // ------------------------------------------------

            else if (
                Array.isArray(
                    response.data?.data
                )
            ) {

                data =
                    response.data.data;

            }


            // ------------------------------------------------
            // API returns { items: [] }
            // ------------------------------------------------

            else if (
                Array.isArray(
                    response.data?.items
                )
            ) {

                data =
                    response.data.items;

            }


            const normalizedItems =
                data
                    .map(
                        normalizeSalesOrderItem
                    )
                    .filter(Boolean);


            setItems(
                normalizedItems
            );


            console.log(
                "NORMALIZED SALES ORDER ITEMS:",
                normalizedItems
            );

        }
        catch (error) {

            console.error(
                "LOAD SALES ORDER ITEMS ERROR:",
                error
            );


            setItems([]);


            setSnackbar({

                open: true,

                severity: "error",

                message:
                    error.response?.data?.message ||
                    error.response?.data?.title ||
                    "Failed to load Sales Order Items."

            });

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadItems();

    }, []);


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredItems =
        useMemo(() => {

            if (
                !searchText.trim()
            ) {

                return items;

            }


            const value =
                searchText
                    .toLowerCase()
                    .trim();


            return items.filter(
                (item) => {

                    return (

                        String(
                            item.SalesOrderItemId
                        )
                            .toLowerCase()
                            .includes(value)

                        ||

                        String(
                            item.SalesOrderId
                        )
                            .toLowerCase()
                            .includes(value)

                        ||

                        String(
                            item.ProductId
                        )
                            .toLowerCase()
                            .includes(value)

                        ||

                        String(
                            item.LineNumber
                        )
                            .toLowerCase()
                            .includes(value)

                        ||

                        String(
                            item.Quantity
                        )
                            .toLowerCase()
                            .includes(value)

                        ||

                        String(
                            item.UnitPrice
                        )
                            .toLowerCase()
                            .includes(value)

                        ||

                        String(
                            item.TotalAmount
                        )
                            .toLowerCase()
                            .includes(value)

                        ||

                        String(
                            item.TaxAmount
                        )
                            .toLowerCase()
                            .includes(value)

                        ||

                        String(
                            item.Remarks
                        )
                            .toLowerCase()
                            .includes(value)

                    );

                }
            );

        }, [
            items,
            searchText
        ]);


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalRecords =
        filteredItems.length;


    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalRecords /
                pageSize
            )
        );


    const pagedItems =
        filteredItems.slice(

            (page - 1) *
            pageSize,

            page *
            pageSize

        );


    // =====================================================
    // RESET PAGE WHEN REQUIRED
    // =====================================================

    useEffect(() => {

        if (
            page > totalPages
        ) {

            setPage(1);

        }

    }, [
        page,
        totalPages
    ]);


    // =====================================================
    // RESET PAGE WHEN SEARCH CHANGES
    // =====================================================

    useEffect(() => {

        setPage(1);

    }, [searchText]);


    // =====================================================
    // ADD
    // =====================================================

    const handleAdd = () => {

        setSelectedItem(null);

        setModalOpen(true);

    };


    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = (item) => {

        setSelectedItem(item);

        setModalOpen(true);

    };


    // =====================================================
    // VIEW
    // =====================================================

    const handleView = (item) => {

        setSelectedItem(item);

        setViewOpen(true);

    };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = (item) => {

        setSelectedItem(item);

        setDeleteOpen(true);

    };


    // =====================================================
    // CREATE / UPDATE
    // =====================================================

    const handleSave = async (item) => {

        try {

            console.log(
                "SALES ORDER ITEM TO SAVE:",
                item
            );


            const payload = {

                SalesOrderId:
                    Number(
                        item.SalesOrderId
                    ),

                ProductId:
                    Number(
                        item.ProductId
                    ),

                LineNumber:
                    Number(
                        item.LineNumber || 0
                    ),

                Quantity:
                    Number(
                        item.Quantity || 0
                    ),

                UnitPrice:
                    Number(
                        item.UnitPrice || 0
                    ),

                TotalAmount:
                    Number(
                        item.TotalAmount || 0
                    ),

                TaxAmount:
                    Number(
                        item.TaxAmount || 0
                    ),

                DiscountAmount:
                    Number(
                        item.DiscountAmount || 0
                    ),

                Remarks:
                    item.Remarks || ""

            };


            // ------------------------------------------------
            // UPDATE
            // ------------------------------------------------

            if (
                item.SalesOrderItemId
            ) {

                await axios.put(

                    `${API_URL}/${item.SalesOrderItemId}`,

                    payload,

                    {
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }

                );


                setSnackbar({

                    open: true,

                    severity: "success",

                    message:
                        "Sales Order Item updated successfully."

                });

            }


            // ------------------------------------------------
            // CREATE
            // ------------------------------------------------

            else {

                await axios.post(

                    API_URL,

                    payload,

                    {
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }

                );


                setSnackbar({

                    open: true,

                    severity: "success",

                    message:
                        "Sales Order Item created successfully."

                });

            }


            setModalOpen(false);

            setSelectedItem(null);


            await loadItems();

        }
        catch (error) {

            console.error(
                "SAVE SALES ORDER ITEM ERROR:",
                error
            );


            setSnackbar({

                open: true,

                severity: "error",

                message:
                    error.response?.data?.message ||
                    error.response?.data?.title ||
                    "Unable to save Sales Order Item."

            });

        }

    };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDeleteConfirm =
        async (id) => {

            try {

                console.log(
                    "DELETE SALES ORDER ITEM:",
                    id
                );


                await axios.delete(
                    `${API_URL}/${id}`
                );


                setDeleteOpen(false);

                setSelectedItem(null);


                setSnackbar({

                    open: true,

                    severity: "success",

                    message:
                        "Sales Order Item deleted successfully."

                });


                await loadItems();

            }
            catch (error) {

                console.error(
                    "DELETE SALES ORDER ITEM ERROR:",
                    error
                );


                setSnackbar({

                    open: true,

                    severity: "error",

                    message:
                        error.response?.data?.message ||
                        error.response?.data?.title ||
                        "Unable to delete Sales Order Item."

                });

            }

        };


    // =====================================================
    // STATISTICS
    // =====================================================

    const statistics =
        useMemo(() => {

            const totalItems =
                items.length;


            const totalQuantity =
                items.reduce(

                    (sum, item) =>

                        sum +
                        Number(
                            item.Quantity || 0
                        ),

                    0

                );


            const totalAmount =
                items.reduce(

                    (sum, item) =>

                        sum +
                        Number(
                            item.TotalAmount || 0
                        ),

                    0

                );


            const totalTax =
                items.reduce(

                    (sum, item) =>

                        sum +
                        Number(
                            item.TaxAmount || 0
                        ),

                    0

                );


            return {

                totalItems,

                totalQuantity,

                totalAmount,

                totalTax

            };

        }, [items]);


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
                    minHeight: "300px"
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

        <Box
            className="sales-order-items-container"
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <Typography
                variant="h4"
                fontWeight="bold"
                mb={3}
            >
                Sales Order Items
            </Typography>


            {/* =================================================
                TOOLBAR
            ================================================= */}

            <SalesOrderItemToolbar
                onAdd={handleAdd}
                onRefresh={loadItems}
            />


            {/* =================================================
                STATISTICS
            ================================================= */}

            <SalesOrderItemStatistics
                statistics={statistics}
            />


            {/* =================================================
                SEARCH
            ================================================= */}

            <SalesOrderItemSearch
                searchText={searchText}
                setSearchText={setSearchText}
            />


            {/* =================================================
                TABLE
            ================================================= */}

            <Grid
                container
                spacing={3}
            >

                <Grid
                    item
                    xs={12}
                >

                    <SalesOrderItemTable
                        items={pagedItems}
                        loading={loading}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                </Grid>

            </Grid>


            {/* =================================================
                PAGINATION
            ================================================= */}

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


            {/* =================================================
                CREATE / EDIT MODAL
            ================================================= */}

            <SalesOrderItemModal
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

            <SalesOrderItemView
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

            <DeleteSalesOrderItemDialog
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
                onClose={() =>
                    setSnackbar(
                        previous => ({
                            ...previous,
                            open: false
                        })
                    )
                }
            >

                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    onClose={() =>
                        setSnackbar(
                            previous => ({
                                ...previous,
                                open: false
                            })
                        )
                    }
                >
                    {snackbar.message}
                </Alert>

            </Snackbar>

        </Box>

    );

};


export default SalesOrderItemList;
