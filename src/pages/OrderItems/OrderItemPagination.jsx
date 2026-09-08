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

const OrderItemPagination = ({
    page = 1,
    totalPages = 1,
    pageSize = 10,
    totalRecords = 0,
    onPageChange,
    onPageSizeChange
}) => {
    const handlePageChange = (event, value) => {
        if (onPageChange) {
            onPageChange(value);
        }
    };

    const handlePageSizeChange = (event) => {
        const value = Number(event.target.value);

        if (onPageSizeChange) {
            onPageSizeChange(value);
        }
    };

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
            {/* Total Records */}
            <Typography
                variant="body2"
                color="text.secondary"
            >
                Total Records:{" "}
                <b>{totalRecords}</b>
            </Typography>

            {/* Pagination Controls */}
            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
            >
                <Typography variant="body2">
                    Rows Per Page
                </Typography>

                <FormControl size="small">
                    <Select
                        value={pageSize}
                        onChange={handlePageSizeChange}
                    >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                    </Select>
                </FormControl>

                <Pagination
                    color="primary"
                    page={page}
                    count={Math.max(totalPages, 1)}
                    onChange={handlePageChange}
                />
            </Stack>
        </Box>
    );
};

export default OrderItemPagination;

