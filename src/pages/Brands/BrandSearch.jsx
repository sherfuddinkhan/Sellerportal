import React from "react";
import {
    Box,
    TextField,
    InputAdornment,
    IconButton
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const BrandSearch = ({
    value,
    onChange
}) => {

    const handleClear = () => {
        onChange("");
    };

    return (

        <Box mb={3}>

            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search Brand Name or Description..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="primary" />
                        </InputAdornment>
                    ),

                    endAdornment: value && (
                        <InputAdornment position="end">
                            <IconButton
                                size="small"
                                onClick={handleClear}
                            >
                                <ClearIcon />
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />

        </Box>

    );

};

export default BrandSearch;