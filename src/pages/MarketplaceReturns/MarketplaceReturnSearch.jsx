import React from "react";

import {
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Tooltip
} from "@mui/material";

import {
    Search,
    Clear
} from "@mui/icons-material";

const MarketplaceReturnSearch = ({
    searchText,
    setSearchText
}) => {

    const handleClear = () => {

        setSearchText("");

    };

    return (

        <Box
            className="marketplace-return-search"
            sx={{ mb: 3 }}
        >

            <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search by Return No, Marketplace Order Item ID, Return Reason, Status, Quantity or Refund Amount..."
                value={searchText}
                onChange={(e) =>
                    setSearchText(e.target.value)
                }
                InputProps={{

                    startAdornment: (

                        <InputAdornment position="start">

                            <Search color="action" />

                        </InputAdornment>

                    ),

                    endAdornment:

                        searchText && (

                            <InputAdornment position="end">

                                <Tooltip title="Clear Search">

                                    <IconButton
                                        size="small"
                                        onClick={handleClear}
                                    >

                                        <Clear />

                                    </IconButton>

                                </Tooltip>

                            </InputAdornment>

                        )

                }}
            />

        </Box>

    );

};

export default MarketplaceReturnSearch;