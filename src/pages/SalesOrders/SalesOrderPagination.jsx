import React from "react";

import {
    Box,
    Pagination,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography
} from "@mui/material";


// =========================================================
// SALES ORDER PAGINATION
// =========================================================

const SalesOrderPagination = ({
    page,
    totalPages,
    pageSize,
    totalRecords,
    onPageChange,
    onPageSizeChange
}) => {

    // Make sure Pagination always receives
    // a valid page count.
    const safeTotalPages =
        Math.max(1, Number(totalPages) || 1);

    // Make sure current page is valid.
    const safePage =
        Math.min(
            Math.max(1, Number(page) || 1),
            safeTotalPages
        );

    return (

        <Box
            className="sales-order-pagination"

            sx={{
                mt: 3,

                display: "flex",

                justifyContent:
                    "space-between",

                alignItems: "center",

                flexWrap: "wrap",

                gap: 2
            }}
        >

            {/* =========================================
                TOTAL RECORDS
            ========================================== */}

            <Typography
                variant="body2"
                color="text.secondary"
            >
                Total Records: {totalRecords}
            </Typography>


            {/* =========================================
                PAGE SIZE + PAGINATION
            ========================================== */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap"
                }}
            >

                {/* =====================================
                    ROWS PER PAGE
                ====================================== */}

                <FormControl
                    size="small"
                    sx={{
                        minWidth: 120
                    }}
                >

                    <InputLabel id="sales-order-rows-label">
                        Rows
                    </InputLabel>


                    <Select
                        labelId="sales-order-rows-label"
                        id="sales-order-rows"
                        value={pageSize}
                        label="Rows"

                        onChange={(event) => {

                            const newSize =
                                Number(
                                    event.target.value
                                );

                            onPageSizeChange(
                                newSize
                            );

                        }}
                    >

                        <MenuItem value={5}>
                            5
                        </MenuItem>

                        <MenuItem value={10}>
                            10
                        </MenuItem>

                        <MenuItem value={25}>
                            25
                        </MenuItem>

                        <MenuItem value={50}>
                            50
                        </MenuItem>

                        <MenuItem value={100}>
                            100
                        </MenuItem>

                    </Select>

                </FormControl>


                {/* =====================================
                    PAGINATION
                ====================================== */}

                <Pagination
                    page={safePage}
                    count={safeTotalPages}
                    color="primary"
                    shape="rounded"

                    showFirstButton
                    showLastButton

                    onChange={(_, newPage) => {

                        onPageChange(
                            newPage
                        );

                    }}

                    aria-label="Sales Order pagination"
                />

            </Box>

        </Box>

    );

};


export default SalesOrderPagination;
