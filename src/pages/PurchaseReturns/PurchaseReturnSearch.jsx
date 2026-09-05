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


const PurchaseReturnSearch = ({
    searchText = "",
    setSearchText
}) => {

    /* =========================================================
       HANDLE SEARCH
    ========================================================= */

    const handleSearchChange = (event) => {

        const value = event.target.value;

        if (typeof setSearchText === "function") {
            setSearchText(value);
        }

    };


    /* =========================================================
       CLEAR SEARCH
    ========================================================= */

    const handleClear = () => {

        if (typeof setSearchText === "function") {
            setSearchText("");
        }

    };


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <Box
            className="purchase-return-search"
            sx={{
                mb: 3,
                width: "100%"
            }}
        >

            <TextField
                fullWidth
                variant="outlined"
                size="small"

                placeholder={
                    "Search by Return No, Purchase Order, " +
                    "GRN, Supplier, Status, Reason or Total Amount..."
                }

                value={searchText}

                onChange={handleSearchChange}

                InputProps={{

                    startAdornment: (

                        <InputAdornment position="start">

                            <Search
                                color="action"
                            />

                        </InputAdornment>

                    ),

                    endAdornment:

                        searchText.length > 0
                            ? (

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

                            )
                            : null

                }}

            />

        </Box>

    );

};


export default PurchaseReturnSearch;