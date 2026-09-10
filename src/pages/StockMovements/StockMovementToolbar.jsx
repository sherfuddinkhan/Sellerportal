import React from "react";

import {
    Box,
    Button,
    Stack,
    Typography
} from "@mui/material";

import {
    Add,
    Refresh
} from "@mui/icons-material";

const StockMovementToolbar = ({
    onCreate,
    onRefresh
}) => {

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2
            }}
        >

            <Typography
                variant="h5"
                fontWeight={600}
            >
                Stock Movements
            </Typography>

            <Stack
                direction="row"
                spacing={1}
            >

                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={onRefresh}
                >
                    Refresh
                </Button>

                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={onCreate}
                >
                    Create Stock Movement
                </Button>

            </Stack>

        </Box>
    );
};

export default StockMovementToolbar;