import React from "react";
import {
    Paper,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";

import MarketplaceSearch from "./MarketplaceSearch";

const MarketplaceToolbar = ({
    search,
    setSearch,
    status,
    setStatus
}) => {
    return (
        <Paper sx={{ p: 2, mb: 3 }}>
            <Box
                display="flex"
                gap={2}
                flexWrap="wrap"
            >
                <MarketplaceSearch
                    value={search}
                    onChange={setSearch}
                />

                <FormControl
                    size="small"
                    sx={{ minWidth: 160 }}
                >
                    <InputLabel>Status</InputLabel>

                    <Select
                        value={status}
                        label="Status"
                        onChange={(e) =>
                            setStatus(e.target.value)
                        }
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
                    </Select>
                </FormControl>
            </Box>
        </Paper>
    );
};

export default MarketplaceToolbar;