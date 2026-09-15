// ============================================================
// InvoiceProjectSection.jsx
// Sales Invoice - Project Information Section
// ============================================================

import React from "react";

import {
    Box,
    Typography,
    Grid,
    Divider
} from "@mui/material";

// ============================================================
// COMPONENT
// ============================================================

const InvoiceProjectSection = ({
    invoice = {},
    project = null
}) => {

    // --------------------------------------------------------
    // Resolve project values
    // --------------------------------------------------------

    const projectXID =
        invoice?.ProjectXID ??
        invoice?.projectXID ??
        invoice?.ProjectId ??
        invoice?.projectId ??
        project?.ProjectXID ??
        project?.projectXID ??
        project?.ProjectId ??
        project?.projectId;

    const projectAssetXID =
        invoice?.ProjectAssetXID ??
        invoice?.projectAssetXID ??
        invoice?.ProjectAssetId ??
        invoice?.projectAssetId ??
        project?.ProjectAssetXID ??
        project?.projectAssetXID ??
        project?.ProjectAssetId ??
        project?.projectAssetId;

    const projectName =
        invoice?.ProjectName ??
        invoice?.projectName ??
        project?.ProjectName ??
        project?.projectName ??
        "";

    const projectCode =
        invoice?.ProjectCode ??
        invoice?.projectCode ??
        project?.ProjectCode ??
        project?.projectCode ??
        "";

    const projectAssetName =
        invoice?.ProjectAssetName ??
        invoice?.projectAssetName ??
        project?.ProjectAssetName ??
        project?.projectAssetName ??
        "";

    const projectAssetCode =
        invoice?.ProjectAssetCode ??
        invoice?.projectAssetCode ??
        project?.ProjectAssetCode ??
        project?.projectAssetCode ??
        "";

    const projectDescription =
        invoice?.ProjectDescription ??
        invoice?.projectDescription ??
        project?.ProjectDescription ??
        project?.projectDescription ??
        "";

    // --------------------------------------------------------
    // Do not render empty project section
    // --------------------------------------------------------

    const hasProjectData =
        projectXID !== undefined &&
        projectXID !== null ||
        projectAssetXID !== undefined &&
        projectAssetXID !== null ||
        projectName ||
        projectCode ||
        projectAssetName ||
        projectAssetCode ||
        projectDescription;

    if (!hasProjectData) {
        return null;
    }

    // --------------------------------------------------------
    // Value renderer
    // --------------------------------------------------------

    const displayValue = (value) => {

        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            return "-";
        }

        return value;
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <Box
            sx={{
                mt: 2,
                mb: 2,
                border: "1px solid #000",
                borderRadius: 0,
                pageBreakInside: "avoid"
            }}
        >

            {/* =================================================
                SECTION HEADER
            ================================================= */}

            <Box
                sx={{
                    px: 1.5,
                    py: 0.75,
                    borderBottom: "1px solid #000",
                    backgroundColor: "#f5f5f5"
                }}
            >
                <Typography
                    sx={{
                        fontSize: "13px",
                        fontWeight: 700
                    }}
                >
                    Project Information
                </Typography>
            </Box>

            {/* =================================================
                PROJECT DETAILS
            ================================================= */}

            <Box sx={{ p: 1.5 }}>

                <Grid
                    container
                    spacing={1.5}
                >

                    {/* Project ID */}

                    {(projectXID !== undefined &&
                        projectXID !== null) && (

                        <Grid item xs={12} sm={6} md={3}>

                            <Typography
                                sx={{
                                    fontSize: "10px",
                                    color: "text.secondary",
                                    mb: 0.25
                                }}
                            >
                                Project ID
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "11px",
                                    fontWeight: 600
                                }}
                            >
                                {displayValue(projectXID)}
                            </Typography>

                        </Grid>
                    )}

                    {/* Project Code */}

                    {projectCode && (

                        <Grid item xs={12} sm={6} md={3}>

                            <Typography
                                sx={{
                                    fontSize: "10px",
                                    color: "text.secondary",
                                    mb: 0.25
                                }}
                            >
                                Project Code
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "11px",
                                    fontWeight: 600
                                }}
                            >
                                {displayValue(projectCode)}
                            </Typography>

                        </Grid>
                    )}

                    {/* Project Name */}

                    {projectName && (

                        <Grid item xs={12} sm={6} md={6}>

                            <Typography
                                sx={{
                                    fontSize: "10px",
                                    color: "text.secondary",
                                    mb: 0.25
                                }}
                            >
                                Project Name
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "11px",
                                    fontWeight: 600
                                }}
                            >
                                {displayValue(projectName)}
                            </Typography>

                        </Grid>
                    )}

                    {/* Project Asset ID */}

                    {(projectAssetXID !== undefined &&
                        projectAssetXID !== null) && (

                        <Grid item xs={12} sm={6} md={3}>

                            <Typography
                                sx={{
                                    fontSize: "10px",
                                    color: "text.secondary",
                                    mb: 0.25
                                }}
                            >
                                Project Asset ID
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "11px",
                                    fontWeight: 600
                                }}
                            >
                                {displayValue(projectAssetXID)}
                            </Typography>

                        </Grid>
                    )}

                    {/* Project Asset Code */}

                    {projectAssetCode && (

                        <Grid item xs={12} sm={6} md={3}>

                            <Typography
                                sx={{
                                    fontSize: "10px",
                                    color: "text.secondary",
                                    mb: 0.25
                                }}
                            >
                                Asset Code
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "11px",
                                    fontWeight: 600
                                }}
                            >
                                {displayValue(projectAssetCode)}
                            </Typography>

                        </Grid>
                    )}

                    {/* Project Asset Name */}

                    {projectAssetName && (

                        <Grid item xs={12} sm={6} md={6}>

                            <Typography
                                sx={{
                                    fontSize: "10px",
                                    color: "text.secondary",
                                    mb: 0.25
                                }}
                            >
                                Project Asset
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "11px",
                                    fontWeight: 600
                                }}
                            >
                                {displayValue(projectAssetName)}
                            </Typography>

                        </Grid>
                    )}

                    {/* Description */}

                    {projectDescription && (

                        <Grid item xs={12}>

                            <Divider sx={{ my: 0.5 }} />

                            <Typography
                                sx={{
                                    fontSize: "10px",
                                    color: "text.secondary",
                                    mb: 0.25
                                }}
                            >
                                Project Description
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "11px"
                                }}
                            >
                                {displayValue(projectDescription)}
                            </Typography>

                        </Grid>
                    )}

                </Grid>

            </Box>

        </Box>
    );
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default InvoiceProjectSection;