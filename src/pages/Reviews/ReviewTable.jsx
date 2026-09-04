import React, {
    useMemo,
} from "react";

import PropTypes from "prop-types";

import {
    Avatar,
    Badge,
    Box,
    Chip,
    IconButton,
    Rating,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";

import {
    Cancel,
    CheckCircle,
    Delete,
    Image,
    Reply,
    Store,
    ThumbUp,
    Verified,
    Visibility,
} from "@mui/icons-material";

import {
    DataGrid,
    GridToolbar,
} from "@mui/x-data-grid";


// ======================================================
// Status Colors
// ======================================================

const STATUS_COLORS = {

    Pending: "warning",

    Approved: "success",

    Rejected: "error",

};


// ======================================================
// Marketplace Colors
// ======================================================

const MARKETPLACE_COLORS = {

    Amazon: "warning",

    Flipkart: "primary",

    Meesho: "secondary",

    Shopify: "success",

    Myntra: "info",

};


// ======================================================
// Date Formatter
// ======================================================

const formatDate = (date) => {

    if (!date) {
        return "-";
    }

    const parsedDate =
        new Date(date);

    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {
        return "-";
    }

    return parsedDate.toLocaleDateString(
        "en-IN",
        {
            year: "numeric",
            month: "short",
            day: "numeric",
        }
    );

};


// ======================================================
// Status Chip
// ======================================================

const StatusChip = ({
    status,
}) => {

    const normalizedStatus =
        String(
            status || ""
        )
            .toLowerCase();

    const displayStatus =
        normalizedStatus
            .charAt(0)
            .toUpperCase() +
        normalizedStatus.slice(1);

    return (

        <Chip
            size="small"
            label={
                displayStatus ||
                "Unknown"
            }
            color={
                STATUS_COLORS[
                    displayStatus
                ] || "default"
            }
        />

    );

};


// ======================================================
// Marketplace Chip
// ======================================================

const MarketplaceChip = ({
    marketplace,
}) => (

    <Chip
        size="small"
        label={
            marketplace ||
            "Unknown"
        }
        color={
            MARKETPLACE_COLORS[
                marketplace
            ] || "default"
        }
        icon={
            <Store />
        }
    />

);


// ======================================================
// Review Rating
// ======================================================

const ReviewRating = ({
    value,
}) => {

    const rating =
        Number(value) || 0;

    return (

        <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            justifyContent="center"
            sx={{
                width: "100%",
                height: "100%",
                minWidth: 0,
            }}
        >

            <Rating
                size="small"
                value={rating}
                precision={0.5}
                readOnly
            />

            <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                    flexShrink: 0,
                }}
            >
                {rating.toFixed(1)}
            </Typography>

        </Stack>

    );

};


// ======================================================
// Customer Avatar
// ======================================================

const CustomerAvatar = ({
    customer,
}) => {

    const customerName =
        customer?.name ||
        "Customer";

    const firstLetter =
        customerName
            .charAt(0)
            .toUpperCase();

    const verified =
        customer?.verifiedBuyer === true ||
        customer?.verifiedBuyer === "true" ||
        customer?.verifiedBuyer === "True" ||
        customer?.verifiedBuyer === "Yes" ||
        customer?.verifiedBuyer === 1;

    return (

        <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            justifyContent="center"
            sx={{
                width: "100%",
                height: "100%",
                minWidth: 0,
                overflow: "hidden",
            }}
        >

            <Avatar
                src={
                    customer?.image ||
                    undefined
                }
                alt={customerName}
                sx={{
                    width: 52,
                    height: 52,
                    flexShrink: 0,
                }}
            >
                {firstLetter}
            </Avatar>

            <Box
                sx={{
                    minWidth: 0,
                    maxWidth:
                        "calc(100% - 68px)",
                    overflow: "hidden",
                }}
            >

                <Typography
                    variant="body2"
                    fontWeight={600}
                    noWrap
                    sx={{
                        overflow: "hidden",
                        textOverflow:
                            "ellipsis",
                    }}
                >
                    {customerName}
                </Typography>

                {verified && (

                    <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                    >

                        <Verified
                            sx={{
                                fontSize: 14,
                                color:
                                    "success.main",
                                flexShrink: 0,
                            }}
                        />

                        <Typography
                            variant="caption"
                            color="success.main"
                            noWrap
                        >
                            Verified Buyer
                        </Typography>

                    </Stack>

                )}

            </Box>

        </Stack>

    );

};


