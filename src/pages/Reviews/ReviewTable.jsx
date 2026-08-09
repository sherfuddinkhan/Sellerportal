import React, { useMemo } from "react";
import PropTypes from "prop-types";
import {Avatar,Box,Chip,IconButton,Rating,Stack,Tooltip,Typography} from "@mui/material";
import {CheckCircle,Cancel,Delete,Reply,Visibility,Verified,ThumbUp,Image,Store} from "@mui/icons-material";
import {DataGrid,GridToolbar} from "@mui/x-data-grid";

//====================================================
// Status Colors
//====================================================

const STATUS_COLORS = {
  Pending: "warning",
  Approved: "success",
  Rejected: "error",
};

//====================================================
// Marketplace Colors
//====================================================

const MARKETPLACE_COLORS = {
  Amazon: "warning",
  Flipkart: "primary",
  Meesho: "secondary",
  Shopify: "success",
};

//====================================================
// Date Formatter
//====================================================

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

//====================================================
// Status Chip
//====================================================

const StatusChip = ({ status }) => (
  <Chip
    size="small"
    label={status}
    color={STATUS_COLORS[status] || "default"}
  />
);

//====================================================
// Marketplace Chip
//====================================================

const MarketplaceChip = ({ marketplace }) => (
  <Chip
    size="small"
    label={marketplace}
    color={
      MARKETPLACE_COLORS[marketplace] || "default"
    }
    icon={<Store />}
  />
);

//====================================================
// Review Rating
//====================================================

const ReviewRating = ({ value }) => (
  <Rating
    size="small"
    value={value || 0}
    precision={0.5}
    readOnly
  />
);

//====================================================
// Customer Avatar
//====================================================

const CustomerAvatar = ({ customer }) => (
  <Stack
    direction="row"
    spacing={1}
    alignItems="center"
  >
    <Avatar src={customer?.image}>
      {customer?.name?.charAt(0)}
    </Avatar>

    <Box>

      <Typography
        variant="body2"
        fontWeight={600}
      >
        {customer?.name}
      </Typography>

      {customer?.verifiedBuyer && (
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
        >
          <Verified
            sx={{
              fontSize: 14,
              color: "green",
            }}
          />

          <Typography
            variant="caption"
            color="green"
          >
            Verified Buyer
          </Typography>
        </Stack>
      )}

    </Box>
  </Stack>
);

//====================================================
// Product Cell
//====================================================

const ProductCell = ({ product }) => (
  <Stack
    direction="row"
    spacing={1}
    alignItems="center"
  >
    <Avatar
      variant="rounded"
      src={product?.image}
    >
      <Image />
    </Avatar>

    <Box>

      <Typography
        variant="body2"
        fontWeight={600}
      >
        {product?.name}
      </Typography>

      <Typography
        variant="caption"
        color="text.secondary"
      >
        SKU : {product?.sku}
      </Typography>

    </Box>
  </Stack>
);

//====================================================
// ReviewTable Component
//====================================================

