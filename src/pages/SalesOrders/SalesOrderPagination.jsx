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

const SalesOrderPagination = ({

    page,

    totalPages,

    pageSize,

    totalRecords,

    onPageChange,

    onPageSizeChange

}) => {

    return (

        <Box
            className="sales-order-pagination"
            sx={{
                mt: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2
            }}
        >

            <Typography
                variant="body2"
                color="text.secondary"
            >

                Total Records : {totalRecords}

            </Typography>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2
                }}
            >

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
                        onChange={(e) =>
                            onPageSizeChange(
                                Number(e.target.value)
                            )
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

                <Pagination
                    page={page}
                    count={totalPages}
                    color="primary"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                    onChange={(_, value) =>
                        onPageChange(value)
                    }
                />

            </Box>

        </Box>

    );

};

export default SalesOrderPagination;