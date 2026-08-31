// =========================================================
// StockTransferFilters.jsx
// =========================================================

import React from "react";

import {
    Box,
    Button,
    MenuItem,
    Paper,
    Stack,
    TextField,
} from "@mui/material";

import {
    FilterAlt,
    Clear,
} from "@mui/icons-material";

const StockTransferFilters = ({
    sellerId,
    setSellerId,
    productId,
    setProductId,
    fromWarehouseId,
    setFromWarehouseId,
    toWarehouseId,
    setToWarehouseId,
    status,
    setStatus,
    sort,
    setSort,
    onApply,
    onClear,
}) => {

    return (
        <Paper
            sx={{
                p: 2,
                mb: 3,
            }}
        >

            <Stack
                direction={{
                    xs: "column",
                    sm: "row",
                }}
                spacing={2}
                flexWrap="wrap"
            >

                <TextField
                    label="Seller ID"
                    type="number"
                    size="small"
                    value={sellerId}
                    onChange={(e) =>
                        setSellerId(e.target.value)
                    }
                />

                <TextField
                    label="Product ID"
                    type="number"
                    size="small"
                    value={productId}
                    onChange={(e) =>
                        setProductId(e.target.value)
                    }
                />

                <TextField
                    label="From Warehouse ID"
                    type="number"
                    size="small"
                    value={fromWarehouseId}
                    onChange={(e) =>
                        setFromWarehouseId(
                            e.target.value
                        )
                    }
                />

                <TextField
                    label="To Warehouse ID"
                    type="number"
                    size="small"
                    value={toWarehouseId}
                    onChange={(e) =>
                        setToWarehouseId(
                            e.target.value
                        )
                    }
                />

                <TextField
                    select
                    label="Status"
                    size="small"
                    value={status}
                    onChange={(e) =>
                        setStatus(e.target.value)
                    }
                    sx={{ minWidth: 150 }}
                >
                    <MenuItem value="">
                        All
                    </MenuItem>

                    <MenuItem value="Pending">
                        Pending
                    </MenuItem>

                    <MenuItem value="Approved">
                        Approved
                    </MenuItem>

                    <MenuItem value="In Transit">
                        In Transit
                    </MenuItem>

                    <MenuItem value="Completed">
                        Completed
                    </MenuItem>

                    <MenuItem value="Cancelled">
                        Cancelled
                    </MenuItem>
                </TextField>

                <TextField
                    select
                    label="Sort"
                    size="small"
                    value={sort}
                    onChange={(e) =>
                        setSort(e.target.value)
                    }
                    sx={{ minWidth: 160 }}
                >
                    <MenuItem value="">
                        Default
                    </MenuItem>

                    <MenuItem value="date_desc">
                        Date ↓
                    </MenuItem>

                    <MenuItem value="date_asc">
                        Date ↑
                    </MenuItem>

                    <MenuItem value="quantity_desc">
                        Quantity ↓
                    </MenuItem>

                    <MenuItem value="quantity_asc">
                        Quantity ↑
                    </MenuItem>
                </TextField>

                <Button
                    variant="contained"
                    startIcon={<FilterAlt />}
                    onClick={onApply}
                >
                    Apply
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<Clear />}
                    onClick={onClear}
                >
                    Clear
                </Button>

            </Stack>

        </Paper>
    );
};

export default StockTransferFilters;

