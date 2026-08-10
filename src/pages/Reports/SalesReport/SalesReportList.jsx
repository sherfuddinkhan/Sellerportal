
//======================================================
// SalesReportList.jsx
// Part 1A
//======================================================

import React, {
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  DeleteOutline,
  EditOutlined,
  MoreVert,
  VisibilityOutlined,
} from "@mui/icons-material";

import {
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import {
  formatCurrency,
  formatDate,
  formatNumber,
  getStatusColor,
  normalizeSalesReport,
} from "./SalesReportHelpers";

//======================================================
// SalesReportList
//======================================================

const SalesReportList = ({
  reports = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
}) => {
  //====================================================
  // Menu State
  //====================================================

  const [anchorEl, setAnchorEl] =
    React.useState(null);

  const [selectedReport, setSelectedReport] =
    React.useState(null);

  //====================================================
  // Safe Reports
  //====================================================

  const safeReports = useMemo(
    () =>
      Array.isArray(reports)
        ? reports
        : [],
    [reports]
  );

  //====================================================
  // Open Menu
  //====================================================

  const handleMenuOpen = (
    event,
    report
  ) => {
    setAnchorEl(
      event.currentTarget
    );

    setSelectedReport(report);
  };

  //====================================================
  // Close Menu
  //====================================================

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReport(null);
  };

  //====================================================
  // View Handler
  //====================================================

  const handleView = () => {
    if (
      selectedReport &&
      typeof onView === "function"
    ) {
      onView(selectedReport);
    }

    handleMenuClose();
  };

  //====================================================
  // Edit Handler
  //====================================================

  const handleEdit = () => {
    if (
      selectedReport &&
      typeof onEdit === "function"
    ) {
      onEdit(selectedReport);
    }

    handleMenuClose();
  };

  //====================================================
  // Delete Handler
  //====================================================

  const handleDelete = () => {
    if (
      selectedReport &&
      typeof onDelete === "function"
    ) {
      onDelete(selectedReport);
    }

    handleMenuClose();
  };

  //====================================================
  // Status Helpers
  //====================================================

  const getStatusStyles = (
    status
  ) => {
    const color =
      getStatusColor(status);

    const styles = {
      success: {
        bgcolor: "success.light",
        color: "success.dark",
      },

      warning: {
        bgcolor: "warning.light",
        color: "warning.dark",
      },

      error: {
        bgcolor: "error.light",
        color: "error.dark",
      },

      info: {
        bgcolor: "info.light",
        color: "info.dark",
      },

      default: {
        bgcolor: "action.hover",
        color: "text.secondary",
      },
    };

    return (
      styles[color] ||
      styles.default
    );
  };

  //====================================================
  // Loading State
  //====================================================

  if (loading) {
    return (
      <Stack
        spacing={2}
        className="sales-report-list"
      >
        {[1, 2, 3].map(
          (item) => (
            <Card
              key={item}
              variant="outlined"
            >
              <CardContent>
                <Stack spacing={1.5}>
                  <Skeleton
                    variant="text"
                    width="45%"
                    height={28}
                  />

                  <Skeleton
                    variant="text"
                    width="70%"
                  />

                  <Skeleton
                    variant="text"
                    width="55%"
                  />

                  <Skeleton
                    variant="rectangular"
                    height={36}
                  />
                </Stack>
              </CardContent>
            </Card>
          )
        )}
      </Stack>
    );
  }

  //====================================================
  // Empty State
  //====================================================

  if (safeReports.length === 0) {
    return (
      <Box
        className="sales-report-list"
        sx={{
          width: "100%",
          py: 6,
          textAlign: "center",
        }}
      >
        <Typography
          variant="body1"
          color="text.secondary"
        >
          No sales reports found.
        </Typography>
      </Box>
    );
  }
  //====================================================
  // Render List
  //====================================================

  return (
    <Stack
      spacing={2}
      className="sales-report-list"
    >
      {safeReports.map(
        (report, index) => {
          const item =
            normalizeSalesReport(
              report
            );

          const reportId =
            item.id ??
            item.reportId ??
            index;

          const statusStyles =
            getStatusStyles(
              item.status
            );

          return (
            <Card
              key={reportId}
              variant="outlined"
              className="sales-report-list-item"
              sx={{
                width: "100%",
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Stack spacing={2}>
                  {/*================================
                      Header
                  =================================*/}

                  <Stack
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                      >
                        {item.orderNumber ||
                          item.invoiceNumber ||
                          item.id ||
                          "-"}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {formatDate(
                          item.date
                        )}
                      </Typography>
                    </Box>

                    <IconButton
                      size="small"
                      onClick={(event) =>
                        handleMenuOpen(
                          event,
                          report
                        )
                      }
                      aria-label="Sales report actions"
                    >
                      <MoreVert />
                    </IconButton>
                  </Stack>

                  <Divider />

                  {/*================================
                      Customer / Product
                  =================================*/}

                  <Stack
                    spacing={0.75}
                  >
                    <Typography
                      variant="body1"
                      fontWeight={600}
                    >
                      {item.customerName ||
                        item.customer ||
                        "Customer not available"}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {item.productName ||
                        item.product ||
                        item.itemName ||
                        "Product not available"}
                    </Typography>
                  </Stack>

                  {/*================================
                      Report Details
                  =================================*/}

                  <Stack
                    direction={{
                      xs: "column",
                      sm: "row",
                    }}
                    spacing={{
                      xs: 1.5,
                      sm: 3,
                    }}
                    flexWrap="wrap"
                  >
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Quantity
                      </Typography>

                      <Typography
                        variant="body1"
                        fontWeight={600}
                      >
                        {formatNumber(
                          item.quantity ??
                            item.totalQuantity ??
                            0,
                          0
                        )}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Sales Amount
                      </Typography>

                      <Typography
                        variant="body1"
                        fontWeight={600}
                      >
                        {formatCurrency(
                          item.salesAmount ??
                            item.totalSales ??
                            item.amount ??
                            0
                        )}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Tax
                      </Typography>

                      <Typography
                        variant="body1"
                        fontWeight={600}
                      >
                        {formatCurrency(
                          item.taxAmount ??
                            item.tax ??
                            0
                        )}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Total
                      </Typography>

                      <Typography
                        variant="body1"
                        fontWeight={700}
                      >
                        {formatCurrency(
                          item.totalAmount ??
                            item.total ??
                            item.salesAmount ??
                            0
                        )}
                      </Typography>
                    </Box>
                  </Stack>

                  {/*================================
                      Footer
                  =================================*/}

                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Box
                      sx={{
                        px: 1.25,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor:
                          statusStyles.bgcolor,
                        color:
                          statusStyles.color,
                      }}
                    >
                      <Typography
                        variant="caption"
                        fontWeight={700}
                      >
                        {item.status ||
                          "Pending"}
                      </Typography>
                    </Box>

                    <Stack
                      direction="row"
                      spacing={0.5}
                    >
                      {onView && (
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() =>
                            onView(report)
                          }
                          aria-label="View sales report"
                        >
                          <VisibilityOutlined fontSize="small" />
                        </IconButton>
                      )}

                      {onEdit && (
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() =>
                            onEdit(report)
                          }
                          aria-label="Edit sales report"
                        >
                          <EditOutlined fontSize="small" />
                        </IconButton>
                      )}

                      {onDelete && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            onDelete(report)
                          }
                          aria-label="Delete sales report"
                        >
                          <DeleteOutline fontSize="small" />
                        </IconButton>
                      )}
                    </Stack>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          );
        }
      )}

      {/*==============================================
          Actions Menu
      ==============================================*/}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {onView && (
          <MenuItem
            onClick={handleView}
          >
            <ListItemIcon>
              <VisibilityOutlined fontSize="small" />
            </ListItemIcon>

            <ListItemText>
              View
            </ListItemText>
          </MenuItem>
        )}

        {onEdit && (
          <MenuItem
            onClick={handleEdit}
          >
            <ListItemIcon>
              <EditOutlined fontSize="small" />
            </ListItemIcon>

            <ListItemText>
              Edit
            </ListItemText>
          </MenuItem>
        )}

        {onDelete && (
          <MenuItem
            onClick={handleDelete}
          >
            <ListItemIcon>
              <DeleteOutline
                fontSize="small"
                color="error"
              />
            </ListItemIcon>

            <ListItemText>
              Delete
            </ListItemText>
          </MenuItem>
        )}
      </Menu>
    </Stack>
  );
};

//======================================================
// PropTypes
//======================================================

SalesReportList.propTypes = {
  reports:
    PropTypes.array,

  loading:
    PropTypes.bool,

  onView:
    PropTypes.func,

  onEdit:
    PropTypes.func,

  onDelete:
    PropTypes.func,
};

//======================================================
// Default Props
//======================================================

SalesReportList.defaultProps = {
  reports: [],

  loading: false,

  onView: null,

  onEdit: null,

  onDelete: null,
};


export default SalesReportList;


