import React, {
    useCallback,
    useEffect,
    useState,
} from "react";

import axios from "axios";

import {
    Alert,
    Box,
    CircularProgress,
    Grid,
    Paper,
    Snackbar,
} from "@mui/material";

import {
    useNavigate,
} from "react-router-dom";

import CategoryToolbar from "./CategoryToolbar";
import CategoryStatistics from "./CategoryStatistics";
import CategorySearch from "./CategorySearch";
import CategoryFilters from "./CategoryFilters";
import CategoryTable from "./CategoryTable";
import CategoryPagination from "./CategoryPagination";
import DeleteCategoryDialog from "./DeleteCategoryDialog";

// =========================================================
// SERVER
// =========================================================

const SERVER_URL =
    "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const CategoryList = () => {

    const navigate =
        useNavigate();

    // =====================================================
    // CATEGORY DATA
    // =====================================================

    const [
        categories,
        setCategories
    ] = useState([]);

    const [
        filteredCategories,
        setFilteredCategories
    ] = useState([]);

    // =====================================================
    // LOADING
    // =====================================================

    const [
        loading,
        setLoading
    ] = useState(false);

    // =====================================================
    // SEARCH
    // =====================================================

    const [
        searchText,
        setSearchText
    ] = useState("");

    // =====================================================
    // STATUS FILTER
    // =====================================================

    const [
        statusFilter,
        setStatusFilter
    ] = useState("All");

    // =====================================================
    // PAGINATION
    // =====================================================

    const [
        page,
        setPage
    ] = useState(0);

    const [
        rowsPerPage,
        setRowsPerPage
    ] = useState(10);

    // =====================================================
    // SELECTED CATEGORY
    // =====================================================

    const [
        selectedCategory,
        setSelectedCategory
    ] = useState(null);

    // =====================================================
    // DELETE DIALOG
    // =====================================================

    const [
        deleteOpen,
        setDeleteOpen
    ] = useState(false);

    // =====================================================
    // ERROR
    // =====================================================

    const [
        error,
        setError
    ] = useState("");

    const [
        snackbarOpen,
        setSnackbarOpen
    ] = useState(false);

    // =====================================================
    // ERROR HANDLER
    // =====================================================

    const showError = useCallback(
        (message) => {

            setError(
                typeof message === "string"
                    ? message
                    : "An unexpected error occurred."
            );

            setSnackbarOpen(true);

        },
        []
    );

    // =====================================================
    // GET CATEGORY ID
    // =====================================================

    const getCategoryId = (
        category
    ) => {

        return (
            category?.categoryId ??
            category?.id ??
            null
        );

    };

    // =====================================================
    // NORMALIZE SUBCATEGORY
    //
    // Keeps the complete Category DTO structure.
    // =====================================================

    const normalizeSubCategory = (
        subCategory,
        parentCategoryName = null
    ) => {

        if (!subCategory) {

            return null;

        }

        return {

            categoryId:
                subCategory.categoryId ??
                subCategory.id ??
                0,

            categoryName:
                subCategory.categoryName ??
                subCategory.name ??
                "",

            parentCategoryId:
                subCategory.parentCategoryId ??
                null,

            description:
                subCategory.description ??
                "",

            isActive:
                subCategory.isActive ??
                true,

            createdDate:
                subCategory.createdDate ??
                new Date().toISOString(),

            updatedDate:
                subCategory.updatedDate ??
                null,

            categoryCode:
                subCategory.categoryCode ??
                "",

            categoryPath:
                subCategory.categoryPath ??
                "",

            categoryLevel:
                subCategory.categoryLevel ??
                null,

            displayOrder:
                subCategory.displayOrder ??
                0,

            imageUrl:
                subCategory.imageUrl ??
                "",

            batchId:
                subCategory.batchId ??
                "",

            isBulkUpload:
                subCategory.isBulkUpload ??
                false,

            channelCode:
                subCategory.channelCode ??
                "CUSTOM",

            sellerId:
                subCategory.sellerId ??
                null,

            customerId:
                subCategory.customerId ??
                null,

            createdBy:
                subCategory.createdBy ??
                "System",

            updatedBy:
                subCategory.updatedBy ??
                null,

            productCount:
                subCategory.productCount ??
                0,

            parentCategory:
                subCategory.parentCategory ??
                parentCategoryName ??
                null,

            subCategories:
                Array.isArray(
                    subCategory.subCategories
                )
                    ? subCategory.subCategories
                        .map(
                            (child) =>
                                normalizeSubCategory(
                                    child,
                                    subCategory.categoryName
                                )
                        )
                        .filter(Boolean)
                    : [],

            bannerUrl:
                subCategory.bannerUrl ??
                "",

            iconUrl:
                subCategory.iconUrl ??
                "",

            metaTitle:
                subCategory.metaTitle ??
                "",

            metaDescription:
                subCategory.metaDescription ??
                "",

            isSystemDefined:
                subCategory.isSystemDefined ??
                false,

            hsnCode:
                subCategory.hsnCode ??
                "",

            gstPercentage:
                subCategory.gstPercentage ??
                null,
        };

    };

    // =====================================================
    // BUILD COMPLETE CATEGORY PAYLOAD
    //
    // IMPORTANT:
    // products are intentionally NOT included.
    //
    // Product is an EF navigation property and including
    // it can recreate the huge nested Product Swagger graph.
    // =====================================================

    const buildCategoryPayload = (
        category,
        options = {}
    ) => {

        const {

            categoryId,
            categoryName,
            isActive,

        } = options;

        const resolvedCategoryName =
            categoryName !== undefined
                ? categoryName
                : (
                    category?.categoryName ??
                    category?.name ??
                    ""
                );

        const resolvedCategoryId =
            categoryId !== undefined
                ? categoryId
                : (
                    category?.categoryId ??
                    category?.id ??
                    0
                );

        const resolvedIsActive =
            isActive !== undefined
                ? isActive
                : (
                    category?.isActive ??
                    true
                );

        return {

            // =================================================
            // BASIC CATEGORY INFORMATION
            // =================================================

            categoryId:
                resolvedCategoryId,

            categoryName:
                resolvedCategoryName,

            parentCategoryId:
                category?.parentCategoryId ??
                null,

            description:
                category?.description ??
                "",

            isActive:
                resolvedIsActive,

            createdDate:
                category?.createdDate ??
                new Date().toISOString(),

            updatedDate:
                category?.updatedDate ??
                null,

            // =================================================
            // CATEGORY IDENTIFICATION
            // =================================================

            categoryCode:
                category?.categoryCode ??
                "",

            categoryPath:
                category?.categoryPath ??
                "",

            categoryLevel:
                category?.categoryLevel ??
                null,

            displayOrder:
                category?.displayOrder ??
                0,

            // =================================================
            // IMAGE / BULK / CHANNEL
            // =================================================

            imageUrl:
                category?.imageUrl ??
                "",

            batchId:
                category?.batchId ??
                "",

            isBulkUpload:
                category?.isBulkUpload ??
                false,

            channelCode:
                category?.channelCode ??
                "CUSTOM",

            // =================================================
            // SELLER / CUSTOMER
            // =================================================

            sellerId:
                category?.sellerId ??
                null,

            customerId:
                category?.customerId ??
                null,

            // =================================================
            // AUDIT
            // =================================================

            createdBy:
                category?.createdBy ??
                "System",

            updatedBy:
                category?.updatedBy ??
                null,

            // =================================================
            // STATISTICS / PARENT
            // =================================================

            productCount:
                category?.productCount ??
                0,

            parentCategory:
                category?.parentCategoryName ??
                category?.parentCategory ??
                null,

            // =================================================
            // SUB CATEGORIES
            // =================================================

            subCategories:
                Array.isArray(
                    category?.subCategories
                )
                    ? category.subCategories
                        .map(
                            (subCategory) =>
                                normalizeSubCategory(
                                    subCategory,
                                    resolvedCategoryName
                                )
                        )
                        .filter(Boolean)
                    : [],

            // =================================================
            // SEO / DISPLAY
            // =================================================

            bannerUrl:
                category?.bannerUrl ??
                "",

            iconUrl:
                category?.iconUrl ??
                "",

            metaTitle:
                category?.metaTitle ??
                "",

            metaDescription:
                category?.metaDescription ??
                "",

            // =================================================
            // SYSTEM / TAX
            // =================================================

            isSystemDefined:
                category?.isSystemDefined ??
                false,

            hsnCode:
                category?.hsnCode ??
                "",

            gstPercentage:
                category?.gstPercentage ??
                null,

            // =================================================
            // IMPORTANT
            //
            // Do NOT send:
            //
            // products
            //
            // because Products is an EF navigation property.
            // =================================================

        };

    };

    // =====================================================
    // LOAD CATEGORIES
    //
    // STATUS FILTER IS HANDLED BY NODE SERVER
    //
    // GET:
    // /api/categories/filter?status=All
    // /api/categories/filter?status=Active
    // /api/categories/filter?status=Inactive
    // =====================================================

    const loadCategories =
        useCallback(
            async () => {

                try {

                    setLoading(true);

                    setError("");

                    console.log(
                        "================================="
                    );

                    console.log(
                        "GET CATEGORIES"
                    );

                    console.log(
                        "STATUS:",
                        statusFilter
                    );

                    console.log(
                        "URL:",
                        `${SERVER_URL}/api/categories/filter`
                    );

                    console.log(
                        "================================="
                    );

                    const response =
                        await axios.get(
                            `${SERVER_URL}/api/categories/filter`,
                            {
                                params: {
                                    status:
                                        statusFilter
                                },

                                headers: {
                                    Accept:
                                        "application/json",
                                },

                                timeout: 30000,
                            }
                        );

                    console.log(
                        "CATEGORY FILTER RESPONSE:",
                        response.data
                    );

                    const data =
                        response.data;

                    // =================================================
                    // NODE RESPONSE
                    //
                    // {
                    //     items: [],
                    //     page: 1,
                    //     limit: 10,
                    //     totalItems: 2,
                    //     totalPages: 1
                    // }
                    // =================================================

                    let items =
                        data?.items ||
                        [];

                    if (
                        !Array.isArray(items)
                    ) {

                        items = [];

                    }

                    setCategories(
                        items
                    );

                }
                catch (err) {

                    console.error(
                        "CATEGORY LOADING ERROR:",
                        err
                    );

                    const message =
                        err.response?.data?.message ||
                        err.response?.data ||
                        err.message ||
                        "Failed to load categories.";

                    showError(
                        typeof message === "string"
                            ? message
                            : "Failed to load categories."
                    );

                    setCategories([]);

                }
                finally {

                    setLoading(false);

                }

            },
            [
                statusFilter,
                showError
            ]
        );

    // =====================================================
    // LOAD WHEN STATUS CHANGES
    // =====================================================

    useEffect(() => {

        loadCategories();

    }, [
        loadCategories
    ]);

    // =====================================================
    // SEARCH
    //
    // STATUS FILTER IS ALREADY HANDLED BY NODE.
    // =====================================================

    useEffect(() => {

        let result =
            [...categories];

        // =================================================
        // SEARCH
        // =================================================

        if (
            searchText &&
            searchText.trim() !== ""
        ) {

            const search =
                searchText
                    .trim()
                    .toLowerCase();

            result =
                result.filter(
                    (category) => {

                        const categoryName =
                            category.categoryName ||
                            category.name ||
                            "";

                        const description =
                            category.description ||
                            "";

                        const parentCategory =
                            category.parentCategoryName ||
                            category.parentCategory ||
                            "";

                        const categoryCode =
                            category.categoryCode ||
                            "";

                        const categoryPath =
                            category.categoryPath ||
                            "";

                        const hsnCode =
                            category.hsnCode ||
                            "";

                        return (

                            categoryName
                                .toLowerCase()
                                .includes(search)

                            ||

                            description
                                .toLowerCase()
                                .includes(search)

                            ||

                            parentCategory
                                .toString()
                                .toLowerCase()
                                .includes(search)

                            ||

                            categoryCode
                                .toLowerCase()
                                .includes(search)

                            ||

                            categoryPath
                                .toLowerCase()
                                .includes(search)

                            ||

                            hsnCode
                                .toLowerCase()
                                .includes(search)

                        );

                    }
                );

        }

        setFilteredCategories(
            result
        );

        setPage(0);

    }, [
        categories,
        searchText
    ]);

    // =====================================================
    // PAGINATED CATEGORIES
    // =====================================================

    const paginatedCategories =
        filteredCategories.slice(
            page * rowsPerPage,
            page * rowsPerPage +
                rowsPerPage
        );

    // =====================================================
    // ADD CATEGORY
    // =====================================================

    const handleAdd = () => {

        navigate(
            "/categories/create"
        );

    };

    // =====================================================
    // VIEW CATEGORY
    // =====================================================

    const handleView = (
        category
    ) => {

        const categoryId =
            getCategoryId(
                category
            );

        console.log(
            "VIEW CATEGORY:",
            category
        );

        if (!categoryId) {

            showError(
                "Category ID not found."
            );

            return;

        }

        navigate(
            `/categories/details/${categoryId}`
        );

    };

    // =====================================================
    // EDIT CATEGORY
    // =====================================================

    const handleEdit = (
        category
    ) => {

        const categoryId =
            getCategoryId(
                category
            );

        if (!categoryId) {

            showError(
                "Category ID not found."
            );

            return;

        }

        navigate(
            `/categories/edit/${categoryId}`
        );

    };

    // =====================================================
    // VIEW CATEGORY PRODUCTS
    // =====================================================

    const handleViewProducts = (
        category
    ) => {

        const categoryId =
            getCategoryId(
                category
            );

        if (!categoryId) {

            showError(
                "Category ID not found."
            );

            return;

        }

        navigate(
            `/categories/${categoryId}/products`
        );

    };

    // =====================================================
    // ADD SUBCATEGORY
    // =====================================================

    const handleAddSubcategory = (
        category
    ) => {

        const categoryId =
            getCategoryId(
                category
            );

        if (!categoryId) {

            showError(
                "Category ID not found."
            );

            return;

        }

        navigate(
            `/categories/create?parentId=${categoryId}`
        );

    };

    // =====================================================
    // DUPLICATE CATEGORY
    // =====================================================

    const handleDuplicate =
        async (
            category
        ) => {

            try {

                const categoryId =
                    getCategoryId(
                        category
                    );

                if (!categoryId) {

                    showError(
                        "Category ID not found."
                    );

                    return;

                }

                setLoading(true);

                // =================================================
                // GET ORIGINAL CATEGORY
                //
                // This is important because the list response may
                // not contain every Category DTO field.
                // =================================================

                const response =
                    await axios.get(
                        `${SERVER_URL}/api/categories/${categoryId}`,
                        {
                            headers: {
                                Accept:
                                    "application/json",
                            },

                            timeout: 30000,
                        }
                    );

                const original =
                    response.data;

                // =================================================
                // BUILD COMPLETE COPY
                //
                // New category must have CategoryId = 0.
                // =================================================

                const duplicateData =
                    buildCategoryPayload(
                        original,
                        {
                            categoryId: 0,

                            categoryName:
                                `${
                                    original.categoryName ||
                                    category.categoryName ||
                                    "Category"
                                } Copy`,
                        }
                    );

                console.log(
                    "DUPLICATE CATEGORY PAYLOAD:",
                    duplicateData
                );

                // =================================================
                // CREATE DUPLICATE
                // =================================================

                await axios.post(
                    `${SERVER_URL}/api/categories`,
                    duplicateData,
                    {
                        headers: {
                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json",
                        },

                        timeout: 30000,
                    }
                );

                await loadCategories();

            }
            catch (err) {

                console.error(
                    "DUPLICATE CATEGORY ERROR:",
                    err
                );

                const message =
                    err.response?.data?.message ||
                    err.response?.data ||
                    err.message ||
                    "Failed to duplicate category.";

                showError(
                    typeof message === "string"
                        ? message
                        : "Failed to duplicate category."
                );

            }
            finally {

                setLoading(false);

            }

        };

    // =====================================================
    // TOGGLE STATUS
    // =====================================================

    const handleToggleStatus =
        async (
            category
        ) => {

            try {

                const categoryId =
                    getCategoryId(
                        category
                    );

                if (!categoryId) {

                    showError(
                        "Category ID not found."
                    );

                    return;

                }

                // =================================================
                // GET COMPLETE CATEGORY
                //
                // Do not rely only on the table row because the
                // table may contain a reduced category object.
                // =================================================

                const response =
                    await axios.get(
                        `${SERVER_URL}/api/categories/${categoryId}`,
                        {
                            headers: {
                                Accept:
                                    "application/json",
                            },

                            timeout: 30000,
                        }
                    );

                const original =
                    response.data;

                // =================================================
                // TOGGLE ONLY isActive
                //
                // All other Category DTO fields remain unchanged.
                // =================================================

                const updateData =
                    buildCategoryPayload(
                        original,
                        {
                            categoryId:
                                categoryId,

                            categoryName:
                                original.categoryName ||
                                category.categoryName ||
                                "",

                            isActive:
                                !Boolean(
                                    original.isActive ??
                                    category.isActive
                                ),
                        }
                    );

                console.log(
                    "UPDATE CATEGORY PAYLOAD:",
                    updateData
                );

                // =================================================
                // UPDATE
                // =================================================

                await axios.put(
                    `${SERVER_URL}/api/categories/${categoryId}`,
                    updateData,
                    {
                        headers: {
                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json",
                        },

                        timeout: 30000,
                    }
                );

                await loadCategories();

            }
            catch (err) {

                console.error(
                    "TOGGLE CATEGORY ERROR:",
                    err
                );

                const message =
                    err.response?.data?.message ||
                    err.response?.data ||
                    err.message ||
                    "Failed to update category status.";

                showError(
                    typeof message === "string"
                        ? message
                        : "Failed to update category status."
                );

            }

        };

    // =====================================================
    // DELETE CATEGORY
    // =====================================================

    const handleDelete = (
        category
    ) => {

        setSelectedCategory(
            category
        );

        setDeleteOpen(true);

    };

    // =====================================================
    // DELETE CLOSE
    // =====================================================

    const handleDeleteClose = () => {

        setDeleteOpen(false);

        setSelectedCategory(null);

    };

    // =====================================================
    // DELETE SUCCESS
    // =====================================================

    const handleDeleted =
        async () => {

            setDeleteOpen(false);

            setSelectedCategory(null);

            await loadCategories();

        };

    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handlePageChange = (
        event,
        newPage
    ) => {

        setPage(
            newPage
        );

    };

    // =====================================================
    // ROWS PER PAGE
    // =====================================================

    const handleRowsPerPageChange = (
        event
    ) => {

        const value =
            parseInt(
                event.target.value,
                10
            );

        setRowsPerPage(
            value
        );

        setPage(0);

    };

    // =====================================================
    // EXPORT
    // =====================================================

    const handleExport = () => {

        const headers = [

            "Category ID",
            "Category Name",
            "Parent Category",
            "Description",
            "Category Code",
            "Category Path",
            "Category Level",
            "Display Order",
            "Status",
            "Channel Code",
            "Seller ID",
            "Customer ID",
            "Product Count",
            "HSN Code",
            "GST Percentage",
            "Batch ID",
            "Created By",
            "Updated By",
            "Created Date",
            "Updated Date",

        ];

        const rows =
            filteredCategories.map(
                (category) => [

                    category.categoryId ??
                    category.id ??
                    "",

                    category.categoryName ||
                    category.name ||
                    "",

                    category.parentCategoryName ||
                    category.parentCategory ||
                    "Root",

                    category.description ||
                    "",

                    category.categoryCode ||
                    "",

                    category.categoryPath ||
                    "",

                    category.categoryLevel ??
                    "",

                    category.displayOrder ??
                    "",

                    category.isActive
                        ? "Active"
                        : "Inactive",

                    category.channelCode ||
                    "",

                    category.sellerId ??
                    "",

                    category.customerId ??
                    "",

                    category.productCount ??
                    0,

                    category.hsnCode ||
                    "",

                    category.gstPercentage ??
                    "",

                    category.batchId ||
                    "",

                    category.createdBy ||
                    "",

                    category.updatedBy ||
                    "",

                    category.createdDate
                        ? new Date(
                            category.createdDate
                        ).toLocaleDateString()
                        : "",

                    category.updatedDate
                        ? new Date(
                            category.updatedDate
                        ).toLocaleDateString()
                        : "",

                ]
            );

        const csv =
            [
                headers,
                ...rows,
            ]
                .map(
                    (row) =>
                        row
                            .map(
                                (value) =>
                                    `"${String(
                                        value
                                    ).replace(
                                        /"/g,
                                        '""'
                                    )}"`
                            )
                            .join(",")
                )
                .join("\n");

        const blob =
            new Blob(
                [csv],
                {
                    type:
                        "text/csv;charset=utf-8;",
                }
            );

        const url =
            URL.createObjectURL(
                blob
            );

        const link =
            document.createElement(
                "a"
            );

        link.href =
            url;

        link.download =
            "categories.csv";

        document.body.appendChild(
            link
        );

        link.click();

        document.body.removeChild(
            link
        );

        URL.revokeObjectURL(
            url
        );

    };

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box>

            {/* =================================================
                TOOLBAR
            ================================================== */}

            <CategoryToolbar

                onAdd={
                    handleAdd
                }

                onRefresh={
                    loadCategories
                }

                onExport={
                    handleExport
                }

            />

            {/* =================================================
                CONTENT
            ================================================== */}

            <Grid
                container
                spacing={2}
                sx={{
                    mt: 1,
                }}
            >

                {/* =================================================
                    STATISTICS
                ================================================== */}

                <Grid
                    item
                    xs={12}
                >

                    <CategoryStatistics
                        categories={
                            categories
                        }
                    />

                </Grid>

                {/* =================================================
                    SEARCH
                ================================================== */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <CategorySearch

                        searchText={
                            searchText
                        }

                        setSearchText={
                            setSearchText
                        }

                    />

                </Grid>

                {/* =================================================
                    STATUS FILTER
                ================================================== */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <CategoryFilters

                        statusFilter={
                            statusFilter
                        }

                        setStatusFilter={
                            setStatusFilter
                        }

                    />

                </Grid>

                {/* =================================================
                    TABLE
                ================================================== */}

                <Grid
                    item
                    xs={12}
                >

                    <Paper
                        sx={{
                            p: 2,
                        }}
                    >

                        {loading ? (

                            <Box
                                sx={{
                                    minHeight:
                                        300,

                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "center",
                                }}
                            >

                                <CircularProgress />

                            </Box>

                        ) : (

                            <CategoryTable

                                categories={
                                    paginatedCategories
                                }

                                loading={
                                    loading
                                }

                                onView={
                                    handleView
                                }

                                onEdit={
                                    handleEdit
                                }

                                onViewProducts={
                                    handleViewProducts
                                }

                                onAddSubcategory={
                                    handleAddSubcategory
                                }

                                onDuplicate={
                                    handleDuplicate
                                }

                                onToggleStatus={
                                    handleToggleStatus
                                }

                                onDelete={
                                    handleDelete
                                }

                            />

                        )}

                        {/* =================================================
                            PAGINATION
                        ================================================== */}

                        {!loading && (

                            <CategoryPagination

                                page={
                                    page
                                }

                                rowsPerPage={
                                    rowsPerPage
                                }

                                totalRecords={
                                    filteredCategories.length
                                }

                                onPageChange={
                                    handlePageChange
                                }

                                onRowsPerPageChange={
                                    handleRowsPerPageChange
                                }

                            />

                        )}

                    </Paper>

                </Grid>

            </Grid>

            {/* =================================================
                DELETE DIALOG
            ================================================== */}

            <DeleteCategoryDialog

                open={
                    deleteOpen
                }

                category={
                    selectedCategory
                }

                onClose={
                    handleDeleteClose
                }

                onDeleted={
                    handleDeleted
                }

            />

            {/* =================================================
                ERROR SNACKBAR
            ================================================== */}

            <Snackbar

                open={
                    snackbarOpen
                }

                autoHideDuration={
                    5000
                }

                onClose={() =>
                    setSnackbarOpen(false)
                }

            >

                <Alert
                    severity="error"

                    onClose={() =>
                        setSnackbarOpen(false)
                    }

                    sx={{
                        width:
                            "100%",
                    }}
                >

                    {error}

                </Alert>

            </Snackbar>

        </Box>

    );

};

export default CategoryList;
