import React from "react";

import {
Box,
TextField,
InputAdornment
} from "@mui/material";

import {
Search
} from "@mui/icons-material";

/* =========================================================
PURCHASE ORDER ITEM SEARCH
========================================================= */

const PurchaseOrderItemSearch = ({
searchText,
setSearchText
}) => {
/* =====================================================
   HANDLE SEARCH
===================================================== */

const handleSearchChange = (
    event
) => {

    setSearchText(
        event.target.value
    );

};


/* =====================================================
   CLEAR SEARCH
===================================================== */

const handleClearSearch = () => {

    setSearchText("");

};


/* =====================================================
   RENDER
===================================================== */

return (

    <Box
        className="purchase-order-item-search"
        sx={{
            mb: 3
        }}
    >

        <TextField
            fullWidth
            size="small"
            label="Search Purchase Order Items"
            placeholder={
                "Search by Item ID, Purchase Order ID, " +
                "Product ID, Quantity, Unit Price, " +
                "Total Amount..."
            }
            value={searchText}
            onChange={
                handleSearchChange
            }
            InputProps={{
                startAdornment: (

                    <InputAdornment
                        position="start"
                    >

                        <Search />

                    </InputAdornment>

                ),

                endAdornment:
                    searchText ? (

                        <InputAdornment
                            position="end"
                        >

                            <Box
                                component="span"
                                onClick={
                                    handleClearSearch
                                }
                                sx={{
                                    cursor:
                                        "pointer",
                                    fontSize:
                                        "14px",
                                    color:
                                        "text.secondary",
                                    px: 1,
                                    userSelect:
                                        "none",
                                    "&:hover": {
                                        color:
                                            "text.primary"
                                    }
                                }}
                            >
                                Clear
                            </Box>

                        </InputAdornment>

                    ) : null
            }}
        />

    </Box>

);


};

export default PurchaseOrderItemSearch;

