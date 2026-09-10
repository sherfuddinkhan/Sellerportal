import React from "react";

import {
    Box,
    FormControl,
    MenuItem,
    Select,
    TablePagination
} from "@mui/material";

const StockMovementPagination = ({
    page,
    setPage,
    limit,
    setLimit,
    total
}) => {

    const handlePageChange = (
        event,
        newPage
    ) => {

        setPage(newPage + 1);

    };

    const handleLimitChange = (
        event
    ) => {

        setLimit(
            Number(event.target.value)
        );

        setPage(1);

    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center"
            }}
        >

            <TablePagination
                component="div"
                count={total}
                page={page - 1}
                onPageChange={handlePageChange}
                rowsPerPage={limit}
                onRowsPerPageChange={handleLimitChange}
                rowsPerPageOptions={[
                    5,
                    10,
                    15,
                    25,
                    50
                ]}
            />

        </Box>
    );
};

export default StockMovementPagination;