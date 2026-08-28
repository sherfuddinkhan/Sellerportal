import React from "react";
import {
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Button
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";


const BrandSearch = ({
    value = "",
    onChange,
    onSearch
}) => {


    // =====================================================
    // CLEAR SEARCH
    // =====================================================

    const handleClear = () => {

        onChange("");

        // Immediately clear applied search
        if (onSearch) {
            onSearch("");
        }

    };


    // =====================================================
    // SEARCH
    // =====================================================

    const handleSearch = () => {

        console.log(
            "Searching Brand:",
            value
        );

        if (onSearch) {

            onSearch(
                value.trim()
            );

        }

    };


    // =====================================================
    // ENTER KEY
    // =====================================================

    const handleKeyDown = (event) => {

        if (event.key === "Enter") {

            event.preventDefault();

            handleSearch();

        }

    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <Box
            mb={3}
            display="flex"
            gap={2}
            alignItems="center"
        >

            <TextField
                fullWidth
                variant="outlined"

                label="Search Brands"

                placeholder="Search Brand Name or Description..."

                value={value}

                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }

                onKeyDown={
                    handleKeyDown
                }

                InputProps={{

                    startAdornment: (

                        <InputAdornment
                            position="start"
                        >

                            <SearchIcon
                                color="primary"
                            />

                        </InputAdornment>

                    ),

                    endAdornment:
                        value ? (

                            <InputAdornment
                                position="end"
                            >

                                <IconButton
                                    size="small"
                                    onClick={
                                        handleClear
                                    }
                                    aria-label="Clear search"
                                >

                                    <ClearIcon />

                                </IconButton>

                            </InputAdornment>

                        ) : null

                }}

            />


            <Button
                variant="contained"
                startIcon={
                    <SearchIcon />
                }
                onClick={
                    handleSearch
                }
                sx={{
                    minWidth: 120,
                    height: 56
                }}
            >
                Search
            </Button>

        </Box>

    );

};


export default BrandSearch;
