// =========================================================
// SellerForm.jsx
// Marketplace Seller Portal
// =========================================================

import React, {
    useEffect,
    useState,
} from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import axios from "axios";

// =========================================================
// NODE SERVER
// =========================================================

const API_URL =
    "http://localhost:5000/api";

// =========================================================
// INITIAL STATE
// =========================================================

const initialSeller = {

    sellerName: "",
    tradeName: "",
    legalName: "",

    contactPerson: "",
    email: "",
    phone: "",

    gstin: "",

    address: "",
    buildingName: "",
    location: "",
    city: "",
    state: "",
    stateCode: "",
    floorNo: "",
    postalCode: "",
    country: "",
};

// =========================================================
// COMPONENT
// =========================================================

const SellerForm = () => {

    const navigate = useNavigate();

    const {
        sellerId,
    } = useParams();

    const isEditMode =
        Boolean(sellerId);

    const [seller, setSeller] =
        useState(initialSeller);

    const [loading, setLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    // =====================================================
    // LOAD SELLER
    // =====================================================

    useEffect(() => {

        if (isEditMode) {
            loadSeller();
        }

    }, [sellerId]);

    // =====================================================
    // GET SELLER
    // =====================================================

    const loadSeller = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await axios.get(
                    `${API_URL}/sellers/${sellerId}`,
                    {
                        timeout: 30000,
                    }
                );

            const data =
                response.data;

            setSeller({

                sellerName:
                    data.sellerName ??
                    data.SellerName ??
                    "",

                tradeName:
                    data.tradeName ??
                    data.TradeName ??
                    "",

                legalName:
                    data.legalName ??
                    data.LegalName ??
                    "",

                contactPerson:
                    data.contactPerson ??
                    data.ContactPerson ??
                    "",

                email:
                    data.email ??
                    data.Email ??
                    "",

                phone:
                    data.phone ??
                    data.Phone ??
                    "",

                gstin:
                    data.gstin ??
                    data.GSTIN ??
                    "",

                address:
                    data.address ??
                    data.Address ??
                    "",

                buildingName:
                    data.buildingName ??
                    data.BuildingName ??
                    "",

                location:
                    data.location ??
                    data.Location ??
                    "",

                city:
                    data.city ??
                    data.City ??
                    "",

                state:
                    data.state ??
                    data.State ??
                    "",

                stateCode:
                    data.stateCode ??
                    data.StateCode ??
                    "",

                floorNo:
                    data.floorNo ??
                    data.FloorNo ??
                    "",

                postalCode:
                    data.postalCode ??
                    data.PostalCode ??
                    "",

                country:
                    data.country ??
                    data.Country ??
                    "",
            });

        }
        catch (err) {

            console.error(
                "LOAD SELLER ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to load seller."
            );

        }
        finally {

            setLoading(false);
        }
    };

    // =====================================================
    // CHANGE
    // =====================================================

    const handleChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;

        setSeller(
            previous => ({
                ...previous,
                [name]: value,
            })
        );
    };

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        if (
            !seller.sellerName.trim()
        ) {

            setError(
                "Seller name is required."
            );

            return;
        }

        try {

            setSaving(true);

            const payload = {
                ...seller,

                sellerName:
                    seller.sellerName.trim(),

                tradeName:
                    seller.tradeName.trim(),

                legalName:
                    seller.legalName.trim(),

                contactPerson:
                    seller.contactPerson.trim(),

                email:
                    seller.email.trim(),

                phone:
                    seller.phone.trim(),

                gstin:
                    seller.gstin.trim(),

                address:
                    seller.address.trim(),

                buildingName:
                    seller.buildingName.trim(),

                location:
                    seller.location.trim(),

                city:
                    seller.city.trim(),

                state:
                    seller.state.trim(),

                stateCode:
                    seller.stateCode.trim(),

                floorNo:
                    seller.floorNo.trim(),

                postalCode:
                    seller.postalCode.trim(),

                country:
                    seller.country.trim(),
            };

            if (isEditMode) {

                await axios.put(
                    `${API_URL}/sellers/${sellerId}`,
                    payload,
                    {
                        timeout: 30000,
                    }
                );

                setSuccess(
                    "Seller updated successfully."
                );

            }
            else {

                await axios.post(
                    `${API_URL}/sellers`,
                    payload,
                    {
                        timeout: 30000,
                    }
                );

                setSuccess(
                    "Seller created successfully."
                );

                setSeller(
                    initialSeller
                );
            }

        }
        catch (err) {

            console.error(
                "SAVE SELLER ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Unable to save seller."
            );

        }
        finally {

            setSaving(false);
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Box
                sx={{
                    minHeight: "70vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >

                <CircularProgress />

            </Box>
        );
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box
            sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                p: {
                    xs: 2,
                    sm: 3,
                    md: 5,
                },
            }}
        >

            <Paper
                elevation={3}
                sx={{
                    width: "100%",
                    maxWidth: 1200,
                    p: {
                        xs: 2,
                        sm: 4,
                        md: 5,
                    },
                    borderRadius: 3,
                }}
            >

                <Box
                    sx={{
                        textAlign: "center",
                        mb: 4,
                    }}
                >

                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        {isEditMode
                            ? "Edit Seller"
                            : "Create Seller"}
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{
                            mt: 1,
                        }}
                    >
                        {isEditMode
                            ? "Update seller information"
                            : "Enter seller information"}
                    </Typography>

                </Box>


                {error && (

                    <Alert
                        severity="error"
                        sx={{
                            mb: 3,
                        }}
                    >
                        {error}
                    </Alert>

                )}


                {success && (

                    <Alert
                        severity="success"
                        sx={{
                            mb: 3,
                        }}
                    >
                        {success}
                    </Alert>

                )}


                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "1fr 1fr",
                            },
                            gap: 3,
                        }}
                    >

                        {[
                            ["sellerName", "Seller Name"],
                            ["tradeName", "Trade Name"],
                            ["legalName", "Legal Name"],
                            ["contactPerson", "Contact Person"],
                            ["email", "Email"],
                            ["phone", "Phone"],
                            ["gstin", "GSTIN"],
                            ["buildingName", "Building Name"],
                            ["location", "Location"],
                            ["city", "City"],
                            ["state", "State"],
                            ["stateCode", "State Code"],
                            ["floorNo", "Floor No"],
                            ["postalCode", "Postal Code"],
                            ["country", "Country"],
                        ].map(
                            ([
                                name,
                                label,
                            ]) => (

                                <TextField
                                    key={name}
                                    name={name}
                                    label={label}
                                    value={
                                        seller[name]
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    fullWidth
                                    size="medium"
                                    required={
                                        name ===
                                        "sellerName"
                                    }
                                    sx={{
                                        "& .MuiOutlinedInput-root":
                                            {
                                                minHeight:
                                                    58,
                                            },
                                    }}
                                />

                            )
                        )}

                        <TextField
                            name="address"
                            label="Address"
                            value={
                                seller.address
                            }
                            onChange={
                                handleChange
                            }
                            fullWidth
                            multiline
                            rows={4}
                            sx={{
                                gridColumn: {
                                    xs: "auto",
                                    md: "1 / -1",
                                },
                            }}
                        />

                    </Box>


                    <Box
                        sx={{
                            display: "flex",
                            justifyContent:
                                "center",
                            gap: 2,
                            mt: 5,
                        }}
                    >

                        <Button
                            type="button"
                            variant="outlined"
                            size="large"
                            onClick={() =>
                                navigate(
                                    "/sellers"
                                )
                            }
                            disabled={saving}
                        >
                            Cancel
                        </Button>


                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={saving}
                            sx={{
                                minWidth: 180,
                            }}
                        >

                            {saving
                                ? "Saving..."
                                : isEditMode
                                    ? "Update Seller"
                                    : "Create Seller"}

                        </Button>

                    </Box>

                </Box>

            </Paper>

        </Box>
    );
};

export default SellerForm;
