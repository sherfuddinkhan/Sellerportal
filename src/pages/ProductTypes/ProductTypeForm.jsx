import React, { useEffect, useState } from "react";

import {
    Grid,
    TextField,
    Switch,
    FormControlLabel,
    Button,
    Stack
} from "@mui/material";

const ProductTypeForm = ({
    initialValues,
    loading,
    onSubmit,
    onCancel
}) => {

    const [formData, setFormData] = useState(initialValues);

    useEffect(() => {

        setFormData(initialValues);

    }, [initialValues]);

    const handleChange = (e) => {

        const {

            name,

            value,

            checked,

            type

        } = e.target;

        setFormData(prev => ({

            ...prev,

            [name]:

                type === "checkbox"

                    ? checked

                    : value

        }));

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit(formData);

    };

    return (

        <form onSubmit={handleSubmit}>

            <Grid container spacing={3}>

                <Grid item xs={12} md={6}>

                    <TextField

                        fullWidth

                        required

                        label="Product Type Name"

                        name="productTypeName"

                        value={
                            formData.productTypeName || ""
                        }

                        onChange={handleChange}

                    />

                </Grid>

                <Grid item xs={12}>

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

                    />

                </Grid>

                <Grid item xs={12}>

                    <FormControlLabel

                        control={

                            <Switch

                                checked={
                                    formData.isActive || false
                                }

                                name="isActive"

                                onChange={handleChange}

                            />

                        }

                        label="Active"

                    />

                </Grid>

                <Grid item xs={12}>

                    <Stack

                        direction="row"

                        spacing={2}

                        justifyContent="flex-end"

                    >

                        <Button

                            variant="outlined"

                            onClick={onCancel}

                        >

                            Cancel

                        </Button>

                        <Button

                            type="submit"

                            variant="contained"

                            disabled={loading}

                        >

                            {

                                loading

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

export default ProductTypeForm;