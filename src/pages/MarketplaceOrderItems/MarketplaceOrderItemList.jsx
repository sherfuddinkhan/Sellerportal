import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import axios from "axios";

import {
    Box,
    CircularProgress,
    Snackbar,
    Alert
} from "@mui/material";

import MarketplaceOrderItemToolbar
    from "./MarketplaceOrderItemToolbar";

import MarketplaceOrderItemStatistics
    from "./MarketplaceOrderItemStatistics";

import MarketplaceOrderItemSearch
    from "./MarketplaceOrderItemSearch";

import MarketplaceOrderItemTable
    from "./MarketplaceOrderItemTable";

import MarketplaceOrderItemPagination
    from "./MarketplaceOrderItemPagination";

import MarketplaceOrderItemModal
    from "./MarketplaceOrderItemModal";

import MarketplaceOrderItemView
    from "./MarketplaceOrderItemView";

import DeleteMarketplaceOrderItemDialog
    from "./DeleteMarketplaceOrderItemDialog";


/* =========================================================
   SERVER URL
========================================================= */

const SERVER_URL = "http://localhost:5000";


/* =========================================================
   API URL
========================================================= */

const API_URL =
    `${SERVER_URL}/api/marketplace-order-items`;


/* =========================================================
   COMPONENT
========================================================= */

