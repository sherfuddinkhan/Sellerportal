// =========================================================
// SellerCustomerFilters.jsx
// =========================================================

import React, { useState } from "react";

import {
    Alert,
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField
} from "@mui/material";

import {
    Clear,
    Search
} from "@mui/icons-material";


// =========================================================
// CONFIGURATION
// =========================================================

const SERVER_URL = "http://localhost:5000";


// =========================================================
// COMPONENT
// =========================================================

const SellerCustomerFilters = () => {

    // =====================================================
    // STATE
    // =====================================================

    const [sellerId, setSellerId] = useState("6");

    const [customerId, setCustomerId] = useState("");

    const [customerCode, setCustomerCode] = useState("");

    const [customerName, setCustomerName] = useState("");

    const [contactPerson, setContactPerson] = useState("");

    const [email, setEmail] = useState("");

    const [phone, setPhone] = useState("");

    const [gstin, setGstin] = useState("");

    const [city, setCity] = useState("");

    const [state, setState] = useState("");

    const [status, setStatus] = useState("All");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [results, setResults] = useState([]);


    // =====================================================
    // SEARCH
    // =====================================================

    const handleSearch = async () => {

        try {

            setLoading(true);

            setError("");

            setResults([]);


            if (!sellerId) {

                setError(
                    "Seller ID is required."
                );

                return;
            }


            // =================================================
            // BUILD SEARCH TEXT
            // =================================================

            const search =
                customerId ||
                customerCode ||
                customerName ||
                contactPerson ||
                email ||
                phone ||
                gstin ||
                city ||
                state ||
                "";


            // =================================================
            // BUILD NODE URL
            // =================================================

            const params =
                new URLSearchParams();

            params.append(
                "sellerId",
                sellerId
            );


            if (search.trim()) {

                params.append(
                    "search",
                    search.trim()
                );

            }


            if (status === "Active") {

                params.append(
                    "isActive",
                    "true"
                );

            }

            if (status === "Inactive") {

                params.append(
                    "isActive",
                    "false"
                );

            }


            const url =
                `${SERVER_URL}/api/seller-customers/filter?${params.toString()}`;


            console.log(
                "========================================"
            );

            console.log(
                "SELLER CUSTOMER FILTER"
            );

            console.log(
                "Request URL:",
                url
            );

            console.log(
                "========================================"
            );


            const response =
                await fetch(url, {

                    method: "GET",

                    headers: {
                        Accept: "*/*"
                    }

                });


            if (!response.ok) {

                const text =
                    await response.text();

                throw new Error(
                    `HTTP ${response.status}: ${text}`
                );

            }


            const data =
                await response.json();


            console.log(
                "FILTER RESPONSE:",
                data
            );


            setResults(
                Array.isArray(data)
                    ? data
                    : []
            );

        }
        catch (err) {

            console.error(
                "FILTER CUSTOMER ERROR:",
                err
            );

            setError(
                err.message ||
                "Unable to filter customers."
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // CLEAR
    // =====================================================

    const handleClear = () => {

        setSellerId("6");

        setCustomerId("");

        setCustomerCode("");

        setCustomerName("");

        setContactPerson("");

        setEmail("");

        setPhone("");

        setGstin("");

        setCity("");

        setState("");

        setStatus("All");

        setError("");

        setResults([]);

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box sx={{ p: 3 }}>

            {/* =================================================
                FILTER PANEL
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    mb: 3
                }}
            >

                <Grid
                    container
                    spacing={2}
                >

                    {/* =========================================
                        SELLER ID
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                    >

                        <TextField
                            fullWidth
                            label="Seller ID"
                            placeholder="Enter Seller ID"
                            type="number"
                            value={sellerId}
                            onChange={(event) => {

                                setSellerId(
                                    event.target.value
                                );

                            }}
                        />

                    </Grid>


                    {/* =========================================
                        CUSTOMER ID
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                    >

                        <TextField
                            fullWidth
                            label="Customer ID"
                            placeholder="Enter Customer ID"
                            type="number"
                            value={customerId}
                            onChange={(event) => {

                                setCustomerId(
                                    event.target.value
                                );

                            }}
                        />

                    </Grid>


                    {/* =========================================
                        CUSTOMER CODE
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                    >

                        <TextField
                            fullWidth
                            label="Customer Code"
                            placeholder="Enter Customer Code"
                            value={customerCode}
                            onChange={(event) => {

                                setCustomerCode(
                                    event.target.value
                                );

                            }}
                        />

                    </Grid>


                    {/* =========================================
                        CUSTOMER NAME
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                    >

                        <TextField
                            fullWidth
                            label="Customer Name"
                            placeholder="Enter Customer Name"
                            value={customerName}
                            onChange={(event) => {

                                setCustomerName(
                                    event.target.value
                                );

                            }}
                        />

                    </Grid>


                    {/* =========================================
                        CONTACT PERSON
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                    >

                        <TextField
                            fullWidth
                            label="Contact Person"
                            placeholder="Enter Contact Person"
                            value={contactPerson}
                            onChange={(event) => {

                                setContactPerson(
                                    event.target.value
                                );

                            }}
                        />

                    </Grid>


                    {/* =========================================
                        EMAIL
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                    >

                        <TextField
                            fullWidth
                            label="Email"
                            placeholder="Enter Email"
                            type="email"
                            value={email}
                            onChange={(event) => {

                                setEmail(
                                    event.target.value
                                );

                            }}
                        />

                    </Grid>


                    {/* =========================================
                        PHONE
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                    >

                        <TextField
                            fullWidth
                            label="Phone"
                            placeholder="Enter Phone"
                            value={phone}
                            onChange={(event) => {

                                setPhone(
                                    event.target.value
                                );

                            }}
                        />

                    </Grid>


                    {/* =========================================
                        GSTIN
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                    >

                        <TextField
                            fullWidth
                            label="GSTIN"
                            placeholder="Enter GSTIN"
                            value={gstin}
                            onChange={(event) => {

                                setGstin(
                                    event.target.value
                                );

                            }}
                        />

                    </Grid>


                    {/* =========================================
                        CITY
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                    >

                        <TextField
                            fullWidth
                            label="City"
                            placeholder="Enter City"
                            value={city}
                            onChange={(event) => {

                                setCity(
                                    event.target.value
                                );

                            }}
                        />

                    </Grid>


                    {/* =========================================
                        STATE
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                    >

                        <TextField
                            fullWidth
                            label="State"
                            placeholder="Enter State"
                            value={state}
                            onChange={(event) => {

                                setState(
                                    event.target.value
                                );

                            }}
                        />

                    </Grid>


                    {/* =========================================
                        STATUS
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                    >

                        <FormControl
                            fullWidth
                        >

                            <InputLabel>
                                Status
                            </InputLabel>

                            <Select
                                value={status}
                                label="Status"
                                onChange={(event) => {

                                    setStatus(
                                        event.target.value
                                    );

                                }}
                            >

                                <MenuItem value="All">
                                    All
                                </MenuItem>

                                <MenuItem value="Active">
                                    Active
                                </MenuItem>

                                <MenuItem value="Inactive">
                                    Inactive
                                </MenuItem>

                            </Select>

                        </FormControl>

                    </Grid>


                    {/* =========================================
                        BUTTONS
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                    >

                        <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="flex-end"
                            sx={{
                                mt: 1
                            }}
                        >

                            <Button
                                variant="outlined"
                                startIcon={<Clear />}
                                onClick={
                                    handleClear
                                }
                                disabled={loading}
                            >
                                Clear
                            </Button>


                            <Button
                                variant="contained"
                                startIcon={<Search />}
                                onClick={
                                    handleSearch
                                }
                                disabled={loading}
                            >
                                {loading
                                    ? "Searching..."
                                    : "Search"}
                            </Button>

                        </Stack>

                    </Grid>

                </Grid>

            </Paper>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {error}
                </Alert>

            )}


            {/* =================================================
                RESULTS
            ================================================= */}

            {results.length > 0 && (

                <Paper
                    elevation={2}
                    sx={{
                        p: 3
                    }}
                >

                    <Box
                        sx={{
                            mb: 2
                        }}
                    >

                        <strong>
                            Results: {results.length}
                        </strong>

                    </Box>

                    {results.map(
                        (customer, index) => (

                            <Box
                                key={
                                    customer.customerId ??
                                    customer.CustomerId ??
                                    index
                                }
                                sx={{
                                    py: 1,
                                    borderBottom:
                                        "1px solid",
                                    borderColor:
                                        "divider"
                                }}
                            >

                                <strong>
                                    {
                                        customer.customerName ??
                                        customer.CustomerName ??
                                        "-"
                                    }
                                </strong>

                                {" — "}

                                {
                                    customer.customerCode ??
                                    customer.CustomerCode ??
                                    "-"
                                }

                            </Box>

                        )
                    )}

                </Paper>

            )}

        </Box>

    );

};

export default SellerCustomerFilters;