// =========================================================
// CategoryList.jsx
// =========================================================

import React, {
    useEffect,
    useState
} from "react";

import axios from "axios";

import {
    Alert,
    Box,
    CircularProgress,
    Grid,
    Paper,
    Snackbar
} from "@mui/material";

import {
    useNavigate
} from "react-router-dom";

import CategoryToolbar from "./CategoryToolbar";
import CategoryStatistics from "./CategoryStatistics";
import CategorySearch from "./CategorySearch";
import CategoryFilters from "./CategoryFilters";
import CategoryTable from "./CategoryTable";
import CategoryPagination from "./CategoryPagination";
import DeleteCategoryDialog from "./DeleteCategoryDialog";
import CategoryModal from "./CategoryModal";

// =========================================================
// SERVER
// =========================================================

const SERVER_URL =
    "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const CategoryList = () => {

    const navigate = useNavigate();

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
    // FILTER
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
    // DELETE
    // =====================================================

    const [
        deleteOpen,
        setDeleteOpen
    ] = useState(false);

    // =====================================================
    // DETAILS
    // =====================================================

    const [
        viewOpen,
        setViewOpen
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
    // LOAD ALL CATEGORIES
    // =====================================================

    const loadCategories = async () => {

        try {

            setLoading(true);

            setError("");

            console.log(
                "================================="
            );

            console.log(
                "GET ALL CATEGORIES"
            );

            console.log(
                "URL:",
                `${SERVER_URL}/api/categories`
            );

            console.log(
                "================================="
            );

            const response =
                await axios.get(
                    `${SERVER_URL}/api/categories`,
                    {
                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "CATEGORY RESPONSE:",
                response.data
            );

            // =================================================
            // NORMALIZE RESPONSE
            // =================================================

            let data =
                response.data;

            // -----------------------------------------------
            // { items: [] }
            // -----------------------------------------------

            if (
                data &&
                Array.isArray(
                    data.items
                )
            ) {

                data =
                    data.items;

            }

            // -----------------------------------------------
            // { data: [] }
            // -----------------------------------------------

            else if (
                data &&
                Array.isArray(
                    data.data
                )
            ) {

                data =
                    data.data;

            }

            // -----------------------------------------------
            // { categories: [] }
            // -----------------------------------------------

            else if (
                data &&
                Array.isArray(
                    data.categories
                )
            ) {

                data =
                    data.categories;

            }

            // -----------------------------------------------
            // DIRECT ARRAY
            // -----------------------------------------------

            if (
                !Array.isArray(data)
            ) {

                data = [];

            }

            setCategories(data);

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
                "Failed to load categories";

            setError(
                typeof message === "string"
                    ? message
                    : "Failed to load categories"
            );

            setSnackbarOpen(true);

            setCategories([]);

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadCategories();

    }, []);


    // =====================================================
    // SEARCH + FILTER
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
                                .toLowerCase()
                                .includes(search)

                        );

                    }
                );

        }


        // =================================================
        // STATUS FILTER
        // =================================================

        if (
            statusFilter &&
            statusFilter !== "All"
        ) {

            const active =
                statusFilter === "Active";

            result =
                result.filter(
                    (category) =>
                        Boolean(
                            category.isActive
                        ) === active
                );

        }


        // =================================================
        // UPDATE
        // =================================================

        setFilteredCategories(
            result
        );

        // Reset pagination
        setPage(0);

    }, [
        categories,
        searchText,
        statusFilter
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
    // VIEW CATEGORY
    // =====================================================

    const handleView = (
        category
    ) => {

        setSelectedCategory(
            category
        );

        setViewOpen(true);

    };


    // =====================================================
    // EDIT CATEGORY
    // =====================================================

    const handleEdit = (
        category
    ) => {

        const categoryId =
            category.categoryId ||
            category.id;

        if (!categoryId) {

            console.error(
                "Category ID not found"
            );

            return;

        }

        navigate(
            `/categories/edit/${categoryId}`
        );

    };


    // =====================================================
    // DUPLICATE CATEGORY
    // =====================================================

    const handleDuplicate = async (
        category
    ) => {

        try {

            const categoryId =
                category.categoryId ||
                category.id;

            if (!categoryId) {

                return;

            }

            setLoading(true);

            // ---------------------------------------------
            // GET ORIGINAL
            // ---------------------------------------------

            const response =
                await axios.get(
                    `${SERVER_URL}/api/categories/${categoryId}`,
                    {
                        headers: {
                            Accept:
                                "application/json"
                        }
                    }
                );

            const original =
                response.data;

            // ---------------------------------------------
            // CREATE COPY
            // ---------------------------------------------

            const duplicateData = {

                categoryName:
                    `${original.categoryName || category.categoryName} Copy`,

                parentCategoryId:
                    original.parentCategoryId ||
                    null,

                description:
                    original.description ||
                    "",

                isActive:
                    original.isActive ??
                    true

            };

            await axios.post(
                `${SERVER_URL}/api/categories`,
                duplicateData,
                {
                    headers: {
                        "Content-Type":
                            "application/json",

                        Accept:
                            "application/json"
                    },

                    timeout: 30000
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
                "Failed to duplicate category";

            setError(
                typeof message === "string"
                    ? message
                    : "Failed to duplicate category"
            );

            setSnackbarOpen(true);

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // TOGGLE STATUS
    // =====================================================

    const handleToggleStatus = async (
        category
    ) => {

        try {

            const categoryId =
                category.categoryId ||
                category.id;

            if (!categoryId) {

                return;

            }

            const newStatus =
                !Boolean(
                    category.isActive
                );

            const updateData = {

                categoryName:
                    category.categoryName ||
                    category.name ||
                    "",

                parentCategoryId:
                    category.parentCategoryId ||
                    null,

                description:
                    category.description ||
                    "",

                isActive:
                    newStatus

            };

            await axios.put(
                `${SERVER_URL}/api/categories/${categoryId}`,
                updateData,
                {
                    headers: {
                        "Content-Type":
                            "application/json",

                        Accept:
                            "application/json"
                    },

                    timeout: 30000
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
                "Failed to update category status";

            setError(
                typeof message === "string"
                    ? message
                    : "Failed to update category status"
            );

            setSnackbarOpen(true);

        }

    };


    // =====================================================
    // DELETE
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

    const handleDeleted = async () => {

        setDeleteOpen(false);

        setSelectedCategory(null);

        await loadCategories();

    };


    // =====================================================
    // VIEW CLOSE
    // =====================================================

    const handleViewClose = () => {

        setViewOpen(false);

        setSelectedCategory(null);

    };


    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handlePageChange = (
        event,
        newPage
    ) => {

        setPage(newPage);

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
            "Status",
            "Created Date",
            "Updated Date"

        ];

        const rows =
            filteredCategories.map(
                (category) => [

                    category.categoryId ||
                    category.id ||
                    "",

                    category.categoryName ||
                    category.name ||
                    "",

                    category.parentCategoryName ||
                    "Root",

                    category.description ||
                    "",

                    category.isActive
                        ? "Active"
                        : "Inactive",

                    category.createdDate
                        ? new Date(
                            category.createdDate
                        ).toLocaleDateString()
                        : "",

                    category.updatedDate
                        ? new Date(
                            category.updatedDate
                        ).toLocaleDateString()
                        : ""

                ]
            );

        const csv =
            [
                headers,
                ...rows
            ]
                .map(
                    row =>
                        row
                            .map(
                                value =>
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
                        "text/csv;charset=utf-8;"
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
                CATEGORY TOOLBAR
            ================================================== */}

            <CategoryToolbar

                onAdd={() =>
                    navigate(
                        "/categories/create"
                    )
                }

                onRefresh={
                    loadCategories
                }

                onExport={
                    handleExport
                }

            />


            {/* =================================================
                CATEGORY CONTENT
            ================================================== */}

            <Grid
                container
                spacing={2}
                sx={{
                    mt: 1
                }}
            >

                {/* =================================================
                    CATEGORY STATISTICS
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
                    CATEGORY SEARCH
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
                    CATEGORY FILTERS
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
                    CATEGORY TABLE
                ================================================== */}

                <Grid
                    item
                    xs={12}
                >

                    <Paper
                        sx={{
                            p: 2
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
                                        "center"
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
                CATEGORY DETAILS
            ================================================== */}

            <CategoryModal

                open={
                    viewOpen
                }

                category={
                    selectedCategory
                }

                onClose={
                    handleViewClose
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
                        width: "100%"
                    }}
                >

                    {error}

                </Alert>

            </Snackbar>

        </Box>

    );

};

export default CategoryList;
