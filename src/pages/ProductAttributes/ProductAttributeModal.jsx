// =========================================================
// ProductAttributeModal.jsx
// Create / Edit Product Attribute
// =========================================================

import React, {
    useEffect,
    useState
} from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    FormControlLabel,
    Checkbox
} from "@mui/material";


// =========================================================
// INITIAL STATE
// =========================================================

const initialState = {
    ProductAttributeId: 0,
    ProductId: "",
    AttributeName: "",
    AttributeValue: "",
    AttributeType: "",
    IsRequired: false,
    IsActive: true
};


// =========================================================
// COMPONENT
// =========================================================

const ProductAttributeModal = ({
    open,
    attribute,
    onClose,
    onSave
}) => {

    const [formData, setFormData] =
        useState(initialState);


    // =====================================================
    // LOAD ATTRIBUTE FOR EDIT
    // =====================================================

    useEffect(() => {

        if (attribute) {

            setFormData({

                ProductAttributeId:
                    attribute.ProductAttributeId ??
                    attribute.productAttributeId ??
                    0,

                ProductId:
                    attribute.ProductId ??
                    attribute.productId ??
                    "",

                AttributeName:
                    attribute.AttributeName ??
                    attribute.attributeName ??
                    "",

                AttributeValue:
                    attribute.AttributeValue ??
                    attribute.attributeValue ??
                    "",

                AttributeType:
                    attribute.AttributeType ??
                    attribute.attributeType ??
                    "",

                IsRequired:
                    attribute.IsRequired ??
                    attribute.isRequired ??
                    false,

                IsActive:
                    attribute.IsActive ??
                    attribute.isActive ??
                    true
            });

        }
        else {

            setFormData(initialState);

        }

    }, [attribute, open]);


    // =====================================================
    // HANDLE INPUT CHANGE
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
    };


    // =====================================================
    // VALIDATION
    // =====================================================

    const validateForm = () => {

        if (!formData.ProductId) {

            alert(
                "Product ID is required."
            );

            return false;
        }


        if (
            !formData.AttributeName ||
            !formData.AttributeName.trim()
        ) {

            alert(
                "Attribute Name is required."
            );

            return false;
        }


        return true;
    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = () => {

        if (!validateForm())
            return;


        const payload = {

            ProductAttributeId:
                Number(
                    formData.ProductAttributeId
                ),

            ProductId:
                Number(
                    formData.ProductId
                ),

            AttributeName:
                formData.AttributeName.trim(),

            AttributeValue:
                formData.AttributeValue.trim(),

            AttributeType:
                formData.AttributeType.trim(),

            IsRequired:
                Boolean(
                    formData.IsRequired
                ),

            IsActive:
                Boolean(
                    formData.IsActive
                )
        };


        onSave(payload);
    };


    // =====================================================
    // RESET
    // =====================================================

    const handleClose = () => {

        setFormData(initialState);

        onClose();
    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle>

                {
                    formData.ProductAttributeId
                        ? "Edit Product Attribute"
                        : "Add Product Attribute"
                }

            </DialogTitle>


            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent dividers>

                <Grid
                    container
                    spacing={2}
                    sx={{ mt: 0.5 }}
                >

                    {/* =========================================
                        PRODUCT ID
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
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
                            inputProps={{
                                min: 1
                            }}
                        />

                    </Grid>


                    {/* =========================================
                        ATTRIBUTE NAME
                    ========================================= */}

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
                        />

                    </Grid>


                    {/* =========================================
                        ATTRIBUTE VALUE
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            label="Attribute Value"
                            name="AttributeValue"
                            value={
                                formData.AttributeValue
                            }
                            onChange={
                                handleChange
                            }
                        />

                    </Grid>


                    {/* =========================================
                        ATTRIBUTE TYPE
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            label="Attribute Type"
                            name="AttributeType"
                            placeholder="Example: Text, Number, Boolean"
                            value={
                                formData.AttributeType
                            }
                            onChange={
                                handleChange
                            }
                        />

                    </Grid>


                    {/* =========================================
                        REQUIRED
                    ========================================= */}

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
                                        Boolean(
                                            formData.IsRequired
                                        )
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            }

                            label="Required"

                        />

                    </Grid>


                    {/* =========================================
                        ACTIVE
                    ========================================= */}

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
                                        Boolean(
                                            formData.IsActive
                                        )
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            }

                            label="Active"

                        />

                    </Grid>

                </Grid>

            </DialogContent>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <DialogActions>

                <Button
                    onClick={handleClose}
                    variant="outlined"
                >
                    Cancel
                </Button>


                <Button
                    variant="contained"
                    onClick={handleSubmit}
                >

                    {
                        formData.ProductAttributeId
                            ? "Update"
                            : "Save"
                    }

                </Button>

            </DialogActions>

        </Dialog>
    );
};


export default ProductAttributeModal;
