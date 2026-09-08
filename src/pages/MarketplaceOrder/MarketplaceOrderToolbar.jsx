
import React from "react";

import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography
} from "@mui/material";

import {
    Add,
    Clear,
    ViewModule
} from "@mui/icons-material";

import MarketplaceOrderSearch from "./MarketplaceOrderSearch";

const MarketplaceOrderToolbar = ({
    search = "",
    onSearchChange,
    status = "All",
    onStatusChange,
    onCreate,
    onCardView,
    onClearFilters
}) => {
    const hasFilters =
        search.trim() !== "" ||
        status !== "All";

    return (
        <Box
            sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                backgroundColor: "background.paper"
            }}
        >
            <Stack
                direction={{
                    xs: "column",
                    md: "row"
                }}
                spacing={2}
                alignItems={{
                    xs: "stretch",
                    md: "center"
                }}
                justifyContent="space-between"
            >
                {/* Search and Filter */}
                <Stack
                    direction={{
                        xs: "column",
                        sm: "row"
                    }}
                    spacing={2}
                    alignItems={{
                        xs: "stretch",
                        sm: "center"
                    }}
                    sx={{
                        flex: 1
                    }}
                >
                    <Box
                        sx={{
                            width: {
                                xs: "100%",
                                sm: 320,
                                md: 400
                            }
                        }}
                    >
                        <MarketplaceOrderSearch
                            value={search}
                            onChange={
                                onSearchChange
                            }
                        />
                    </Box>

                    <FormControl
                        size="small"
                        sx={{
                            minWidth: {
                                xs: "100%",
                                sm: 180
                            }
                        }}
                    >
                        <InputLabel>
                            Order Status
                        </InputLabel>

                        <Select
                            value={status}
                            label="Order Status"
                            onChange={(event) => {
                                if (
                                    onStatusChange
                                ) {
                                    onStatusChange(
                                        event.target
                                            .value
                                    );
                                }
                            }}
                        >
                            <MenuItem value="All">
                                All Statuses
                            </MenuItem>

                            <MenuItem value="Pending">
                                Pending
                            </MenuItem>

                            <MenuItem value="Requested">
                                Requested
                            </MenuItem>

                            <MenuItem value="Processing">
                                Processing
                            </MenuItem>

                            <MenuItem value="Shipped">
                                Shipped
                            </MenuItem>

                            <MenuItem value="Delivered">
                                Delivered
                            </MenuItem>

                            <MenuItem value="Cancelled">
                                Cancelled
                            </MenuItem>
                        </Select>
                    </FormControl>

                    {hasFilters && (
                        <Button
                            variant="text"
                            color="inherit"
                            startIcon={<Clear />}
                            onClick={
                                onClearFilters
                            }
                            sx={{
                                whiteSpace: "nowrap"
                            }}
                        >
                            Clear
                        </Button>
                    )}
                </Stack>

                {/* Actions */}
                <Stack
                    direction={{
                        xs: "column",
                        sm: "row"
                    }}
                    spacing={1}
                >
                    {onCardView && (
                        <Button
                            variant="outlined"
                            startIcon={
                                <ViewModule />
                            }
                            onClick={onCardView}
                        >
                            Card View
                        </Button>
                    )}

                    {onCreate && (
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={onCreate}
                        >
                            Create Order
                        </Button>
                    )}
                </Stack>
            </Stack>

            {/* Filter Summary */}
            {hasFilters && (
                <Box sx={{ mt: 1.5 }}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        {search
                            ? `Searching for "${search}"`
                            : "Showing filtered orders"}
                        {status !== "All"
                            ? ` • Status: ${status}`
                            : ""}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default MarketplaceOrderToolbar;

