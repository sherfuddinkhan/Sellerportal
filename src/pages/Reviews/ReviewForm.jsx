import React, {
    useEffect,
    useState
} from "react";

import {
    Box,
    Button,
    Card,
    CardContent,
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
    Image,
    Save,
    Cancel
} from "@mui/icons-material";


/* =========================================================
   INITIAL FORM DATA
========================================================= */

const DEFAULT_FORM_DATA = {

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
   NORMALIZE INITIAL DATA
========================================================= */

const normalizeInitialData = (data) => {

    if (!data) {
        return DEFAULT_FORM_DATA;
    }


    let reviewImages = data.reviewImages || "";


    if (Array.isArray(reviewImages)) {

        reviewImages =
            reviewImages.join("\n");

    } else if (
        typeof reviewImages === "string"
    ) {

        const trimmed =
            reviewImages.trim();


        if (trimmed) {

            try {

                const parsed =
                    JSON.parse(trimmed);

                if (Array.isArray(parsed)) {

                    reviewImages =
                        parsed.join("\n");

                }

            } catch {
                // Keep original string.
            }

        }

    }


    return {

        customerName:
            data.customerName || "",

        customerImage:
            data.customerImage || "",

        verifiedBuyer:
            data.verifiedBuyer === true ||
            data.verifiedBuyer === "true" ||
            data.verifiedBuyer === "True" ||
            data.verifiedBuyer === "Yes" ||
            data.verifiedBuyer === 1,


        productName:
            data.productName || "",

        productSku:
            data.productSku || "",

        productImage:
            data.productImage || "",


        marketplace:
            data.marketplace || "",


        rating:
            Number(data.rating) || 5,


        reviewTitle:
            data.reviewTitle || "",

        reviewText:
            data.reviewText || "",


        helpfulCount:
            Number(data.helpfulCount) || 0,


        status:
            data.status || "Pending",


        reviewImages

    };

};


/* =========================================================
   REVIEW FORM
========================================================= */

const ReviewForm = ({

    initialData = null,

    onSubmit,

    onCancel,

    loading = false,

    submitLabel = "Save Review",

    cancelLabel = "Cancel"

}) => {


    /* =====================================================
       STATE
    ===================================================== */

    const [formData, setFormData] =
        useState(
            normalizeInitialData(
                initialData
            )
        );

    const [errors, setErrors] =
        useState({});


    /* =====================================================
       UPDATE FORM WHEN INITIAL DATA CHANGES
    ===================================================== */

    useEffect(() => {

        setFormData(
            normalizeInitialData(
                initialData
            )
        );

        setErrors({});

    }, [initialData]);


    /* =====================================================
       HANDLE CHANGE
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


        setErrors((previous) => ({

            ...previous,

            [name]: ""

        }));

    };


    /* =====================================================
       HANDLE RATING
    ===================================================== */

    const handleRatingChange = (event) => {

        const rating =
            Number(event.target.value);


        setFormData((previous) => ({

            ...previous,

            rating

        }));


        setErrors((previous) => ({

            ...previous,

            rating: ""

        }));

    };


    /* =====================================================
       VALIDATE FORM
    ===================================================== */

    const validateForm = () => {

        const validationErrors = {};


        if (!formData.customerName.trim()) {

            validationErrors.customerName =
                "Customer name is required.";

        }


        if (!formData.productName.trim()) {

            validationErrors.productName =
                "Product name is required.";

        }


        if (!formData.marketplace) {

            validationErrors.marketplace =
                "Marketplace is required.";

        }


        const rating =
            Number(formData.rating);


        if (
            !Number.isFinite(rating) ||
            rating < 1 ||
            rating > 5
        ) {

            validationErrors.rating =
                "Rating must be between 1 and 5.";

        }


        if (!formData.reviewTitle.trim()) {

            validationErrors.reviewTitle =
                "Review title is required.";

        }


        if (!formData.reviewText.trim()) {

            validationErrors.reviewText =
                "Review text is required.";

        }


        if (
            formData.helpfulCount !== "" &&
            Number(formData.helpfulCount) < 0
        ) {

            validationErrors.helpfulCount =
                "Helpful count cannot be negative.";

        }


        setErrors(
            validationErrors
        );


        return (
            Object.keys(
                validationErrors
            ).length === 0
        );

    };


    /* =====================================================
       BUILD PAYLOAD
    ===================================================== */

    const buildPayload = () => {

        const reviewImages =
            formData.reviewImages
                .split(/\r?\n/)
                .map((url) => url.trim())
                .filter(Boolean);


        return {

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
                    Number(
                        formData.helpfulCount
                    ) || 0
                ),


            status:
                formData.status,


            reviewImages

        };

    };


    /* =====================================================
       SUBMIT
    ===================================================== */

    const handleSubmit = async (event) => {

        event.preventDefault();


        const isValid =
            validateForm();


        if (!isValid) {
            return;
        }


        const payload =
            buildPayload();


        if (typeof onSubmit === "function") {

            await onSubmit(
                payload
            );

        }

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

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

                    {/* CUSTOMER NAME */}

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
                        error={
                            Boolean(
                                errors.customerName
                            )
                        }
                        helperText={
                            errors.customerName
                        }
                    />


                    {/* CUSTOMER IMAGE */}

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


                    {/* VERIFIED BUYER */}

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

                    {/* PRODUCT NAME */}

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
                        error={
                            Boolean(
                                errors.productName
                            )
                        }
                        helperText={
                            errors.productName
                        }
                    />


                    {/* PRODUCT SKU */}

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


                    {/* PRODUCT IMAGE */}

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
                        error={
                            Boolean(
                                errors.marketplace
                            )
                        }
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

                            <MenuItem value="">
                                Select Marketplace
                            </MenuItem>

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

                        {errors.marketplace && (
                            <Typography
                                variant="caption"
                                color="error"
                                sx={{
                                    mt: 0.5,
                                    ml: 1.5
                                }}
                            >
                                {
                                    errors.marketplace
                                }
                            </Typography>
                        )}

                    </FormControl>


                    {/* RATING */}

                    <FormControl
                        fullWidth
                        required
                        error={
                            Boolean(
                                errors.rating
                            )
                        }
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

                        {errors.rating && (
                            <Typography
                                variant="caption"
                                color="error"
                                sx={{
                                    mt: 0.5,
                                    ml: 1.5
                                }}
                            >
                                {errors.rating}
                            </Typography>
                        )}

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
                        error={
                            Boolean(
                                errors.reviewTitle
                            )
                        }
                        helperText={
                            errors.reviewTitle
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
                        error={
                            Boolean(
                                errors.helpfulCount
                            )
                        }
                        helperText={
                            errors.helpfulCount
                        }
                    />

                </Box>


                {/* =================================================
                    REVIEW TEXT
                ================================================= */}

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
                    error={
                        Boolean(
                            errors.reviewText
                        )
                    }
                    helperText={
                        errors.reviewText
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
                    FORM ACTIONS
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
                        startIcon={<Cancel />}
                        onClick={onCancel}
                        disabled={loading}
                    >
                        {cancelLabel}
                    </Button>


                    <Button
                        variant="contained"
                        type="submit"
                        startIcon={
                            loading
                                ? (
                                    null
                                )
                                : (
                                    <Save />
                                )
                        }
                        disabled={loading}
                    >

                        {loading
                            ? "Saving..."
                            : submitLabel}

                    </Button>

                </Stack>

            </CardContent>

        </Card>

    );

};


export default ReviewForm;

