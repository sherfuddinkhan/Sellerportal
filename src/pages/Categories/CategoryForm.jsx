import React, { useEffect, useState } from "react";

import {
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    Button,
    Stack
} from "@mui/material";

import apiService from "../../services/apiService";

const CategoryForm = ({
    initialValues,
    loading,
    onSubmit,
    onCancel
}) => {

    const [formData, setFormData] = useState(initialValues);

    const [parentCategories, setParentCategories] = useState([]);

    useEffect(() => {

        setFormData(initialValues);

    }, [initialValues]);

    useEffect(() => {

        loadParentCategories();

    }, []);

    const loadParentCategories = async () => {

        try {

            const response =
                await apiService.getCategories();

            setParentCategories(response.data);

        }
        catch (err) {

            console.log(err);

        }

    };

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

                        label="Category Name"

                        name="categoryName"

                        value={formData.categoryName || ""}

                        onChange={handleChange}

                    />

                </Grid>

                <Grid item xs={12} md={6}>

                    <FormControl fullWidth>

                        <InputLabel>

                            Parent Category

                        </InputLabel>

                        <Select

                            name="parentCategoryId"

                            label="Parent Category"

                            value={
                                formData.parentCategoryId || ""
                            }

                            onChange={handleChange}

                        >

                            <MenuItem value="">

                                None

                            </MenuItem>

                            {

                                parentCategories.map(item => (

                                    <MenuItem

                                        key={item.categoryId}

                                        value={item.categoryId}

                                    >

                                        {item.categoryName}

                                    </MenuItem>

                                ))

                            }

                        </Select>

                    </FormControl>

                </Grid>

                <Grid item xs={12}>

                    <TextField

                        fullWidth

                        multiline

                        rows={4}

                        label="Description"

                        name="description"

                        value={formData.description || ""}

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

export default CategoryForm;