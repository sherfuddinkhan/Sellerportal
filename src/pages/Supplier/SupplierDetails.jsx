import React, {
    useEffect,
    useState
} from "react";

import {
    Box,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Grid,
    Typography,
    Divider,
    Button
} from "@mui/material";

import {
    ArrowBack
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import axios from "axios";

const API_URL = "http://localhost:5000/api";

const SupplierDetails = () => {

    const {
        id
    } = useParams();

    const navigate = useNavigate();

    const [supplier, setSupplier] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ========================================================
    // LOAD SUPPLIER
    // ========================================================

    useEffect(() => {

        const loadSupplier = async () => {

            try {

                setLoading(true);

                setError("");


                console.log(
                    "URL ID:",
                    id
                );


                const supplierId =
                    Number(id);


                if (
                    !Number.isInteger(supplierId) ||
                    supplierId <= 0
                ) {

                    throw new Error(
                        `Invalid Supplier ID: ${id}`
                    );

                }


                const response =
                    await axios.get(
                        `${API_URL}/Supplier/${supplierId}`
                    );


                console.log(
                    "Supplier response:",
                    response.data
                );


                setSupplier(
                    response.data
                );

            }

            catch (err) {

                console.error(
                    "Supplier details error:",
                    err
                );


                setError(

                    err.response?.data?.message ||

                    err.response?.data?.title ||

                    err.message ||

                    "Failed to load supplier details"

                );

            }

            finally {

                setLoading(false);

            }

        };


        loadSupplier();

    }, [id]);


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
    // ERROR
    // ========================================================

    if (error) {

        return (

            <Box sx={{ p: 3 }}>

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

                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 600
                        }}
                    >
                        Supplier Details
                    </Typography>

                </Box>


                <Alert severity="error">
                    {error}
                </Alert>

            </Box>

        );

    }


    // ========================================================
    // NOT FOUND
    // ========================================================

    if (!supplier) {

        return (

            <Box sx={{ p: 3 }}>

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

                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 600
                        }}
                    >
                        Supplier Details
                    </Typography>

                </Box>


                <Alert severity="warning">
                    Supplier not found.
                </Alert>

            </Box>

        );

    }


    // ========================================================
    // UI
    // ========================================================

    return (

        <Box sx={{ p: 3 }}>

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                display="flex"
                alignItems="center"
                gap={2}
                mb={3}
            >

                <Button
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                >
                    Back
                </Button>


                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600
                    }}
                >
                    Supplier Details
                </Typography>

            </Box>


            {/* =================================================
                SUPPLIER CARD
            ================================================= */}

            <Card>

                <CardContent>

                    <Grid
                        container
                        spacing={3}
                    >

                        {/* =====================================
                            SUPPLIER ID
                        ====================================== */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Supplier ID
                            </Typography>

                            <Typography>
                                {supplier.supplierId ?? "-"}
                            </Typography>

                        </Grid>


                        {/* =====================================
                            SELLER ID
                        ====================================== */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Seller ID
                            </Typography>

                            <Typography>
                                {supplier.sellerId ?? "-"}
                            </Typography>

                        </Grid>


                        {/* =====================================
                            SUPPLIER NAME
                        ====================================== */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Supplier Name
                            </Typography>

                            <Typography>
                                {supplier.supplierName ?? "-"}
                            </Typography>

                        </Grid>


                        {/* =====================================
                            CONTACT PERSON
                        ====================================== */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Contact Person
                            </Typography>

                            <Typography>
                                {supplier.contactPerson ?? "-"}
                            </Typography>

                        </Grid>


                        {/* =====================================
                            PHONE
                        ====================================== */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Phone
                            </Typography>

                            <Typography>
                                {supplier.phone ?? "-"}
                            </Typography>

                        </Grid>


                        {/* =====================================
                            EMAIL
                        ====================================== */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Email
                            </Typography>

                            <Typography>
                                {supplier.email ?? "-"}
                            </Typography>

                        </Grid>


                        {/* =====================================
                            DIVIDER
                        ====================================== */}

                        <Grid item xs={12}>

                            <Divider />

                        </Grid>


                        {/* =====================================
                            ADDRESS
                        ====================================== */}

                        <Grid item xs={12}>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Address
                            </Typography>

                            <Typography>
                                {supplier.address ?? "-"}
                            </Typography>

                        </Grid>


                        {/* =====================================
                            CITY
                        ====================================== */}

                        <Grid
                            item
                            xs={12}
                            sm={4}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                City
                            </Typography>

                            <Typography>
                                {supplier.city ?? "-"}
                            </Typography>

                        </Grid>


                        {/* =====================================
                            STATE
                        ====================================== */}

                        <Grid
                            item
                            xs={12}
                            sm={4}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                State
                            </Typography>

                            <Typography>
                                {supplier.state ?? "-"}
                            </Typography>

                        </Grid>


                        {/* =====================================
                            COUNTRY
                        ====================================== */}

                        <Grid
                            item
                            xs={12}
                            sm={4}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Country
                            </Typography>

                            <Typography>
                                {supplier.country ?? "-"}
                            </Typography>

                        </Grid>


                        {/* =====================================
                            GST NUMBER
                        ====================================== */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                GST Number
                            </Typography>

                            <Typography>
                                {supplier.gstNumber ?? "-"}
                            </Typography>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>

        </Box>
    );

};

export default SupplierDetails;
