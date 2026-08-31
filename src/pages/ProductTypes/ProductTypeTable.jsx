// =========================================================
// ProductTypeTable.jsx
// =========================================================

import React, {
    useMemo,
} from "react";

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
} from "@mui/icons-material";


const ProductTypeTable = ({
    productTypes = [],
    loading = false,
    onView,
    onEdit,
    onDelete,
}) => {


    const columns = useMemo(
        () => [

            // =================================================
            // PRODUCT TYPE
            // =================================================

            {
                field: "productTypeName",

                headerName: "Product Type",

                flex: 1.5,

                minWidth: 180,

                sortable: true,

                renderCell: (params) => (

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            height: "100%",
                            fontWeight: 500,
                        }}
                    >

                        {
                            params.value ||
                            "-"
                        }

                    </Box>

                ),
            },


            // =================================================
            // DESCRIPTION
            // =================================================

            {
                field: "description",

                headerName: "Description",

                flex: 2,

                minWidth: 250,

                renderCell: (params) => (

                    <Tooltip
                        title={
                            params.value ||
                            ""
                        }
                    >

                        <Box
                            sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                width: "100%",
                            }}
                        >

                            {
                                params.value ||
                                "-"
                            }

                        </Box>

                    </Tooltip>

                ),
            },


            // =================================================
            // STATUS
            // =================================================

            {
                field: "isActive",

                headerName: "Status",

                width: 130,

                renderCell: (params) => {

                    const active =
                        Boolean(
                            params.value
                        );


                    return (

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                height: "100%",
                            }}
                        >

                            <Chip

                                size="small"

                                label={
                                    active
                                        ? "Active"
                                        : "Inactive"
                                }

                                color={
                                    active
                                        ? "success"
                                        : "error"
                                }

                            />

                        </Box>

                    );

                },

            },


            // =================================================
            // ACTIONS
            // =================================================

            {
                field: "actions",

                headerName: "Actions",

                width: 170,

                sortable: false,

                filterable: false,

                disableColumnMenu: true,

                renderCell: (params) => (

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            height: "100%",
                        }}
                    >

                        {/* ===============================
                            VIEW
                        =============================== */}

                        <Tooltip title="View">

                            <IconButton

                                size="small"

                                color="primary"

                                onClick={(event) => {

                                    event.stopPropagation();


                                    if (onView) {

                                        onView(
                                            params.row
                                        );

                                    }

                                }}

                            >

                                <Visibility
                                    fontSize="small"
                                />

                            </IconButton>

                        </Tooltip>


                        {/* ===============================
                            EDIT
                        =============================== */}

                        <Tooltip title="Edit">

                            <IconButton

                                size="small"

                                color="warning"

                                onClick={(event) => {

                                    event.stopPropagation();


                                    if (onEdit) {

                                        onEdit(
                                            params.row
                                        );

                                    }

                                }}

                            >

                                <Edit
                                    fontSize="small"
                                />

                            </IconButton>

                        </Tooltip>


                        {/* ===============================
                            DELETE
                        =============================== */}

                        <Tooltip title="Delete">

                            <IconButton

                                size="small"

                                color="error"

                                onClick={(event) => {

                                    event.stopPropagation();


                                    if (onDelete) {

                                        onDelete(
                                            params.row
                                        );

                                    }

                                }}

                            >

                                <Delete
                                    fontSize="small"
                                />

                            </IconButton>

                        </Tooltip>

                    </Box>

                ),

            },

        ],
        [
            onView,
            onEdit,
            onDelete,
        ]
    );


    return (

        <Box
            sx={{
                width: "100%",
                height: 550,
            }}
        >

            <DataGrid

                rows={
                    Array.isArray(
                        productTypes
                    )
                        ? productTypes
                        : []
                }

                columns={
                    columns
                }

                loading={
                    loading
                }

                getRowId={
                    (row) =>
                        row.productTypeId
                }

                disableRowSelectionOnClick

                pageSizeOptions={[
                    5,
                    10,
                    20,
                    50,
                ]}

                sx={{

                    border: 0,

                    "& .MuiDataGrid-cell:focus":
                        {
                            outline: "none",
                        },

                    "& .MuiDataGrid-cell:focus-within":
                        {
                            outline: "none",
                        },

                    "& .MuiDataGrid-columnHeader:focus":
                        {
                            outline: "none",
                        },

                    "& .MuiDataGrid-columnHeader:focus-within":
                        {
                            outline: "none",
                        },

                }}

            />

        </Box>

    );

};


export default ProductTypeTable;
