
import React from "react";
import {
    TextField,
    InputAdornment
} from "@mui/material";
import { Search } from "@mui/icons-material";

const MarketplaceSearch = ({
    value,
    onChange
}) => {
    return (
        <TextField
            size="small"
            label="Search marketplace"
            value={value}
            onChange={(e) =>
                onChange(e.target.value)
            }
            sx={{ minWidth: 280 }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Search />
                    </InputAdornment>
                )
            }}
        />
    );
};

export default MarketplaceSearch;