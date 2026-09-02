// =========================================================
// ProductAttributeEdit.jsx
// Edit Product Attribute
// =========================================================

import React, { useEffect, useState } from "react";

import {
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    FormControlLabel,
    Checkbox,
    MenuItem,
    Alert,
    CircularProgress,
    Box,
    Divider
} from "@mui/material";


// =========================================================
// COMPONENT
// =========================================================

const ProductAttributeEdit = ({
    attribute,
    onSave,
    onCancel,
    loading = false
}) => {

    // =====================================================
    // FORM STATE
    // =====================================================

    const [formData, setFormData] = useState({
        ProductAttributeId: 0,
        ProductId: "",
        AttributeName: "",
        AttributeValue: "",
        AttributeType: "",
        IsRequired: false,
        IsActive: true
    });

    const [error, setError] = useState("");


    // =====================================================
    // LOAD ATTRIBUTE
    // =====================================================

    useEffect(() => {

        if (!attribute) {
            return;
        }

        setFormData({
            ProductAttributeId:
                attribute.productAttributeId ??
                attribute.ProductAttributeId ??
                0,

            ProductId:
                attribute.productId ??
                attribute.ProductId ??
                "",

            AttributeName:
                attribute.attributeName ??
                attribute.AttributeName ??
                "",

            AttributeValue:
                attribute.attributeValue ??
                attribute.AttributeValue ??
                "",

            AttributeType:
                attribute.attributeType ??
                attribute.AttributeType ??
                "",

            IsRequired:
                attribute.isRequired ??
                attribute.IsRequired ??
                false,

            IsActive:
                attribute.isActive ??
                attribute.IsActive ??
                true
        });

        setError("");

    }, [attribute]);


    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value,
            checked,
            type
        } = event.target;

        setFormData((previous) => ({
            ...previous,

            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));

        setError("");
    };


    // =====================================================
    // VALIDATION
    // =====================================================

    const validateForm = () => {

        if (!formData.ProductId) {
            setError("Product ID is required.");
            return false;
        }

        if (!formData.AttributeName.trim()) {
            setError("Attribute Name is required.");
            return false;
        }

        if (!formData.AttributeValue.trim()) {
            setError("Attribute Value is required.");
            return false;
        }

        if (!formData.AttributeType.trim()) {
            setError("Attribute Type is required.");
            return false;
        }

        return true;
    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = (event) => {

        event.preventDefault();

        setError("");

        if (!validateForm()) {
            return;
        }

        const payload = {
            ProductAttributeId:
                Number(formData.ProductAttributeId),

            ProductId:
                Number(formData.ProductId),

            AttributeName:
                formData.AttributeName.trim(),

            AttributeValue:
                formData.AttributeValue.trim(),

            AttributeType:
                formData.AttributeType.trim(),

            IsRequired:
                Boolean(formData.IsRequired),

            IsActive:
                Boolean(formData.IsActive)
        };

        onSave?.(payload);
    };


    // =====================================================
    // NO ATTRIBUTE
    // =====================================================

    if (!attribute) {

        return (
            <Paper
                sx={{
                    p: 4
                }}
            >
                <Typography
                    color="text.secondary"
                    align="center"
                >
                    Product Attribute not found.
                </Typography>
            </Paper>
        );
    }


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Paper
            elevation={3}
            sx={{
                p: 3,
                borderRadius: 2
            }}
        >

            <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                    mb: 2
                }}
            >
                Edit Product Attribute
            </Typography>

            <Divider
                sx={{
                    mb: 3
                }}
            />


            {error && (

                <Alert
                    severity="error"
                    sx={{
                        mb: 3
                    }}
                >
                    {error}
                </Alert>

            )}


            <Box
                component="form"
                onSubmit={handleSubmit}
            >

                <Grid
                    container
                    spacing={3}
                >

                    {/* ATTRIBUTE ID */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            label="Attribute ID"
                            value={
                                formData.ProductAttributeId
                            }
                            disabled
                        />

                    </Grid>


                    {/* PRODUCT ID */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            required
                            type="number"
                            name="ProductId"
                            label="Product ID"
                            value={formData.ProductId}
                            onChange={handleChange}
                        />

                    </Grid>


                    {/* ATTRIBUTE NAME */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            required
                            name="AttributeName"
                            label="Attribute Name"
                            placeholder="Example: Color"
                            value={formData.AttributeName}
                            onChange={handleChange}
                        />

                    </Grid>


                    {/* ATTRIBUTE TYPE */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            required
                            select
                            name="AttributeType"
                            label="Attribute Type"
                            value={formData.AttributeType}
                            onChange={handleChange}
                        >

                            <MenuItem value="">
                                Select Attribute Type
                            </MenuItem>

                            <MenuItem value="Text">
                                Text
                            </MenuItem>

                            <MenuItem value="Number">
                                Number
                            </MenuItem>

                            <MenuItem value="Boolean">
                                Boolean
                            </MenuItem>

                            <MenuItem value="Date">
                                Date
                            </MenuItem>

                            <MenuItem value="Dropdown">
                                Dropdown
                            </MenuItem>

                        </TextField>

                    </Grid>


                    {/* ATTRIBUTE VALUE */}

                    <Grid
                        item
                        xs={12}
                    >

                        <TextField
                            fullWidth
                            required
                            multiline
                            minRows={3}
                            name="AttributeValue"
                            label="Attribute Value"
                            placeholder="Enter attribute value"
                            value={formData.AttributeValue}
                            onChange={handleChange}
                        />

                    </Grid>


                    {/* REQUIRED */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="IsRequired"
                                    checked={
                                        formData.IsRequired
                                    }
                                    onChange={handleChange}
                                />
                            }
                            label="Required Attribute"
                        />

                    </Grid>


                    {/* ACTIVE */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="IsActive"
                                    checked={
                                        formData.IsActive
                                    }
                                    onChange={handleChange}
                                />
                            }
                            label="Active"
                        />

                    </Grid>


                    {/* ACTIONS */}

                    <Grid
                        item
                        xs={12}
                    >

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 2
                            }}
                        >

                            <Button
                                variant="outlined"
                                onClick={() =>
                                    onCancel?.()
                                }
                                disabled={loading}
                            >
                                Cancel
                            </Button>


                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                            >

                                {loading ? (
                                    <>
                                        <CircularProgress
                                            size={20}
                                            sx={{
                                                mr: 1
                                            }}
                                        />
                                        Updating...
                                    </>
                                ) : (
                                    "Update Attribute"
                                )}

                            </Button>

                        </Box>

                    </Grid>

                </Grid>

            </Box>

        </Paper>
    );
};


export default ProductAttributeEdit;

