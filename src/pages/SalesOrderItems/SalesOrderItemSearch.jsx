import React from "react";

import {
    Box,
    TextField,
    InputAdornment,
    IconButton
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

// =========================================================
// SALES ORDER ITEM SEARCH
// =========================================================

const SalesOrderItemSearch = ({
    searchText,
    setSearchText
}) => {

    // =====================================================
    // CLEAR SEARCH
    // =====================================================

    const handleClear = () => {

        setSearchText("");

    };

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box
            className="sales-order-item-search"
            sx={{
                mb: 3,
                width: "100%"
            }}
        >

            <TextField
                fullWidth
                size="small"

                label="Search Sales Order Items"

                placeholder={
                    "Search by Item ID, Sales Order ID, Product ID, " +
                    "Line Number, Quantity, Unit Price, Total Amount..."
                }

                value={searchText}

                onChange={(e) =>
                    setSearchText(e.target.value)
                }

                InputProps={{

                    startAdornment: (

                        <InputAdornment position="start">

                            <SearchIcon
                                color="action"
                            />

                        </InputAdornment>

                    ),

                    endAdornment: searchText && (

                        <InputAdornment position="end">

                            <IconButton
                                size="small"
                                onClick={handleClear}
                                aria-label="Clear search"
                            >

                                <ClearIcon fontSize="small" />

                            </IconButton>

                        </InputAdornment>

                    )

                }}

            />

        </Box>

    );

};

export default SalesOrderItemSearch;
