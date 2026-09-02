import React, {
    useEffect,
    useState
} from "react";

import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Grid,
    Paper,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Edit
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";


const SERVER_URL =
    "http://localhost:5000";


const WarehouseLocationDetails = () => {

    const {
        id
    } = useParams();

    const navigate =
        useNavigate();


    const [
        location,
        setLocation
    ] = useState(null);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");


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


                    setLocation(data);

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


    if (error || !location) {

        return (
            <Box sx={{ p: 3 }}>

                <Alert severity="error">
                    {error ||
                        "Warehouse location not found."}
                </Alert>

                <Button
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate(
                            "/warehouse-locations"
                        )
                    }
                    sx={{ mt: 2 }}
                >
                    Back
                </Button>

            </Box>
        );
    }


    const locationId =
        location.LocationId ??
        location.locationId;

    const warehouseId =
        location.WarehouseId ??
        location.warehouseId;

    const customerId =
        location.CustomerId ??
        location.customerId;

    const active =
        Boolean(
            location.IsActive ??
            location.isActive
        );


    const value = (
        upper,
        lower
    ) =>
        location[upper] ??
        location[lower] ??
        "-";


    return (
        <Box sx={{ p: 3 }}>

            <Box
                sx={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    mb: 3
                }}
            >

                <Button
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate(
                            "/warehouse-locations"
                        )
                    }
                >
                    Back
                </Button>


                <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() =>
                        navigate(
                            `/warehouse-locations/edit/${locationId}`
                        )
                    }
                >
                    Edit
                </Button>

            </Box>


            <Paper sx={{ p: 3 }}>

                <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{ mb: 3 }}
                >
                    Warehouse Location Details
                </Typography>


                <Grid
                    container
                    spacing={3}
                >

                    <Grid item xs={12} sm={6} md={3}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Location ID
                        </Typography>

                        <Typography
                            fontWeight={600}
                        >
                            {locationId}
                        </Typography>

                    </Grid>


                    <Grid item xs={12} sm={6} md={3}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Warehouse ID
                        </Typography>

                        <Typography
                            fontWeight={600}
                        >
                            {warehouseId}
                        </Typography>

                    </Grid>


                    <Grid item xs={12} sm={6} md={3}>

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


                    <Grid item xs={12} sm={6} md={3}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Status
                        </Typography>

                        <Box sx={{ mt: 0.5 }}>

                            <Chip
                                label={
                                    active
                                        ? "Active"
                                        : "Inactive"
                                }
                                color={
                                    active
                                        ? "success"
                                        : "default"
                                }
                            />

                        </Box>

                    </Grid>


                    <Grid item xs={12} sm={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Location Code
                        </Typography>

                        <Typography>
                            {value(
                                "LocationCode",
                                "locationCode"
                            )}
                        </Typography>

                    </Grid>


                    <Grid item xs={12} sm={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Location Name
                        </Typography>

                        <Typography>
                            {value(
                                "LocationName",
                                "locationName"
                            )}
                        </Typography>

                    </Grid>


                    <Grid item xs={12} sm={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Aisle
                        </Typography>

                        <Typography>
                            {value(
                                "Aisle",
                                "aisle"
                            )}
                        </Typography>

                    </Grid>


                    <Grid item xs={12} sm={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Rack
                        </Typography>

                        <Typography>
                            {value(
                                "Rack",
                                "rack"
                            )}
                        </Typography>

                    </Grid>


                    <Grid item xs={12} sm={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Shelf
                        </Typography>

                        <Typography>
                            {value(
                                "Shelf",
                                "shelf"
                            )}
                        </Typography>

                    </Grid>


                    <Grid item xs={12} sm={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Bin
                        </Typography>

                        <Typography>
                            {value(
                                "Bin",
                                "bin"
                            )}
                        </Typography>

                    </Grid>


                    <Grid item xs={12}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Description
                        </Typography>

                        <Typography>
                            {value(
                                "Description",
                                "description"
                            )}
                        </Typography>

                    </Grid>


                    <Grid item xs={12} sm={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Created Date
                        </Typography>

                        <Typography>
                            {value(
                                "CreatedDate",
                                "createdDate"
                            )}
                        </Typography>

                    </Grid>


                    <Grid item xs={12} sm={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Updated Date
                        </Typography>

                        <Typography>
                            {value(
                                "UpdatedDate",
                                "updatedDate"
                            )}
                        </Typography>

                    </Grid>

                </Grid>

            </Paper>

        </Box>
    );
};


export default WarehouseLocationDetails;