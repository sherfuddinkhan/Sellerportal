import React from "react";

import {
Box,
Typography,
Button,
Breadcrumbs,
Link,
Tooltip
} from "@mui/material";

import {
Add,
Refresh,
ArrowBack,
ReceiptLong
} from "@mui/icons-material";

/* =========================================================
INVOICE TAX DETAIL TOOLBAR
========================================================= */

const InvoiceTaxDetailToolbar = ({
title = "Invoice Tax Details",
subtitle = "Manage invoice tax details",
onBack,
onCreate,
onRefresh,
loading = false,
showCreate = false,
showRefresh = true
}) => {
/* =====================================================
   RENDER
===================================================== */

return (
    <Box
        sx={{
            width: "100%",
            mb: 3
        }}
    >

        {/* BREADCRUMBS */}

        <Breadcrumbs
            aria-label="breadcrumb"
            sx={{ mb: 2 }}
        >
            <Link
                component="button"
                underline="hover"
                color="inherit"
                onClick={onBack}
                sx={{
                    cursor: "pointer",
                    fontSize: 14
                }}
            >
                Home
            </Link>

            <Typography
                color="text.primary"
                fontSize={14}
            >
                Invoice Tax Details
            </Typography>
        </Breadcrumbs>

        {/* TOOLBAR */}

        <Box
            display="flex"
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            flexDirection={{ xs: "column", sm: "row" }}
            gap={2}
        >

            {/* TITLE */}

            <Box
                display="flex"
                alignItems="center"
                gap={1.5}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: "primary.light",
                        color: "primary.contrastText"
                    }}
                >
                    <ReceiptLong fontSize="medium" />
                </Box>

                <Box>
                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {subtitle}
                    </Typography>
                </Box>
            </Box>

            {/* ACTIONS */}

            <Box
                display="flex"
                alignItems="center"
                flexWrap="wrap"
                gap={1}
            >

                {/* BACK */}

                {onBack && (
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={onBack}
                    >
                        Back
                    </Button>
                )}

                {/* REFRESH */}

                {showRefresh && (
                    <Tooltip title="Refresh invoice tax details">
                        <span>
                            <Button
                                variant="outlined"
                                startIcon={<Refresh />}
                                onClick={onRefresh}
                                disabled={
                                    loading || !onRefresh
                                }
                            >
                                Refresh
                            </Button>
                        </span>
                    </Tooltip>
                )}

                {/* CREATE */}

                {showCreate && (
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={onCreate}
                        disabled={!onCreate}
                    >
                        Add Tax Detail
                    </Button>
                )}

            </Box>
        </Box>
    </Box>
);
};

export default InvoiceTaxDetailToolbar;
