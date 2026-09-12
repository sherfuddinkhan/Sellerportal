import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
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


// ============================================================
// API CONFIGURATION
// ============================================================

const SERVER_URL =
    import.meta.env.VITE_SERVER_URL ||
    "http://localhost:5000";

const API_URL = `${SERVER_URL}/api`;


// ============================================================
// COMPONENT
// ============================================================

const WishlistItemsEdit = ({
    wishlistItemId,
    id,
    item,
    wishlistItem,
    onUpdated
}) => {

    const navigate = useNavigate();
    const params = useParams();

    // ========================================================
    // ID
    // ========================================================

    const routeId =
        params?.id ||
        wishlistItemId ||
        id ||
        item?.wishlistItemId ||
        wishlistItem?.wishlistItemId;

    const numericId = Number(routeId);


    // ========================================================
    // STATE
    // ========================================================

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

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
                `${API_URL}/Wishlist`
            );

            const data = response?.data;

            let list = [];

            if (Array.isArray(data)) {
                list = data;
            } else if (Array.isArray(data?.data)) {
                list = data.data;
            } else if (Array.isArray(data?.items)) {
                list = data.items;
            } else if (Array.isArray(data?.wishlists)) {
                list = data.wishlists;
            }

            setWishlists(list);

        } catch (err) {

            console.error(
                "Failed to load wishlists:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Failed to load wishlists."
            );
        }

    }, []);


    // ========================================================
    // LOAD PRODUCTS
    // ========================================================

    const loadProducts = useCallback(async () => {

        try {

            const response = await axios.get(
                `${API_URL}/Products`
            );

            const data = response?.data;

            let list = [];

            if (Array.isArray(data)) {
                list = data;
            } else if (Array.isArray(data?.data)) {
                list = data.data;
            } else if (Array.isArray(data?.items)) {
                list = data.items;
            } else if (Array.isArray(data?.products)) {
                list = data.products;
            }

            setProducts(list);

        } catch (err) {

            console.error(
                "Failed to load products:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Failed to load products."
            );
        }

    }, []);


    // ========================================================
    // LOAD WISHLIST ITEM
    // ========================================================

    const loadWishlistItem = useCallback(async () => {

        if (!numericId || numericId <= 0) {

            setError(
                "Wishlist Item ID is required."
            );

            setLoading(false);

            return;
        }


        try {

            setLoading(true);

            setError("");


            const response = await axios.get(
                `${API_URL}/WishlistItem/${numericId}`
            );


            const data = response?.data;


            if (!data) {

                setError(
                    "Wishlist item was not found."
                );

                return;
            }


            setFormData({
                wishlistId:
                    data.wishlistId ??
                    "",

                sellerId:
                    data.sellerId ??
                    "",

                customerId:
                    data.customerId ??
                    "",

                productId:
                    data.productId ??
                    ""
            });


        } catch (err) {

            console.error(
                "Failed to load wishlist item:",
                err
            );


            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Failed to load wishlist item."
            );

        } finally {

            setLoading(false);
        }

    }, [numericId]);


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        loadWishlistItem();

        loadWishlists();

        loadProducts();

    }, [
        loadWishlistItem,
        loadWishlists,
        loadProducts
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
    // BACK
    // ========================================================

    const handleBack = useCallback(() => {

        if (saving) {
            return;
        }

        navigate("/wishlist-items");

    }, [
        navigate,
        saving
    ]);


    // ========================================================
    // VALIDATE FORM
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
    // UPDATE
    // ========================================================

    const handleUpdate = async () => {

        if (!numericId || numericId <= 0) {

            setError(
                "Wishlist Item ID is required."
            );

            return;
        }


        if (!validateForm()) {
            return;
        }


        try {

            setSaving(true);

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
                "UPDATE WISHLIST ITEM:",
                numericId
            );

            console.log(
                "UPDATE PAYLOAD:",
                payload
            );


            const response = await axios.put(
                `${API_URL}/WishlistItem/${numericId}`,
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
                "WISHLIST ITEM UPDATE SUCCESS:",
                response?.data
            );


            setSuccess(
                "Wishlist item updated successfully."
            );


            if (typeof onUpdated === "function") {
                onUpdated(response?.data);
            }


            // Give Snackbar a moment to display,
            // then return to the list page.
            setTimeout(() => {

                navigate("/wishlist-items");

            }, 700);


        } catch (err) {

            console.error(
                "WISHLIST ITEM UPDATE ERROR:",
                err
            );


            let message =
                "Failed to update wishlist item.";


            if (err.response?.data?.message) {

                message =
                    err.response.data.message;

            } else if (
                typeof err.response?.data === "string"
            ) {

                message =
                    err.response.data;

            } else if (err.message) {

                message =
                    err.message;
            }


            setError(message);

        } finally {

            setSaving(false);
        }
    };


    // ========================================================
    // CLOSE SUCCESS MESSAGE
    // ========================================================

    const handleSuccessClose = () => {
        setSuccess("");
    };


    // ========================================================
    // LOADING SCREEN
    // ========================================================

    if (loading) {

        return (
            <Box
                sx={{
                    width: "100%",
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
                        Loading wishlist item...
                    </Typography>

                </Stack>

            </Box>
        );
    }


    // ========================================================
    // INVALID ID / LOAD ERROR
    // ========================================================

    if (
        !numericId ||
        numericId <= 0 ||
        (
            error &&
            !formData.wishlistId &&
            !formData.productId
        )
    ) {

        return (
            <Box sx={{ p: 3 }}>

                <Card>

                    <CardContent>

                        <Typography
                            variant="h5"
                            fontWeight={600}
                            gutterBottom
                        >
                            Edit Wishlist Item
                        </Typography>


                        <Alert
                            severity="error"
                            sx={{ mb: 3 }}
                        >
                            {error ||
                                "Wishlist Item ID is required."}
                        </Alert>


                        <Button
                            variant="outlined"
                            onClick={handleBack}
                        >
                            Back to Wishlist Items
                        </Button>

                    </CardContent>

                </Card>

            </Box>
        );
    }


    // ========================================================
    // FIND DISPLAY VALUES
    // ========================================================

    const getWishlistId = (wishlist) =>
        wishlist?.wishlistId ??
        wishlist?.id ??
        "";

    const getProductId = (product) =>
        product?.productId ??
        product?.id ??
        "";


    // ========================================================
    // RENDER FULL PAGE
    // ========================================================

    return (
        <Box sx={{ p: 3 }}>

            {/* =================================================
                PAGE HEADER
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

                    <Typography
                        variant="h4"
                        fontWeight={600}
                    >
                        Edit Wishlist Item
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Update the wishlist item details
                    </Typography>

                </Box>


                <Button
                    variant="outlined"
                    onClick={handleBack}
                    disabled={saving}
                >
                    Back
                </Button>

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
                EDIT CARD
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


                    <Divider sx={{ mb: 3 }} />


                    {/* =================================================
                        ITEM ID
                    ================================================= */}

                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid
                            size={{
                                xs: 12,
                                md: 6
                            }}
                        >

                            <TextField
                                fullWidth
                                label="Wishlist Item ID"
                                value={numericId}
                                disabled
                            />

                        </Grid>


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
                                            getWishlistId(
                                                wishlist
                                            );


                                        if (!wishlistId) {
                                            return null;
                                        }


                                        const wishlistName =
                                            wishlist?.name ||
                                            wishlist?.wishlistName ||
                                            wishlist?.title ||
                                            `Wishlist ${wishlistId}`;


                                        return (
                                            <MenuItem
                                                key={wishlistId}
                                                value={wishlistId}
                                            >
                                                {wishlistName}
                                                {" "}
                                                (ID: {wishlistId})
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


                        {/* =================================================
                            PRODUCT
                        ================================================= */}

                        <Grid
                            size={{
                                xs: 12
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
                                            getProductId(
                                                product
                                            );


                                        if (!productId) {
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
                                                key={productId}
                                                value={productId}
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

                    </Grid>


                    <Divider sx={{ mt: 4, mb: 3 }} />


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
                            onClick={handleBack}
                            disabled={saving}
                        >
                            Cancel
                        </Button>


                        <Button
                            variant="contained"
                            onClick={handleUpdate}
                            disabled={saving}
                            startIcon={
                                saving
                                    ? (
                                        <CircularProgress
                                            size={18}
                                            color="inherit"
                                        />
                                    )
                                    : null
                            }
                        >
                            {saving
                                ? "Updating..."
                                : "Update Wishlist Item"
                            }
                        </Button>

                    </Stack>

                </CardContent>

            </Card>


            {/* =================================================
                SUCCESS SNACKBAR
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


export default WishlistItemsEdit;
