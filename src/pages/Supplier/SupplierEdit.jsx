import React, {
    useEffect,
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
    useNavigate,
    useParams
} from "react-router-dom";

import axios from "axios";


// ============================================================
// NODE SERVER / PROXY URL
// ============================================================

const API_URL = "http://localhost:5000/api";


// ============================================================
// SUPPLIER EDIT
// ============================================================

const SupplierEdit = () => {

    const {
        id
    } = useParams();

    const navigate = useNavigate();


    // ========================================================
    // FORM STATE
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

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");


    // ========================================================
    // LOAD SUPPLIER
    // ========================================================

    useEffect(() => {

        const loadSupplier = async () => {

            // ------------------------------------------------
            // Validate route parameter
            // ------------------------------------------------

            if (
                !id ||
                id === ":id" ||
                isNaN(Number(id))
            ) {

                console.error(
                    "Invalid supplier ID:",
                    id
                );

                setError(
                    "Invalid supplier ID"
                );

                setLoading(false);

                return;
            }


            try {

                setLoading(true);

                setError("");


                console.log(
                    "Loading supplier ID:",
                    id
                );


                // ------------------------------------------------
                // React -> Node
                // ------------------------------------------------

                const response =
                    await axios.get(
                        `${API_URL}/Supplier/${id}`
                    );


                console.log(
                    "Supplier API response:",
                    response.data
                );


                const supplier =
                    response.data;


                if (!supplier) {

                    throw new Error(
                        "Supplier data was not returned"
                    );
                }


                // ------------------------------------------------
                // Populate form
                // ------------------------------------------------

                setFormData({

                    sellerId:
                        supplier.sellerId ??
                        "",

                    supplierName:
                        supplier.supplierName ??
                        "",

                    contactPerson:
                        supplier.contactPerson ??
                        "",

                    phone:
                        supplier.phone ??
                        "",

                    email:
                        supplier.email ??
                        "",

                    address:
                        supplier.address ??
                        "",

                    city:
                        supplier.city ??
                        "",

                    state:
                        supplier.state ??
                        "",

                    country:
                        supplier.country ??
                        "",

                    gstNumber:
                        supplier.gstNumber ??
                        ""

                });

            }

            catch (err) {

                console.error(
                    "Supplier loading error:",
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

                    "Failed to load supplier"

                );

            }

            finally {

                setLoading(false);

            }

        };


        loadSupplier();

    }, [id]);


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
    // UPDATE SUPPLIER
    // ========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // ----------------------------------------------------
        // Validate ID
        // ----------------------------------------------------

        if (
            !id ||
            id === ":id" ||
            isNaN(Number(id))
        ) {

            setError(
                "Invalid supplier ID"
            );

            return;
        }


        // ----------------------------------------------------
        // Validate required fields
        // ----------------------------------------------------

        if (
            !formData.sellerId ||
            !formData.supplierName.trim()
        ) {

            setError(
                "Seller ID and Supplier Name are required"
            );

            return;
        }


        try {

            setSaving(true);

            setError("");


            // ------------------------------------------------
            // Prepare payload
            // ------------------------------------------------

            const payload = {

                sellerId:
                    Number(formData.sellerId),

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
                "Updating supplier:",
                id
            );

            console.log(
                "Supplier payload:",
                payload
            );


            // ------------------------------------------------
            // React -> Node -> ASP.NET
            // ------------------------------------------------

            const response =
                await axios.put(
                    `${API_URL}/Supplier/${id}`,
                    payload,
                    {
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );


            console.log(
                "Supplier update response:",
                response.data
            );


            // ------------------------------------------------
            // Back to supplier list
            // ------------------------------------------------

            navigate(
                "/suppliers"
            );

        }

        catch (err) {

            console.error(
                "Supplier update error:",
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

                "Failed to update supplier"

            );

        }

        finally {

            setSaving(false);

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
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="300px"
            >

                <CircularProgress />

            </Box>

        );

    }


    // ========================================================
    // UI
    // ========================================================

    return (

        <Box
            sx={{
                width: "100%"
            }}
        >

            {/* ================================================
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
                >
                    Back
                </Button>


                <Typography variant="h5">
                    Edit Supplier
                </Typography>

            </Box>


            {/* ================================================
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


            {/* ================================================
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
                                            <Save />
                                        }
                                        disabled={saving}
                                    >

                                        {saving
                                            ? "Updating..."
                                            : "Update Supplier"}

                                    </Button>


                                    <Button
                                        variant="outlined"
                                        onClick={
                                            handleBack
                                        }
                                        disabled={saving}
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


export default SupplierEdit;
