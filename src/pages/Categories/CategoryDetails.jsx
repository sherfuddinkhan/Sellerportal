import React, { useEffect, useState } from "react";

import {
    Paper,
    Grid,
    Typography,
    Chip,
    Button,
    Divider,
    CircularProgress,
    Box
} from "@mui/material";

import {
    ArrowBack,
    Edit
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import apiService from "../../services/apiService";

const CategoryDetails = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const [loading, setLoading] = useState(true);

    const [category, setCategory] = useState(null);

    useEffect(() => {

        loadCategory();

    }, []);

    const loadCategory = async () => {

        try {

            setLoading(true);

            const response =
                await apiService.getCategoryById(id);

            setCategory(response.data);

        }
        catch (err) {

            console.log(err);

        }
        finally {

            setLoading(false);

        }

    };

    if (loading)

        return (

            <Box

                display="flex"

                justifyContent="center"

                mt={5}

            >

                <CircularProgress />

            </Box>

        );

    if (!category)

        return (

            <Typography>

                Category not found.

            </Typography>

        );

    return (

        <Paper sx={{ p: 4 }}>

            <Grid

                container

                justifyContent="space-between"

                alignItems="center"

                mb={2}

            >

                <Typography

                    variant="h5"

                    fontWeight="bold"

                >

                    Category Details

                </Typography>

                <Box>

                    <Button

                        startIcon={<ArrowBack />}

                        sx={{ mr: 2 }}

                        variant="outlined"

                        onClick={() =>
                            navigate("/categories")
                        }

                    >

                        Back

                    </Button>

                    <Button

                        startIcon={<Edit />}

                        variant="contained"

                        onClick={() =>
                            navigate(`/categories/edit/${id}`)
                        }

                    >

                        Edit

                    </Button>

                </Box>

            </Grid>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>

                <Grid item xs={12} md={6}>

                    <Typography
                        color="text.secondary"
                    >
                        Category Name
                    </Typography>

                    <Typography
                        variant="h6"
                    >
                        {category.categoryName}
                    </Typography>

                </Grid>

                <Grid item xs={12} md={6}>

                    <Typography
                        color="text.secondary"
                    >
                        Parent Category
                    </Typography>

                    <Typography
                        variant="h6"
                    >
                        {category.parentCategoryName || "Root"}
                    </Typography>

                </Grid>

                <Grid item xs={12}>

                    <Typography
                        color="text.secondary"
                    >
                        Description
                    </Typography>

                    <Typography>

                        {category.description || "-"}

                    </Typography>

                </Grid>

                <Grid item xs={12} md={6}>

                    <Typography
                        color="text.secondary"
                    >
                        Status
                    </Typography>

                    <Chip

                        label={
                            category.isActive
                                ? "Active"
                                : "Inactive"
                        }

                        color={
                            category.isActive
                                ? "success"
                                : "error"
                        }

                    />

                </Grid>

                <Grid item xs={12} md={6}>

                    <Typography
                        color="text.secondary"
                    >
                        Created Date
                    </Typography>

                    <Typography>

                        {

                            category.createdDate

                                ? new Date(

                                    category.createdDate

                                ).toLocaleString()

                                : "-"

                        }

                    </Typography>

                </Grid>

                <Grid item xs={12} md={6}>

                    <Typography
                        color="text.secondary"
                    >
                        Updated Date
                    </Typography>

                    <Typography>

                        {

                            category.updatedDate

                                ? new Date(

                                    category.updatedDate

                                ).toLocaleString()

                                : "-"

                        }

                    </Typography>

                </Grid>

                <Grid item xs={12} md={6}>

                    <Typography
                        color="text.secondary"
                    >
                        Category Id
                    </Typography>

                    <Typography>

                        {category.categoryId}

                    </Typography>

                </Grid>

            </Grid>

        </Paper>

    );

};

export default CategoryDetails;