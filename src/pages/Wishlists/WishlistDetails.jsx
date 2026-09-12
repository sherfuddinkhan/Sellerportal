import React, {
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
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Delete,
    Edit,
    Favorite
} from "@mui/icons-material";


/* ============================================================
   CONFIGURATION
============================================================ */

const SERVER_URL =
    import.meta.env.VITE_SERVER_URL ||
    "http://localhost:5000";

const WISHLIST_API =
    `${SERVER_URL}/api/Wishlist`;


/* ============================================================
   COMPONENT
============================================================ */

const WishlistDetails = ({
    wishlistId,
    id,
    wishlist: initialWishlist,
    onBack,
    onEdit,
    onDelete
}) => {

    const {
        id: routeId
    } = useParams();

    const navigate = useNavigate();


    /* ========================================================
       ID
    ======================================================== */

    const itemId =
        routeId ||
        wishlistId ||
        id ||
        initialWishlist?.wishlistId ||
        initialWishlist?.WishlistId;


    /* ========================================================
       STATE
    ======================================================== */

    const [wishlist, setWishlist] =
        useState(initialWishlist || null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    /* ========================================================
       BACK
    ======================================================== */

    const handleBack = () => {

        if (onBack) {
            onBack();
            return;
        }

        navigate("/wishlists");
    };


    /* ========================================================
       EDIT
    ======================================================== */

    const handleEdit = () => {

        if (onEdit) {
            onEdit(wishlist);
            return;
        }

        if (itemId) {
            navigate(`/wishlists/edit/${itemId}`);
        }
    };


    /* ========================================================
       DELETE
    ======================================================== */

    const handleDelete = () => {

        if (onDelete) {
            onDelete(wishlist);
            return;
        }

        /*
         * Actual deletion should normally be handled by the
         * WishlistList/Delete dialog so that the user can see
         * the deletion confirmation there.
         *
         * We therefore navigate back rather than performing
         * an unexpected DELETE directly from the details page.
         */
        navigate("/wishlists");
    };


    /* ========================================================
       ERROR MESSAGE
    ======================================================== */

    const getErrorMessage = (err) => {

        const data =
            err?.response?.data;

        if (
            typeof data === "string" &&
            data.trim()
        ) {
            return data;
        }

        if (data?.message) {
            return data.message;
        }

        if (data?.title) {
            return data.title;
        }

        if (data?.errors) {

            const validationErrors =
                Object.values(data.errors)
                    .flat()
                    .filter(Boolean);

            if (validationErrors.length > 0) {
                return validationErrors.join(" ");
            }
        }

        return (
            err?.message ||
            "Unable to load wishlist."
        );
    };


    /* ========================================================
       LOAD WISHLIST
    ======================================================== */

    const loadWishlist = async () => {

        if (!itemId) {

            setError(
                "Wishlist ID is required."
            );

            setLoading(false);

            return;
        }


        try {

            setLoading(true);
            setError("");


            console.log(
                "GET WISHLIST:",
                itemId
            );


            const response = await axios.get(
                `${WISHLIST_API}/${itemId}`,
                {
                    timeout: 30000
                }
            );


            console.log(
                "GET WISHLIST RESPONSE:",
                response.data
            );


            const data =
                response.data?.data ??
                response.data;


            if (!data) {

                setWishlist(null);

                setError(
                    "Wishlist not found."
                );

                return;
            }


            setWishlist(data);

        } catch (err) {

            console.error(
                "LOAD WISHLIST ERROR:",
                err
            );

            setError(
                getErrorMessage(err)
            );

        } finally {

            setLoading(false);
        }
    };


    /* ========================================================
       LOAD WHEN ID CHANGES
    ======================================================== */

    useEffect(() => {

        loadWishlist();

    }, [itemId]);


    /* ========================================================
       LOADING
    ======================================================== */

    if (loading) {

        return (
            <Box
                sx={{
                    minHeight: 350,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 2,
                    p: 3
                }}
            >

                <CircularProgress />

                <Typography color="text.secondary">
                    Loading Wishlist...
                </Typography>

            </Box>
        );
    }


    /* ========================================================
       ERROR
    ======================================================== */

    if (error) {

        return (
            <Box sx={{ p: 3 }}>

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                >
                    Back to Wishlists
                </Button>

            </Box>
        );
    }


    /* ========================================================
       NO DATA
    ======================================================== */

    if (!wishlist) {

        return (
            <Box sx={{ p: 3 }}>

                <Alert severity="warning">
                    Wishlist not found.
                </Alert>

                <Button
                    sx={{ mt: 2 }}
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                >
                    Back to Wishlists
                </Button>

            </Box>
        );
    }


    /* ========================================================
       EXTRACT WISHLIST DATA

       These fields match the Wishlist model/API response.
    ======================================================== */

    const wishlistIdValue =
        wishlist.wishlistId ??
        wishlist.WishlistId ??
        wishlist.id ??
        wishlist.Id ??
        itemId;


    const customerId =
        wishlist.customerId ??
        wishlist.CustomerId ??
        "-";


    const sellerId =
        wishlist.sellerId ??
        wishlist.SellerId ??
        "-";


    const status =
        wishlist.status ??
        wishlist.Status ??
        "Active";


    const createdDate =
        wishlist.createdDate ??
        wishlist.CreatedDate ??
        wishlist.createdAt ??
        wishlist.CreatedAt;


    const updatedDate =
        wishlist.updatedDate ??
        wishlist.UpdatedDate ??
        wishlist.updatedAt ??
        wishlist.UpdatedAt;


    /* ========================================================
       STATUS COLOR
    ======================================================== */

    const getStatusColor = (value) => {

        switch (
            String(value || "")
                .toLowerCase()
                .trim()
        ) {

            case "active":
                return "success";

            case "inactive":
                return "warning";

            case "removed":
                return "error";

            case "completed":
                return "info";

            case "cancelled":
                return "error";

            default:
                return "default";
        }
    };


    /* ========================================================
       DATE FORMAT
    ======================================================== */

    const formatDate = (value) => {

        if (!value) {
            return "-";
        }

        const date =
            new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleString(
            "en-IN"
        );
    };


    /* ========================================================
       RENDER
    ======================================================== */

    return (
        <Box
            sx={{
                p: {
                    xs: 2,
                    sm: 3
                }
            }}
        >

            {/* =================================================
               PAGE HEADER
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
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                        sx={{ mb: 1 }}
                    >
                        Back
                    </Button>

                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        Wishlist Details
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        View wishlist information
                    </Typography>

                </Box>


                {/* =================================================
                   ACTIONS
                ================================================= */}

                <Box
                    sx={{
                        display: "flex",
                        gap: 1
                    }}
                >

                    <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={handleEdit}
                    >
                        Edit
                    </Button>


                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
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

                <CardContent
                    sx={{
                        p: {
                            xs: 2,
                            sm: 4
                        }
                    }}
                >

                    {/* =================================================
                       WISHLIST HEADER
                    ================================================= */}

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
                                fontSize: 55,
                                color: "error.main"
                            }}
                        />

                        <Box>

                            <Typography
                                variant="h5"
                                fontWeight={700}
                            >
                                Wishlist #{wishlistIdValue}
                            </Typography>

                            <Typography
                                color="text.secondary"
                            >
                                Customer Wishlist
                            </Typography>

                        </Box>

                    </Box>


                    <Divider sx={{ mb: 3 }} />


                    {/* =================================================
                       WISHLIST INFORMATION
                    ================================================= */}

                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        General Information
                    </Typography>


                    <Grid
                        container
                        spacing={3}
                    >

                        {/* =================================================
                           WISHLIST ID
                        ================================================= */}

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
                                {wishlistIdValue}
                            </Typography>

                        </Grid>


                        {/* =================================================
                           CUSTOMER ID
                        ================================================= */}

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


                        {/* =================================================
                           SELLER ID
                        ================================================= */}

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


                        {/* =================================================
                           STATUS
                        ================================================= */}

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
                                    color={getStatusColor(status)}
                                />

                            </Box>

                        </Grid>


                        {/* =================================================
                           CREATED DATE
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Created Date
                            </Typography>

                            <Typography
                                fontWeight={500}
                            >
                                {formatDate(createdDate)}
                            </Typography>

                        </Grid>


                        {/* =================================================
                           UPDATED DATE
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Updated Date
                            </Typography>

                            <Typography
                                fontWeight={500}
                            >
                                {formatDate(updatedDate)}
                            </Typography>

                        </Grid>

                    </Grid>


                    {/* =================================================
                       BOTTOM ACTIONS
                    ================================================= */}

                    <Divider sx={{ my: 4 }} />

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 2,
                            flexWrap: "wrap"
                        }}
                    >

                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={handleBack}
                        >
                            Back to Wishlists
                        </Button>


                        <Button
                            variant="contained"
                            startIcon={<Edit />}
                            onClick={handleEdit}
                        >
                            Edit Wishlist
                        </Button>

                    </Box>

                </CardContent>

            </Card>

        </Box>
    );
};


export default WishlistDetails;
