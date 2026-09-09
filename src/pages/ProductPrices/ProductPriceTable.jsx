import React from "react";
import { useNavigate } from "react-router-dom";

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

import { DataGrid } from "@mui/x-data-grid";


const ProductPriceTable = ({
    productPrices = [],
    loading = false,
    onView,
    onEdit,
    onDelete
}) => {

    const navigate = useNavigate();


    // =========================================================
    // GET VALUE
    // =========================================================

    const getValue = (row, ...keys) => {

        for (const key of keys) {

            if (
                row?.[key] !== undefined &&
                row?.[key] !== null
            ) {
                return row[key];
            }
        }

        return "";
    };


    // =========================================================
    // GET PRODUCT PRICE ID
    // =========================================================

    const getProductPriceId = (row) => {

        return (
            row?.productPriceId ??
            row?.ProductPriceId ??
            row?.id ??
            row?.Id
        );
    };


    // =========================================================
    // VIEW PRODUCT PRICE
    // =========================================================

    const handleView = (event, row) => {

        event.preventDefault();
        event.stopPropagation();

        const productPriceId =
            getProductPriceId(row);

        console.log(
            "VIEW PRODUCT PRICE:",
            productPriceId
        );

        console.log(
            "PRODUCT PRICE ROW:",
            row
        );

        if (!productPriceId) {

            console.error(
                "Product Price ID not found",
                row
            );

            return;
        }


        // Navigate directly to ProductPriceView
        navigate(
            `/product-prices/view/${productPriceId}`
        );
    };


    // =========================================================
    // EDIT PRODUCT PRICE
    // =========================================================

    const handleEdit = (event, row) => {

        event.preventDefault();
        event.stopPropagation();

        const productPriceId =
            getProductPriceId(row);

        console.log(
            "EDIT PRODUCT PRICE:",
            productPriceId
        );

        console.log(
            "PRODUCT PRICE ROW:",
            row
        );

        if (!productPriceId) {

            console.error(
                "Product Price ID not found",
                row
            );

            return;
        }


        // Navigate directly to ProductPriceEdit
        navigate(
            `/product-prices/edit/${productPriceId}`
        );
    };


    // =========================================================
    // DELETE PRODUCT PRICE
    // =========================================================

    const handleDelete = (event, row) => {

        event.preventDefault();
        event.stopPropagation();

        const productPriceId =
            getProductPriceId(row);

        console.log(
            "DELETE PRODUCT PRICE:",
            productPriceId
        );

        console.log(
            "PRODUCT PRICE ROW:",
            row
        );

        if (onDelete) {
            onDelete(row);
        }
    };


    // =========================================================
    // COLUMNS
    // =========================================================

    const columns = [

        // =====================================================
        // PRODUCT
        // =====================================================

        {
            field: "productName",

            headerName: "Product",

            flex: 1.3,

            minWidth: 180,

            valueGetter: (params) =>
                getValue(
                    params.row,
                    "ProductName",
                    "productName"
                )
        },


        // =====================================================
        // SKU
        // =====================================================

        {
            field: "sku",

            headerName: "SKU",

            flex: 1,

            minWidth: 130,

            valueGetter: (params) =>
                getValue(
                    params.row,
                    "SKU",
                    "sku"
                )
        },


        // =====================================================
        // PRICE TYPE
        // =====================================================

        {
            field: "priceType",

            headerName: "Price Type",

            flex: 1,

            minWidth: 130,

            valueGetter: (params) =>
                getValue(
                    params.row,
                    "PriceType",
                    "priceType"
                )
        },


        // =====================================================
        // PRICE
        // =====================================================

        {
            field: "price",

            headerName: "Price",

            flex: 0.8,

            minWidth: 110,

            valueGetter: (params) =>
                getValue(
                    params.row,
                    "Price",
                    "price"
                ),

            renderCell: (params) => {

                const price = getValue(
                    params.row,
                    "Price",
                    "price"
                );

                return (
                    <strong>
                        {price !== ""
                            ? Number(price).toFixed(2)
                            : "-"}
                    </strong>
                );
            }
        },


        // =====================================================
        // CURRENCY
        // =====================================================

        {
            field: "currency",

            headerName: "Currency",

            flex: 0.7,

            minWidth: 100,

            valueGetter: (params) =>
                getValue(
                    params.row,
                    "Currency",
                    "currency"
                )
        },


        // =====================================================
        // EFFECTIVE FROM
        // =====================================================

        {
            field: "effectiveFrom",

            headerName: "Effective From",

            flex: 1,

            minWidth: 140,

            valueGetter: (params) =>
                getValue(
                    params.row,
                    "EffectiveFrom",
                    "effectiveFrom"
                ),

            renderCell: (params) => {

                const value = getValue(
                    params.row,
                    "EffectiveFrom",
                    "effectiveFrom"
                );

                if (!value) {
                    return "-";
                }

                return new Date(
                    value
                ).toLocaleDateString();
            }
        },


        // =====================================================
        // EFFECTIVE TO
        // =====================================================

        {
            field: "effectiveTo",

            headerName: "Effective To",

            flex: 1,

            minWidth: 140,

            valueGetter: (params) =>
                getValue(
                    params.row,
                    "EffectiveTo",
                    "effectiveTo"
                ),

            renderCell: (params) => {

                const value = getValue(
                    params.row,
                    "EffectiveTo",
                    "effectiveTo"
                );

                if (!value) {
                    return "-";
                }

                return new Date(
                    value
                ).toLocaleDateString();
            }
        },


        // =====================================================
        // STATUS
        // =====================================================

        {
            field: "status",

            headerName: "Status",

            flex: 0.8,

            minWidth: 110,

            valueGetter: (params) =>
                getValue(
                    params.row,
                    "Status",
                    "status"
                ),

            renderCell: (params) => {

                const status = getValue(
                    params.row,
                    "Status",
                    "status"
                );

                const isActive =
                    status === "Active" ||
                    status === true;

                return (
                    <Chip
                        label={
                            isActive
                                ? "Active"
                                : "Inactive"
                        }
                        size="small"
                        color={
                            isActive
                                ? "success"
                                : "default"
                        }
                    />
                );
            }
        },


        // =====================================================
        // ACTIONS
        // =====================================================

        {
            field: "actions",

            headerName: "Actions",

            width: 160,

            sortable: false,

            filterable: false,

            disableColumnMenu: true,

            renderCell: (params) => {

                const row = params.row;

                const productPriceId =
                    getProductPriceId(row);


                return (

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 0.5,
                            width: "100%",
                            height: "100%"
                        }}
                    >

                        {/* =====================================
                            VIEW
                        ====================================== */}

                        <Tooltip title="View">

                            <IconButton
                                color="primary"
                                size="small"
                                type="button"
                                onClick={(event) =>
                                    handleView(
                                        event,
                                        row
                                    )
                                }
                            >

                                <Visibility
                                    fontSize="small"
                                />

                            </IconButton>

                        </Tooltip>


                        {/* =====================================
                            EDIT
                        ====================================== */}

                        <Tooltip title="Edit">

                            <IconButton
                                color="warning"
                                size="small"
                                type="button"
                                onClick={(event) =>
                                    handleEdit(
                                        event,
                                        row
                                    )
                                }
                            >

                                <Edit
                                    fontSize="small"
                                />

                            </IconButton>

                        </Tooltip>


                        {/* =====================================
                            DELETE
                        ====================================== */}

                        <Tooltip title="Delete">

                            <IconButton
                                color="error"
                                size="small"
                                type="button"
                                onClick={(event) =>
                                    handleDelete(
                                        event,
                                        row
                                    )
                                }
                            >

                                <Delete
                                    fontSize="small"
                                />

                            </IconButton>

                        </Tooltip>

                    </Box>
                );
            }
        }
    ];


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <Box
            sx={{
                width: "100%",
                height: 600
            }}
        >

            <DataGrid

                rows={productPrices}

                columns={columns}

                loading={loading}


                // =================================================
                // IMPORTANT
                // =================================================

                getRowId={(row) =>
                    getProductPriceId(row)
                }


                disableRowSelectionOnClick


                pageSizeOptions={[
                    10,
                    25,
                    50,
                    100
                ]}


                initialState={{
                    pagination: {
                        paginationModel: {
                            page: 0,
                            pageSize: 10
                        }
                    }
                }}


                sx={{
                    width: "100%",

                    borderRadius: 2,

                    "& .MuiDataGrid-columnHeaders": {
                        fontWeight: "bold"
                    },

                    "& .MuiDataGrid-cell": {
                        display: "flex",
                        alignItems: "center"
                    },

                    "& .MuiDataGrid-cell:focus": {
                        outline: "none"
                    },

                    "& .MuiDataGrid-cell:focus-within": {
                        outline: "none"
                    }
                }}

            />

        </Box>
    );
};


export default ProductPriceTable;