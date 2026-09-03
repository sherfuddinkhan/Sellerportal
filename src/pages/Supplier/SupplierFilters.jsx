import React from "react";

import {
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";

const SupplierFilters = ({
    sort,
    setSort
}) => {

    return (

        <FormControl
            size="small"
            sx={{ minWidth: 180 }}
        >

            <InputLabel>
                Sort By
            </InputLabel>

            <Select
                value={sort}
                label="Sort By"
                onChange={(e) =>
                    setSort(e.target.value)
                }
            >

                <MenuItem value="">
                    Default
                </MenuItem>

                <MenuItem value="name_asc">
                    Name A-Z
                </MenuItem>

                <MenuItem value="name_desc">
                    Name Z-A
                </MenuItem>

                <MenuItem value="id_asc">
                    ID Low-High
                </MenuItem>

                <MenuItem value="id_desc">
                    ID High-Low
                </MenuItem>

            </Select>

        </FormControl>
    );
};

export default SupplierFilters;