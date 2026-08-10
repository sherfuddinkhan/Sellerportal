import React, {useMemo} from "react";
import PropTypes from "prop-types";
import {Box,Card,CardContent,Chip,Divider,IconButton,Stack,Tooltip,Typography} from "@mui/material";
import {Inventory2,MoreVert,Warning,ErrorOutline,TrendingDown} from "@mui/icons-material";

//======================================================
// LowStockReportCard
//======================================================

const LowStockReportCard = ({
  report = {},
  onView,
  onEdit,
  onDelete,
  onMenu,
  showActions = true,
}) => {

  //====================================================
  // Normalize Report Data
  //====================================================

  const data = useMemo(
    () => ({
      id: report?.id ?? report?.reportId ?? report?.inventoryId ?? "",
      productName: report?.productName ?? report?.itemName ?? report?.name ?? "Unknown Product",
      productCode: report?.productCode ?? report?.itemCode ?? report?.sku ?? "-",
      category: report?.categoryName ?? report?.category ?? "-",
      currentStock: Number(report?.currentStock ?? report?.stockQuantity ?? report?.quantity ?? 0),
      minimumStock: Number(report?.minimumStock ?? report?.minStock ?? report?.reorderLevel ?? 0),
      reorderQuantity: Number( report?.reorderQuantity ?? report?.reorderQty ?? 0 ),
      unit: report?.unit ?? report?.uom ?? "Units",
      warehouse: report?.warehouseName ?? report?.warehouse ?? "-",
      status: String( report?.status ?? "Low" ),
      lastUpdated: report?.lastUpdated ?? report?.updatedAt ?? report?.updatedDate ?? "",
    }),[report]
  );

  //====================================================
  // Stock Percentage
  //====================================================

  const stockPercentage =
    useMemo(() => {
      if (data.minimumStock <= 0) {
        return data.currentStock > 0
          ? 100
          : 0;
      }
      return Math.min(100,
        Math.max(0,
          (
            data.currentStock /
            data.minimumStock
          ) * 100
        )
      );

    }, [data.currentStock,data.minimumStock]);

  //====================================================
  // Stock Severity
  //====================================================

  const severity =
    useMemo(() => {
      if (data.currentStock <= 0) {
        return "critical";
      }
      if (
        data.currentStock <
        data.minimumStock
      ) {
        return "warning";
      }

      return "normal";

    }, [
      data.currentStock,
      data.minimumStock,
    ]);

  //====================================================
  // Status Color
  //====================================================

  const statusColor =
    severity === "critical"
      ? "error"
      : severity === "warning"
      ? "warning"
      : "success";

  //====================================================
  // Status Label
  //====================================================

  const statusLabel =
    severity === "critical"
      ? "Out of Stock"
      : severity === "warning"
      ? "Low Stock"
      : "Stock OK";

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // View Handler
  //====================================================

  const handleView = () => {
    if (typeof onView === "function") {
      onView(data);
    }
  };

  //====================================================
  // Edit Handler
  //====================================================

  const handleEdit = () => {
    if (typeof onEdit === "function") {
      onEdit(data);
    }
  };

  //====================================================
  // Delete Handler
  //====================================================

  const handleDelete = () => {
    if (typeof onDelete === "function") {
      onDelete(data);
    }
  };

  //====================================================
  // Menu Handler
  //====================================================

  const handleMenu = (event) => {
    if (typeof onMenu === "function") {
      onMenu(event, data);
    }
  };

  //====================================================
  // Stock Icon
  //====================================================

  const StockIcon =
    severity === "critical"
      ? ErrorOutline
      : severity === "warning"
      ? Warning
      : Inventory2;

  //====================================================
  // JSX
  //====================================================

  return (
    <Card
      className="low-stock-report-card"
      elevation={1}
      sx={{
        height: "100%",
        position: "relative",
        borderRadius: 2,
        border: "1px solid",
        borderColor:
          severity === "critical"
            ? "error.light"
            : severity === "warning"
            ? "warning.light"
            : "divider",
      }}
    >
      <CardContent
        className="low-stock-report-card-content"
      >
        {/*================================================
            Header
        =================================================*/}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={1}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              minWidth: 0,
            }}
          >
            <StockIcon
              color={statusColor}
              fontSize="medium"
            />

            <Box
              sx={{
                minWidth: 0,
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                noWrap
              >
                {data.productName}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
              >
                {data.productCode}
              </Typography>
            </Box>
          </Stack>

          {showActions && (
            <Tooltip title="More actions">
              <IconButton
                size="small"
                onClick={handleMenu}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>

        <Divider
          sx={{
            my: 1.5,
          }}
        />

        {/*================================================
            Category / Warehouse
        =================================================*/}

        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Category
            </Typography>

            <Typography
              variant="body2"
              fontWeight={500}
            >
              {data.category}
            </Typography>
          </Box>

          <Box
            sx={{
              textAlign: "right",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Warehouse
            </Typography>

            <Typography
              variant="body2"
              fontWeight={500}
            >
              {data.warehouse}
            </Typography>
          </Box>
        </Stack>

        {/*================================================
            Stock Information
        =================================================*/}

        <Stack
          direction="row"
          spacing={2}
          sx={{
            mb: 1.5,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Current Stock
            </Typography>

            <Typography
              variant="h6"
              fontWeight={700}
              className={
                severity === "critical"
                  ? "low-stock-quantity-critical"
                  : severity === "warning"
                  ? "low-stock-quantity-warning"
                  : "low-stock-quantity-normal"
              }
            >
              {data.currentStock}{" "}
              {data.unit}
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              textAlign: "right",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Minimum Stock
            </Typography>

            <Typography
              variant="body1"
              fontWeight={600}
            >
              {data.minimumStock}{" "}
              {data.unit}
            </Typography>
          </Box>
        </Stack>

        {/*================================================
            Stock Level
        =================================================*/}

        <Box
          className="low-stock-level"
          sx={{
            mb: 2,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
              mb: 0.5,
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Stock Level
            </Typography>

            <Typography
              variant="caption"
              fontWeight={600}
            >
              {Math.round(
                stockPercentage
              )}%
            </Typography>
          </Stack>

          <Box
            className="low-stock-level-bar"
          >
            <Box
              className={`low-stock-level-fill ${severity}`}
              sx={{
                width: `${stockPercentage}%`,
              }}
            />
          </Box>
        </Box>

        {/*================================================
            Footer Information
        =================================================*/}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <Chip
            className="low-stock-status"
            size="small"
            color={statusColor}
            icon={
              severity === "critical" ||
              severity === "warning" ? (
                <TrendingDown />
              ) : undefined
            }
            label={
              data.status !== "Low"
                ? data.status
                : statusLabel
            }
          />

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Reorder:{" "}
            <strong>
              {data.reorderQuantity}{" "}
              {data.unit}
            </strong>
          </Typography>
        </Stack>

        {/*================================================
            Report ID
        =================================================*/}

        {data.id !== "" && (
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{
              mt: 1.5,
            }}
          >
            Report ID: {data.id}
          </Typography>
        )}

      </CardContent>
    </Card>
  );
};

//======================================================
// Part 1B Ends Here
//======================================================
//======================================================
// PropTypes
//======================================================

LowStockReportCard.propTypes = {
  report: PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    reportId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    inventoryId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    productName: PropTypes.string,

    itemName: PropTypes.string,

    name: PropTypes.string,

    productCode: PropTypes.string,

    itemCode: PropTypes.string,

    sku: PropTypes.string,

    categoryName: PropTypes.string,

    category: PropTypes.string,

    currentStock: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    stockQuantity: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    quantity: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    minimumStock: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    minStock: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    reorderLevel: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    reorderQuantity: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    reorderQty: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    unit: PropTypes.string,

    uom: PropTypes.string,

    warehouseName: PropTypes.string,

    warehouse: PropTypes.string,

    status: PropTypes.string,

    lastUpdated: PropTypes.string,

    updatedAt: PropTypes.string,

    updatedDate: PropTypes.string,
  }),

  onView: PropTypes.func,

  onEdit: PropTypes.func,

  onDelete: PropTypes.func,

  onMenu: PropTypes.func,

  showActions: PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

LowStockReportCard.defaultProps = {
  report: {},

  onView: () => {},

  onEdit: () => {},

  onDelete: () => {},

  onMenu: () => {},

  showActions: true,
};

//======================================================
// Export
//======================================================

export default LowStockReportCard;