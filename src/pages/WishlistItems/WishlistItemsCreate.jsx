import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import axios from "axios";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    MenuItem,
    Snackbar,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import {
    ArrowBack
} from "@mui/icons-material";


// ============================================================
// CONFIGURATION
// ============================================================

const SERVER_URL =
    import.meta.env.VITE_SERVER_URL ||
    "http://localhost:5000";

const API_URL = `${SERVER_URL}/api`;

const WISHLIST_ITEM_API =
    `${API_URL}/WishlistItem`;

const WISHLIST_API =
    `${API_URL}/Wishlist`;

const PRODUCT_API =
    `${API_URL}/products`;


// ============================================================
// COMPONENT
// ============================================================

const WishlistItemsCreate = ({
    onCreated
}) => {

    const navigate = useNavigate();


    // ========================================================
    // STATE
    // ========================================================

    const [loading, setLoading] = useState(false);

    const [loadingOptions, setLoadingOptions] =
        useState(true);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [wishlists, setWishlists] = useState([]);

    const [products, setProducts] = useState([]);


    const [formData, setFormData] = useState({
        wishlistId: "",
        sellerId: "",
        customerId: "",
        productId: ""
    });


    // ========================================================
    // LOAD WISHLISTS
    // ========================================================

    const loadWishlists = useCallback(async () => {

        try {

            const response = await axios.get(
                WISHLIST_API,
                {
                    timeout: 30000
                }
            );


            const data = response?.data;


            let list = [];


            if (Array.isArray(data)) {

                list = data;

            } else if (
                Array.isArray(data?.data)
            ) {

                list = data.data;

            } else if (
                Array.isArray(data?.items)
            ) {

                list = data.items;

            } else if (
                Array.isArray(data?.wishlists)
            ) {

                list = data.wishlists;
            }


            setWishlists(list);


        } catch (err) {

            console.error(
                "GET ALL WISHLISTS ERROR:",
                err
            );


            throw err;
        }

    }, []);


    // ========================================================
    // LOAD PRODUCTS
    // ========================================================

    const loadProducts = useCallback(async () => {

        try {

            console.log(
                "GET ALL PRODUCTS"
            );


            const response = await axios.get(
                PRODUCT_API,
                {
                    timeout: 30000
                }
            );


            console.log(
                "GET ALL PRODUCTS RESPONSE:",
                response?.data
            );


            const data = response?.data;


            let list = [];


            if (Array.isArray(data)) {

                list = data;

            } else if (
                Array.isArray(data?.data)
            ) {

                list = data.data;

            } else if (
                Array.isArray(data?.items)
            ) {

                list = data.items;

            } else if (
                Array.isArray(data?.products)
            ) {

                list = data.products;
            }


            setProducts(list);


        } catch (err) {

            console.error(
                "GET ALL PRODUCTS ERROR:",
                err
            );


            throw err;
        }

    }, []);


    // ========================================================
    // LOAD OPTIONS
    // ========================================================

    const loadOptions = useCallback(async () => {

        try {

            setLoadingOptions(true);

            setError("");


            const results =
                await Promise.allSettled([
                    loadWishlists(),
                    loadProducts()
                ]);


            const wishlistResult =
                results[0];

            const productResult =
                results[1];


            if (
                wishlistResult.status ===
                "rejected"
            ) {

                console.error(
                    "Wishlist loading failed:",
                    wishlistResult.reason
                );

                setError(
                    wishlistResult.reason
                        ?.response
                        ?.data
                        ?.message ||
                    wishlistResult.reason
                        ?.response
                        ?.data ||
                    "Failed to load wishlists."
                );


                return;
            }


            if (
                productResult.status ===
                "rejected"
            ) {

                console.error(
                    "Product loading failed:",
                    productResult.reason
                );


                setError(
                    productResult.reason
                        ?.response
                        ?.data
                        ?.message ||
                    productResult.reason
                        ?.response
                        ?.data ||
                    "Failed to load products."
                );


                return;
            }


        } catch (err) {

            console.error(
                "LOAD WISHLIST ITEM OPTIONS ERROR:",
                err
            );


            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to load wishlist and product options."
            );

        } finally {

            setLoadingOptions(false);
        }

    }, [
        loadWishlists,
        loadProducts
    ]);


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        loadOptions();

    }, [
        loadOptions
    ]);


    // ========================================================
    // HANDLE INPUT
    // ========================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));


        if (error) {
            setError("");
        }
    };


    // ========================================================
    // VALIDATE
    // ========================================================

    const validateForm = () => {

        if (
            !formData.wishlistId ||
            Number(formData.wishlistId) <= 0
        ) {

            setError(
                "Please select a wishlist."
            );

            return false;
        }


        if (
            !formData.sellerId ||
            Number(formData.sellerId) <= 0
        ) {

            setError(
                "Seller ID must be greater than 0."
            );

            return false;
        }


        if (
            !formData.customerId ||
            Number(formData.customerId) <= 0
        ) {

            setError(
                "Customer ID must be greater than 0."
            );

            return false;
        }


        if (
            !formData.productId ||
            Number(formData.productId) <= 0
        ) {

            setError(
                "Please select a product."
            );

            return false;
        }


        return true;
    };


    // ========================================================
    // CREATE
    // ========================================================

    const handleCreate = async () => {

        if (!validateForm()) {
            return;
        }


        try {

            setLoading(true);

            setError("");


            const payload = {
                wishlistId:
                    Number(formData.wishlistId),

                sellerId:
                    Number(formData.sellerId),

                customerId:
                    Number(formData.customerId),

                productId:
                    Number(formData.productId)
            };


            console.log(
                "CREATE WISHLIST ITEM PAYLOAD:",
                payload
            );


            const response = await axios.post(
                WISHLIST_ITEM_API,
                payload,
                {
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    timeout: 30000
                }
            );


            console.log(
                "CREATE WISHLIST ITEM SUCCESS:",
                response?.data
            );


            const createdItem =
                response?.data?.data ??
                response?.data;


            setSuccess(
                "Wishlist item created successfully."
            );


            if (
                typeof onCreated ===
                "function"
            ) {

                onCreated(createdItem);
            }


            // Return to list after success.
            setTimeout(() => {

                navigate("/wishlist-items");

            }, 700);


        } catch (err) {

            console.error(
                "CREATE WISHLIST ITEM ERROR:",
                err
            );


            const message =
                err.response?.data?.message ||
                err.response?.data?.title ||
                (
                    typeof err.response?.data ===
                    "string"
                        ? err.response.data
                        : null
                ) ||
                err.message ||
                "Unable to create wishlist item.";


            setError(message);

        } finally {

            setLoading(false);
        }
    };


    // ========================================================
    // BACK
    // ========================================================

    const handleBack = () => {

        if (loading) {
            return;
        }


        navigate("/wishlist-items");
    };


    // ========================================================
    // SUCCESS CLOSE
    // ========================================================

    const handleSuccessClose = () => {
        setSuccess("");
    };


    // ========================================================
    // LOADING OPTIONS
    // ========================================================

    if (loadingOptions) {

        return (
            <Box
                sx={{
                    p: 3,
                    minHeight: "60vh",
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
                        variant="body2"
                        color="text.secondary"
                    >
                        Loading wishlist and product options...
                    </Typography>

                </Stack>

            </Box>
        );
    }


    // ========================================================
    // FULL PAGE
    // ========================================================

    return (
        <Box sx={{ p: 3 }}>

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
                sx={{ mb: 3 }}
            >

                <Box>

                    <Button
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                        disabled={loading}
                        sx={{
                            mb: 1
                        }}
                    >
                        Back
                    </Button>


                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        Create Wishlist Item
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Add a product to a wishlist
                    </Typography>

                </Box>

            </Stack>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>

            )}


            {/* =================================================
                FORM CARD
            ================================================= */}

            <Card>

                <CardContent sx={{ p: 3 }}>

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        gutterBottom
                    >
                        Wishlist Item Information
                    </Typography>


                    <Divider
                        sx={{ mb: 3 }}
                    />


                    <Grid
                        container
                        spacing={3}
                    >

                        {/* =================================================
                            WISHLIST
                        ================================================= */}

                        <Grid
                            size={{
                                xs: 12,
                                md: 6
                            }}
                        >

                            <TextField
                                select
                                fullWidth
                                required
                                name="wishlistId"
                                label="Wishlist"
                                value={
                                    formData.wishlistId
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <MenuItem value="">
                                    Select Wishlist
                                </MenuItem>


                                {wishlists.map(
                                    (wishlist) => {

                                        const wishlistId =
                                            wishlist?.wishlistId ??
                                            wishlist?.id;


                                        if (
                                            !wishlistId
                                        ) {
                                            return null;
                                        }


                                        const wishlistName =
                                            wishlist?.name ||
                                            wishlist?.wishlistName ||
                                            wishlist?.title ||
                                            `Wishlist ${wishlistId}`;


                                        return (
                                            <MenuItem
                                                key={
                                                    wishlistId
                                                }
                                                value={
                                                    wishlistId
                                                }
                                            >

                                                {wishlistName}

                                                {" "}
                                                (ID:{" "}
                                                {wishlistId}
                                                )

                                            </MenuItem>
                                        );
                                    }
                                )}

                            </TextField>

                        </Grid>


                        {/* =================================================
                            PRODUCT
                        ================================================= */}

                        <Grid
                            size={{
                                xs: 12,
                                md: 6
                            }}
                        >

                            <TextField
                                select
                                fullWidth
                                required
                                name="productId"
                                label="Product"
                                value={
                                    formData.productId
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <MenuItem value="">
                                    Select Product
                                </MenuItem>


                                {products.map(
                                    (product) => {

                                        const productId =
                                            product?.productId ??
                                            product?.id;


                                        if (
                                            !productId
                                        ) {
                                            return null;
                                        }


                                        const productName =
                                            product?.productName ||
                                            product?.name ||
                                            product?.title ||
                                            product?.sku ||
                                            `Product ${productId}`;


                                        const sku =
                                            product?.sku ||
                                            product?.SKU ||
                                            "";


                                        return (
                                            <MenuItem
                                                key={
                                                    productId
                                                }
                                                value={
                                                    productId
                                                }
                                            >

                                                {productName}

                                                {sku
                                                    ? ` (${sku})`
                                                    : ` (ID: ${productId})`
                                                }

                                            </MenuItem>
                                        );
                                    }
                                )}

                            </TextField>

                        </Grid>


                        {/* =================================================
                            SELLER ID
                        ================================================= */}

                        <Grid
                            size={{
                                xs: 12,
                                md: 6
                            }}
                        >

                            <TextField
                                fullWidth
                                required
                                type="number"
                                name="sellerId"
                                label="Seller ID"
                                value={
                                    formData.sellerId
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 1
                                }}
                            />

                        </Grid>


                        {/* =================================================
                            CUSTOMER ID
                        ================================================= */}

                        <Grid
                            size={{
                                xs: 12,
                                md: 6
                            }}
                        >

                            <TextField
                                fullWidth
                                required
                                type="number"
                                name="customerId"
                                label="Customer ID"
                                value={
                                    formData.customerId
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 1
                                }}
                            />

                        </Grid>

                    </Grid>


                    <Divider
                        sx={{
                            mt: 4,
                            mb: 3
                        }}
                    />


                    {/* =================================================
                        ACTION BUTTONS
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
                            startIcon={
                                <ArrowBack />
                            }
                            onClick={handleBack}
                            disabled={loading}
                        >
                            Cancel
                        </Button>


                        <Button
                            variant="contained"
                            onClick={handleCreate}
                            disabled={
                                loading ||
                                loadingOptions
                            }
                            startIcon={
                                loading
                                    ? (
                                        <CircularProgress
                                            size={18}
                                            color="inherit"
                                        />
                                    )
                                    : null
                            }
                        >
                            {loading
                                ? "Creating..."
                                : "Create Wishlist Item"
                            }
                        </Button>

                    </Stack>

                </CardContent>

            </Card>


            {/* =================================================
                SUCCESS
            ================================================= */}

            <Snackbar
                open={Boolean(success)}
                autoHideDuration={1500}
                onClose={handleSuccessClose}
                message={success}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
            />

        </Box>
    );
};


export default WishlistItemsCreate;
