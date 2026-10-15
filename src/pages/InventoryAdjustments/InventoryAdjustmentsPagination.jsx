import React from "react";

import {
    Box,
    FormControl,
    MenuItem,
    Select,
    Typography
} from "@mui/material";

import Pagination from "@mui/material/Pagination";


const InventoryAdjustmentsPagination = ({
    page,
    totalPages,
    pageSize,
    totalRecords,
    onPageChange,
    onPageSizeChange
}) => {

    return (

        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                mt: 2,
                mb: 2
            }}
        >

            <Typography
                variant="body2"
                color="text.secondary"
            >
                Total Records: {totalRecords}
            </Typography>


            <Pagination
                page={page}
                count={Math.max(
                    totalPages,
                    1
                )}
                onChange={(
                    _event,
                    value
                ) =>
                    onPageChange(value)
                }
                color="primary"
            />


            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                }}
            >

                <Typography
                    variant="body2"
                >
                    Rows:
                </Typography>

                <FormControl
                    size="small"
                >

                    <Select
                        value={pageSize}
                        onChange={(event) =>
                            onPageSizeChange(
                                event.target.value
                            )
                        }
                    >

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

            </Box>

        </Box>

    );

};

export default InventoryAdjustmentsPagination;
