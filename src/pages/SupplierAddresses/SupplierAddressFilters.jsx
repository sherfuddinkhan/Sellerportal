import React from "react";
import { Box, Grid, TextField, MenuItem, Button, InputAdornment, Typography } from "@mui/material";
import { Search, Clear } from "@mui/icons-material";

const SupplierAddressFilters = ({
    searchTerm = "", onSearchChange,
    addressTypeFilter = "all", onAddressTypeChange,
    cityFilter = "", onCityChange,
    stateFilter = "", onStateChange, // stateCode
    countryFilter = "", onCountryChange, // countryCode
    pincodeFilter = "", onPincodeChange,
    supplierFilter = "all", onSupplierChange,
    suppliers = [], supplierAddresses = [],
    onClear, loading = false
}) => {
    const getUniqueValues = (...fields) => {
        const values = supplierAddresses.map(item => {
            for (const f of fields) {
                const v = item?.[f]?? item?.[f.charAt(0).toUpperCase()+f.slice(1)];
                if (v!==null && v!==undefined && String(v).trim()!=="") return String(v).trim();
            }
            return null;
        }).filter(Boolean);
        return [...new Set(values)].sort((a,b)=>a.localeCompare(b));
    };

    const supplierOptions = suppliers.length > 0? suppliers :
        supplierAddresses.map(item => ({
            supplierId: item?.supplierId?? item?.SupplierId,
            supplierName: item?.supplierName?? item?.SupplierName?? `Supplier ${item?.supplierId}`
        })).filter((v,i,a)=> a.findIndex(t=> String(t.supplierId)===String(v.supplierId))===i);

    const handleClear = () => {
        if (onClear) { onClear(); return; }
        onSearchChange?.(""); onAddressTypeChange?.("all");
        onCityChange?.(""); onStateChange?.(""); onCountryChange?.("");
        onPincodeChange?.(""); onSupplierChange?.("all");
    };

    const hasActiveFilters = searchTerm!=="" || addressTypeFilter!=="all" || cityFilter!=="" || stateFilter!=="" || countryFilter!=="" || pincodeFilter!=="" || supplierFilter!=="all";

    return (
        <Box sx={{ width: "100%", p: 2, mb: 2, border: "1px solid", borderColor: "divider", borderRadius: 2, bgcolor: "background.paper" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={600}>Supplier Address Filters (New Model)</Typography>
                <Button variant="outlined" color="inherit" size="small" startIcon={<Clear />} onClick={handleClear} disabled={loading ||!hasActiveFilters}>Clear Filters</Button>
            </Box>
            <Grid container spacing={2}>
                <Grid xs={12} sm={6} md={3}>
                    <TextField fullWidth size="small" label="Search" placeholder="Address, city, pincode, phone..." value={searchTerm} onChange={(e)=>onSearchChange?.(e.target.value)} disabled={loading}
                        InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }} />
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                    <TextField select fullWidth size="small" label="Supplier" value={supplierFilter} onChange={(e)=>onSupplierChange?.(e.target.value)} disabled={loading}>
                        <MenuItem value="all">All Suppliers</MenuItem>
                        {supplierOptions.map((s,i)=> <MenuItem key={s.supplierId??i} value={String(s.supplierId)}>{s.supplierName}</MenuItem>)}
                    </TextField>
                </Grid>
                <Grid xs={12} sm={6} md={2}>
                    <TextField select fullWidth size="small" label="Address Type" value={addressTypeFilter} onChange={(e)=>onAddressTypeChange?.(e.target.value)} disabled={loading}>
                        <MenuItem value="all">All Types</MenuItem>
                        <MenuItem value="Billing">Billing</MenuItem>
                        <MenuItem value="Shipping">Shipping</MenuItem>
                        <MenuItem value="Office">Office</MenuItem>
                        <MenuItem value="Warehouse">Warehouse</MenuItem>
                    </TextField>
                </Grid>
                <Grid xs={12} sm={6} md={2}>
                    <TextField select fullWidth size="small" label="City" value={cityFilter} onChange={(e)=>onCityChange?.(e.target.value)} disabled={loading}>
                        <MenuItem value="">All Cities</MenuItem>
                        {getUniqueValues("city","City").map(c=> <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </TextField>
                </Grid>
                <Grid xs={12} sm={6} md={2}>
                    <TextField select fullWidth size="small" label="State Code" value={stateFilter} onChange={(e)=>onStateChange?.(e.target.value)} disabled={loading}>
                        <MenuItem value="">All State Codes</MenuItem>
                        {getUniqueValues("stateCode","StateCode","state","State").map(s=> <MenuItem key={s} value={s}>{s}</MenuItem>)}
                    </TextField>
                </Grid>
                <Grid xs={12} sm={6} md={2}>
                    <TextField select fullWidth size="small" label="Country Code" value={countryFilter} onChange={(e)=>onCountryChange?.(e.target.value)} disabled={loading}>
                        <MenuItem value="">All Country Codes</MenuItem>
                        {getUniqueValues("countryCode","CountryCode","country","Country").map(c=> <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </TextField>
                </Grid>
                <Grid xs={12} sm={6} md={2}>
                    <TextField select fullWidth size="small" label="Pincode" value={pincodeFilter} onChange={(e)=>onPincodeChange?.(e.target.value)} disabled={loading}>
                        <MenuItem value="">All Pincodes</MenuItem>
                        {getUniqueValues("pincode","Pincode","postalCode","PostalCode").map(p=> <MenuItem key={p} value={p}>{p}</MenuItem>)}
                    </TextField>
                </Grid>
            </Grid>
        </Box>
    );
};
export default SupplierAddressFilters;
