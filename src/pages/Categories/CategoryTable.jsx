// =========================================================
// CategoryTable.jsx
// =========================================================

import React from "react";

import {
    Box,
    Chip,
    IconButton,
    Tooltip
} from "@mui/material";

import {
    DataGrid
} from "@mui/x-data-grid";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";

// =========================================================
// COMPONENT
// =========================================================

const CategoryTable = ({
    categories = [],
    loading = false,

    onView,
    onEdit,
    onDelete
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

            headerName:
                "Category Name",

            flex: 1.5,

            minWidth: 180
        },

        // =================================================
        // PARENT CATEGORY
        // =================================================

        {
            field:
                "parentCategoryName",

            headerName:
                "Parent Category",

            flex: 1,

            minWidth: 180,

            renderCell:
                (params) =>
                    params.value ||
                    "Root"
        },

        // =================================================
        // DESCRIPTION
        // =================================================

        {
            field:
                "description",

            headerName:
                "Description",

            flex: 2,

            minWidth: 250,

            renderCell:
                (params) =>
                    params.value ||
                    "-"
        },

        // =================================================
        // STATUS
        // =================================================

        {
            field:
                "isActive",

            headerName:
                "Status",

            width: 120,

            renderCell:
                (params) => (

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

        // =================================================
        // CREATED DATE
        // =================================================

        {
            field:
                "createdDate",

            headerName:
                "Created Date",

            width: 170,

            renderCell:
                (params) =>
                    params.value
                        ? new Date(
                            params.value
                        ).toLocaleDateString()
                        : "-"
        },

        // =================================================
        // UPDATED DATE
        // =================================================

        {
            field:
                "updatedDate",

            headerName:
                "Updated Date",

            width: 170,

            renderCell:
                (params) =>
                    params.value
                        ? new Date(
                            params.value
                        ).toLocaleDateString()
                        : "-"
        },

        // =================================================
        // ACTIONS
        // =================================================

        {
            field:
                "actions",

            headerName:
                "Actions",

            width: 150,

            sortable: false,

            filterable: false,

            disableColumnMenu: true,

            renderCell:
                (params) => (

                    <Box
                        sx={{
                            display:
                                "flex",

                            alignItems:
                                "center",

                            gap: 0.5
                        }}
                    >

                        {/* =================================
                            CATEGORY DETAILS
                        ================================== */}

                        <Tooltip
                            title={
                                "Category Details"
                            }
                        >

                            <IconButton

                                color="primary"

                                size="small"

                                onClick={() =>
                                    onView?.(
                                        params.row
                                    )
                                }

                            >

                                <Visibility />

                            </IconButton>

                        </Tooltip>

                        {/* =================================
                            CATEGORY EDIT
                        ================================== */}

                        <Tooltip
                            title={
                                "Edit Category"
                            }
                        >

                            <IconButton

                                color="warning"

                                size="small"

                                onClick={() =>
                                    onEdit?.(
                                        params.row
                                    )
                                }

                            >

                                <Edit />

                            </IconButton>

                        </Tooltip>

                        {/* =================================
                            DELETE CATEGORY
                        ================================== */}

                        <Tooltip
                            title={
                                "Delete Category"
                            }
                        >

                            <IconButton

                                color="error"

                                size="small"

                                onClick={() =>
                                    onDelete?.(
                                        params.row
                                    )
                                }

                            >

                                <Delete />

                            </IconButton>

                        </Tooltip>

                    </Box>

                )
        }

    ];

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box
            sx={{
                width: "100%",
                height: 600
            }}
        >

            <DataGrid

                rows={
                    categories
                }

                columns={
                    columns
                }

                loading={
                    loading
                }

                getRowId={(row) =>
                    row.categoryId ??
                    row.id
                }

                checkboxSelection

                disableRowSelectionOnClick

                // =================================================
                // PAGINATION IS HANDLED BY CategoryList
                // =================================================

                hideFooter

                sx={{

                    "& .MuiDataGrid-cell": {

                        display:
                            "flex",

                        alignItems:
                            "center"

                    },

                    "& .MuiDataGrid-columnHeader": {

                        fontWeight:
                            600

                    }

                }}

            />

        </Box>

    );

};

export default CategoryTable;
