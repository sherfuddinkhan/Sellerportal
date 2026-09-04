import React, {
    useEffect,
    useState
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
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Image,
    Save
} from "@mui/icons-material";

import axios from "axios";

import {
    useNavigate,
    useParams
} from "react-router-dom";


/* =========================================================
   API CONFIGURATION
========================================================= */

const SERVER_URL = "http://localhost:5000";

const REVIEW_API = `${SERVER_URL}/api/reviews`;


/* =========================================================
   INITIAL FORM DATA
========================================================= */

const INITIAL_FORM_DATA = {

    customerName: "",
    customerImage: "",
    verifiedBuyer: false,

    productName: "",
    productSku: "",
    productImage: "",

    marketplace: "",

    rating: 5,

    reviewTitle: "",
    reviewText: "",

    helpfulCount: 0,

    status: "Pending",

    reviewImages: ""

};


/* =========================================================
   NORMALIZE REVIEW IMAGES
========================================================= */

const normalizeReviewImages = (images) => {

    if (Array.isArray(images)) {

        return images
            .filter(Boolean)
            .map((image) => String(image).trim())
            .filter(Boolean);

    }


    if (typeof images === "string") {

        const trimmed =
            images.trim();

        if (!trimmed) {
            return [];
        }


        /*
         * Try JSON first.
         */

        try {

            const parsed =
                JSON.parse(trimmed);

            if (Array.isArray(parsed)) {

                return parsed
                    .filter(Boolean)
                    .map((image) =>
                        String(image).trim()
                    )
                    .filter(Boolean);

            }

        } catch {
            // Continue with text parsing.
        }


        /*
         * Support newline/comma separated URLs.
         */

        return trimmed
            .split(/\r?\n|,/)
            .map((image) => image.trim())
            .filter(Boolean);

    }


    return [];

};


/* =========================================================
   REVIEW EDIT
========================================================= */

