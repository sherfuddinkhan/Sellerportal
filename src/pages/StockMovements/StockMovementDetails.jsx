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
    Divider,
    Grid,
    Stack,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Edit
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";


const SERVER_URL =
    "http://localhost:5000";


const StockMovementDetails = () => {

    const {
        id
    } = useParams();

    const navigate =
        useNavigate();

    const [movement, setMovement] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadMovement =
            async () => {

                try {

                    setLoading(true);

                    const response =
                        await axios.get(
                            `${SERVER_URL}/api/stock-movements/${Number(id)}`
                        );

                    setMovement(
                        response.data
                    );

                } catch (error) {

                    console.error(
                        "GET STOCK MOVEMENT DETAILS ERROR:",
                        error
                    );

                    setError(
                        error.response?.data?.message ??
                        "Failed to load stock movement"
                    );

                } finally {

                    setLoading(false);

                }

            };


        if (id) {
            loadMovement();
        }

    }, [id]);


    if (loading) {

        return (
            <Box sx={{ p: 3 }}>
                Loading...
            </Box>
        );

    }


    if (error) {

        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    {error}
                </Alert>
            </Box>
        );

    }


    if (!movement) {

        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning">
                    Stock movement not found
                </Alert>
            </Box>
        );

    }


    const getValue =
        (lower, upper) =>
            movement[lower] ??
            movement[upper] ??
            "-";


    return (

        <Box sx={{ p: 2 }}>

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
            >

                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                >

                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() =>
                            navigate(
                                "/stock-movements"
                            )
                        }
                    >
                        Back
                    </Button>

                    <Typography
                        variant="h5"
                        fontWeight={600}
                    >
                        Stock Movement Details
                    </Typography>

                </Stack>


                <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() =>
                        navigate(
                            `/stock-movements/edit/${id}`
                        )
                    }
                >
                    Edit
                </Button>

            </Stack>


            <Card>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ mb: 2 }}
                    >
                        Movement #{id}
                    </Typography>

                    <Divider sx={{ mb: 3 }} />


                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid item xs={12} md={4}>

                            <Typography
                                color="text.secondary"
                            >
                                Stock Movement ID
                            </Typography>

                            <Typography fontWeight={600}>
                                {getValue(
                                    "stockMovementId",
                                    "StockMovementId"
                                )}
                            </Typography>

                        </Grid>


                        <Grid item xs={12} md={4}>

                            <Typography
                                color="text.secondary"
                            >
                                Seller ID
                            </Typography>

                            <Typography fontWeight={600}>
                                {getValue(
                                    "sellerId",
                                    "SellerId"
                                )}
                            </Typography>

                        </Grid>


                        <Grid item xs={12} md={4}>

                            <Typography
                                color="text.secondary"
                            >
                                Customer ID
                            </Typography>

                            <Typography fontWeight={600}>
                                {getValue(
                                    "customerId",
                                    "CustomerId"
                                )}
                            </Typography>

                        </Grid>


                        <Grid item xs={12} md={4}>

                            <Typography
                                color="text.secondary"
                            >
                                Product ID
                            </Typography>

                            <Typography fontWeight={600}>
                                {getValue(
                                    "productId",
                                    "ProductId"
                                )}
                            </Typography>

                        </Grid>


                        <Grid item xs={12} md={4}>

                            <Typography
                                color="text.secondary"
                            >
                                Warehouse ID
                            </Typography>

                            <Typography fontWeight={600}>
                                {getValue(
                                    "warehouseId",
                                    "WarehouseId"
                                )}
                            </Typography>

                        </Grid>


                        <Grid item xs={12} md={4}>

                            <Typography
                                color="text.secondary"
                            >
                                Movement Type
                            </Typography>

                            <Typography fontWeight={600}>
                                {getValue(
                                    "movementType",
                                    "MovementType"
                                )}
                            </Typography>

                        </Grid>


                        <Grid item xs={12} md={4}>

                            <Typography
                                color="text.secondary"
                            >
                                Quantity
                            </Typography>

                            <Typography fontWeight={600}>
                                {getValue(
                                    "quantity",
                                    "Quantity"
                                )}
                            </Typography>

                        </Grid>


                        <Grid item xs={12} md={4}>

                            <Typography
                                color="text.secondary"
                            >
                                Reference
                            </Typography>

                            <Typography fontWeight={600}>
                                {getValue(
                                    "reference",
                                    "Reference"
                                )}
                            </Typography>

                        </Grid>


                        <Grid item xs={12} md={4}>

                            <Typography
                                color="text.secondary"
                            >
                                Movement Date
                            </Typography>

                            <Typography fontWeight={600}>

                                {
                                    getValue(
                                        "movementDate",
                                        "MovementDate"
                                    ) !== "-"
                                        ? new Date(
                                            getValue(
                                                "movementDate",
                                                "MovementDate"
                                            )
                                        ).toLocaleString()
                                        : "-"
                                }

                            </Typography>

                        </Grid>


                        <Grid item xs={12} md={4}>

                            <Typography
                                color="text.secondary"
                            >
                                Created Date
                            </Typography>

                            <Typography fontWeight={600}>

                                {
                                    getValue(
                                        "createdDate",
                                        "CreatedDate"
                                    ) !== "-"
                                        ? new Date(
                                            getValue(
                                                "createdDate",
                                                "CreatedDate"
                                            )
                                        ).toLocaleString()
                                        : "-"
                                }

                            </Typography>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>

        </Box>
    );
};

export default StockMovementDetails;