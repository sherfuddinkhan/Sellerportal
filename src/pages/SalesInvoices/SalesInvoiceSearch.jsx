import React from "react";

import {
    Box,
    TextField,
    InputAdornment
} from "@mui/material";

import {
    Search
} from "@mui/icons-material";

const SalesInvoiceSearch = ({

    searchText,

    setSearchText

}) => {

    return (

        <Box
            sx={{
                mb: 3
            }}
        >

            <TextField
                fullWidth
                placeholder="Search by Invoice Number, Sales Order ID, Payment Status, Status or Remarks..."
                value={searchText}
                onChange={(e) =>
                    setSearchText(e.target.value)
                }
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search color="action" />
                        </InputAdornment>
                    )
                }}
            />

        </Box>

    );

};

export default SalesInvoiceSearch;