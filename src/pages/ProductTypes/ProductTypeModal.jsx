// =========================================================
// ProductTypeModal.jsx
// Product Type Details Modal
//
// Frontend-only component.
// Data comes from ProductTypeList.
// No axios / apiService required.
// =========================================================

import React from "react";

import {
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    Typography,
} from "@mui/material";


// =========================================================
// PRODUCT TYPE MODAL
// =========================================================

const ProductTypeModal = ({
    open = false,
    onClose,
    productType = null,
}) => {

    // =====================================================
    // NO PRODUCT TYPE
    // =====================================================

    if (!productType) {
        return null;
    }


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (dateValue) => {

        if (!dateValue) {
            return "-";
        }

        const date =
            new Date(dateValue);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "-";
        }

        return date.toLocaleString();

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Dialog

            open={open}

            onClose={onClose}

            maxWidth="md"

            fullWidth

        >

            {/* =============================================
                TITLE
            ============================================= */}

            <DialogTitle
                sx={{
                    fontWeight: "bold",
                }}
            >

                Product Type Details

            </DialogTitle>


            <Divider />


            {/* =============================================
                CONTENT
            ============================================= */}

            <DialogContent
                sx={{
                    mt: 1,
                }}
            >

                <Grid
                    container
                    spacing={3}
                >

                    {/* =====================================
                        PRODUCT TYPE ID
                    ===================================== */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >

                            Product Type ID

                        </Typography>

                        <Typography
                            variant="body1"
                            fontWeight="600"
                        >

                            {
                                productType.productTypeId ??
                                "-"
                            }

                        </Typography>

                    </Grid>


                    {/* =====================================
                        PRODUCT TYPE NAME
                    ===================================== */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >

                            Product Type Name

                        </Typography>

                        <Typography
                            variant="body1"
                            fontWeight="600"
                        >

                            {
                                productType.productTypeName ||
                                "-"
                            }

                        </Typography>

                    </Grid>


                    {/* =====================================
                        DESCRIPTION
                    ===================================== */}

                    <Grid
                        item
                        xs={12}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >

                            Description

                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                            }}
                        >

                            {
                                productType.description ||
                                "-"
                            }

                        </Typography>

                    </Grid>


                    {/* =====================================
                        STATUS
                    ===================================== */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{
                                mb: 1,
                            }}
                        >

                            Status

                        </Typography>

                        <Chip

                            size="small"

                            label={
                                productType.isActive
                                    ? "Active"
                                    : "Inactive"
                            }

                            color={
                                productType.isActive
                                    ? "success"
                                    : "error"
                            }

                        />

                    </Grid>


                    {/* =====================================
                        CREATED DATE
                    ===================================== */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >

                            Created Date

                        </Typography>

                        <Typography>

                            {
                                formatDate(
                                    productType.createdDate
                                )
                            }

                        </Typography>

                    </Grid>


                    {/* =====================================
                        UPDATED DATE
                    ===================================== */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >

                            Updated Date

                        </Typography>

                        <Typography>

                            {
                                formatDate(
                                    productType.updatedDate
                                )
                            }

                        </Typography>

                    </Grid>

                </Grid>

            </DialogContent>


            {/* =============================================
                ACTIONS
            ============================================= */}

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2,
                }}
            >

                <Button

                    variant="contained"

                    onClick={onClose}

                >

                    Close

                </Button>

            </DialogActions>

        </Dialog>

    );

};


// =========================================================
// EXPORT
// =========================================================

export default ProductTypeModal;
