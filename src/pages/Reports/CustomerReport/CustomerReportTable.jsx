import React, { useMemo } from "react";
import PropTypes from "prop-types";
import {Box,Chip,IconButton,Stack,Tooltip,Typography} from "@mui/material";
import {Visibility,Edit,CheckCircle,Block,Delete,ShoppingCart,CurrencyRupee} from "@mui/icons-material";
import {DataGrid} from "@mui/x-data-grid";

//======================================================
// CustomerReportTable
//======================================================
const CustomerReportTable = ({
  rows = [],
  loading = false,
  selectedRows = [],
  onSelectionChange,
  onView,
  onEdit,
  onActivate,
  onDeactivate,
  onDelete,
}) => {
  //====================================================
  // Currency Formatter
  //====================================================
  const formatCurrency = (value) => {
    return new Intl.NumberFormat(
      "en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      } ).format(Number(value) || 0);
  };
  //====================================================
  // Number Formatter
  //====================================================
  const formatNumber = (value) => {
    return new Intl.NumberFormat("en-IN").format(Number(value) || 0);
  };
  //====================================================
  // Date Formatter
  //====================================================
  const formatDate = (value) => {
    if (!value) {
      return "-";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {return value;}
    return date.toLocaleDateString("en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };

  //====================================================
  // Normalize Rows
  //====================================================

  const normalizedRows = useMemo(() => {
    return (rows || []).map(
      (customer, index) => {
        const customerId = customer.customerId ?? customer.id ?? `customer-${index}`;
        return {
          ...customer,
          id: customerId,
          customerId,
          customerName: customer.customerName ?? customer.name ?? "-",
          email: customer.email ?? customer.customerEmail ?? "-",
          phone: customer.phone ?? customer.mobile ?? customer.mobileNumber ?? "-",
          customerType: customer.customerType ?? "Individual",
          marketplace: customer.marketplace ?? "-",
          status: customer.status ?? "Active",
          totalOrders: Number(customer.totalOrders ??customer.orderCount ?? 0),
          totalSales: Number( customer.totalSales ?? customer.totalAmount ?? customer.salesAmount ?? 0),
          totalPaid: Number( customer.totalPaid ?? customer.paidAmount ?? 0 ),
          totalOutstanding: Number( customer.totalOutstanding ?? customer.outstandingAmount ?? customer.balance ?? 0 ),
          lastOrderDate: customer.lastOrderDate ?? customer.lastOrder ?? null,
          createdDate: customer.createdDate ?? customer.createdAt ?? null,
        };
      }
    );

  }, [rows]);
    //====================================================
  // Status Chip
  //====================================================

  const renderStatus = (status) => {
    const normalizedStatus = String(status || "") .toLowerCase();
    let color = "default";
    if (normalizedStatus === "active") {
      color = "success";
    }
    if (normalizedStatus === "inactive") {
      color = "warning";
    }
    if (normalizedStatus === "blocked") {
      color = "error";
    }
    return (
      <Chip
        size="small"
        label={status || "Unknown"}
        color={color}
        variant="outlined"
      />
    );
  };
  //====================================================
  // Customer Type Chip
  //====================================================
  const renderCustomerType = (
    customerType
  ) => {
    return (
      <Chip
        size="small"
        label={customerType || "Individual"}
        variant="outlined"
      />
    );
  };

  //====================================================
  // Table Columns
  //====================================================
  const columns = useMemo(
    () => [
      //================================================
      // Customer
      //================================================
      {
        field: "customerName",
        headerName: "Customer",
        minWidth: 220,
        flex: 1.4,
        renderCell: ({ row }) => (
          <Stack
            spacing={0.25}
            sx={{
              minWidth: 0,
              py: 0.5,
            }}
          >
            <Typography
              variant="body2"
              fontWeight={700}
              noWrap
            >
              {row.customerName}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
            >
              ID: {row.customerId}
            </Typography>
          </Stack>
        ),
      },
      //================================================
      // Email
      //================================================
      {
        field: "email",
        headerName: "Email",
        minWidth: 220,
        flex: 1.2,
        renderCell: ({ value }) => (
          <Typography
            variant="body2"
            noWrap
          >
            {value || "-"}
          </Typography>
        ),
      },
      //================================================
      // Phone
      //================================================
      {
        field: "phone",
        headerName: "Phone",
        minWidth: 140,
        width: 150,
        renderCell: ({ value }) => (
          <Typography
            variant="body2"
            noWrap
          >
            {value || "-"}
          </Typography>
        ),
      },
      //================================================
      // Customer Type
      //================================================
      {
        field: "customerType",
        headerName: "Customer Type",
        width: 145,
        renderCell: ({ value }) => renderCustomerType(value),
      },
      //================================================
      // Marketplace
      //================================================
      {
        field: "marketplace",
        headerName: "Marketplace",
        width: 140,
        renderCell: ({ value }) => (
          <Chip
            size="small"
            label={value || "-"}
            variant="outlined"
          />
        ),
      },
      //================================================
      // Status
      //================================================
      {
        field: "status",
        headerName: "Status",
        width: 120,
        renderCell: ({ value }) => renderStatus(value),
      },
      //================================================
      // Orders
      //================================================
      {
        field: "totalOrders",
        headerName: "Orders",
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
            <ShoppingCart
              fontSize="small"
              color="action"
            />
            <Typography
              variant="body2"
              fontWeight={600}
            >
              {formatNumber(value)}
            </Typography>
          </Stack>
        ),
      },
      //================================================
      // Total Sales
      //================================================
      {
        field: "totalSales",
        headerName: "Total Sales",
        width: 150,
        align: "right",
        headerAlign: "right",
        renderCell: ({ value }) => (
          <Stack
            direction="row"
            spacing={0.25}
            alignItems="center"
            justifyContent="flex-end"
          >
            <CurrencyRupee
              fontSize="small"
              color="action"
            />
            <Typography
              variant="body2"
              fontWeight={600}
            >
              {formatCurrency(value)}
            </Typography>
          </Stack>
        ),
      },
      //================================================
      // Paid
      //================================================
      {
        field: "totalPaid",
        headerName: "Paid",
        width: 140,
        align: "right",
        headerAlign: "right",
        renderCell: ({ value }) => (
          <Typography
            variant="body2"
            color="success.main"
            fontWeight={600}
          >
            {formatCurrency(value)}
          </Typography>
        ),
      },
      //================================================
      // Outstanding
      //================================================
      {
        field: "totalOutstanding",
        headerName: "Outstanding",
        width: 150,
        align: "right",
        headerAlign: "right",
        renderCell: ({ value }) => (
          <Typography
            variant="body2"
            color={ Number(value) > 0 ? "error.main" : "success.main"}
            fontWeight={700}
          >
            {formatCurrency(value)}
          </Typography>
        ),
      },
      //================================================
      // Last Order Date
      //================================================
      {
        field: "lastOrderDate",
        headerName: "Last Order",
        width: 135,
        renderCell: ({ value }) => (
          <Typography
            variant="body2"
          >
            {formatDate(value)}
          </Typography>
        ),
      },
      //================================================
      // Created Date
      //================================================
      {
        field: "createdDate",
        headerName: "Created",
        width: 135,
        renderCell: ({ value }) => (
          <Typography
            variant="body2"
          >
            {formatDate(value)}
          </Typography>
        ),
      },
      //================================================
      // Actions
      //================================================
      {
        field: "actions",
        headerName: "Actions",
        width: 190,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: ({ row }) => (
          <Stack
            direction="row"
            spacing={0.25}
            alignItems="center"
          >
            {/*========================================
                View
            ========================================*/}
            <Tooltip title="View Customer">
              <IconButton
                size="small"
                color="primary"
                onClick={() => {
                  if (onView) {
                    onView(row);
                  }
                }}
              >
                <Visibility fontSize="small" />
              </IconButton>
            </Tooltip>
            {/*========================================
                Edit
            ========================================*/}
            <Tooltip title="Edit Customer">
              <IconButton
                size="small"
                color="info"
                onClick={() => {
                  if (onEdit) {
                    onEdit(row);
                  }
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            {/*========================================
                Activate / Deactivate
            ========================================*/}
            {String(row.status).toLowerCase() === "active" ? (
              <Tooltip title="Deactivate Customer">
                <IconButton
                  size="small"
                  color="warning"
                  onClick={() => {
                    if (onDeactivate) {
                      onDeactivate(row);
                    }
                  }}
                >
                  <Block fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Activate Customer">
                <IconButton
                  size="small"
                  color="success"
                  onClick={() => {
                    if (onActivate) {
                      onActivate(row);
                    }
                  }}
                >
                  <CheckCircle fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {/*========================================
                Delete
            ========================================*/}
            <Tooltip title="Delete Customer">
              <IconButton
                size="small"
                color="error"
                onClick={() => {
                  if (onDelete) {
                    onDelete(row);
                  }
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [onView,onEdit,onActivate,onDeactivate,onDelete]
  );
  //====================================================
  // DataGrid JSX
  //====================================================
  return (
    <Box
      className="customer-report-table"
      sx={{
        width: "100%",
        backgroundColor: "background.paper",
        borderRadius: 2,
      }}
    >

      <DataGrid
        rows={normalizedRows}
        columns={columns}

        loading={loading}

        checkboxSelection

        disableRowSelectionOnClick

        rowSelectionModel={selectedRows}

        onRowSelectionModelChange={
          (selectionModel) => {

            if (onSelectionChange) {
              onSelectionChange(
                selectionModel
              );
            }

          }
        }

        autoHeight

        pageSizeOptions={[
          10,
          25,
          50,
          100,
        ]}

        disableColumnFilter

        disableColumnSelector

        disableDensitySelector

        sx={{
          border: 0,

          "& .MuiDataGrid-columnHeaders": {
            backgroundColor:
              "action.hover",
            fontWeight: 700,
          },

          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
          },

          "& .MuiDataGrid-row:hover": {
            backgroundColor:
              "action.hover",
          },
        }}
      />

    </Box>
  );
};
//======================================================
// PropTypes
//======================================================

CustomerReportTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.object
  ),

  loading: PropTypes.bool,

  selectedRows: PropTypes.array,

  onSelectionChange: PropTypes.func,

  onView: PropTypes.func,

  onEdit: PropTypes.func,

  onActivate: PropTypes.func,

  onDeactivate: PropTypes.func,

  onDelete: PropTypes.func,
};

//======================================================
// Default Props
//======================================================

CustomerReportTable.defaultProps = {
  rows: [],

  loading: false,

  selectedRows: [],

  onSelectionChange: () => {},

  onView: () => {},

  onEdit: () => {},

  onActivate: () => {},

  onDeactivate: () => {},

  onDelete: () => {},
};

//======================================================
// Export
//======================================================

export default CustomerReportTable;