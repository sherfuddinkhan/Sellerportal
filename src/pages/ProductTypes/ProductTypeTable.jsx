import React from "react";

import {
    Box,
    Chip,
    IconButton,
    Tooltip
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import {

    Visibility,

    Edit,

    Delete

} from "@mui/icons-material";

const ProductTypeTable = ({

    productTypes,

    loading,

    onView,

    onEdit,

    onDelete

}) => {

    const columns = [

        {

            field: "productTypeName",

            headerName: "Product Type",

            flex: 1.5

        },

        {

            field: "description",

            headerName: "Description",

            flex: 2

        },

        {

            field: "isActive",

            headerName: "Status",

            width: 130,

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

            field: "actions",

            headerName: "Actions",

            width: 170,

            sortable: false,

            renderCell: (params) => (

                <>

                    <Tooltip title="View">

                        <IconButton
                            color="primary"
                            onClick={() =>
                                onView(params.row)
                            }
                        >

                            <Visibility/>

                        </IconButton>

                    </Tooltip>

                    <Tooltip title="Edit">

                        <IconButton
                            color="warning"
                            onClick={() =>
                                onEdit(params.row)
                            }
                        >

                            <Edit/>

                        </IconButton>

                    </Tooltip>

                    <Tooltip title="Delete">

                        <IconButton
                            color="error"
                            onClick={() =>
                                onDelete(params.row)
                            }
                        >

                            <Delete/>

                        </IconButton>

                    </Tooltip>

                </>

            )

        }

    ];

    return (

        <Box sx={{ height: 550 }}>

            <DataGrid

                rows={productTypes}

                columns={columns}

                loading={loading}

                getRowId={(row) => row.productTypeId}

                pageSizeOptions={[5,10,20,50]}

                initialState={{

                    pagination: {

                        paginationModel: {

                            pageSize: 10,

                            page: 0

                        }

                    }

                }}

                disableRowSelectionOnClick

            />

        </Box>

    );

};

export default ProductTypeTable;