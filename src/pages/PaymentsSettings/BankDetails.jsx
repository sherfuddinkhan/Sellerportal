// =========================================================
// BankDetails.jsx
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
    Grid,
    MenuItem,
    Paper,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";

import {
    AccountBalance,
    CheckCircle,
    Edit,
    Lock,
    Refresh,
    Save,
} from "@mui/icons-material";

// =========================================================
// DEFAULT FORM
// =========================================================

const initialBankDetails = {
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    branchName: "",
    accountType: "Savings",
    upiId: "",
    swiftCode: "",
    bankAddress: "",
    isPrimary: true,
    isVerified: false,
};

// =========================================================
// COMPONENT
// =========================================================

const BankDetails = ({
    initialData = null,
    onSave,
    readOnly = false,
}) => {
    const [formData, setFormData] = useState(
        initialData || initialBankDetails
    );

    const [errors, setErrors] = useState({});

    const [editing, setEditing] = useState(
        !initialData && !readOnly
    );

    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState({
        open: false,
        type: "success",
        text: "",
    });

    // =========================================================
    // UPDATE WHEN INITIAL DATA CHANGES
    // =========================================================

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialBankDetails,
                ...initialData,
            });

            setEditing(false);
        }
    }, [initialData]);

    // =========================================================
    // HANDLE CHANGE
    // =========================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear field error when user changes it
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    // =========================================================
    // VALIDATION
    // =========================================================

    const validate = () => {
        const newErrors = {};

        if (!formData.bankName.trim()) {
            newErrors.bankName =
                "Bank name is required.";
        }

        if (!formData.accountHolderName.trim()) {
            newErrors.accountHolderName =
                "Account holder name is required.";
        }

        if (!formData.accountNumber.trim()) {
            newErrors.accountNumber =
                "Account number is required.";
        } else if (
            !/^\d{9,18}$/.test(
                formData.accountNumber
            )
        ) {
            newErrors.accountNumber =
                "Enter a valid account number.";
        }

        if (
            !formData.confirmAccountNumber.trim()
        ) {
            newErrors.confirmAccountNumber =
                "Please confirm the account number.";
        } else if (
            formData.accountNumber !==
            formData.confirmAccountNumber
        ) {
            newErrors.confirmAccountNumber =
                "Account numbers do not match.";
        }

        if (!formData.ifscCode.trim()) {
            newErrors.ifscCode =
                "IFSC code is required.";
        } else if (
            !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(
                formData.ifscCode.toUpperCase()
            )
        ) {
            newErrors.ifscCode =
                "Enter a valid IFSC code.";
        }

        if (!formData.branchName.trim()) {
            newErrors.branchName =
                "Branch name is required.";
        }

        if (
            formData.upiId &&
            !/^[\w.-]+@[\w.-]+$/.test(
                formData.upiId
            )
        ) {
            newErrors.upiId =
                "Enter a valid UPI ID.";
        }

        setErrors(newErrors);

        return (
            Object.keys(newErrors).length === 0
        );
    };

    // =========================================================
    // SAVE
    // =========================================================

    const handleSave = async () => {
        if (!validate()) {
            setMessage({
                open: true,
                type: "error",
                text: "Please correct the highlighted fields.",
            });

            return;
        }

        try {
            setSaving(true);

            const payload = {
                ...formData,

                // Never send confirmation as actual
                // bank information.
                confirmAccountNumber:
                    undefined,

                ifscCode:
                    formData.ifscCode.toUpperCase(),
            };

            /*
             * Connect your API here.
             *
             * Example:
             *
             * const response = await apiService.post(
             *     "/BankDetails",
             *     payload
             * );
             */

            if (onSave) {
                await onSave(payload);
            }

            setFormData((prev) => ({
                ...prev,
                isVerified: true,
            }));

            setEditing(false);

            setMessage({
                open: true,
                type: "success",
                text: "Bank details saved successfully.",
            });
        } catch (error) {
            console.error(
                "Bank details save error:",
                error
            );

            setMessage({
                open: true,
                type: "error",
                text:
                    error?.message ||
                    "Unable to save bank details.",
            });
        } finally {
            setSaving(false);
        }
    };

    // =========================================================
    // RESET
    // =========================================================

    const handleReset = () => {
        setFormData(
            initialData
                ? {
                      ...initialBankDetails,
                      ...initialData,
                  }
                : initialBankDetails
        );

        setErrors({});

        if (initialData) {
            setEditing(false);
        }
    };

    // =========================================================
    // EDIT
    // =========================================================

    const handleEdit = () => {
        setEditing(true);
    };

    // =========================================================
    // CLOSE MESSAGE
    // =========================================================

    const handleCloseMessage = () => {
        setMessage((prev) => ({
            ...prev,
            open: false,
        }));
    };

    // =========================================================
    // MASK ACCOUNT NUMBER
    // =========================================================

    const getMaskedAccountNumber = () => {
        const account =
            formData.accountNumber || "";

        if (account.length <= 4) {
            return account;
        }

        return `${"•".repeat(
            Math.max(0, account.length - 4)
        )}${account.slice(-4)}`;
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Box sx={{ width: "100%" }}>
            {/* =====================================================
                PAGE HEADER
               ===================================================== */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    gap: 2,
                    mb: 3,
                    flexWrap: "wrap",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                    }}
                >
                    <AccountBalance
                        color="primary"
                        sx={{ fontSize: 38 }}
                    />

                    <Box>
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                        >
                            Bank Details
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Manage your payment and
                            settlement bank account.
                        </Typography>
                    </Box>
                </Box>

                {!editing &&
                    !readOnly && (
                        <Button
                            variant="outlined"
                            startIcon={<Edit />}
                            onClick={handleEdit}
                        >
                            Edit Details
                        </Button>
                    )}
            </Box>

            {/* =====================================================
                ACCOUNT SUMMARY
               ===================================================== */}

            <Card
                elevation={2}
                sx={{
                    mb: 3,
                    borderRadius: 2,
                }}
            >
                <CardContent>
                    <Grid
                        container
                        spacing={2}
                        alignItems="center"
                    >
                        <Grid
                            item
                            xs={12}
                            md={7}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    gap: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 55,
                                        height: 55,
                                        borderRadius: 2,
                                        display: "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        bgcolor:
                                            "primary.main",
                                        color:
                                            "primary.contrastText",
                                    }}
                                >
                                    <AccountBalance />
                                </Box>

                                <Box>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="bold"
                                    >
                                        {formData.bankName ||
                                            "Bank Account"}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {formData.accountHolderName ||
                                            "Account holder"}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontFamily:
                                                "monospace",
                                            mt: 0.5,
                                        }}
                                    >
                                        {getMaskedAccountNumber() ||
                                            "•••• •••• ••••"}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            md={5}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent:
                                        {
                                            xs: "flex-start",
                                            md: "flex-end",
                                        },
                                    gap: 1,
                                    flexWrap: "wrap",
                                }}
                            >
                                {formData.isPrimary && (
                                    <Chip
                                        label="Primary Account"
                                        color="primary"
                                        size="small"
                                    />
                                )}

                                {formData.isVerified ? (
                                    <Chip
                                        icon={
                                            <CheckCircle />
                                        }
                                        label="Verified"
                                        color="success"
                                        size="small"
                                    />
                                ) : (
                                    <Chip
                                        label="Not Verified"
                                        color="warning"
                                        size="small"
                                    />
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* =====================================================
                FORM
               ===================================================== */}

            <Paper
                elevation={2}
                sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: 2,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                    }}
                >
                    <AccountBalance color="primary" />

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        Account Information
                    </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Grid
                    container
                    spacing={2}
                >
                    {/* =================================================
                        BANK NAME
                       ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            required
                            label="Bank Name"
                            name="bankName"
                            value={
                                formData.bankName
                            }
                            onChange={
                                handleChange
                            }
                            error={
                                !!errors.bankName
                            }
                            helperText={
                                errors.bankName
                            }
                            disabled={
                                !editing
                            }
                        />
                    </Grid>

                    {/* =================================================
                        ACCOUNT HOLDER
                       ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            required
                            label="Account Holder Name"
                            name="accountHolderName"
                            value={
                                formData.accountHolderName
                            }
                            onChange={
                                handleChange
                            }
                            error={
                                !!errors.accountHolderName
                            }
                            helperText={
                                errors.accountHolderName
                            }
                            disabled={
                                !editing
                            }
                        />
                    </Grid>

                    {/* =================================================
                        ACCOUNT NUMBER
                       ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            required
                            label="Account Number"
                            name="accountNumber"
                            type="password"
                            value={
                                formData.accountNumber
                            }
                            onChange={
                                handleChange
                            }
                            error={
                                !!errors.accountNumber
                            }
                            helperText={
                                errors.accountNumber ||
                                "Enter 9–18 digit account number"
                            }
                            disabled={
                                !editing
                            }
                        />
                    </Grid>

                    {/* =================================================
                        CONFIRM ACCOUNT
                       ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            required
                            label="Confirm Account Number"
                            name="confirmAccountNumber"
                            type="password"
                            value={
                                formData.confirmAccountNumber
                            }
                            onChange={
                                handleChange
                            }
                            error={
                                !!errors.confirmAccountNumber
                            }
                            helperText={
                                errors.confirmAccountNumber
                            }
                            disabled={
                                !editing
                            }
                        />
                    </Grid>

                    {/* =================================================
                        IFSC
                       ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            required
                            label="IFSC Code"
                            name="ifscCode"
                            value={
                                formData.ifscCode
                            }
                            onChange={
                                handleChange
                            }
                            error={
                                !!errors.ifscCode
                            }
                            helperText={
                                errors.ifscCode ||
                                "Example: SBIN0001234"
                            }
                            inputProps={{
                                style: {
                                    textTransform:
                                        "uppercase",
                                },
                            }}
                            disabled={
                                !editing
                            }
                        />
                    </Grid>

                    {/* =================================================
                        BRANCH
                       ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            required
                            label="Branch Name"
                            name="branchName"
                            value={
                                formData.branchName
                            }
                            onChange={
                                handleChange
                            }
                            error={
                                !!errors.branchName
                            }
                            helperText={
                                errors.branchName
                            }
                            disabled={
                                !editing
                            }
                        />
                    </Grid>

                    {/* =================================================
                        ACCOUNT TYPE
                       ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            select
                            label="Account Type"
                            name="accountType"
                            value={
                                formData.accountType
                            }
                            onChange={
                                handleChange
                            }
                            disabled={
                                !editing
                            }
                        >
                            <MenuItem value="Savings">
                                Savings
                            </MenuItem>

                            <MenuItem value="Current">
                                Current
                            </MenuItem>

                            <MenuItem value="Business">
                                Business
                            </MenuItem>
                        </TextField>
                    </Grid>

                    {/* =================================================
                        UPI
                       ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            label="UPI ID"
                            name="upiId"
                            placeholder="example@upi"
                            value={
                                formData.upiId
                            }
                            onChange={
                                handleChange
                            }
                            error={
                                !!errors.upiId
                            }
                            helperText={
                                errors.upiId ||
                                "Optional"
                            }
                            disabled={
                                !editing
                            }
                        />
                    </Grid>

                    {/* =================================================
                        SWIFT
                       ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            label="SWIFT Code"
                            name="swiftCode"
                            value={
                                formData.swiftCode
                            }
                            onChange={
                                handleChange
                            }
                            helperText="Optional – required for international settlements"
                            disabled={
                                !editing
                            }
                        />
                    </Grid>

                    {/* =================================================
                        BANK ADDRESS
                       ================================================= */}

                    <Grid
                        item
                        xs={12}
                    >
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Bank Address"
                            name="bankAddress"
                            value={
                                formData.bankAddress
                            }
                            onChange={
                                handleChange
                            }
                            helperText="Optional"
                            disabled={
                                !editing
                            }
                        />
                    </Grid>
                </Grid>

                {/* =====================================================
                    SECURITY NOTICE
                   ===================================================== */}

                <Alert
                    severity="info"
                    icon={<Lock />}
                    sx={{ mt: 3 }}
                >
                    Your bank details should be handled
                    securely. Do not expose account numbers
                    or banking credentials in client-side
                    logs or public URLs.
                </Alert>

                {/* =====================================================
                    ACTIONS
                   ===================================================== */}

                {editing && !readOnly && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent:
                                "flex-end",
                            gap: 2,
                            mt: 3,
                            flexWrap: "wrap",
                        }}
                    >
                        <Button
                            variant="outlined"
                            startIcon={
                                <Refresh />
                            }
                            onClick={
                                handleReset
                            }
                            disabled={saving}
                        >
                            Reset
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={
                                <Save />
                            }
                            onClick={
                                handleSave
                            }
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Save Bank Details"}
                        </Button>
                    </Box>
                )}
            </Paper>

            {/* =====================================================
                SUCCESS / ERROR MESSAGE
               ===================================================== */}

            <Snackbar
                open={message.open}
                autoHideDuration={4000}
                onClose={
                    handleCloseMessage
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                <Alert
                    onClose={
                        handleCloseMessage
                    }
                    severity={message.type}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {message.text}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default BankDetails;