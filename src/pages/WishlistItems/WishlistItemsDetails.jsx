// ============================================================
// WishlistItemsDetails.jsx
// Wishlist Item Details Page
//
// Architecture:
// React -> Node server.js -> ASP.NET Core API
// ============================================================

import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Grid,
    Chip,
    Divider
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Delete,
    Favorite
} from "@mui/icons-material";

import axios from "axios";


// ============================================================
// CONFIGURATION
// ============================================================

const SERVER_URL =
    import.meta.env.VITE_SERVER_URL ||
    "http://localhost:5000";

const API_URL =
    `${SERVER_URL}/api`;

const WISHLIST_ITEM_API =
    `${API_URL}/WishlistItem`;


// ============================================================
// ID NORMALIZER
// ============================================================

const normalizeId = (value) => {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    const numericId = Number(value);

    if (
        !Number.isInteger(numericId) ||
        numericId <= 0
    ) {
        return null;
    }

    return numericId;
};


// ============================================================
// ERROR MESSAGE
// ============================================================

const getErrorMessage = (
    error,
    fallback
) => {

    return (
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        (
            typeof error?.response?.data === "string"
                ? error.response.data
                : null
        ) ||
        error?.message ||
        fallback
    );
};


// ============================================================
// RESPONSE HELPER
// ============================================================

const getResponseData = (response) => {

    if (!response) {
        return null;
    }

    return (
        response.data?.data ??
        response.data
    );
};


// ============================================================
// COMPONENT
// ============================================================

