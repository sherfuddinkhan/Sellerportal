import React from "react";

import {
    Box,
    TextField,
    InputAdornment
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

const PurchaseOrderSearch = ({

    searchText,

    setSearchText

}) => {

    return (

        <Box
            className="purchase-order-search"
            sx={{
                mb: 3
            }}
        >

            <TextField
                fullWidth
                size="small"
                label="Search Purchase Orders"
                placeholder="Search by Purchase Order Number, Supplier ID, Seller ID, Status, Amount..."
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

export default PurchaseOrderSearch;