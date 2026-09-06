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


/* =========================================================
   ORDER STATUS HISTORY PAGINATION
========================================================= */

const OrderStatusHistoryPagination = ({
    page,
    totalPages,
    pageSize,
    totalRecords,
    onPageChange,
    onPageSizeChange
}) => {

    /* =====================================================
       SAFE VALUES
    ===================================================== */

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
            : 10;

    const safeTotalRecords =
        Number(totalRecords) >= 0
            ? Number(totalRecords)
            : 0;


    /* =====================================================
       PAGE CHANGE
    ===================================================== */

    const handlePageChange = (event, value) => {

        if (typeof onPageChange === "function") {
            onPageChange(value);
        }

    };


    /* =====================================================
       PAGE SIZE CHANGE
    ===================================================== */

    const handlePageSizeChange = (event) => {

        const newPageSize =
            Number(event.target.value);

        if (
            Number.isFinite(newPageSize) &&
            newPageSize > 0 &&
            typeof onPageSizeChange === "function"
        ) {
            onPageSizeChange(newPageSize);
        }

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box
            sx={{
                mt: 3,
                px: 1,
                py: 1,

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

                <Box
                    component="span"
                    sx={{
                        fontWeight: 700,
                        color: "text.primary"
                    }}
                >
                    {safeTotalRecords}
                </Box>
            </Typography>


            {/* =================================================
                PAGINATION CONTROLS
            ================================================= */}

            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                flexWrap="wrap"
            >

                {/* =================================================
                    ROWS PER PAGE LABEL
                ================================================= */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Rows Per Page
                </Typography>


                {/* =================================================
                    PAGE SIZE SELECT
                ================================================= */}

                <FormControl
                    size="small"
                    sx={{
                        minWidth: 80
                    }}
                >

                    <Select
                        value={safePageSize}
                        onChange={handlePageSizeChange}
                    >

                        <MenuItem value={5}>
                            5
                        </MenuItem>

                        <MenuItem value={10}>
                            10
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


                {/* =================================================
                    PAGINATION
                ================================================= */}

                <Pagination
                    color="primary"
                    page={safePage}
                    count={safeTotalPages}
                    onChange={handlePageChange}
                    showFirstButton
                    showLastButton
                />

            </Stack>

        </Box>
    );
};


export default OrderStatusHistoryPagination;
