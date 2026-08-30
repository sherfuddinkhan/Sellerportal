// =========================================================
// CategoryForm.jsx
// =========================================================

import React, {
    useEffect,
    useState
} from "react";

import axios from "axios";

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
    Stack,
    Alert,
    CircularProgress
} from "@mui/material";

// =========================================================
// SERVER
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const CategoryForm = ({
    initialValues = {},
    loading = false,
    onSubmit,
    onCancel
}) => {

    // =====================================================
    // FORM STATE
    // =====================================================

    const [formData, setFormData] = useState({

        categoryName: "",
        parentCategoryId: "",
        description: "",
        isActive: true,

        ...initialValues

    });

    // =====================================================
    // PARENT CATEGORIES
    // =====================================================

    const [parentCategories, setParentCategories] =
        useState([]);

    const [loadingParents, setLoadingParents] =
        useState(false);

    const [error, setError] =
        useState("");

    // =====================================================
    // UPDATE FORM WHEN INITIAL VALUES CHANGE
    // =====================================================

    useEffect(() => {

        setFormData({

            categoryName: "",
            parentCategoryId: "",
            description: "",
            isActive: true,

            ...initialValues

        });

    }, [initialValues]);

    // =====================================================
    // LOAD PARENT CATEGORIES
    // =====================================================

    useEffect(() => {

        loadParentCategories();

    }, []);

    // =====================================================
    // GET CATEGORIES FROM NODE SERVER
    // =====================================================

    const loadParentCategories = async () => {

        try {

            setLoadingParents(true);

            setError("");

            console.log(
                "GET PARENT CATEGORIES"
            );

            const response =
                await axios.get(
                    `${SERVER_URL}/api/categories`,
                    {
                        params: {
                            page: 1,
                            limit: 1000
                        },

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "PARENT CATEGORY RESPONSE:",
                response.data
            );

            // =================================================
            // NORMALIZE RESPONSE
            // =================================================

            let data =
                response.data;

            // -----------------------------------------------
            // { items: [] }
            // -----------------------------------------------

            if (
                data &&
                Array.isArray(data.items)
            ) {

                data =
                    data.items;

            }

            // -----------------------------------------------
            // { data: [] }
            // -----------------------------------------------

            else if (
                data &&
                Array.isArray(data.data)
            ) {

                data =
                    data.data;

            }

            // -----------------------------------------------
            // { categories: [] }
            // -----------------------------------------------

            else if (
                data &&
                Array.isArray(data.categories)
            ) {

                data =
                    data.categories;

            }

            // -----------------------------------------------
            // Direct array
            // -----------------------------------------------

            if (!Array.isArray(data)) {

                data = [];

            }

            // =================================================
            // REMOVE CURRENT CATEGORY FROM PARENT LIST
            // =================================================

            const currentId =
                initialValues?.categoryId;

            if (currentId) {

                data =
                    data.filter(
                        item =>
                            Number(
                                item.categoryId
                            ) !== Number(
                                currentId
                            )
                    );

            }

            setParentCategories(
                data
            );

        }
        catch (err) {

            console.error(
                "Parent category loading error:",
                err
            );

            const message =
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Failed to load categories";

            setError(
                typeof message === "string"
                    ? message
                    : "Failed to load categories"
            );

        }
        finally {

            setLoadingParents(false);

        }

    };

    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value,
            checked,
            type
        } = event.target;

        setFormData(
            previous => ({

                ...previous,

                [name]:
                    type === "checkbox"
                        ? checked
                        : value

            })
        );

    };

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = (event) => {

        event.preventDefault();

        const payload = {

            ...formData,

            categoryName:
                formData.categoryName?.trim(),

            description:
                formData.description?.trim(),

            parentCategoryId:
                formData.parentCategoryId === ""
                    ? null
                    : Number(
                        formData.parentCategoryId
                    ),

            isActive:
                Boolean(
                    formData.isActive
                )

        };

        console.log(
            "CATEGORY FORM SUBMIT:",
            payload
        );

        onSubmit(payload);

    };

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <form
            onSubmit={
                handleSubmit
            }
        >

            {/* =================================================
                ERROR
            ================================================== */}

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

            <Grid
                container
                spacing={3}
            >

                {/* =================================================
                    CATEGORY NAME
                ================================================== */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <TextField

                        fullWidth

                        required

                        label="Category Name"

                        name="categoryName"

                        value={
                            formData.categoryName ||
                            ""
                        }

                        onChange={
                            handleChange
                        }

                        disabled={
                            loading
                        }

                    />

                </Grid>

                {/* =================================================
                    PARENT CATEGORY
                ================================================== */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <FormControl
                        fullWidth
                    >

                        <InputLabel>
                            Parent Category
                        </InputLabel>

                        <Select

                            name="parentCategoryId"

                            label="Parent Category"

                            value={
                                formData.parentCategoryId ??
                                ""
                            }

                            onChange={
                                handleChange
                            }

                            disabled={
                                loading ||
                                loadingParents
                            }

                        >

                            <MenuItem value="">
                                None
                            </MenuItem>

                            {loadingParents ? (

                                <MenuItem
                                    disabled
                                >

                                    <CircularProgress
                                        size={20}
                                        sx={{
                                            mr: 1
                                        }}
                                    />

                                    Loading categories...

                                </MenuItem>

                            ) : (

                                parentCategories.map(
                                    (item) => (

                                        <MenuItem

                                            key={
                                                item.categoryId
                                            }

                                            value={
                                                item.categoryId
                                            }

                                        >

                                            {
                                                item.categoryName
                                            }

                                        </MenuItem>

                                    )
                                )

                            )}

                        </Select>

                    </FormControl>

                </Grid>

                {/* =================================================
                    DESCRIPTION
                ================================================== */}

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
                            formData.description ||
                            ""
                        }

                        onChange={
                            handleChange
                        }

                        disabled={
                            loading
                        }

                    />

                </Grid>

                {/* =================================================
                    ACTIVE
                ================================================== */}

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

                        label="Active"

                    />

                </Grid>

                {/* =================================================
                    BUTTONS
                ================================================== */}

                <Grid
                    item
                    xs={12}
                >

                    <Stack

                        direction="row"

                        spacing={2}

                        justifyContent="flex-end"

                    >

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

                        <Button

                            type="submit"

                            variant="contained"

                            disabled={
                                loading
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

export default CategoryForm;
