import React from "react";

import {
    Box,
    TextField,
    InputAdornment,
    MenuItem,
    Button,
    Grid
} from "@mui/material";

import {
    Search,
    Clear
} from "@mui/icons-material";

/* =========================================================
   SUPPLIER ADDRESS SEARCH
========================================================= */

const SupplierAddressSearch = ({
    searchTerm = "",
    onSearchChange,
    statusFilter = "all",
    onStatusChange,
    addressTypeFilter = "all",
    onAddressTypeChange,
    onClear
}) => {

    /* =====================================================
       HANDLE CLEAR
    ===================================================== */

    const handleClear = () => {
        onSearchChange?.("");
        onStatusChange?.("all");
        onAddressTypeChange?.("all");
        onClear?.();
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box
            sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                border: 1,
                borderColor: "divider",
                backgroundColor: "background.paper"
            }}
        >
            <Grid container spacing={2} alignItems="center">

                {/* =============================================
                   SEARCH INPUT
                ============================================= */}

                <Grid item xs={12} md={5}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Search Supplier Addresses"
                        placeholder="Search supplier, city, state, postal code..."
                        value={searchTerm}
                        onChange={(event) =>
                            onSearchChange?.(event.target.value)
                        }
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search color="action" />
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>

                {/* =============================================
                   STATUS FILTER
                ============================================= */}

                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Status"
                        value={statusFilter}
                        onChange={(event) =>
                            onStatusChange?.(event.target.value)
                        }
                    >
                        <MenuItem value="all">
                            All Statuses
                        </MenuItem>

                        <MenuItem value="active">
                            Active
                        </MenuItem>

                        <MenuItem value="inactive">
                            Inactive
                        </MenuItem>

                        <MenuItem value="pending">
                            Pending
                        </MenuItem>
                    </TextField>
                </Grid>

                {/* =============================================
                   ADDRESS TYPE FILTER
                ============================================= */}

                <Grid item xs={12} sm={6} md={2}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Address Type"
                        value={addressTypeFilter}
                        onChange={(event) =>
                            onAddressTypeChange?.(event.target.value)
                        }
                    >
                        <MenuItem value="all">
                            All Types
                        </MenuItem>

                        <MenuItem value="billing">
                            Billing
                        </MenuItem>

                        <MenuItem value="shipping">
                            Shipping
                        </MenuItem>

                        <MenuItem value="office">
                            Office
                        </MenuItem>

                        <MenuItem value="warehouse">
                            Warehouse
                        </MenuItem>
                    </TextField>
                </Grid>

                {/* =============================================
                   CLEAR FILTERS
                ============================================= */}

                <Grid item xs={12} md={2}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="inherit"
                        startIcon={<Clear />}
                        onClick={handleClear}
                    >
                        Clear
                    </Button>
                </Grid>

            </Grid>
        </Box>
    );
};

export default SupplierAddressSearch;

