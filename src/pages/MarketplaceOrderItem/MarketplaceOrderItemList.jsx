import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Box,
    CircularProgress,
    Alert,
    Snackbar
} from "@mui/material";

import apiService from "../../services/apiService";

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

const MarketplaceOrderItemList = () => {

    // ==========================================================
    // State
    // ==========================================================

    const [
        marketplaceOrderItems,
        setMarketplaceOrderItems
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(false);

    const [
        searchText,
        setSearchText
    ] = useState("");

    const [
        page,
        setPage
    ] = useState(1);

    const [
        pageSize,
        setPageSize
    ] = useState(10);

    const [
        selectedMarketplaceOrderItem,
        setSelectedMarketplaceOrderItem
    ] = useState(null);

    const [
        modalOpen,
        setModalOpen
    ] = useState(false);

    const [
        viewOpen,
        setViewOpen
    ] = useState(false);

    const [
        deleteOpen,
        setDeleteOpen
    ] = useState(false);

    const [
        snackbar,
        setSnackbar
    ] = useState({

        open: false,

        message: "",

        severity: "success"

    });

    // ==========================================================
    // Load Marketplace Order Items
    // ==========================================================

    const loadMarketplaceOrderItems = async () => {

        try {

            setLoading(true);

            const response =
                await apiService.getMarketplaceOrderItems();

            setMarketplaceOrderItems(
                response.data || []
            );

        }
        catch (error) {

            console.error(
                "Marketplace Order Item Load Error",
                error
            );

            setSnackbar({

                open: true,

                message:
                    "Failed to load Marketplace Order Items.",

                severity: "error"

            });

        }
        finally {

            setLoading(false);

        }

    };

    // ==========================================================
    // Initial Load
    // ==========================================================

    useEffect(() => {

        loadMarketplaceOrderItems();

    }, []);
        // ==========================================================
    // Search Filter
    // ==========================================================

    const filteredMarketplaceOrderItems = useMemo(() => {

        if (!searchText.trim())
            return marketplaceOrderItems;

        const search = searchText.toLowerCase();

        return marketplaceOrderItems.filter((item) => (

            String(item.MarketplaceOrderItemId)
                .includes(search)

            ||

            String(item.MarketplaceOrderId)
                .includes(search)

            ||

            String(item.MarketplaceListingId)
                .includes(search)

            ||

            String(item.ProductId)
                .includes(search)

            ||

            item.MarketplaceOrderItemNumber
                ?.toLowerCase()
                .includes(search)

            ||

            item.ExternalOrderItemId
                ?.toLowerCase()
                .includes(search)

            ||

            item.ProductTitle
                ?.toLowerCase()
                .includes(search)

            ||

            item.SKU
                ?.toLowerCase()
                .includes(search)

        ));

    }, [

        marketplaceOrderItems,

        searchText

    ]);


    // ==========================================================
    // Statistics
    // ==========================================================

    const statistics = useMemo(() => ({

        totalItems:

            marketplaceOrderItems.length,

        totalQuantity:

            marketplaceOrderItems.reduce(

                (sum, item) =>

                    sum + Number(item.Quantity || 0),

                0

            ),

        totalSales:

            marketplaceOrderItems.reduce(

                (sum, item) =>

                    sum + Number(item.TotalAmount || 0),

                0

            ),

        totalTax:

            marketplaceOrderItems.reduce(

                (sum, item) =>

                    sum + Number(item.TaxAmount || 0),

                0

            )

    }), [

        marketplaceOrderItems

    ]);


    // ==========================================================
    // Pagination
    // ==========================================================

    const totalRecords =

        filteredMarketplaceOrderItems.length;

    const totalPages =

        Math.ceil(totalRecords / pageSize);

    const paginatedMarketplaceOrderItems =

        filteredMarketplaceOrderItems.slice(

            (page - 1) * pageSize,

            page * pageSize

        );


    // ==========================================================
    // Add
    // ==========================================================

    const handleAdd = () => {

        setSelectedMarketplaceOrderItem(null);

        setModalOpen(true);

    };


    // ==========================================================
    // Edit
    // ==========================================================

    const handleEdit = (marketplaceOrderItem) => {

        setSelectedMarketplaceOrderItem(marketplaceOrderItem);

        setModalOpen(true);

    };


    // ==========================================================
    // View
    // ==========================================================

    const handleView = (marketplaceOrderItem) => {

        setSelectedMarketplaceOrderItem(marketplaceOrderItem);

        setViewOpen(true);

    };


    // ==========================================================
    // Delete
    // ==========================================================

    const handleDelete = (marketplaceOrderItem) => {

        setSelectedMarketplaceOrderItem(marketplaceOrderItem);

        setDeleteOpen(true);

    };


    // ==========================================================
    // Save
    // ==========================================================

    const handleSave = async (data) => {

        try {

            if (data.MarketplaceOrderItemId) {

                await apiService.updateMarketplaceOrderItem(

                    data.MarketplaceOrderItemId,

                    data

                );

                setSnackbar({

                    open: true,

                    message:
                        "Marketplace Order Item updated successfully.",

                    severity: "success"

                });

            }
            else {

                await apiService.createMarketplaceOrderItem(data);

                setSnackbar({

                    open: true,

                    message:
                        "Marketplace Order Item created successfully.",

                    severity: "success"

                });

            }

            setModalOpen(false);

            loadMarketplaceOrderItems();

        }
        catch (error) {

            console.error(error);

            setSnackbar({

                open: true,

                message:
                    "Failed to save Marketplace Order Item.",

                severity: "error"

            });

        }

    };


    // ==========================================================
    // Delete Confirm
    // ==========================================================

    const handleDeleted = async (id) => {

        try {

            await apiService.deleteMarketplaceOrderItem(id);

            setSnackbar({

                open: true,

                message:
                    "Marketplace Order Item deleted successfully.",

                severity: "success"

            });

            setDeleteOpen(false);

            loadMarketplaceOrderItems();

        }
        catch (error) {

            console.error(error);

            setSnackbar({

                open: true,

                message:
                    "Failed to delete Marketplace Order Item.",

                severity: "error"

            });

        }

    };


    // ==========================================================
    // Refresh
    // ==========================================================

    const handleRefresh = () => {

        loadMarketplaceOrderItems();

    };
        // ==========================================================
    // Return UI
    // ==========================================================

    return (

        <Box className="marketplace-order-item-container">

            <MarketplaceOrderItemToolbar
                onAdd={handleAdd}
                onRefresh={handleRefresh}
            />

            <MarketplaceOrderItemStatistics
                statistics={statistics}
            />

            <MarketplaceOrderItemSearch
                searchText={searchText}
                setSearchText={(value) => {

                    setPage(1);

                    setSearchText(value);

                }}
            />

            {

                loading ?

                (

                    <Box
                        display="flex"
                        justifyContent="center"
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

            <MarketplaceOrderItemModal
                open={modalOpen}
                marketplaceOrderItem={
                    selectedMarketplaceOrderItem
                }
                onClose={() =>
                    setModalOpen(false)
                }
                onSave={handleSave}
            />
                        <MarketplaceOrderItemView
                open={viewOpen}
                marketplaceOrderItem={
                    selectedMarketplaceOrderItem
                }
                onClose={() =>
                    setViewOpen(false)
                }
            />

            <DeleteMarketplaceOrderItemDialog
                open={deleteOpen}
                marketplaceOrderItem={
                    selectedMarketplaceOrderItem
                }
                onClose={() =>
                    setDeleteOpen(false)
                }
                onDeleted={handleDeleted}
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