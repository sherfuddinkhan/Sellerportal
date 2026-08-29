// =========================================================
// CatalogSearch.jsx
// =========================================================

import React, { useState } from "react";

import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

// =========================================================
// COMPONENT
// =========================================================

const CatalogSearch = () => {
    const [search, setSearch] = useState("");

    const handleSearch = () => {
        console.log("Catalog search:", search);
    };

    const handleClear = () => {
        setSearch("");
    };

    return (
        <Box
            sx={{
                width: "100%",
                p: 3,
            }}
        >
            {/* =====================================================
                HEADER
               ===================================================== */}

            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h4"
                    fontWeight="bold"
                >
                    Search Catalogs
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Search catalog records
                </Typography>
            </Box>

            {/* =====================================================
                SEARCH
               ===================================================== */}

            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        flexWrap: "wrap",
                    }}
                >
                    <TextField
                        fullWidth
                        label="Search Catalog"
                        placeholder="Enter catalog name..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        onKeyDown={(e) => {
                            if (
                                e.key === "Enter"
                            ) {
                                handleSearch();
                            }
                        }}
                        sx={{
                            flex: 1,
                            minWidth: 250,
                        }}
                    />

                    <Button
                        variant="contained"
                        startIcon={<SearchIcon />}
                        onClick={handleSearch}
                    >
                        Search
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<ClearIcon />}
                        onClick={handleClear}
                    >
                        Clear
                    </Button>
                </Box>

                {/* =================================================
                    SEARCH VALUE
                   ================================================= */}

                {search && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 2 }}
                    >
                        Searching for:{" "}
                        <strong>
                            {search}
                        </strong>
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default CatalogSearch;
