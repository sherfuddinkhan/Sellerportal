import React from "react";

import {
    Box,
    Button
} from "@mui/material";

import {
    Add,
    Refresh
} from "@mui/icons-material";

import SupplierSearch from "./SupplierSearch";
import SupplierFilters from "./SupplierFilters";

const SupplierToolbar = ({
    searchText,
    setSearchText,
    sort,
    setSort,
    onCreate,
    onRefresh
}) => {

    return (

        <Box
            display="flex"
            gap={2}
            flexWrap="wrap"
            alignItems="center"
            mb={2}
        >

            <SupplierSearch
                searchText={searchText}
                setSearchText={setSearchText}
            />

            <SupplierFilters
                sort={sort}
                setSort={setSort}
            />

            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={onCreate}
            >
                Add Supplier
            </Button>

            <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={onRefresh}
            >
                Refresh
            </Button>

        </Box>
    );
};

export default SupplierToolbar;