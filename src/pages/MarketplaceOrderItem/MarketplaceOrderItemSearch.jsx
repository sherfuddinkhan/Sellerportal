import React from "react";

import {
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Tooltip
} from "@mui/material";

import {
    Search,
    Clear
} from "@mui/icons-material";


/* =========================================================
   MARKETPLACE ORDER ITEM SEARCH
========================================================= */

const MarketplaceOrderItemSearch = ({
    searchText,
    setSearchText
}) => {


    /* =====================================================
       CLEAR SEARCH
    ===================================================== */

    const handleClear = () => {

        setSearchText("");

    };


    /* =====================================================
       HANDLE SEARCH CHANGE
    ===================================================== */

    const handleSearchChange = (event) => {

        setSearchText(event.target.value);

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Box
            className="marketplace-order-item-search"
            sx={{
                mb: 3
            }}
        >

            <TextField
                fullWidth
                size="small"
                variant="outlined"

                placeholder={
                    "Search by Order Item No, External Item ID, " +
                    "Product Title, SKU, Marketplace Order ID, " +
                    "Listing ID or Product ID..."
                }

                value={searchText || ""}

                onChange={handleSearchChange}

                InputProps={{

                    /* -----------------------------------------
                       SEARCH ICON
                    ----------------------------------------- */

                    startAdornment: (

                        <InputAdornment position="start">

                            <Search color="action" />

                        </InputAdornment>

                    ),


                    /* -----------------------------------------
                       CLEAR BUTTON
                    ----------------------------------------- */

                    endAdornment:

                        searchText ? (

                            <InputAdornment position="end">

                                <Tooltip title="Clear Search">

                                    <IconButton
                                        size="small"
                                        onClick={handleClear}
                                        aria-label="Clear search"
                                    >

                                        <Clear />

                                    </IconButton>

                                </Tooltip>

                            </InputAdornment>

                        ) : null

                }}

            />

        </Box>

    );

};


export default MarketplaceOrderItemSearch;
