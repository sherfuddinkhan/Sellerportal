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

const SalesInvoicePagination = ({

    page,

    totalPages,

    pageSize,

    totalRecords,

    onPageChange,

    onPageSizeChange

}) => {

    // =========================================================
    // CALCULATE RECORD RANGE
    // =========================================================

    const startRecord =
        totalRecords === 0
            ? 0
            : (page - 1) * pageSize + 1;

    const endRecord =
        Math.min(
            page * pageSize,
            totalRecords
        );


    return (

        <Box
            sx={{
                mt: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2
            }}
        >

            {/* =====================================================
                RECORD INFORMATION
            ===================================================== */}

            <Box>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Showing {startRecord}–{endRecord} of {totalRecords}
                </Typography>

            </Box>


            {/* =====================================================
                PAGINATION CONTROLS
            ===================================================== */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap"
                }}
            >

                {/* =================================================
                    ROWS PER PAGE
                ================================================= */}

                <FormControl
                    size="small"
                    sx={{
                        minWidth: 110
                    }}
                >

                    <InputLabel>
                        Rows
                    </InputLabel>

                    <Select
                        value={pageSize}
                        label="Rows"
                        onChange={(event) => {

                            onPageSizeChange(
                                Number(event.target.value)
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


                {/* =================================================
                    PAGINATION
                ================================================= */}

                <Pagination
                    color="primary"
                    shape="rounded"
                    page={page}
                    count={totalPages}
                    onChange={(_, value) => {

                        onPageChange(value);

                    }}
                    showFirstButton
                    showLastButton
                />

            </Box>

        </Box>

    );

};

export default SalesInvoicePagination;
