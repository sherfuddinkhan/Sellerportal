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


/* =========================================================
   GOODS RECEIPT NOTE PAGINATION
========================================================= */

const GoodsReceiptNotePagination = ({
    page,
    totalPages,
    pageSize,
    totalRecords,
    onPageChange,
    onPageSizeChange
}) => {

    const safePage = Number(page) > 0
        ? Number(page)
        : 1;

    const safeTotalPages = Number(totalPages) > 0
        ? Number(totalPages)
        : 1;

    const safePageSize = Number(pageSize) > 0
        ? Number(pageSize)
        : 10;

    const safeTotalRecords = Number(totalRecords) >= 0
        ? Number(totalRecords)
        : 0;


    /* =====================================================
       HANDLE PAGE CHANGE
    ===================================================== */

    const handlePageChange = (event, value) => {

        if (typeof onPageChange === "function") {
            onPageChange(value);
        }
    };


    /* =====================================================
       HANDLE PAGE SIZE CHANGE
    ===================================================== */

    const handlePageSizeChange = (event) => {

        const value = Number(event.target.value);

        if (typeof onPageSizeChange === "function") {
            onPageSizeChange(value);
        }
    };


    return (
        <Box
            className="goods-receipt-note-pagination"
            sx={{
                mt: 3,
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
                Total Records: {safeTotalRecords}
            </Typography>


            {/* =================================================
                PAGINATION CONTROLS
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap"
                }}
            >

                {/* =============================================
                    PAGE SIZE
                ============================================= */}

                <FormControl
                    size="small"
                    sx={{
                        minWidth: 120
                    }}
                >

                    <InputLabel id="grn-page-size-label">
                        Rows
                    </InputLabel>


                    <Select
                        labelId="grn-page-size-label"
                        value={safePageSize}
                        label="Rows"
                        onChange={handlePageSizeChange}
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


                {/* =============================================
                    PAGINATION
                ============================================= */}

                <Pagination
                    count={safeTotalPages}
                    page={safePage}
                    color="primary"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                    onChange={handlePageChange}
                />

            </Box>

        </Box>
    );
};


export default GoodsReceiptNotePagination;

