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
    CustomerId: "",

    LocationCode: "",
    LocationName: "",

    Aisle: "",
    Rack: "",
    Shelf: "",
    Bin: "",

    Description: "",

    IsActive: true
};


const WarehouseLocationCreate = () => {

    const navigate = useNavigate();

    const [
        formData,
        setFormData
    ] = useState(initialState);

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


    const handleSubmit = async event => {

        event.preventDefault();

        setError("");
        setSuccess("");


        if (!formData.WarehouseId) {

            setError(
                "Warehouse ID is required."
            );

            return;
        }


        if (!formData.CustomerId) {

            setError(
                "Customer ID is required."
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


            const payload = {

                ...formData,

                WarehouseId:
                    Number(
                        formData.WarehouseId
                    ),

                CustomerId:
                    Number(
                        formData.CustomerId
                    )
            };


            const response =
                await fetch(
                    `${SERVER_URL}/api/warehouse-locations`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                payload
                            )
                    }
                );


            const data =
                await response.json()
                    .catch(() => null);


            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    "Failed to create warehouse location."
                );
            }


            setSuccess(
                "Warehouse location created successfully."
            );


            setTimeout(() => {

                navigate(
                    "/warehouse-locations"
                );

            }, 700);

        } catch (err) {

            setError(
                err.message ||
                "Failed to create warehouse location."
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <Box sx={{ p: 3 }}>

            <Button
                startIcon={<ArrowBack />}
                onClick={() =>
                    navigate(
                        "/warehouse-locations"
                    )
                }
                sx={{ mb: 2 }}
            >
                Back
            </Button>


            <Paper sx={{ p: 3 }}>

                <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{ mb: 3 }}
                >
                    Create Warehouse Location
                </Typography>


                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Alert>
                )}


                {success && (
                    <Alert
                        severity="success"
                        sx={{ mb: 2 }}
                    >
                        {success}
                    </Alert>
                )}


                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >

                    <Grid
                        container
                        spacing={2}
                    >

                        <Grid item xs={12} sm={6}>
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


                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Customer ID"
                                name="CustomerId"
                                type="number"
                                value={
                                    formData.CustomerId
                                }
                                onChange={
                                    handleChange
                                }
                            />
                        </Grid>


                        <Grid item xs={12} sm={6}>
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


                        <Grid item xs={12} sm={6}>
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


                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Aisle"
                                name="Aisle"
                                value={
                                    formData.Aisle
                                }
                                onChange={
                                    handleChange
                                }
                            />
                        </Grid>


                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Rack"
                                name="Rack"
                                value={
                                    formData.Rack
                                }
                                onChange={
                                    handleChange
                                }
                            />
                        </Grid>


                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Shelf"
                                name="Shelf"
                                value={
                                    formData.Shelf
                                }
                                onChange={
                                    handleChange
                                }
                            />
                        </Grid>


                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Bin"
                                name="Bin"
                                value={
                                    formData.Bin
                                }
                                onChange={
                                    handleChange
                                }
                            />
                        </Grid>


                        <Grid item xs={12}>
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


                        <Grid item xs={12}>

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={
                                            formData.IsActive
                                        }
                                        onChange={event =>
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


                        <Grid item xs={12}>

                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<Save />}
                                disabled={loading}
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