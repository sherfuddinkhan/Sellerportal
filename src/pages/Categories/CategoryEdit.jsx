import React, { useEffect, useState } from "react";

import {
    Paper,
    Typography,
    CircularProgress,
    Box,
    Snackbar,
    Alert
} from "@mui/material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import CategoryForm from "./CategoryForm";

import apiService from "../../services/apiService";

const CategoryEdit = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const [loading, setLoading] = useState(false);

    const [pageLoading, setPageLoading] = useState(true);

    const [category, setCategory] = useState({

        categoryName: "",

        description: "",

        parentCategoryId: "",

        isActive: true

    });

    const [snackbar, setSnackbar] = useState({

        open: false,

        severity: "success",

        message: ""

    });

    useEffect(() => {

        loadCategory();

    }, []);

    const loadCategory = async () => {

        try {

            setPageLoading(true);

            const response =
                await apiService.getCategoryById(id);

            setCategory(response.data);

        }
        catch (err) {

            console.log(err);

            setSnackbar({

                open: true,

                severity: "error",

                message: "Unable to load Category."

            });

        }
        finally {

            setPageLoading(false);

        }

    };

    const handleUpdate = async (values) => {

        try {

            setLoading(true);

            await apiService.updateCategory(id, values);

            setSnackbar({

                open: true,

                severity: "success",

                message: "Category updated successfully."

            });

            setTimeout(() => {

                navigate("/categories");

            }, 1000);

        }
        catch (err) {

            console.log(err);

            setSnackbar({

                open: true,

                severity: "error",

                message: "Unable to update Category."

            });

        }
        finally {

            setLoading(false);

        }

    };

    if (pageLoading)

        return (

            <Box

                display="flex"

                justifyContent="center"

                mt={5}

            >

                <CircularProgress />

            </Box>

        );

    return (

        <Paper sx={{ p: 3 }}>

            <Typography

                variant="h5"

                fontWeight="bold"

                mb={3}

            >

                Edit Category

            </Typography>

            <CategoryForm

                initialValues={category}

                loading={loading}

                onSubmit={handleUpdate}

                onCancel={() =>

                    navigate("/categories")

                }

            />

            <Snackbar

                open={snackbar.open}

                autoHideDuration={3000}

                onClose={() =>

                    setSnackbar({

                        ...snackbar,

                        open: false

                    })

                }

            >

                <Alert

                    severity={snackbar.severity}

                    variant="filled"

                >

                    {snackbar.message}

                </Alert>

            </Snackbar>

        </Paper>

    );

};

export default CategoryEdit;