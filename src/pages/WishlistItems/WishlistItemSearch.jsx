import React from "react";

import {
    TextField,
    InputAdornment,
    IconButton
} from "@mui/material";

import {
    Search,
    Clear
} from "@mui/icons-material";


/* =========================================================
   WISHLIST ITEM SEARCH
========================================================= */

const WishlistItemSearch = ({
    value = "",
    onChange,
    onSearch,
    placeholder = "Search wishlist items..."
}) => {


    /* =====================================================
       CHANGE
    ===================================================== */

    const handleChange = (event) => {

        const newValue = event.target.value;

        if (typeof onChange === "function") {
            onChange(newValue);
        }
    };


    /* =====================================================
       SEARCH
    ===================================================== */

    const handleSearch = () => {

        if (typeof onSearch === "function") {
            onSearch(value);
        }
    };


    /* =====================================================
       KEY DOWN
    ===================================================== */

    const handleKeyDown = (event) => {

        if (event.key === "Enter") {
            handleSearch();
        }
    };


    /* =====================================================
       CLEAR
    ===================================================== */

    const handleClear = () => {

        if (typeof onChange === "function") {
            onChange("");
        }

        if (typeof onSearch === "function") {
            onSearch("");
        }
    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <TextField
            fullWidth
            size="small"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Search />
                    </InputAdornment>
                ),

                endAdornment: value ? (
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
    );
};


export default WishlistItemSearch;