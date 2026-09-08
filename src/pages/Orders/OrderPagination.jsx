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


const OrderPagination = ({

    page,

    totalPages,

    pageSize,

    totalRecords,

    onPageChange,

    onPageSizeChange

}) => {


    // =========================================================
    // CALCULATE DISPLAY RANGE
    // =========================================================

    const startRecord =
        totalRecords === 0
            ? 0
            : (page - 1) * pageSize + 1;


    const endRecord =
        Math.min(
            page * pageSize,
            totalRecords
        );


    // =========================================================
    // RENDER
    // =========================================================

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
                RECORD COUNT
            ================================================= */}

            <Typography

                variant="body2"

                color="text.secondary"

            >

                Showing{" "}

                <b>
                    {startRecord}
                </b>

                {" - "}

                <b>
                    {endRecord}
                </b>

                {" of "}

                <b>
                    {totalRecords}
                </b>

                {" records"}

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
                    PAGE NAVIGATION
                ============================================= */}

                <Pagination

                    color="primary"

                    page={page}

                    count={totalPages || 1}

                    onChange={(event, value) =>

                        onPageChange(value)

                    }

                    disabled={totalRecords === 0}

                    showFirstButton

                    showLastButton

                />

            </Stack>

        </Box>

    );

};


export default OrderPagination;
