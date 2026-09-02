// =========================================================
// ShipmentSearch.jsx
// Shipment Search
// =========================================================

import React from "react";

import {
    Paper,
    Grid,
    TextField,
    InputAdornment,
    IconButton,
    Tooltip
} from "@mui/material";

import {
    Search,
    Clear
} from "@mui/icons-material";

// =========================================================
// COMPONENT
// =========================================================

const ShipmentSearch = ({
    searchText = "",
    setSearchText
}) => {

    // ---------------------------------------------------------
    // HANDLE SEARCH
    // ---------------------------------------------------------

    const handleSearchChange = (event) => {

        const value =
            event.target.value;

        if (setSearchText) {
            setSearchText(value);
        }
    };

    // ---------------------------------------------------------
    // CLEAR SEARCH
    // ---------------------------------------------------------

    const handleClear = () => {

        if (setSearchText) {
            setSearchText("");
        }
    };

    // ---------------------------------------------------------
    // RETURN
    // ---------------------------------------------------------

    return (

        <Paper
            elevation={2}
            sx={{
                p: 2,
                mb: 3
            }}
        >

            <Grid
                container
                spacing={2}
            >

                <Grid
                    item
                    xs={12}
                >

                    <TextField
                        fullWidth
                        label="Search Shipments"
                        placeholder="Search by Shipment ID, Order ID, Courier or Tracking Number"
                        value={searchText}
                        onChange={
                            handleSearchChange
                        }

                        InputProps={{
                            startAdornment: (
                                <InputAdornment
                                    position="start"
                                >
                                    <Search
                                        color="action"
                                    />
                                </InputAdornment>
                            ),

                            endAdornment:
                                searchText ? (
                                    <InputAdornment
                                        position="end"
                                    >
                                        <Tooltip
                                            title="Clear Search"
                                        >
                                            <IconButton
                                                size="small"
                                                onClick={
                                                    handleClear
                                                }
                                            >
                                                <Clear />
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                ) : null
                        }}
                    />

                </Grid>

            </Grid>

        </Paper>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default ShipmentSearch;
