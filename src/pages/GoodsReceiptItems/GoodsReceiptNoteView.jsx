// ============================================================
// GoodsReceiptNoteView.jsx
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
    Chip,
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
// FORMAT CURRENCY
// ============================================================

const formatCurrency = (value) => {

    const amount = Number(value);

    if (!Number.isFinite(amount)) {
        return "₹ 0.00";
    }

    return `₹ ${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};


// ============================================================
// FORMAT DATE
// ============================================================

const formatDate = (value) => {

    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
};


// ============================================================
// STATUS COLOR
// ============================================================

const getStatusColor = (status) => {

    const value =
        String(status || "").toLowerCase();

    if (
        value === "completed" ||
        value === "received" ||
        value === "approved"
    ) {
        return "success";
    }

    if (
        value === "pending" ||
        value === "processing"
    ) {
        return "warning";
    }

    if (
        value === "cancelled" ||
        value === "rejected"
    ) {
        return "error";
    }

    return "default";
};


// ============================================================
// FIELD VALUE HELPER
// Supports camelCase + PascalCase
// ============================================================

const getField = (
    data,
    ...fieldNames
) => {

    if (!data) {
        return null;
    }

    for (const fieldName of fieldNames) {

        const value =
            data[fieldName];

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            return value;
        }
    }

    return null;
};


// ============================================================
// DETAIL FIELD
// ============================================================

const DetailField = ({
    label,
    value,
    children
}) => {

    return (
        <Box>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    mb: 0.5
                }}
            >
                {label}
            </Typography>

            {children || (
                <Typography
                    variant="body1"
                    fontWeight={500}
                >
                    {value ?? "-"}
                </Typography>
            )}

        </Box>
    );
};


// ============================================================
// COMPONENT
// ============================================================

const GoodsReceiptNoteView = () => {

    const {
        id
    } = useParams();

    const navigate = useNavigate();


    // ========================================================
    // STATE
    // ========================================================

    const [note, setNote] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ========================================================
    // LOAD GRN
    // ========================================================

    useEffect(() => {

        if (
            !id ||
            id === ":id"
        ) {

            setError(
                "Invalid Goods Receipt Note ID."
            );

            setLoading(false);

            return;
        }

        const numericId =
            Number(id);

        if (
            !Number.isInteger(numericId) ||
            numericId <= 0
        ) {

            setError(
                "Invalid Goods Receipt Note ID."
            );

            setLoading(false);

            return;
        }

        loadGoodsReceiptNote(
            numericId
        );

    }, [id]);


    // ========================================================
    // GET GRN
    // ========================================================

    const loadGoodsReceiptNote = async (
        numericId
    ) => {

        setLoading(true);
        setError("");

        try {

            const url =
                `${GRN_API}/${numericId}`;

            console.log(
                "================================================"
            );

            console.log(
                "GET GOODS RECEIPT NOTE VIEW"
            );

            console.log(
                "URL:",
                url
            );

            console.log(
                "GRN ID:",
                numericId
            );

            console.log(
                "================================================"
            );

            const response =
                await axios.get(
                    url,
                    {
                        headers: {
                            Accept:
                                "application/json"
                        },
                        timeout: 15000
                    }
                );

            console.log(
                "GOODS RECEIPT NOTE VIEW RESPONSE:",
                response.data
            );

            const data =
                response.data;

            if (
                !data ||
                typeof data !== "object"
            ) {

                setError(
                    "Invalid Goods Receipt Note response."
                );

                return;
            }

            setNote(data);

        } catch (err) {

            console.error(
                "LOAD GOODS RECEIPT NOTE VIEW ERROR:",
                err.response?.data ||
                err.message
            );

            const responseData =
                err.response?.data;

            if (
                err.response?.status === 404
            ) {

                setError(
                    "Goods Receipt Note not found."
                );

            }
            else if (
                typeof responseData === "string"
            ) {

                setError(
                    responseData
                );

            }
            else if (
                responseData?.message
            ) {

                setError(
                    responseData.message
                );

            }
            else if (
                responseData?.title
            ) {

                setError(
                    responseData.title
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
    // BACK
    // ========================================================

    const handleBack = () => {

        navigate(
            "/goods-receipt-notes"
        );
    };


    // ========================================================
    // EDIT
    // ========================================================

    const handleEdit = () => {

        const noteId =
            getField(
                note,
                "goodsReceiptNoteId",
                "GoodsReceiptNoteId"
            ) || Number(id);

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
                    width: "100%",
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
    // ERROR
    // ========================================================

    if (
        error ||
        !note
    ) {

        return (
            <Box
                sx={{
                    p: 3
                }}
            >

                <Card>

                    <CardContent>

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

                    </CardContent>

                </Card>

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
    }


    // ========================================================
    // NORMALIZE DATA
    // ========================================================

    const goodsReceiptNoteId =
        getField(
            note,
            "goodsReceiptNoteId",
            "GoodsReceiptNoteId"
        );

    const grnNumber =
        getField(
            note,
            "grnNumber",
            "GRNNumber"
        );

    const goodsReceiptNumber =
        getField(
            note,
            "goodsReceiptNumber",
            "GoodsReceiptNumber"
        );

    const purchaseOrderId =
        getField(
            note,
            "purchaseOrderId",
            "PurchaseOrderId"
        );

    const supplierId =
        getField(
            note,
            "supplierId",
            "SupplierId"
        );

    const sellerId =
        getField(
            note,
            "sellerId",
            "SellerId"
        );

    const customerId =
        getField(
            note,
            "customerId",
            "CustomerId"
        );

    const receiptDate =
        getField(
            note,
            "receiptDate",
            "ReceiptDate"
        );

    const status =
        getField(
            note,
            "status",
            "Status"
        );

    const totalAmount =
        getField(
            note,
            "totalAmount",
            "TotalAmount"
        );

    const remarks =
        getField(
            note,
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
                        Goods Receipt Note
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        View Goods Receipt Note #
                        {goodsReceiptNoteId || id}
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
                MAIN CARD
            ================================================= */}

            <Card>

                <CardContent>

                    {/* =========================================
                        BASIC INFORMATION
                    ========================================= */}

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                            mb: 2
                        }}
                    >
                        Basic Information
                    </Typography>

                    <Grid
                        container
                        spacing={3}
                    >

                        {/* GRN ID */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <DetailField
                                label="GRN ID"
                                value={
                                    goodsReceiptNoteId
                                }
                            />

                        </Grid>


                        {/* GRN NUMBER */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <DetailField
                                label="GRN Number"
                                value={
                                    grnNumber
                                }
                            />

                        </Grid>


                        {/* GOODS RECEIPT NUMBER */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <DetailField
                                label="Goods Receipt Number"
                                value={
                                    goodsReceiptNumber
                                }
                            />

                        </Grid>


                        {/* PURCHASE ORDER */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <DetailField
                                label="Purchase Order ID"
                                value={
                                    purchaseOrderId
                                }
                            />

                        </Grid>


                        {/* SUPPLIER */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <DetailField
                                label="Supplier ID"
                                value={
                                    supplierId
                                }
                            />

                        </Grid>


                        {/* SELLER */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <DetailField
                                label="Seller ID"
                                value={
                                    sellerId
                                }
                            />

                        </Grid>


                        {/* CUSTOMER */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <DetailField
                                label="Customer ID"
                                value={
                                    customerId
                                }
                            />

                        </Grid>


                        {/* RECEIPT DATE */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <DetailField
                                label="Receipt Date"
                                value={
                                    formatDate(
                                        receiptDate
                                    )
                                }
                            />

                        </Grid>


                        {/* STATUS */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <DetailField
                                label="Status"
                            >

                                <Chip
                                    label={
                                        status ||
                                        "Unknown"
                                    }
                                    color={
                                        getStatusColor(
                                            status
                                        )
                                    }
                                    size="small"
                                    variant="outlined"
                                />

                            </DetailField>

                        </Grid>


                        {/* TOTAL AMOUNT */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <DetailField
                                label="Total Amount"
                            >

                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                >
                                    {formatCurrency(
                                        totalAmount
                                    )}
                                </Typography>

                            </DetailField>

                        </Grid>

                    </Grid>


                    {/* =================================================
                        REMARKS
                    ================================================= */}

                    <Divider
                        sx={{
                            my: 3
                        }}
                    />

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                            mb: 2
                        }}
                    >
                        Remarks
                    </Typography>

                    <Box
                        sx={{
                            p: 2,
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 1,
                            backgroundColor:
                                "background.default"
                        }}
                    >

                        <Typography
                            variant="body1"
                            sx={{
                                whiteSpace: "pre-wrap"
                            }}
                        >
                            {remarks ||
                                "No remarks"}
                        </Typography>

                    </Box>

                </CardContent>

            </Card>


            {/* =================================================
                FOOTER
            ================================================= */}

            <Stack
                direction="row"
                justifyContent="flex-end"
                spacing={2}
                sx={{
                    mt: 3
                }}
            >

                <Button
                    variant="outlined"
                    onClick={handleBack}
                >
                    Back to List
                </Button>

                <Button
                    variant="contained"
                    onClick={handleEdit}
                >
                    Edit Goods Receipt Note
                </Button>

            </Stack>

        </Box>
    );
};


export default GoodsReceiptNoteView;