const MarketplaceOrderItemList = () => {

    // =========================================================
    // STATE
    // =========================================================

    const [
        marketplaceOrderItems,
        setMarketplaceOrderItems
    ] = useState([]);

    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [page, setPage] = useState(1);

    const [pageSize, setPageSize] = useState(10);

    const [
        selectedMarketplaceOrderItem,
        setSelectedMarketplaceOrderItem
    ] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);

    const [viewOpen, setViewOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });


    // =========================================================
    // LOAD MARKETPLACE ORDER ITEMS
    // =========================================================

    const loadMarketplaceOrderItems = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                API_URL
            );

            /*
             * ASP.NET GET ALL returns:
             *
             * [
             *   {...},
             *   {...}
             * ]
             */

            const data = Array.isArray(response.data)
                ? response.data
                : response.data?.items ||
                  response.data?.Items ||
                  [];

            setMarketplaceOrderItems(data);

        }
        catch (error) {

            console.error(
                "Marketplace Order Item Load Error:",
                error
            );

            setSnackbar({
                open: true,
                message:
                    "Failed to load Marketplace Order Items.",
                severity: "error"
            });

            setMarketplaceOrderItems([]);

        }
        finally {

            setLoading(false);

        }

    };


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadMarketplaceOrderItems();

    }, []);


    // =========================================================
    // SEARCH FILTER
    // =========================================================

    const filteredMarketplaceOrderItems = useMemo(() => {

        if (!searchText.trim()) {

            return marketplaceOrderItems;

        }

        const search =
            searchText
                .trim()
                .toLowerCase();

        return marketplaceOrderItems.filter(
            (item) => {

                return (

                    String(
                        item.MarketplaceOrderItemId ?? ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.MarketplaceOrderId ?? ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.MarketplaceListingId ?? ""
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
                        item.MarketplaceOrderItemNumber ?? ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.ExternalOrderItemId ?? ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.ProductTitle ?? ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.SKU ?? ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        item.Status ?? ""
                    )
                        .toLowerCase()
                        .includes(search)

                );

            }
        );

    }, [
        marketplaceOrderItems,
        searchText
    ]);


    // =========================================================
    // STATISTICS
    // =========================================================

    const statistics = useMemo(() => {

        return {

            totalItems:
                marketplaceOrderItems.length,

            totalQuantity:
                marketplaceOrderItems.reduce(
                    (sum, item) =>
                        sum +
                        Number(
                            item.Quantity || 0
                        ),
                    0
                ),

            totalSales:
                marketplaceOrderItems.reduce(
                    (sum, item) =>
                        sum +
                        Number(
                            item.TotalAmount || 0
                        ),
                    0
                ),

            totalTax:
                marketplaceOrderItems.reduce(
                    (sum, item) =>
                        sum +
                        Number(
                            item.TaxAmount || 0
                        ),
                    0
                )

        };

    }, [
        marketplaceOrderItems
    ]);


    // =========================================================
    // PAGINATION
    // =========================================================

    const totalRecords =
        filteredMarketplaceOrderItems.length;

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalRecords / pageSize
            )
        );

    const paginatedMarketplaceOrderItems =
        filteredMarketplaceOrderItems.slice(
            (page - 1) * pageSize,
            page * pageSize
        );


    // =========================================================
    // ADD
    // =========================================================

    const handleAdd = () => {

        setSelectedMarketplaceOrderItem(null);

        setModalOpen(true);

    };


    // =========================================================
    // EDIT
    // =========================================================

    const handleEdit = (
        marketplaceOrderItem
    ) => {

        setSelectedMarketplaceOrderItem(
            marketplaceOrderItem
        );

        setModalOpen(true);

    };


    // =========================================================
    // VIEW
    // =========================================================

    const handleView = (
        marketplaceOrderItem
    ) => {

        setSelectedMarketplaceOrderItem(
            marketplaceOrderItem
        );

        setViewOpen(true);

    };


    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = (
        marketplaceOrderItem
    ) => {

        setSelectedMarketplaceOrderItem(
            marketplaceOrderItem
        );

        setDeleteOpen(true);

    };


    // =========================================================
    // SAVE
    // =========================================================

    const handleSave = async (data) => {

        try {

            const id =
                data.MarketplaceOrderItemId;


            // =================================================
            // UPDATE
            // =================================================

            if (id) {

                await axios.put(
                    `${API_URL}/${id}`,
                    data
                );

                setSnackbar({
                    open: true,
                    message:
                        "Marketplace Order Item updated successfully.",
                    severity: "success"
                });

            }


            // =================================================
            // CREATE
            // =================================================

            else {

                await axios.post(
                    API_URL,
                    data
                );

                setSnackbar({
                    open: true,
                    message:
                        "Marketplace Order Item created successfully.",
                    severity: "success"
                });

            }


            // =================================================
            // CLOSE MODAL
            // =================================================

            setModalOpen(false);

            setSelectedMarketplaceOrderItem(null);


            // =================================================
            // RELOAD
            // =================================================

            await loadMarketplaceOrderItems();

        }
        catch (error) {

            console.error(
                "Save Marketplace Order Item Error:",
                error
            );

            setSnackbar({
                open: true,
                message:
                    error.response?.data?.message ||
                    "Failed to save Marketplace Order Item.",
                severity: "error"
            });

        }

    };


    // =========================================================
    // DELETE CONFIRM
    // =========================================================

    const handleDeleted = async (id) => {

        try {

            await axios.delete(
                `${API_URL}/${id}`
            );

            setSnackbar({
                open: true,
                message:
                    "Marketplace Order Item deleted successfully.",
                severity: "success"
            });

            setDeleteOpen(false);

            setSelectedMarketplaceOrderItem(null);

            await loadMarketplaceOrderItems();

        }
        catch (error) {

            console.error(
                "Delete Marketplace Order Item Error:",
                error
            );

            setSnackbar({
                open: true,
                message:
                    error.response?.data?.message ||
                    "Failed to delete Marketplace Order Item.",
                severity: "error"
            });

        }

    };


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = () => {

        loadMarketplaceOrderItems();

    };


    // =========================================================
    // PAGE SAFETY
    // =========================================================

    useEffect(() => {

        if (page > totalPages) {

            setPage(totalPages);

        }

    }, [
        page,
        totalPages
    ]);


    // =========================================================
    // RETURN UI
    // =========================================================

    return (

        <Box
            className="marketplace-order-item-container"
        >

            {/* =================================================
                TOOLBAR
            ================================================= */}

            <MarketplaceOrderItemToolbar
                onAdd={handleAdd}
                onRefresh={handleRefresh}
            />


            {/* =================================================
                STATISTICS
            ================================================= */}

            <MarketplaceOrderItemStatistics
                statistics={statistics}
            />


            {/* =================================================
                SEARCH
            ================================================= */}

            <MarketplaceOrderItemSearch
                searchText={searchText}
                setSearchText={(value) => {

                    setPage(1);

                    setSearchText(value);

                }}
            />


            {/* =================================================
                TABLE
            ================================================= */}

            {
                loading

                ?

                (

                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        mt={5}
                    >

                        <CircularProgress />

                    </Box>

                )

                :

                (

                    <MarketplaceOrderItemTable
                        marketplaceOrderItems={
                            paginatedMarketplaceOrderItems
                        }
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                )
            }


            {/* =================================================
                PAGINATION
            ================================================= */}

            <MarketplaceOrderItemPagination
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

            <MarketplaceOrderItemModal
                open={modalOpen}

                marketplaceOrderItem={
                    selectedMarketplaceOrderItem
                }

                onClose={() => {

                    setModalOpen(false);

                    setSelectedMarketplaceOrderItem(
                        null
                    );

                }}

                onSave={handleSave}
            />


            {/* =================================================
                VIEW
            ================================================= */}

            <MarketplaceOrderItemView
                open={viewOpen}

                marketplaceOrderItem={
                    selectedMarketplaceOrderItem
                }

                onClose={() => {

                    setViewOpen(false);

                    setSelectedMarketplaceOrderItem(
                        null
                    );

                }}
            />


            {/* =================================================
                DELETE
            ================================================= */}

            <DeleteMarketplaceOrderItemDialog
                open={deleteOpen}

                marketplaceOrderItem={
                    selectedMarketplaceOrderItem
                }

                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedMarketplaceOrderItem(
                        null
                    );

                }}

                onDeleted={handleDeleted}
            />


            {/* =================================================
                SNACKBAR
            ================================================= */}

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
                    severity={snackbar.severity}
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

export default MarketplaceOrderItemList;
