import React from "react";
import {
    Box,
    Button,
    Typography,
    Stack
} from "@mui/material";

import {
    Add,
    Refresh,
    PictureAsPdf,
    FileDownload,
    Print
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const BrandToolbar = ({ onRefresh }) => {

    const navigate = useNavigate();

    const handleAddBrand = () => {

        navigate("/brands/create");

    };

    const handleExportExcel = () => {

        console.log("Export Excel");

    };

    const handleExportPDF = () => {

        console.log("Export PDF");

    };

    const handlePrint = () => {

        window.print();

    };

    return (

        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
                flexWrap: "wrap",
                gap: 2
            }}
        >

            <Box>

                <Typography
                    variant="h4"
                    fontWeight="bold"
                >
                    Brands
                </Typography>

                <Typography
                    color="text.secondary"
                >
                    Manage Product Brands
                </Typography>

            </Box>

            <Stack
                direction="row"
                spacing={2}
                flexWrap="wrap"
            >

                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddBrand}
                >
                    Add Brand
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={onRefresh}
                >
                    Refresh
                </Button>

                <Button
                    variant="outlined"
                    color="success"
                    startIcon={<FileDownload />}
                    onClick={handleExportExcel}
                >
                    Excel
                </Button>

                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<PictureAsPdf />}
                    onClick={handleExportPDF}
                >
                    PDF
                </Button>

                <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<Print />}
                    onClick={handlePrint}
                >
                    Print
                </Button>

            </Stack>

        </Box>

    );

};

export default BrandToolbar;