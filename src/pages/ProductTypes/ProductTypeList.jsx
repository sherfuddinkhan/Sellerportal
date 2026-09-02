// =========================================================
// ProductTypeList.jsx
// Central Product Type Management Page
//
// React
//   ↓
// Axios
//   ↓
// Node server.js :5000
//   ↓
// ASP.NET Core :7203
// =========================================================

import React, {
    useCallback,
    useEffect,
    useMemo,
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
    Typography,
} from "@mui/material";

import {
    useNavigate,
} from "react-router-dom";

import ProductTypeToolbar from "./ProductTypeToolbar";
import ProductTypeStatistics from "./ProductTypeStatistics";
import ProductTypeSearch from "./ProductTypeSearch";
import ProductTypeFilters from "./ProductTypeFilters";
import ProductTypeTable from "./ProductTypeTable";
import ProductTypePagination from "./ProductTypePagination";
import DeleteProductTypeDialog from "./DeleteProductTypeDialog";


// =========================================================
// NODE SERVER URL
// =========================================================

const NODE_API_URL = "http://localhost:5000";


// =========================================================
// PRODUCT TYPE LIST
// =========================================================

const ProductTypeList = () => {

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [productTypes, setProductTypes] = useState([]);

    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");

    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [selectedProductType, setSelectedProductType] =
        useState(null);

    const [deleteOpen, setDeleteOpen] = useState(false);


    // =====================================================
    // SNACKBAR
    // =====================================================

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });


    // =====================================================
    // SHOW MESSAGE
    // =====================================================

    const showMessage = useCallback(
        (message, severity = "success") => {

            setSnackbar({
                open: true,
                message,
                severity,
            });

        },
        []
    );


    // =====================================================
    // CLOSE SNACKBAR
    // =====================================================

    const handleSnackbarClose = () => {

        setSnackbar((previous) => ({
            ...previous,
            open: false,
        }));

    };


    // =====================================================
    // LOAD PRODUCT TYPES
    // =====================================================

    const loadProductTypes = useCallback(
        async () => {

            try {

                setLoading(true);


                const response = await axios.get(
                    `${NODE_API_URL}/api/product-types`
                );


                const data = response.data;


                // -------------------------------------------------
                // Support:
                //
                // Array
                // { items: [] }
                // { data: [] }
                // -------------------------------------------------

                let items = [];


                if (Array.isArray(data)) {

                    items = data;

                }
                else if (
                    Array.isArray(data?.items)
                ) {

                    items = data.items;

                }
                else if (
                    Array.isArray(data?.data)
                ) {

                    items = data.data;

                }


                setProductTypes(items);

            }
            catch (error) {

                console.error(
                    "Product Type Load Error:",
                    error
                );


                setProductTypes([]);


                showMessage(
                    error?.response?.data?.message ||
                    "Failed to load product types.",
                    "error"
                );

            }
            finally {

                setLoading(false);

            }

        },
        [showMessage]
    );


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadProductTypes();

    }, [loadProductTypes]);


    // =====================================================
    // FILTER
    // =====================================================

    const filteredProductTypes = useMemo(
        () => {

            let result = [
                ...productTypes
            ];


            // -------------------------------------------------
            // SEARCH
            // -------------------------------------------------

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
                        (item) => {

                            const name =
                                item
                                    ?.productTypeName
                                    ?.toString()
                                    .toLowerCase() ||
                                "";


                            const description =
                                item
                                    ?.description
                                    ?.toString()
                                    .toLowerCase() ||
                                "";


                            const id =
                                item
                                    ?.productTypeId
                                    ?.toString()
                                    .toLowerCase() ||
                                "";


                            return (
                                name.includes(search) ||
                                description.includes(search) ||
                                id.includes(search)
                            );

                        }
                    );

            }


            // -------------------------------------------------
            // STATUS
            // -------------------------------------------------

            if (
                statusFilter !== "All"
            ) {

                const active =
                    statusFilter === "Active";


                result =
                    result.filter(
                        (item) =>
                            Boolean(
                                item.isActive
                            ) === active
                    );

            }


            return result;

        },
        [
            productTypes,
            searchText,
            statusFilter,
        ]
    );


    // =====================================================
    // RESET PAGE
    // =====================================================

    useEffect(() => {

        setPage(0);

    }, [
        searchText,
        statusFilter,
        rowsPerPage,
    ]);


    // =====================================================
    // PAGINATION
    // =====================================================

    const paginatedProductTypes =
        useMemo(
            () => {

                const start =
                    page * rowsPerPage;


                const end =
                    start + rowsPerPage;


                return filteredProductTypes.slice(
                    start,
                    end
                );

            },
            [
                filteredProductTypes,
                page,
                rowsPerPage,
            ]
        );


    // =====================================================
    // VIEW
    //
    // IMPORTANT:
    // This navigates using the REAL ID.
    //
    // /product-types/details/5
    //
    // NOT:
    //
    // /product-types/details/:id
    // =====================================================

    const handleView = (row) => {

        const id =
            row?.productTypeId;


        console.log(
            "View Product Type:",
            row
        );


        if (
            id === undefined ||
            id === null ||
            id === ""
        ) {

            showMessage(
                "Product type ID is missing.",
                "error"
            );

            return;

        }


        navigate(
            `/product-types/details/${id}`
        );

    };


    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = (row) => {

        const id =
            row?.productTypeId;


        if (
            id === undefined ||
            id === null ||
            id === ""
        ) {

            showMessage(
                "Product type ID is missing.",
                "error"
            );

            return;

        }


        navigate(
            `/product-types/edit/${id}`
        );

    };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = (row) => {

        setSelectedProductType(row);

        setDeleteOpen(true);

    };


    // =====================================================
    // DELETE COMPLETED
    // =====================================================

    const handleDeleted = async () => {

        setDeleteOpen(false);

        setSelectedProductType(null);


        await loadProductTypes();


        showMessage(
            "Product type deleted successfully.",
            "success"
        );

    };


    // =====================================================
    // CLOSE DELETE
    // =====================================================

    const handleDeleteClose = () => {

        if (loading) return;


        setDeleteOpen(false);

        setSelectedProductType(null);

    };


    // =====================================================
    // EXPORT CSV
    // =====================================================

    const handleExport = () => {

        if (
            filteredProductTypes.length === 0
        ) {

            showMessage(
                "No product types available to export.",
                "warning"
            );

            return;

        }


        const headers = [
            "Product Type ID",
            "Product Type Name",
            "Description",
            "Status",
            "Created Date",
            "Updated Date",
        ];


        const rows =
            filteredProductTypes.map(
                (item) => [

                    item.productTypeId ?? "",

                    item.productTypeName ?? "",

                    item.description ?? "",

                    item.isActive
                        ? "Active"
                        : "Inactive",

                    item.createdDate ?? "",

                    item.updatedDate ?? "",

                ]
            );


        const csv = [

            headers,

            ...rows,

        ]
            .map(
                (row) =>
                    row
                        .map(
                            (value) =>
                                `"${String(value)
                                    .replaceAll('"', '""')}"`
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
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            "product-types.csv";


        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);


        showMessage(
            "Product types exported successfully.",
            "success"
        );

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box
            sx={{
                width: "100%",
            }}
        >

            {/* =================================================
                TOOLBAR
            ================================================= */}

            <ProductTypeToolbar

                onAdd={() =>
                    navigate(
                        "/product-types/create"
                    )
                }

                onRefresh={
                    loadProductTypes
                }

                onExport={
                    handleExport
                }

            />


            {/* =================================================
                CONTENT
            ================================================= */}

            <Grid
                container
                spacing={2}
            >

                {/* =================================================
                    STATISTICS
                ================================================= */}

                <Grid item xs={12}>

                    <ProductTypeStatistics
                        productTypes={
                            productTypes
                        }
                    />

                </Grid>


                {/* =================================================
                    SEARCH
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <ProductTypeSearch

                        searchText={
                            searchText
                        }

                        setSearchText={
                            setSearchText
                        }

                    />

                </Grid>


                {/* =================================================
                    FILTER
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <ProductTypeFilters

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
                ================================================= */}

<Grid
    item
    xs={12}
    sx={{
        minWidth: 0,
    }}
>
    <Paper
        elevation={2}
        sx={{
            p: { xs: 1, sm: 2 },
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            boxSizing: "border-box",
            overflow: "hidden",
        }}
    >

        {loading ? (

            <Box
                sx={{
                    minHeight: 300,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </Box>

        ) : filteredProductTypes.length === 0 ? (

            <Box
                sx={{
                    minHeight: 300,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                <Typography
                    variant="h6"
                    color="text.secondary"
                >
                    No product types found
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Try changing your search or filter.
                </Typography>
            </Box>

        ) : (

            <Box
                sx={{
                    width: "100%",
                    maxWidth: "100%",
                    minWidth: 0,
                    overflowX: "auto",
                    overflowY: "hidden",
                    WebkitOverflowScrolling: "touch",
                }}
            >
                <ProductTypeTable
                    productTypes={paginatedProductTypes}
                    loading={loading}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </Box>

        )}

        {!loading &&
            filteredProductTypes.length > 0 && (
                <ProductTypePagination
                    page={page}
                    rowsPerPage={rowsPerPage}
                    totalRecords={filteredProductTypes.length}
                    onPageChange={(event, newPage) => {
                        setPage(newPage);
                    }}
                    onRowsPerPageChange={(event) => {
                        const value = parseInt(
                            event.target.value,
                            10
                        );

                        setRowsPerPage(value);
                        setPage(0);
                    }}
                />
            )}

    </Paper>
</Grid>


            </Grid>


            {/* =================================================
                DELETE DIALOG
            ================================================= */}

            <DeleteProductTypeDialog

                open={
                    deleteOpen
                }

                productType={
                    selectedProductType
                }

                onClose={
                    handleDeleteClose
                }

                onDeleted={
                    handleDeleted
                }

            />


            {/* =================================================
                SNACKBAR
            ================================================= */}

            <Snackbar

                open={
                    snackbar.open
                }

                autoHideDuration={
                    4000
                }

                onClose={
                    handleSnackbarClose
                }

                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}

            >

                <Alert

                    onClose={
                        handleSnackbarClose
                    }

                    severity={
                        snackbar.severity
                    }

                    variant="filled"

                    sx={{
                        width: "100%",
                    }}

                >

                    {
                        snackbar.message
                    }

                </Alert>

            </Snackbar>

        </Box>

    );

};


// =========================================================
// EXPORT
// =========================================================

export default ProductTypeList;
