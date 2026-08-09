import React, {
  useCallback,
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  Box,
  Checkbox,
  Chip,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  Visibility,
  Edit,
  Delete,
  Storefront,
} from "@mui/icons-material";

//======================================================
// MarketplaceReportTable
//======================================================

const MarketplaceReportTable = ({
  reports = [],
  selectedRows = [],
  loading = false,
  onSelectRow,
  onSelectAll,
  onView,
  onEdit,
  onDelete,
}) => {

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
  // Safe Selected Rows
  //====================================================

  const safeSelectedRows =
    useMemo(
      () =>
        Array.isArray(selectedRows)
          ? selectedRows
          : [],
      [selectedRows]
    );

  //====================================================
  // Get Report ID
  //====================================================

  const getReportId =
    useCallback(
      (report) =>
        report?.id ??
        report?.reportId ??
        report?.orderId ??
        report?.orderNumber ??
        null,
      []
    );

  //====================================================
  // Get Marketplace
  //====================================================

  const getMarketplace =
    useCallback(
      (report) =>
        report?.marketplaceName ??
        report?.marketplace ??
        report?.channelName ??
        report?.channel ??
        "—",
      []
    );

  //====================================================
  // Get Order Number
  //====================================================

  const getOrderNumber =
    useCallback(
      (report) =>
        report?.orderNumber ??
        report?.orderNo ??
        report?.orderId ??
        "—",
      []
    );

  //====================================================
  // Get Product Name
  //====================================================

  const getProductName =
    useCallback(
      (report) =>
        report?.productName ??
        report?.itemName ??
        report?.product ??
        report?.name ??
        "—",
      []
    );

  //====================================================
  // Get SKU
  //====================================================

  const getSku =
    useCallback(
      (report) =>
        report?.sku ??
        report?.productCode ??
        report?.itemCode ??
        "—",
      []
    );

  //====================================================
  // Get Quantity
  //====================================================

  const getQuantity =
    useCallback(
      (report) =>
        Number(
          report?.quantity ??
          report?.qty ??
          report?.totalQuantity ??
          0
        ) || 0,
      []
    );

  //====================================================
  // Get Sales Amount
  //====================================================

  const getSalesAmount =
    useCallback(
      (report) =>
        Number(
          report?.totalAmount ??
          report?.salesAmount ??
          report?.orderAmount ??
          report?.amount ??
          report?.total ??
          0
        ) || 0,
      []
    );

  //====================================================
  // Get Status
  //====================================================

  const getStatus =
    useCallback(
      (report) =>
        report?.status ??
        report?.orderStatus ??
        report?.paymentStatus ??
        "—",
      []
    );

  //====================================================
  // Get Shipment Status
  //====================================================

  const getShipmentStatus =
    useCallback(
      (report) =>
        report?.shipmentStatus ??
        report?.shippingStatus ??
        report?.deliveryStatus ??
        "—",
      []
    );

  //====================================================
  // Format Number
  //====================================================

  const formatNumber =
    useCallback(
      (value) => {
        const numericValue =
          Number(value);

        if (
          !Number.isFinite(
            numericValue
          )
        ) {
          return "0";
        }

        return numericValue.toLocaleString(
          "en-IN"
        );
      },
      []
    );

  //====================================================
  // Format Currency
  //====================================================

  const formatCurrency =
    useCallback(
      (value) =>
        Number(value).toLocaleString(
          "en-IN",
          {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
          }
        ),
      []
    );

  //====================================================
  // Selected Count
  //====================================================

  const selectedCount =
    useMemo(
      () =>
        safeReports.filter(
          (report) =>
            safeSelectedRows.includes(
              getReportId(report)
            )
        ).length,
      [
        safeReports,
        safeSelectedRows,
        getReportId,
      ]
    );

  //====================================================
  // All Selected
  //====================================================

  const allSelected =
    safeReports.length > 0 &&
    selectedCount ===
      safeReports.length;

  //====================================================
  // Some Selected
  //====================================================

  const someSelected =
    selectedCount > 0 &&
    !allSelected;

  //====================================================
  // Handle Select Row
  //====================================================

  const handleSelectRow =
    useCallback(
      (report) => {
        const id =
          getReportId(report);

        if (
          id === null ||
          id === undefined
        ) {
          return;
        }

        if (
          typeof onSelectRow ===
          "function"
        ) {
          onSelectRow(id);
        }
      },
      [
        getReportId,
        onSelectRow,
      ]
    );

  //====================================================
  // Handle Select All
  //====================================================

  const handleSelectAll =
    useCallback(() => {
      if (
        typeof onSelectAll ===
        "function"
      ) {
        onSelectAll(
          safeReports
            .map(
              getReportId
            )
            .filter(
              (id) =>
                id !== null &&
                id !== undefined
            )
        );
      }
    }, [
      safeReports,
      getReportId,
      onSelectAll,
    ]);

  //====================================================
  // Status Color
  //====================================================

  const getStatusColor =
    useCallback(
      (status) => {
        const normalized =
          String(status)
            .toLowerCase()
            .trim();

        if (
          [
            "cancelled",
            "canceled",
            "failed",
            "rejected",
          ].includes(normalized)
        ) {
          return "error";
        }

        if (
          [
            "pending",
            "processing",
            "packed",
          ].includes(normalized)
        ) {
          return "warning";
        }

        if (
          [
            "completed",
            "delivered",
            "confirmed",
            "paid",
        ].includes(normalized)
        ) {
          return "success";
        }

        return "default";
      },
      []
    );

  //====================================================
  // Part 1A Ends Here
  //====================================================
  //======================================================
// JSX
//======================================================

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      variant="outlined"
      className="marketplace-report-table"
      sx={{
        borderRadius: 2,
        overflowX: "auto",
      }}
    >
      <Table
        size="small"
        stickyHeader
        sx={{
          minWidth: 1200,
        }}
      >
        {/*================================================
            Table Header
        =================================================*/}

        <TableHead>
          <TableRow>
            {/*==============================================
                Select All
            ==============================================*/}

            <TableCell
              padding="checkbox"
            >
              <Checkbox
                checked={
                  allSelected
                }
                indeterminate={
                  someSelected
                }
                onChange={
                  handleSelectAll
                }
                disabled={
                  loading ||
                  safeReports.length ===
                    0
                }
                inputProps={{
                  "aria-label":
                    "Select all marketplace reports",
                }}
              />
            </TableCell>

            {/*==============================================
                Marketplace
            ==============================================*/}

            <TableCell>
              <Typography
                variant="subtitle2"
                fontWeight={700}
              >
                Marketplace
              </Typography>
            </TableCell>

            {/*==============================================
                Order
            ==============================================*/}

            <TableCell>
              <Typography
                variant="subtitle2"
                fontWeight={700}
              >
                Order
              </Typography>
            </TableCell>

            {/*==============================================
                Product
            ==============================================*/}

            <TableCell>
              <Typography
                variant="subtitle2"
                fontWeight={700}
              >
                Product
              </Typography>
            </TableCell>

            {/*==============================================
                SKU
            ==============================================*/}

            <TableCell>
              <Typography
                variant="subtitle2"
                fontWeight={700}
              >
                SKU
              </Typography>
            </TableCell>

            {/*==============================================
                Quantity
            ==============================================*/}

            <TableCell align="right">
              <Typography
                variant="subtitle2"
                fontWeight={700}
              >
                Quantity
              </Typography>
            </TableCell>

            {/*==============================================
                Sales
            ==============================================*/}

            <TableCell align="right">
              <Typography
                variant="subtitle2"
                fontWeight={700}
              >
                Sales
              </Typography>
            </TableCell>

            {/*==============================================
                Status
            ==============================================*/}

            <TableCell>
              <Typography
                variant="subtitle2"
                fontWeight={700}
              >
                Status
              </Typography>
            </TableCell>

            {/*==============================================
                Shipment
            ==============================================*/}

            <TableCell>
              <Typography
                variant="subtitle2"
                fontWeight={700}
              >
                Shipment
              </Typography>
            </TableCell>

            {/*==============================================
                Actions
            ==============================================*/}

            <TableCell align="center">
              <Typography
                variant="subtitle2"
                fontWeight={700}
              >
                Actions
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>

        {/*================================================
            Table Body
        =================================================*/}

        <TableBody>
          {loading ? (
            Array.from({
              length: 6,
            }).map(
              (_, rowIndex) => (
                <TableRow
                  key={`loading-${rowIndex}`}
                >
                  <TableCell
                    padding="checkbox"
                  >
                    <Skeleton
                      variant="rectangular"
                      width={20}
                      height={20}
                    />
                  </TableCell>

                  {Array.from({
                    length: 9,
                  }).map(
                    (_, cellIndex) => (
                      <TableCell
                        key={`loading-${rowIndex}-${cellIndex}`}
                      >
                        <Skeleton
                          variant="text"
                          width={
                            cellIndex ===
                            2
                              ? "85%"
                              : "60%"
                          }
                        />
                      </TableCell>
                    )
                  )}

                  <TableCell align="center">
                    <Skeleton
                      variant="text"
                      width={80}
                    />
                  </TableCell>
                </TableRow>
              )
            )
          ) : safeReports.length ===
            0 ? (
            /*============================================
                Empty State
            ============================================*/

            <TableRow>
              <TableCell
                colSpan={11}
                align="center"
                sx={{
                  py: 6,
                }}
              >
                <Stack
                  spacing={1}
                  alignItems="center"
                >
                  <Storefront
                    sx={{
                      fontSize: 42,
                    }}
                    color="disabled"
                  />

                  <Typography
                    variant="h6"
                    fontWeight={600}
                  >
                    No Marketplace Reports
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    There are no marketplace
                    reports matching the
                    current criteria.
                  </Typography>
                </Stack>
              </TableCell>
            </TableRow>
          ) : (
            safeReports.map(
              (report) => {
                const id =
                  getReportId(
                    report
                  );

                const status =
                  getStatus(
                    report
                  );

                const shipmentStatus =
                  getShipmentStatus(
                    report
                  );

                const statusColor =
                  getStatusColor(
                    status
                  );

                const shipmentColor =
                  getStatusColor(
                    shipmentStatus
                  );

                const isSelected =
                  safeSelectedRows.includes(
                    id
                  );

                return (
                  <TableRow
                    key={id}
                    hover
                    selected={
                      isSelected
                    }
                  >
                    {/*====================================
                        Checkbox
                    ====================================*/}

                    <TableCell
                      padding="checkbox"
                    >
                      <Checkbox
                        checked={
                          isSelected
                        }
                        onChange={() =>
                          handleSelectRow(
                            report
                          )
                        }
                        disabled={
                          loading
                        }
                        inputProps={{
                          "aria-label": `Select marketplace report ${id}`,
                        }}
                      />
                    </TableCell>

                    {/*====================================
                        Marketplace
                    ====================================*/}

                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <Storefront
                          fontSize="small"
                          color="primary"
                        />

                        <Typography
                          variant="body2"
                          fontWeight={600}
                        >
                          {getMarketplace(
                            report
                          )}
                        </Typography>
                      </Stack>
                    </TableCell>

                    {/*====================================
                        Order
                    ====================================*/}

                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                      >
                        {getOrderNumber(
                          report
                        )}
                      </Typography>
                    </TableCell>

                    {/*====================================
                        Product
                    ====================================*/}

                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                      >
                        {getProductName(
                          report
                        )}
                      </Typography>
                    </TableCell>

                    {/*====================================
                        SKU
                    ====================================*/}

                    <TableCell>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {getSku(
                          report
                        )}
                      </Typography>
                    </TableCell>

                    {/*====================================
                        Quantity
                    ====================================*/}

                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        fontWeight={600}
                      >
                        {formatNumber(
                          getQuantity(
                            report
                          )
                        )}
                      </Typography>
                    </TableCell>

                    {/*====================================
                        Sales
                    ====================================*/}

                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        fontWeight={700}
                      >
                        {formatCurrency(
                          getSalesAmount(
                            report
                          )
                        )}
                      </Typography>
                    </TableCell>

                    {/*====================================
                        Status
                    ====================================*/}

                    <TableCell>
                      <Chip
                        label={
                          status
                        }
                        size="small"
                        color={
                          statusColor
                        }
                        variant={
                          statusColor ===
                          "default"
                            ? "outlined"
                            : "filled"
                        }
                      />
                    </TableCell>

                    {/*====================================
                        Shipment
                    ====================================*/}

                    <TableCell>
                      <Chip
                        label={
                          shipmentStatus
                        }
                        size="small"
                        color={
                          shipmentColor
                        }
                        variant={
                          shipmentColor ===
                          "default"
                            ? "outlined"
                            : "filled"
                        }
                      />
                    </TableCell>

                    {/*====================================
                        Actions
                    ====================================*/}

                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="center"
                      >
                        <Tooltip title="View">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                              onView?.(
                                report
                              )
                            }
                            disabled={
                              loading
                            }
                          >
                            <Visibility
                              fontSize="small"
                            />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                              onEdit?.(
                                report
                              )
                            }
                            disabled={
                              loading
                            }
                          >
                            <Edit
                              fontSize="small"
                            />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              onDelete?.(
                                report
                              )
                            }
                            disabled={
                              loading
                            }
                          >
                            <Delete
                              fontSize="small"
                            />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              }
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

//======================================================
// Part 1B Ends Here
//======================================================
//======================================================
// PropTypes
//======================================================

MarketplaceReportTable.propTypes = {
  reports: PropTypes.arrayOf(
    PropTypes.object
  ),

  selectedRows: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ])
  ),

  loading: PropTypes.bool,

  onSelectRow: PropTypes.func,

  onSelectAll: PropTypes.func,

  onView: PropTypes.func,

  onEdit: PropTypes.func,

  onDelete: PropTypes.func,
};

//======================================================
// Default Props
//======================================================

MarketplaceReportTable.defaultProps = {
  reports: [],

  selectedRows: [],

  loading: false,

  onSelectRow: () => {},

  onSelectAll: () => {},

  onView: () => {},

  onEdit: () => {},

  onDelete: () => {},
};

//======================================================
// Export
//======================================================
}
export default MarketplaceReportTable;