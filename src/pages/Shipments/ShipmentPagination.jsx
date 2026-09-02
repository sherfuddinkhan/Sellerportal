// =========================================================
// ShipmentPagination.jsx
// Shipment Pagination
// =========================================================

import React from "react";

import {
    Box,
    Pagination,
    FormControl,
    Select,
    MenuItem,
    Typography,
    Stack
} from "@mui/material";

// =========================================================
// COMPONENT
// =========================================================

const ShipmentPagination = ({
    page = 1,
    totalPages = 1,
    pageSize = 15,
    totalRecords = 0,
    onPageChange,
    onPageSizeChange
}) => {

    // ---------------------------------------------------------
    // PAGE CHANGE
    // ---------------------------------------------------------

    const handlePageChange = (
        event,
        value
    ) => {

        if (onPageChange) {
            onPageChange(value);
        }
    };

    // ---------------------------------------------------------
    // PAGE SIZE CHANGE
    // ---------------------------------------------------------

    const handlePageSizeChange = (
        event
    ) => {

        const newPageSize =
            Number(event.target.value);

        if (onPageSizeChange) {
            onPageSizeChange(newPageSize);
        }
    };

    // ---------------------------------------------------------
    // SAFE VALUES
    // ---------------------------------------------------------

    const safePage =
        Number(page) > 0
            ? Number(page)
            : 1;

    const safeTotalPages =
        Number(totalPages) > 0
            ? Number(totalPages)
            : 1;

    const safePageSize =
        Number(pageSize) > 0
            ? Number(pageSize)
            : 15;

    const safeTotalRecords =
        Number(totalRecords) >= 0
            ? Number(totalRecords)
            : 0;

    // ---------------------------------------------------------
    // RETURN
    // ---------------------------------------------------------

    return (

        <Box
            sx={{
                mt: 3,
                px: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2
            }}
        >

            {/* =================================================
                TOTAL RECORDS
            ================================================= */}

            <Typography
                variant="body2"
                color="text.secondary"
            >
                Total Records:{" "}
                <b>
                    {safeTotalRecords}
                </b>
            </Typography>

            {/* =================================================
                PAGINATION CONTROLS
            ================================================= */}

            <Stack
                direction={{
                    xs: "column",
                    sm: "row"
                }}
                spacing={2}
                alignItems={{
                    xs: "flex-start",
                    sm: "center"
                }}
            >

                {/* =================================================
                    ROWS PER PAGE
                ================================================= */}

                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                >

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Rows Per Page
                    </Typography>

                    <FormControl
                        size="small"
                    >

                        <Select
                            value={safePageSize}
                            onChange={
                                handlePageSizeChange
                            }
                        >

                            <MenuItem value={5}>
                                5
                            </MenuItem>

                            <MenuItem value={10}>
                                10
                            </MenuItem>

                            <MenuItem value={15}>
                                15
                            </MenuItem>

                            <MenuItem value={20}>
                                20
                            </MenuItem>

                            <MenuItem value={50}>
                                50
                            </MenuItem>

                            <MenuItem value={100}>
                                100
                            </MenuItem>

                        </Select>

                    </FormControl>

                </Stack>

                {/* =================================================
                    PAGE NAVIGATION
                ================================================= */}

                <Pagination
                    color="primary"
                    page={safePage}
                    count={safeTotalPages}
                    onChange={
                        handlePageChange
                    }
                    showFirstButton
                    showLastButton
                />

            </Stack>

        </Box>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default ShipmentPagination;
