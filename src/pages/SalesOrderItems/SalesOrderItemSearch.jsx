import React from "react";

import {
    Box,
    TextField,
    InputAdornment
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

const SalesOrderItemSearch = ({

    searchText,

    setSearchText

}) => {

    return (

        <Box
            className="sales-order-item-search"
            sx={{
                mb: 3
            }}
        >

            <TextField
                fullWidth
                size="small"
                label="Search Sales Order Items"
                placeholder="Search by Item ID, Sales Order ID, Product ID, Quantity, Unit Price or Total Amount..."
                value={searchText}
                onChange={(e) =>
                    setSearchText(
                        e.target.value
                    )
                }
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">

                            <SearchIcon />

                        </InputAdornment>
                    )
                }}
            />

        </Box>

    );

};

export default SalesOrderItemSearch;