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
                flexWrap: "wrap"
            }}
        >

            <TextField
                label="Search locations"
                value={searchText}
                onChange={event =>
                    onSearchChange(
                        event.target.value
                    )
                }
                sx={{
                    minWidth: 280
                }}
            />


            <TextField
                select
                label="Status"
                value={statusFilter}
                onChange={event =>
                    onStatusChange(
                        event.target.value
                    )
                }
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