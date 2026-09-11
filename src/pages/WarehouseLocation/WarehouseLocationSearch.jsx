import React from "react";

import {
    Box,
    MenuItem,
    TextField
} from "@mui/material";


const WarehouseLocationSearch = ({
    searchText,
    onSearchChange,
    statusFilter,
    onStatusChange
}) => {

    return (
        <Box
            sx={{
                display: "flex",
                gap: 2,
                mb: 3,
                flexWrap: "wrap",
                alignItems: "center"
            }}
        >

            {/* =========================================
                SEARCH
            ========================================= */}

            <TextField
                label="Search locations"
                placeholder="Enter Seller ID"
                value={searchText}
                onChange={(event) =>
                    onSearchChange(event.target.value)
                }
                size="small"
                sx={{
                    minWidth: 320,
                    flex: 1
                }}
            />


            {/* =========================================
                STATUS FILTER
            ========================================= */}

            <TextField
                select
                label="Status"
                value={statusFilter}
                onChange={(event) =>
                    onStatusChange(event.target.value)
                }
                size="small"
                sx={{
                    minWidth: 180
                }}
            >

                <MenuItem value="all">
                    All
                </MenuItem>

                <MenuItem value="active">
                    Active
                </MenuItem>

                <MenuItem value="inactive">
                    Inactive
                </MenuItem>

            </TextField>

        </Box>
    );
};


export default WarehouseLocationSearch;
