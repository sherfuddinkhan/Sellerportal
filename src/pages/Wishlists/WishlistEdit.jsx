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
    ArrowBack,
    Save
} from "@mui/icons-material";


// ============================================================
// CONFIGURATION
// ============================================================

const SERVER_URL =
    import.meta.env.VITE_SERVER_URL ||
    "http://localhost:5000";

const API_URL =
    `${SERVER_URL}/api`;

const WISHLIST_API =
    `${API_URL}/Wishlist`;


// ============================================================
// COMPONENT
// ============================================================

const WishlistEdit = ({
    wishlistId,
    wishlist,
    onBack,
    onSuccess
}) => {

    const navigate = useNavigate();

    const {
        id: routeId
    } = useParams();


    // ========================================================
    // GET ID FROM URL
    // ========================================================

    const editId =
        routeId ||
        wishlistId ||
        wishlist?.wishlistId;


    // ========================================================
    // STATE
    // ========================================================

    const [
        customerId,
        setCustomerId
    ] = useState("");

    const [
        sellerId,
        setSellerId
    ] = useState("");

    const [
        status,
        setStatus
    ] = useState("Active");


    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        saving,
        setSaving
    ] = useState(false);

    const [
        error,
        setError
    ] = useState("");

    const [
        success,
        setSuccess
    ] = useState(false);


    // ========================================================
    // ERROR MESSAGE
    // ========================================================

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

            const messages =
                Object.values(data.errors)
                    .flat()
                    .filter(Boolean);

            if (messages.length) {
                return messages.join(" ");
            }
        }


        return (
            err?.message ||
            "An error occurred."
        );
    };


    // ========================================================
    // LOAD WISHLIST
    // ========================================================

    useEffect(() => {

        const loadWishlist = async () => {

            // ------------------------------------------------
            // IMPORTANT:
            // Do not send undefined / null / ":id"
            // ------------------------------------------------

            const numericId =
                Number(editId);


            if (
                !Number.isInteger(numericId) ||
                numericId <= 0
            ) {

                console.error(
                    "INVALID WISHLIST ID:",
                    editId
                );


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
                    "================================================"
                );

                console.log(
                    "LOAD WISHLIST FOR EDIT"
                );

                console.log(
                    "Route ID:",
                    routeId
                );

                console.log(
                    "Edit ID:",
                    numericId
                );

                console.log(
                    "URL:",
                    `${WISHLIST_API}/${numericId}`
                );

                console.log(
                    "================================================"
                );


                // ------------------------------------------------
                // React -> Node -> ASP.NET
                // ------------------------------------------------

                const response =
                    await axios.get(
                        `${WISHLIST_API}/${numericId}`,
                        {
                            timeout: 30000,
                            headers: {
                                Accept:
                                    "application/json"
                            }
                        }
                    );


                console.log(
                    "WISHLIST EDIT RESPONSE:",
                    response.data
                );


                const data =
                    response.data?.data ||
                    response.data;


                if (!data) {

                    throw new Error(
                        "Wishlist was not found."
                    );
                }


                // ------------------------------------------------
                // Populate form
                // ------------------------------------------------

                setCustomerId(
                    data.customerId ??
                    data.CustomerId ??
                    ""
                );


                setSellerId(
                    data.sellerId ??
                    data.SellerId ??
                    ""
                );


                setStatus(
                    data.status ??
                    data.Status ??
                    "Active"
                );

            }

            catch (err) {

                console.error(
                    "LOAD WISHLIST ERROR:",
                    err
                );


                console.error(
                    "STATUS:",
                    err?.response?.status
                );


                console.error(
                    "DATA:",
                    err?.response?.data
                );


                setError(
                    getErrorMessage(err)
                );

            }

            finally {

                setLoading(false);
            }
        };


        loadWishlist();

    }, [
        editId,
        routeId
    ]);


    // ========================================================
    // BACK
    // ========================================================

    const handleBack = () => {

        if (onBack) {

            onBack();

            return;
        }


        navigate(
            "/wishlists"
        );
    };


    // ========================================================
    // SAVE
    // ========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        const numericWishlistId =
            Number(editId);


        const numericCustomerId =
            Number(customerId);


        const numericSellerId =
            Number(sellerId);


        // ----------------------------------------------------
        // Validate Wishlist ID
        // ----------------------------------------------------

        if (
            !Number.isInteger(
                numericWishlistId
            ) ||
            numericWishlistId <= 0
        ) {

            setError(
                "Wishlist ID is required."
            );

            return;
        }


        // ----------------------------------------------------
        // Validate Customer ID
        // ----------------------------------------------------

        if (
            !Number.isInteger(
                numericCustomerId
            ) ||
            numericCustomerId <= 0
        ) {

            setError(
                "Customer ID must be greater than 0."
            );

            return;
        }


        // ----------------------------------------------------
        // Validate Seller ID
        // ----------------------------------------------------

        if (
            !Number.isInteger(
                numericSellerId
            ) ||
            numericSellerId <= 0
        ) {

            setError(
                "Seller ID must be greater than 0."
            );

            return;
        }


        if (!status) {

            setError(
                "Status is required."
            );

            return;
        }


        try {

            setSaving(true);
            setError("");


            // ------------------------------------------------
            // Payload
            // ------------------------------------------------

            const payload = {
                wishlistId:
                    numericWishlistId,

                customerId:
                    numericCustomerId,

                sellerId:
                    numericSellerId,

                status:
                    status
            };


            console.log(
                "================================================"
            );

            console.log(
                "UPDATE WISHLIST"
            );

            console.log(
                "Wishlist ID:",
                numericWishlistId
            );

            console.log(
                "URL:",
                `${WISHLIST_API}/${numericWishlistId}`
            );

            console.log(
                "PAYLOAD:",
                payload
            );

            console.log(
                "================================================"
            );


            // ------------------------------------------------
            // React -> Node -> ASP.NET
            // ------------------------------------------------

            await axios.put(
                `${WISHLIST_API}/${numericWishlistId}`,
                payload,
                {
                    timeout: 30000,
                    headers: {
                        "Content-Type":
                            "application/json",
                        Accept:
                            "application/json"
                    }
                }
            );


            console.log(
                "WISHLIST UPDATED SUCCESSFULLY"
            );


            setSuccess(true);


            if (onSuccess) {
                onSuccess();
            }


            // ------------------------------------------------
            // Return to Wishlist list
            // ------------------------------------------------

            setTimeout(() => {

                navigate(
                    "/wishlists"
                );

            }, 800);

        }

        catch (err) {

            console.error(
                "UPDATE WISHLIST ERROR:",
                err
            );


            console.error(
                "STATUS:",
                err?.response?.status
            );


            console.error(
                "DATA:",
                err?.response?.data
            );


            setError(
                getErrorMessage(err)
            );

        }

        finally {

            setSaving(false);
        }
    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (
            <Box
                sx={{
                    minHeight: 400,
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
                    Loading wishlist...
                </Typography>

            </Box>
        );
    }


    // ========================================================
    // PAGE
    // ========================================================

    return (
        <Box
            sx={{
                width: "100%",
                p: {
                    xs: 2,
                    sm: 3
                }
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
                    xs: "stretch",
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
                        Edit Wishlist
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 0.5
                        }}
                    >
                        Update Wishlist #{editId}
                    </Typography>

                </Box>


                <Button
                    variant="outlined"
                    startIcon={
                        <ArrowBack />
                    }
                    onClick={handleBack}
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
                    sx={{
                        mb: 3
                    }}
                    onClose={() =>
                        setError("")
                    }
                >
                    {error}
                </Alert>

            )}


            {/* =================================================
               FORM
            ================================================= */}

            <Card>

                <CardContent>

                    <Box
                        component="form"
                        onSubmit={
                            handleSubmit
                        }
                    >

                        <Typography
                            variant="h6"
                            fontWeight={600}
                            sx={{
                                mb: 2
                            }}
                        >
                            Wishlist Information
                        </Typography>


                        <Divider
                            sx={{
                                mb: 3
                            }}
                        />


                        <Grid
                            container
                            spacing={3}
                        >

                            {/* =================================
                               WISHLIST ID
                            ================================= */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Wishlist ID"
                                    value={
                                        editId || ""
                                    }
                                    InputProps={{
                                        readOnly: true
                                    }}
                                    helperText="Wishlist ID from the URL"
                                />

                            </Grid>


                            {/* =================================
                               CUSTOMER ID
                            ================================= */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Customer ID"
                                    value={
                                        customerId
                                    }
                                    onChange={(event) =>
                                        setCustomerId(
                                            event.target.value
                                        )
                                    }
                                    inputProps={{
                                        min: 1
                                    }}
                                />

                            </Grid>


                            {/* =================================
                               SELLER ID
                            ================================= */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Seller ID"
                                    value={
                                        sellerId
                                    }
                                    onChange={(event) =>
                                        setSellerId(
                                            event.target.value
                                        )
                                    }
                                    inputProps={{
                                        min: 1
                                    }}
                                />

                            </Grid>


                            {/* =================================
                               STATUS
                            ================================= */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    select
                                    fullWidth
                                    required
                                    label="Status"
                                    value={
                                        status
                                    }
                                    onChange={(event) =>
                                        setStatus(
                                            event.target.value
                                        )
                                    }
                                >

                                    <MenuItem value="Active">
                                        Active
                                    </MenuItem>

                                    <MenuItem value="Inactive">
                                        Inactive
                                    </MenuItem>

                                </TextField>

                            </Grid>

                        </Grid>


                        <Divider
                            sx={{
                                my: 3
                            }}
                        />


                        {/* =====================================
                           ACTIONS
                        ===================================== */}

                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row"
                            }}
                            spacing={2}
                            justifyContent="flex-end"
                        >

                            <Button
                                variant="outlined"
                                onClick={
                                    handleBack
                                }
                                disabled={saving}
                            >
                                Cancel
                            </Button>


                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={
                                    <Save />
                                }
                                disabled={saving}
                            >

                                {saving
                                    ? "Saving..."
                                    : "Save Changes"
                                }

                            </Button>

                        </Stack>

                    </Box>

                </CardContent>

            </Card>


            {/* =================================================
               SUCCESS
            ================================================= */}

            <Snackbar
                open={success}
                autoHideDuration={1500}
                onClose={() =>
                    setSuccess(false)
                }
                message="Wishlist updated successfully."
            />

        </Box>
    );
};


export default WishlistEdit;