// ======================================================
// Product Cell
// ======================================================

const ProductCell = ({
    product,
}) => {

    const productName =
        product?.name ||
        "Unknown Product";

    return (

        <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{
                width: "100%",
                height: "100%",
                minWidth: 0,
                overflow: "hidden",
            }}
        >

            <Avatar
                variant="rounded"
                src={
                    product?.image ||
                    undefined
                }
                alt={productName}
                sx={{
                    width: 48,
                    height: 48,
                    flexShrink: 0,
                }}
            >
                <Image />
            </Avatar>

            <Box
                sx={{
                    minWidth: 0,
                    overflow: "hidden",
                }}
            >

                <Typography
                    variant="body2"
                    fontWeight={600}
                    noWrap
                    sx={{
                        overflow: "hidden",
                        textOverflow:
                            "ellipsis",
                    }}
                >
                    {productName}
                </Typography>

                <Typography
                    variant="caption"
                    color="text.secondary"
                    noWrap
                    sx={{
                        overflow: "hidden",
                        textOverflow:
                            "ellipsis",
                    }}
                >
                    SKU:{" "}
                    {product?.sku || "-"}
                </Typography>

            </Box>

        </Stack>

    );

};


// ======================================================
// Review Table Component
// ======================================================

const ReviewTable = ({
    rows = [],
    loading = false,

    selectedRows = [],

    onSelectionChange,

    onView,
    onReply,
    onApprove,
    onReject,
    onDelete,
}) => {


    // ==================================================
    // MUI ROW SELECTION MODEL
    //
    // IMPORTANT:
    // Do NOT store this in React state.
    //
    // Parent selectedRows is the single source of truth.
    // ==================================================

    const rowSelectionModel = useMemo(() => {

        return {

            type: "include",

            ids: new Set(
                Array.isArray(selectedRows)
                    ? selectedRows
                    : []
            ),

        };

    }, [selectedRows]);


    // ==================================================
    // Row Selection Change
    // ==================================================

    const handleSelectionChange = (
        selectionModel
    ) => {

        // ==============================================
        // New MUI X Selection Model
        // ==============================================

        if (
            selectionModel &&
            selectionModel.ids instanceof Set
        ) {

            const selectedIds =
                Array.from(
                    selectionModel.ids
                );

            if (
                onSelectionChange
            ) {

                onSelectionChange(
                    selectedIds
                );

            }

            return;

        }


        // ==============================================
        // Older Array Selection Model
        // ==============================================

        if (
            Array.isArray(
                selectionModel
            )
        ) {

            if (
                onSelectionChange
            ) {

                onSelectionChange(
                    selectionModel
                );

            }

            return;

        }


        // ==============================================
        // Empty Selection
        // ==============================================

        if (
            onSelectionChange
        ) {

            onSelectionChange([]);

        }

    };


    // ==================================================
    // Row Click
    // ==================================================

    const handleRowClick = (
        params
    ) => {

        if (
            onView
        ) {

            onView(
                params.row
            );

        }

    };


    // ==================================================
    // View Handler
    // ==================================================

    const handleView = (
        row
    ) => {

        if (
            onView
        ) {

            onView(
                row
            );

        }

    };


    // ==================================================
    // Reply Handler
    // ==================================================

    const handleReply = (
        row
    ) => {

        if (
            onReply
        ) {

            onReply(
                row
            );

        }

    };


    // ==================================================
    // Approve Handler
    // ==================================================

    const handleApprove = (
        row
    ) => {

        if (
            onApprove
        ) {

            onApprove(
                row
            );

        }

    };


    // ==================================================
    // Reject Handler
    // ==================================================

    const handleReject = (
        row
    ) => {

        if (
            onReject
        ) {

            onReject(
                row
            );

        }

    };


    // ==================================================
    // Delete Handler
    // ==================================================

    const handleDelete = (
        row
    ) => {

        if (
            onDelete
        ) {

            onDelete(
                row
            );

        }

    };


    // ==================================================
    // DataGrid Columns
    // ==================================================

    const columns = useMemo(
        () => [

            // ==========================================
            // Product
            // ==========================================

            {
                field: "product",

                headerName: "Product",

                flex: 1.6,

                minWidth: 260,

                sortable: false,

                renderCell: ({
                    row,
                }) => (

                    <ProductCell
                        product={{

                            name:
                                row.productName,

                            sku:
                                row.productSku,

                            image:
                                row.productImage,

                        }}
                    />

                ),

            },


            // ==========================================
            // Customer
            // ==========================================

            {
                field: "customer",

                headerName: "Customer",

                flex: 1.5,

                minWidth: 250,

                sortable: false,

                renderCell: ({
                    row,
                }) => (

                    <CustomerAvatar
                        customer={{

                            name:
                                row.customerName,

                            image:
                                row.customerImage,

                            verifiedBuyer:
                                row.verifiedBuyer,

                        }}
                    />

                ),

            },


            // ==========================================
            // Rating
            // ==========================================

            {
                field: "rating",

                headerName: "Rating",

                width: 160,

                align: "center",

                headerAlign: "center",

                renderCell: ({
                    value,
                }) => (

                    <ReviewRating
                        value={value}
                    />

                ),

            },


            // ==========================================
            // Review Title
            // ==========================================

            {
                field: "reviewTitle",

                headerName: "Title",

                flex: 1.3,

                minWidth: 220,

                renderCell: ({
                    value,
                }) => (

                    <Typography
                        variant="body2"
                        fontWeight={600}
                        noWrap
                        sx={{
                            width: "100%",
                        }}
                    >
                        {value || "-"}
                    </Typography>

                ),

            },


            // ==========================================
            // Review Text
            // ==========================================

            {
                field: "reviewText",

                headerName: "Review",

                flex: 2,

                minWidth: 300,

                renderCell: ({
                    row,
                }) => (

                    <Tooltip
                        title={
                            row.reviewText ||
                            "No review text"
                        }
                        placement="top"
                    >

                        <Typography
                            variant="body2"
                            noWrap
                            sx={{
                                width: "100%",
                            }}
                        >
                            {
                                row.reviewText ||
                                "-"
                            }
                        </Typography>

                    </Tooltip>

                ),

            },


            // ==========================================
            // Status
            // ==========================================

            {
                field: "status",

                headerName: "Status",

                width: 140,

                align: "center",

                headerAlign: "center",

                renderCell: ({
                    value,
                }) => (

                    <StatusChip
                        status={value}
                    />

                ),

            },


            // ==========================================
            // Marketplace
            // ==========================================

            {
                field: "marketplace",

                headerName: "Marketplace",

                width: 160,

                align: "center",

                headerAlign: "center",

                renderCell: ({
                    value,
                }) => (

                    <MarketplaceChip
                        marketplace={value}
                    />

                ),

            },


            // ==========================================
            // Created Date
            // ==========================================

            {
                field: "createdDate",

                headerName: "Date",

                width: 140,

                align: "center",

                headerAlign: "center",

                valueFormatter: ({
                    value,
                }) =>
                    formatDate(
                        value
                    ),

            },


            // ==========================================
            // Helpful Count
            // ==========================================

            {
                field: "helpfulCount",

                headerName: "Helpful",

                width: 110,

                align: "center",

                headerAlign: "center",

                renderCell: ({
                    value,
                }) => (

                    <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            width: "100%",
                        }}
                    >

                        <ThumbUp
                            sx={{
                                color:
                                    "primary.main",
                                fontSize: 18,
                                flexShrink: 0,
                            }}
                        />

                        <Typography
                            variant="body2"
                            fontWeight={600}
                        >
                            {
                                Number(value) ||
                                0
                            }
                        </Typography>

                    </Stack>

                ),

            },


            // ==========================================
            // Review Images
            // ==========================================

            {
                field: "images",

                headerName: "Images",

                width: 110,

                align: "center",

                headerAlign: "center",

                sortable: false,

                renderCell: ({
                    row,
                }) => {

                    const count =
                        Array.isArray(
                            row.reviewImages
                        )
                            ? row.reviewImages.length
                            : 0;

                    return (

                        <Badge
                            badgeContent={
                                count
                            }
                            color="primary"
                            max={99}
                        >

                            <Image
                                color="action"
                            />

                        </Badge>

                    );

                },

            },


            // ==========================================
            // Verified Buyer
            // ==========================================

            {
                field: "verifiedBuyer",

                headerName: "Verified",

                width: 120,

                align: "center",

                headerAlign: "center",

                renderCell: ({
                    value,
                }) => {

                    const verified =
                        value === true ||
                        value === "true" ||
                        value === "True" ||
                        value === "Yes" ||
                        value === 1;

                    return verified ? (

                        <Chip
                            size="small"
                            color="success"
                            icon={
                                <Verified />
                            }
                            label="Verified"
                        />

                    ) : (

                        <Chip
                            size="small"
                            color="default"
                            label="Guest"
                        />

                    );

                },

            },


            // ==========================================
            // Actions
            // ==========================================

            {
                field: "actions",

                headerName: "Actions",

                width: 240,

                sortable: false,

                filterable: false,

                disableColumnMenu: true,

                align: "center",

                headerAlign: "center",

                renderCell: ({
                    row,
                }) => (

                    <Stack
                        direction="row"
                        spacing={0.25}
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            width: "100%",
                        }}
                    >

                        {/* ==================================
                            View
                        ================================== */}

                        <Tooltip
                            title="View Review"
                        >

                            <IconButton
                                color="primary"
                                size="small"
                                onClick={(event) => {

                                    event.stopPropagation();

                                    handleView(
                                        row
                                    );

                                }}
                            >

                                <Visibility />

                            </IconButton>

                        </Tooltip>


                        {/* ==================================
                            Reply
                        ================================== */}

                        <Tooltip
                            title="Reply"
                        >

                            <IconButton
                                color="secondary"
                                size="small"
                                onClick={(event) => {

                                    event.stopPropagation();

                                    handleReply(
                                        row
                                    );

                                }}
                            >

                                <Reply />

                            </IconButton>

                        </Tooltip>


                        {/* ==================================
                            Approve
                        ================================== */}

                        <Tooltip
                            title="Approve"
                        >

                            <IconButton
                                color="success"
                                size="small"
                                onClick={(event) => {

                                    event.stopPropagation();

                                    handleApprove(
                                        row
                                    );

                                }}
                            >

                                <CheckCircle />

                            </IconButton>

                        </Tooltip>


                        {/* ==================================
                            Reject
                        ================================== */}

                        <Tooltip
                            title="Reject"
                        >

                            <IconButton
                                color="warning"
                                size="small"
                                onClick={(event) => {

                                    event.stopPropagation();

                                    handleReject(
                                        row
                                    );

                                }}
                            >

                                <Cancel />

                            </IconButton>

                        </Tooltip>


                        {/* ==================================
                            Delete
                        ================================== */}

                        <Tooltip
                            title="Delete"
                        >

                            <IconButton
                                color="error"
                                size="small"
                                onClick={(event) => {

                                    event.stopPropagation();

                                    handleDelete(
                                        row
                                    );

                                }}
                            >

                                <Delete />

                            </IconButton>

                        </Tooltip>

                    </Stack>

                ),

            },

        ],
        [
            onView,
            onReply,
            onApprove,
            onReject,
            onDelete,
        ]
    );


    // ==================================================
    // JSX
    // ==================================================

    return (

        <Box
            sx={{
                width: "100%",
                height: 820,
                minHeight: 820,
                maxHeight: 820,
            }}
        >

            <DataGrid

                /* ======================================
                   Data
                ====================================== */

                rows={
                    Array.isArray(rows)
                        ? rows
                        : []
                }

                columns={
                    columns
                }

                loading={
                    loading
                }


                /* ======================================
                   Row Identification
                ====================================== */

                getRowId={
                    (row) =>
                        row.reviewId
                }


                /* ======================================
                   Selection
                ====================================== */

                checkboxSelection

                disableRowSelectionOnClick

                rowSelectionModel={
                    rowSelectionModel
                }

                onRowSelectionModelChange={
                    handleSelectionChange
                }


                /* ======================================
                   Row Click
                ====================================== */

                onRowClick={
                    handleRowClick
                }


                /* ======================================
                   Pagination
                ====================================== */

                pagination={
                    false
                }


                /* ======================================
                   Display
                ====================================== */

                density="comfortable"

                autoHeight={
                    false
                }

                rowHeight={
                    95
                }

                columnHeaderHeight={
                    56
                }


                /* ======================================
                   Toolbar
                ====================================== */

                slots={{
                    toolbar:
                        GridToolbar,
                }}

                slotProps={{
                    toolbar: {

                        showQuickFilter:
                            true,

                        quickFilterProps: {

                            debounceMs:
                                500,

                        },

                    },
                }}


                /* ======================================
                   Styling
                ====================================== */

                sx={{

                    width: "100%",

                    height: "100%",

                    border: 0,


                    /* ==================================
                       Column Headers
                    ================================== */

                    "& .MuiDataGrid-columnHeaders": {

                        backgroundColor:
                            "#f5f5f5",

                        fontWeight: 700,

                        minHeight:
                            "56px !important",

                        maxHeight:
                            "56px !important",

                        height:
                            "56px !important",

                    },


                    /* ==================================
                       Rows
                    ================================== */

                    "& .MuiDataGrid-row": {

                        minHeight:
                            "95px !important",

                        maxHeight:
                            "95px !important",

                        height:
                            "95px !important",

                    },


                    /* ==================================
                       Cells
                    ================================== */

                    "& .MuiDataGrid-cell": {

                        minHeight:
                            "95px !important",

                        maxHeight:
                            "95px !important",

                        height:
                            "95px !important",

                        display:
                            "flex",

                        alignItems:
                            "center",

                        boxSizing:
                            "border-box",

                        paddingTop:
                            "8px",

                        paddingBottom:
                            "8px",

                        overflow:
                            "hidden",

                    },


                    /* ==================================
                       Cell Content
                    ================================== */

                    "& .MuiDataGrid-cellContent": {

                        width:
                            "100%",

                        overflow:
                            "hidden",

                        textOverflow:
                            "ellipsis",

                        whiteSpace:
                            "nowrap",

                    },


                    /* ==================================
                       Stack
                    ================================== */

                    "& .MuiDataGrid-cell .MuiStack-root": {

                        maxWidth:
                            "100%",

                    },


                    /* ==================================
                       Typography
                    ================================== */

                    "& .MuiDataGrid-cell .MuiTypography-root": {

                        overflow:
                            "hidden",

                        textOverflow:
                            "ellipsis",

                        whiteSpace:
                            "nowrap",

                    },


                    /* ==================================
                       Avatar
                    ================================== */

                    "& .MuiDataGrid-cell .MuiAvatar-root": {

                        flexShrink:
                            0,

                    },


                    /* ==================================
                       Chips
                    ================================== */

                    "& .MuiDataGrid-cell .MuiChip-root": {

                        flexShrink:
                            0,

                    },


                    /* ==================================
                       Rating
                    ================================== */

                    "& .MuiDataGrid-cell .MuiRating-root": {

                        flexShrink:
                            0,

                    },


                    /* ==================================
                       Badge
                    ================================== */

                    "& .MuiDataGrid-cell .MuiBadge-root": {

                        flexShrink:
                            0,

                    },


                    /* ==================================
                       Action Buttons
                    ================================== */

                    "& .MuiDataGrid-cell .MuiIconButton-root": {

                        flexShrink:
                            0,

                    },


                    /* ==================================
                       Checkbox
                    ================================== */

                    "& .MuiDataGrid-cellCheckbox, & .MuiDataGrid-columnHeaderCheckbox": {

                        flexShrink:
                            0,

                    },


                    /* ==================================
                       Row Hover
                    ================================== */

                    "& .MuiDataGrid-row:hover": {

                        backgroundColor:
                            "#fafafa",

                    },


                    /* ==================================
                       Remove Focus Outline
                    ================================== */

                    "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {

                        outline:
                            "none",

                    },


                    /* ==================================
                       Prevent Content Overflow
                    ================================== */

                    "& .MuiDataGrid-virtualScroller": {

                        overflowX:
                            "auto",

                    },

                }}

            />

        </Box>

    );

};


// ======================================================
// PropTypes
// ======================================================

ReviewTable.propTypes = {

    rows:
        PropTypes.array,

    loading:
        PropTypes.bool,

    selectedRows:
        PropTypes.array,

    onSelectionChange:
        PropTypes.func,

    onView:
        PropTypes.func,

    onReply:
        PropTypes.func,

    onApprove:
        PropTypes.func,

    onReject:
        PropTypes.func,

    onDelete:
        PropTypes.func,

};


// ======================================================
// Default Props
// ======================================================

ReviewTable.defaultProps = {

    rows: [],

    loading: false,

    selectedRows: [],

    onSelectionChange:
        () => {},

    onView:
        () => {},

    onReply:
        () => {},

    onApprove:
        () => {},

    onReject:
        () => {},

    onDelete:
        () => {},

};


// ======================================================
// Export
// ======================================================

export default ReviewTable;
