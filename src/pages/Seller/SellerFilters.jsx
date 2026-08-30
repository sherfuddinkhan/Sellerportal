// =========================================================
// SellerFilters.jsx
// =========================================================

import React from "react";

import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

const SellerFilters = ({
    statusFilter = "All",
    setStatusFilter,
}) => {

    return (

        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "280px",
                },
                gap: 3,
            }}
        >

            <FormControl
                fullWidth
                size="medium"
            >

                <InputLabel>
                    Status
                </InputLabel>

                <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(event) =>
                        setStatusFilter(
                            event.target.value
                        )
                    }
                    sx={{
                        minHeight: 56,
                    }}
                >

                    <MenuItem value="All">
                        All Sellers
                    </MenuItem>

                    <MenuItem value="Active">
                        Active
                    </MenuItem>

                    <MenuItem value="Inactive">
                        Inactive
                    </MenuItem>

                </Select>

            </FormControl>

        </Box>
    );
};

export default SellerFilters;
