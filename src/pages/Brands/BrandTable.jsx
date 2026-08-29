import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Box,
    Chip,
    IconButton,
    Tooltip,
    TextField,
    MenuItem,
    InputAdornment,
    Stack
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import {
    Visibility,
    Edit,
    Delete,
    AccountTree,
    Search,
    Clear
} from "@mui/icons-material";


const BrandTable = ({
    brands = [],
    loading = false,
    onView,
    onEdit,
    onDelete,
    onModels
}) => {

    // =========================================================
    // SEARCH
    // =========================================================

    const [searchText, setSearchText] =
        useState("");


    // =========================================================
    // STATUS FILTER
    // =========================================================

    const [statusFilter, setStatusFilter] =
        useState("All");


    // =========================================================
    // RESET SEARCH/FILTER WHEN BRAND DATA CHANGES
    // =========================================================

    useEffect(() => {

        setSearchText("");
        setStatusFilter("All");

    }, [brands]);


    // =========================================================
    // FILTER BRANDS
    // =========================================================

    const filteredBrands = useMemo(() => {

        let result = [...brands];


        // =====================================================
        // SEARCH
        // =====================================================

        const search =
            searchText
                .trim()
                .toLowerCase();


        if (search !== "") {

            result = result.filter((brand) => {

                const brandName =
                    brand?.brandName ??
                    brand?.BrandName ??
                    "";

                const description =
                    brand?.description ??
                    brand?.Description ??
                    "";


                return (
                    String(brandName)
                        .toLowerCase()
                        .includes(search)
                    ||
                    String(description)
                        .toLowerCase()
                        .includes(search)
                );

            });

        }


        // =====================================================
        // STATUS FILTER
        // =====================================================

        if (statusFilter !== "All") {

            result = result.filter((brand) => {

                const isActive =
                    brand?.isActive ??
                    brand?.IsActive ??
                    false;


                if (statusFilter === "Active") {

                    return isActive === true;

                }


                if (statusFilter === "Inactive") {

                    return isActive === false;

                }


                return true;

            });

        }


        return result;

    }, [
        brands,
        searchText,
        statusFilter
    ]);


    // =========================================================
    // CLEAR SEARCH
    // =========================================================

    const handleClearSearch = () => {

        setSearchText("");

    };


    // =========================================================
    // COLUMNS
    // =========================================================

    const columns = [

        // =====================================================
        // ID
        // =====================================================

        {
            field: "brandId",

            headerName: "ID",

            width: 90
        },


        // =====================================================
        // BRAND NAME
        // =====================================================

        {
            field: "brandName",

            headerName: "Brand Name",

            flex: 1.5,

            minWidth: 180
        },


        // =====================================================
        // DESCRIPTION
        // =====================================================

        {
            field: "description",

            headerName: "Description",

            flex: 2,

            minWidth: 250,

            renderCell: (params) => (

                <span>

                    {params.value || "-"}

                </span>

            )
        },


        // =====================================================
        // STATUS
        // =====================================================

        {
            field: "isActive",

            headerName: "Status",

            width: 120,

            renderCell: (params) => (

                <Chip
                    label={
                        params.value
                            ? "Active"
                            : "Inactive"
                    }

                    color={
                        params.value
                            ? "success"
                            : "error"
                    }

                    size="small"
                />

            )
        },


        // =====================================================
        // CREATED DATE
        // =====================================================

        {
            field: "createdDate",

            headerName: "Created Date",

            width: 180,

            renderCell: (params) => (

                params.value

                    ? new Date(
                        params.value
                    ).toLocaleDateString()

                    : "-"

            )
        },


        // =====================================================
        // UPDATED DATE
        // =====================================================

        {
            field: "updatedDate",

            headerName: "Updated Date",

            width: 180,

            renderCell: (params) => (

                params.value

                    ? new Date(
                        params.value
                    ).toLocaleDateString()

                    : "-"

            )
        },


        // =====================================================
        // ACTIONS
        // =====================================================

        {
            field: "actions",

            headerName: "Actions",

            width: 230,

            sortable: false,

            filterable: false,

            renderCell: (params) => {

                const brand =
                    params.row;


                return (

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center"
                        }}
                    >

                        {/* =====================================
                            BRAND MODELS
                        ===================================== */}

                        <Tooltip title="Brand Models">

                            <IconButton
                                color="secondary"

                                onClick={() =>
                                    onModels?.(
                                        brand
                                    )
                                }
                            >

                                <AccountTree />

                            </IconButton>

                        </Tooltip>


                        {/* =====================================
                            VIEW
                        ===================================== */}

                        <Tooltip title="View">

                            <IconButton
                                color="primary"

                                onClick={() =>
                                    onView?.(
                                        brand
                                    )
                                }
                            >

                                <Visibility />

                            </IconButton>

                        </Tooltip>


                        {/* =====================================
                            EDIT
                        ===================================== */}

                        <Tooltip title="Edit">

                            <IconButton
                                color="warning"

                                onClick={() =>
                                    onEdit?.(
                                        brand
                                    )
                                }
                            >

                                <Edit />

                            </IconButton>

                        </Tooltip>


                        {/* =====================================
                            DELETE
                        ===================================== */}

                        <Tooltip title="Delete">

                            <IconButton
                                color="error"

                                onClick={() =>
                                    onDelete?.(
                                        brand
                                    )
                                }
                            >

                                <Delete />

                            </IconButton>

                        </Tooltip>

                    </Box>

                );

            }

        }

    ];


    // =========================================================
    // UI
    // =========================================================

    return (

        <Box
            sx={{
                width: "100%"
            }}
        >

            {/* =================================================
                SEARCH + FILTER
            ================================================= */}

            <Stack
                direction={{
                    xs: "column",
                    sm: "row"
                }}

                spacing={2}

                sx={{
                    mb: 2
                }}
            >

                {/* =============================================
                    SEARCH
                ============================================= */}

                <TextField
                    fullWidth

                    size="small"

                    label="Search Brand"

                    placeholder="Search by brand name or description"

                    value={searchText}

                    onChange={(event) =>
                        setSearchText(
                            event.target.value
                        )
                    }

                    InputProps={{
                        startAdornment: (

                            <InputAdornment position="start">

                                <Search />

                            </InputAdornment>

                        ),

                        endAdornment:

                            searchText && (

                                <InputAdornment position="end">

                                    <IconButton
                                        size="small"

                                        onClick={
                                            handleClearSearch
                                        }
                                    >

                                        <Clear />

                                    </IconButton>

                                </InputAdornment>

                            )
                    }}
                />


                {/* =============================================
                    STATUS FILTER
                ============================================= */}

                <TextField
                    select

                    size="small"

                    label="Status"

                    value={statusFilter}

                    onChange={(event) =>
                        setStatusFilter(
                            event.target.value
                        )
                    }

                    sx={{
                        minWidth: 180
                    }}
                >

                    <MenuItem value="All">
                        All
                    </MenuItem>

                    <MenuItem value="Active">
                        Active
                    </MenuItem>

                    <MenuItem value="Inactive">
                        Inactive
                    </MenuItem>

                </TextField>

            </Stack>


            {/* =================================================
                RESULT COUNT
            ================================================= */}

            <Box
                sx={{
                    mb: 1,
                    fontSize: 14,
                    color: "text.secondary"
                }}
            >

                Results: {filteredBrands.length}

            </Box>


            {/* =================================================
                DATA GRID
            ================================================= */}

            <DataGrid

                rows={filteredBrands}

                columns={columns}

                loading={loading}


                // =================================================
                // ROW ID
                // =================================================

                getRowId={(row) =>
                    row.brandId ??
                    row.BrandId
                }


                // =================================================
                // PAGINATION
                // =================================================

                pageSizeOptions={[
                    5,
                    10,
                    20,
                    50
                ]}

                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                            page: 0
                        }
                    }
                }}


                // =================================================
                // SELECTION
                // =================================================

                checkboxSelection

                disableRowSelectionOnClick


                // =================================================
                // HEIGHT
                // =================================================

                autoHeight

            />

        </Box>

    );

};


export default BrandTable;
