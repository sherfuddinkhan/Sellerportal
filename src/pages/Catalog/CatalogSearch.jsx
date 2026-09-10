
// ================================================================
// CatalogSearch.jsx
// ================================================================

import React, { useState } from "react";

import {
    Paper,
    Grid,
    TextField,
    Button,
    Stack
} from "@mui/material";

import {
    Search,
    Clear
} from "@mui/icons-material";

// ================================================================
// COMPONENT
// ================================================================

const CatalogSearch = ({
    sellerId,
    customerId,
    onSearch,
    onClear,
    loading = false
}) => {

    // ============================================================
    // SEARCH STATE
    // ============================================================

    const [searchText, setSearchText] = useState("");

    // ============================================================
    // HANDLE SEARCH TEXT
    // ============================================================

    const handleChange = (event) => {

        setSearchText(event.target.value);

    };

    // ============================================================
    // SEARCH BUTTON
    // ============================================================

    const handleSearch = () => {

        const value = searchText.trim();

        // --------------------------------------------------------
        // Do not search with an empty value
        // --------------------------------------------------------

        if (!value) {

            return;

        }

        // --------------------------------------------------------
        // Send search value to CatalogList
        // --------------------------------------------------------

        onSearch?.(value);

    };

    // ============================================================
    // CLEAR BUTTON
    // ============================================================

    const handleClear = () => {

        setSearchText("");

        onClear?.();

    };

    // ============================================================
    // ENTER KEY
    // ============================================================

    const handleKeyDown = (event) => {

        if (event.key === "Enter") {

            event.preventDefault();

            handleSearch();

        }

    };

    // ============================================================
    // RENDER
    // ============================================================

    return (

        <Paper
            elevation={1}
            sx={{
                p: 2,
                mb: 2
            }}
        >

            <Grid
                container
                spacing={2}
                alignItems="center"
            >

                {/* =================================================
                    SEARCH FIELD
                ================================================== */}

                <Grid
                    item
                    xs={12}
                    md={8}
                >

                    <TextField
                        fullWidth
                        size="small"
                        label="Search Product"
                        placeholder="Search by product name, SKU, barcode..."
                        value={searchText}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />

                </Grid>

                {/* =================================================
                    SEARCH / CLEAR BUTTONS
                ================================================== */}

                <Grid
                    item
                    xs={12}
                    md={4}
                >

                    <Stack
                        direction="row"
                        spacing={1}
                    >

                        {/* =========================================
                            SEARCH
                        ========================================== */}

                        <Button
                            variant="contained"
                            startIcon={<Search />}
                            onClick={handleSearch}
                            disabled={
                                loading ||
                                !sellerId ||
                                !customerId ||
                                !searchText.trim()
                            }
                        >
                            Search
                        </Button>

                        {/* =========================================
                            CLEAR
                        ========================================== */}

                        <Button
                            variant="outlined"
                            startIcon={<Clear />}
                            onClick={handleClear}
                            disabled={loading}
                        >
                            Clear
                        </Button>

                    </Stack>

                </Grid>

            </Grid>

        </Paper>

    );

};

export default CatalogSearch;






