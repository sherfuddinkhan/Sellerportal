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


const CustomerAddressPagination = ({
    page,
    totalPages,
    pageSize,
    totalRecords,
    onPageChange,
    onPageSizeChange
}) => {

    const safeTotalPages =
        Math.max(1, totalPages || 1);

    const safePage =
        Math.min(
            Math.max(1, page || 1),
            safeTotalPages
        );


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

            {/* =================================================
                TOTAL RECORDS
            ================================================= */}

            <Typography
                variant="body2"
                color="text.secondary"
            >
                Total Records :{" "}

                <b>
                    {totalRecords}
                </b>

            </Typography>


            {/* =================================================
                PAGINATION CONTROLS
            ================================================= */}

            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
            >

                {/* =============================================
                    ROWS PER PAGE
                ============================================= */}

                <Typography
                    variant="body2"
                >
                    Rows Per Page
                </Typography>


                <FormControl
                    size="small"
                >

                    <Select
                        value={pageSize}
                        onChange={(event) =>
                            onPageSizeChange(
                                Number(
                                    event.target.value
                                )
                            )
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


                {/* =============================================
                    PAGINATION
                ============================================= */}

                <Pagination
                    color="primary"
                    page={safePage}
                    count={safeTotalPages}
                    onChange={(event, value) =>
                        onPageChange(value)
                    }
                    showFirstButton
                    showLastButton
                />

            </Stack>

        </Box>
    );
};


export default CustomerAddressPagination;