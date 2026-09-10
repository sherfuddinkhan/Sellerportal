import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

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
    Stack,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Assessment
} from "@mui/icons-material";


// =========================================================
// SERVER
// =========================================================

const SERVER_URL = "http://localhost:5000";


// =========================================================
// STOCK ADJUSTMENT VIEW
// =========================================================

const StockAdjustmentView = () => {

    const {
        id
    } = useParams();

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [
        stockAdjustment,
        setStockAdjustment
    ] = useState(null);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");


    // =====================================================
    // HEADERS
    // =====================================================

    const getHeaders = () => {

        const token =
            localStorage.getItem("token") ||
            localStorage.getItem("accessToken") ||
            "";

        return {
            Accept: "application/json",

            ...(token
                ? {
                    Authorization:
                        `Bearer ${token}`
                }
                : {})
        };
    };


    // =====================================================
    // LOAD STOCK ADJUSTMENT
    // =====================================================

    useEffect(() => {

        const loadStockAdjustment = async () => {

            try {

                setLoading(true);
                setError("");

                const numericId = Number(id);

                console.log(
                    "================================================"
                );

                console.log(
                    "STOCK ADJUSTMENT VIEW"
                );

                console.log(
                    "URL PARAM ID:",
                    id
                );

                console.log(
                    "NUMERIC ID:",
                    numericId
                );


                // ==========================================
                // Validate ID
                // ==========================================

                if (
                    !Number.isInteger(numericId) ||
                    numericId <= 0
                ) {

                    setError(
                        "Invalid stock adjustment ID."
                    );

                    return;
                }


                // ==========================================
                // IMPORTANT
                // React -> Node
                //
                // Node route:
                // /api/stock-adjustments/:id
                // ==========================================

                const requestUrl =
                    `${SERVER_URL}/api/stock-adjustments/${numericId}`;


                console.log(
                    "REQUEST URL:",
                    requestUrl
                );


                const response =
                    await axios.get(
                        requestUrl,
                        {
                            headers:
                                getHeaders()
                        }
                    );


                console.log(
                    "RESPONSE STATUS:",
                    response.status
                );

                console.log(
                    "RESPONSE DATA:",
                    response.data
                );


                if (!response.data) {

                    setError(
                        "Stock adjustment not found."
                    );

                    return;
                }


                setStockAdjustment(
                    response.data
                );

            } catch (err) {

                console.error(
                    "LOAD STOCK ADJUSTMENT ERROR:",
                    err
                );


                console.error(
                    "STATUS:",
                    err.response?.status
                );


                console.error(
                    "DATA:",
                    err.response?.data
                );


                if (
                    err.response?.status === 404
                ) {

                    setError(
                        "Stock adjustment not found."
                    );

                } else {

                    setError(
                        err.response?.data?.message ||
                        "Failed to load stock adjustment."
                    );
                }

            } finally {

                setLoading(false);
            }
        };


        if (id) {

            loadStockAdjustment();

        } else {

            setError(
                "Stock adjustment ID is missing."
            );

            setLoading(false);
        }

    }, [id]);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 300
                }}
            >

                <CircularProgress />

            </Box>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (
            <Box sx={{ p: 3 }}>

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>


                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate(
                            "/stock-adjustments"
                        )
                    }
                >
                    Back to Stock Adjustments
                </Button>

            </Box>
        );
    }


    // =====================================================
    // NO DATA
    // =====================================================

    if (!stockAdjustment) {

        return (
            <Box sx={{ p: 3 }}>

                <Alert severity="warning">
                    Stock adjustment not found.
                </Alert>

            </Box>
        );
    }


    // =====================================================
    // DATA
    // =====================================================

    const {
        stockAdjustmentId,
        sellerId,
        customerId,
        productId,
        warehouseId,
        adjustmentType,
        quantity,
        adjustmentDate,
        remarks
    } = stockAdjustment;


    // =====================================================
    // FIELD HELPER
    // =====================================================

    const Field = ({
        label,
        value
    }) => {

        return (
            <Grid
                size={{
                    xs: 12,
                    sm: 6,
                    md: 4
                }}
            >

                <Typography
                    variant="caption"
                    color="text.secondary"
                >
                    {label}
                </Typography>

                <Typography
                    variant="body1"
                    fontWeight={500}
                    sx={{
                        mt: 0.5
                    }}
                >
                    {value !== null &&
                    value !== undefined &&
                    value !== ""
                        ? String(value)
                        : "-"}
                </Typography>

            </Grid>
        );
    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formattedDate =
        adjustmentDate
            ? new Date(
                adjustmentDate
            ).toLocaleString()
            : "-";


    // =====================================================
    // VIEW
    // =====================================================

    return (
        <Box sx={{ p: 3 }}>


            {/* =================================================
                HEADER
            ================================================= */}

            <Stack
                direction={{
                    xs: "column",
                    sm: "row"
                }}
                justifyContent="space-between"
                alignItems={{
                    xs: "flex-start",
                    sm: "center"
                }}
                spacing={2}
                sx={{ mb: 3 }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight={600}
                    >
                        Stock Adjustment
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Adjustment ID:{" "}
                        {stockAdjustmentId}
                    </Typography>

                </Box>


                <Stack
                    direction="row"
                    spacing={1}
                >

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() =>
                            navigate(
                                "/stock-adjustments"
                            )
                        }
                    >
                        Back
                    </Button>


                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() =>
                            navigate(
                                `/stock-adjustments/edit/${stockAdjustmentId}`
                            )
                        }
                    >
                        Edit
                    </Button>

                </Stack>

            </Stack>


            {/* =================================================
                DETAILS
            ================================================= */}

            <Card>

                <CardContent>

                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ mb: 2 }}
                    >

                        <Assessment />

                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >
                            Adjustment Details
                        </Typography>

                    </Stack>


                    <Divider sx={{ mb: 3 }} />


                    <Grid
                        container
                        spacing={3}
                    >

                        <Field
                            label="Stock Adjustment ID"
                            value={stockAdjustmentId}
                        />

                        <Field
                            label="Seller ID"
                            value={sellerId}
                        />

                        <Field
                            label="Customer ID"
                            value={customerId}
                        />

                        <Field
                            label="Product ID"
                            value={productId}
                        />

                        <Field
                            label="Warehouse ID"
                            value={warehouseId}
                        />

                        <Field
                            label="Adjustment Type"
                            value={adjustmentType}
                        />

                        <Field
                            label="Quantity"
                            value={quantity}
                        />

                        <Field
                            label="Adjustment Date"
                            value={formattedDate}
                        />

                        <Field
                            label="Remarks"
                            value={remarks}
                        />

                    </Grid>

                </CardContent>

            </Card>

        </Box>
    );
};


export default StockAdjustmentView;
