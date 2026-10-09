import React from "react";

import {
Box,
TextField,
InputAdornment,
IconButton,
Tooltip,
Paper
} from "@mui/material";

import {
Search,
Clear,
Refresh
} from "@mui/icons-material";

/* =========================================================
INVOICE TAX DETAIL SEARCH
========================================================= */

const InvoiceTaxDetailSearch = ({
searchTerm = "",
onSearchChange,
onRefresh,
loading = false
}) => {
const handleSearchChange = (event) => {
if (onSearchChange) {
onSearchChange(event.target.value);
}
};
const handleClear = () => {
    if (onSearchChange) {
        onSearchChange("");
    }
};

return (
    <Paper
        elevation={1}
        sx={{
            p: 2,
            borderRadius: 2
        }}
    >
        <Box
            display="flex"
            alignItems="center"
            gap={2}
            flexWrap="wrap"
        >
            <TextField
                fullWidth
                size="small"
                label="Search Invoice Tax Details"
                placeholder="Search by invoice ID, tax name, tax code, amount..."
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{
                    flex: "1 1 280px",
                    minWidth: 0
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search color="action" />
                        </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                        <InputAdornment position="end">
                            <Tooltip title="Clear search">
                                <IconButton
                                    size="small"
                                    onClick={handleClear}
                                    edge="end"
                                    aria-label="Clear search"
                                >
                                    <Clear fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </InputAdornment>
                    )
                }}
            />

            {onRefresh && (
                <Tooltip title="Refresh invoice tax details">
                    <span>
                        <IconButton
                            color="primary"
                            onClick={onRefresh}
                            disabled={loading}
                            aria-label="Refresh invoice tax details"
                        >
                            <Refresh />
                        </IconButton>
                    </span>
                </Tooltip>
            )}
        </Box>
    </Paper>
);
};

export default InvoiceTaxDetailSearch;
