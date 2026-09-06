import React from "react";

import {
    Paper,
    Grid,
    TextField,
    InputAdornment
} from "@mui/material";

import {
    Search
} from "@mui/icons-material";


/* =========================================================
   ORDER STATUS HISTORY SEARCH
========================================================= */

const OrderStatusHistorySearch = ({
    searchText,
    setSearchText
}) => {

    /* =====================================================
       SEARCH CHANGE
    ===================================================== */

    const handleSearchChange = (event) => {

        if (typeof setSearchText === "function") {

            setSearchText(
                event.target.value
            );

        }

    };


    /* =====================================================
       RENDER
    ===================================================== */

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

                {/* =================================================
                    SEARCH FIELD
                ================================================= */}

                <Grid
                    item
                    xs={12}
                >

                    <TextField
                        fullWidth

                        size="small"

                        label="Search Order Status History"

                        placeholder="Search by Order ID, Status or Remarks"

                        value={searchText || ""}

                        onChange={handleSearchChange}

                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            )
                        }}
                    />

                </Grid>

            </Grid>

        </Paper>
    );
};


export default OrderStatusHistorySearch;
