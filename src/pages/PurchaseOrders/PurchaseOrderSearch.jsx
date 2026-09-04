import React from "react";

import {
    Box,
    TextField,
    InputAdornment,
    IconButton
} from "@mui/material";

import {
    Search as SearchIcon,
    Clear as ClearIcon
} from "@mui/icons-material";


/* =========================================================
   PURCHASE ORDER SEARCH
========================================================= */

const PurchaseOrderSearch = ({

    searchText,

    setSearchText

}) => {


    /* =====================================================
       HANDLE SEARCH CHANGE
    ===================================================== */

    const handleChange = (event) => {

        setSearchText(
            event.target.value
        );

    };


    /* =====================================================
       CLEAR SEARCH
    ===================================================== */

    const handleClear = () => {

        setSearchText("");

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Box

            className="purchase-order-search"

            sx={{

                mb: 3,

                width: "100%"

            }}

        >

            <TextField

                fullWidth

                size="small"

                label="Search Purchase Orders"

                placeholder={
                    "Search by Purchase Order Number, " +
                    "Supplier ID, Seller ID, Status, Amount..."
                }

                value={
                    searchText || ""
                }

                onChange={
                    handleChange
                }

                slotProps={{

                    input: {

                        startAdornment: (

                            <InputAdornment
                                position="start"
                            >

                                <SearchIcon />

                            </InputAdornment>

                        ),

                        endAdornment:

                            searchText ? (

                                <InputAdornment
                                    position="end"
                                >

                                    <IconButton

                                        size="small"

                                        aria-label="Clear search"

                                        onClick={
                                            handleClear
                                        }

                                        edge="end"

                                    >

                                        <ClearIcon />

                                    </IconButton>

                                </InputAdornment>

                            ) : null

                    }

                }}

            />

        </Box>

    );

};


export default PurchaseOrderSearch;
