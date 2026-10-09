import React from "react";

import {
Box,
Paper,
Grid,
TextField,
MenuItem,
Button,
InputAdornment,
IconButton,
Typography,
Divider
} from "@mui/material";

import {
FilterList,
Clear,
RestartAlt
} from "@mui/icons-material";

/* =========================================================
INVOICE TAX DETAIL FILTERS
========================================================= */

const InvoiceTaxDetailFilters = ({
filters = {},
onFilterChange,
onApplyFilters,
onResetFilters
}) => {
const defaultFilters = {
invoiceId: "",
taxName: "",
taxCode: "",
minTaxRate: "",
maxTaxRate: "",
minTaxAmount: "",
maxTaxAmount: "",
status: ""
};
const currentFilters = {
    ...defaultFilters,
    ...filters
};

/* =====================================================
   HANDLE FILTER CHANGE
===================================================== */

const handleChange = (event) => {
    const { name, value } = event.target;

    if (onFilterChange) {
        onFilterChange({
            ...currentFilters,
            [name]: value
        });
    }
};

/* =====================================================
   CLEAR SINGLE FILTER
===================================================== */

const handleClearField = (name) => {
    if (onFilterChange) {
        onFilterChange({
            ...currentFilters,
            [name]: ""
        });
    }
};

/* =====================================================
   RESET FILTERS
===================================================== */

const handleReset = () => {
    if (onResetFilters) {
        onResetFilters(defaultFilters);
    } else if (onFilterChange) {
        onFilterChange(defaultFilters);
    }
};

/* =====================================================
   RENDER
===================================================== */

return (
    <Paper
        elevation={1}
        sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 2
        }}
    >
        {/* FILTER HEADER */}

        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={1}
            mb={2}
        >
            <Box
                display="flex"
                alignItems="center"
                gap={1}
            >
                <FilterList color="primary" />

                <Typography
                    variant="h6"
                    fontWeight={600}
                >
                    Filter Invoice Tax Details
                </Typography>
            </Box>

            <Button
                size="small"
                color="inherit"
                startIcon={<RestartAlt />}
                onClick={handleReset}
            >
                Reset Filters
            </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* FILTER FIELDS */}

        <Grid container spacing={2}>
            {/* INVOICE ID */}

            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    fullWidth
                    size="small"
                    label="Invoice ID"
                    name="invoiceId"
                    type="number"
                    value={currentFilters.invoiceId}
                    onChange={handleChange}
                    inputProps={{ min: 1 }}
                    InputProps={{
                        endAdornment:
                            currentFilters.invoiceId !== "" && (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() =>
                                            handleClearField(
                                                "invoiceId"
                                            )
                                        }
                                        edge="end"
                                        aria-label="Clear invoice ID"
                                    >
                                        <Clear fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            )
                    }}
                />
            </Grid>

            {/* TAX NAME */}

            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    fullWidth
                    size="small"
                    label="Tax Name"
                    name="taxName"
                    value={currentFilters.taxName}
                    onChange={handleChange}
                    placeholder="e.g. GST"
                    InputProps={{
                        endAdornment:
                            currentFilters.taxName && (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() =>
                                            handleClearField(
                                                "taxName"
                                            )
                                        }
                                        edge="end"
                                        aria-label="Clear tax name"
                                    >
                                        <Clear fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            )
                    }}
                />
            </Grid>

            {/* TAX CODE */}

            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    fullWidth
                    size="small"
                    label="Tax Code"
                    name="taxCode"
                    value={currentFilters.taxCode}
                    onChange={handleChange}
                    placeholder="e.g. GST18"
                    InputProps={{
                        endAdornment:
                            currentFilters.taxCode && (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() =>
                                            handleClearField(
                                                "taxCode"
                                            )
                                        }
                                        edge="end"
                                        aria-label="Clear tax code"
                                    >
                                        <Clear fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            )
                    }}
                />
            </Grid>

            {/* STATUS */}

            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    select
                    fullWidth
                    size="small"
                    label="Status"
                    name="status"
                    value={currentFilters.status}
                    onChange={handleChange}
                >
                    <MenuItem value="">
                        All Statuses
                    </MenuItem>

                    <MenuItem value="Active">
                        Active
                    </MenuItem>

                    <MenuItem value="Inactive">
                        Inactive
                    </MenuItem>

                    <MenuItem value="Pending">
                        Pending
                    </MenuItem>
                </TextField>
            </Grid>

            {/* MIN TAX RATE */}

            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    fullWidth
                    size="small"
                    label="Minimum Tax Rate (%)"
                    name="minTaxRate"
                    type="number"
                    value={currentFilters.minTaxRate}
                    onChange={handleChange}
                    inputProps={{
                        min: 0,
                        step: "0.01"
                    }}
                />
            </Grid>

            {/* MAX TAX RATE */}

            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    fullWidth
                    size="small"
                    label="Maximum Tax Rate (%)"
                    name="maxTaxRate"
                    type="number"
                    value={currentFilters.maxTaxRate}
                    onChange={handleChange}
                    inputProps={{
                        min: 0,
                        step: "0.01"
                    }}
                />
            </Grid>

            {/* MIN TAX AMOUNT */}

            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    fullWidth
                    size="small"
                    label="Minimum Tax Amount (₹)"
                    name="minTaxAmount"
                    type="number"
                    value={currentFilters.minTaxAmount}
                    onChange={handleChange}
                    inputProps={{
                        min: 0,
                        step: "0.01"
                    }}
                />
            </Grid>

            {/* MAX TAX AMOUNT */}

            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    fullWidth
                    size="small"
                    label="Maximum Tax Amount (₹)"
                    name="maxTaxAmount"
                    type="number"
                    value={currentFilters.maxTaxAmount}
                    onChange={handleChange}
                    inputProps={{
                        min: 0,
                        step: "0.01"
                    }}
                />
            </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* ACTIONS */}

        <Box
            display="flex"
            justifyContent="flex-end"
            gap={1.5}
            flexWrap="wrap"
        >
            <Button
                variant="outlined"
                color="inherit"
                startIcon={<RestartAlt />}
                onClick={handleReset}
            >
                Clear All
            </Button>

            <Button
                variant="contained"
                startIcon={<FilterList />}
                onClick={() => {
                    if (onApplyFilters) {
                        onApplyFilters(currentFilters);
                    }
                }}
            >
                Apply Filters
            </Button>
        </Box>
    </Paper>
);
};

export default InvoiceTaxDetailFilters;
