import React from "react";

import {
    Box,
    Pagination,
    Typography,
    Select,
    MenuItem
} from "@mui/material";


/* =========================================================
   WISHLIST ITEM PAGINATION
========================================================= */

const WishlistItemPagination = ({
    page = 1,
    totalPages = 1,
    totalItems = 0,

    pageSize = 10,

    onPageChange,
    onPageSizeChange,

    pageSizeOptions = [5, 10, 20, 50]
}) => {


    /* =====================================================
       PAGE CHANGE
    ===================================================== */

    const handlePageChange = (_, value) => {

        if (typeof onPageChange === "function") {
            onPageChange(value);
        }
    };


    /* =====================================================
       PAGE SIZE CHANGE
    ===================================================== */

    const handlePageSizeChange = (event) => {

        if (typeof onPageSizeChange === "function") {
            onPageSizeChange(
                Number(event.target.value)
            );
        }
    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
                mt: 3,
                px: 1
            }}
        >

            {/* =================================================
               TOTAL
            ================================================= */}

            <Typography
                variant="body2"
                color="text.secondary"
            >
                Total Items: <strong>{totalItems}</strong>
            </Typography>


            {/* =================================================
               PAGE SIZE
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                }}
            >

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Rows:
                </Typography>

                <Select
                    size="small"
                    value={pageSize}
                    onChange={handlePageSizeChange}
                >

                    {pageSizeOptions.map((size) => (
                        <MenuItem
                            key={size}
                            value={size}
                        >
                            {size}
                        </MenuItem>
                    ))}

                </Select>

            </Box>


            {/* =================================================
               PAGINATION
            ================================================= */}

            <Pagination
                count={Math.max(totalPages, 1)}
                page={Math.min(
                    Math.max(page, 1),
                    Math.max(totalPages, 1)
                )}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                showFirstButton
                showLastButton
            />

        </Box>
    );
};


export default WishlistItemPagination;