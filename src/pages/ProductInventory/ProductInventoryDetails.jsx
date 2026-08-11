import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import InventoryIcon from "@mui/icons-material/Inventory2";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

//======================================================
// Helpers
//======================================================

const toNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
};

const formatNumber = (value) => {
  return new Intl.NumberFormat(
    "en-IN"
  ).format(toNumber(value));
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }
  ).format(toNumber(value));
};

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

//======================================================
// Normalize Product
//======================================================

const normalizeProduct = (product = {}) => {
  const openingStock = toNumber(
    product.openingStock
  );

  const receivedStock = toNumber(
    product.receivedStock
  );

  const soldStock = toNumber(
    product.soldStock
  );

  const returnedStock = toNumber(
    product.returnedStock
  );

  const transferredIn = toNumber(
    product.transferredIn
  );

  const transferredOut = toNumber(
    product.transferredOut
  );

  const damagedStock = toNumber(
    product.damagedStock
  );

  const reservedStock = toNumber(
    product.reservedStock
  );

  const calculatedStock =
    openingStock +
    receivedStock +
    returnedStock +
    transferredIn -
    soldStock -
    transferredOut -
    damagedStock;

  const currentStock =
    product.currentStock !==
      undefined &&
    product.currentStock !== null
      ? toNumber(
          product.currentStock
        )
      : calculatedStock;

  const availableStock =
    product.availableStock !==
      undefined &&
    product.availableStock !== null
      ? toNumber(
          product.availableStock
        )
      : Math.max(
          currentStock -
            reservedStock,
          0
        );

  return {
    ...product,

    openingStock,
    receivedStock,
    soldStock,
    returnedStock,
    transferredIn,
    transferredOut,
    damagedStock,
    reservedStock,

    currentStock,
    availableStock,

    minimumStock: toNumber(
      product.minimumStock
    ),

    maximumStock: toNumber(
      product.maximumStock
    ),

    unitCost: toNumber(
      product.unitCost
    ),

    stockValue:
      product.stockValue !==
      undefined
        ? toNumber(
            product.stockValue
          )
        : currentStock *
          toNumber(
            product.unitCost
          ),
  };
};

//======================================================
// Statistics Card
//======================================================

