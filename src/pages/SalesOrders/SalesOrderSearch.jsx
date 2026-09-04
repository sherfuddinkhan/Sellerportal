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
// SALES ORDER SEARCH
// =========================================================

const SalesOrderSearch = ({
    searchText,
    setSearchText
}) => {

    // =====================================================
    // CLEAR SEARCH
    // =====================================================

    const handleClear = () => {

        setSearchText("");

    };


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

                placeholder={
                    "Search by Order Number, Seller ID, " +
                    "Customer ID, Status or Remarks..."
                }

                value={searchText}

                onChange={(event) => {

                    setSearchText(
                        event.target.value
                    );

                }}

                InputProps={{
                    startAdornment: (

                        <InputAdornment position="start">

                            <SearchIcon />

                        </InputAdornment>

                    ),

                    endAdornment: searchText && (

                        <InputAdornment position="end">

                            <IconButton
                                size="small"
                                onClick={handleClear}
                                aria-label="Clear search"
                            >

                                <ClearIcon />

                            </IconButton>

                        </InputAdornment>

                    )
                }}

            />

        </Box>

    );

};


export default SalesOrderSearch;
