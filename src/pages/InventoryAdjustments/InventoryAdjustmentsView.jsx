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
import EditIcon from "@mui/icons-material/Edit";

const API_URL =
    "http://localhost:5000/api/inventory-adjustments";


const InventoryAdjustmentsView = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const [loading, setLoading] =
        useState(true);

    const [adjustment, setAdjustment] =
        useState(null);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadAdjustment = async () => {

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
                    "View Inventory Adjustment Error:",
                    error
                );

                setError(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Inventory adjustment could not be loaded."
                );

            }
            finally {

                setLoading(false);

            }

        };

        if (id) {
            loadAdjustment();
        }

    }, [id]);


    const getValue = (
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
                    justifyContent: "center",
                    alignItems: "center"
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
                        `No inventory adjustment was returned for ID "${id}".`}
                </Alert>

                <Button
                    sx={{ mt: 2 }}
                    startIcon={<ArrowBackIcon />}
                    onClick={() =>
                        navigate(
                            "/inventory-adjustments"
                        )
                    }
                >
                    Back to Inventory Adjustments
                </Button>

            </Box>

        );

    }


    return (

        <Box sx={{ p: 2 }}>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                    flexWrap: "wrap",
                    gap: 1
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1
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
                        Inventory Adjustment
                    </Typography>

                </Box>


                <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() =>
                        navigate(
                            `/inventory-adjustments/${encodeURIComponent(id)}/edit`
                        )
                    }
                >
                    Edit
                </Button>

            </Box>


            <Card>

                <CardContent>

                    <Typography
                        variant="h6"
                        gutterBottom
                    >
                        Adjustment Information
                    </Typography>

                    <Divider sx={{ mb: 3 }} />


                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid item xs={12} md={4}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Adjustment ID
                            </Typography>

                            <Typography>
                                {getValue(
                                    "inventoryAdjustmentId",
                                    "InventoryAdjustmentId"
                                )}
                            </Typography>
                        </Grid>


                        <Grid item xs={12} md={4}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Seller ID
                            </Typography>

                            <Typography>
                                {getValue(
                                    "sellerId",
                                    "SellerId"
                                )}
                            </Typography>
                        </Grid>


                        <Grid item xs={12} md={4}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Product ID
                            </Typography>

                            <Typography>
                                {getValue(
                                    "productId",
                                    "ProductId"
                                )}
                            </Typography>
                        </Grid>


                        <Grid item xs={12} md={4}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Warehouse Location ID
                            </Typography>

                            <Typography>
                                {getValue(
                                    "warehouseLocationId",
                                    "WarehouseLocationId"
                                )}
                            </Typography>
                        </Grid>


                        <Grid item xs={12} md={4}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Adjustment Type
                            </Typography>

                            <Typography>
                                {getValue(
                                    "adjustmentType",
                                    "AdjustmentType"
                                )}
                            </Typography>
                        </Grid>


                        <Grid item xs={12} md={4}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Status
                            </Typography>

                            <Typography>
                                {getValue(
                                    "status",
                                    "Status"
                                )}
                            </Typography>
                        </Grid>


                        <Grid item xs={12} md={4}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Quantity
                            </Typography>

                            <Typography>
                                {getValue(
                                    "quantity",
                                    "Quantity"
                                )}
                            </Typography>
                        </Grid>


                        <Grid item xs={12} md={4}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Previous Quantity
                            </Typography>

                            <Typography>
                                {getValue(
                                    "previousQuantity",
                                    "PreviousQuantity"
                                )}
                            </Typography>
                        </Grid>


                        <Grid item xs={12} md={4}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                New Quantity
                            </Typography>

                            <Typography>
                                {getValue(
                                    "newQuantity",
                                    "NewQuantity"
                                )}
                            </Typography>
                        </Grid>


                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Reference Number
                            </Typography>

                            <Typography>
                                {getValue(
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
                                Created Date
                            </Typography>

                            <Typography>
                                {getValue(
                                    "createdDate",
                                    "CreatedDate"
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
                                {getValue(
                                    "reason",
                                    "Reason"
                                )}
                            </Typography>
                        </Grid>


                        <Grid item xs={12}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Updated Date
                            </Typography>

                            <Typography>
                                {getValue(
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

export default InventoryAdjustmentsView;
