// ======================================================
// ReviewCreate.jsx
// ======================================================

import React, {
    useState,
} from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Switch,
    TextField,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    Image,
    Save,
} from "@mui/icons-material";

import axios from "axios";

import {
    useNavigate,
} from "react-router-dom";


// ======================================================
// API
// ======================================================

const SERVER_URL = "http://localhost:5000";

const REVIEW_API =
    `${SERVER_URL}/api/reviews`;


// ======================================================
// Initial Form Data
// ======================================================

const INITIAL_FORM_DATA = {

    reviewId: 0,

    // ==============================================
    // IDs
    // ==============================================

    customerId: 3,

    sellerId: 6,

    productId: 6,


    // ==============================================
    // Customer
    // ==============================================

    customerName: "",

    customerImage: "",

    verifiedBuyer: false,


    // ==============================================
    // Product
    // ==============================================

    productName: "",

    productSku: "",

    productImage: "",


    // ==============================================
    // Review
    // ==============================================

    marketplace: "",

    rating: 5,

    reviewTitle: "",

    reviewText: "",


    // ==============================================
    // Other
    // ==============================================

    helpfulCount: 0,

    status: "Pending",

    reviewImages: "",

    createdDate: null,
};


// ======================================================
// Review Create
// ======================================================

const ReviewCreate = () => {

    const navigate =
        useNavigate();


    // ==================================================
    // State
    // ==================================================

    const [
        formData,
        setFormData,
    ] = useState(
        INITIAL_FORM_DATA
    );


    const [
        loading,
        setLoading,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState("");


    const [
        success,
        setSuccess,
    ] = useState("");


    // ==================================================
    // Handle Change
    // ==================================================

    const handleChange = (
        event
    ) => {

        const {
            name,
            value,
            type,
            checked,
        } = event.target;


        setFormData(
            (previous) => ({

                ...previous,

                [name]:
                    type === "checkbox"
                        ? checked
                        : value,

            })
        );


        setError("");

        setSuccess("");
    };


    // ==================================================
    // Rating Change
    // ==================================================

    const handleRatingChange = (
        event
    ) => {

        setFormData(
            (previous) => ({

                ...previous,

                rating:
                    Number(
                        event.target.value
                    ),

            })
        );


        setError("");

        setSuccess("");
    };


    // ==================================================
    // Validate
    // ==================================================

    const validateForm = () => {

        if (
            !Number(formData.customerId)
        ) {

            return "Customer ID is required.";

        }


        if (
            !Number(formData.sellerId)
        ) {

            return "Seller ID is required.";

        }


        if (
            !Number(formData.productId)
        ) {

            return "Product ID is required.";

        }


        if (
            !formData.customerName.trim()
        ) {

            return "Customer name is required.";

        }


        if (
            !formData.productName.trim()
        ) {

            return "Product name is required.";

        }


        if (
            !formData.marketplace
        ) {

            return "Marketplace is required.";

        }


        const rating =
            Number(
                formData.rating
            );


        if (
            !Number.isInteger(rating) ||
            rating < 1 ||
            rating > 5
        ) {

            return "Rating must be between 1 and 5.";

        }


        if (
            !formData.reviewTitle.trim()
        ) {

            return "Review title is required.";

        }


        if (
            !formData.reviewText.trim()
        ) {

            return "Review text is required.";

        }


        return "";
    };


    // ==================================================
    // Review Images
    //
    // Database column:
    // ReviewImages NVARCHAR(MAX)
    //
    // C#:
    // public string? ReviewImages { get; set; }
    // ==================================================

    const getReviewImages = () => {

        if (
            !formData.reviewImages ||
            !formData.reviewImages.trim()
        ) {

            return "";
        }


        return formData.reviewImages
            .split("\n")
            .map(
                (url) =>
                    url.trim()
            )
            .filter(
                Boolean
            )
            .join("\n");
    };


    // ==================================================
    // Create Review
    // ==================================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        setError("");

        setSuccess("");


        // ==============================================
        // Validation
        // ==============================================

        const validationError =
            validateForm();


        if (
            validationError
        ) {

            setError(
                validationError
            );

            return;
        }


        // ==============================================
        // Payload
        // ==============================================

        const payload = {

            reviewId: 0,


            // ==========================================
            // IDs
            // ==========================================

            customerId:
                Number(
                    formData.customerId
                ),

            sellerId:
                Number(
                    formData.sellerId
                ),

            productId:
                Number(
                    formData.productId
                ),


            // ==========================================
            // Customer
            // ==========================================

            customerName:
                formData.customerName.trim(),

            customerImage:
                formData.customerImage.trim() ||
                null,

            verifiedBuyer:
                Boolean(
                    formData.verifiedBuyer
                ),


            // ==========================================
            // Product
            // ==========================================

            productName:
                formData.productName.trim(),

            productSku:
                formData.productSku.trim() ||
                null,

            productImage:
                formData.productImage.trim() ||
                null,


            // ==========================================
            // Review
            // ==========================================

            marketplace:
                formData.marketplace,

            rating:
                Number(
                    formData.rating
                ),

            reviewTitle:
                formData.reviewTitle.trim(),

            reviewText:
                formData.reviewText.trim(),


            // ==========================================
            // Other
            // ==========================================

            helpfulCount:
                Number(
                    formData.helpfulCount
                ) || 0,

            status:
                formData.status ||
                "Pending",

            reviewImages:
                getReviewImages(),

            createdDate:
                formData.createdDate ||
                new Date().toISOString(),
        };


        // ==============================================
        // Console
        // ==============================================

        console.log(
            "================================="
        );

        console.log(
            "CREATE REVIEW PAYLOAD"
        );

        console.log(
            JSON.stringify(
                payload,
                null,
                2
            )
        );

        console.log(
            "================================="
        );


        // ==============================================
        // API Request
        // ==============================================

        try {

            setLoading(true);


            const response =
                await axios.post(
                    REVIEW_API,
                    payload,
                    {
                        headers: {

                            "Content-Type":
                                "application/json",

                            "Accept":
                                "application/json",

                        },
                    }
                );


            // ==========================================
            // Success
            // ==========================================

            console.log(
                "REVIEW CREATED:",
                response.data
            );


            setSuccess(
                "Review created successfully."
            );


            // ==========================================
            // Redirect
            // ==========================================

            setTimeout(
                () => {

                    navigate(
                        "/reviews"
                    );

                },
                800
            );

        }
        catch (err) {

            // ==========================================
            // Error Logging
            // ==========================================

            console.error(
                "================================="
            );

            console.error(
                "CREATE REVIEW ERROR"
            );

            console.error(
                "STATUS:",
                err?.response?.status
            );

            console.error(
                "DATA:",
                err?.response?.data
            );

            console.error(
                "MESSAGE:",
                err?.message
            );

            console.error(
                "================================="
            );


            // ==========================================
            // Error Message
            // ==========================================

            const responseData =
                err?.response?.data;


            let message =
                "Unable to create review.";


            if (
                responseData?.message
            ) {

                message =
                    responseData.message;

            }
            else if (
                responseData?.title
            ) {

                message =
                    responseData.title;

            }
            else if (
                responseData?.errors
            ) {

                message =
                    Object.entries(
                        responseData.errors
                    )
                    .map(
                        ([field, errors]) => {

                            return `${field}: ${errors.join(", ")}`;

                        }
                    )
                    .join(" | ");

            }
            else if (
                typeof responseData ===
                "string"
            ) {

                message =
                    responseData;

            }
            else if (
                err?.message
            ) {

                message =
                    err.message;
            }


            setError(message);

        }
        finally {

            setLoading(false);

        }
    };


    // ==================================================
    // Reset
    // ==================================================

    const handleReset = () => {

        setFormData(
            INITIAL_FORM_DATA
        );

        setError("");

        setSuccess("");
    };


    // ==================================================
    // Back
    // ==================================================

    const handleBack = () => {

        navigate(
            "/reviews"
        );
    };


    // ==================================================
    // JSX
    // ==================================================

    return (

        <Box
            sx={{
                width: "100%",
                p: 3,
            }}
        >

            {/* ==========================================
                Header
            ========================================== */}

            <Stack
                direction={{
                    xs: "column",
                    sm: "row",
                }}
                justifyContent="space-between"
                alignItems={{
                    xs: "flex-start",
                    sm: "center",
                }}
                spacing={2}
                sx={{
                    mb: 3,
                }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        Create Review
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 0.5,
                        }}
                    >
                        Add a new customer review.
                    </Typography>

                </Box>


                <Button
                    variant="outlined"
                    startIcon={
                        <ArrowBack />
                    }
                    onClick={
                        handleBack
                    }
                >
                    Back to Reviews
                </Button>

            </Stack>


            {/* ==========================================
                Error
            ========================================== */}

            {error && (

                <Alert
                    severity="error"
                    sx={{
                        mb: 2,
                    }}
                >
                    {error}
                </Alert>

            )}


            {/* ==========================================
                Success
            ========================================== */}

            {success && (

                <Alert
                    severity="success"
                    sx={{
                        mb: 2,
                    }}
                >
                    {success}
                </Alert>

            )}


            {/* ==========================================
                Form
            ========================================== */}

            <Card
                elevation={2}
            >

                <CardContent
                    component="form"
                    onSubmit={
                        handleSubmit
                    }
                >

                    {/* ==================================
                        Customer Information
                    ================================== */}

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                            mb: 2,
                        }}
                    >
                        Customer Information
                    </Typography>


                    <Box
                        sx={{
                            display: "grid",

                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "1fr 1fr",
                            },

                            gap: 2,
                        }}
                    >

                        <TextField
                            fullWidth
                            type="number"
                            label="Customer ID"
                            name="customerId"
                            value={
                                formData.customerId
                            }
                            onChange={
                                handleChange
                            }
                        />


                        <TextField
                            fullWidth
                            required
                            label="Customer Name"
                            name="customerName"
                            value={
                                formData.customerName
                            }
                            onChange={
                                handleChange
                            }
                        />


                        <TextField
                            fullWidth
                            label="Customer Image URL"
                            name="customerImage"
                            value={
                                formData.customerImage
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="https://..."
                        />


                        <FormControlLabel
                            control={

                                <Switch
                                    checked={
                                        formData.verifiedBuyer
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    name="verifiedBuyer"
                                />

                            }
                            label="Verified Buyer"
                        />

                    </Box>


                    <Divider
                        sx={{
                            my: 4,
                        }}
                    />


                    {/* ==================================
                        Product Information
                    ================================== */}

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                            mb: 2,
                        }}
                    >
                        Product Information
                    </Typography>


                    <Box
                        sx={{
                            display: "grid",

                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "1fr 1fr",
                            },

                            gap: 2,
                        }}
                    >

                        <TextField
                            fullWidth
                            type="number"
                            label="Seller ID"
                            name="sellerId"
                            value={
                                formData.sellerId
                            }
                            onChange={
                                handleChange
                            }
                        />


                        <TextField
                            fullWidth
                            type="number"
                            label="Product ID"
                            name="productId"
                            value={
                                formData.productId
                            }
                            onChange={
                                handleChange
                            }
                        />


                        <TextField
                            fullWidth
                            required
                            label="Product Name"
                            name="productName"
                            value={
                                formData.productName
                            }
                            onChange={
                                handleChange
                            }
                        />


                        <TextField
                            fullWidth
                            label="Product SKU"
                            name="productSku"
                            value={
                                formData.productSku
                            }
                            onChange={
                                handleChange
                            }
                        />


                        <TextField
                            fullWidth
                            label="Product Image URL"
                            name="productImage"
                            value={
                                formData.productImage
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="https://..."
                        />

                    </Box>


                    <Divider
                        sx={{
                            my: 4,
                        }}
                    />


                    {/* ==================================
                        Review Information
                    ================================== */}

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                            mb: 2,
                        }}
                    >
                        Review Information
                    </Typography>


                    <Box
                        sx={{
                            display: "grid",

                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "1fr 1fr",
                            },

                            gap: 2,
                        }}
                    >

                        {/* Marketplace */}

                        <FormControl
                            fullWidth
                            required
                        >

                            <InputLabel>
                                Marketplace
                            </InputLabel>

                            <Select
                                label="Marketplace"
                                name="marketplace"
                                value={
                                    formData.marketplace
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <MenuItem value="Amazon">
                                    Amazon
                                </MenuItem>

                                <MenuItem value="Flipkart">
                                    Flipkart
                                </MenuItem>

                                <MenuItem value="Meesho">
                                    Meesho
                                </MenuItem>

                                <MenuItem value="Shopify">
                                    Shopify
                                </MenuItem>

                                <MenuItem value="Myntra">
                                    Myntra
                                </MenuItem>

                            </Select>

                        </FormControl>


                        {/* Rating */}

                        <FormControl
                            fullWidth
                            required
                        >

                            <InputLabel>
                                Rating
                            </InputLabel>

                            <Select
                                label="Rating"
                                name="rating"
                                value={
                                    formData.rating
                                }
                                onChange={
                                    handleRatingChange
                                }
                            >

                                <MenuItem value={5}>
                                    5 - Excellent
                                </MenuItem>

                                <MenuItem value={4}>
                                    4 - Good
                                </MenuItem>

                                <MenuItem value={3}>
                                    3 - Average
                                </MenuItem>

                                <MenuItem value={2}>
                                    2 - Poor
                                </MenuItem>

                                <MenuItem value={1}>
                                    1 - Very Poor
                                </MenuItem>

                            </Select>

                        </FormControl>


                        {/* Review Title */}

                        <TextField
                            fullWidth
                            required
                            label="Review Title"
                            name="reviewTitle"
                            value={
                                formData.reviewTitle
                            }
                            onChange={
                                handleChange
                            }
                        />


                        {/* Status */}

                        <FormControl
                            fullWidth
                        >

                            <InputLabel>
                                Status
                            </InputLabel>

                            <Select
                                label="Status"
                                name="status"
                                value={
                                    formData.status
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <MenuItem value="Pending">
                                    Pending
                                </MenuItem>

                                <MenuItem value="Approved">
                                    Approved
                                </MenuItem>

                                <MenuItem value="Rejected">
                                    Rejected
                                </MenuItem>

                            </Select>

                        </FormControl>


                        {/* Helpful Count */}

                        <TextField
                            fullWidth
                            type="number"
                            label="Helpful Count"
                            name="helpfulCount"
                            value={
                                formData.helpfulCount
                            }
                            onChange={
                                handleChange
                            }
                            inputProps={{
                                min: 0,
                            }}
                        />

                    </Box>


                    {/* Review Text */}

                    <TextField
                        fullWidth
                        required
                        multiline
                        minRows={5}
                        label="Review Text"
                        name="reviewText"
                        value={
                            formData.reviewText
                        }
                        onChange={
                            handleChange
                        }
                        sx={{
                            mt: 2,
                        }}
                    />


                    <Divider
                        sx={{
                            my: 4,
                        }}
                    />


                    {/* ==================================
                        Review Images
                    ================================== */}

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                            mb: 1,
                        }}
                    >
                        Review Images
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 2,
                        }}
                    >
                        Enter one image URL per line.
                    </Typography>


                    <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        label="Review Image URLs"
                        name="reviewImages"
                        value={
                            formData.reviewImages
                        }
                        onChange={
                            handleChange
                        }
                        placeholder={
                            "https://example.com/image1.jpg\nhttps://example.com/image2.jpg"
                        }
                        InputProps={{
                            startAdornment: (

                                <Image
                                    sx={{
                                        mr: 1,
                                        color:
                                            "text.secondary",
                                    }}
                                />

                            ),
                        }}
                    />


                    <Divider
                        sx={{
                            my: 4,
                        }}
                    />


                    {/* ==================================
                        Actions
                    ================================== */}

                    <Stack
                        direction={{
                            xs: "column-reverse",
                            sm: "row",
                        }}
                        spacing={2}
                        justifyContent="flex-end"
                    >

                        <Button
                            variant="outlined"
                            onClick={
                                handleReset
                            }
                            disabled={
                                loading
                            }
                        >
                            Reset
                        </Button>


                        <Button
                            variant="contained"
                            type="submit"
                            startIcon={

                                loading ? (

                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />

                                ) : (

                                    <Save />

                                )

                            }
                            disabled={
                                loading
                            }
                        >
                            {
                                loading
                                    ? "Creating..."
                                    : "Create Review"
                            }
                        </Button>

                    </Stack>

                </CardContent>

            </Card>

        </Box>
    );
};


// ======================================================
// Export
// ======================================================

export default ReviewCreate;