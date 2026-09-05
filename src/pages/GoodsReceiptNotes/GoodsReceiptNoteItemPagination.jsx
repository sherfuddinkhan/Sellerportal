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
   GOODS RECEIPT NOTE ITEM PAGINATION
========================================================= */

const GoodsReceiptNoteItemPagination = ({
    page = 1,
    totalPages = 1,
    pageSize = 10,
    totalRecords = 0,
    onPageChange,
    onPageSizeChange
}) => {

    /* =========================================================
       SAFE VALUES
    ========================================================= */

    const safePage = Math.max(1, Number(page) || 1);

    const safeTotalPages = Math.max(
        1,
        Number(totalPages) || 1
    );

    const safePageSize = Number(pageSize) || 10;

    const safeTotalRecords = Math.max(
        0,
        Number(totalRecords) || 0
    );


    /* =========================================================
       PAGE CHANGE
    ========================================================= */

    const handlePageChange = (event, value) => {

        if (typeof onPageChange !== "function") {
            return;
        }

        onPageChange(value);
    };


    /* =========================================================
       PAGE SIZE CHANGE
    ========================================================= */

    const handlePageSizeChange = (event) => {

        if (typeof onPageSizeChange !== "function") {
            return;
        }

        const newPageSize = Number(event.target.value);

        if (!Number.isFinite(newPageSize) || newPageSize <= 0) {
            return;
        }

        onPageSizeChange(newPageSize);
    };


    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <Box
            className="goods-receipt-note-item-pagination"
            sx={{
                mt: 3,
                px: 1,
                py: 2,

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

                {/* =================================================
                    PAGE SIZE
                ================================================= */}

                <FormControl
                    size="small"
                    sx={{
                        minWidth: 120
                    }}
                >
                    <InputLabel id="goods-receipt-note-item-rows-label">
                        Rows
                    </InputLabel>

                    <Select
                        labelId="goods-receipt-note-item-rows-label"
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


                {/* =================================================
                    PAGINATION
                ================================================= */}

                <Pagination
                    count={safeTotalPages}
                    page={Math.min(
                        safePage,
                        safeTotalPages
                    )}
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


export default GoodsReceiptNoteItemPagination;

