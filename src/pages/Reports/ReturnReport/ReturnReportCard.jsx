import React, {useMemo} from "react";
import PropTypes from "prop-types";
import {AssignmentReturn,Inventory2,ShoppingCart,TrendingDown} from "@mui/icons-material";
import {Box,Card,CardContent,Chip,Grid,Skeleton,Stack,Typography} from "@mui/material";
import {formatCurrency,formatNumber,getStatusColor,normalizeReturnReport,toNumber} from "./ReturnReportHelpers";

//======================================================
// ReturnReportCard
//======================================================

const ReturnReportCard = ({
  report = null,
  loading = false,
  onClick,
}) => {
  //====================================================
  // Normalize Report
  //====================================================

  const normalizedReport = useMemo(
    () =>
      normalizeReturnReport(
        report || {}
      ),
    [report]
  );

  //====================================================
  // Return Values
  //====================================================

  const quantity = toNumber(
    normalizedReport.quantity
  );

  const returnAmount = toNumber(
    normalizedReport.returnAmount ??
      normalizedReport.totalAmount ??
      normalizedReport.amount
  );

  const refundAmount = toNumber(
    normalizedReport.refundAmount
  );

  const status =
    normalizedReport.status ||
    "Pending";

  //====================================================
  // Report Label
  //====================================================

  const reportLabel =
    normalizedReport.returnNumber ||
    normalizedReport.returnOrderNumber ||
    normalizedReport.orderNumber ||
    normalizedReport.id ||
    "Return Report";

  //====================================================
  // Loading State
  //====================================================

  if (loading) {
    return (
      <Card
        className="return-report-card"
        variant="outlined"
      >
        <CardContent>
          <Stack spacing={2}>
            <Skeleton
              variant="text"
              width="60%"
              height={28}
            />

            <Skeleton
              variant="text"
              width="40%"
            />

            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={6}
              >
                <Skeleton
                  variant="rounded"
                  height={60}
                />
              </Grid>

              <Grid
                item
                xs={6}
              >
                <Skeleton
                  variant="rounded"
                  height={60}
                />
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>
    );
  }
  //====================================================
  // Render
  //====================================================

  return (
    <Card
      className="return-report-card"
      variant="outlined"
      onClick={
        onClick
          ? () => onClick(normalizedReport)
          : undefined
      }
      sx={{
        height: "100%",
        cursor: onClick
          ? "pointer"
          : "default",
        transition:
          "box-shadow 0.2s ease, transform 0.2s ease",

        "&:hover": onClick
          ? {
              boxShadow: 3,
              transform:
                "translateY(-2px)",
            }
          : undefined,
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          {/*============================================
              Header
          ============================================*/}

          <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
            spacing={2}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                minWidth: 0,
              }}
            >
              <AssignmentReturn
                color="primary"
              />

              <Box
                sx={{
                  minWidth: 0,
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  noWrap
                >
                  {reportLabel}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                >
                  {normalizedReport.date
                    ? new Date(
                        normalizedReport.date
                      ).toLocaleDateString(
                        "en-IN"
                      )
                    : "No date"}
                </Typography>
              </Box>
            </Stack>

            <Chip
              size="small"
              label={status}
              color={getStatusColor(
                status
              )}
              variant="outlined"
            />
          </Stack>

          {/*============================================
              Customer / Marketplace
          ============================================*/}

          <Stack spacing={0.5}>
            <Typography
              variant="body2"
              fontWeight={600}
            >
              {normalizedReport.customerName ||
                normalizedReport.customer ||
                "Customer not available"}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {normalizedReport.marketplace ||
                "Marketplace not specified"}
            </Typography>
          </Stack>

          {/*============================================
              Return Details
          ============================================*/}

          <Grid
            container
            spacing={1.5}
          >
            {/* Quantity */}

            <Grid
              item
              xs={6}
            >
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor:
                    "action.hover",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <Inventory2
                    fontSize="small"
                    color="action"
                  />

                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Returned Qty
                    </Typography>

                    <Typography
                      variant="body1"
                      fontWeight={700}
                    >
                      {formatNumber(
                        quantity
                      )}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Grid>

            {/* Return Amount */}

            <Grid
              item
              xs={6}
            >
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor:
                    "action.hover",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <TrendingDown
                    fontSize="small"
                    color="error"
                  />

                  <Box
                    sx={{
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Return Amount
                    </Typography>

                    <Typography
                      variant="body1"
                      fontWeight={700}
                      noWrap
                    >
                      {formatCurrency(
                        returnAmount
                      )}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Grid>

            {/* Refund */}

            <Grid
              item
              xs={6}
            >
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor:
                    "action.hover",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <ShoppingCart
                    fontSize="small"
                    color="action"
                  />

                  <Box
                    sx={{
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Refund
                    </Typography>

                    <Typography
                      variant="body1"
                      fontWeight={700}
                      noWrap
                    >
                      {formatCurrency(
                        refundAmount
                      )}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Grid>

            {/* Reason */}

            <Grid
              item
              xs={6}
            >
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor:
                    "action.hover",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Return Reason
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight={600}
                  noWrap
                  title={
                    normalizedReport.reason ||
                    "Not specified"
                  }
                >
                  {normalizedReport.reason ||
                    "Not specified"}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/*============================================
              Product
          ============================================*/}

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Product
            </Typography>

            <Typography
              variant="body2"
              fontWeight={600}
              noWrap
              title={
                normalizedReport.productName ||
                normalizedReport.product ||
                "Product not available"
              }
            >
              {normalizedReport.productName ||
                normalizedReport.product ||
                "Product not available"}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

//======================================================
// PropTypes
//======================================================

ReturnReportCard.propTypes = {
  report:
    PropTypes.object,

  loading:
    PropTypes.bool,

  onClick:
    PropTypes.func,
};

//======================================================
// Default Props
//======================================================

ReturnReportCard.defaultProps = {
  report: null,

  loading: false,

  onClick: null,
};

//======================================================
// Export
//======================================================

export default ReturnReportCard;