const InventoryStatCard = ({
  title,
  value,
  subtitle,
  icon,
}) => {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                "action.hover",
            }}
          >
            {icon}
          </Box>

          <Box
            sx={{
              minWidth: 0,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {title}
            </Typography>

            <Typography
              variant="h6"
              fontWeight={700}
            >
              {value}
            </Typography>

            {subtitle && (
              <Typography
                variant="caption"
                color="text.secondary"
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

//======================================================
// Product Inventory Details
//======================================================

const ProductInventoryDetails = ({
  product: productProp,
  productId,
  inventory: inventoryProp,
  loading: externalLoading = false,
  error: externalError = "",
  onLoad,
}) => {
  const [product, setProduct] =
    useState(
      productProp || inventoryProp || null
    );

  const [loading, setLoading] =
    useState(
      externalLoading
    );

  const [error, setError] =
    useState(
      externalError
    );

  //====================================================
  // Load Product
  //====================================================

  useEffect(() => {
    let mounted = true;

    const loadProduct = async () => {
      if (
        productProp ||
        inventoryProp
      ) {
        setProduct(
          productProp ||
            inventoryProp
        );

        setLoading(false);

        return;
      }

      if (
        typeof onLoad !==
        "function"
      ) {
        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setError("");

        const result =
          await onLoad(
            productId
          );

        if (
          mounted
        ) {
          setProduct(
            result
          );
        }
      } catch (err) {
        if (
          mounted
        ) {
          setError(
            err?.message ||
              "Unable to load product inventory details."
          );
        }
      } finally {
        if (
          mounted
        ) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      mounted = false;
    };
  }, [
    productProp,
    inventoryProp,
    productId,
    onLoad,
  ]);

  //====================================================
  // Normalize Data
  //====================================================

  const data = useMemo(() => {
    return normalizeProduct(
      product || {}
    );
  }, [product]);

  //====================================================
  // Stock Status
  //====================================================

  const stockStatus =
    useMemo(() => {
      if (
        data.currentStock <= 0
      ) {
        return {
          label: "OUT OF STOCK",
          color: "error",
          icon: (
            <WarningAmberIcon />
          ),
        };
      }

      if (
        data.minimumStock > 0 &&
        data.currentStock <=
          data.minimumStock
      ) {
        return {
          label: "LOW STOCK",
          color: "warning",
          icon: (
            <WarningAmberIcon />
          ),
        };
      }

      return {
        label: "IN STOCK",
        color: "success",
        icon: (
          <InventoryIcon />
        ),
      };
    }, [
      data.currentStock,
      data.minimumStock,
    ]);

  //====================================================
  // Movement History
  //====================================================

  const movements =
    useMemo(() => {
      if (
        !Array.isArray(
          data.movements
        )
      ) {
        return [];
      }

      return data.movements;
    }, [data.movements]);

  //====================================================
  // Loading
  //====================================================

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack
          spacing={2}
          alignItems="center"
        >
          <CircularProgress />

          <Typography
            color="text.secondary"
          >
            Loading inventory details...
          </Typography>
        </Stack>
      </Box>
    );
  }

  //====================================================
  // Error
  //====================================================

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{
          width: "100%",
        }}
      >
        {error}
      </Alert>
    );
  }

  //====================================================
  // No Product
  //====================================================

  if (!product) {
    return (
      <Alert
        severity="info"
        sx={{
          width: "100%",
        }}
      >
        No product inventory information
        is available.
      </Alert>
    );
  }

  //====================================================
  // Render
  //====================================================

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      {/*================================================
          Header
      =================================================*/}

      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          md: "center",
        }}
        sx={{
          mb: 3,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                "action.hover",
            }}
          >
            <InventoryIcon
              fontSize="large"
            />
          </Box>

          <Box>
            <Typography
              variant="h5"
              fontWeight={700}
            >
              Product Inventory Details
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {data.productName ||
                data.name ||
                "Product"}
              {data.sku
                ? ` • ${data.sku}`
                : ""}
            </Typography>
          </Box>
        </Stack>

        <Chip
          icon={
            stockStatus.icon
          }
          label={
            stockStatus.label
          }
          color={
            stockStatus.color
          }
          variant="outlined"
        />
      </Stack>

      {/*================================================
          Product Information
      =================================================*/}

      <Card
        variant="outlined"
        sx={{
          mb: 3,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              mb: 2,
            }}
          >
            Product Information
          </Typography>

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
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Product
              </Typography>

              <Typography
                fontWeight={600}
              >
                {data.productName ||
                  data.name ||
                  "-"}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                SKU
              </Typography>

              <Typography
                fontWeight={600}
              >
                {data.sku ||
                  "-"}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Category
              </Typography>

              <Typography
                fontWeight={600}
              >
                {data.categoryName ||
                  data.category ||
                  "-"}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Brand
              </Typography>

              <Typography
                fontWeight={600}
              >
                {data.brandName ||
                  data.brand ||
                  "-"}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Warehouse
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <WarehouseIcon
                  fontSize="small"
                  color="action"
                />

                <Typography
                  fontWeight={600}
                >
                  {data.warehouseName ||
                    data.warehouse ||
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
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Unit Cost
              </Typography>

              <Typography
                fontWeight={600}
              >
                {formatCurrency(
                  data.unitCost
                )}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Minimum Stock
              </Typography>

              <Typography
                fontWeight={600}
              >
                {formatNumber(
                  data.minimumStock
                )}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Maximum Stock
              </Typography>

              <Typography
                fontWeight={600}
              >
                {formatNumber(
                  data.maximumStock
                )}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/*================================================
          Stock Summary
      =================================================*/}

      <Typography
        variant="h6"
        fontWeight={700}
        sx={{
          mb: 2,
        }}
      >
        Stock Summary
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{
          mb: 3,
        }}
      >
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <InventoryStatCard
            title="Current Stock"
            value={formatNumber(
              data.currentStock
            )}
            subtitle="Physical stock"
            icon={
              <InventoryIcon />
            }
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <InventoryStatCard
            title="Available Stock"
            value={formatNumber(
              data.availableStock
            )}
            subtitle="After reservations"
            icon={
              <TrendingUpIcon />
            }
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <InventoryStatCard
            title="Reserved Stock"
            value={formatNumber(
              data.reservedStock
            )}
            subtitle="Reserved for orders"
            icon={
              <TrendingDownIcon />
            }
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <InventoryStatCard
            title="Stock Value"
            value={formatCurrency(
              data.stockValue
            )}
            subtitle="Current inventory value"
            icon={
              <WarehouseIcon />
            }
          />
        </Grid>
      </Grid>

      {/*================================================
          Stock Movement Summary
      =================================================*/}

      <Card
        variant="outlined"
        sx={{
          mb: 3,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              mb: 2,
            }}
          >
            Stock Movement Summary
          </Typography>

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
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Opening Stock
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  {formatNumber(
                    data.openingStock
                  )}
                </Typography>
              </Paper>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Received
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  +{" "}
                  {formatNumber(
                    data.receivedStock
                  )}
                </Typography>
              </Paper>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Sold
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  -{" "}
                  {formatNumber(
                    data.soldStock
                  )}
                </Typography>
              </Paper>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Returned
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  +{" "}
                  {formatNumber(
                    data.returnedStock
                  )}
                </Typography>
              </Paper>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Transfer In
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  +{" "}
                  {formatNumber(
                    data.transferredIn
                  )}
                </Typography>
              </Paper>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Transfer Out
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  -{" "}
                  {formatNumber(
                    data.transferredOut
                  )}
                </Typography>
              </Paper>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Damaged
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  -{" "}
                  {formatNumber(
                    data.damagedStock
                  )}
                </Typography>
              </Paper>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Closing Stock
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  {formatNumber(
                    data.currentStock
                  )}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/*================================================
          Movement History
      =================================================*/}

      <Card
        variant="outlined"
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              mb: 2,
            }}
          >
            Stock Movement History
          </Typography>

          <Divider
            sx={{
              mb: 2,
            }}
          />

          {movements.length ===
          0 ? (
            <Alert severity="info">
              No stock movement history
              is available for this
              product.
            </Alert>
          ) : (
            <TableContainer
              component={Paper}
              variant="outlined"
            >
              <Table
                size="small"
                stickyHeader
              >
                <TableHead>
                  <TableRow>
                    <TableCell>
                      Date
                    </TableCell>

                    <TableCell>
                      Movement Type
                    </TableCell>

                    <TableCell>
                      Reference
                    </TableCell>

                    <TableCell align="right">
                      In
                    </TableCell>

                    <TableCell align="right">
                      Out
                    </TableCell>

                    <TableCell align="right">
                      Balance
                    </TableCell>

                    <TableCell>
                      Remarks
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {movements.map(
                    (
                      movement,
                      index
                    ) => (
                      <TableRow
                        key={
                          movement.id ||
                          movement.movementId ||
                          index
                        }
                        hover
                      >
                        <TableCell>
                          {formatDate(
                            movement.date ||
                              movement.movementDate
                          )}
                        </TableCell>

                        <TableCell>
                          <Chip
                            size="small"
                            label={
                              movement.movementType ||
                              movement.type ||
                              "-"
                            }
                          />
                        </TableCell>

                        <TableCell>
                          {movement.referenceNumber ||
                            movement.reference ||
                            "-"}
                        </TableCell>

                        <TableCell align="right">
                          {formatNumber(
                            movement.quantityIn
                          )}
                        </TableCell>

                        <TableCell align="right">
                          {formatNumber(
                            movement.quantityOut
                          )}
                        </TableCell>

                        <TableCell
                          align="right"
                        >
                          <Typography
                            fontWeight={
                              600
                            }
                          >
                            {formatNumber(
                              movement.balanceQuantity ??
                                movement.balance ??
                                0
                            )}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          {movement.remarks ||
                            "-"}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

//======================================================
// Export
//======================================================

export default ProductInventoryDetails;