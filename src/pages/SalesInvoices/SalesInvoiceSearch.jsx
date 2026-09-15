import React from "react";

import {
    Box,
    TextField,
    InputAdornment,
    IconButton
} from "@mui/material";

import {
    Search,
    Clear
} from "@mui/icons-material";


const SalesInvoiceSearch = ({
    searchText,
    setSearchText
}) => {


    const handleClear = () => {

        setSearchText("");

    };


    return (

        <Box
            sx={{
                mb: 3,
                width: "100%"
            }}
        >

            <TextField
                fullWidth
                size="small"
                label="Search Sales Invoices"
                placeholder="Invoice Number, Company, Sales Order ID, Payment Status, Status or Remarks..."
                value={searchText}
                onChange={(event) =>
                    setSearchText(
                        event.target.value
                    )
                }
                InputProps={{

                    startAdornment: (

                        <InputAdornment position="start">

                            <Search color="action" />

                        </InputAdornment>
                    ),

                    endAdornment: searchText ? (

                        <InputAdornment position="end">

                            <IconButton
                                size="small"
                                onClick={handleClear}
                                aria-label="Clear search"
                            >
                                <Clear />
                            </IconButton>

                        </InputAdornment>

                    ) : null

                }}
            />

        </Box>
    );
};


export default SalesInvoiceSearch;