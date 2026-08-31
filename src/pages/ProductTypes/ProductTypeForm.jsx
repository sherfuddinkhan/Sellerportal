// =========================================================
// ProductTypeForm.jsx
// Reusable Create / Edit Product Type Form
// =========================================================

import React, {
    useEffect,
    useState,
} from "react";

import {
    Button,
    FormControlLabel,
    Grid,
    Stack,
    Switch,
    TextField,
} from "@mui/material";


// =========================================================
// DEFAULT FORM VALUES
// =========================================================

const DEFAULT_VALUES = {
    productTypeName: "",
    description: "",
    isActive: true,
};


// =========================================================
// PRODUCT TYPE FORM
// =========================================================

const ProductTypeForm = ({
    initialValues = DEFAULT_VALUES,
    loading = false,
    onSubmit,
    onCancel,
}) => {

    // =====================================================
    // FORM STATE
    // =====================================================

    const [formData, setFormData] = useState({
        ...DEFAULT_VALUES,
        ...initialValues,
    });


    // =====================================================
    // UPDATE FORM WHEN INITIAL VALUES CHANGE
    // =====================================================

    useEffect(() => {

        setFormData({
            ...DEFAULT_VALUES,
            ...initialValues,
        });

    }, [initialValues]);


    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value,
            checked,
            type,
        } = event.target;

        setFormData((previous) => ({
            ...previous,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));

    };


    // =====================================================
    // HANDLE SUBMIT
    // =====================================================

    const handleSubmit = (event) => {

        event.preventDefault();

        if (loading) {
            return;
        }

        const cleanedData = {
            ...formData,

            productTypeName:
                formData.productTypeName?.trim() || "",

            description:
                formData.description?.trim() || "",

            isActive:
                Boolean(formData.isActive),
        };

        onSubmit(cleanedData);

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <form onSubmit={handleSubmit}>

            <Grid
                container
                spacing={3}
            >

                {/* =================================================
                    PRODUCT TYPE NAME
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <TextField
                        fullWidth
                        required
                        label="Product Type Name"
                        name="productTypeName"
                        value={
                            formData.productTypeName || ""
                        }
                        onChange={handleChange}
                        disabled={loading}
                        autoComplete="off"
                    />

                </Grid>


                {/* =================================================
                    DESCRIPTION
                ================================================= */}

                <Grid
                    item
                    xs={12}
                >

                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Description"
                        name="description"
                        value={
                            formData.description || ""
                        }
                        onChange={handleChange}
                        disabled={loading}
                    />

                </Grid>


                {/* =================================================
                    ACTIVE / INACTIVE
                ================================================= */}

                <Grid
                    item
                    xs={12}
                >

                    <FormControlLabel

                        control={

                            <Switch

                                checked={
                                    Boolean(
                                        formData.isActive
                                    )
                                }

                                name="isActive"

                                onChange={
                                    handleChange
                                }

                                disabled={
                                    loading
                                }

                            />

                        }

                        label={
                            formData.isActive
                                ? "Active"
                                : "Inactive"
                        }

                    />

                </Grid>


                {/* =================================================
                    ACTION BUTTONS
                ================================================= */}

                <Grid
                    item
                    xs={12}
                >

                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="flex-end"
                    >

                        {/* -----------------------------------------
                            CANCEL
                        ----------------------------------------- */}

                        <Button
                            type="button"
                            variant="outlined"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancel
                        </Button>


                        {/* -----------------------------------------
                            SAVE
                        ----------------------------------------- */}

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={
                                loading ||
                                !formData.productTypeName?.trim()
                            }
                        >

                            {loading
                                ? "Saving..."
                                : "Save"
                            }

                        </Button>

                    </Stack>

                </Grid>

            </Grid>

        </form>

    );
};


// =========================================================
// EXPORT
// =========================================================

export default ProductTypeForm;
