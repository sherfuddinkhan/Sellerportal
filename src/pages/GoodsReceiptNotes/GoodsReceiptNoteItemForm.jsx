import React, {
    useEffect,
    useState
} from "react";

import axios from "axios";

import {
    Box,
    Grid,
    TextField,
    Button,
    Typography,
    Divider,
    Paper,
    Alert,
    MenuItem,
    CircularProgress
} from "@mui/material";

import {
    Save,
    Clear,
    ArrowBack
} from "@mui/icons-material";


/* =========================================================
   API CONFIGURATION
========================================================= */

const SERVER_URL = "http://localhost:5000";


/* =========================================================
   INITIAL FORM STATE
========================================================= */

const initialFormData = {
    GoodsReceiptNoteItemId: null,
    GoodsReceiptNoteId: "",
    ProductId: "",
    ReceivedQuantity: "",
    AcceptedQuantity: "",
    RejectedQuantity: "",
    UnitPrice: "",
    TaxAmount: "",
    TotalAmount: ""
};


/* =========================================================
   GOODS RECEIPT NOTE ITEM FORM
========================================================= */

const GoodsReceiptNoteItemForm = ({
    initialData = null,
    onSubmit,
    onCancel,
    loading = false,
    submitLabel = "Save GRN Item"
}) => {

    const [formData, setFormData] =
        useState(initialFormData);

    const [errors, setErrors] =
        useState({});

    /* ---------------------------------------------------------
       DROPDOWN DATA
    --------------------------------------------------------- */

    const [goodsReceiptNotes, setGoodsReceiptNotes] =
        useState([]);

    const [products, setProducts] =
        useState([]);

    const [dropdownLoading, setDropdownLoading] =
        useState(true);

    const [dropdownError, setDropdownError] =
        useState("");


    /* =========================================================
       LOAD GRNs AND PRODUCTS
    ========================================================= */

    useEffect(() => {

        const loadDropdownData = async () => {

            setDropdownLoading(true);
            setDropdownError("");

            try {

                const [
                    grnResponse,
                    productResponse
                ] = await Promise.all([

                    axios.get(
                        `${SERVER_URL}/api/goods-receipt-notes`
                    ),

                    axios.get(
                        `${SERVER_URL}/api/products`
                    )

                ]);


                /* -------------------------------------------------
                   GRNs
                ------------------------------------------------- */

                const grnData =
                    Array.isArray(grnResponse.data)
                        ? grnResponse.data
                        : Array.isArray(grnResponse.data?.items)
                            ? grnResponse.data.items
                            : [];

                setGoodsReceiptNotes(grnData);


                /* -------------------------------------------------
                   PRODUCTS
                ------------------------------------------------- */

                const productData =
                    Array.isArray(productResponse.data)
                        ? productResponse.data
                        : Array.isArray(productResponse.data?.items)
                            ? productResponse.data.items
                            : [];

                setProducts(productData);


            } catch (error) {

                console.error(
                    "LOAD GRN / PRODUCT DROPDOWNS ERROR:",
                    error
                );

                setDropdownError(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to load GRNs and Products."
                );

                setGoodsReceiptNotes([]);
                setProducts([]);

            } finally {

                setDropdownLoading(false);

            }
        };


        loadDropdownData();

    }, []);


    /* =========================================================
       LOAD INITIAL DATA
    ========================================================= */

    useEffect(() => {

        if (initialData) {

            setFormData({

                GoodsReceiptNoteItemId:
                    initialData.GoodsReceiptNoteItemId ??
                    initialData.goodsReceiptNoteItemId ??
                    null,

                GoodsReceiptNoteId:
                    initialData.GoodsReceiptNoteId ??
                    initialData.goodsReceiptNoteId ??
                    "",

                ProductId:
                    initialData.ProductId ??
                    initialData.productId ??
                    "",

                ReceivedQuantity:
                    initialData.ReceivedQuantity ??
                    initialData.receivedQuantity ??
                    "",

                AcceptedQuantity:
                    initialData.AcceptedQuantity ??
                    initialData.acceptedQuantity ??
                    "",

                RejectedQuantity:
                    initialData.RejectedQuantity ??
                    initialData.rejectedQuantity ??
                    "",

                UnitPrice:
                    initialData.UnitPrice ??
                    initialData.unitPrice ??
                    "",

                TaxAmount:
                    initialData.TaxAmount ??
                    initialData.taxAmount ??
                    "",

                TotalAmount:
                    initialData.TotalAmount ??
                    initialData.totalAmount ??
                    ""

            });

        } else {

            setFormData(initialFormData);

        }

        setErrors({});

    }, [initialData]);


    /* =========================================================
       HANDLE INPUT CHANGE
    ========================================================= */

    const handleChange = (field) => (event) => {

        const value = event.target.value;

        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));

        setErrors((prev) => ({
            ...prev,
            [field]: ""
        }));
    };


    /* =========================================================
       GET GRN ID
    ========================================================= */

    const getGrnId = (grn) => {

        return (
            grn?.GoodsReceiptNoteId ??
            grn?.goodsReceiptNoteId ??
            grn?.GRNId ??
            grn?.grnId ??
            grn?.Id ??
            grn?.id
        );
    };


    /* =========================================================
       GET GRN DISPLAY VALUE
    ========================================================= */

    const getGrnDisplay = (grn) => {

        const id = getGrnId(grn);

        return (
            grn?.GoodsReceiptNoteNumber ??
            grn?.goodsReceiptNoteNumber ??
            grn?.GRNNumber ??
            grn?.grnNumber ??
            grn?.ReceiptNumber ??
            grn?.receiptNumber ??
            `GRN #${id}`
        );
    };


    /* =========================================================
       GET PRODUCT ID
    ========================================================= */

    const getProductId = (product) => {

        return (
            product?.ProductId ??
            product?.productId ??
            product?.Id ??
            product?.id
        );
    };


    /* =========================================================
       GET PRODUCT DISPLAY VALUE
    ========================================================= */

    const getProductDisplay = (product) => {

        const id = getProductId(product);

        return (
            product?.ProductName ??
            product?.productName ??
            product?.Name ??
            product?.name ??
            product?.SKU ??
            product?.sku ??
            `Product #${id}`
        );
    };


    /* =========================================================
       CALCULATE TOTAL AMOUNT
    ========================================================= */

    useEffect(() => {

        const acceptedQuantity =
            Number(formData.AcceptedQuantity) || 0;

        const unitPrice =
            Number(formData.UnitPrice) || 0;

        const taxAmount =
            Number(formData.TaxAmount) || 0;

        const totalAmount =
            acceptedQuantity * unitPrice + taxAmount;

        setFormData((prev) => {

            const currentTotal =
                Number(prev.TotalAmount) || 0;

            if (currentTotal === totalAmount) {
                return prev;
            }

            return {
                ...prev,
                TotalAmount: totalAmount.toFixed(2)
            };

        });

    }, [
        formData.AcceptedQuantity,
        formData.UnitPrice,
        formData.TaxAmount
    ]);


    /* =========================================================
       VALIDATE FORM
    ========================================================= */

    const validate = () => {

        const newErrors = {};


        const receivedQuantity =
            Number(formData.ReceivedQuantity);

        const acceptedQuantity =
            Number(formData.AcceptedQuantity);

        const rejectedQuantity =
            Number(formData.RejectedQuantity);

        const unitPrice =
            Number(formData.UnitPrice);

        const taxAmount =
            Number(formData.TaxAmount);


        /* -----------------------------------------------------
           GRN
        ----------------------------------------------------- */

        if (
            formData.GoodsReceiptNoteId === "" ||
            formData.GoodsReceiptNoteId === null ||
            formData.GoodsReceiptNoteId === undefined
        ) {

            newErrors.GoodsReceiptNoteId =
                "GRN is required.";

        } else if (
            !Number.isInteger(
                Number(formData.GoodsReceiptNoteId)
            ) ||
            Number(formData.GoodsReceiptNoteId) <= 0
        ) {

            newErrors.GoodsReceiptNoteId =
                "Select a valid GRN.";

        }


        /* -----------------------------------------------------
           PRODUCT
        ----------------------------------------------------- */

        if (
            formData.ProductId === "" ||
            formData.ProductId === null ||
            formData.ProductId === undefined
        ) {

            newErrors.ProductId =
                "Product is required.";

        } else if (
            !Number.isInteger(
                Number(formData.ProductId)
            ) ||
            Number(formData.ProductId) <= 0
        ) {

            newErrors.ProductId =
                "Select a valid product.";

        }


        /* -----------------------------------------------------
           RECEIVED QUANTITY
        ----------------------------------------------------- */

        if (
            formData.ReceivedQuantity === "" ||
            formData.ReceivedQuantity === null
        ) {

            newErrors.ReceivedQuantity =
                "Received quantity is required.";

        } else if (
            !Number.isFinite(receivedQuantity) ||
            receivedQuantity <= 0
        ) {

            newErrors.ReceivedQuantity =
                "Received quantity must be greater than 0.";

        }


        /* -----------------------------------------------------
           ACCEPTED QUANTITY
        ----------------------------------------------------- */

        if (
            formData.AcceptedQuantity === "" ||
            formData.AcceptedQuantity === null
        ) {

            newErrors.AcceptedQuantity =
                "Accepted quantity is required.";

        } else if (
            !Number.isFinite(acceptedQuantity) ||
            acceptedQuantity < 0
        ) {

            newErrors.AcceptedQuantity =
                "Accepted quantity cannot be negative.";

        }


        /* -----------------------------------------------------
           REJECTED QUANTITY
        ----------------------------------------------------- */

        if (
            formData.RejectedQuantity === "" ||
            formData.RejectedQuantity === null
        ) {

            newErrors.RejectedQuantity =
                "Rejected quantity is required.";

        } else if (
            !Number.isFinite(rejectedQuantity) ||
            rejectedQuantity < 0
        ) {

            newErrors.RejectedQuantity =
                "Rejected quantity cannot be negative.";

        }


        /* -----------------------------------------------------
           ACCEPTED + REJECTED
        ----------------------------------------------------- */

        if (
            Number.isFinite(acceptedQuantity) &&
            Number.isFinite(rejectedQuantity) &&
            Number.isFinite(receivedQuantity)
        ) {

            if (
                acceptedQuantity + rejectedQuantity >
                receivedQuantity
            ) {

                newErrors.AcceptedQuantity =
                    "Accepted + rejected quantity cannot exceed received quantity.";

                newErrors.RejectedQuantity =
                    "Accepted + rejected quantity cannot exceed received quantity.";

            }

        }


        /* -----------------------------------------------------
           UNIT PRICE
        ----------------------------------------------------- */

        if (
            formData.UnitPrice === "" ||
            formData.UnitPrice === null
        ) {

            newErrors.UnitPrice =
                "Unit price is required.";

        } else if (
            !Number.isFinite(unitPrice) ||
            unitPrice < 0
        ) {

            newErrors.UnitPrice =
                "Unit price cannot be negative.";

        }


        /* -----------------------------------------------------
           TAX
        ----------------------------------------------------- */

        if (
            formData.TaxAmount === "" ||
            formData.TaxAmount === null
        ) {

            newErrors.TaxAmount =
                "Tax amount is required.";

        } else if (
            !Number.isFinite(taxAmount) ||
            taxAmount < 0
        ) {

            newErrors.TaxAmount =
                "Tax amount cannot be negative.";

        }


        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    /* =========================================================
       HANDLE SUBMIT
    ========================================================= */

    const handleSubmit = (event) => {

        event.preventDefault();

        if (!validate()) {
            return;
        }


        const payload = {

            GoodsReceiptNoteItemId:
                formData.GoodsReceiptNoteItemId
                    ? Number(
                        formData.GoodsReceiptNoteItemId
                    )
                    : null,

            GoodsReceiptNoteId:
                Number(
                    formData.GoodsReceiptNoteId
                ),

            ProductId:
                Number(
                    formData.ProductId
                ),

            ReceivedQuantity:
                Number(
                    formData.ReceivedQuantity
                ),

            AcceptedQuantity:
                Number(
                    formData.AcceptedQuantity
                ),

            RejectedQuantity:
                Number(
                    formData.RejectedQuantity
                ),

            UnitPrice:
                Number(
                    formData.UnitPrice
                ),

            TaxAmount:
                Number(
                    formData.TaxAmount
                ),

            TotalAmount:
                Number(
                    formData.TotalAmount
                )

        };


        if (typeof onSubmit === "function") {
            onSubmit(payload);
        }

    };


    /* =========================================================
       RESET FORM
    ========================================================= */

    const handleReset = () => {

        if (initialData) {

            setFormData({

                GoodsReceiptNoteItemId:
                    initialData.GoodsReceiptNoteItemId ??
                    initialData.goodsReceiptNoteItemId ??
                    null,

                GoodsReceiptNoteId:
                    initialData.GoodsReceiptNoteId ??
                    initialData.goodsReceiptNoteId ??
                    "",

                ProductId:
                    initialData.ProductId ??
                    initialData.productId ??
                    "",

                ReceivedQuantity:
                    initialData.ReceivedQuantity ??
                    initialData.receivedQuantity ??
                    "",

                AcceptedQuantity:
                    initialData.AcceptedQuantity ??
                    initialData.acceptedQuantity ??
                    "",

                RejectedQuantity:
                    initialData.RejectedQuantity ??
                    initialData.rejectedQuantity ??
                    "",

                UnitPrice:
                    initialData.UnitPrice ??
                    initialData.unitPrice ??
                    "",

                TaxAmount:
                    initialData.TaxAmount ??
                    initialData.taxAmount ??
                    "",

                TotalAmount:
                    initialData.TotalAmount ??
                    initialData.totalAmount ??
                    ""

            });

        } else {

            setFormData(initialFormData);

        }

        setErrors({});

    };


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <Paper
            elevation={2}
            sx={{
                width: "100%",
                maxWidth: 1000,
                mx: "auto",
                p: {
                    xs: 2,
                    sm: 3,
                    md: 4
                }
            }}
        >

            {/* =================================================
               HEADER
            ================================================= */}

            <Box sx={{ mb: 3 }}>

                <Typography
                    variant="h5"
                    fontWeight={700}
                >
                    {formData.GoodsReceiptNoteItemId
                        ? "Edit GRN Item"
                        : "Create GRN Item"}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                >
                    Enter the goods receipt note item details.
                </Typography>

            </Box>


            <Divider sx={{ mb: 3 }} />


            {/* =================================================
               API ERROR
            ================================================= */}

            {dropdownError && (

                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {dropdownError}
                </Alert>

            )}


            {/* =================================================
               VALIDATION MESSAGE
            ================================================= */}

            {Object.keys(errors).length > 0 && (

                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    Please correct the highlighted fields.
                </Alert>

            )}


            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
            >


                {/* =================================================
                   BASIC INFORMATION
                ================================================= */}

                <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                >
                    Basic Information
                </Typography>


                <Grid
                    container
                    spacing={2}
                    sx={{ mb: 4 }}
                >


                    {/* =================================================
                       GRN DROPDOWN
                    ================================================= */}

                    <Grid item xs={12} md={6}>

                        <TextField
                            fullWidth
                            select
                            label="Goods Receipt Note"
                            value={
                                formData.GoodsReceiptNoteId
                            }
                            onChange={
                                handleChange(
                                    "GoodsReceiptNoteId"
                                )
                            }
                            error={
                                Boolean(
                                    errors.GoodsReceiptNoteId
                                )
                            }
                            helperText={
                                errors.GoodsReceiptNoteId
                            }
                            disabled={
                                loading ||
                                dropdownLoading
                            }
                            required
                            SelectProps={{
                                displayEmpty: true
                            }}
                            InputProps={{
                                endAdornment:
                                    dropdownLoading ? (
                                        <CircularProgress
                                            size={20}
                                            sx={{
                                                mr: 2
                                            }}
                                        />
                                    ) : null
                            }}
                        >

                            <MenuItem value="">
                                <em>
                                    Select Goods Receipt Note
                                </em>
                            </MenuItem>


                            {goodsReceiptNotes.map(
                                (grn) => {

                                    const id =
                                        getGrnId(grn);

                                    if (
                                        id === undefined ||
                                        id === null
                                    ) {
                                        return null;
                                    }

                                    return (

                                        <MenuItem
                                            key={id}
                                            value={id}
                                        >
                                            {getGrnDisplay(grn)}
                                        </MenuItem>

                                    );

                                }
                            )}

                        </TextField>

                    </Grid>


                    {/* =================================================
                       PRODUCT DROPDOWN
                    ================================================= */}

                    <Grid item xs={12} md={6}>

                        <TextField
                            fullWidth
                            select
                            label="Product"
                            value={
                                formData.ProductId
                            }
                            onChange={
                                handleChange(
                                    "ProductId"
                                )
                            }
                            error={
                                Boolean(
                                    errors.ProductId
                                )
                            }
                            helperText={
                                errors.ProductId
                            }
                            disabled={
                                loading ||
                                dropdownLoading
                            }
                            required
                            SelectProps={{
                                displayEmpty: true
                            }}
                            InputProps={{
                                endAdornment:
                                    dropdownLoading ? (
                                        <CircularProgress
                                            size={20}
                                            sx={{
                                                mr: 2
                                            }}
                                        />
                                    ) : null
                            }}
                        >

                            <MenuItem value="">
                                <em>
                                    Select Product
                                </em>
                            </MenuItem>


                            {products.map(
                                (product) => {

                                    const id =
                                        getProductId(
                                            product
                                        );

                                    if (
                                        id === undefined ||
                                        id === null
                                    ) {
                                        return null;
                                    }

                                    return (

                                        <MenuItem
                                            key={id}
                                            value={id}
                                        >
                                            {getProductDisplay(
                                                product
                                            )}
                                        </MenuItem>

                                    );

                                }
                            )}

                        </TextField>

                    </Grid>

                </Grid>


                {/* =================================================
                   QUANTITY INFORMATION
                ================================================= */}

                <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                >
                    Quantity Information
                </Typography>


                <Grid
                    container
                    spacing={2}
                    sx={{ mb: 4 }}
                >

                    <Grid item xs={12} md={4}>

                        <TextField
                            fullWidth
                            label="Received Quantity"
                            type="number"
                            value={
                                formData.ReceivedQuantity
                            }
                            onChange={
                                handleChange(
                                    "ReceivedQuantity"
                                )
                            }
                            error={
                                Boolean(
                                    errors.ReceivedQuantity
                                )
                            }
                            helperText={
                                errors.ReceivedQuantity
                            }
                            disabled={loading}
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                            required
                        />

                    </Grid>


                    <Grid item xs={12} md={4}>

                        <TextField
                            fullWidth
                            label="Accepted Quantity"
                            type="number"
                            value={
                                formData.AcceptedQuantity
                            }
                            onChange={
                                handleChange(
                                    "AcceptedQuantity"
                                )
                            }
                            error={
                                Boolean(
                                    errors.AcceptedQuantity
                                )
                            }
                            helperText={
                                errors.AcceptedQuantity
                            }
                            disabled={loading}
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                            required
                        />

                    </Grid>


                    <Grid item xs={12} md={4}>

                        <TextField
                            fullWidth
                            label="Rejected Quantity"
                            type="number"
                            value={
                                formData.RejectedQuantity
                            }
                            onChange={
                                handleChange(
                                    "RejectedQuantity"
                                )
                            }
                            error={
                                Boolean(
                                    errors.RejectedQuantity
                                )
                            }
                            helperText={
                                errors.RejectedQuantity
                            }
                            disabled={loading}
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                            required
                        />

                    </Grid>

                </Grid>


                {/* =================================================
                   FINANCIAL INFORMATION
                ================================================= */}

                <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                >
                    Financial Information
                </Typography>


                <Grid
                    container
                    spacing={2}
                    sx={{ mb: 4 }}
                >

                    <Grid item xs={12} md={4}>

                        <TextField
                            fullWidth
                            label="Unit Price"
                            type="number"
                            value={
                                formData.UnitPrice
                            }
                            onChange={
                                handleChange(
                                    "UnitPrice"
                                )
                            }
                            error={
                                Boolean(
                                    errors.UnitPrice
                                )
                            }
                            helperText={
                                errors.UnitPrice
                            }
                            disabled={loading}
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                            required
                        />

                    </Grid>


                    <Grid item xs={12} md={4}>

                        <TextField
                            fullWidth
                            label="Tax Amount"
                            type="number"
                            value={
                                formData.TaxAmount
                            }
                            onChange={
                                handleChange(
                                    "TaxAmount"
                                )
                            }
                            error={
                                Boolean(
                                    errors.TaxAmount
                                )
                            }
                            helperText={
                                errors.TaxAmount
                            }
                            disabled={loading}
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                            required
                        />

                    </Grid>


                    <Grid item xs={12} md={4}>

                        <TextField
                            fullWidth
                            label="Total Amount"
                            type="number"
                            value={
                                formData.TotalAmount
                            }
                            disabled
                            InputProps={{
                                readOnly: true
                            }}
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                        />

                    </Grid>

                </Grid>


                {/* =================================================
                   SUMMARY
                ================================================= */}

                <Box
                    sx={{
                        p: 2,
                        mb: 3,
                        borderRadius: 1,
                        bgcolor: "grey.100"
                    }}
                >

                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                    >
                        Calculation
                    </Typography>


                    <Typography
                        variant="body2"
                        sx={{ mt: 0.5 }}
                    >
                        Total Amount = Accepted Quantity ×
                        Unit Price + Tax Amount
                    </Typography>


                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ mt: 1 }}
                    >
                        ₹{" "}
                        {Number(
                            formData.TotalAmount || 0
                        ).toLocaleString(
                            "en-IN",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )}
                    </Typography>

                </Box>


                {/* =================================================
                   ACTIONS
                ================================================= */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap"
                    }}
                >

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>


                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            flexWrap: "wrap"
                        }}
                    >

                        <Button
                            variant="outlined"
                            startIcon={<Clear />}
                            onClick={handleReset}
                            disabled={loading}
                        >
                            Reset
                        </Button>


                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<Save />}
                            disabled={
                                loading ||
                                dropdownLoading
                            }
                        >
                            {loading
                                ? "Saving..."
                                : submitLabel}
                        </Button>

                    </Box>

                </Box>

            </Box>

        </Paper>

    );

};


export default GoodsReceiptNoteItemForm;
