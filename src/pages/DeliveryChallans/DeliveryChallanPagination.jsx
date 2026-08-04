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

const DeliveryChallanPagination = ({
    page,
    totalPages,
    pageSize,
    totalRecords,
    onPageChange,
    onPageSizeChange
}) => {

    return (

        <Box
            className="delivery-challan-pagination"
            sx={{
                mt: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2
            }}
        >

            {/* ==========================================================
                Total Records
            ========================================================== */}

            <Typography
                variant="body2"
                color="text.secondary"
            >
                Total Records: <strong>{totalRecords}</strong>
            </Typography>

            {/* ==========================================================
                Page Size
            ========================================================== */}

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
                        onPageSizeChange(Number(e.target.value))
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

            {/* ==========================================================
                Pagination
            ========================================================== */}

            <Pagination
                color="primary"
                page={page}
                count={Math.max(totalPages, 1)}
                onChange={(event, value) =>
                    onPageChange(value)
                }
                showFirstButton
                showLastButton
            />

        </Box>

    );

};

export default DeliveryChallanPagination;