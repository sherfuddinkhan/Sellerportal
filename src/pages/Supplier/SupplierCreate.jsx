import React, {
    useState
} from "react";

import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    Typography,
    Alert,
    CircularProgress
} from "@mui/material";

import {
    Save,
    ArrowBack
} from "@mui/icons-material";

import {
    useNavigate
} from "react-router-dom";

import axios from "axios";


// ============================================================
// NODE SERVER / PROXY URL
// ============================================================

const API_URL = "http://localhost:5000/api";


// ============================================================
// SUPPLIER CREATE
// ============================================================

const SupplierCreate = () => {

    const navigate = useNavigate();


    // ========================================================
    // FORM DATA
    // ========================================================

    const [formData, setFormData] = useState({

        sellerId: "",

        supplierName: "",

        contactPerson: "",

        phone: "",

        email: "",

        address: "",

        city: "",

        state: "",

        country: "",

        gstNumber: ""

    });


    // ========================================================
    // STATE
    // ========================================================

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);


    // ========================================================
    // HANDLE CHANGE
    // ========================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormData((previous) => ({

            ...previous,

            [name]: value

        }));

    };


    // ========================================================
    // HANDLE SUBMIT
    // ========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // ----------------------------------------------------
        // Clear previous error
        // ----------------------------------------------------

        setError("");


        // ----------------------------------------------------
        // Validate Seller ID
        // ----------------------------------------------------

        const sellerId =
            Number(formData.sellerId);


        if (
            !Number.isInteger(sellerId) ||
            sellerId <= 0
        ) {

            setError(
                "Please enter a valid Seller ID"
            );

            return;
        }


        // ----------------------------------------------------
        // Validate Supplier Name
        // ----------------------------------------------------

        if (
            !formData.supplierName.trim()
        ) {

            setError(
                "Supplier Name is required"
            );

            return;
        }


        try {

            setLoading(true);


            // ------------------------------------------------
            // Prepare payload
            // ------------------------------------------------

            const payload = {

                sellerId:

                    sellerId,

                supplierName:

                    formData.supplierName.trim(),

                contactPerson:

                    formData.contactPerson?.trim() ||
                    "",

                phone:

                    formData.phone?.trim() ||
                    "",

                email:

                    formData.email?.trim() ||
                    "",

                address:

                    formData.address?.trim() ||
                    "",

                city:

                    formData.city?.trim() ||
                    "",

                state:

                    formData.state?.trim() ||
                    "",

                country:

                    formData.country?.trim() ||
                    "",

                gstNumber:

                    formData.gstNumber?.trim() ||
                    ""

            };


            console.log(
                "Creating supplier..."
            );


            console.log(
                "Supplier payload:",
                payload
            );


            // ------------------------------------------------
            // React -> Node -> ASP.NET
            // ------------------------------------------------

            const response =
                await axios.post(

                    `${API_URL}/Supplier`,

                    payload,

                    {
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }

                );


            console.log(
                "Supplier created:",
                response.data
            );


            // ------------------------------------------------
            // Return to supplier list
            // ------------------------------------------------

            navigate(
                "/suppliers"
            );

        }

        catch (err) {

            console.error(
                "Supplier create error:",
                err
            );


            console.error(
                "Response:",
                err.response?.data
            );


            console.error(
                "Status:",
                err.response?.status
            );


            setError(

                err.response?.data?.message ||

                err.response?.data?.title ||

                err.message ||

                "Failed to create supplier"

            );

        }

        finally {

            setLoading(false);

        }

    };


    // ========================================================
    // BACK
    // ========================================================

    const handleBack = () => {

        navigate(
            "/suppliers"
        );

    };


    // ========================================================
    // UI
    // ========================================================

    return (

        <Box
            sx={{
                width: "100%"
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                display="flex"
                alignItems="center"
                gap={2}
                mb={2}
            >

                <Button
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                    disabled={loading}
                >
                    Back
                </Button>


                <Typography variant="h5">
                    Create Supplier
                </Typography>

            </Box>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>

            )}


            {/* =================================================
                FORM CARD
            ================================================= */}

            <Card>

                <CardContent>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >

                        <Grid
                            container
                            spacing={2}
                        >

                            {/* =================================
                                SELLER ID
                            ================================== */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Seller ID"
                                    name="sellerId"
                                    value={
                                        formData.sellerId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={loading}
                                    inputProps={{
                                        min: 1
                                    }}
                                />

                            </Grid>


                            {/* =================================
                                SUPPLIER NAME
                            ================================== */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    label="Supplier Name"
                                    name="supplierName"
                                    value={
                                        formData.supplierName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={loading}
                                />

                            </Grid>


                            {/* =================================
                                CONTACT PERSON
                            ================================== */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Contact Person"
                                    name="contactPerson"
                                    value={
                                        formData.contactPerson
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={loading}
                                />

                            </Grid>


                            {/* =================================
                                PHONE
                            ================================== */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Phone"
                                    name="phone"
                                    value={
                                        formData.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={loading}
                                />

                            </Grid>


                            {/* =================================
                                EMAIL
                            ================================== */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                            >

                                <TextField
                                    fullWidth
                                    type="email"
                                    label="Email"
                                    name="email"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={loading}
                                />

                            </Grid>


                            {/* =================================
                                GST NUMBER
                            ================================== */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                            >

                                <TextField
                                    fullWidth
                                    label="GST Number"
                                    name="gstNumber"
                                    value={
                                        formData.gstNumber
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={loading}
                                />

                            </Grid>


                            {/* =================================
                                ADDRESS
                            ================================== */}

                            <Grid
                                item
                                xs={12}
                            >

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Address"
                                    name="address"
                                    value={
                                        formData.address
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={loading}
                                />

                            </Grid>


                            {/* =================================
                                CITY
                            ================================== */}

                            <Grid
                                item
                                xs={12}
                                sm={4}
                            >

                                <TextField
                                    fullWidth
                                    label="City"
                                    name="city"
                                    value={
                                        formData.city
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={loading}
                                />

                            </Grid>


                            {/* =================================
                                STATE
                            ================================== */}

                            <Grid
                                item
                                xs={12}
                                sm={4}
                            >

                                <TextField
                                    fullWidth
                                    label="State"
                                    name="state"
                                    value={
                                        formData.state
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={loading}
                                />

                            </Grid>


                            {/* =================================
                                COUNTRY
                            ================================== */}

                            <Grid
                                item
                                xs={12}
                                sm={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Country"
                                    name="country"
                                    value={
                                        formData.country
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={loading}
                                />

                            </Grid>


                            {/* =================================
                                ACTIONS
                            ================================== */}

                            <Grid
                                item
                                xs={12}
                            >

                                <Box
                                    display="flex"
                                    gap={2}
                                >

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={
                                            loading
                                                ? <CircularProgress
                                                    size={20}
                                                    color="inherit"
                                                />
                                                : <Save />
                                        }
                                        disabled={loading}
                                    >

                                        {loading
                                            ? "Saving..."
                                            : "Save Supplier"}

                                    </Button>


                                    <Button
                                        type="button"
                                        variant="outlined"
                                        startIcon={
                                            <ArrowBack />
                                        }
                                        onClick={
                                            handleBack
                                        }
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>

                                </Box>

                            </Grid>

                        </Grid>

                    </Box>

                </CardContent>

            </Card>

        </Box>
    );

};


export default SupplierCreate;
