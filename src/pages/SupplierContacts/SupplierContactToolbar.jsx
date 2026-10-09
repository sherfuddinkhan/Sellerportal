import React from "react";

import {
    Box,
    Typography,
    Button,
    Stack,
    Tooltip,
    useTheme,
    alpha
} from "@mui/material";

import {
    Add,
    Refresh,
    Contacts,
    Download,
    PersonAdd
} from "@mui/icons-material";

/* =========================================================
   SUPPLIER CONTACT TOOLBAR
========================================================= */

const SupplierContactToolbar = ({
    onAdd,
    onRefresh,
    onExport,
    totalContacts = 0,
    activeContacts = 0,
    loading = false,
    title = "Supplier Contacts",
    subtitle = "Manage supplier contact information"
}) => {
    const theme = useTheme();

    /* =====================================================
       EXPORT CONTACTS
    ===================================================== */

    const handleExport = () => {
        if (typeof onExport === "function") {
            onExport();
        }
    };

    /* =====================================================
       REFRESH CONTACTS
    ===================================================== */

    const handleRefresh = () => {
        if (!loading && typeof onRefresh === "function") {
            onRefresh();
        }
    };

    /* =====================================================
       ADD CONTACT
    ===================================================== */

    const handleAdd = () => {
        if (!loading && typeof onAdd === "function") {
            onAdd();
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box
            sx={{
                p: { xs: 2, sm: 3 },
                mb: 3,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                background: theme.palette.background.paper,
                boxShadow: theme.shadows[1]
            }}
        >
            {/* HEADER */}

            <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", md: "center" }}
                spacing={2}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 54,
                            height: 54,
                            flexShrink: 0,
                            borderRadius: 2.5,
                            color: theme.palette.primary.main,
                            bgcolor: alpha(
                                theme.palette.primary.main,
                                0.1
                            )
                        }}
                    >
                        <Contacts sx={{ fontSize: 30 }} />
                    </Box>

                    <Box>
                        <Typography
                            variant="h5"
                            fontWeight={800}
                            sx={{
                                letterSpacing: "-0.4px",
                                overflowWrap: "anywhere"
                            }}
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            {subtitle}
                        </Typography>
                    </Box>
                </Stack>

                {/* ACTION BUTTONS */}

                <Stack
                    direction="row"
                    spacing={1}
                    useFlexGap
                    flexWrap="wrap"
                    justifyContent={{ xs: "flex-start", md: "flex-end" }}
                >
                    <Tooltip title="Refresh supplier contacts">
                        <span>
                            <Button
                                variant="outlined"
                                color="inherit"
                                startIcon={<Refresh />}
                                onClick={handleRefresh}
                                disabled={loading}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 600
                                }}
                            >
                                Refresh
                            </Button>
                        </span>
                    </Tooltip>

                    {typeof onExport === "function" && (
                        <Tooltip title="Export supplier contacts">
                            <Button
                                variant="outlined"
                                startIcon={<Download />}
                                onClick={handleExport}
                                disabled={loading || totalContacts === 0}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 600
                                }}
                            >
                                Export
                            </Button>
                        </Tooltip>
                    )}

                    <Button
                        variant="contained"
                        startIcon={<PersonAdd />}
                        onClick={handleAdd}
                        disabled={loading}
                        sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 700,
                            px: 2.5,
                            boxShadow: "none",
                            "&:hover": {
                                boxShadow: theme.shadows[3]
                            }
                        }}
                    >
                        Add Contact
                    </Button>
                </Stack>
            </Stack>

            {/* SUMMARY */}

            <Stack
                direction="row"
                spacing={1.5}
                useFlexGap
                flexWrap="wrap"
                sx={{ mt: 3 }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        bgcolor: alpha(
                            theme.palette.primary.main,
                            0.08
                        )
                    }}
                >
                    <Contacts
                        fontSize="small"
                        color="primary"
                    />

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Total Contacts
                    </Typography>

                    <Typography
                        variant="body2"
                        fontWeight={800}
                    >
                        {Number(totalContacts) || 0}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        bgcolor: alpha(
                            theme.palette.success.main,
                            0.08
                        )
                    }}
                >
                    <PersonAdd
                        fontSize="small"
                        color="success"
                    />

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Active Contacts
                    </Typography>

                    <Typography
                        variant="body2"
                        fontWeight={800}
                    >
                        {Number(activeContacts) || 0}
                    </Typography>
                </Box>
            </Stack>
        </Box>
    );
};

export default SupplierContactToolbar;

