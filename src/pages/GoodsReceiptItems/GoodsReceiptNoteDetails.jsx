// ============================================================
// GoodsReceiptNoteDetails.jsx
// ============================================================

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
    Snackbar,
    Stack,
    Typography
} from "@mui/material";

// ============================================================
// API
// ============================================================

const SERVER_URL = "http://localhost:5000";

const GRN_API =
    `${SERVER_URL}/api/goods-receipt-notes`;

// ============================================================
// COMPONENT
// ============================================================

const GoodsReceiptNoteDetails = () => {

    const {
        id
    } = useParams();

    const navigate = useNavigate();

    // ========================================================
    // STATE
    // ========================================================

    const [goodsReceiptNote, setGoodsReceiptNote] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    // ========================================================
    // LOAD DETAILS
    // ========================================================

    useEffect(() => {

        if (!id || id === ":id") {

            setError(
                "Invalid Goods Receipt Note ID."
            );

            setLoading(false);

            return;
        }

        loadGoodsReceiptNote();

    }, [id]);

    // ========================================================
    // GET GRN
    // ========================================================

    const loadGoodsReceiptNote = async () => {

        setLoading(true);
        setError("");

        try {

            console.log(
                "GET GOODS RECEIPT NOTE:",
                `${GRN_API}/${id}`
            );

            const response = await axios.get(
                `${GRN_API}/${id}`
            );

            console.log(
                "GOODS RECEIPT NOTE DETAILS RESPONSE:",
                response.data
            );

            setGoodsReceiptNote(
                response.data
            );

        } catch (err) {

            console.error(
                "GET GOODS RECEIPT NOTE DETAILS ERROR:",
                err.response?.data || err.message
            );

            const responseData =
                err.response?.data;

            if (
                typeof responseData === "string"
            ) {
                setError(responseData);
            }
            else if (
                responseData?.message
            ) {
                setError(responseData.message);
            }
            else if (
                responseData?.title
            ) {
                setError(responseData.title);
            }
            else if (
                err.response?.status === 404
            ) {
                setError(
                    "Goods Receipt Note not found."
                );
            }
            else {
                setError(
                    "Failed to load Goods Receipt Note."
                );
            }

        } finally {

            setLoading(false);
        }
    };

    // ========================================================
    // HELPERS
    // ========================================================

    const getValue = (
        camelCase,
        pascalCase,
        fallback = "-"
    ) => {

        const value =
            goodsReceiptNote?.[camelCase] ??
            goodsReceiptNote?.[pascalCase];

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return fallback;
        }

        return value;
    };

    const formatDate = (
        camelCase,
        pascalCase
    ) => {

        const value =
            goodsReceiptNote?.[camelCase] ??
            goodsReceiptNote?.[pascalCase];

        if (!value) {
            return "-";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return value;
        }

        return date.toLocaleString();
    };

    const formatAmount = (
        camelCase,
        pascalCase
    ) => {

        const value =
            goodsReceiptNote?.[camelCase] ??
            goodsReceiptNote?.[pascalCase];

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "0.00";
        }

        const number =
            Number(value);

        if (Number.isNaN(number)) {
            return value;
        }

        return number.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
    };

    // ========================================================
    // NAVIGATION
    // ========================================================

    const handleBack = () => {

        navigate(
            "/goods-receipt-notes"
        );
    };

    const handleEdit = () => {

        const noteId =
            goodsReceiptNote?.goodsReceiptNoteId ??
            goodsReceiptNote?.GoodsReceiptNoteId ??
            id;

        navigate(
            `/goods-receipt-notes/edit/${noteId}`
        );
    };

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (
            <Box
                sx={{
                    minHeight: "400px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >

                <Stack
                    spacing={2}
                    alignItems="center"
                >

                    <CircularProgress />

                    <Typography
                        color="text.secondary"
                    >
                        Loading Goods Receipt Note...
                    </Typography>

                </Stack>

            </Box>
        );
    }

    // ========================================================
    // ERROR / NOT FOUND
    // ========================================================

    if (
        !goodsReceiptNote
    ) {

        return (
            <Box
                sx={{
                    p: 3
                }}
            >

                <Alert
                    severity="error"
                    sx={{
                        mb: 2
                    }}
                >
                    {error ||
                        "Goods Receipt Note not found."}
                </Alert>

                <Button
                    variant="contained"
                    onClick={handleBack}
                >
                    Back to Goods Receipt Notes
                </Button>

            </Box>
        );
    }

    // ========================================================
    // VALUES
    // ========================================================

    const noteId =
        getValue(
            "goodsReceiptNoteId",
            "GoodsReceiptNoteId"
        );

    const grnNumber =
        getValue(
            "grnNumber",
            "GRNNumber"
        );

    const goodsReceiptNumber =
        getValue(
            "goodsReceiptNumber",
            "GoodsReceiptNumber"
        );

    const purchaseOrderId =
        getValue(
            "purchaseOrderId",
            "PurchaseOrderId"
        );

    const supplierId =
        getValue(
            "supplierId",
            "SupplierId"
        );

    const sellerId =
        getValue(
            "sellerId",
            "SellerId"
        );

    const customerId =
        getValue(
            "customerId",
            "CustomerId"
        );

    const status =
        getValue(
            "status",
            "Status"
        );

    const remarks =
        getValue(
            "remarks",
            "Remarks"
        );

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <Box
            sx={{
                p: 3,
                width: "100%"
            }}
        >

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
                sx={{
                    mb: 3
                }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight={600}
                    >
                        Goods Receipt Note Details
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        View Goods Receipt Note information
                    </Typography>

                </Box>

                <Stack
                    direction="row"
                    spacing={1}
                >

                    <Button
                        variant="outlined"
                        onClick={handleBack}
                    >
                        Back
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleEdit}
                    >
                        Edit
                    </Button>

                </Stack>

            </Stack>


            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <Card
                sx={{
                    mb: 3
                }}
            >

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                            mb: 2
                        }}
                    >
                        Basic Information
                    </Typography>

                    <Divider
                        sx={{
                            mb: 3
                        }}
                    />

                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                GRN ID
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={500}
                            >
                                {noteId}
                            </Typography>

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                GRN Number
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={500}
                            >
                                {grnNumber}
                            </Typography>

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Goods Receipt Number
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={500}
                            >
                                {goodsReceiptNumber}
                            </Typography>

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Status
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={600}
                                sx={{
                                    textTransform: "capitalize"
                                }}
                            >
                                {status}
                            </Typography>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>


            {/* =================================================
                REFERENCE INFORMATION
            ================================================= */}

            <Card
                sx={{
                    mb: 3
                }}
            >

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                            mb: 2
                        }}
                    >
                        Reference Information
                    </Typography>

                    <Divider
                        sx={{
                            mb: 3
                        }}
                    />

                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Purchase Order ID
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={500}
                            >
                                {purchaseOrderId}
                            </Typography>

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Supplier ID
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={500}
                            >
                                {supplierId}
                            </Typography>

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Seller ID
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={500}
                            >
                                {sellerId}
                            </Typography>

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Customer ID
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={500}
                            >
                                {customerId}
                            </Typography>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>


            {/* =================================================
                AMOUNT
            ================================================= */}

            <Card
                sx={{
                    mb: 3
                }}
            >

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                            mb: 2
                        }}
                    >
                        Amount
                    </Typography>

                    <Divider
                        sx={{
                            mb: 3
                        }}
                    />

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Total Amount
                    </Typography>

                    <Typography
                        variant="h5"
                        fontWeight={600}
                    >
                        ₹ {formatAmount(
                            "totalAmount",
                            "TotalAmount"
                        )}
                    </Typography>

                </CardContent>

            </Card>


            {/* =================================================
                REMARKS
            ================================================= */}

            <Card>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                            mb: 2
                        }}
                    >
                        Remarks
                    </Typography>

                    <Divider
                        sx={{
                            mb: 3
                        }}
                    />

                    <Typography
                        variant="body1"
                        sx={{
                            whiteSpace: "pre-wrap"
                        }}
                    >
                        {remarks}
                    </Typography>

                </CardContent>

            </Card>


            {/* =================================================
                ERROR SNACKBAR
            ================================================= */}

            <Snackbar
                open={Boolean(error)}
                autoHideDuration={6000}
                onClose={() => setError("")}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
            >

                <Alert
                    severity="error"
                    onClose={() => setError("")}
                    sx={{
                        width: "100%"
                    }}
                >
                    {error}
                </Alert>

            </Snackbar>

        </Box>
    );
};

export default GoodsReceiptNoteDetails;

