import React, {
    useState
} from "react";

import {
    Alert,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Paper,
    TextField,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Save
} from "@mui/icons-material";

import {
    useNavigate
} from "react-router-dom";


const SERVER_URL =
    "http://localhost:5000";


const initialState = {

    WarehouseId: "",
    SellerId: "",
    CustomerId: "",

    LocationCode: "",
    LocationName: "",

    Description: "",

    IsActive: true
};


const WarehouseLocationCreate = () => {

    const navigate =
        useNavigate();


    const [
        formData,
        setFormData
    ] = useState(
        initialState
    );


    const [
        loading,
        setLoading
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    const [
        success,
        setSuccess
    ] = useState("");


    // =====================================================
    // HANDLE CHANGE
    // =====================================================

    const handleChange = event => {

        const {
            name,
            value
        } = event.target;


        setFormData(
            previous => ({
                ...previous,
                [name]: value
            })
        );
    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit =
        async event => {

            event.preventDefault();

            setError("");
            setSuccess("");


            // =================================================
            // VALIDATION
            // =================================================

            if (!formData.WarehouseId) {

                setError(
                    "Warehouse ID is required."
                );

                return;
            }


            if (!formData.SellerId) {

                setError(
                    "Seller ID is required."
                );

                return;
            }


            if (!formData.LocationCode.trim()) {

                setError(
                    "Location code is required."
                );

                return;
            }


            if (!formData.LocationName.trim()) {

                setError(
                    "Location name is required."
                );

                return;
            }


            try {

                setLoading(true);


                // =================================================
                // PAYLOAD
                // =================================================

                const payload = {

                    WarehouseId:
                        Number(
                            formData.WarehouseId
                        ),

                    SellerId:
                        Number(
                            formData.SellerId
                        ),

                    CustomerId:
                        formData.CustomerId
                            ? Number(
                                formData.CustomerId
                            )
                            : null,

                    LocationCode:
                        formData.LocationCode.trim(),

                    LocationName:
                        formData.LocationName.trim(),

                    Description:
                        formData.Description.trim() ||
                        null,

                    IsActive:
                        Boolean(
                            formData.IsActive
                        )
                };


                console.log(
                    "POST /api/warehouse-locations"
                );

                console.log(
                    "BODY:",
                    payload
                );


                // =================================================
                // NODE API
                // =================================================

                const response =
                    await fetch(
                        `${SERVER_URL}/api/warehouse-locations`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Accept":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    payload
                                )
                        }
                    );


                const data =
                    await response
                        .json()
                        .catch(
                            () => null
                        );


                console.log(
                    "POST RESPONSE:",
                    data
                );


                // =================================================
                // ERROR
                // =================================================

                if (!response.ok) {

                    throw new Error(
                        data?.message ||
                        data?.error ||
                        "Failed to create warehouse location."
                    );
                }


                // =================================================
                // SUCCESS
                // =================================================

                setSuccess(
                    "Warehouse location created successfully."
                );


                setTimeout(
                    () => {

                        navigate(
                            "/warehouse-locations"
                        );

                    },
                    700
                );

            } catch (err) {

                console.error(
                    "CREATE WAREHOUSE LOCATION ERROR:",
                    err
                );


                setError(
                    err.message ||
                    "Failed to create warehouse location."
                );

            } finally {

                setLoading(false);
            }
        };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box sx={{ p: 3 }}>

            {/* =============================================
                BACK
            ============================================= */}

            <Button
                startIcon={
                    <ArrowBack />
                }
                onClick={() =>
                    navigate(
                        "/warehouse-locations"
                    )
                }
                sx={{
                    mb: 2
                }}
            >
                Back
            </Button>


            {/* =============================================
                CARD
            ============================================= */}

            <Paper
                sx={{
                    p: 3
                }}
            >

                <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{
                        mb: 3
                    }}
                >
                    Create Warehouse Location
                </Typography>


                {/* =========================================
                    ERROR
                ========================================= */}

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


                {/* =========================================
                    SUCCESS
                ========================================= */}

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


                {/* =========================================
                    FORM
                ========================================= */}

                <Box
                    component="form"
                    onSubmit={
                        handleSubmit
                    }
                >

                    <Grid
                        container
                        spacing={2}
                    >

                        {/* =================================
                            WAREHOUSE ID
                        ================================= */}

                        <Grid
                            item
                            xs={12}
                            sm={4}
                        >

                            <TextField
                                fullWidth
                                required
                                label="Warehouse ID"
                                name="WarehouseId"
                                type="number"
                                value={
                                    formData.WarehouseId
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>


                        {/* =================================
                            SELLER ID
                        ================================= */}

                        <Grid
                            item
                            xs={12}
                            sm={4}
                        >

                            <TextField
                                fullWidth
                                required
                                label="Seller ID"
                                name="SellerId"
                                type="number"
                                value={
                                    formData.SellerId
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>


                        {/* =================================
                            CUSTOMER ID
                        ================================= */}

                        <Grid
                            item
                            xs={12}
                            sm={4}
                        >

                            <TextField
                                fullWidth
                                label="Customer ID"
                                name="CustomerId"
                                type="number"
                                value={
                                    formData.CustomerId
                                }
                                onChange={
                                    handleChange
                                }
                                helperText="Optional"
                            />

                        </Grid>


                        {/* =================================
                            LOCATION CODE
                        ================================= */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <TextField
                                fullWidth
                                required
                                label="Location Code"
                                name="LocationCode"
                                value={
                                    formData.LocationCode
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>


                        {/* =================================
                            LOCATION NAME
                        ================================= */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <TextField
                                fullWidth
                                required
                                label="Location Name"
                                name="LocationName"
                                value={
                                    formData.LocationName
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>


                        {/* =================================
                            DESCRIPTION
                        ================================= */}

                        <Grid
                            item
                            xs={12}
                        >

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Description"
                                name="Description"
                                value={
                                    formData.Description
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>


                        {/* =================================
                            ACTIVE
                        ================================= */}

                        <Grid
                            item
                            xs={12}
                        >

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={
                                            formData.IsActive
                                        }
                                        onChange={
                                            event =>
                                                setFormData(
                                                    previous => ({
                                                        ...previous,

                                                        IsActive:
                                                            event
                                                                .target
                                                                .checked
                                                    })
                                                )
                                        }
                                    />
                                }
                                label="Active"
                            />

                        </Grid>


                        {/* =================================
                            SAVE
                        ================================= */}

                        <Grid
                            item
                            xs={12}
                        >

                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={
                                    <Save />
                                }
                                disabled={
                                    loading
                                }
                            >
                                {loading
                                    ? "Saving..."
                                    : "Create Location"}
                            </Button>

                        </Grid>

                    </Grid>

                </Box>

            </Paper>

        </Box>
    );
};


export default WarehouseLocationCreate;
