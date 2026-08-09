import React, {
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  ArrowDownward,
  ArrowUpward,
  Inventory2,
  ReceiptLong,
} from "@mui/icons-material";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import {
  formatCurrency,
  formatDate,
  getStatusColor,
  normalizePurchaseReport,
  toNumber,
} from "./PurchaseReportHelpers";

//======================================================
// PurchaseReportCard
//======================================================

const PurchaseReportCard = ({
  report = null,
  onView,
  onEdit,
  compact = false,
}) => {
  //====================================================
  // Normalize Report
  //====================================================

  const normalizedReport =
    useMemo(
      () =>
        normalizePurchaseReport(
          report || {}
        ),
      [report]
    );

  //====================================================
  // Values
  //====================================================

  const purchaseAmount =
    toNumber(
      normalizedReport.purchaseAmount ??
        normalizedReport.totalAmount ??
        normalizedReport.amount
    );

  const quantity =
    toNumber(
      normalizedReport.quantity
    );

  const status =
    normalizedReport.status ||
    "Completed";

  const statusColor =
    getStatusColor(status);

  //====================================================
  // Render
  //====================================================

  return (
    <Card
      className="purchase-report-card"
      variant="outlined"
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          {/*============================================
              Header
          ============================================*/}

          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent:
                "space-between",
              gap: 2,
            }}
          >
            <Box
              sx={{
                minWidth: 0,
                flex: 1,
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <ReceiptLong
                  fontSize="small"
                />

                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  noWrap
                >
                  {normalizedReport.orderNumber ||
                    normalizedReport.purchaseOrderNumber ||
                    "Purchase Report"}
                </Typography>
              </Stack>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {formatDate(
                  normalizedReport.date
                )}
              </Typography>
            </Box>

            <Chip
              size="small"
              label={status}
              color={statusColor}
              variant="outlined"
            />
          </Box>

          <Divider />

          {/*============================================
              Purchase Details
          ============================================*/}

          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              xs={12}
              sm={6}
            >
              <Stack spacing={0.5}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Supplier
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight={600}
                  noWrap
                >
                  {normalizedReport.supplierName ||
                    normalizedReport.supplier ||
                    "—"}
                </Typography>
              </Stack>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
            >
              <Stack spacing={0.5}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Marketplace
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight={600}
                  noWrap
                >
                  {normalizedReport.marketplace ||
                    "—"}
                </Typography>
              </Stack>
            </Grid>

            <Grid
              item
              xs={12}
            >
              <Stack spacing={0.5}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Product
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight={600}
                >
                  {normalizedReport.productName ||
                    normalizedReport.product ||
                    "—"}
                </Typography>
              </Stack>
            </Grid>

            {!compact && (
              <>
                <Grid
                  item
                  xs={6}
                  sm={4}
                >
                  <Stack spacing={0.5}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Quantity
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={0.5}
                      alignItems="center"
                    >
                      <Inventory2
                        fontSize="small"
                      />

                      <Typography
                        variant="body2"
                        fontWeight={600}
                      >
                        {quantity}
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>

                <Grid
                  item
                  xs={6}
                  sm={4}
                >
                  <Stack spacing={0.5}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Unit Cost
                    </Typography>

                    <Typography
                      variant="body2"
                      fontWeight={600}
                    >
                      {formatCurrency(
                        normalizedReport.unitCost
                      )}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={4}
                >
                  <Stack spacing={0.5}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Purchase Amount
                    </Typography>

                    <Typography
                      variant="body1"
                      fontWeight={700}
                    >
                      {formatCurrency(
                        purchaseAmount
                      )}
                    </Typography>
                  </Stack>
                </Grid>
              </>
            )}
          </Grid>

          {/*============================================
              Cost Summary
          ============================================*/}

          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor:
                "action.hover",
            }}
          >
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1.5}
              justifyContent="space-between"
            >
              <Stack spacing={0.25}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Tax
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight={600}
                >
                  {formatCurrency(
                    normalizedReport.tax
                  )}
                </Typography>
              </Stack>

              <Stack spacing={0.25}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Discount
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight={600}
                >
                  {formatCurrency(
                    normalizedReport.discount
                  )}
                </Typography>
              </Stack>

              <Stack spacing={0.25}>
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
                    normalizedReport.totalAmount ??
                      purchaseAmount
                  )}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          {/*============================================
              Price Movement
          ============================================*/}

          {!compact && (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              {toNumber(
                normalizedReport.costChange
              ) >= 0 ? (
                <ArrowUpward
                  fontSize="small"
                />
              ) : (
                <ArrowDownward
                  fontSize="small"
                />
              )}

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Cost change:{" "}
                {formatCurrency(
                  normalizedReport.costChange
                )}
              </Typography>
            </Stack>
          )}

          {/*============================================
              Actions
          ============================================*/}

          <Stack
            direction="row"
            spacing={1}
            justifyContent="flex-end"
          >
            <Box
              component="button"
              type="button"
              onClick={() =>
                onView?.(report)
              }
              sx={{
                border: 0,
                background:
                  "transparent",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: 600,
                padding: "4px 8px",
              }}
            >
              View
            </Box>

            <Box
              component="button"
              type="button"
              onClick={() =>
                onEdit?.(report)
              }
              sx={{
                border: 0,
                background:
                  "transparent",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: 600,
                padding: "4px 8px",
              }}
            >
              Edit
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

//======================================================
// PropTypes
//======================================================

PurchaseReportCard.propTypes = {
  report:
    PropTypes.object,

  onView:
    PropTypes.func,

  onEdit:
    PropTypes.func,

  compact:
    PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

PurchaseReportCard.defaultProps = {
  report: null,

  onView: () => {},

  onEdit: () => {},

  compact: false,
};

//======================================================
// Export
//======================================================

export default PurchaseReportCard;
