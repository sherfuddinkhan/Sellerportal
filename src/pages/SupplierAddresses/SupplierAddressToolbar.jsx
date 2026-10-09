import React from "react";

import {
    Box,
    Typography,
    Button,
    Stack,
    Chip,
    Tooltip
} from "@mui/material";

import {
    Add,
    Refresh,
    LocationOn
} from "@mui/icons-material";

/* =========================================================
   SUPPLIER ADDRESS TOOLBAR
========================================================= */

const SupplierAddressToolbar = ({
    totalCount = 0,
    onAdd,
    onRefresh,
    loading = false
}) => {

    /* =====================================================
       SAFE COUNT
    ===================================================== */

    const count = Number.isFinite(Number(totalCount))
        ? Number(totalCount)
        : 0;

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={2}
            mb={3}
        >
            {/* =============================================
               TITLE SECTION
            ============================================= */}

            <Box
                display="flex"
                alignItems="center"
                gap={1.5}
            >
                <Box
                    sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "primary.light",
                        color: "primary.dark"
                    }}
                >
                    <LocationOn fontSize="medium" />
                </Box>

                <Box>
                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        Supplier Addresses
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Manage supplier address information
                    </Typography>
                </Box>

                <Chip
                    label={`Total: ${count}`}
                    color="primary"
                    size="small"
                    variant="outlined"
                />
            </Box>

            {/* =============================================
               ACTION BUTTONS
            ============================================= */}

            <Stack
                direction="row"
                spacing={1.5}
                flexWrap="wrap"
                useFlexGap
            >
                {/* REFRESH */}

                <Tooltip title="Refresh supplier addresses">
                    <span>
                        <Button
                            variant="outlined"
                            color="inherit"
                            startIcon={<Refresh />}
                            onClick={onRefresh}
                            disabled={loading}
                        >
                            Refresh
                        </Button>
                    </span>
                </Tooltip>

                {/* ADD SUPPLIER ADDRESS */}

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={onAdd}
                    disabled={loading}
                >
                    Add Address
                </Button>
            </Stack>
        </Box>
    );
};

export default SupplierAddressToolbar;

