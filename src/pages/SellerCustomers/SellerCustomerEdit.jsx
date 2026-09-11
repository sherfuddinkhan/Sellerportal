// =========================================================
// SellerCustomerEdit.jsx
// Seller Customer Edit Page
// =========================================================

import React, {
    useCallback,
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
    MenuItem,
    Snackbar,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Save
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

// =========================================================
// CONFIGURATION
// =========================================================

// React
//    ↓
// Node server.js
//    ↓
// ASP.NET Core
//    ↓
// SellerPortalDB

const SERVER_URL = "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const SellerCustomerEdit = () => {

    const navigate = useNavigate();

    // =====================================================
    // URL PARAMETERS
    // =====================================================

    const {
        sellerId,
        customerId
    } = useParams();

    // =====================================================
    // STATE
    // =====================================================

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState(false);

    const [form, setForm] = useState({

        CustomerCode: "",

        CustomerName: "",

        ContactPerson: "",

        Email: "",

        Phone: "",

        GSTIN: "",

        AddressLine1: "",

        AddressLine2: "",

        City: "",

        State: "",

        Country: "",

        PostalCode: "",

        CreditLimit: "",

        IsActive: true

    });

    // =====================================================
    // LOAD CUSTOMER
    // =====================================================

    const loadCustomer = useCallback(async () => {

        if (!sellerId) {

            setError(
                "Seller ID is missing from URL."
            );

            setLoading(false);

            return;
        }

        if (!customerId) {

            setError(
                "Customer ID is missing from URL."
            );

            setLoading(false);

            return;
        }

        try {

            setLoading(true);

            setError("");

            // =================================================
            // IMPORTANT
            //
            // React -> Node
            //
            // http://localhost:5000/api/
            // seller-customers/6/customers/3
            //
            // Node -> ASP.NET
            //
            // https://localhost:7203/api/
            // SellerCustomer/6/customers/3
            // =================================================

            const url =
                `${SERVER_URL}/api/seller-customers/${sellerId}/customers/${customerId}`;

            console.log(
                "================================================="
            );

            console.log(
                "GET SELLER CUSTOMER"
            );

            console.log(
                "Seller ID:",
                sellerId
            );

            console.log(
                "Customer ID:",
                customerId
            );

            console.log(
                "Request URL:",
                url
            );

            console.log(
                "================================================="
            );

            const response = await axios.get(
                url,
                {
                    headers: {
                        Accept: "*/*"
                    }
                }
            );

            const data = response.data;

            console.log(
                "================================================="
            );

            console.log(
                "CUSTOMER RESPONSE"
            );

            console.log(
                data
            );

            console.log(
                "================================================="
            );

            // =================================================
            // SUPPORT BOTH:
            //
            // camelCase JSON
            // PascalCase JSON
            // =================================================

            setForm({

                CustomerCode:
                    data.customerCode ??
                    data.CustomerCode ??
                    "",

                CustomerName:
                    data.customerName ??
                    data.CustomerName ??
                    "",

                ContactPerson:
                    data.contactPerson ??
                    data.ContactPerson ??
                    "",

                Email:
                    data.email ??
                    data.Email ??
                    "",

                Phone:
                    data.phone ??
                    data.Phone ??
                    "",

                GSTIN:
                    data.gstin ??
                    data.GSTIN ??
                    "",

                AddressLine1:
                    data.addressLine1 ??
                    data.AddressLine1 ??
                    "",

                AddressLine2:
                    data.addressLine2 ??
                    data.AddressLine2 ??
                    "",

                City:
                    data.city ??
                    data.City ??
                    "",

                State:
                    data.state ??
                    data.State ??
                    "",

                Country:
                    data.country ??
                    data.Country ??
                    "",

                PostalCode:
                    data.postalCode ??
                    data.PostalCode ??
                    "",

                CreditLimit:
                    data.creditLimit ??
                    data.CreditLimit ??
                    "",

                IsActive:
                    data.isActive ??
                    data.IsActive ??
                    true

            });

        }
        catch (err) {

            console.error(
                "================================================="
            );

            console.error(
                "LOAD CUSTOMER ERROR"
            );

            console.error(
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

            console.error(
                "================================================="
            );

            const status =
                err.response?.status;

            const backendMessage =
                err.response?.data?.message ||
                err.response?.data?.title;

            if (status === 404) {

                setError(
                    "Customer was not found for this seller."
                );

            }
            else if (status === 500) {

                setError(
                    backendMessage ||
                    "Server error while loading customer details."
                );

            }
            else {

                setError(
                    backendMessage ||
                    `Unable to load customer details.${
                        status
                            ? ` HTTP ${status}`
                            : ""
                    }`
                );

            }

        }
        finally {

            setLoading(false);

        }

    }, [
        sellerId,
        customerId
    ]);

    // =====================================================
    // EFFECT
    // =====================================================

    useEffect(() => {

        loadCustomer();

    }, [
        loadCustomer
    ]);

    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setForm(
            previous => ({
                ...previous,
                [name]: value
            })
        );

    };

    // =====================================================
    // SAVE CUSTOMER
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!sellerId) {

            setError(
                "Seller ID is missing."
            );

            return;
        }

        if (!customerId) {

            setError(
                "Customer ID is missing."
            );

            return;
        }

        try {

            setSaving(true);

            setError("");

            // =================================================
            // PUT PAYLOAD
            // =================================================

            const payload = {

                CustomerCode:
                    form.CustomerCode?.trim() || "",

                CustomerName:
                    form.CustomerName?.trim() || "",

                ContactPerson:
                    form.ContactPerson?.trim() || "",

                Email:
                    form.Email?.trim() || "",

                Phone:
                    form.Phone?.trim() || "",

                GSTIN:
                    form.GSTIN?.trim() || "",

                AddressLine1:
                    form.AddressLine1?.trim() || "",

                AddressLine2:
                    form.AddressLine2?.trim() || "",

                City:
                    form.City?.trim() || "",

                State:
                    form.State?.trim() || "",

                Country:
                    form.Country?.trim() || "",

                PostalCode:
                    form.PostalCode?.trim() || "",

                CreditLimit:
                    Number(form.CreditLimit || 0),

                IsActive:
                    form.IsActive === true ||
                    form.IsActive === "true"

            };

            // =================================================
            // NODE URL
            //
            // IMPORTANT:
            // Use seller-customers
            // NOT SellerCustomer
            // =================================================

            const url =
                `${SERVER_URL}/api/seller-customers/${sellerId}/customers/${customerId}`;

            console.log(
                "================================================="
            );

            console.log(
                "UPDATE SELLER CUSTOMER"
            );

            console.log(
                "PUT URL:",
                url
            );

            console.log(
                "Payload:",
                payload
            );

            console.log(
                "================================================="
            );

            const response = await axios.put(
                url,
                payload,
                {
                    headers: {
                        Accept: "*/*",
                        "Content-Type":
                            "application/json"
                    }
                }
            );

            console.log(
                "UPDATE RESPONSE:",
                response
            );

            setSuccess(true);

            // =================================================
            // GO TO DETAILS
            // =================================================

            setTimeout(() => {

                navigate(
                    `/seller-customers/details/${sellerId}/${customerId}`
                );

            }, 700);

        }
        catch (err) {

            console.error(
                "================================================="
            );

            console.error(
                "UPDATE CUSTOMER ERROR"
            );

            console.error(
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

            console.error(
                "================================================="
            );

            const status =
                err.response?.status;

            const backendMessage =
                err.response?.data?.message ||
                err.response?.data?.title;

            setError(
                backendMessage ||
                `Unable to update customer.${
                    status
                        ? ` HTTP ${status}`
                        : ""
                }`
            );

        }
        finally {

            setSaving(false);

        }

    };

    // =====================================================
    // GO TO DETAILS
    // =====================================================

    const goToDetails = () => {

        navigate(
            `/seller-customers/details/${sellerId}/${customerId}`
        );

    };

    // =====================================================
    // LOADING
    // =====================================================

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

                <CircularProgress />

            </Box>

        );

    }

    // =====================================================
    // RENDER
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
                        Edit Customer
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Update seller customer information
                    </Typography>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Seller ID: {sellerId} | Customer ID: {customerId}
                    </Typography>

                </Box>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={goToDetails}
                    disabled={saving}
                >
                    Back
                </Button>

            </Stack>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {error}
                </Alert>

            )}

            {/* =================================================
                FORM
            ================================================= */}

            <Card>

                <CardContent>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >

                        <Typography
                            variant="h6"
                            fontWeight={600}
                            sx={{ mb: 2 }}
                        >
                            Customer Information
                        </Typography>

                        <Divider sx={{ mb: 3 }} />

                        <Grid
                            container
                            spacing={2}
                        >

                            {/* =================================================
                                CUSTOMER CODE
                            ================================================= */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    label="Customer Code"
                                    name="CustomerCode"
                                    value={
                                        form.CustomerCode
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>

                            {/* =================================================
                                CUSTOMER NAME
                            ================================================= */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    label="Customer Name"
                                    name="CustomerName"
                                    value={
                                        form.CustomerName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>

                            {/* =================================================
                                CONTACT PERSON
                            ================================================= */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Contact Person"
                                    name="ContactPerson"
                                    value={
                                        form.ContactPerson
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>

                            {/* =================================================
                                EMAIL
                            ================================================= */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    type="email"
                                    label="Email"
                                    name="Email"
                                    value={
                                        form.Email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>

                            {/* =================================================
                                PHONE
                            ================================================= */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Phone"
                                    name="Phone"
                                    value={
                                        form.Phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>

                            {/* =================================================
                                GSTIN
                            ================================================= */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="GSTIN"
                                    name="GSTIN"
                                    value={
                                        form.GSTIN
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>

                            {/* =================================================
                                ADDRESS LINE 1
                            ================================================= */}

                            <Grid
                                item
                                xs={12}
                            >

                                <TextField
                                    fullWidth
                                    label="Address Line 1"
                                    name="AddressLine1"
                                    value={
                                        form.AddressLine1
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>

                            {/* =================================================
                                ADDRESS LINE 2
                            ================================================= */}

                            <Grid
                                item
                                xs={12}
                            >

                                <TextField
                                    fullWidth
                                    label="Address Line 2"
                                    name="AddressLine2"
                                    value={
                                        form.AddressLine2
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>

                            {/* =================================================
                                CITY
                            ================================================= */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="City"
                                    name="City"
                                    value={
                                        form.City
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>

                            {/* =================================================
                                STATE
                            ================================================= */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="State"
                                    name="State"
                                    value={
                                        form.State
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>

                            {/* =================================================
                                COUNTRY
                            ================================================= */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Country"
                                    name="Country"
                                    value={
                                        form.Country
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>

                            {/* =================================================
                                POSTAL CODE
                            ================================================= */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Postal Code"
                                    name="PostalCode"
                                    value={
                                        form.PostalCode
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>

                            {/* =================================================
                                CREDIT LIMIT
                            ================================================= */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Credit Limit"
                                    name="CreditLimit"
                                    value={
                                        form.CreditLimit
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    inputProps={{
                                        min: 0
                                    }}
                                />

                            </Grid>

                            {/* =================================================
                                STATUS
                            ================================================= */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    select
                                    fullWidth
                                    label="Status"
                                    name="IsActive"
                                    value={
                                        form.IsActive
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <MenuItem value={true}>
                                        Active
                                    </MenuItem>

                                    <MenuItem value={false}>
                                        Inactive
                                    </MenuItem>

                                </TextField>

                            </Grid>

                        </Grid>

                        {/* =================================================
                            ACTIONS
                        ================================================= */}

                        <Stack
                            direction="row"
                            justifyContent="flex-end"
                            spacing={2}
                            sx={{ mt: 4 }}
                        >

                            <Button
                                variant="outlined"
                                onClick={goToDetails}
                                disabled={saving}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={
                                    saving ? (
                                        <CircularProgress
                                            size={18}
                                            color="inherit"
                                        />
                                    ) : (
                                        <Save />
                                    )
                                }
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </Button>

                        </Stack>

                    </Box>

                </CardContent>

            </Card>

            {/* =================================================
                SUCCESS
            ================================================= */}

            <Snackbar
                open={success}
                autoHideDuration={700}
                onClose={() =>
                    setSuccess(false)
                }
            >

                <Alert
                    severity="success"
                    variant="filled"
                >
                    Customer updated successfully
                </Alert>

            </Snackbar>

        </Box>

    );

};

export default SellerCustomerEdit;