import React from "react";

import {
    Box,
    Button,
    Stack,
    Typography,
    Tooltip
} from "@mui/material";

import {
    Add,
    Refresh
} from "@mui/icons-material";

const PurchaseReturnToolbar = ({
    onAdd,
    onRefresh
}) => {

    return (

        <Box
            className="purchase-return-toolbar"
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                mb: 3,
                gap: 2
            }}
        >

            {/* ==========================================================
                Title
            ========================================================== */}

            <Box>

                <Typography
                    variant="h5"
                    fontWeight="bold"
                >
                    Purchase Returns
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Manage Purchase Returns
                </Typography>

            </Box>

            {/* ==========================================================
                Actions
            ========================================================== */}

            <Stack
                direction="row"
                spacing={2}
            >

                <Tooltip title="Refresh">

                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<Refresh />}
                        onClick={onRefresh}
                    >
                        Refresh
                    </Button>

                </Tooltip>

                <Tooltip title="Add Purchase Return">

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={onAdd}
                    >
                        Add Purchase Return
                    </Button>

                </Tooltip>

            </Stack>

        </Box>

    );

};

export default PurchaseReturnToolbar;