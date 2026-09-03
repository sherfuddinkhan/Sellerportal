import React from "react";

import {
    TextField,
    InputAdornment,
    IconButton
} from "@mui/material";

import {
    Search,
    Clear
} from "@mui/icons-material";

const SupplierSearch = ({
    searchText,
    setSearchText
}) => {

    return (

        <TextField
            size="small"
            label="Search Suppliers"
            value={searchText}
            onChange={(e) =>
                setSearchText(e.target.value)
            }
            sx={{
                minWidth: 280
            }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Search />
                    </InputAdornment>
                ),

                endAdornment: searchText && (
                    <InputAdornment position="end">

                        <IconButton
                            size="small"
                            onClick={() =>
                                setSearchText("")
                            }
                        >
                            <Clear />
                        </IconButton>

                    </InputAdornment>
                )
            }}
        />
    );
};

export default SupplierSearch;