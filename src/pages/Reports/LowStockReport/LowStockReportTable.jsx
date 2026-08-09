import React, {
  useCallback,
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  Box,
  Checkbox,
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
  Inventory2,
} from "@mui/icons-material";

//======================================================
// LowStockReportTable
//======================================================

const LowStockReportTable = ({
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
        Array.isArray(
          selectedRows
        )
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
        report?.inventoryId ??
        report?.inventoryID,
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
          id === undefined ||
          id === null
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
          safeReports.map(
            (report) =>
              getReportId(
                report
              )
          )
        );
      }
    }, [
      safeReports,
      getReportId,
      onSelectAll,
    ]);

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
  // Get Product Name
  //====================================================

  const getProductName =
    useCallback(
      (report) =>
        report?.productName ??
        report?.itemName ??
        report?.name ??
        "—",
      []
    );

  //====================================================
  // Get Product Code
  //====================================================

  const getProductCode =
    useCallback(
      (report) =>
        report?.productCode ??
        report?.itemCode ??
        report?.sku ??
        "—",
      []
    );

  //====================================================
  // Get Category
  //====================================================

  const getCategory =
    useCallback(
      (report) =>
        report?.categoryName ??
        report?.category ??
        "—",
      []
    );

  //====================================================
  // Get Warehouse
  //====================================================

  const getWarehouse =
    useCallback(
      (report) =>
        report?.warehouseName ??
        report?.warehouse ??
        "—",
      []
    );

  //====================================================
  // Get Current Stock
  //====================================================

  const getCurrentStock =
    useCallback(
      (report) =>
        report?.currentStock ??
        report?.stockQuantity ??
        report?.quantity ??
        0,
      []
    );

  //====================================================
  // Get Minimum Stock
  //====================================================

  const getMinimumStock =
    useCallback(
      (report) =>
        report?.minimumStock ??
        report?.minStock ??
        report?.reorderLevel ??
        0,
      []
    );

  //====================================================
  // Get Reorder Quantity
  //====================================================

  const getReorderQuantity =
    useCallback(
      (report) =>
        report?.reorderQuantity ??
        report?.reorderQty ??
        0,
      []
    );

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // JSX
  //====================================================

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      variant="outlined"
      className="low-stock-report-table"
      sx={{
        borderRadius: 2,
        overflowX: "auto",
      }}
    >
      <Table
        size="small"
        stickyHeader
        sx={{
          minWidth: 1100,
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
                    "Select all low stock reports",
                }}
              />
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
                SKU / Code
              </Typography>
            </TableCell>

            {/*==============================================
                Category
            ==============================================*/}

            <TableCell>
              <Typography
                variant="subtitle2"
                fontWeight={700}
              >
                Category
              </Typography>
            </TableCell>

            {/*==============================================
                Warehouse
            ==============================================*/}

            <TableCell>
              <Typography
                variant="subtitle2"
                fontWeight={700}
              >
                Warehouse
              </Typography>
            </TableCell>

            {/*==============================================
                Current Stock
            ==============================================*/}

            <TableCell align="right">
              <Typography
                variant="subtitle2"
                fontWeight={700}
              >
                Current Stock
              </Typography>
            </TableCell>

            {/*==============================================
                Minimum Stock
            ==============================================*/}

            <TableCell align="right">
              <Typography
                variant="subtitle2"
                fontWeight={700}
              >
                Minimum Stock
              </Typography>
            </TableCell>

            {/*==============================================
                Reorder
            ==============================================*/}

            <TableCell align="right">
              <Typography
                variant="subtitle2"
                fontWeight={700}
              >
                Reorder Qty
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
              (_, index) => (
                <TableRow
                  key={`loading-${index}`}
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
                        key={
                          `loading-${index}-${cellIndex}`
                        }
                      >
                        <Skeleton
                          variant="text"
                          width={
                            cellIndex ===
                            0
                              ? "80%"
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
                  <Inventory2
                    sx={{
                      fontSize: 42,
                    }}
                    color="disabled"
                  />

                  <Typography
                    variant="h6"
                    fontWeight={600}
                  >
                    No Low Stock Reports
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    No products currently
                    match the selected
                    criteria.
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

                const currentStock =
                  Number(
                    getCurrentStock(
                      report
                    )
                  ) || 0;

                const minimumStock =
                  Number(
                    getMinimumStock(
                      report
                    )
                  ) || 0;

                const reorderQuantity =
                  Number(
                    getReorderQuantity(
                      report
                    )
                  ) || 0;

                const isSelected =
                  safeSelectedRows.includes(
                    id
                  );

                const isOutOfStock =
                  currentStock <= 0;

                const isLowStock =
                  currentStock >
                    0 &&
                  currentStock <
                    minimumStock;

                const status =
                  isOutOfStock
                    ? "Out of Stock"
                    : isLowStock
                    ? "Low Stock"
                    : "Stock OK";

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
                          "aria-label": `Select ${getProductName(
                            report
                          )}`,
                        }}
                      />
                    </TableCell>

                    {/*====================================
                        Product
                    ====================================*/}

                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                      >
                        {
                          getProductName(
                            report
                          )
                        }
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
                        {
                          getProductCode(
                            report
                          )
                        }
                      </Typography>
                    </TableCell>

                    {/*====================================
                        Category
                    ====================================*/}

                    <TableCell>
                      <Typography
                        variant="body2"
                      >
                        {
                          getCategory(
                            report
                          )
                        }
                      </Typography>
                    </TableCell>

                    {/*====================================
                        Warehouse
                    ====================================*/}

                    <TableCell>
                      <Typography
                        variant="body2"
                      >
                        {
                          getWarehouse(
                            report
                          )
                        }
                      </Typography>
                    </TableCell>

                    {/*====================================
                        Current Stock
                    ====================================*/}

                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        fontWeight={700}
                      >
                        {formatNumber(
                          currentStock
                        )}
                      </Typography>
                    </TableCell>

                    {/*====================================
                        Minimum Stock
                    ====================================*/}

                    <TableCell align="right">
                      <Typography
                        variant="body2"
                      >
                        {formatNumber(
                          minimumStock
                        )}
                      </Typography>
                    </TableCell>

                    {/*====================================
                        Reorder Quantity
                    ====================================*/}

                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        fontWeight={600}
                      >
                        {formatNumber(
                          reorderQuantity
                        )}
                      </Typography>
                    </TableCell>

                    {/*====================================
                        Status
                    ====================================*/}

                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                          color:
                            isOutOfStock
                              ? "error.main"
                              : isLowStock
                              ? "warning.main"
                              : "success.main",
                        }}
                      >
                        {status}
                      </Typography>
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

  //====================================================
  // Part 1B Ends Here
  //====================================================
  //======================================================
// PropTypes
//======================================================

LowStockReportTable.propTypes = {
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

LowStockReportTable.defaultProps = {
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
export default LowStockReportTable;