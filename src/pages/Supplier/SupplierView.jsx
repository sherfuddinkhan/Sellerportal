import React, { useEffect, useState } from "react";

import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Typography,
    Grid,
    Divider,
    Alert
} from "@mui/material";

import {
    ArrowBack,
    Edit
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import axios from "axios";

import SupplierDetails from "./SupplierDetails";

const API_URL = "https://localhost:7203/api";

const SupplierView = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [supplier, setSupplier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadSupplier = async () => {

            try {

                const response =
                    await axios.get(
                        `${API_URL}/Supplier/${id}`
                    );

                setSupplier(response.data);

            } catch (err) {

                console.error(
                    "Supplier view error:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Failed to load supplier"
                );

            } finally {

                setLoading(false);

            }
        };

        loadSupplier();

    }, [id]);

    if (loading) {

        return (
            <Box
                display="flex"
                justifyContent="center"
                p={5}
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

    if (!supplier) {

        return (
            <Alert severity="warning">
                Supplier not found
            </Alert>
        );
    }

    return (

        <Box>

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >

                <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                >

                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() =>
                            navigate("/suppliers")
                        }
                    >
                        Back
                    </Button>

                    <Typography variant="h5">
                        Supplier Details
                    </Typography>

                </Box>

                <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() =>
                        navigate(
                            `/suppliers/edit/${id}`
                        )
                    }
                >
                    Edit
                </Button>

            </Box>

            <SupplierDetails
                supplier={supplier}
            />

        </Box>
    );
};

export default SupplierView;