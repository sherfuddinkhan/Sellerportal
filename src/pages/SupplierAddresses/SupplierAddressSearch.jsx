import React from "react";
import { Box, TextField, InputAdornment, MenuItem, Button, Grid } from "@mui/material";
import { Search, Clear } from "@mui/icons-material";

const SupplierAddressSearch = ({
    searchTerm = "", onSearchChange,
    addressTypeFilter = "all", onAddressTypeChange,
    onClear
}) => {
    const handleClear = () => {
        onSearchChange?.("");
        onAddressTypeChange?.("all");
        onClear?.();
    };
    return (
        <Box sx={{ p: 2, mb: 3, borderRadius: 2, border: 1, borderColor: "divider", backgroundColor: "background.paper" }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                    <TextField fullWidth size="small" label="Search Supplier Addresses"
                        placeholder="Search address, city, stateCode, countryCode, pincode, phone..."
                        value={searchTerm} onChange={(e)=>onSearchChange?.(e.target.value)}
                        InputProps={{ startAdornment: <InputAdornment position="start"><Search color="action" /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField select fullWidth size="small" label="Address Type" value={addressTypeFilter} onChange={(e)=>onAddressTypeChange?.(e.target.value)}>
                        <MenuItem value="all">All Types</MenuItem>
                        <MenuItem value="Billing">Billing</MenuItem>
                        <MenuItem value="Shipping">Shipping</MenuItem>
                        <MenuItem value="Office">Office</MenuItem>
                        <MenuItem value="Warehouse">Warehouse</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} md={2}>
                    <Button fullWidth variant="outlined" color="inherit" startIcon={<Clear />} onClick={handleClear}>Clear</Button>
                </Grid>
            </Grid>
        </Box>
    );
};
export default SupplierAddressSearch;