const ReviewTable = ({
  rows = [],
  loading = false,

  page = 0,
  pageSize = 10,
  rowCount = 0,

  selectedRows = [],

  onPageChange,
  onPageSizeChange,
  onSelectionChange,

  onView,
  onReply,
  onApprove,
  onReject,
  onDelete,
}) => {

  //==================================================
  // Selected Model
  //==================================================

  const selectionModel = useMemo(
    () => selectedRows,
    [selectedRows]
  );

  //==================================================
  // Row Selection
  //==================================================

  const handleSelectionChange = (selection) => {
    if (onSelectionChange) {
      onSelectionChange(selection);
    }
  };

  //==================================================
  // Pagination
  //==================================================

  const handlePaginationChange = (model) => {

    if (onPageChange) {
      onPageChange(model.page);
    }

    if (onPageSizeChange) {
      onPageSizeChange(model.pageSize);
    }
  };

  //==================================================
  // Row Click
  //==================================================

  const handleRowClick = (params) => {

    if (onView) {
      onView(params.row);
    }

  };

  //==================================================
  // Action Handlers
  //==================================================

  const handleView = (row) => {

    if (onView) {
      onView(row);
    }

  };

  const handleReply = (row) => {

    if (onReply) {
      onReply(row);
    }

  };

  const handleApprove = (row) => {

    if (onApprove) {
      onApprove(row);
    }

  };

  const handleReject = (row) => {

    if (onReject) {
      onReject(row);
    }

  };

  const handleDelete = (row) => {

    if (onDelete) {
      onDelete(row);
    }

  };

  //==================================================
  // DataGrid Columns
  //==================================================

  const columns = useMemo(() => [

    {
      field: "product",
      headerName: "Product",
      flex: 1.6,
      minWidth: 260,
      sortable: false,

      renderCell: ({ row }) => (
        <ProductCell
          product={{
            name: row.productName,
            sku: row.productSku,
            image: row.productImage,
          }}
        />
      ),
    },

    {
      field: "customer",
      headerName: "Customer",
      flex: 1.5,
      minWidth: 250,
      sortable: false,

      renderCell: ({ row }) => (
        <CustomerAvatar
          customer={{
            name: row.customerName,
            image: row.customerImage,
            verifiedBuyer: row.verifiedBuyer,
          }}
        />
      ),
    },

    {
      field: "rating",
      headerName: "Rating",
      width: 150,

      renderCell: ({ value }) => (
        <ReviewRating value={value} />
      ),
    },

    {
      field: "reviewTitle",
      headerName: "Title",
      flex: 1.3,
      minWidth: 220,
    },

    {
      field: "review",
      headerName: "Review",
      flex: 2,
      minWidth: 300,

      renderCell: ({ value }) => (
        <Typography
          variant="body2"
          noWrap
        >
          {value}
        </Typography>
      ),
    },

    {
      field: "status",
      headerName: "Status",
      width: 140,

      renderCell: ({ value }) => (
        <StatusChip status={value} />
      ),
    },

    {
      field: "marketplace",
      headerName: "Marketplace",
      width: 150,

      renderCell: ({ value }) => (
        <MarketplaceChip marketplace={value} />
      ),
    },

    {
      field: "createdDate",
      headerName: "Date",
      width: 140,

      valueFormatter: ({ value }) =>
        formatDate(value),
    },
      {
      field: "helpfulCount",
      headerName: "Helpful",
      width: 110,
      align: "center",
      headerAlign: "center",

      renderCell: ({ value }) => (
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          justifyContent="center"
        >
          <ThumbUp
            sx={{
              color: "#1976d2",
              fontSize: 18,
            }}
          />

          <Typography
            variant="body2"
            fontWeight={600}
          >
            {value || 0}
          </Typography>
        </Stack>
      ),
    },

    {
      field: "images",
      headerName: "Images",
      width: 110,
      align: "center",
      headerAlign: "center",

      renderCell: ({ row }) => {

        const count = row.reviewImages?.length || 0;

        return (
          <Badge
            badgeContent={count}
            color="primary"
          >
            <Image color="action" />
          </Badge>
        );
      },
    },

    {
      field: "verifiedBuyer",
      headerName: "Verified",
      width: 120,
      align: "center",
      headerAlign: "center",

      renderCell: ({ value }) =>
        value ? (
          <Chip
            size="small"
            color="success"
            icon={<Verified />}
            label="Verified"
          />
        ) : (
          <Chip
            size="small"
            color="default"
            label="Guest"
          />
        ),
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 240,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",

      renderCell: ({ row }) => (

        <Stack
          direction="row"
          spacing={0.5}
        >

          <Tooltip title="View Review">
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleView(row)}
            >
              <Visibility />
            </IconButton>
          </Tooltip>

          <Tooltip title="Reply">
            <IconButton
              color="secondary"
              size="small"
              onClick={() => handleReply(row)}
            >
              <Reply />
            </IconButton>
          </Tooltip>

          <Tooltip title="Approve">
            <IconButton
              color="success"
              size="small"
              onClick={() => handleApprove(row)}
            >
              <CheckCircle />
            </IconButton>
          </Tooltip>

          <Tooltip title="Reject">
            <IconButton
              color="warning"
              size="small"
              onClick={() => handleReject(row)}
            >
              <Cancel />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              color="error"
              size="small"
              onClick={() => handleDelete(row)}
            >
              <Delete />
            </IconButton>
          </Tooltip>

        </Stack>

      ),
    },

  ], [
    onView,
    onReply,
    onApprove,
    onReject,
    onDelete,
  ]);
    return (
    <Box sx={{ width: "100%", height: 700 }}>

      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}

        getRowId={(row) => row.reviewId}

        checkboxSelection
        disableRowSelectionOnClick

        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={handleSelectionChange}

        onRowClick={handleRowClick}

        paginationMode="server"

        paginationModel={{
          page,
          pageSize,
        }}

        onPaginationModelChange={
          handlePaginationChange
        }

        pageSizeOptions={[
          10,
          25,
          50,
          100,
        ]}

        rowCount={rowCount}

        autoHeight={false}

        density="comfortable"

        slots={{
          toolbar: GridToolbar,
        }}

        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: {
              debounceMs: 500,
            },
          },
        }}

        sx={{
          border: 0,

          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f5f5",
            fontWeight: 700,
          },

          "& .MuiDataGrid-cell": {
            alignItems: "center",
          },

          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#fafafa",
          },
        }}
      />

    </Box>
  );
};

//====================================================
// PropTypes
//====================================================

ReviewTable.propTypes = {
  rows: PropTypes.array,
  loading: PropTypes.bool,

  page: PropTypes.number,
  pageSize: PropTypes.number,
  rowCount: PropTypes.number,

  selectedRows: PropTypes.array,

  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  onSelectionChange: PropTypes.func,

  onView: PropTypes.func,
  onReply: PropTypes.func,
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
  onDelete: PropTypes.func,
};

//====================================================
// Default Props
//====================================================

ReviewTable.defaultProps = {
  rows: [],
  loading: false,

  page: 0,
  pageSize: 10,
  rowCount: 0,

  selectedRows: [],

  onPageChange: () => {},
  onPageSizeChange: () => {},
  onSelectionChange: () => {},

  onView: () => {},
  onReply: () => {},
  onApprove: () => {},
  onReject: () => {},
  onDelete: () => {},
};

//====================================================
// Export
//====================================================

export default ReviewTable;