import React from "react";
import {
    Box,
    Paper,
    Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import BrandForm from "./BrandForm";

const SERVER_URL = "http://localhost:5000";

const BrandCreate = () => {

    const navigate = useNavigate();

    // =========================================================
    // CREATE BRAND
    // =========================================================

    const handleSave = async (values) => {

        try {

            const response = await fetch(
                `${SERVER_URL}/api/brand`,
                {
                    method: "POST",

                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(values)
                }
            );

            const data =
                await response.json().catch(() => null);

            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    data?.error ||
                    "Unable to create brand."
                );

            }

            console.log(
                "Brand Created:",
                data
            );

            alert(
                "Brand Created Successfully."
            );

            navigate("/brands");

        } catch (error) {

            console.error(
                "Create Brand Error:",
                error
            );

            alert(
                error.message ||
                "Unable to Create Brand."
            );

        }
    };


    // =========================================================
    // CANCEL
    // =========================================================

    const handleCancel = () => {

        navigate("/brands");

    };


    // =========================================================
    // UI
    // =========================================================

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
