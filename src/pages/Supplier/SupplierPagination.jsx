import React from "react";

import {
    Box,
    Pagination,
    Select,
    MenuItem,
    Typography
} from "@mui/material";

const SupplierPagination = ({
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages,
    totalItems
}) => {

    return (

        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
            flexWrap="wrap"
            gap={2}
        >

            <Typography
                variant="body2"
                color="text.secondary"
            >
                Total Suppliers: {totalItems}
            </Typography>

            <Box
                display="flex"
                alignItems="center"
                gap={2}
            >

                <Typography variant="body2">
                    Rows per page:
                </Typography>

                <Select
                    size="small"
                    value={rowsPerPage}
                    onChange={(e) => {

                        setRowsPerPage(
                            Number(e.target.value)
                        );

                        setPage(1);

                    }}
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

                </Select>

                <Pagination
                    count={totalPages || 1}
                    page={page}
                    onChange={(_, value) =>
                        setPage(value)
                    }
                    color="primary"
                    showFirstButton
                    showLastButton
                />

            </Box>

        </Box>
    );
};

export default SupplierPagination;