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

const DeliveryChallanSearch = ({
    searchText,
    setSearchText
}) => {

    const handleClear = () => {

        setSearchText("");

    };

    return (

        <Box
            className="delivery-challan-search"
            sx={{
                mb: 3
            }}
        >

            <TextField
                fullWidth
                placeholder="Search by Challan No, Vehicle No, Driver, Transporter, Status..."
                value={searchText}
                onChange={(e) =>
                    setSearchText(e.target.value)
                }
                variant="outlined"
                size="small"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search color="action" />
                        </InputAdornment>
                    ),
                    endAdornment: searchText && (
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

export default DeliveryChallanSearch;