// =========================================================
// CategoryTable.jsx
// Category Management DataGrid
// =========================================================

import React from "react";

import {
    Box,
    Chip,
    IconButton,
    Tooltip,
} from "@mui/material";

import {
    DataGrid,
} from "@mui/x-data-grid";

import {
    Visibility,
    Edit,
    Delete,
    Add,
    Inventory2,
    PowerSettingsNew,
} from "@mui/icons-material";

// =========================================================
// COMPONENT
// =========================================================

const CategoryTable = ({
    categories = [],
    loading = false,

    // =====================================================
    // ACTION CALLBACKS
    // =====================================================

    onView,
    onEdit,
    onViewProducts,
    onAddSubcategory,
    onToggleStatus,
    onDelete,
}) => {

    // =====================================================
    // COLUMNS
    // =====================================================

    const columns = [

        // =================================================
        // CATEGORY NAME
        // =================================================

        {
            field: "categoryName",

            headerName: "Category Name",

            flex: 1.5,

            minWidth: 180,
        },

        // =================================================
        // PARENT CATEGORY
        // =================================================

        {
            field: "parentCategoryName",

            headerName: "Parent Category",

            flex: 1,

            minWidth: 180,

            renderCell: (params) =>
                params.value || "Root",
        },

        // =================================================
        // DESCRIPTION
        // =================================================

        {
            field: "description",

            headerName: "Description",

            flex: 2,

            minWidth: 250,

            renderCell: (params) =>
                params.value || "-",
        },

        // =================================================
        // STATUS
        // =================================================

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

            ),
        },

        // =================================================
        // CREATED DATE
        // =================================================

        {
            field: "createdDate",

            headerName: "Created Date",

            width: 170,

            renderCell: (params) =>
                params.value
                    ? new Date(
                        params.value
                    ).toLocaleDateString()
                    : "-",
        },

        // =================================================
        // UPDATED DATE
        // =================================================

        {
            field: "updatedDate",

            headerName: "Updated Date",

            width: 170,

            renderCell: (params) =>
                params.value
                    ? new Date(
                        params.value
                    ).toLocaleDateString()
                    : "-",
        },

        // =================================================
        // ACTIONS
        // =================================================

        {
            field: "actions",

            headerName: "Actions",

            width: 260,

            sortable: false,

            filterable: false,

            disableColumnMenu: true,

            renderCell: (params) => {

                const category =
                    params.row;

                return (

                    <Box
                        sx={{
                            display: "flex",

                            alignItems:
                                "center",

                            gap: 0.25,
                        }}
                    >

                        {/* =================================
                            VIEW DETAILS
                        ================================== */}

                        <Tooltip
                            title="Category Details"
                        >

                            <IconButton
                                color="primary"
                                size="small"

                                onClick={() =>
                                    onView?.(
                                        category
                                    )
                                }
                            >

                                <Visibility />

                            </IconButton>

                        </Tooltip>

                        {/* =================================
                            EDIT CATEGORY
                        ================================== */}

                        <Tooltip
                            title="Edit Category"
                        >

                            <IconButton
                                color="warning"
                                size="small"

                                onClick={() =>
                                    onEdit?.(
                                        category
                                    )
                                }
                            >

                                <Edit />

                            </IconButton>

                        </Tooltip>

                        {/* =================================
                            VIEW PRODUCTS
                        ================================== */}

                        <Tooltip
                            title="View Products"
                        >

                            <IconButton
                                color="info"
                                size="small"

                                onClick={() =>
                                    onViewProducts?.(
                                        category
                                    )
                                }
                            >

                                <Inventory2 />

                            </IconButton>

                        </Tooltip>

                        {/* =================================
                            ADD SUBCATEGORY
                        ================================== */}

                        <Tooltip
                            title="Add Subcategory"
                        >

                            <IconButton
                                color="success"
                                size="small"

                                onClick={() =>
                                    onAddSubcategory?.(
                                        category
                                    )
                                }
                            >

                                <Add />

                            </IconButton>

                        </Tooltip>

                        {/* =================================
                            ACTIVATE / DEACTIVATE
                        ================================== */}

                        <Tooltip
                            title={
                                category.isActive
                                    ? "Deactivate Category"
                                    : "Activate Category"
                            }
                        >

                            <IconButton
                                color={
                                    category.isActive
                                        ? "default"
                                        : "success"
                                }

                                size="small"

                                onClick={() =>
                                    onToggleStatus?.(
                                        category
                                    )
                                }
                            >

                                <PowerSettingsNew />

                            </IconButton>

                        </Tooltip>

                        {/* =================================
                            DELETE CATEGORY
                        ================================== */}

                        <Tooltip
                            title="Delete Category"
                        >

                            <IconButton
                                color="error"
                                size="small"

                                onClick={() =>
                                    onDelete?.(
                                        category
                                    )
                                }
                            >

                                <Delete />

                            </IconButton>

                        </Tooltip>

                    </Box>

                );
            },
        },
    ];

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box
            sx={{
                width: "100%",
                height: 600,
            }}
        >

            <DataGrid

                rows={categories}

                columns={columns}

                loading={loading}

                getRowId={(row) =>
                    row.categoryId ??
                    row.id
                }

                checkboxSelection

                disableRowSelectionOnClick

                // =================================================
                // PAGINATION HANDLED BY CATEGORY LIST
                // =================================================

                hideFooter

                sx={{

                    "& .MuiDataGrid-cell": {
                        display: "flex",
                        alignItems: "center",
                    },

                    "& .MuiDataGrid-columnHeader": {
                        fontWeight: 600,
                    },

                    "& .MuiDataGrid-cell:focus": {
                        outline: "none",
                    },

                    "& .MuiDataGrid-row:hover": {
                        cursor: "default",
                    },

                }}

            />

        </Box>
    );
};

export default CategoryTable;