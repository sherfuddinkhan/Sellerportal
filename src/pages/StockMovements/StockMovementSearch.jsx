import React from "react";

import {
    IconButton,
    InputAdornment,
    TextField
} from "@mui/material";

import {
    Search,
    Clear
} from "@mui/icons-material";

const StockMovementSearch = ({
    searchText,
    setSearchText,
    onSearch,
    onClear
}) => {

    const handleKeyDown = (event) => {

        if (event.key === "Enter") {
            onSearch();
        }

    };

    return (
        <TextField
            fullWidth
            size="small"
            label="Search Stock Movements"
            placeholder="Search movement type, reference..."
            value={searchText}
            onChange={(event) =>
                setSearchText(event.target.value)
            }
            onKeyDown={handleKeyDown}
            InputProps={{
                endAdornment: (

                    <InputAdornment position="end">

                        {searchText && (

                            <IconButton
                                onClick={onClear}
                                size="small"
                            >
                                <Clear />
                            </IconButton>

                        )}

                        <IconButton
                            onClick={onSearch}
                            color="primary"
                        >
                            <Search />
                        </IconButton>

                    </InputAdornment>

                )
            }}
        />
    );
};

export default StockMovementSearch;