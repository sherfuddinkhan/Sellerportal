import React, { useEffect, useState } from "react";
import apiService from "../../services/apiService";
import {Box,Paper,Typography,CircularProgress,Alert} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import BrandForm from "./BrandForm";
import apiService from "../../services/apiService";
const BrandEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [brand, setBrand] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        loadBrand();
    }, []);
    const loadBrand = async () => {
        try {
            setLoading(true);
            const response = await apiService.getBrandById(id);
            setBrand(response.data);
        }
        catch (err) {
            console.error(err);
            setError("Unable to load Brand.");
        }
        finally {
            setLoading(false);
        }
    };
    const handleUpdate = async (values) => {
        try {
            await apiService.updateBrand(id, values);
            alert("Brand Updated Successfully.");
            navigate("/brands");
        }
        catch (err) {
            console.error(err);
            alert("Unable to Update Brand.");
        }
    };
    const handleCancel = () => {
        navigate("/brands");
    };
    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                mt={10}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error">
                {error}
            </Alert>
        );
    }

    return (
        <Box p={3}>
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    borderRadius: 3
                }}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                >
                    Edit Brand
                </Typography>
                <BrandForm
                    initialValues={brand}
                    onSubmit={handleUpdate}
                    onCancel={handleCancel}
                />
            </Paper>
        </Box>
    );
};

export default BrandEdit;