import React, {
    useEffect,
    useState
} from "react";

import {
    Alert,
    Box,
    Button,
    Checkbox,
    CircularProgress,
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
    useNavigate,
    useParams
} from "react-router-dom";


const SERVER_URL =
    "http://localhost:5000";


const WarehouseLocationEdit = () => {

    const {
        id
    } = useParams();

    const navigate =
        useNavigate();


    const [
        formData,
        setFormData
    ] = useState(null);

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
    ] = useState("");


    // =====================================================
    // LOAD
    // =====================================================

    useEffect(() => {

        const loadLocation =
            async () => {

                try {

                    setLoading(true);
                    setError("");

                    const response =
                        await fetch(
                            `${SERVER_URL}/api/warehouse-locations/${id}`
                        );

                    const data =
                        await response.json()
                            .catch(() => null);


                    if (!response.ok) {

                        throw new Error(
                            data?.message ||
                            "Warehouse location not found."
                        );
                    }


                    setFormData({

                        WarehouseId:
                            data.WarehouseId ??
                            data.warehouseId ??
                            "",

                        CustomerId:
                            data.CustomerId ??
                            data.customerId ??
                            "",

                        LocationCode:
                            data.LocationCode ??
                            data.locationCode ??
                            "",

                        LocationName:
                            data.LocationName ??
                            data.locationName ??
                            "",

                        Aisle:
                            data.Aisle ??
                            data.aisle ??
                            "",

                        Rack:
                            data.Rack ??
                            data.rack ??
                            "",

                        Shelf:
                            data.Shelf ??
                            data.shelf ??
                            "",

                        Bin:
                            data.Bin ??
                            data.bin ??
                            "",

                        Description:
                            data.Description ??
                            data.description ??
                            "",

                        IsActive:
                            data.IsActive ??
                            data.isActive ??
                            true
                    });

                } catch (err) {

                    setError(
                        err.message ||
                        "Failed to load warehouse location."
                    );

                } finally {

                    setLoading(false);
                }
            };


        if (id) {
            loadLocation();
        }

    }, [id]);


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
    // UPDATE
    // =====================================================

    const handleSubmit = async event => {

        event.preventDefault();

        try {

            setSaving(true);
            setError("");
            setSuccess("");


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
                    `${SERVER_URL}/api/warehouse-locations/${id}`,
                    {
                        method: "PUT",

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
                    "Failed to update warehouse location."
                );
            }


            setSuccess(
                "Warehouse location updated successfully."
            );


            setTimeout(() => {

                navigate(
                    "/warehouse-locations"
                );

            }, 700);

        } catch (err) {

            setError(
                err.message ||
                "Failed to update warehouse location."
            );

        } finally {

            setSaving(false);
        }
    };


    if (loading) {

        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    py: 10
                }}
            >
                <CircularProgress />
            </Box>
        );
    }


    if (!formData) {

        return (
            <Box sx={{ p: 3 }}>

                <Alert severity="error">
                    {error ||
                        "Warehouse location not found."}
                </Alert>

            </Box>
        );
    }


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
                    Edit Warehouse Location
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
                                            Boolean(
                                                formData.IsActive
                                            )
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
                                disabled={saving}
                            >
                                {saving
                                    ? "Updating..."
                                    : "Update Location"}
                            </Button>

                        </Grid>

                    </Grid>

                </Box>

            </Paper>

        </Box>
    );
};


export default WarehouseLocationEdit;