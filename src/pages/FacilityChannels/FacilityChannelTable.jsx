import React from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Typography,
    Box,
    Chip,
    CircularProgress,
    Stack
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete,
    Apartment,
    Inventory2
} from "@mui/icons-material";

/* =========================================================
   FORMAT VALUE
========================================================= */

const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
        return "—";
    }

    return String(value);
};

/* =========================================================
   NORMALIZE FACILITY CHANNEL
========================================================= */

const normalizeFacilityChannel = (item = {}) => ({
    id: item.id ?? item.Id ?? item.facilityChannelId ?? item.FacilityChannelId,
    sellerId: item.sellerId ?? item.SellerId,
    customerId: item.customerId ?? item.CustomerId,
    productId: item.productId ?? item.ProductId,
    skuCode: item.skuCode ?? item.SkuCode ?? "",
    facilityCode: item.facilityCode ?? item.FacilityCode ?? "",
    channelCode: item.channelCode ?? item.ChannelCode ?? "",
    sellableQuantity:
        item.sellableQuantity ??
        item.SellableQuantity ??
        0
});

/* =========================================================
   FACILITY CHANNEL TABLE
========================================================= */

const FacilityChannelTable = ({
    facilityChannels = [],
    loading = false,
    error = "",
    onView,
    onEdit,
    onDelete,
    showActions = true,
    emptyMessage = "No facility channel inventory found."
}) => {
    const rows = Array.isArray(facilityChannels)
        ? facilityChannels
        : [];

    const columnCount = showActions ? 8 : 7;

    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{
                width: "100%",
                overflowX: "auto",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2
            }}
        >
            <Table
                sx={{ minWidth: 1050 }}
                aria-label="Facility channel inventory table"
            >
                {/* TABLE HEADER */}

                <TableHead>
                    <TableRow
                        sx={{
                            bgcolor: "action.hover",
                            "& th": {
                                fontWeight: 700,
                                whiteSpace: "nowrap",
                                color: "text.secondary"
                            }
                        }}
                    >
                        <TableCell>ID</TableCell>
                        <TableCell>Seller ID</TableCell>
                        <TableCell>Customer ID</TableCell>
                        <TableCell>Product ID</TableCell>
                        <TableCell>SKU Code</TableCell>
                        <TableCell>Facility Code</TableCell>
                        <TableCell>Channel Code</TableCell>
                        <TableCell align="right">
                            Sellable Quantity
                        </TableCell>

                        {showActions && (
                            <TableCell align="right">
                                Actions
                            </TableCell>
                        )}
                    </TableRow>
                </TableHead>

                {/* TABLE BODY */}

                <TableBody>
                    {/* LOADING */}

                    {loading && (
                        <TableRow>
                            <TableCell
                                colSpan={columnCount + 1}
                                align="center"
                                sx={{ py: 6 }}
                            >
                                <Stack
                                    spacing={1.5}
                                    alignItems="center"
                                >
                                    <CircularProgress size={30} />

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Loading facility channel inventory...
                                    </Typography>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    )}

                    {/* ERROR */}

                    {!loading && error && (
                        <TableRow>
                            <TableCell
                                colSpan={columnCount + 1}
                                align="center"
                                sx={{ py: 4 }}
                            >
                                <Typography
                                    color="error"
                                    variant="body2"
                                >
                                    {error}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}

                    {/* EMPTY */}

                    {!loading &&
                        !error &&
                        rows.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={columnCount + 1}
                                    align="center"
                                    sx={{ py: 6 }}
                                >
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                        gap={1}
                                    >
                                        <Apartment
                                            sx={{
                                                fontSize: 42,
                                                color: "text.disabled"
                                            }}
                                        />

                                        <Typography
                                            variant="body1"
                                            fontWeight={600}
                                        >
                                            {emptyMessage}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Create an inventory record or change your search filters.
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}

                    {/* DATA ROWS */}

                    {!loading &&
                        !error &&
                        rows.map((rawItem, index) => {
                            const item = normalizeFacilityChannel(rawItem);
                            const id = item.id ?? index;

                            return (
                                <TableRow
                                    key={id}
                                    hover
                                    sx={{
                                        "&:last-child td": {
                                            borderBottom: 0
                                        }
                                    }}
                                >
                                    {/* ID */}

                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            fontWeight={700}
                                        >
                                            {formatValue(item.id)}
                                        </Typography>
                                    </TableCell>

                                    {/* SELLER */}

                                    <TableCell>
                                        {formatValue(item.sellerId)}
                                    </TableCell>

                                    {/* CUSTOMER */}

                                    <TableCell>
                                        {formatValue(item.customerId)}
                                    </TableCell>

                                    {/* PRODUCT */}

                                    <TableCell>
                                        {formatValue(item.productId)}
                                    </TableCell>

                                    {/* SKU */}

                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            fontWeight={500}
                                        >
                                            {formatValue(item.skuCode)}
                                        </Typography>
                                    </TableCell>

                                    {/* FACILITY */}

                                    <TableCell>
                                        <Chip
                                            size="small"
                                            variant="outlined"
                                            icon={<Apartment />}
                                            label={formatValue(item.facilityCode)}
                                        />
                                    </TableCell>

                                    {/* CHANNEL */}

                                    <TableCell>
                                        <Chip
                                            size="small"
                                            variant="outlined"
                                            color="primary"
                                            label={formatValue(item.channelCode)}
                                        />
                                    </TableCell>

                                    {/* QUANTITY */}

                                    <TableCell align="right">
                                        <Chip
                                            size="small"
                                            color={
                                                Number(item.sellableQuantity) > 0
                                                    ? "success"
                                                    : "default"
                                            }
                                            icon={<Inventory2 />}
                                            label={formatValue(item.sellableQuantity)}
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </TableCell>

                                    {/* ACTIONS */}

                                    {showActions && (
                                        <TableCell align="right">
                                            <Stack
                                                direction="row"
                                                spacing={0.5}
                                                justifyContent="flex-end"
                                            >
                                                <Tooltip title="View details">
                                                    <IconButton
                                                        size="small"
                                                        color="info"
                                                        aria-label="View facility channel"
                                                        onClick={() =>
                                                            onView?.(item)
                                                        }
                                                    >
                                                        <Visibility fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        aria-label="Edit facility channel"
                                                        onClick={() =>
                                                            onEdit?.(item)
                                                        }
                                                    >
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        aria-label="Delete facility channel"
                                                        onClick={() =>
                                                            onDelete?.(item)
                                                        }
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default FacilityChannelTable;
