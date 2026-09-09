// =========================================================
// ProductImageDetails.jsx
// Product Image Details
// Frontend uses server.js
// NO apiService
// =========================================================

import React, {
    useEffect,
    useState
} from "react";

import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Image as ImageIcon
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";


// =========================================================
// SERVER URL
// =========================================================

const SERVER_URL = "http://localhost:5000";


// =========================================================
// PRODUCT IMAGE DETAILS
// =========================================================

const ProductImageDetails = () => {

    const navigate = useNavigate();

    const { id } = useParams();


    // =====================================================
    // STATE
    // =====================================================

    const [image, setImage] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD PRODUCT IMAGE
    // =====================================================

    useEffect(() => {

        if (!id) {

            setError(
                "Product Image ID is missing."
            );

            setLoading(false);

            return;
        }

        loadProductImage();

    }, [id]);


    // =====================================================
    // FETCH PRODUCT IMAGE
    //
    // GET:
    // /api/product-images/{id}
    // =====================================================

   const loadProductImage = async () => { 
    try { 
    setLoading(true); 
    setError(""); console.log( "========================================" ); 
    console.log( "Loading Product Image" ); 
    console.log( "ID:", id );
    const url = `${SERVER_URL}/api/product-images/${id}`; 
    console.log( "Request URL:", url ); 
    console.log( "========================================" ); 
    const response = await fetch(url, { method: "GET", headers: { Accept: "application/json" } });
     // ===================================================== // READ RESPONSE // ===================================================== const contentType = response.headers.get( "content-type" ); let responseData; if ( contentType && contentType.includes( "application/json" ) ) { responseData = await response.json(); } else { responseData = await response.text(); } console.log( "HTTP Status:", response.status ); console.log( "API Response:", responseData ); // ===================================================== // HANDLE ERROR // ===================================================== if (!response.ok) { let message = `Failed to fetch product image. HTTP ${response.status}`; // ASP.NET validation response if ( responseData && typeof responseData === "object" ) { if ( responseData.errors ) { const validationErrors = Object.entries( responseData.errors ) .map( ([field, errors]) => { const errorMessages = Array.isArray(errors) ? errors.join(", ") : String(errors); return `${field}: ${errorMessages}`; } ) .join(" | "); message = validationErrors || responseData.title || message; } else { message = responseData.message || responseData.title || responseData.error || message; } } else if ( typeof responseData === "string" && responseData.trim() ) { message = responseData; } throw new Error( message ); } // ===================================================== // EXTRACT PRODUCT IMAGE // ===================================================== const productImage = responseData?.data ?? responseData?.item ?? responseData; if ( !productImage || typeof productImage !== "object" ) { throw new Error( "Product image was not found." ); } console.log( "Product Image:", productImage ); setImage( productImage ); } catch (err) { console.error( "Product Image Details Error:", err ); 
    setError( err?.message || "Failed to fetch product image." ); 
     } 
     finally 
     { 
        setLoading(false); 
     } 
    };


    // =====================================================
    // GET VALUE
    // Supports PascalCase + camelCase
    // =====================================================

    const getValue = (
        pascalCase,
        camelCase,
        fallback = ""
    ) => {

        if (!image) {

            return fallback;

        }

        return (
            image?.[pascalCase] ??
            image?.[camelCase] ??
            fallback
        );

    };


    // =====================================================
    // BOOLEAN VALUE
    // =====================================================

    const getBooleanValue = (
        pascalCase,
        camelCase,
        fallback = false
    ) => {

        const value =
            getValue(
                pascalCase,
                camelCase,
                fallback
            );


        if (
            value === true ||
            value === 1 ||
            value === "1" ||
            value === "true" ||
            value === "True"
        ) {

            return true;

        }


        return false;

    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (value) => {

        if (!value) {

            return "—";

        }

        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "—";

        }


        return date.toLocaleString();

    };


    // =====================================================
    // BACK
    // =====================================================

    const handleBack = () => {

        navigate(
            "/product-images"
        );

    };


    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = () => {

        const productImageId =
            getValue(
                "ProductImageId",
                "productImageId",
                id
            );


        navigate(
            `/product-images/edit/${productImageId}`
        );

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Box
                sx={{
                    minHeight: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >

                <CircularProgress />

            </Box>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error || !image) {

        return (

            <Box sx={{ p: 3 }}>

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error ||
                        "Product image not found."}
                </Alert>


                <Button
                    variant="outlined"
                    startIcon={
                        <ArrowBack />
                    }
                    onClick={
                        handleBack
                    }
                >
                    Back to Product Images
                </Button>

            </Box>

        );

    }


    // =====================================================
    // IMAGE VALUES
    // =====================================================

    const productImageId =
        getValue(
            "ProductImageId",
            "productImageId"
        );


    const productId =
        getValue(
            "ProductId",
            "productId"
        );


    const imageUrl =
        getValue(
            "ImageUrl",
            "imageUrl"
        );


    const imageName =
        getValue(
            "ImageName",
            "imageName"
        );


    const imageType =
        getValue(
            "ImageType",
            "imageType"
        );


    const isPrimary =
        getBooleanValue(
            "IsPrimary",
            "isPrimary"
        );


    const isActive =
        getBooleanValue(
            "IsActive",
            "isActive"
        );


    const createdDate =
        getValue(
            "CreatedDate",
            "createdDate"
        );


    const updatedDate =
        getValue(
            "UpdatedDate",
            "updatedDate"
        );


    // =====================================================
    // UI
    // =====================================================

    return (

        <Box sx={{ p: 3 }}>


            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    gap: 2,
                    mb: 3,
                    flexWrap: "wrap"
                }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >
                        Product Image Details
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        View product image information
                    </Typography>

                </Box>


                <Box
                    sx={{
                        display: "flex",
                        gap: 1
                    }}
                >

                    <Button
                        variant="outlined"
                        startIcon={
                            <ArrowBack />
                        }
                        onClick={
                            handleBack
                        }
                    >
                        Back
                    </Button>


                    <Button
                        variant="contained"
                        startIcon={
                            <Edit />
                        }
                        onClick={
                            handleEdit
                        }
                    >
                        Edit
                    </Button>

                </Box>

            </Box>


            {/* =================================================
                IMAGE PREVIEW
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    mb: 3
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                >
                    Image Preview
                </Typography>


                <Divider
                    sx={{ mb: 3 }}
                />


                <Box
                    sx={{
                        minHeight: 300,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        p: 2
                    }}
                >

                    {imageUrl ? (

                        <Box
                            component="img"
                            src={imageUrl}
                            alt={
                                imageName ||
                                "Product Image"
                            }
                            sx={{
                                maxWidth: "100%",
                                maxHeight: 350,
                                objectFit: "contain",
                                borderRadius: 1
                            }}
                            onError={(event) => {

                                event.currentTarget.style.display =
                                    "none";

                            }}
                        />

                    ) : (

                        <Box
                            sx={{
                                textAlign: "center",
                                color:
                                    "text.secondary"
                            }}
                        >

                            <ImageIcon
                                sx={{
                                    fontSize: 70
                                }}
                            />

                            <Typography>
                                No image available
                            </Typography>

                        </Box>

                    )}

                </Box>

            </Paper>


            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    mb: 3
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                >
                    Basic Information
                </Typography>


                <Divider
                    sx={{ mb: 3 }}
                />


                <Grid
                    container
                    spacing={3}
                >

                    {/* PRODUCT IMAGE ID */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Product Image ID
                        </Typography>

                        <Typography
                            variant="body1"
                            fontWeight="600"
                        >
                            {productImageId ||
                                "—"}
                        </Typography>

                    </Grid>


                    {/* PRODUCT ID */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Product ID
                        </Typography>

                        <Typography
                            variant="body1"
                            fontWeight="600"
                        >
                            {productId ||
                                "—"}
                        </Typography>

                    </Grid>


                    {/* IMAGE NAME */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Image Name
                        </Typography>

                        <Typography
                            variant="body1"
                            fontWeight="600"
                        >
                            {imageName ||
                                "—"}
                        </Typography>

                    </Grid>


                    {/* IMAGE TYPE */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Image Type
                        </Typography>

                        <Box sx={{ mt: 0.5 }}>

                            <Chip
                                label={
                                    imageType ||
                                    "Unknown"
                                }
                                variant="outlined"
                            />

                        </Box>

                    </Grid>


                    {/* IMAGE URL */}

                    <Grid
                        item
                        xs={12}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Image URL
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                wordBreak:
                                    "break-all"
                            }}
                        >
                            {imageUrl ||
                                "—"}
                        </Typography>

                    </Grid>

                </Grid>

            </Paper>


            {/* =================================================
                STATUS
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    mb: 3
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                >
                    Status
                </Typography>


                <Divider
                    sx={{ mb: 3 }}
                />


                <Grid
                    container
                    spacing={3}
                >

                    {/* PRIMARY */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Primary Image
                        </Typography>


                        <Box sx={{ mt: 0.5 }}>

                            <Chip
                                label={
                                    isPrimary
                                        ? "Primary"
                                        : "Not Primary"
                                }
                                color={
                                    isPrimary
                                        ? "success"
                                        : "default"
                                }
                            />

                        </Box>

                    </Grid>


                    {/* ACTIVE */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Status
                        </Typography>


                        <Box sx={{ mt: 0.5 }}>

                            <Chip
                                label={
                                    isActive
                                        ? "Active"
                                        : "Inactive"
                                }
                                color={
                                    isActive
                                        ? "success"
                                        : "default"
                                }
                            />

                        </Box>

                    </Grid>

                </Grid>

            </Paper>


            {/* =================================================
                RECORD INFORMATION
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 3
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                >
                    Record Information
                </Typography>


                <Divider
                    sx={{ mb: 3 }}
                />


                <Grid
                    container
                    spacing={3}
                >

                    {/* CREATED */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Created Date
                        </Typography>

                        <Typography
                            variant="body1"
                        >
                            {formatDate(
                                createdDate
                            )}
                        </Typography>

                    </Grid>


                    {/* UPDATED */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Updated Date
                        </Typography>

                        <Typography
                            variant="body1"
                        >
                            {formatDate(
                                updatedDate
                            )}
                        </Typography>

                    </Grid>

                </Grid>

            </Paper>

        </Box>

    );

};


export default ProductImageDetails;
