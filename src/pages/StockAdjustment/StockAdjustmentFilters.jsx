// =========================================================
// StockAdjustmentFilters.jsx
// Stock Adjustment Filters
// =========================================================

import React from "react";

import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField
} from "@mui/material";

import {
    Clear,
    FilterAlt
} from "@mui/icons-material";


// =========================================================
// COMPONENT
// =========================================================

const StockAdjustmentFilters = ({
    filters = {},

    onFilterChange,

    onApply,

    onClear,

    loading = false
}) => {


    // =====================================================
    // SAFE FILTER VALUES
    // =====================================================

    const sellerId =
        filters.sellerId ?? "";

    const customerId =
        filters.customerId ?? "";

    const productId =
        filters.productId ?? "";

    const warehouseId =
        filters.warehouseId ?? "";

    const adjustmentType =
        filters.adjustmentType ?? "";

    const dateFrom =
        filters.dateFrom ?? "";

    const dateTo =
        filters.dateTo ?? "";


    // =====================================================
    // HANDLE CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        if (typeof onFilterChange === "function") {

            onFilterChange(
                name,
                value
            );

        }

    };


    // =====================================================
    // APPLY
    // =====================================================

    const handleApply = () => {

        if (typeof onApply === "function") {

            onApply();

        }

    };


    // =====================================================
    // CLEAR
    // =====================================================

    const handleClear = () => {

        if (typeof onClear === "function") {

            onClear();

        }

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box
            sx={{
                width: "100%"
            }}
        >

            <Stack
                direction={{
                    xs: "column",
                    sm: "row"
                }}
                spacing={2}
                flexWrap="wrap"
                useFlexGap
            >

                {/* =================================================
                    SELLER
                ================================================= */}

                <TextField
                    size="small"
                    type="number"
                    name="sellerId"
                    label="Seller ID"
                    value={sellerId}
                    onChange={handleChange}
                    sx={{
                        minWidth: {
                            sm: 150
                        }
                    }}
                    inputProps={{
                        min: 1
                    }}
                />


                {/* =================================================
                    CUSTOMER
                ================================================= */}

                <TextField
                    size="small"
                    type="number"
                    name="customerId"
                    label="Customer ID"
                    value={customerId}
                    onChange={handleChange}
                    sx={{
                        minWidth: {
                            sm: 150
                        }
                    }}
                    inputProps={{
                        min: 1
                    }}
                />


                {/* =================================================
                    PRODUCT
                ================================================= */}

                <TextField
                    size="small"
                    type="number"
                    name="productId"
                    label="Product ID"
                    value={productId}
                    onChange={handleChange}
                    sx={{
                        minWidth: {
                            sm: 150
                        }
                    }}
                    inputProps={{
                        min: 1
                    }}
                />


                {/* =================================================
                    WAREHOUSE
                ================================================= */}

                <TextField
                    size="small"
                    type="number"
                    name="warehouseId"
                    label="Warehouse ID"
                    value={warehouseId}
                    onChange={handleChange}
                    sx={{
                        minWidth: {
                            sm: 150
                        }
                    }}
                    inputProps={{
                        min: 1
                    }}
                />


                {/* =================================================
                    ADJUSTMENT TYPE
                ================================================= */}

                <FormControl
                    size="small"
                    sx={{
                        minWidth: {
                            sm: 180
                        }
                    }}
                >

                    <InputLabel>
                        Adjustment Type
                    </InputLabel>

                    <Select
                        name="adjustmentType"
                        value={adjustmentType}
                        label="Adjustment Type"
                        onChange={handleChange}
                    >

                        <MenuItem value="">
                            All Types
                        </MenuItem>

                        <MenuItem value="Damage">
                            Damage
                        </MenuItem>

                        <MenuItem value="Loss">
                            Loss
                        </MenuItem>

                        <MenuItem value="Found">
                            Found
                        </MenuItem>

                        <MenuItem value="Correction">
                            Correction
                        </MenuItem>

                        <MenuItem value="Expired">
                            Expired
                        </MenuItem>

                        <MenuItem value="Return">
                            Return
                        </MenuItem>

                        <MenuItem value="Other">
                            Other
                        </MenuItem>

                    </Select>

                </FormControl>


                {/* =================================================
                    DATE FROM
                ================================================= */}

                <TextField
                    size="small"
                    type="date"
                    name="dateFrom"
                    label="Date From"
                    value={dateFrom}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true
                    }}
                    sx={{
                        minWidth: {
                            sm: 160
                        }
                    }}
                />


                {/* =================================================
                    DATE TO
                ================================================= */}

                <TextField
                    size="small"
                    type="date"
                    name="dateTo"
                    label="Date To"
                    value={dateTo}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true
                    }}
                    sx={{
                        minWidth: {
                            sm: 160
                        }
                    }}
                />


                {/* =================================================
                    APPLY
                ================================================= */}

                <Button
                    variant="contained"
                    startIcon={
                        <FilterAlt />
                    }
                    onClick={handleApply}
                    disabled={loading}
                >
                    {loading
                        ? "Applying..."
                        : "Apply Filters"}
                </Button>


                {/* =================================================
                    CLEAR
                ================================================= */}

                <Button
                    variant="outlined"
                    startIcon={
                        <Clear />
                    }
                    onClick={handleClear}
                    disabled={loading}
                >
                    Clear
                </Button>

            </Stack>

        </Box>

    );

};


// =========================================================
// EXPORT
// =========================================================

export default StockAdjustmentFilters;

