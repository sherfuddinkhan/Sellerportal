// ============================================================
// DeliveryChallanItemEdit.jsx
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
    TextField,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Save,
    LocalShipping,
    Inventory2,
    Numbers,
    CurrencyRupee,
    Discount,
    Receipt,
    Notes
} from "@mui/icons-material";


// ============================================================
// CONFIG
// ============================================================

const SERVER_URL = "http://localhost:5000";


// ============================================================
// COMPONENT
// ============================================================

const DeliveryChallanItemEdit = () => {

    const navigate = useNavigate();

    const { id } = useParams();


    // ========================================================
    // STATE
    // ========================================================

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    const [formData, setFormData] = useState({

        deliveryChallanId: "",

        productId: "",

        quantity: "",

        unitPrice: "",

        discount: "",

        taxAmount: "",

        totalAmount: "",

        remarks: ""

    });


    // ========================================================
    // LOAD ITEM
    // ========================================================

    useEffect(() => {

        const loadItem = async () => {

            const itemId = Number(id);


            if (!id || !Number.isInteger(itemId) || itemId <= 0) {

                setError(
                    "Invalid Delivery Challan Item ID."
                );

                setLoading(false);

                return;
            }


            try {

                setLoading(true);

                setError("");


                console.log(
                    "================================================"
                );

                console.log(
                    "GET DELIVERY CHALLAN ITEM FOR EDIT"
                );

                console.log(
                    "ITEM ID:",
                    itemId
                );

                console.log(
                    "URL:",
                    `${SERVER_URL}/api/delivery-challan-items/${itemId}`
                );

                console.log(
                    "================================================"
                );


                const response = await axios.get(

                    `${SERVER_URL}/api/delivery-challan-items/${itemId}`,

                    {
                        headers: {
                            Accept: "application/json"
                        }
                    }

                );


                const item = response.data;


                console.log(
                    "DELIVERY CHALLAN ITEM:",
                    item
                );


                // =================================================
                // SUPPORT CAMELCASE + PASCALCASE
                // =================================================

                const getValue = (
                    camelCase,
                    pascalCase,
                    defaultValue = ""
                ) => {

                    return (
                        item?.[camelCase] ??
                        item?.[pascalCase] ??
                        defaultValue
                    );

                };


                const deliveryChallanId =
                    getValue(
                        "deliveryChallanId",
                        "DeliveryChallanId",
                        ""
                    );


                const productId =
                    getValue(
                        "productId",
                        "ProductId",
                        ""
                    );


                const quantity =
                    getValue(
                        "quantity",
                        "Quantity",
                        ""
                    );


                const unitPrice =
                    getValue(
                        "unitPrice",
                        "UnitPrice",
                        ""
                    );


                const discount =
                    getValue(
                        "discount",
                        "Discount",
                        0
                    );


                const taxAmount =
                    getValue(
                        "taxAmount",
                        "TaxAmount",
                        0
                    );


                const totalAmount =
                    getValue(
                        "totalAmount",
                        "TotalAmount",
                        0
                    );


                const remarks =
                    getValue(
                        "remarks",
                        "Remarks",
                        ""
                    );


                setFormData({

                    deliveryChallanId:
                        deliveryChallanId,

                    productId:
                        productId,

                    quantity:
                        quantity,

                    unitPrice:
                        unitPrice,

                    discount:
                        discount,

                    taxAmount:
                        taxAmount,

                    totalAmount:
                        totalAmount,

                    remarks:
                        remarks

                });


            } catch (err) {

                console.error(
                    "GET DELIVERY CHALLAN ITEM ERROR:",
                    err
                );


                console.error(
                    "RESPONSE:",
                    err.response?.data
                );


                setError(
                    getErrorMessage(
                        err,
                        "Failed to load Delivery Challan Item."
                    )
                );

            } finally {

                setLoading(false);

            }

        };


        loadItem();

    }, [id]);


    // ========================================================
    // ERROR MESSAGE
    // ========================================================

    const getErrorMessage = (
        err,
        fallback
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
            responseData?.error
        ) {

            return responseData.error;

        }


        if (
            err?.message
        ) {

            return err.message;

        }


        return fallback;

    };


    // ========================================================
    // CALCULATE TOTAL
    //
    // Total =
    // Quantity × UnitPrice
    // - Discount
    // + TaxAmount
    // ========================================================

    const calculateTotal = (
        quantity,
        unitPrice,
        discount,
        taxAmount
    ) => {

        const qty =
            Number(quantity) || 0;

        const price =
            Number(unitPrice) || 0;

        const discountValue =
            Number(discount) || 0;

        const taxValue =
            Number(taxAmount) || 0;


        const total =
            (qty * price)
            - discountValue
            + taxValue;


        return Math.max(
            total,
            0
        );

    };


    // ========================================================
    // HANDLE INPUT
    // ========================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData(
            previous => {

                const updated = {

                    ...previous,

                    [name]: value

                };


                // =================================================
                // RECALCULATE TOTAL
                // =================================================

                if (
                    name === "quantity" ||
                    name === "unitPrice" ||
                    name === "discount" ||
                    name === "taxAmount"
                ) {

                    updated.totalAmount =
                        calculateTotal(

                            name === "quantity"
                                ? value
                                : previous.quantity,

                            name === "unitPrice"
                                ? value
                                : previous.unitPrice,

                            name === "discount"
                                ? value
                                : previous.discount,

                            name === "taxAmount"
                                ? value
                                : previous.taxAmount

                        ).toFixed(2);

                }


                return updated;

            }
        );

    };


    // ========================================================
    // VALIDATE
    // ========================================================

    const validateForm = () => {

        const deliveryChallanId =
            Number(
                formData.deliveryChallanId
            );


        const productId =
            Number(
                formData.productId
            );


        const quantity =
            Number(
                formData.quantity
            );


        const unitPrice =
            Number(
                formData.unitPrice
            );


        const discount =
            Number(
                formData.discount || 0
            );


        const taxAmount =
            Number(
                formData.taxAmount || 0
            );


        if (
            !Number.isInteger(
                deliveryChallanId
            ) ||
            deliveryChallanId <= 0
        ) {

            setError(
                "Please enter a valid Delivery Challan ID."
            );

            return false;

        }


        if (
            !Number.isInteger(
                productId
            ) ||
            productId <= 0
        ) {

            setError(
                "Please enter a valid Product ID."
            );

            return false;

        }


        if (
            !Number.isFinite(quantity) ||
            quantity <= 0
        ) {

            setError(
                "Quantity must be greater than 0."
            );

            return false;

        }


        if (
            !Number.isFinite(unitPrice) ||
            unitPrice < 0
        ) {

            setError(
                "Unit Price cannot be negative."
            );

            return false;

        }


        if (
            !Number.isFinite(discount) ||
            discount < 0
        ) {

            setError(
                "Discount cannot be negative."
            );

            return false;

        }


        if (
            !Number.isFinite(taxAmount) ||
            taxAmount < 0
        ) {

            setError(
                "Tax Amount cannot be negative."
            );

            return false;

        }


        const total =
            calculateTotal(
                quantity,
                unitPrice,
                discount,
                taxAmount
            );


        if (total < 0) {

            setError(
                "Total Amount cannot be negative."
            );

            return false;

        }


        return true;

    };


    // ========================================================
    // SAVE
    // ========================================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        if (!validateForm()) {
            return;
        }


        const itemId =
            Number(id);


        if (
            !Number.isInteger(itemId) ||
            itemId <= 0
        ) {

            setError(
                "Invalid Delivery Challan Item ID."
            );

            return;

        }


        try {

            setSaving(true);

            setError("");

            setSuccess("");


            // =================================================
            // EXACT DATABASE FIELDS
            // =================================================

            const payload = {

                deliveryChallanId:
                    Number(
                        formData.deliveryChallanId
                    ),

                productId:
                    Number(
                        formData.productId
                    ),

                quantity:
                    Number(
                        formData.quantity
                    ),

                unitPrice:
                    Number(
                        formData.unitPrice
                    ),

                discount:
                    Number(
                        formData.discount || 0
                    ),

                taxAmount:
                    Number(
                        formData.taxAmount || 0
                    ),

                totalAmount:
                    calculateTotal(

                        formData.quantity,

                        formData.unitPrice,

                        formData.discount,

                        formData.taxAmount

                    ),

                remarks:
                    formData.remarks.trim() || null

            };


            console.log(
                "================================================"
            );

            console.log(
                "UPDATE DELIVERY CHALLAN ITEM"
            );

            console.log(
                "ITEM ID:",
                itemId
            );

            console.log(
                "URL:",
                `${SERVER_URL}/api/delivery-challan-items/${itemId}`
            );

            console.log(
                "PAYLOAD:",
                payload
            );

            console.log(
                "================================================"
            );


            // =================================================
            // NODE API ONLY
            // =================================================

            await axios.put(

                `${SERVER_URL}/api/delivery-challan-items/${itemId}`,

                payload,

                {
                    headers: {
                        "Content-Type":
                            "application/json",

                        Accept:
                            "application/json"
                    }
                }

            );


            console.log(
                "DELIVERY CHALLAN ITEM UPDATED SUCCESSFULLY"
            );


            setSuccess(
                "Delivery Challan Item updated successfully."
            );


            // =================================================
            // NAVIGATE TO DETAILS
            // =================================================

            setTimeout(() => {

                navigate(
                    `/delivery-challan-items/details/${itemId}`
                );

            }, 800);


        } catch (err) {

            console.error(
                "UPDATE DELIVERY CHALLAN ITEM ERROR:",
                err
            );


            console.error(
                "STATUS:",
                err.response?.status
            );


            console.error(
                "RESPONSE:",
                err.response?.data
            );


            setError(
                getErrorMessage(
                    err,
                    "Failed to update Delivery Challan Item."
                )
            );

        } finally {

            setSaving(false);

        }

    };


    // ========================================================
    // BACK
    // ========================================================

    const handleBack = () => {

        navigate(
            `/delivery-challan-items/details/${Number(id)}`
        );

    };


    // ========================================================
    // CANCEL
    // ========================================================

    const handleCancel = () => {

        navigate(
            "/delivery-challan-items"
        );

    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <Box
                sx={{
                    p: 3,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 300
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
                        Loading Delivery Challan Item...
                    </Typography>

                </Stack>

            </Box>

        );

    }


    // ========================================================
    // RENDER
    // ========================================================

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

                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                >

                    <LocalShipping
                        color="primary"
                    />

                    <Box>

                        <Typography
                            variant="h5"
                            fontWeight={700}
                        >
                            Edit Delivery Challan Item
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Update Delivery Challan Item #{id}
                        </Typography>

                    </Box>

                </Stack>


                <Button

                    variant="outlined"

                    startIcon={
                        <ArrowBack />
                    }

                    onClick={handleBack}

                >
                    Back

                </Button>

            </Stack>


            {/* =================================================
                FORM
            ================================================= */}

            <Card>

                <CardContent>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >

                        {/* =========================================
                            ITEM INFORMATION
                        ========================================= */}

                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{ mb: 2 }}
                        >
                            Item Information
                        </Typography>


                        <Divider
                            sx={{ mb: 3 }}
                        />


                        <Grid
                            container
                            spacing={3}
                        >

                            {/* DELIVERY CHALLAN ID */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                            >

                                <TextField

                                    fullWidth

                                    label="Delivery Challan ID"

                                    name="deliveryChallanId"

                                    value={
                                        formData.deliveryChallanId
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    type="number"

                                    required

                                    InputProps={{
                                        startAdornment:
                                            <LocalShipping
                                                fontSize="small"
                                                sx={{
                                                    mr: 1
                                                }}
                                            />
                                    }}

                                />

                            </Grid>


                            {/* PRODUCT ID */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                            >

                                <TextField

                                    fullWidth

                                    label="Product ID"

                                    name="productId"

                                    value={
                                        formData.productId
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    type="number"

                                    required

                                    InputProps={{
                                        startAdornment:
                                            <Inventory2
                                                fontSize="small"
                                                sx={{
                                                    mr: 1
                                                }}
                                            />
                                    }}

                                />

                            </Grid>


                            {/* QUANTITY */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                            >

                                <TextField

                                    fullWidth

                                    label="Quantity"

                                    name="quantity"

                                    value={
                                        formData.quantity
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    type="number"

                                    required

                                    inputProps={{
                                        min: 0.01,
                                        step: 0.01
                                    }}

                                    InputProps={{
                                        startAdornment:
                                            <Numbers
                                                fontSize="small"
                                                sx={{
                                                    mr: 1
                                                }}
                                            />
                                    }}

                                />

                            </Grid>

                        </Grid>


                        {/* =========================================
                            PRICING
                        ========================================= */}

                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{
                                mt: 4,
                                mb: 2
                            }}
                        >
                            Pricing Details
                        </Typography>


                        <Divider
                            sx={{ mb: 3 }}
                        />


                        <Grid
                            container
                            spacing={3}
                        >

                            {/* UNIT PRICE */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                            >

                                <TextField

                                    fullWidth

                                    label="Unit Price"

                                    name="unitPrice"

                                    value={
                                        formData.unitPrice
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    type="number"

                                    required

                                    inputProps={{
                                        min: 0,
                                        step: 0.01
                                    }}

                                    InputProps={{
                                        startAdornment:
                                            <CurrencyRupee
                                                fontSize="small"
                                                sx={{
                                                    mr: 1
                                                }}
                                            />
                                    }}

                                />

                            </Grid>


                            {/* DISCOUNT */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                            >

                                <TextField

                                    fullWidth

                                    label="Discount"

                                    name="discount"

                                    value={
                                        formData.discount
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    type="number"

                                    inputProps={{
                                        min: 0,
                                        step: 0.01
                                    }}

                                    InputProps={{
                                        startAdornment:
                                            <Discount
                                                fontSize="small"
                                                sx={{
                                                    mr: 1
                                                }}
                                            />
                                    }}

                                />

                            </Grid>


                            {/* TAX */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                            >

                                <TextField

                                    fullWidth

                                    label="Tax Amount"

                                    name="taxAmount"

                                    value={
                                        formData.taxAmount
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    type="number"

                                    inputProps={{
                                        min: 0,
                                        step: 0.01
                                    }}

                                    InputProps={{
                                        startAdornment:
                                            <Receipt
                                                fontSize="small"
                                                sx={{
                                                    mr: 1
                                                }}
                                            />
                                    }}

                                />

                            </Grid>


                            {/* TOTAL */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                            >

                                <TextField

                                    fullWidth

                                    label="Total Amount"

                                    name="totalAmount"

                                    value={
                                        formData.totalAmount
                                    }

                                    InputProps={{
                                        readOnly: true,

                                        startAdornment:
                                            <CurrencyRupee
                                                fontSize="small"
                                                sx={{
                                                    mr: 1
                                                }}
                                            />
                                    }}

                                    helperText={
                                        "Quantity × Unit Price − Discount + Tax"
                                    }

                                />

                            </Grid>

                        </Grid>


                        {/* =========================================
                            REMARKS
                        ========================================= */}

                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{
                                mt: 4,
                                mb: 2
                            }}
                        >
                            Additional Information
                        </Typography>


                        <Divider
                            sx={{ mb: 3 }}
                        />


                        <Grid
                            container
                            spacing={3}
                        >

                            <Grid
                                item
                                xs={12}
                            >

                                <TextField

                                    fullWidth

                                    label="Remarks"

                                    name="remarks"

                                    value={
                                        formData.remarks
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    multiline

                                    rows={4}

                                    placeholder={
                                        "Enter remarks"
                                    }

                                    InputProps={{
                                        startAdornment:
                                            <Notes
                                                fontSize="small"
                                                sx={{
                                                    mr: 1,
                                                    mt: 1
                                                }}
                                            />
                                    }}

                                />

                            </Grid>

                        </Grid>


                        {/* =========================================
                            BUTTONS
                        ========================================= */}

                        <Stack

                            direction={{
                                xs: "column-reverse",
                                sm: "row"
                            }}

                            spacing={2}

                            justifyContent="flex-end"

                            sx={{
                                mt: 4
                            }}

                        >

                            <Button

                                variant="outlined"

                                startIcon={
                                    <ArrowBack />
                                }

                                onClick={
                                    handleCancel
                                }

                                disabled={saving}

                            >
                                Cancel

                            </Button>


                            <Button

                                type="submit"

                                variant="contained"

                                startIcon={
                                    saving
                                        ? <CircularProgress
                                            size={18}
                                            color="inherit"
                                        />
                                        : <Save />
                                }

                                disabled={saving}

                            >

                                {saving
                                    ? "Updating..."
                                    : "Update Item"
                                }

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
                    Boolean(error)
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

                    variant="filled"

                    onClose={() =>
                        setError("")
                    }

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

                autoHideDuration={1500}

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

                    variant="filled"

                    onClose={() =>
                        setSuccess("")
                    }

                >

                    {success}

                </Alert>

            </Snackbar>

        </Box>

    );

};


export default DeliveryChallanItemEdit;

