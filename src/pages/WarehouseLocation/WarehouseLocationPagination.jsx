import React from "react";

import {
    Box,
    MenuItem,
    Pagination,
    TextField,
    Typography
} from "@mui/material";


const WarehouseLocationPagination = ({
    page,
    pageSize,
    totalItems,
    totalPages,
    onPageChange,
    onPageSizeChange
}) => {

    return (
        <Box
            sx={{
                mt: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                flexWrap: "wrap"
            }}
        >

            <Typography
                variant="body2"
                color="text.secondary"
            >
                Total: {totalItems}
            </Typography>


            <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) =>
                    onPageChange(value)
                }
                color="primary"
            />


            <TextField
                select
                size="small"
                label="Page Size"
                value={pageSize}
                onChange={event =>
                    onPageSizeChange(
                        Number(
                            event.target.value
                        )
                    )
                }
                sx={{
                    width: 120
                }}
            >

                {[5, 10, 20, 50, 100]
                    .map(size => (

                        <MenuItem
                            key={size}
                            value={size}
                        >
                            {size}
                        </MenuItem>

                    ))}

            </TextField>

        </Box>
    );
};


export default WarehouseLocationPagination;