const WishlistItemsDetails = ({
    wishlistItemId,
    id,
    onEdit,
    onDelete
}) => {

    const navigate = useNavigate();

    const {
        id: routeId
    } = useParams();


    // ========================================================
    // RESOLVE ITEM ID
    // ========================================================

    const itemId =
        normalizeId(
            wishlistItemId ??
            id ??
            routeId
        );


    // ========================================================
    // STATE
    // ========================================================

    const [item, setItem] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ========================================================
    // BACK
    // ========================================================

    const handleBack = useCallback(() => {

        navigate("/wishlist-items");

    }, [
        navigate
    ]);


    // ========================================================
    // LOAD WISHLIST ITEM
    // ========================================================

    const loadWishlistItem =
        useCallback(async () => {

            if (!itemId) {

                setError(
                    "Wishlist Item ID is required."
                );

                setItem(null);
                setLoading(false);

                return;
            }


            const url =
                `${WISHLIST_ITEM_API}/${itemId}`;


            console.log(
                "================================================"
            );

            console.log(
                "GET WISHLIST ITEM DETAILS"
            );

            console.log(
                "URL:",
                url
            );

            console.log(
                "WISHLIST ITEM ID:",
                itemId
            );

            console.log(
                "================================================"
            );


            try {

                setLoading(true);
                setError("");


                const response =
                    await axios.get(
                        url,
                        {
                            timeout: 30000
                        }
                    );


                const data =
                    getResponseData(response);


                console.log(
                    "WISHLIST ITEM DETAILS RESPONSE:",
                    data
                );


                if (!data) {

                    throw new Error(
                        `Wishlist item ${itemId} was not found.`
                    );
                }


                setItem(data);

            } catch (err) {

                console.error(
                    "LOAD WISHLIST ITEM DETAILS ERROR:",
                    {
                        url,
                        status:
                            err.response?.status,
                        response:
                            err.response?.data,
                        message:
                            err.message
                    }
                );


                setItem(null);


                if (
                    err.response?.status === 404
                ) {

                    setError(
                        `Wishlist item ${itemId} was not found.`
                    );

                } else {

                    setError(
                        getErrorMessage(
                            err,
                            "Unable to load wishlist item."
                        )
                    );
                }

            } finally {

                setLoading(false);
            }

        }, [
            itemId
        ]);


    // ========================================================
    // LOAD ON ID CHANGE
    // ========================================================

    useEffect(() => {

        loadWishlistItem();

    }, [
        loadWishlistItem
    ]);


    // ========================================================
    // DISPLAY ID
    // ========================================================

    const displayedItemId =
        normalizeId(
            item?.wishlistItemId ??
            item?.WishlistItemId
        ) ??
        itemId;


    // ========================================================
    // FIELD VALUES
    // ========================================================

    const wishlistId =
        item?.wishlistId ??
        item?.WishlistId ??
        "-";


    const sellerId =
        item?.sellerId ??
        item?.SellerId ??
        "-";


    const customerId =
        item?.customerId ??
        item?.CustomerId ??
        "-";


    const productId =
        item?.productId ??
        item?.ProductId ??
        "-";


    const createdDate =
        item?.createdDate ??
        item?.CreatedDate ??
        null;


    // ========================================================
    // STATUS
    // ========================================================

    const status =
        item?.status ??
        item?.Status ??
        "Active";


    // ========================================================
    // EDIT
    // ========================================================

    const handleEdit = () => {

        if (
            typeof onEdit ===
            "function"
        ) {

            onEdit(item);

            return;
        }


        navigate(
            `/wishlist-items/edit/${displayedItemId}`
        );
    };


    // ========================================================
    // DELETE
    // ========================================================

    const handleDelete = () => {

        if (
            typeof onDelete ===
            "function"
        ) {

            onDelete(item);

            return;
        }


        console.log(
            "DELETE WISHLIST ITEM:",
            displayedItemId
        );
    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (
            <Box
                sx={{
                    minHeight: 350,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 2
                }}
            >

                <CircularProgress />

                <Typography
                    color="text.secondary"
                >
                    Loading Wishlist Item...
                </Typography>


                {itemId && (

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Wishlist Item ID: {itemId}
                    </Typography>

                )}

            </Box>
        );
    }


    // ========================================================
    // ERROR
    // ========================================================

    if (error) {

        return (
            <Box sx={{ p: 3 }}>

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>


                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                >
                    API Endpoint
                </Typography>


                <Typography
                    variant="body2"
                    sx={{
                        fontFamily: "monospace",
                        wordBreak: "break-all",
                        mb: 2
                    }}
                >
                    {itemId
                        ? `${WISHLIST_ITEM_API}/${itemId}`
                        : WISHLIST_ITEM_API}
                </Typography>


                <Button
                    variant="outlined"
                    startIcon={
                        <ArrowBack />
                    }
                    onClick={handleBack}
                >
                    Back
                </Button>

            </Box>
        );
    }


    // ========================================================
    // NO DATA
    // ========================================================

    if (!item) {

        return (
            <Box sx={{ p: 3 }}>

                <Alert severity="warning">
                    Wishlist item not found.
                </Alert>


                <Button
                    sx={{ mt: 2 }}
                    startIcon={
                        <ArrowBack />
                    }
                    onClick={handleBack}
                >
                    Back
                </Button>

            </Box>
        );
    }


    // ========================================================
    // RENDER
    // ========================================================

    return (
        <Box sx={{ p: 3 }}>

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 3
                }}
            >

                <Box>

                    <Button
                        startIcon={
                            <ArrowBack />
                        }
                        onClick={handleBack}
                        sx={{ mb: 1 }}
                    >
                        Back
                    </Button>


                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        Wishlist Item Details
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Wishlist Item ID:{" "}
                        {displayedItemId}
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
                            <Edit />
                        }
                        onClick={handleEdit}
                    >
                        Edit
                    </Button>


                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={
                            <Delete />
                        }
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>

                </Box>

            </Box>


            {/* =================================================
                MAIN CARD
            ================================================= */}

            <Card elevation={2}>

                <CardContent sx={{ p: 3 }}>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 3
                        }}
                    >

                        <Favorite
                            sx={{
                                fontSize: 50,
                                color: "error.main"
                            }}
                        />


                        <Box>

                            <Typography
                                variant="h5"
                                fontWeight={700}
                            >
                                Wishlist Item #
                                {displayedItemId}
                            </Typography>


                            <Typography
                                color="text.secondary"
                            >
                                Product ID: {productId}
                            </Typography>

                        </Box>

                    </Box>


                    <Divider
                        sx={{ mb: 3 }}
                    />


                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Wishlist Item ID
                            </Typography>


                            <Typography
                                fontWeight={600}
                            >
                                {displayedItemId}
                            </Typography>

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Wishlist ID
                            </Typography>


                            <Typography
                                fontWeight={600}
                            >
                                {wishlistId}
                            </Typography>

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Seller ID
                            </Typography>


                            <Typography
                                fontWeight={600}
                            >
                                {sellerId}
                            </Typography>

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Customer ID
                            </Typography>


                            <Typography
                                fontWeight={600}
                            >
                                {customerId}
                            </Typography>

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Product ID
                            </Typography>


                            <Typography
                                fontWeight={600}
                            >
                                {productId}
                            </Typography>

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Status
                            </Typography>


                            <Box sx={{ mt: 0.5 }}>

                                <Chip
                                    label={status}
                                    size="small"
                                    color={
                                        String(status)
                                            .toLowerCase() ===
                                        "active"
                                            ? "success"
                                            : "default"
                                    }
                                />

                            </Box>

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Created Date
                            </Typography>


                            <Typography
                                fontWeight={600}
                            >
                                {createdDate
                                    ? new Date(
                                        createdDate
                                    ).toLocaleString(
                                        "en-IN"
                                    )
                                    : "-"}
                            </Typography>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>

        </Box>
    );
};


export default WishlistItemsDetails;
