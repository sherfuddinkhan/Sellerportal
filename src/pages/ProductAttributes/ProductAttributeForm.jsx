// =========================================================
// ProductAttributeForm.jsx
// Product Attribute Create / Edit Form
// No apiService
// API calls are handled by the parent component
// =========================================================

import React, { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    Save,
} from "@mui/icons-material";

// =========================================================
// INITIAL FORM
// =========================================================

const EMPTY_FORM = {
    ProductAttributeId: 0,
    ProductId: "",
    SellerId: "",
    CustomerId: "",
    AttributeName: "",
    AttributeValue: "",
    IsActive: true,
    CreatedDate: "",
};

// =========================================================
// HELPERS
// =========================================================

const getValue = (object, pascal, camel, defaultValue = "") => {
    return (
        object?.[pascal] ??
        object?.[camel] ??
        defaultValue
    );
};

// =========================================================
// COMPONENT
// =========================================================

const ProductAttributeForm = ({
    attribute = null,

    onSubmit,

    onCancel,

    loading = false,

    mode = "create",
}) => {

    // =====================================================
    // STATE
    // =====================================================

    const [formData, setFormData] = useState(
        EMPTY_FORM
    );

    const [errors, setErrors] = useState({});

    // =====================================================
    // LOAD EDIT DATA
    // =====================================================

    useEffect(() => {

        if (attribute) {

            setFormData({
                ProductAttributeId:
                    getValue(
                        attribute,
                        "ProductAttributeId",
                        "productAttributeId",
                        0
                    ),

                ProductId:
                    getValue(
                        attribute,
                        "ProductId",
                        "productId"
                    ),

                SellerId:
                    getValue(
                        attribute,
                        "SellerId",
                        "sellerId"
                    ),

                CustomerId:
                    getValue(
                        attribute,
                        "CustomerId",
                        "customerId"
                    ),

                AttributeName:
                    getValue(
                        attribute,
                        "AttributeName",
                        "attributeName"
                    ),

                AttributeValue:
                    getValue(
                        attribute,
                        "AttributeValue",
                        "attributeValue"
                    ),

                IsActive:
                    getValue(
                        attribute,
                        "IsActive",
                        "isActive",
                        true
                    ),

                CreatedDate:
                    getValue(
                        attribute,
                        "CreatedDate",
                        "createdDate",
                        ""
                    ),
            });

        } else {

            setFormData({
                ...EMPTY_FORM,
                CreatedDate:
                    new Date().toISOString(),
            });

        }

        setErrors({});

    }, [attribute]);

    // =====================================================
    // HANDLE CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setFormData(
            (previous) => ({
                ...previous,

                [name]:
                    type === "checkbox"
                        ? checked
                        : value,
            })
        );

        setErrors(
            (previous) => ({
                ...previous,
                [name]: "",
            })
        );
    };

    // =====================================================
    // VALIDATE
    // =====================================================

    const validate = () => {

        const newErrors = {};

        if (!formData.ProductId) {
            newErrors.ProductId =
                "Product ID is required.";
        }

        if (!formData.SellerId) {
            newErrors.SellerId =
                "Seller ID is required.";
        }

        if (!formData.CustomerId) {
            newErrors.CustomerId =
                "Customer ID is required.";
        }

        if (!formData.AttributeName.trim()) {
            newErrors.AttributeName =
                "Attribute name is required.";
        }

        if (!formData.AttributeValue.trim()) {
            newErrors.AttributeValue =
                "Attribute value is required.";
        }

        setErrors(newErrors);

        return (
            Object.keys(newErrors).length === 0
        );
    };

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = (event) => {

        event.preventDefault();

        if (!validate()) {
            return;
        }

        const payload = {
            ProductAttributeId:
                Number(
                    formData.ProductAttributeId || 0
                ),

            ProductId:
                Number(formData.ProductId),

            SellerId:
                Number(formData.SellerId),

            CustomerId:
                Number(formData.CustomerId),

            AttributeName:
                formData.AttributeName.trim(),

            AttributeValue:
                formData.AttributeValue.trim(),

            IsActive:
                Boolean(formData.IsActive),

            CreatedDate:
                formData.CreatedDate
                    ? new Date(
                        formData.CreatedDate
                    ).toISOString()
                    : new Date().toISOString(),
        };

        console.log(
            "Product Attribute Form Payload:",
            payload
        );

        onSubmit?.(payload);
    };

    // =====================================================
    // FORMAT DATE FOR DATETIME-LOCAL
    // =====================================================

    const formatDateTimeLocal = (value) => {

        if (!value) {
            return "";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");

        const hours =
            String(
                date.getHours()
            ).padStart(2, "0");

        const minutes =
            String(
                date.getMinutes()
            ).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: 1100,
                mx: "auto",
                p: {
                    xs: 2,
                    sm: 3,
                },
            }}
        >

            {/* =================================================
                HEADER
                ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: {
                        xs: "flex-start",
                        sm: "center",
                    },
                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },
                    gap: 2,
                    mb: 3,
                }}
            >

                <Box>

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        {mode === "edit"
                            ? "Edit Product Attribute"
                            : "Product Attribute Form"}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        {mode === "edit"
                            ? "Update the product attribute details."
                            : "Enter the details for a new product attribute."}
                    </Typography>

                </Box>

                {onCancel && (
                    <Button
                        variant="outlined"
                        startIcon={
                            <ArrowBack />
                        }
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Back
                    </Button>
                )}

            </Box>

            {/* =================================================
                ERROR SUMMARY
                ================================================= */}

            {Object.keys(errors).length > 0 && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    Please correct the highlighted
                    fields before submitting.
                </Alert>
            )}

            {/* =================================================
                FORM
                ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: {
                        xs: 2,
                        sm: 3,
                        md: 4,
                    },
                    borderRadius: 2,
                }}
            >

                <form
                    onSubmit={handleSubmit}
                >

                    <Grid
                        container
                        spacing={3}
                    >

                        {/* =====================================
                            ATTRIBUTE ID
                            ===================================== */}

                        {mode === "edit" && (
                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Product Attribute ID"
                                    value={
                                        formData.ProductAttributeId
                                    }
                                    disabled
                                />

                            </Grid>
                        )}

                        {/* =====================================
                            PRODUCT ID
                            ===================================== */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={mode === "edit" ? 4 : 4}
                        >

                            <TextField
                                fullWidth
                                required
                                label="Product ID"
                                name="ProductId"
                                type="number"
                                value={
                                    formData.ProductId
                                }
                                onChange={
                                    handleChange
                                }
                                error={
                                    Boolean(
                                        errors.ProductId
                                    )
                                }
                                helperText={
                                    errors.ProductId
                                }
                                inputProps={{
                                    min: 1,
                                }}
                            />

                        </Grid>

                        {/* =====================================
                            SELLER ID
                            ===================================== */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                required
                                label="Seller ID"
                                name="SellerId"
                                type="number"
                                value={
                                    formData.SellerId
                                }
                                onChange={
                                    handleChange
                                }
                                error={
                                    Boolean(
                                        errors.SellerId
                                    )
                                }
                                helperText={
                                    errors.SellerId
                                }
                                inputProps={{
                                    min: 1,
                                }}
                            />

                        </Grid>

                        {/* =====================================
                            CUSTOMER ID
                            ===================================== */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                required
                                label="Customer ID"
                                name="CustomerId"
                                type="number"
                                value={
                                    formData.CustomerId
                                }
                                onChange={
                                    handleChange
                                }
                                error={
                                    Boolean(
                                        errors.CustomerId
                                    )
                                }
                                helperText={
                                    errors.CustomerId
                                }
                                inputProps={{
                                    min: 1,
                                }}
                            />

                        </Grid>

                        {/* =====================================
                            ATTRIBUTE NAME
                            ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                required
                                label="Attribute Name"
                                name="AttributeName"
                                value={
                                    formData.AttributeName
                                }
                                onChange={
                                    handleChange
                                }
                                error={
                                    Boolean(
                                        errors.AttributeName
                                    )
                                }
                                helperText={
                                    errors.AttributeName
                                }
                                placeholder="Example: Bluetooth Version"
                            />

                        </Grid>

                        {/* =====================================
                            ATTRIBUTE VALUE
                            ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                required
                                label="Attribute Value"
                                name="AttributeValue"
                                value={
                                    formData.AttributeValue
                                }
                                onChange={
                                    handleChange
                                }
                                error={
                                    Boolean(
                                        errors.AttributeValue
                                    )
                                }
                                helperText={
                                    errors.AttributeValue
                                }
                                placeholder="Example: Bluetooth 5.3"
                            />

                        </Grid>

                        {/* =====================================
                            CREATED DATE
                            ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                label="Created Date"
                                name="CreatedDate"
                                type="datetime-local"
                                value={
                                    formatDateTimeLocal(
                                        formData.CreatedDate
                                    )
                                }
                                onChange={
                                    (event) => {

                                        const value =
                                            event
                                                .target
                                                .value;

                                        setFormData(
                                            (previous) => ({
                                                ...previous,

                                                CreatedDate:
                                                    value
                                                        ? new Date(
                                                            value
                                                        ).toISOString()
                                                        : "",
                                            })
                                        );
                                    }
                                }
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                        </Grid>

                        {/* =====================================
                            ACTIVE
                            ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <Box
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    alignItems:
                                        "center",
                                }}
                            >

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="IsActive"
                                            checked={
                                                Boolean(
                                                    formData.IsActive
                                                )
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                loading
                                            }
                                        />
                                    }
                                    label="Active"
                                />

                            </Box>

                        </Grid>

                        {/* =====================================
                            ACTIONS
                            ===================================== */}

                        <Grid
                            item
                            xs={12}
                        >

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent:
                                        "flex-end",
                                    gap: 2,
                                    mt: 2,
                                    flexWrap: "wrap",
                                }}
                            >

                                {onCancel && (
                                    <Button
                                        variant="outlined"
                                        onClick={
                                            onCancel
                                        }
                                        disabled={
                                            loading
                                        }
                                    >
                                        Cancel
                                    </Button>
                                )}

                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={
                                        <Save />
                                    }
                                    disabled={
                                        loading
                                    }
                                >
                                    {loading
                                        ? "Saving..."
                                        : mode === "edit"
                                            ? "Update Attribute"
                                            : "Save Attribute"}
                                </Button>

                            </Box>

                        </Grid>

                    </Grid>

                </form>

            </Paper>

        </Box>
    );
};

export default ProductAttributeForm;

