import React from "react";

import {
    Box,
    Button,
    IconButton,
    Tooltip,
    Typography
} from "@mui/material";

import {
    Add,
    Refresh
} from "@mui/icons-material";


/* =========================================================
   COMPONENT
========================================================= */

const ExportJobsToolbar = ({
    onCreate,
    onRefresh,
    loading = false,
    totalCount = 0
}) => {


    /* =====================================================
       CREATE
    ===================================================== */

    const handleCreate = () => {

        if (
            typeof onCreate ===
            "function"
        ) {

            onCreate();

        }

    };


    /* =====================================================
       REFRESH
    ===================================================== */

    const handleRefresh = () => {

        if (
            typeof onRefresh ===
            "function"
        ) {

            onRefresh();

        }

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Box
            sx={{
                width: "100%",
                display: "flex",
                alignItems: {
                    xs: "flex-start",
                    sm: "center"
                },
                justifyContent:
                    "space-between",
                gap: 2,
                mb: 2,
                flexDirection: {
                    xs: "column",
                    sm: "row"
                }
            }}
        >

            {/* =================================================
               TITLE SECTION
            ================================================= */}

            <Box>

                <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{
                        lineHeight: 1.3
                    }}
                >
                    Export Jobs
                </Typography>


                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 0.5
                    }}
                >
                    Manage and monitor
                    export jobs
                </Typography>

            </Box>


            {/* =================================================
               ACTION SECTION
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                }}
            >

                {/* =============================================
                   TOTAL COUNT
                ============================================= */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mr: 1,
                        display: {
                            xs: "none",
                            sm: "block"
                        }
                    }}
                >
                    Total: {totalCount}
                </Typography>


                {/* =============================================
                   REFRESH
                ============================================= */}

                <Tooltip
                    title="Refresh Export Jobs"
                >

                    <span>

                        <IconButton
                            color="primary"
                            onClick={
                                handleRefresh
                            }
                            disabled={
                                loading
                            }
                        >

                            <Refresh />

                        </IconButton>

                    </span>

                </Tooltip>


                {/* =============================================
                   CREATE
                ============================================= */}

                <Button
                    variant="contained"
                    startIcon={
                        <Add />
                    }
                    onClick={
                        handleCreate
                    }
                    disabled={
                        loading
                    }
                >
                    Create Export Job
                </Button>

            </Box>

        </Box>

    );

};


/* =========================================================
   EXPORT
========================================================= */

export default ExportJobsToolbar;