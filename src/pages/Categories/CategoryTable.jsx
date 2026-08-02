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

const CategoryTable = ({

    categories = [],

    loading = false,

    onView,

    onEdit,

    onDelete

}) => {

    const columns = [

        {

            field: "categoryName",

            headerName: "Category Name",

            flex: 1.5,

            minWidth: 180

        },

        {

            field: "parentCategoryName",

            headerName: "Parent Category",

            flex: 1,

            minWidth: 180,

            renderCell: (params) =>

                params.value || "Root"

        },

        {

            field: "description",

            headerName: "Description",

            flex: 2,

            minWidth: 250,

            renderCell: (params) =>

                params.value || "-"

        },

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

        {

            field: "createdDate",

            headerName: "Created Date",

            width: 170,

            renderCell: (params) =>

                params.value

                    ? new Date(

                        params.value

                    ).toLocaleDateString()

                    : "-"

        },

        {

            field: "updatedDate",

            headerName: "Updated Date",

            width: 170,

            renderCell: (params) =>

                params.value

                    ? new Date(

                        params.value

                    ).toLocaleDateString()

                    : "-"

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

        <Box

            sx={{

                width: "100%",

                height: 600

            }}

        >

            <DataGrid

                rows={categories}

                columns={columns}

                loading={loading}

                getRowId={(row) => row.categoryId}

                checkboxSelection

                disableRowSelectionOnClick

                pageSizeOptions={[5,10,20,50]}

                initialState={{

                    pagination: {

                        paginationModel: {

                            page: 0,

                            pageSize: 10

                        }

                    }

                }}

            />

        </Box>

    );

};

export default CategoryTable;