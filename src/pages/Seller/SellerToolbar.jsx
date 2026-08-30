// =========================================================
// SellerToolbar.jsx
// =========================================================

import React from "react";

import {
    Box,
    Button,
    TextField,
} from "@mui/material";

import {
    Add,
    Clear,
    Search,
} from "@mui/icons-material";

const SellerToolbar = ({
    search = "",
    setSearch,
    onSearch,
    onClear,
    onCreate,
}) => {

    const handleKeyDown = (event) => {

        if (event.key === "Enter") {
            onSearch();
        }
    };

    return (

        <Box
            sx={{
                display: "flex",
                flexDirection: {
                    xs: "column",
                    md: "row",
                },
                gap: 2,
                mb: 3,
                alignItems: {
                    xs: "stretch",
                    md: "center",
                },
            }}
        >

            <TextField
                fullWidth
                value={search}
                onChange={(event) =>
                    setSearch(
                        event.target.value
                    )
                }
                onKeyDown={handleKeyDown}
                label="Search Sellers"
                placeholder="Search by seller name..."
                size="medium"
                InputProps={{
                    startAdornment: (
                        <Search
                            sx={{
                                mr: 1,
                                color:
                                    "text.secondary",
                            }}
                        />
                    ),
                }}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        minHeight: 56,
                    },
                }}
            />


            <Button
                variant="contained"
                startIcon={<Search />}
                onClick={onSearch}
                sx={{
                    minHeight: 56,
                    minWidth: 130,
                }}
            >
                Search
            </Button>


            <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={onClear}
                sx={{
                    minHeight: 56,
                    minWidth: 120,
                }}
            >
                Clear
            </Button>


            <Button
                variant="contained"
                color="success"
                startIcon={<Add />}
                onClick={onCreate}
                sx={{
                    minHeight: 56,
                    minWidth: 150,
                    whiteSpace: "nowrap",
                }}
            >
                Add Seller
            </Button>

        </Box>
    );
};

export default SellerToolbar;
