import React from "react";
import {
    Box,
    Grid,
    Typography,
    Chip,
    Divider,
    Paper
} from "@mui/material";

const BrandView = ({ brand }) => {

    if (!brand) return null;

    return (

        <Paper
            elevation={2}
            sx={{
                p: 3,
                borderRadius: 3
            }}
        >

            <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
            >
                Brand Information
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>

                <Grid item xs={12} md={6}>

                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                    >
                        Brand Name
                    </Typography>

                    <Typography variant="h6">
                        {brand.brandName}
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
                            brand.isActive
                                ? "Active"
                                : "Inactive"
                        }
                        color={
                            brand.isActive
                                ? "success"
                                : "error"
                        }
                    />

                </Grid>

                <Grid item xs={12}>

                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                    >
                        Description
                    </Typography>

                    <Typography>
                        {brand.description || "-"}
                    </Typography>

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
                            brand.createdDate
                                ? new Date(
                                      brand.createdDate
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
                            brand.updatedDate
                                ? new Date(
                                      brand.updatedDate
                                  ).toLocaleString()
                                : "-"
                        }

                    </Typography>

                </Grid>

            </Grid>

        </Paper>

    );

};

export default BrandView;