// =========================================================
// SellerPagination.jsx
// =========================================================

import React from "react";

import {
    Box,
    MenuItem,
    Pagination,
    Select,
    Typography,
} from "@mui/material";

const SellerPagination = ({
    page = 1,
    limit = 15,
    totalCount = 0,
    onPageChange,
    onLimitChange,
}) => {

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalCount / limit
            )
        );

    return (

        <Box
            sx={{
                display: "flex",
                flexDirection: {
                    xs: "column",
                    sm: "row",
                },
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                py: 3,
            }}
        >

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
            >

                <Typography>
                    Rows:
                </Typography>

                <Select
                    size="small"
                    value={limit}
                    onChange={(event) =>
                        onLimitChange(
                            Number(
                                event.target.value
                            )
                        )
                    }
                >

                    <MenuItem value={10}>
                        10
                    </MenuItem>

                    <MenuItem value={15}>
                        15
                    </MenuItem>

                    <MenuItem value={25}>
                        25
                    </MenuItem>

                    <MenuItem value={50}>
                        50
                    </MenuItem>

                </Select>

                <Typography
                    color="text.secondary"
                >
                    Total: {totalCount}
                </Typography>

            </Box>


            <Pagination
                count={totalPages}
                page={page}
                onChange={onPageChange}
                color="primary"
                showFirstButton
                showLastButton
            />

        </Box>
    );
};

export default SellerPagination;

