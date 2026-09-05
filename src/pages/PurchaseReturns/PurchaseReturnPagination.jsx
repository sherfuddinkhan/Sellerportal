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


const PurchaseReturnPagination = ({
    page = 1,
    totalPages = 0,
    pageSize = 10,
    totalRecords = 0,
    onPageChange,
    onPageSizeChange
}) => {

    /* =========================================================
       SAFE VALUES
    ========================================================= */

    const safePage =
        Number.isInteger(Number(page)) && Number(page) > 0
            ? Number(page)
            : 1;

    const safeTotalPages =
        Number.isInteger(Number(totalPages)) &&
        Number(totalPages) >= 0
            ? Number(totalPages)
            : 0;

    const safePageSize =
        Number.isInteger(Number(pageSize)) &&
        Number(pageSize) > 0
            ? Number(pageSize)
            : 10;

    const safeTotalRecords =
        Number.isInteger(Number(totalRecords)) &&
        Number(totalRecords) >= 0
            ? Number(totalRecords)
            : 0;


    /* =========================================================
       PAGE CHANGE
    ========================================================= */

    const handlePageChange = (event, value) => {

        if (typeof onPageChange === "function") {
            onPageChange(value);
        }

    };


    /* =========================================================
       PAGE SIZE CHANGE
    ========================================================= */

    const handlePageSizeChange = (event) => {

        const newPageSize =
            Number(event.target.value);

        if (
            typeof onPageSizeChange === "function" &&
            Number.isInteger(newPageSize) &&
            newPageSize > 0
        ) {
            onPageSizeChange(newPageSize);
        }

    };


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <Box
            className="purchase-return-pagination"
            sx={{
                mt: 3,
                px: 1,
                py: 1.5,

                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",

                flexWrap: "wrap",

                gap: 2,

                borderTop: "1px solid",
                borderColor: "divider"
            }}
        >

            {/* =================================================
                TOTAL RECORDS
            ================================================= */}

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    minWidth: 130
                }}
            >
                Total Records:{" "}
                <strong>
                    {safeTotalRecords}
                </strong>
            </Typography>


            {/* =================================================
                PAGE SIZE
            ================================================= */}

            <FormControl
                size="small"
                sx={{
                    minWidth: 110
                }}
            >

                <InputLabel id="purchase-return-rows-label">
                    Rows
                </InputLabel>

                <Select
                    labelId="purchase-return-rows-label"
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
                page={safePage}
                count={Math.max(safeTotalPages, 1)}
                color="primary"
                showFirstButton
                showLastButton
                siblingCount={1}
                boundaryCount={1}
                onChange={handlePageChange}
            />

        </Box>

    );

};


export default PurchaseReturnPagination;