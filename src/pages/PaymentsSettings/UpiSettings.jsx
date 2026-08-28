// =========================================================
// UpiSettings.jsx
// =========================================================

import React, { useState } from "react";

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
    Link as LinkIcon,
    QrCode2,
    Save,
} from "@mui/icons-material";

// =========================================================
// COMPONENT
// =========================================================

const UpiSettings = ({
    initialData = {},
    loading = false,
    onSave,
}) => {
    const [formData, setFormData] = useState({
        upiProvider:
            initialData.upiProvider || "Razorpay",

        merchantName:
            initialData.merchantName || "",

        merchantVpa:
            initialData.merchantVpa || "",

        merchantId:
            initialData.merchantId || "",

        apiKey:
            initialData.apiKey || "",

        callbackUrl:
            initialData.callbackUrl || "",

        environment:
            initialData.environment || "Test",

        isActive:
            initialData.isActive ?? true,

        enableQr:
            initialData.enableQr ?? true,

        enableIntent:
            initialData.enableIntent ?? true,

        enableCollect:
            initialData.enableCollect ?? true,
    });

    const [saving, setSaving] =
        useState(false);

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

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
    };

    const handleSave = async () => {
        setSuccessMessage("");
        setErrorMessage("");

        try {
            setSaving(true);

            if (onSave) {
                await onSave(formData);
            }

            setSuccessMessage(
                "UPI settings saved successfully."
            );
        } catch (error) {
            console.error(error);

            setErrorMessage(
                error?.message ||
                    "Failed to save UPI settings."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card
            elevation={2}
            sx={{
                width: "100%",
                borderRadius: 2,
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
                    justifyContent:
                        "space-between",
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
                            justifyContent:
                                "center",
                            bgcolor:
                                "primary.main",
                            color:
                                "primary.contrastText",
                        }}
                    >
                        <QrCode2 />
                    </Box>

                    <Box>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            UPI Settings
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Configure UPI payment
                            settings
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

            <CardContent sx={{ p: 3 }}>
                {/* =================================================
                    MESSAGES
                   ================================================= */}

                {successMessage && (
                    <Alert
                        severity="success"
                        sx={{ mb: 3 }}
                    >
                        {successMessage}
                    </Alert>
                )}

                {errorMessage && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                    >
                        {errorMessage}
                    </Alert>
                )}

                {/* =================================================
                    FORM
                   ================================================= */}

                <Grid
                    container
                    spacing={2.5}
                >
                    {/* UPI PROVIDER */}

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
                                UPI Provider
                            </InputLabel>

                            <Select
                                name="upiProvider"
                                value={
                                    formData.upiProvider
                                }
                                label="UPI Provider"
                                onChange={
                                    handleChange
                                }
                            >
                                <MenuItem value="Razorpay">
                                    Razorpay
                                </MenuItem>

                                <MenuItem value="Cashfree">
                                    Cashfree
                                </MenuItem>

                                <MenuItem value="PayU">
                                    PayU
                                </MenuItem>

                                <MenuItem value="PhonePe">
                                    PhonePe
                                </MenuItem>

                                <MenuItem value="Paytm">
                                    Paytm
                                </MenuItem>

                                <MenuItem value="Other">
                                    Other
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* ENVIRONMENT */}

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
                                onChange={
                                    handleChange
                                }
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

                    {/* MERCHANT NAME */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            label="Merchant Name"
                            name="merchantName"
                            value={
                                formData.merchantName
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="My Store"
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

                    {/* UPI VPA */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            label="UPI VPA"
                            name="merchantVpa"
                            value={
                                formData.merchantVpa
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="merchant@upi"
                            disabled={
                                loading ||
                                saving
                            }
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <QrCode2 fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    {/* MERCHANT ID */}

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
                            onChange={
                                handleChange
                            }
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

                    {/* API KEY */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            label="API Key"
                            name="apiKey"
                            type="password"
                            value={
                                formData.apiKey
                            }
                            onChange={
                                handleChange
                            }
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
                            }}
                        />
                    </Grid>

                    {/* CALLBACK URL */}

                    <Grid
                        item
                        xs={12}
                    >
                        <TextField
                            fullWidth
                            label="Callback URL"
                            name="callbackUrl"
                            value={
                                formData.callbackUrl
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="https://your-domain.com/api/payment/upi/callback"
                            disabled={
                                loading ||
                                saving
                            }
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LinkIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    {/* PAYMENT OPTIONS */}

                    <Grid
                        item
                        xs={12}
                    >
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor:
                                    "action.hover",
                            }}
                        >
                            <Typography
                                variant="subtitle2"
                                fontWeight="bold"
                                sx={{ mb: 1 }}
                            >
                                UPI Payment Options
                            </Typography>

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
                                        ? "UPI Payments Enabled"
                                        : "UPI Payments Disabled"
                                }
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        name="enableQr"
                                        checked={
                                            formData.enableQr
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
                                label="Enable UPI QR Payments"
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        name="enableIntent"
                                        checked={
                                            formData.enableIntent
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
                                label="Enable UPI Intent"
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        name="enableCollect"
                                        checked={
                                            formData.enableCollect
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
                                label="Enable UPI Collect"
                            />
                        </Box>
                    </Grid>

                    {/* TEST ENVIRONMENT WARNING */}

                    {formData.environment ===
                        "Test" && (
                        <Grid
                            item
                            xs={12}
                        >
                            <Alert
                                severity="info"
                                icon={
                                    <CloudDone />
                                }
                            >
                                Test/Sandbox mode is
                                enabled. UPI payments
                                should not be treated
                                as production
                                transactions.
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
                    justifyContent:
                        "flex-end",
                }}
            >
                <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={
                        loading ||
                        saving
                    }
                >
                    {saving
                        ? "Saving..."
                        : "Save UPI Settings"}
                </Button>
            </Box>
        </Card>
    );
};

export default UpiSettings;