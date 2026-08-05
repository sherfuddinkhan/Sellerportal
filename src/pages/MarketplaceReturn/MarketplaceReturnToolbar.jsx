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

const MarketplaceReturnToolbar = ({
    onAdd,
    onRefresh
}) => {

    return (

        <Box
            className="marketplace-return-toolbar"
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                mb: 3
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

                    Marketplace Returns

                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >

                    Manage Marketplace Returns

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

                <Tooltip title="Add Marketplace Return">

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={onAdd}
                    >

                        Add Marketplace Return

                    </Button>

                </Tooltip>

            </Stack>

        </Box>

    );

};

export default MarketplaceReturnToolbar;