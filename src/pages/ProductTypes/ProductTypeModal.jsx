import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    Chip,
    Divider
} from "@mui/material";

const ProductTypeModal = ({
    open,
    onClose,
    productType
}) => {

    if (!productType) return null;

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >

            <DialogTitle>

                Product Type Details

            </DialogTitle>

            <Divider />

            <DialogContent sx={{ mt: 2 }}>

                <Grid container spacing={3}>

                    <Grid item xs={12} md={6}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Product Type ID
                        </Typography>

                        <Typography>

                            {productType.productTypeId}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Product Type Name
                        </Typography>

                        <Typography>

                            {productType.productTypeName}

                        </Typography>

                    </Grid>

                    <Grid item xs={12}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Description
                        </Typography>

                        <Typography>

                            {productType.description || "-"}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Status
                        </Typography>

                        <Chip

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

                    <Grid item xs={12} md={6}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Created Date
                        </Typography>

                        <Typography>

                            {

                                productType.createdDate

                                    ? new Date(
                                        productType.createdDate
                                    ).toLocaleString()

                                    : "-"

                            }

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Updated Date
                        </Typography>

                        <Typography>

                            {

                                productType.updatedDate

                                    ? new Date(
                                        productType.updatedDate
                                    ).toLocaleString()

                                    : "-"

                            }

                        </Typography>

                    </Grid>

                </Grid>

            </DialogContent>

            <DialogActions>

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

export default ProductTypeModal;