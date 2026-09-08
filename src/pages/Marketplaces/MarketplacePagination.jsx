import React from "react";
import {
    Pagination,
    Box
} from "@mui/material";

const MarketplacePagination = ({
    page,
    count,
    onChange
}) => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            mt={3}
        >
            <Pagination
                page={page}
                count={count}
                onChange={(_, value) =>
                    onChange(value)
                }
                color="primary"
            />
        </Box>
    );
};

export default MarketplacePagination;