// ============================================================
// GoodsReceiptNoteEdit.jsx
// ============================================================

import React, {
    useCallback,
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
    MenuItem,
    Snackbar,
    Stack,
    TextField,
    Typography
} from "@mui/material";


// ============================================================
// API
// ============================================================

const SERVER_URL = "http://localhost:5000";

const GRN_API =
    `${SERVER_URL}/api/goods-receipt-notes`;


// ============================================================
// GET FIELD
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
            value !== null
        ) {
            return value;
        }
    }

    return null;
};


// ============================================================
// GET VALID ID
// ============================================================

const getValidId = (value) => {

    const numericId =
        Number(value);

    if (
        !Number.isInteger(numericId) ||
        numericId <= 0
    ) {
        return null;
    }

    return numericId;
};


// ============================================================
// INITIAL FORM
// ============================================================

const initialFormData = {
    goodsReceiptNoteId: 0,
    grnNumber: "",
    goodsReceiptNumber: "",
    purchaseOrderId: "",
    supplierId: "",
    sellerId: "",
    customerId: "",
    receiptDate: "",
    status: "Pending",
    totalAmount: "0",
    remarks: ""
};


// ============================================================
// COMPONENT
// ============================================================

const GoodsReceiptNoteEdit = () => {

    const {
        id
    } = useParams();

    const navigate = useNavigate();


    // ========================================================
    // FORM STATE
    // ========================================================

    const [formData, setFormData] =
        useState(initialFormData);


    // ========================================================
    // PAGE STATE
    // ========================================================

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ========================================================
    // NORMALIZE API DATA
    // ========================================================

    const normalizeGoodsReceiptNote = (
        data,
        numericId
    ) => {

        return {

            goodsReceiptNoteId:
                getValidId(
                    getField(
                        data,
                        "goodsReceiptNoteId",
                        "GoodsReceiptNoteId"
                    )
                ) || numericId,

            grnNumber:
                String(
                    getField(
                        data,
                        "grnNumber",
                        "GRNNumber"
                    ) ?? ""
                ),

            goodsReceiptNumber:
                String(
                    getField(
                        data,
                        "goodsReceiptNumber",
                        "GoodsReceiptNumber"
                    ) ?? ""
                ),

            purchaseOrderId:
                getField(
                    data,
                    "purchaseOrderId",
                    "PurchaseOrderId"
                ) ?? "",

            supplierId:
                getField(
                    data,
                    "supplierId",
                    "SupplierId"
                ) ?? "",

            sellerId:
                getField(
                    data,
                    "sellerId",
                    "SellerId"
                ) ?? "",

            customerId:
                getField(
                    data,
                    "customerId",
                    "CustomerId"
                ) ?? "",

            receiptDate:
                getField(
                    data,
                    "receiptDate",
                    "ReceiptDate"
                )
                    ? String(
                        getField(
                            data,
                            "receiptDate",
                            "ReceiptDate"
                        )
                    ).substring(0, 10)
                    : "",

            status:
                String(
                    getField(
                        data,
                        "status",
                        "Status"
                    ) ?? "Pending"
                ),

            totalAmount:
                String(
                    getField(
                        data,
                        "totalAmount",
                        "TotalAmount"
                    ) ?? 0
                ),

            remarks:
                String(
                    getField(
                        data,
                        "remarks",
                        "Remarks"
                    ) ?? ""
                )
        };
    };


    // ========================================================
    // ERROR MESSAGE
    // ========================================================

    const getErrorMessage = (
        err,
        defaultMessage
    ) => {

        const responseData =
            err?.response?.data;

        if (
            typeof responseData === "string" &&
            responseData.trim()
        ) {
            return responseData;
        }

        if (
            responseData?.message
        ) {
            return responseData.message;
        }

        if (
            responseData?.title
        ) {
            return responseData.title;
        }

        if (
            responseData?.errors
        ) {

            const validationErrors =
                responseData.errors;

            const messages = [];

            Object.values(
                validationErrors
            ).forEach((value) => {

                if (Array.isArray(value)) {

                    value.forEach((message) => {

                        if (message) {
                            messages.push(
                                message
                            );
                        }

                    });

                }
            });

            if (messages.length > 0) {
                return messages.join(" ");
            }
        }

        return defaultMessage;
    };


    // ========================================================
    // LOAD GRN
    // ========================================================

    const loadGoodsReceiptNote =
        useCallback(async (
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
                    "GET GOODS RECEIPT NOTE FOR EDIT"
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
                    "GOODS RECEIPT NOTE EDIT RESPONSE:",
                    response.data
                );

                const data =
                    response.data;

                if (
                    !data ||
                    typeof data !== "object"
                ) {

                    throw new Error(
                        "Invalid Goods Receipt Note response."
                    );
                }

                const normalized =
                    normalizeGoodsReceiptNote(
                        data,
                        numericId
                    );

                setFormData(
                    normalized
                );

            } catch (err) {

                console.error(
                    "LOAD GOODS RECEIPT NOTE EDIT ERROR:",
                    err.response?.data ||
                    err.message
                );

                setError(
                    getErrorMessage(
                        err,
                        "Failed to load Goods Receipt Note."
                    )
                );

            } finally {

                setLoading(false);
            }

        }, []);


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        const numericId =
            getValidId(id);

        if (!numericId) {

            setError(
                "Invalid Goods Receipt Note ID."
            );

            setLoading(false);

            return;
        }

        loadGoodsReceiptNote(
            numericId
        );

    }, [
        id,
        loadGoodsReceiptNote
    ]);


    // ========================================================
    // HANDLE FIELD CHANGE
    // ========================================================

    const handleChange = (
        event
    ) => {

        const {
            name,
            value
        } = event.target;

        setFormData(
            (previous) => ({
                ...previous,
                [name]: value
            })
        );
    };


    // ========================================================
    // VALIDATE FORM
    // ========================================================

    const validateForm = () => {

        const purchaseOrderId =
            getValidId(
                formData.purchaseOrderId
            );

        if (!purchaseOrderId) {

            setError(
                "Purchase Order ID is required and must be a valid number."
            );

            return false;
        }


        const supplierId =
            getValidId(
                formData.supplierId
            );

        if (!supplierId) {

            setError(
                "Supplier ID is required and must be a valid number."
            );

            return false;
        }


        const sellerId =
            getValidId(
                formData.sellerId
            );

        if (!sellerId) {

            setError(
                "Seller ID is required and must be a valid number."
            );

            return false;
        }


        const customerId =
            getValidId(
                formData.customerId
            );

        if (!customerId) {

            setError(
                "Customer ID is required and must be a valid number."
            );

            return false;
        }


        const totalAmount =
            Number(
                formData.totalAmount
            );

        if (
            !Number.isFinite(totalAmount) ||
            totalAmount < 0
        ) {

            setError(
                "Total Amount must be a valid number."
            );

            return false;
        }


        return true;
    };


    // ========================================================
    // UPDATE GRN
    // ========================================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        // ----------------------------------------------------
        // VALIDATE ROUTE ID
        // ----------------------------------------------------

        const routeId =
            getValidId(id);

        if (!routeId) {

            setError(
                "Invalid Goods Receipt Note ID."
            );

            return;
        }


        // ----------------------------------------------------
        // VALIDATE FORM
        // ----------------------------------------------------

        if (!validateForm()) {
            return;
        }


        // ----------------------------------------------------
        // START SAVING
        // ----------------------------------------------------

        setSaving(true);


        try {

            const noteId =
                getValidId(
                    formData.goodsReceiptNoteId
                ) || routeId;


            // ------------------------------------------------
            // PAYLOAD
            // ------------------------------------------------

            const payload = {

                goodsReceiptNoteId:
                    noteId,

                grnNumber:
                    formData.grnNumber.trim() ||
                    null,

                goodsReceiptNumber:
                    formData.goodsReceiptNumber.trim() ||
                    null,

                purchaseOrderId:
                    Number(
                        formData.purchaseOrderId
                    ),

                supplierId:
                    Number(
                        formData.supplierId
                    ),

                sellerId:
                    Number(
                        formData.sellerId
                    ),

                customerId:
                    Number(
                        formData.customerId
                    ),

                receiptDate:
                    formData.receiptDate ||
                    null,

                status:
                    formData.status.trim() ||
                    "Pending",

                totalAmount:
                    Number(
                        formData.totalAmount
                    ) || 0,

                remarks:
                    formData.remarks.trim() ||
                    null
            };


            console.log(
                "================================================"
            );

            console.log(
                "UPDATE GOODS RECEIPT NOTE"
            );

            console.log(
                "URL:",
                `${GRN_API}/${noteId}`
            );

            console.log(
                "PAYLOAD:",
                payload
            );

            console.log(
                "================================================"
            );


            // ------------------------------------------------
            // PUT
            // ------------------------------------------------

            const response =
                await axios.put(
                    `${GRN_API}/${noteId}`,
                    payload,
                    {
                        headers: {
                            "Content-Type":
                                "application/json",
                            Accept:
                                "application/json"
                        },
                        timeout: 15000
                    }
                );


            console.log(
                "GOODS RECEIPT NOTE UPDATE RESPONSE:",
                response.data
            );


            // ------------------------------------------------
            // SUCCESS
            // ------------------------------------------------

            setSuccess(
                "Goods Receipt Note updated successfully."
            );


            // ------------------------------------------------
            // GO TO VIEW PAGE
            // ------------------------------------------------

            setTimeout(() => {

                navigate(
                    `/goods-receipt-notes/${noteId}`
                );

            }, 800);

        } catch (err) {

            console.error(
                "UPDATE GOODS RECEIPT NOTE ERROR:",
                err.response?.data ||
                err.message
            );

            setError(
                getErrorMessage(
                    err,
                    "Failed to update Goods Receipt Note."
                )
            );

        } finally {

            setSaving(false);
        }
    };


    // ========================================================
    // CANCEL / BACK
    // ========================================================

    const handleCancel = () => {

        const numericId =
            getValidId(id);

        if (numericId) {

            navigate(
                `/goods-receipt-notes/${numericId}`
            );

            return;
        }

        navigate(
            "/goods-receipt-notes"
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
    // INVALID / LOAD ERROR
    // ========================================================

    if (
        error &&
        !formData.goodsReceiptNoteId
    ) {

        return (
            <Box
                sx={{
                    p: 3,
                    width: "100%"
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
                            {error}
                        </Alert>

                        <Button
                            variant="contained"
                            onClick={
                                handleCancel
                            }
                        >
                            Back to Goods Receipt Notes
                        </Button>

                    </CardContent>

                </Card>

            </Box>
        );
    }


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
                        Edit Goods Receipt Note
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Update Goods Receipt Note #
                        {
                            formData.goodsReceiptNoteId ||
                            id
                        }
                    </Typography>

                </Box>

                <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={saving}
                >
                    Back
                </Button>

            </Stack>


            {/* =================================================
                FORM CARD
            ================================================= */}

            <Card>

                <CardContent
                    sx={{
                        p: 3
                    }}
                >

                    <Box
                        component="form"
                        onSubmit={
                            handleSubmit
                        }
                        noValidate
                    >

                        <Grid
                            container
                            spacing={2.5}
                        >

                            {/* =================================
                                GRN NUMBER
                            ================================= */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="GRN Number"
                                    name="grnNumber"
                                    value={
                                        formData.grnNumber
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    autoComplete="off"
                                />

                            </Grid>
                            {/* =================================
                                PURCHASE ORDER ID
                            ================================= */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Purchase Order ID"
                                    name="purchaseOrderId"
                                    value={
                                        formData.purchaseOrderId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    inputProps={{
                                        min: 1
                                    }}
                                />

                            </Grid>


                            {/* =================================
                                SUPPLIER ID
                            ================================= */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Supplier ID"
                                    name="supplierId"
                                    value={
                                        formData.supplierId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    inputProps={{
                                        min: 1
                                    }}
                                />

                            </Grid>


                            {/* =================================
                                SELLER ID
                            ================================= */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Seller ID"
                                    name="sellerId"
                                    value={
                                        formData.sellerId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    inputProps={{
                                        min: 1
                                    }}
                                />

                            </Grid>


                            {/* =================================
                                CUSTOMER ID
                            ================================= */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Customer ID"
                                    name="customerId"
                                    value={
                                        formData.customerId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    inputProps={{
                                        min: 1
                                    }}
                                />

                            </Grid>


                            {/* =================================
                                RECEIPT DATE
                            ================================= */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Receipt Date"
                                    name="receiptDate"
                                    value={
                                        formData.receiptDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />

                            </Grid>


                            {/* =================================
                                STATUS
                            ================================= */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    select
                                    label="Status"
                                    name="status"
                                    value={
                                        formData.status
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        saving
                                    }
                                >

                                    <MenuItem value="Pending">
                                        Pending
                                    </MenuItem>

                                    <MenuItem value="Received">
                                        Received
                                    </MenuItem>

                                    <MenuItem value="Approved">
                                        Approved
                                    </MenuItem>

                                    <MenuItem value="Rejected">
                                        Rejected
                                    </MenuItem>

                                    <MenuItem value="Cancelled">
                                        Cancelled
                                    </MenuItem>

                                </TextField>

                            </Grid>


                            {/* =================================
                                TOTAL AMOUNT
                            ================================= */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Total Amount"
                                    name="totalAmount"
                                    value={
                                        formData.totalAmount
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    inputProps={{
                                        min: 0,
                                        step: "0.01"
                                    }}
                                />

                            </Grid>


                            {/* =================================
                                REMARKS
                            ================================= */}

                            <Grid
                                item
                                xs={12}
                            >

                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={4}
                                    label="Remarks"
                                    name="remarks"
                                    value={
                                        formData.remarks
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        saving
                                    }
                                />

                            </Grid>

                        </Grid>


                        {/* =====================================
                            DIVIDER
                        ===================================== */}

                        <Divider
                            sx={{
                                my: 3
                            }}
                        />


                        {/* =====================================
                            ACTIONS
                        ===================================== */}

                        <Stack
                            direction={{
                                xs: "column-reverse",
                                sm: "row"
                            }}
                            spacing={2}
                            justifyContent="flex-end"
                        >

                            <Button
                                variant="outlined"
                                onClick={
                                    handleCancel
                                }
                                disabled={
                                    saving
                                }
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={
                                    saving
                                }
                                startIcon={
                                    saving ? (
                                        <CircularProgress
                                            size={18}
                                            color="inherit"
                                        />
                                    ) : null
                                }
                            >
                                {saving
                                    ? "Updating..."
                                    : "Update Goods Receipt Note"}
                            </Button>

                        </Stack>

                    </Box>

                </CardContent>

            </Card>


            {/* =================================================
                ERROR SNACKBAR
            ================================================= */}

            <Snackbar
                open={
                    Boolean(error) &&
                    Boolean(
                        formData.goodsReceiptNoteId
                    )
                }
                autoHideDuration={6000}
                onClose={() =>
                    setError("")
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
            >

                <Alert
                    severity="error"
                    onClose={() =>
                        setError("")
                    }
                    sx={{
                        width: "100%"
                    }}
                >
                    {error}
                </Alert>

            </Snackbar>


            {/* =================================================
                SUCCESS SNACKBAR
            ================================================= */}

            <Snackbar
                open={
                    Boolean(success)
                }
                autoHideDuration={2500}
                onClose={() =>
                    setSuccess("")
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
            >

                <Alert
                    severity="success"
                    onClose={() =>
                        setSuccess("")
                    }
                    sx={{
                        width: "100%"
                    }}
                >
                    {success}
                </Alert>

            </Snackbar>

        </Box>
    );
};


export default GoodsReceiptNoteEdit;

