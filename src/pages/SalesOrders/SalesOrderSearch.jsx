import React from "react";

import {
    Box,
    TextField,
    InputAdornment
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

const SalesOrderSearch = ({

    searchText,

    setSearchText

}) => {

    return (

        <Box
            className="sales-order-search"
            sx={{
                mb: 3
            }}
        >

            <TextField
                fullWidth
                size="small"
                label="Search Sales Orders"
                placeholder="Search by Order Number, Seller ID, Customer ID, Status or Remarks..."
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

export default SalesOrderSearch;