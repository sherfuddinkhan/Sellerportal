//======================================================
// StockLedgerReportCard.jsx
// Part 1A
//======================================================

import React, {useMemo,} from "react";
import PropTypes from "prop-types";
import {Box,Card,CardContent,Chip,Divider,Grid,Stack,Typography,} from "@mui/material";
import {ArrowDownward,ArrowUpward,Inventory2Outlined,WarehouseOutlined,} from "@mui/icons-material";
//======================================================
// Helpers
//======================================================
import {formatDate,formatNumber,normalizeStockLedgerReport,getStockLedgerStatusColor,} from "./StockLedgerReportHelpers";

//======================================================
// StockLedgerReportCard
//======================================================

const StockLedgerReportCard = ({
  report,
  onClick,
  selected = false,
  loading = false,
}) => {
  //====================================================
  // Normalize Report
  //====================================================

  const normalizedReport = useMemo(
    () =>
      normalizeStockLedgerReport(
        report || {}
      ),
    [report]
  );

  //====================================================
  // Report Values
  //====================================================

  const {
    date,
    voucherNumber,
    voucherType,
    stockItem,
    itemName,
    warehouse,
    godown,
    transactionType,
    inwardQuantity,
    outwardQuantity,
    closingQuantity,
    balanceQuantity,
    unit,
    rate,
    amount,
    status,
  } = normalizedReport;

  //====================================================
  // Display Closing Quantity
  //====================================================

  const displayClosingQuantity =
    closingQuantity ??
    balanceQuantity ??
    0;

  //====================================================
  // Display Item Name
  //====================================================

  const displayItemName =
    stockItem ||
    itemName ||
    "Unknown Item";

  //====================================================
  // Status
  //====================================================

  const statusColor =
    getStockLedgerStatusColor(
      status
    );

  //====================================================
  // Render
  //====================================================

  return (
    <Card
      className="stock-ledger-report-card"
      variant={
        selected
          ? "elevation"
          : "outlined"
      }
      elevation={
        selected ? 3 : 0
      }
      onClick={
        loading
          ? undefined
          : onClick
      }
      sx={{
        width: "100%",
        cursor:
          onClick && !loading
            ? "pointer"
            : "default",
        borderRadius: 2,
        transition:
          "all 0.2s ease",
        "&:hover": {
          boxShadow:
            onClick && !loading
              ? 3
              : undefined,
        },
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          {/*============================================
              Header
          =============================================*/}

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            alignItems={{
              xs: "flex-start",
              sm: "center",
            }}
            justifyContent="space-between"
            spacing={1}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <Inventory2Outlined
                fontSize="small"
              />

              <Typography
                variant="subtitle1"
                fontWeight={700}
              >
                {displayItemName}
              </Typography>
            </Stack>

            <Chip
              size="small"
              label={
                status || "Pending"
              }
              color={
                statusColor
              }
              variant="outlined"
            />
          </Stack>

          <Divider />

          {/*============================================
              Basic Information
          =============================================*/}

          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <Stack spacing={0.5}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Date
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight={600}
                >
                  {formatDate(
                    date
                  )}
                </Typography>
              </Stack>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <Stack spacing={0.5}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Voucher Number
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight={600}
                >
                  {voucherNumber ||
                    "-"}
                </Typography>
              </Stack>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <Stack spacing={0.5}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Voucher Type
                </Typography>

                <Typography
                  variant="body2"
                >
                  {voucherType ||
                    "-"}
                </Typography>
              </Stack>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <Stack spacing={0.5}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Transaction
                </Typography>

                <Typography
                  variant="body2"
                >
                  {transactionType ||
                    "-"}
                </Typography>
              </Stack>
            </Grid>
          </Grid>

          {/*============================================
              Location
          =============================================*/}

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <WarehouseOutlined
                fontSize="small"
              />

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Warehouse
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight={600}
                >
                  {warehouse ||
                    "-"}
                </Typography>
              </Box>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <WarehouseOutlined
                fontSize="small"
              />

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Godown
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight={600}
                >
                  {godown || "-"}
                </Typography>
              </Box>
            </Stack>
          </Stack>

          {/*============================================
              Part 1A Ends Here
          =============================================*/}
        </Stack>
      </CardContent>
    </Card>
  );
};


//======================================================
// PropTypes
//======================================================

StockLedgerReportCard.propTypes = {
  report:
    PropTypes.object,

  onClick:
    PropTypes.func,

  selected:
    PropTypes.bool,

  loading:
    PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

StockLedgerReportCard.defaultProps = {
  report: {},

  onClick: null,

  selected: false,

  loading: false,
};

//======================================================
// Export
//======================================================

export default StockLedgerReportCard;

