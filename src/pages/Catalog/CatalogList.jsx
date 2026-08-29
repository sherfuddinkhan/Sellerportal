// =========================================================
// CatalogList.jsx
// Main Catalog / Product Listing
// =========================================================

import React, {
    useMemo,
    useState
} from "react";

import {
    Alert,
    Box,
    CircularProgress,
    Typography
} from "@mui/material";

import {
    useNavigate
} from "react-router-dom";

import CatalogTable from "./CatalogTable";
import CatalogPagination from "./CatalogPagination";
import CatalogToolbar from "./CatalogToolbar";
import CatalogStatistics from "./CatalogStatistics";

// =========================================================
// COMPONENT
// =========================================================

const CatalogList = ({
    catalogs = [],
    loading = false,
    error = "",

    page = 1,
    rowsPerPage = 10,
    totalCount,

    onPageChange,
    onRowsPerPageChange,

    onView,
    onEdit,
    onDelete,

    onSelectionChange,

    onRefresh
}) => {

    const navigate = useNavigate();

    // =========================================================
    // SELECTED CATALOGS
    // =========================================================

    const [
        selectedIds,
        setSelectedIds
    ] = useState([]);

    // =========================================================
    // SAFE CATALOG DATA
    // =========================================================

    const catalogData = useMemo(() => {

        if (!Array.isArray(catalogs)) {
            return [];
        }

        return catalogs;

    }, [catalogs]);

    // =========================================================
    // TOTAL COUNT
    // =========================================================

    const total = useMemo(() => {

        if (
            totalCount !== undefined &&
            totalCount !== null
        ) {
            return Number(totalCount);
        }

        return catalogData.length;

    }, [
        totalCount,
        catalogData.length
    ]);

    // =========================================================
    // SELECTION
    // =========================================================

    const handleSelectionChange = (ids) => {

        setSelectedIds(ids);

        if (onSelectionChange) {
            onSelectionChange(ids);
        }

    };

    // =========================================================
    // PAGE CHANGE
    // =========================================================

    const handlePageChange = (newPage) => {

        if (onPageChange) {
            onPageChange(newPage);
        }

    };

    // =========================================================
    // ROWS PER PAGE
    // =========================================================

    const handleRowsPerPageChange = (
        newRowsPerPage
    ) => {

        setSelectedIds([]);

        if (onRowsPerPageChange) {

            onRowsPerPageChange(
                newRowsPerPage
            );

        }

    };

    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = () => {

        setSelectedIds([]);

        if (onRefresh) {
            onRefresh();
        }

    };

    // =========================================================
    // SEARCH
    //
    // Search is NOT displayed directly on CatalogList.
    // It opens the dedicated CatalogSearch page.
    // =========================================================

    const handleSearch = () => {

        navigate("/catalog/search");

    };

    // =========================================================
    // FILTERS
    //
    // Filters are NOT displayed directly on CatalogList.
    // They open the dedicated CatalogFilters page.
    // =========================================================

    const handleFilters = () => {

        navigate("/catalog/filters");

    };

    // =========================================================
    // CREATE PRODUCT
    // =========================================================

    const handleCreate = () => {

        navigate("/products/create");

    };

    // =========================================================
    // PRODUCT DETAILS
    // =========================================================

    const handleViewProduct = (catalog) => {

        const productId =
            catalog?.productId ??
            catalog?.ProductId ??
            catalog?.id ??
            catalog?.Id;

        if (!productId) {
            return;
        }

        navigate(
            `/products/details/${productId}`
        );

    };

    // =========================================================
    // EDIT PRODUCT
    // =========================================================

    const handleEditProduct = (catalog) => {

        const productId =
            catalog?.productId ??
            catalog?.ProductId ??
            catalog?.id ??
            catalog?.Id;

        if (!productId) {
            return;
        }

        navigate(
            `/products/edit/${productId}`
        );

    };

    // =========================================================
    // PRODUCT IMAGES
    // =========================================================

    const handleImages = (catalog) => {

        const productId =
            catalog?.productId ??
            catalog?.ProductId ??
            catalog?.id ??
            catalog?.Id;

        if (!productId) {
            return;
        }

        navigate(
            `/catalog/${productId}/images`
        );

    };

    // =========================================================
    // PRODUCT ATTRIBUTES
    // =========================================================

    const handleAttributes = (catalog) => {

        const productId =
            catalog?.productId ??
            catalog?.ProductId ??
            catalog?.id ??
            catalog?.Id;

        if (!productId) {
            return;
        }

        navigate(
            `/catalog/${productId}/attributes`
        );

    };

    // =========================================================
    // PRODUCT REVIEWS
    // =========================================================

    const handleReviews = (catalog) => {

        const productId =
            catalog?.productId ??
            catalog?.ProductId ??
            catalog?.id ??
            catalog?.Id;

        if (!productId) {
            return;
        }

        navigate(
            `/catalog/${productId}/reviews`
        );

    };

    // =========================================================
    // RELATED PRODUCTS
    // =========================================================

    const handleRelatedProducts = (
        catalog
    ) => {

        const productId =
            catalog?.productId ??
            catalog?.ProductId ??
            catalog?.id ??
            catalog?.Id;

        if (!productId) {
            return;
        }

        navigate(
            `/catalog/${productId}/related`
        );

    };

    // =========================================================
    // MARKETPLACE
    // =========================================================

    const handleMarketplace = (
        catalog
    ) => {

        const productId =
            catalog?.productId ??
            catalog?.ProductId ??
            catalog?.id ??
            catalog?.Id;

        if (!productId) {
            navigate("/catalog/marketplace");
            return;
        }

        navigate(
            `/catalog/marketplace?productId=${productId}`
        );

    };

    // =========================================================
    // PUBLISH
    // =========================================================

    const handlePublish = (catalog) => {

        const productId =
            catalog?.productId ??
            catalog?.ProductId ??
            catalog?.id ??
            catalog?.Id;

        if (!productId) {
            navigate("/catalog/publish");
            return;
        }

        navigate(
            `/catalog/publish?productId=${productId}`
        );

    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <Box
                sx={{
                    width: "100%",
                    minHeight: 300,

                    display: "flex",
                    flexDirection: "column",

                    alignItems: "center",
                    justifyContent: "center",

                    gap: 2
                }}
            >

                <CircularProgress />

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Loading catalogs...
                </Typography>

            </Box>

        );

    }

    // =========================================================
    // ERROR
    // =========================================================

    if (error) {

        return (

            <Box
                sx={{
                    width: "100%"
                }}
            >

                <Alert severity="error">
                    {error}
                </Alert>

            </Box>

        );

    }

    // =========================================================
    // EMPTY
    // =========================================================

    if (!catalogData.length) {

        return (

            <Box
                sx={{
                    width: "100%",
                    minHeight: 250,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    textAlign: "center",

                    border: "1px solid",
                    borderColor: "divider",

                    borderRadius: 2,

                    p: 4
                }}
            >

                <Box>

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                            mb: 1
                        }}
                    >
                        No Catalogs Found
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        There are no catalog records
                        available.
                    </Typography>

                </Box>

            </Box>

        );

    }

    // =========================================================
    // RENDER
    // =========================================================

    return (

        <Box
            sx={{
                width: "100%"
            }}
        >

            {/* =================================================
                CATALOG TOOLBAR

                Search and Filters are NOT rendered here.

                Toolbar can contain:
                - Refresh
                - Create Product
                - Search button
                - Filter button
            ================================================= */}

            <CatalogToolbar
                onRefresh={handleRefresh}
                onCreate={handleCreate}
                onSearch={handleSearch}
                onFilters={handleFilters}
            />

            {/* =================================================
                STATISTICS
            ================================================= */}

            <Box sx={{ mt: 2 }}>

                <CatalogStatistics
                    catalogs={catalogData}
                    totalCount={total}
                />

            </Box>

            {/* =================================================
                LIST HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",

                    justifyContent:
                        "space-between",

                    mb: 2,
                    mt: 3,

                    flexWrap: "wrap",
                    gap: 1
                }}
            >

                <Box>

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        Catalogs
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {total} catalog
                        {total === 1
                            ? ""
                            : "s"}{" "}
                        found
                    </Typography>

                </Box>

                {selectedIds.length > 0 && (

                    <Typography
                        variant="body2"
                        color="primary"
                        fontWeight="medium"
                    >
                        {selectedIds.length} selected
                    </Typography>

                )}

            </Box>

            {/* =================================================
                CATALOG TABLE

                The table can expose actions for:

                View
                Edit
                Delete
                Images
                Attributes
                Reviews
                Related Products
                Marketplace
                Publish
            ================================================= */}

            <CatalogTable
                catalogs={catalogData}

                selectedIds={
                    selectedIds
                }

                onSelectionChange={
                    handleSelectionChange
                }

                onView={
                    onView ??
                    handleViewProduct
                }

                onEdit={
                    onEdit ??
                    handleEditProduct
                }

                onDelete={
                    onDelete
                }

                onImages={
                    handleImages
                }

                onAttributes={
                    handleAttributes
                }

                onReviews={
                    handleReviews
                }

                onRelated={
                    handleRelatedProducts
                }

                onMarketplace={
                    handleMarketplace
                }

                onPublish={
                    handlePublish
                }
            />

            {/* =================================================
                PAGINATION

                IMPORTANT:
                Only CatalogPagination handles rows per page.

                Do NOT add another DataGrid pagination
                together with this component.
            ================================================= */}

            <Box
                sx={{
                    mt: 2,

                    display: "flex",
                    justifyContent: "flex-end"
                }}
            >

                <CatalogPagination
                    page={page}

                    rowsPerPage={
                        rowsPerPage
                    }

                    totalCount={
                        total
                    }

                    onPageChange={
                        handlePageChange
                    }

                    onRowsPerPageChange={
                        handleRowsPerPageChange
                    }
                />

            </Box>

        </Box>

    );

};

export default CatalogList;
