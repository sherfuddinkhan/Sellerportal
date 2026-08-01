import React from "react";
import apiService from "../../services/apiService";s
import {
    Box,
    Paper,
    Typography
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import BrandForm from "./BrandForm";

import apiService from "../../services/apiService";

const BrandCreate = () => {

    const navigate = useNavigate();

    const handleSave = async (values) => {

        try {

            await apiService.createBrand(values);

            alert("Brand Created Successfully.");

            navigate("/brands");

        }
        catch (error) {

            console.error(error);

            alert("Unable to Create Brand.");

        }

    };

    const handleCancel = () => {

        navigate("/brands");

    };

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
                    Create Brand
                </Typography>

                <BrandForm
                    onSubmit={handleSave}
                    onCancel={handleCancel}
                />

            </Paper>

        </Box>

    );

};

export default BrandCreate;