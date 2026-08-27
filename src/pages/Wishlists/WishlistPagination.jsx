// =========================================================
// WishlistPagination.jsx
// =========================================================

import React from "react";

import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    Typography,
} from "@mui/material";

// =========================================================
// COMPONENT
// =========================================================

const WishlistPagination = ({
    page = 1,
    rowsPerPage = 10,
    totalCount = 0,
    onPageChange,
    onRowsPerPageChange,
    rowsPerPageOptions = [5, 10, 25, 50, 100],
}) => {
    // =========================================================
    // TOTAL PAGES
    // =========================================================

    const totalPages = Math.max(
        1,
        Math.ceil(
            Number(totalCount || 0) /
                Number(rowsPerPage || 10)
        )
    );

    // =========================================================
    // PAGE CHANGE
    // =========================================================

    const handlePageChange = (
        event,
        newPage
    ) => {
        if (onPageChange) {
            onPageChange(newPage);
        }
    };

    // =========================================================
    // ROWS PER PAGE
    // =========================================================

    const handleRowsPerPageChange = (
        event
    ) => {
        const newRowsPerPage = Number(
            event.target.value
        );

        if (onRowsPerPageChange) {
            onRowsPerPageChange(
                newRowsPerPage
            );
        }
    };

    // =========================================================
    // DISPLAY RANGE
    // =========================================================

    const startItem =
        totalCount === 0
            ? 0
            : (page - 1) * rowsPerPage + 1;

    const endItem = Math.min(
        page * rowsPerPage,
        totalCount
    );

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent:
                    "space-between",
                gap: 2,
                flexWrap: "wrap",
                py: 1.5,
            }}
        >
            {/* =================================================
                RECORD INFORMATION
               ================================================= */}

            <Typography
                variant="body2"
                color="text.secondary"
            >
                {totalCount > 0
                    ? `Showing ${startItem}-${endItem} of ${totalCount}`
                    : "No records found"}
            </Typography>

            {/* =================================================
                CONTROLS
               ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >
                {/* ROWS PER PAGE */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Rows per page:
                    </Typography>

                    <FormControl
                        size="small"
                        sx={{
                            minWidth: 80,
                        }}
                    >
                        <InputLabel>
                            Rows
                        </InputLabel>

                        <Select
                            value={
                                rowsPerPage
                            }
                            label="Rows"
                            onChange={
                                handleRowsPerPageChange
                            }
                        >
                            {rowsPerPageOptions.map(
                                (option) => (
                                    <MenuItem
                                        key={
                                            option
                                        }
                                        value={
                                            option
                                        }
                                    >
                                        {option}
                                    </MenuItem>
                                )
                            )}
                        </Select>
                    </FormControl>
                </Box>

                {/* PAGINATION */}

                <Pagination
                    count={totalPages}
                    page={Math.min(
                        Math.max(
                            1,
                            page
                        ),
                        totalPages
                    )}
                    onChange={
                        handlePageChange
                    }
                    color="primary"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                    disabled={
                        totalCount === 0
                    }
                />
            </Box>
        </Box>
    );
};

export default WishlistPagination;