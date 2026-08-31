// =========================================================
// StockTransferToolbar.jsx
// =========================================================

import React from "react";

import {
    Box,
    Button,
    Stack,
    TextField,
} from "@mui/material";

import {
    Add,
    Refresh,
    Search,
} from "@mui/icons-material";

const StockTransferToolbar = ({
    search,
    setSearch,
    onSearch,
    onRefresh,
    onAdd,
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                mb: 2,
                flexWrap: "wrap",
            }}
        >
            <TextField
                size="small"
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
                placeholder="Search stock transfers..."
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        onSearch();
                    }
                }}
                InputProps={{
                    endAdornment: (
                        <Button
                            size="small"
                            onClick={onSearch}
                        >
                            <Search />
                        </Button>
                    ),
                }}
                sx={{
                    minWidth: 300,
                }}
            />

            <Stack
                direction="row"
                spacing={1}
            >
                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={onRefresh}
                >
                    Refresh
                </Button>

                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={onAdd}
                >
                    New Transfer
                </Button>
            </Stack>
        </Box>
    );
};

export default StockTransferToolbar;

