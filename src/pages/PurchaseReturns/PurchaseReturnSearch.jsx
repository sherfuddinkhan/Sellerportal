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

const PurchaseReturnSearch = ({
    searchText,
    setSearchText
}) => {

    const handleClear = () => {

        setSearchText("");

    };

    return (

        <Box
            className="purchase-return-search"
            sx={{ mb: 3 }}
        >

            <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search by Return No, Purchase Order, GRN, Supplier, Status, Reason or Total Amount..."
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

export default PurchaseReturnSearch;