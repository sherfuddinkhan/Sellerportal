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


const MarketplaceOrderItemPagination = ({
    page,
    totalPages,
    pageSize,
    totalRecords,
    onPageChange,
    onPageSizeChange
}) => {

    const safeTotalPages =
        Math.max(
            Number(totalPages) || 1,
            1
        );

    const safePage =
        Math.min(
            Math.max(
                Number(page) || 1,
                1
            ),
            safeTotalPages
        );


    return (

        <Box
            className="marketplace-order-item-pagination"

            sx={{
                mt: 3,

                px: 1,

                display: "flex",

                justifyContent:
                    "space-between",

                alignItems:
                    "center",

                flexWrap:
                    "wrap",

                gap: 2
            }}
        >

            {/* =====================================================
                TOTAL RECORDS
            ===================================================== */}

            <Typography
                variant="body2"
                color="text.secondary"
            >

                Total Records:{" "}

                <strong>
                    {totalRecords}
                </strong>

            </Typography>


            {/* =====================================================
                PAGE SIZE
            ===================================================== */}

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


            {/* =====================================================
                PAGINATION
            ===================================================== */}

            <Pagination
                page={safePage}

                count={safeTotalPages}

                color="primary"

                showFirstButton

                showLastButton

                disabled={
                    totalRecords === 0
                }

                onChange={(
                    event,
                    value
                ) => {

                    onPageChange(
                        value
                    );

                }}
            />

        </Box>

    );

};


export default MarketplaceOrderItemPagination;
