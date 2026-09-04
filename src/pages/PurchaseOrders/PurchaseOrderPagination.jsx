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
   PURCHASE ORDER PAGINATION
========================================================= */

const PurchaseOrderPagination = ({

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
        Math.max(
            1,
            Number(page) || 1
        );


    const safeTotalPages =
        Math.max(
            1,
            Number(totalPages) || 1
        );


    const safePageSize =
        Number(pageSize) || 10;


    const safeTotalRecords =
        Number(totalRecords) || 0;


    /* =====================================================
       HANDLE PAGE CHANGE
    ===================================================== */

    const handlePageChange = (
        event,
        value
    ) => {

        if (
            typeof onPageChange === "function"
        ) {

            onPageChange(value);

        }

    };


    /* =====================================================
       HANDLE PAGE SIZE CHANGE
    ===================================================== */

    const handlePageSizeChange = (
        event
    ) => {

        const value =
            Number(event.target.value);


        if (
            typeof onPageSizeChange === "function"
        ) {

            onPageSizeChange(value);

        }

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Box

            className="purchase-order-pagination"

            sx={{

                mt: 3,

                px: 1,

                py: 2,

                display: "flex",

                justifyContent:
                    "space-between",

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

                <strong>
                    {safeTotalRecords}
                </strong>

            </Typography>


            {/* =================================================
               PAGINATION CONTROLS
            ================================================= */}

            <Box

                sx={{

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",

                    gap: 2,

                    flexWrap: "wrap"

                }}

            >


                {/* =============================================
                   ROWS PER PAGE
                ============================================= */}

                <FormControl

                    size="small"

                    sx={{

                        minWidth: 110

                    }}

                >

                    <InputLabel id="purchase-order-rows-label">

                        Rows

                    </InputLabel>


                    <Select

                        labelId="purchase-order-rows-label"

                        value={safePageSize}

                        label="Rows"

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

                    page={safePage}

                    count={safeTotalPages}

                    color="primary"

                    shape="rounded"

                    showFirstButton

                    showLastButton

                    onChange={
                        handlePageChange
                    }

                    disabled={
                        safeTotalRecords === 0
                    }

                />

            </Box>

        </Box>

    );

};


export default PurchaseOrderPagination;
