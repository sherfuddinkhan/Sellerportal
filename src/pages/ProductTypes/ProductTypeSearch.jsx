import React from "react";

import {
    TextField,
    InputAdornment
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

const ProductTypeSearch = ({
    searchText,
    setSearchText
}) => {

    return (

        <TextField

            fullWidth

            size="small"

            placeholder="Search Product Type..."

            value={searchText}

            onChange={(e) =>
                setSearchText(e.target.value)
            }

            InputProps={{

                startAdornment: (

                    <InputAdornment position="start">

                        <SearchIcon />

                    </InputAdornment>

                )

            }}

        />

    );

};

export default ProductTypeSearch;