const ReviewEdit = () => {

    const {
        id
    } = useParams();

    const navigate =
        useNavigate();


    /* =====================================================
       STATE
    ===================================================== */

    const [formData, setFormData] =
        useState(INITIAL_FORM_DATA);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    /* =====================================================
       LOAD REVIEW
    ===================================================== */

    const loadReview = async () => {

        if (!id || !/^\d+$/.test(id)) {

            setError(
                "Invalid Review ID."
            );

            setLoading(false);

            return;
        }


        try {

            setLoading(true);

            setError("");

            const response =
                await axios.get(
                    `${REVIEW_API}/${id}`
                );


            const review =
                response.data;


            console.log(
                "REVIEW FOR EDIT:",
                review
            );


            const reviewImages =
                normalizeReviewImages(
                    review?.reviewImages
                );


            setFormData({

                customerName:
                    review?.customerName || "",

                customerImage:
                    review?.customerImage || "",

                verifiedBuyer:
                    review?.verifiedBuyer === true ||
                    review?.verifiedBuyer === "true" ||
                    review?.verifiedBuyer === "True" ||
                    review?.verifiedBuyer === "Yes" ||
                    review?.verifiedBuyer === 1,


                productName:
                    review?.productName || "",

                productSku:
                    review?.productSku || "",

                productImage:
                    review?.productImage || "",


                marketplace:
                    review?.marketplace || "",


                rating:
                    Number(review?.rating) || 5,


                reviewTitle:
                    review?.reviewTitle || "",

                reviewText:
                    review?.reviewText || "",


                helpfulCount:
                    Number(review?.helpfulCount) || 0,


                status:
                    review?.status || "Pending",


                reviewImages:
                    reviewImages.join("\n")

            });


        } catch (err) {

            console.error(
                "LOAD REVIEW FOR EDIT ERROR:",
                err
            );


            const message =
                err?.response?.data?.message ||
                err?.response?.data?.title ||
                "Unable to load review.";


            setError(message);

        } finally {

            setLoading(false);

        }

    };


    /* =====================================================
       LOAD ON MOUNT
    ===================================================== */

    useEffect(() => {

        loadReview();

    }, [id]);


    /* =====================================================
       HANDLE INPUT CHANGE
    ===================================================== */

    const handleChange = (event) => {

        const {
            name,
            value,
            type,
            checked
        } = event.target;


        setFormData((previous) => ({

            ...previous,

            [name]:
                type === "checkbox"
                    ? checked
                    : value

        }));


        setError("");

        setSuccess("");

    };


    /* =====================================================
       HANDLE RATING
    ===================================================== */

    const handleRatingChange = (event) => {

        const value =
            Number(event.target.value);


        setFormData((previous) => ({

            ...previous,

            rating: value

        }));


        setError("");

        setSuccess("");

    };


    /* =====================================================
       VALIDATE FORM
    ===================================================== */

    const validateForm = () => {

        if (!formData.customerName.trim()) {

            return "Customer name is required.";

        }


        if (!formData.productName.trim()) {

            return "Product name is required.";

        }


        if (!formData.marketplace) {

            return "Marketplace is required.";

        }


        const rating =
            Number(formData.rating);


        if (
            !Number.isFinite(rating) ||
            rating < 1 ||
            rating > 5
        ) {

            return "Rating must be between 1 and 5.";

        }


        if (!formData.reviewTitle.trim()) {

            return "Review title is required.";

        }


        if (!formData.reviewText.trim()) {

            return "Review text is required.";

        }


        return "";

    };


    /* =====================================================
       GET REVIEW IMAGES
    ===================================================== */

    const getReviewImages = () => {

        if (!formData.reviewImages.trim()) {

            return [];

        }


        return formData.reviewImages
            .split(/\r?\n/)
            .map((url) => url.trim())
            .filter(Boolean);

    };


    /* =====================================================
       UPDATE REVIEW
    ===================================================== */

    const handleSubmit = async (event) => {

        event.preventDefault();


        setError("");

        setSuccess("");


        const validationError =
            validateForm();


        if (validationError) {

            setError(
                validationError
            );

            return;

        }


        const payload = {

            customerName:
                formData.customerName.trim(),

            customerImage:
                formData.customerImage.trim() ||
                null,

            verifiedBuyer:
                Boolean(
                    formData.verifiedBuyer
                ),


            productName:
                formData.productName.trim(),

            productSku:
                formData.productSku.trim() ||
                null,

            productImage:
                formData.productImage.trim() ||
                null,


            marketplace:
                formData.marketplace,


            rating:
                Number(formData.rating),


            reviewTitle:
                formData.reviewTitle.trim(),

            reviewText:
                formData.reviewText.trim(),


            helpfulCount:
                Math.max(
                    0,
                    Number(formData.helpfulCount) || 0
                ),


            status:
                formData.status,


            reviewImages:
                getReviewImages()

        };


        try {

            setSaving(true);


            const response =
                await axios.put(
                    `${REVIEW_API}/${id}`,
                    payload,
                    {
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );


            console.log(
                "REVIEW UPDATED:",
                response.data
            );


            setSuccess(
                "Review updated successfully."
            );


            setTimeout(() => {

                navigate(
                    `/reviews/details/${id}`
                );

            }, 800);


        } catch (err) {

            console.error(
                "UPDATE REVIEW ERROR:",
                err
            );


            const responseData =
                err?.response?.data;


            let message =
                responseData?.message ||
                responseData?.title ||
                "Unable to update review.";


            /*
             * ASP.NET ModelState errors.
             */

            if (
                responseData &&
                typeof responseData === "object" &&
                responseData.errors
            ) {

                const validationMessages =
                    Object.values(
                        responseData.errors
                    )
                    .flat()
                    .filter(Boolean);


                if (
                    validationMessages.length
                ) {

                    message =
                        validationMessages.join(" ");

                }

            }


            setError(message);

        } finally {

            setSaving(false);

        }

    };


    /* =====================================================
       BACK TO DETAILS
    ===================================================== */

    const handleBack = () => {

        navigate(
            `/reviews/details/${id}`
        );

    };


    /* =====================================================
       CANCEL
    ===================================================== */

    const handleCancel = () => {

        navigate(
            `/reviews/details/${id}`
        );

    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (
            <Box
                sx={{
                    width: "100%",
                    minHeight: 500,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >

                <Stack
                    spacing={2}
                    alignItems="center"
                >

                    <CircularProgress />

                    <Typography
                        color="text.secondary"
                    >
                        Loading review...
                    </Typography>

                </Stack>

            </Box>
        );

    }


    /* =====================================================
       INVALID / LOAD ERROR
    ===================================================== */

    if (error && !formData.customerName) {

        return (
            <Box
                sx={{
                    width: "100%",
                    p: 3
                }}
            >

                <Alert
                    severity="error"
                    sx={{
                        mb: 2
                    }}
                >
                    {error}
                </Alert>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                >
                    Back to Review
                </Button>

            </Box>
        );

    }


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Box
            sx={{
                width: "100%",
                p: 3
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <Stack
                direction={{
                    xs: "column",
                    sm: "row"
                }}
                justifyContent="space-between"
                alignItems={{
                    xs: "flex-start",
                    sm: "center"
                }}
                spacing={2}
                sx={{
                    mb: 3
                }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        Edit Review
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 0.5
                        }}
                    >
                        Update review information.
                    </Typography>

                </Box>


                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                >
                    Back to Review
                </Button>

            </Stack>


            {/* =================================================
                ALERTS
            ================================================= */}

            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 2
                    }}
                >
                    {error}
                </Alert>
            )}


            {success && (
                <Alert
                    severity="success"
                    sx={{
                        mb: 2
                    }}
                >
                    {success}
                </Alert>
            )}


            {/* =================================================
                FORM
            ================================================= */}

            <Card
                elevation={2}
            >

                <CardContent
                    component="form"
                    onSubmit={handleSubmit}
                >

                    {/* =================================================
                        CUSTOMER INFORMATION
                    ================================================= */}

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                            mb: 2
                        }}
                    >
                        Customer Information
                    </Typography>


                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "1fr 1fr"
                            },
                            gap: 2
                        }}
                    >

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
                            my: 4
                        }}
                    />


                    {/* =================================================
                        PRODUCT INFORMATION
                    ================================================= */}

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                            mb: 2
                        }}
                    >
                        Product Information
                    </Typography>


                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "1fr 1fr"
                            },
                            gap: 2
                        }}
                    >

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
                            my: 4
                        }}
                    />


                    {/* =================================================
                        REVIEW INFORMATION
                    ================================================= */}

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                            mb: 2
                        }}
                    >
                        Review Information
                    </Typography>


                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "1fr 1fr"
                            },
                            gap: 2
                        }}
                    >

                        {/* MARKETPLACE */}

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


                        {/* RATING */}

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


                        {/* REVIEW TITLE */}

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


                        {/* STATUS */}

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


                        {/* HELPFUL COUNT */}

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
                                min: 0
                            }}
                        />

                    </Box>


                    {/* REVIEW TEXT */}

                    <TextField
                        fullWidth
                        required
                        multiline
                        minRows={6}
                        label="Review Text"
                        name="reviewText"
                        value={
                            formData.reviewText
                        }
                        onChange={
                            handleChange
                        }
                        sx={{
                            mt: 2
                        }}
                    />


                    <Divider
                        sx={{
                            my: 4
                        }}
                    />


                    {/* =================================================
                        REVIEW IMAGES
                    ================================================= */}

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                            mb: 1
                        }}
                    >
                        Review Images
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 2
                        }}
                    >
                        Enter one image URL per line.
                    </Typography>


                    <TextField
                        fullWidth
                        multiline
                        minRows={5}
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
                                            "text.secondary"
                                    }}
                                />
                            )
                        }}
                    />


                    <Divider
                        sx={{
                            my: 4
                        }}
                    />


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <Stack
                        direction={{
                            xs: "column-reverse",
                            sm: "row"
                        }}
                        spacing={2}
                        justifyContent="flex-end"
                    >

                        <Button
                            variant="outlined"
                            onClick={handleCancel}
                            disabled={saving}
                        >
                            Cancel
                        </Button>


                        <Button
                            variant="contained"
                            type="submit"
                            startIcon={
                                saving ? (
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                ) : (
                                    <Save />
                                )
                            }
                            disabled={saving}
                        >
                            {saving
                                ? "Updating..."
                                : "Update Review"}
                        </Button>

                    </Stack>

                </CardContent>

            </Card>

        </Box>

    );

};


export default ReviewEdit;

