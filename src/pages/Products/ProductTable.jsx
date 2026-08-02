import React from "react";

import { DataGrid } from "@mui/x-data-grid";

import {
    Box,
    Chip,
    IconButton,
    Tooltip
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";

const ProductTable = ({
    products = [],
    loading = false,
    onView,
    onEdit,
    onDelete
}) => {

    const columns = [

        {
            field: "SKU",
            headerName: "SKU",
            width: 120
        },

        {
            field: "ProductName",
            headerName: "Product Name",
            flex: 1.5,
            minWidth: 220
        },

        {
            field: "brandName",
            headerName: "Brand",
            flex: 1
        },

        {
            field: "categoryName",
            headerName: "Category",
            flex: 1
        },

        {
            field: "productTypeName",
            headerName: "Product Type",
            flex: 1
        },

        {
            field: "Barcode",
            headerName: "Barcode",
            width: 150
        },

        {
            field: "HSNCode",
            headerName: "HSN",
            width: 120
        },

        {
            field: "UnitOfMeasure",
            headerName: "Unit",
            width: 110
        },

        {
            field: "Weight",
            headerName: "Weight",
            width: 110
        },

        {
            field: "Status",
            headerName: "Status",
            width: 120,

            renderCell: (params) => (

                <Chip

                    size="small"

                    label={params.value || "N/A"}

                    color={
                        params.row.IsActive
                            ? "success"
                            : "default"
                    }

                />

            )

        },

        {
            field: "IsActive",
            headerName: "Active",
            width: 110,

            renderCell: (params) => (

                <Chip

                    size="small"

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

                />

            )

        },

        {
            field: "CreatedDate",
            headerName: "Created",

            width: 170,

            valueFormatter: (value) => {

                if (!value) return "";

                return new Date(value).toLocaleDateString();

            }

        },

        {
            field: "actions",

            headerName: "Actions",

            width: 170,

            sortable: false,

            filterable: false,

            renderCell: (params) => (

                <>

                    <Tooltip title="View">

                        <IconButton

                            color="primary"

                            onClick={() =>
                                onView(params.row)
                            }

                        >

                            <Visibility />

                        </IconButton>

                    </Tooltip>

                    <Tooltip title="Edit">

                        <IconButton

                            color="warning"

                            onClick={() =>
                                onEdit(params.row)
                            }

                        >

                            <Edit />

                        </IconButton>

                    </Tooltip>

                    <Tooltip title="Delete">

                        <IconButton

                            color="error"

                            onClick={() =>
                                onDelete(params.row)
                            }

                        >

                            <Delete />

                        </IconButton>

                    </Tooltip>

                </>

            )

        }

    ];

    return (

        <Box sx={{ height: 650, width: "100%" }}>

            <DataGrid

                rows={products}

                columns={columns}

                loading={loading}

                getRowId={(row) => row.ProductId}

                pageSizeOptions={[5, 10, 20, 50]}

                disableRowSelectionOnClick

                initialState={{

                    pagination: {

                        paginationModel: {

                            pageSize: 10,

                            page: 0

                        }

                    }

                }}

            />

        </Box>

    );

};

export default ProductTable;