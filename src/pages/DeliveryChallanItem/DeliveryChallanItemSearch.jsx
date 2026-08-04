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

const DeliveryChallanItemSearch = ({
    searchText,
    setSearchText
}) => {

    const handleClear = () => {

        setSearchText("");

    };

    return (

        <Box
            className="delivery-challan-item-search"
            sx={{
                mb: 3
            }}
        >

            <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search by Delivery Challan ID, Product ID, Quantity, Unit Price, Discount, Tax Amount, Total Amount or Remarks..."
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

export default DeliveryChallanItemSearch;