import React, {
    useEffect,
    useState
} from "react";

import axios from "axios";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    Typography
} from "@mui/material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";


const API_URL =
    "http://localhost:5000/api/inventory-adjustments";


const InventoryAdjustmentsDetails = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const [loading, setLoading] =
        useState(true);

    const [adjustment, setAdjustment] =
        useState(null);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadDetails = async () => {

            try {

                setLoading(true);

                const response =
                    await axios.get(
                        `${API_URL}/${encodeURIComponent(id)}`,
                        {
                            timeout: 15000
                        }
                    );

                const data =
                    response.data;

                setAdjustment(
                    data?.data ??
                    data?.result ??
                    data
                );

            }
            catch (error) {

                console.error(
                    "Inventory Adjustment Details Error:",
                    error
                );

                setError(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to load inventory adjustment details."
                );

            }
            finally {

                setLoading(false);

            }

        };

        if (id) {
            loadDetails();
        }

    }, [id]);


    const value = (
        camel,
        pascal
    ) => {

        return (
            adjustment?.[camel] ??
            adjustment?.[pascal] ??
            "-"
        );

    };


    if (loading) {

        return (

            <Box
                sx={{
                    minHeight: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <CircularProgress />
            </Box>

        );

    }


    if (error || !adjustment) {

        return (

            <Box sx={{ p: 3 }}>

                <Alert severity="error">
                    {error ||
                        `No inventory adjustment found for ID "${id}".`}
                </Alert>

            </Box>

        );

    }


    return (

        <Box sx={{ p: 2 }}>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2
                }}
            >

                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() =>
                        navigate(
                            "/inventory-adjustments"
                        )
                    }
                >
                    Back
                </Button>

                <Typography
                    variant="h5"
                    fontWeight={600}
                >
                    Inventory Adjustment Details
                </Typography>

            </Box>


            <Card>

                <CardContent>

                    <Typography
                        variant="h6"
                        gutterBottom
                    >
                        Basic Information
                    </Typography>

                    <Divider sx={{ mb: 3 }} />


                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid item xs={12} md={3}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Adjustment ID
                            </Typography>

                            <Typography fontWeight={600}>
                                {value(
                                    "inventoryAdjustmentId",
                                    "InventoryAdjustmentId"
                                )}
                            </Typography>
                        </Grid>


                        <Grid item xs={12} md={3}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Seller ID
                            </Typography>

                            <Typography fontWeight={600}>
                                {value(
                                    "sellerId",
                                    "SellerId"
                                )}
                            </Typography>
                        </Grid>


                        <Grid item xs={12} md={3}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Product ID
                            </Typography>

                            <Typography fontWeight={600}>
                                {value(
                                    "productId",
                                    "ProductId"
                                )}
                            </Typography>
                        </Grid>


                        <Grid item xs={12} md={3}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Warehouse Location ID
                            </Typography>

                            <Typography fontWeight={600}>
                                {value(
                                    "warehouseLocationId",
                                    "WarehouseLocationId"
                                )}
                            </Typography>
                        </Grid>

                    </Grid>


                    <Divider sx={{ my: 3 }} />


                    <Typography
                        variant="h6"
                        gutterBottom
                    >
                        Quantity Adjustment
                    </Typography>

                    <Divider sx={{ mb: 3 }} />


                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid item xs={12} md={3}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Adjustment Type
                            </Typography>

                            <Typography>
                                {value(
                                    "adjustmentType",
                                    "AdjustmentType"
                                )}
                            </Typography>
                        </Grid>


                        <Grid item xs={12} md={3}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Previous Quantity
                            </Typography>

                            <Typography>
                                {value(
                                    "previousQuantity",
                                    "PreviousQuantity"
                                )}
                            </Typography>
                        </Grid>


                        <Grid item xs={12} md={3}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Adjustment Quantity
                            </Typography>

                            <Typography>
                                {value(
                                    "quantity",
                                    "Quantity"
                                )}
                            </Typography>
                        </Grid>


                        <Grid item xs={12} md={3}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                New Quantity
                            </Typography>

                            <Typography>
                                {value(
                                    "newQuantity",
                                    "NewQuantity"
                                )}
                            </Typography>
                        </Grid>

                    </Grid>


                    <Divider sx={{ my: 3 }} />


                    <Typography
                        variant="h6"
                        gutterBottom
                    >
                        Reference Information
                    </Typography>

                    <Divider sx={{ mb: 3 }} />


                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Reference Number
                            </Typography>

                            <Typography>
                                {value(
                                    "referenceNumber",
                                    "ReferenceNumber"
                                )}
                            </Typography>
                        </Grid>


                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Status
                            </Typography>

                            <Typography>
                                {value(
                                    "status",
                                    "Status"
                                )}
                            </Typography>
                        </Grid>


                        <Grid item xs={12}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Reason
                            </Typography>

                            <Typography>
                                {value(
                                    "reason",
                                    "Reason"
                                )}
                            </Typography>
                        </Grid>

                    </Grid>


                    <Divider sx={{ my: 3 }} />


                    <Typography
                        variant="h6"
                        gutterBottom
                    >
                        Audit Information
                    </Typography>

                    <Divider sx={{ mb: 3 }} />


                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Created Date
                            </Typography>

                            <Typography>
                                {value(
                                    "createdDate",
                                    "CreatedDate"
                                )}
                            </Typography>
                        </Grid>


                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Updated Date
                            </Typography>

                            <Typography>
                                {value(
                                    "updatedDate",
                                    "UpdatedDate"
                                )}
                            </Typography>
                        </Grid>

                    </Grid>

                </CardContent>

            </Card>

        </Box>
    );
};

export default InventoryAdjustmentsDetails;
