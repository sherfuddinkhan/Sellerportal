// =========================================================
// ProductImagePagination.jsx
// Product Image Pagination
//
// FRONTEND ONLY
// No apiService
// No fetch
// No Axios
// No server.js calls
//
// ProductImageList.jsx controls:
// - page
// - pageSize
// - totalRecords
// =========================================================

import React from "react";

import {
    Box,
    Pagination,
    FormControl,
    Select,
    MenuItem,
    Typography,
    Stack,
} from "@mui/material";


// =========================================================
// COMPONENT
// =========================================================

const ProductImagePagination = ({
    page,
    totalPages,
    pageSize,
    onPageChange,
    onPageSizeChange,
    totalRecords,
}) => {

    // =====================================================
    // HANDLE PAGE CHANGE
    // =====================================================

    const handlePageChange = (
        event,
        value
    ) => {

        onPageChange(value);

    };


    // =====================================================
    // HANDLE PAGE SIZE CHANGE
    // =====================================================

    const handlePageSizeChange = (
        event
    ) => {

        const newSize =
            Number(event.target.value);

        onPageSizeChange(newSize);

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box
            sx={{
                mt: 3,

                display: "flex",

                justifyContent:
                    "space-between",

                alignItems: "center",

                flexWrap: "wrap",

                gap: 2,
            }}
        >

            {/* =============================================
                TOTAL RECORDS
            ============================================= */}

            <Typography
                variant="body2"
                color="text.secondary"
            >

                Total Records:{" "}

                <b>
                    {totalRecords}
                </b>

            </Typography>


            {/* =============================================
                PAGINATION CONTROLS
            ============================================= */}

            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
            >

                {/* =========================================
                    ROWS PER PAGE LABEL
                ========================================= */}

                <Typography
                    variant="body2"
                >
                    Rows Per Page
                </Typography>


                {/* =========================================
                    PAGE SIZE
                ========================================= */}

                <FormControl
                    size="small"
                    sx={{
                        minWidth: 80,
                    }}
                >

                    <Select

                        value={pageSize}

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


                {/* =========================================
                    PAGINATION
                ========================================= */}

                <Pagination

                    color="primary"

                    page={page}

                    count={Math.max(
                        totalPages,
                        1
                    )}

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


export default ProductImagePagination;
