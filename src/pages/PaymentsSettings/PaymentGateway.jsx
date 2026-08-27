// =========================================================
// PaymentGateway.jsx
// =========================================================

import React, { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    TextField,
    Typography,
} from "@mui/material";

import {
    AccountBalance,
    CheckCircle,
    CloudDone,
    CloudOff,
    Key,
    Lock,
    Save,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";

// =========================================================
// DEFAULT FORM
// =========================================================

const DEFAULT_FORM = {
    gatewayName: "",
    gatewayType: "Razorpay",
    environment: "Test",
    merchantId: "",
    apiKey: "",
    apiSecret: "",
    webhookSecret: "",
    webhookUrl: "",
    isActive: false,
    autoCapture: true,
};

// =========================================================
// COMPONENT
// =========================================================

const PaymentGateway = ({
    gateway = null,
    onSave,
    loading = false,
}) => {
    const [formData, setFormData] =
        useState(DEFAULT_FORM);

    const [showApiKey, setShowApiKey] =
        useState(false);

    const [showApiSecret, setShowApiSecret] =
        useState(false);

    const [showWebhookSecret, setShowWebhookSecret] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    // =========================================================
    // LOAD EXISTING CONFIGURATION
    // =========================================================

    useEffect(() => {
        if (gateway) {
            setFormData({
                ...DEFAULT_FORM,
                ...gateway,

                gatewayName:
                    gateway.gatewayName ??
                    gateway.name ??
                    "",

                gatewayType:
                    gateway.gatewayType ??
                    gateway.type ??
                    "Razorpay",

                environment:
                    gateway.environment ??
                    gateway.mode ??
                    "Test",

                merchantId:
                    gateway.merchantId ??
                    "",

                apiKey:
                    gateway.apiKey ??
                    "",

                apiSecret:
                    gateway.apiSecret ??
                    "",

                webhookSecret:
                    gateway.webhookSecret ??
                    "",

                webhookUrl:
                    gateway.webhookUrl ??
                    "",

                isActive:
                    gateway.isActive ??
                    gateway.enabled ??
                    false,

                autoCapture:
                    gateway.autoCapture ??
                    true,
            });
        } else {
            setFormData(DEFAULT_FORM);
        }

        setSuccessMessage("");
        setErrorMessage("");
    }, [gateway]);

    // =========================================================
    // HANDLE CHANGE
    // =========================================================

    const handleChange = (event) => {
        const {
            name,
            value,
            checked,
            type,
        } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));

        setSuccessMessage("");
        setErrorMessage("");
    };

    // =========================================================
    // VALIDATION
    // =========================================================

    const validateForm = () => {
        if (!formData.gatewayName.trim()) {
            setErrorMessage(
                "Gateway name is required."
            );

            return false;
        }

        if (!formData.gatewayType) {
            setErrorMessage(
                "Please select a payment gateway."
            );

            return false;
        }

        if (!formData.environment) {
            setErrorMessage(
                "Please select an environment."
            );

            return false;
        }

        if (!formData.apiKey.trim()) {
            setErrorMessage(
                "API Key is required."
            );

            return false;
        }

        if (!formData.apiSecret.trim()) {
            setErrorMessage(
                "API Secret is required."
            );

            return false;
        }

        return true;
    };

    // =========================================================
    // SAVE
    // =========================================================

    const handleSave = async () => {
        setSuccessMessage("");
        setErrorMessage("");

        if (!validateForm()) {
            return;
        }

        try {
            setSaving(true);

            const payload = {
                ...formData,

                gatewayName:
                    formData.gatewayName.trim(),

                merchantId:
                    formData.merchantId.trim(),

                apiKey:
                    formData.apiKey.trim(),

                apiSecret:
                    formData.apiSecret.trim(),

                webhookSecret:
                    formData.webhookSecret.trim(),

                webhookUrl:
                    formData.webhookUrl.trim(),

                isActive:
                    Boolean(formData.isActive),

                autoCapture:
                    Boolean(
                        formData.autoCapture
                    ),
            };

            if (onSave) {
                await onSave(
                    payload
                );
            }

            setSuccessMessage(
                "Payment gateway settings saved successfully."
            );
        } catch (error) {
            console.error(
                "Payment gateway save error:",
                error
            );

            setErrorMessage(
                error?.response?.data
                    ?.message ??
                    error?.message ??
                    "Failed to save payment gateway settings."
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================================================
    // RENDER
    // =========================================================

   return (
    <Card
        elevation={2}
        sx={{
            borderRadius: 2,
            width: "100%",
            overflow: "hidden",
        }}
    >
        {/* =====================================================
            HEADER
           ===================================================== */}

        <Box
            sx={{
                px: 3,
                py: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                }}
            >
                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                    }}
                >
                    <AccountBalance />
                </Box>

                <Box>
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        Payment Gateway
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Configure payment processing settings
                    </Typography>
                </Box>
            </Box>

            <Chip
                icon={
                    formData.isActive ? (
                        <CheckCircle />
                    ) : (
                        <CloudOff />
                    )
                }
                label={
                    formData.isActive
                        ? "Active"
                        : "Inactive"
                }
                color={
                    formData.isActive
                        ? "success"
                        : "default"
                }
                variant="outlined"
            />
        </Box>

        <Divider />

        {/* =====================================================
            FORM CONTENT
           ===================================================== */}

        <CardContent sx={{ p: 3 }}>

            {/* =================================================
                SUCCESS MESSAGE
               ================================================= */}

            {successMessage && (
                <Alert
                    severity="success"
                    sx={{ mb: 3 }}
                >
                    {successMessage}
                </Alert>
            )}

            {/* =================================================
                ERROR MESSAGE
               ================================================= */}

            {errorMessage && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {errorMessage}
                </Alert>
            )}

            {/* =================================================
                FORM GRID
               ================================================= */}

            <Grid
                container
                spacing={2.5}
            >

                {/* =================================================
                    GATEWAY NAME
                   ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <TextField
                        fullWidth
                        label="Gateway Name"
                        name="gatewayName"
                        value={
                            formData.gatewayName
                        }
                        onChange={handleChange}
                        placeholder="My Payment Gateway"
                        disabled={
                            loading ||
                            saving
                        }
                    />
                </Grid>

                {/* =================================================
                    GATEWAY TYPE
                   ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <FormControl
                        fullWidth
                        disabled={
                            loading ||
                            saving
                        }
                    >
                        <InputLabel>
                            Gateway Type
                        </InputLabel>

                        <Select
                            name="gatewayType"
                            value={
                                formData.gatewayType
                            }
                            label="Gateway Type"
                            onChange={handleChange}
                        >
                            <MenuItem value="Razorpay">
                                Razorpay
                            </MenuItem>

                            <MenuItem value="Stripe">
                                Stripe
                            </MenuItem>

                            <MenuItem value="PayU">
                                PayU
                            </MenuItem>

                            <MenuItem value="Cashfree">
                                Cashfree
                            </MenuItem>

                            <MenuItem value="PhonePe">
                                PhonePe
                            </MenuItem>

                            <MenuItem value="Other">
                                Other
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {/* =================================================
                    ENVIRONMENT
                   ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <FormControl
                        fullWidth
                        disabled={
                            loading ||
                            saving
                        }
                    >
                        <InputLabel>
                            Environment
                        </InputLabel>

                        <Select
                            name="environment"
                            value={
                                formData.environment
                            }
                            label="Environment"
                            onChange={handleChange}
                        >
                            <MenuItem value="Test">
                                Test / Sandbox
                            </MenuItem>

                            <MenuItem value="Live">
                                Live / Production
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {/* =================================================
                    MERCHANT ID
                   ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <TextField
                        fullWidth
                        label="Merchant ID"
                        name="merchantId"
                        value={
                            formData.merchantId
                        }
                        onChange={handleChange}
                        disabled={
                            loading ||
                            saving
                        }
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountBalance fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>

                {/* =================================================
                    API KEY
                   ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <TextField
                        fullWidth
                        label="API Key"
                        name="apiKey"
                        type={
                            showApiKey
                                ? "text"
                                : "password"
                        }
                        value={
                            formData.apiKey
                        }
                        onChange={handleChange}
                        disabled={
                            loading ||
                            saving
                        }
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Key fontSize="small" />
                                </InputAdornment>
                            ),

                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button
                                        size="small"
                                        onClick={() =>
                                            setShowApiKey(
                                                (prev) =>
                                                    !prev
                                            )
                                        }
                                        disabled={
                                            loading ||
                                            saving
                                        }
                                    >
                                        {showApiKey ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </Button>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>

                {/* =================================================
                    API SECRET
                   ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <TextField
                        fullWidth
                        label="API Secret"
                        name="apiSecret"
                        type={
                            showApiSecret
                                ? "text"
                                : "password"
                        }
                        value={
                            formData.apiSecret
                        }
                        onChange={handleChange}
                        disabled={
                            loading ||
                            saving
                        }
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock fontSize="small" />
                                </InputAdornment>
                            ),

                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button
                                        size="small"
                                        onClick={() =>
                                            setShowApiSecret(
                                                (prev) =>
                                                    !prev
                                            )
                                        }
                                        disabled={
                                            loading ||
                                            saving
                                        }
                                    >
                                        {showApiSecret ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </Button>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>

                {/* =================================================
                    WEBHOOK SECRET
                   ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <TextField
                        fullWidth
                        label="Webhook Secret"
                        name="webhookSecret"
                        type={
                            showWebhookSecret
                                ? "text"
                                : "password"
                        }
                        value={
                            formData.webhookSecret
                        }
                        onChange={handleChange}
                        disabled={
                            loading ||
                            saving
                        }
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock fontSize="small" />
                                </InputAdornment>
                            ),

                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button
                                        size="small"
                                        onClick={() =>
                                            setShowWebhookSecret(
                                                (prev) =>
                                                    !prev
                                            )
                                        }
                                        disabled={
                                            loading ||
                                            saving
                                        }
                                    >
                                        {showWebhookSecret ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </Button>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>

                {/* =================================================
                    WEBHOOK URL
                   ================================================= */}

                <Grid
                    item
                    xs={12}
                >
                    <TextField
                        fullWidth
                        label="Webhook URL"
                        name="webhookUrl"
                        value={
                            formData.webhookUrl
                        }
                        onChange={handleChange}
                        placeholder="https://your-domain.com/api/payment/webhook"
                        disabled={
                            loading ||
                            saving
                        }
                    />
                </Grid>

                {/* =================================================
                    PAYMENT OPTIONS
                   ================================================= */}

                <Grid
                    item
                    xs={12}
                >
                    <Box
                        sx={{
                            p: 2.5,
                            borderRadius: 2,
                            bgcolor: "action.hover",
                            border: "1px solid",
                            borderColor: "divider",
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            sx={{ mb: 1.5 }}
                        >
                            Payment Options
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Switch
                                        name="isActive"
                                        checked={
                                            formData.isActive
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            loading ||
                                            saving
                                        }
                                    />
                                }
                                label={
                                    formData.isActive
                                        ? "Gateway Enabled"
                                        : "Gateway Disabled"
                                }
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        name="autoCapture"
                                        checked={
                                            formData.autoCapture
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            loading ||
                                            saving
                                        }
                                    />
                                }
                                label="Automatically Capture Payments"
                            />
                        </Box>
                    </Box>
                </Grid>

                {/* =================================================
                    TEST ENVIRONMENT WARNING
                   ================================================= */}

                {formData.environment === "Test" && (
                    <Grid
                        item
                        xs={12}
                    >
                        <Alert
                            severity="info"
                            icon={<CloudDone />}
                        >
                            Test/Sandbox mode is enabled.
                            Payments should not be treated
                            as production transactions.
                        </Alert>
                    </Grid>
                )}

                {/* =================================================
                    LIVE ENVIRONMENT WARNING
                   ================================================= */}

                {formData.environment === "Live" && (
                    <Grid
                        item
                        xs={12}
                    >
                        <Alert
                            severity="warning"
                        >
                            Live/Production mode is enabled.
                            Real customer payments may be
                            processed through this gateway.
                        </Alert>
                    </Grid>
                )}

            </Grid>
        </CardContent>

        <Divider />

        {/* =====================================================
            FOOTER
           ===================================================== */}

        <Box
            sx={{
                px: 3,
                py: 2,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
            }}
        >
            <Button
                variant="contained"
                startIcon={
                    saving ? (
                        <CloudDone />
                    ) : (
                        <Save />
                    )
                }
                onClick={handleSave}
                disabled={
                    saving ||
                    loading
                }
            >
                {saving
                    ? "Saving..."
                    : "Save Gateway Settings"}
            </Button>
        </Box>
    </Card>
);
};

export default PaymentGateway;