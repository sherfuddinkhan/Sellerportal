import React from "react";

import {
    Box,
    TextField
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";


const InventoryAdjustmentsSearch = ({
    searchText,
    setSearchText
}) => {

    return (

        <Box
            sx={{
                mb: 2
            }}
        >

            <TextField
                fullWidth
                size="small"
                value={searchText}
                onChange={(event) =>
                    setSearchText(
                        event.target.value
                    )
                }
                placeholder={
                    "Search adjustment ID, seller, product, " +
                    "warehouse, type, reason or reference..."
                }
                InputProps={{
                    startAdornment: (
                        <SearchIcon
                            sx={{
                                mr: 1,
                                color: "text.secondary"
                            }}
                        />
                    )
                }}
            />

        </Box>

    );

};

export default InventoryAdjustmentsSearch;
