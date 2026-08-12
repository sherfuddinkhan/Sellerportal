import React from "react";
import {Box,Chip,IconButton,Tooltip} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {Visibility,Edit,Delete} from "@mui/icons-material";

const BrandTable = ({brands = [],loading = false,onView,onEdit,onDelete}) => {
    const columns = [
        {
            field: "brandName",
            headerName: "Brand Name",
            flex: 1.5,
            minWidth: 180
        },
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
        {
            field: "isActive",
            headerName: "Status",
            width: 120,
            renderCell: (params) => (

                <Chip
                    label={ params.value ? "Active" : "Inactive"
                    }
                    color={ params.value ? "success" : "error"
                    }
                    size="small"
                />
            )
        },
        {
            field: "createdDate",
            headerName: "Created Date",
            width: 180,
            renderCell: (params) => params.value ? new Date(params.value).toLocaleDateString() : "-"
        },
        {
            field: "updatedDate",
            headerName: "Updated Date",
            width: 180,
            renderCell: (params) => params.value ? new Date(params.value).toLocaleDateString() : "-"
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 180,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <>
                    <Tooltip title="View">
                        <IconButton
                            color="primary"
                            onClick={() =>onView(params.row)}
                        >
                            <Visibility />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                        <IconButton
                            color="warning"
                            onClick={() =>onEdit(params.row)}
                        >
                            <Edit />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton
                            color="error"
                            onClick={() =>onDelete(params.row)}
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
                height: 600,
                width: "100%"
            }}
        >
            <DataGrid
                rows={brands}
                columns={columns}
                loading={loading}
                getRowId={(row) => row.brandId}
                pageSizeOptions={[5, 10, 20, 50]}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                            page: 0
                        }
                    }
                }}
                checkboxSelection
                disableRowSelectionOnClick
                autoHeight
            />
        </Box>
    );
};

export default BrandTable;