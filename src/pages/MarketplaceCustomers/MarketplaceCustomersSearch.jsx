import React from "react";
import {
    Button,
    Grid,
    Paper,
    TextField
} from "@mui/material";
import { Search, Refresh } from "@mui/icons-material";

 function MarketplaceCustomersSearch({
    filters,
    setFilters,
    onSearch,
    onReset
}) {
    const handleChange = (event) => {
        setFilters((prev) => ({
            ...prev,
            [event.target.name]: event.target.value
        }));
    };

    return (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        label="Search"
                        name="search"
                        value={filters.search || ""}
                        onChange={handleChange}
                        placeholder="Company, GSTIN, email..."
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                    <TextField
                        fullWidth
                        label="Seller ID"
                        name="sellerId"
                        type="number"
                        value={filters.sellerId || ""}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                    <TextField
                        fullWidth
                        label="Customer ID"
                        name="customerId"
                        type="number"
                        value={filters.customerId || ""}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                    <TextField
                        fullWidth
                        label="Marketplace"
                        name="marketplaceName"
                        value={filters.marketplaceName || ""}
                        onChange={handleChange}
                        placeholder="FLIPKART"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Button
                        variant="contained"
                        startIcon={<Search />}
                        onClick={onSearch}
                        sx={{ mr: 1, mb: { xs: 1, sm: 0 } }}
                    >
                        Search
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={onReset}
                    >
                        Reset
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
}
export default MarketplaceCustomersSearch