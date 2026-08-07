import React from "react";
import {Box,Pagination,FormControl,Select,MenuItem,Typography,Stack} from "@mui/material";

const CustomerPaymentPagination = ({page,totalPages,pageSize,totalRecords,onPageChange,onPageSizeChange}) => {
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
            <Typography
                variant="body2"
                color="text.secondary"
            >
                Total Records :
                {" "}
                <b>
                    {totalRecords}
                </b>
            </Typography>
            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
            >
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
                        onChange={(e) =>
                            onPageSizeChange(Number(e.target.value)
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
                <Pagination
                    color="primary"
                    page={page}
                    count={ totalPages || 1}
                    onChange={(event, value) =>
                        onPageChange(value)
                    }
                />
            </Stack>
        </Box>
    );
};

export default CustomerPaymentPagination;