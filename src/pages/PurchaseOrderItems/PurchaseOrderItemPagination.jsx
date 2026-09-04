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
PURCHASE ORDER ITEM PAGINATION
========================================================= */

const PurchaseOrderItemPagination = ({
page = 1,
totalPages = 1,
pageSize = 10,
totalRecords = 0,
onPageChange,
onPageSizeChange
}) => {
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

    const newPageSize = Number(event.target.value);

    if (
        Number.isFinite(newPageSize) &&
        newPageSize > 0 &&
        typeof onPageSizeChange === "function"
    ) {
        onPageSizeChange(newPageSize);
    }
};


return (
    <Box
        className="purchase-order-item-pagination"
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
            Total Records : {Number(totalRecords) || 0}
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

            {/* Rows Per Page */}

            <FormControl
                size="small"
                sx={{
                    minWidth: 120
                }}
            >

                <InputLabel>
                    Rows
                </InputLabel>

                <Select
                    value={pageSize}
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


            {/* Pagination */}

            <Pagination
                count={
                    Number(totalPages) > 0
                        ? Number(totalPages)
                        : 1
                }
                page={
                    Number(page) > 0
                        ? Number(page)
                        : 1
                }
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

export default PurchaseOrderItemPagination;
