
import React from "react";

import {
    Box,
    InputAdornment,
    TextField,
    IconButton,
    Tooltip
} from "@mui/material";

import {
    Search,
    Clear
} from "@mui/icons-material";

const MarketplaceOrderSearch = ({
    value = "",
    onChange,
    placeholder = "Search marketplace orders..."
}) => {

    const handleChange = (event) => {
        if (onChange) {
            onChange(event.target.value);
        }
    };

    const handleClear = () => {
        if (onChange) {
            onChange("");
        }
    };

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: 500
            }}
        >
            <TextField
                fullWidth
                size="small"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                variant="outlined"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search color="action" />
                        </InputAdornment>
                    ),

                    endAdornment: value ? (
                        <InputAdornment position="end">
                            <Tooltip title="Clear search">
                                <IconButton
                                    size="small"
                                    onClick={handleClear}
                                    edge="end"
                                    aria-label="clear search"
                                >
                                    <Clear fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </InputAdornment>
                    ) : null
                }}
            />
        </Box>
    );
};

export default MarketplaceOrderSearch;

