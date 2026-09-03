import React from "react";

import {
    TextField,
    InputAdornment,
    IconButton,
    Box,
    Tooltip,
} from "@mui/material";

import {
    Search,
    Clear,
} from "@mui/icons-material";


// =========================================================
// StockLedgerSearch
// =========================================================

const StockLedgerSearch = ({
    searchText,
    setSearchText,
}) => {


    // =========================================================
    // CLEAR SEARCH
    // =========================================================

    const handleClear = () => {

        setSearchText("");

    };


    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Box
            className="stock-ledger-search"
            sx={{
                mb: 3,
                width: "100%",
            }}
        >

            <TextField
                fullWidth
                variant="outlined"

                placeholder="Search by Product, Warehouse, Transaction Type or Reference Number"

                value={searchText}

                onChange={(event) => {
                    setSearchText(event.target.value);
                }}

                InputProps={{

                    // =================================================
                    // SEARCH ICON
                    // =================================================

                    startAdornment: (
                        <InputAdornment position="start">
                            <Search color="action" />
                        </InputAdornment>
                    ),


                    // =================================================
                    // CLEAR BUTTON
                    // =================================================

                    endAdornment: searchText ? (
                        <InputAdornment position="end">

                            <Tooltip title="Clear search">

                                <IconButton
                                    onClick={handleClear}
                                    edge="end"
                                    aria-label="Clear search"
                                >
                                    <Clear />
                                </IconButton>

                            </Tooltip>

                        </InputAdornment>
                    ) : null,

                }}
            />

        </Box>
    );
};


export default StockLedgerSearch;
