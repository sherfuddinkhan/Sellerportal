// =========================================================
// ProductTypeSearch.jsx
// Product Type Search Component
// =========================================================

import React from "react";

import {
    InputAdornment,
    TextField,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";


// =========================================================
// PRODUCT TYPE SEARCH
// =========================================================

const ProductTypeSearch = ({
    searchText = "",
    setSearchText,
}) => {

    // =====================================================
    // HANDLE SEARCH
    // =====================================================

    const handleSearchChange = (event) => {

        if (setSearchText) {

            setSearchText(
                event.target.value
            );

        }

    };


    // =====================================================
    // CLEAR SEARCH
    // =====================================================

    const handleClear = () => {

        if (setSearchText) {

            setSearchText("");

        }

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <TextField

            fullWidth

            size="small"

            label="Search"

            placeholder="Search Product Type..."

            value={searchText}

            onChange={
                handleSearchChange
            }

            autoComplete="off"

            InputProps={{

                startAdornment: (

                    <InputAdornment
                        position="start"
                    >

                        <SearchIcon
                            fontSize="small"
                        />

                    </InputAdornment>

                ),

            }}

            InputLabelProps={{
                shrink: true,
            }}

            inputProps={{
                "aria-label":
                    "Search Product Type",
            }}

        />

    );

};


// =========================================================
// EXPORT
// =========================================================

export default ProductTypeSearch;
