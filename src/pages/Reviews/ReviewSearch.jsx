import React, {
    useState,
} from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import {
    Clear,
    Search,
} from "@mui/icons-material";

import axios from "axios";


// ======================================================
// API
// ======================================================

const SERVER_URL =
    "http://localhost:5000";

const REVIEW_API =
    `${SERVER_URL}/api/reviews`;


// ======================================================
// Review Search
// ======================================================

const ReviewSearch = () => {

    // ==================================================
    // State
    // ==================================================

    const [
        searchText,
        setSearchText,
    ] = useState("");

    const [
        results,
        setResults,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        searched,
        setSearched,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");


    // ==================================================
    // Search Reviews
    // ==================================================

    const handleSearch = async () => {

        const search =
            searchText.trim();

        if (!search) {

            setResults([]);

            setSearched(false);

            setError(
                "Please enter a search term."
            );

            return;

        }


        try {

            setLoading(true);

            setError("");

            setSearched(true);


            const response =
                await axios.get(
                    `${REVIEW_API}/filter`,
                    {
                        params: {
                            search,
                        },
                    }
                );


            const data =
                response?.data;


            // ==========================================
            // Normalize API Response
            // ==========================================

            let reviewList = [];


            if (
                Array.isArray(data)
            ) {

                reviewList =
                    data;

            } else if (
                Array.isArray(
                    data?.items
                )
            ) {

                reviewList =
                    data.items;

            } else if (
                Array.isArray(
                    data?.reviews
                )
            ) {

                reviewList =
                    data.reviews;

            }


            setResults(
                reviewList
            );


        } catch (err) {

            console.error(
                "SEARCH REVIEWS ERROR:",
                err
            );


            setResults([]);


            setError(
                err?.response?.data?.message ||
                "Unable to search reviews."
            );


        } finally {

            setLoading(false);

        }

    };


    // ==================================================
    // Clear Search
    // ==================================================

    const handleClear = () => {

        setSearchText("");

        setResults([]);

        setError("");

        setSearched(false);

    };


    // ==================================================
    // Enter Key
    // ==================================================

    const handleKeyDown = (
        event
    ) => {

        if (
            event.key === "Enter"
        ) {

            handleSearch();

        }

    };


    // ==================================================
    // JSX
    // ==================================================

    return (

        <Box
            sx={{
                width: "100%",
                p: 3,
            }}
        >

            {/* ==========================================
                Page Header
            ========================================== */}

            <Box
                sx={{
                    mb: 3,
                }}
            >

                <Typography
                    variant="h5"
                    fontWeight={700}
                >
                    Search Reviews
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 0.5,
                    }}
                >
                    Search customer reviews by
                    customer, product, title,
                    or review text.
                </Typography>

            </Box>


            {/* ==========================================
                Search Card
            ========================================== */}

            <Card
                elevation={2}
                sx={{
                    mb: 3,
                }}
            >

                <CardContent>

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        spacing={2}
                        alignItems={{
                            xs: "stretch",
                            sm: "center",
                        }}
                    >

                        <TextField
                            fullWidth
                            label="Search Reviews"
                            placeholder="Enter customer, product, title, or review text"
                            value={searchText}
                            onChange={(event) =>
                                setSearchText(
                                    event.target.value
                                )
                            }
                            onKeyDown={
                                handleKeyDown
                            }
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />


                        <Button
                            variant="contained"
                            startIcon={
                                loading ? (
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                ) : (
                                    <Search />
                                )
                            }
                            onClick={
                                handleSearch
                            }
                            disabled={
                                loading
                            }
                            sx={{
                                minWidth: 130,
                                height: 56,
                            }}
                        >
                            {loading
                                ? "Searching..."
                                : "Search"}
                        </Button>


                        <Button
                            variant="outlined"
                            startIcon={
                                <Clear />
                            }
                            onClick={
                                handleClear
                            }
                            disabled={
                                loading &&
                                !searchText
                            }
                            sx={{
                                minWidth: 110,
                                height: 56,
                            }}
                        >
                            Clear
                        </Button>

                    </Stack>

                </CardContent>

            </Card>


            {/* ==========================================
                Error
            ========================================== */}

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


            {/* ==========================================
                Results
            ========================================== */}

            {searched && !loading && (

                <Card
                    elevation={2}
                >

                    <CardContent>

                        <Typography
                            variant="h6"
                            fontWeight={600}
                            sx={{
                                mb: 2,
                            }}
                        >
                            Search Results
                        </Typography>

                        <Divider
                            sx={{
                                mb: 2,
                            }}
                        />


                        {results.length === 0 ? (

                            <Box
                                sx={{
                                    py: 6,
                                    textAlign: "center",
                                }}
                            >

                                <Search
                                    sx={{
                                        fontSize: 48,
                                        color:
                                            "text.disabled",
                                        mb: 1,
                                    }}
                                />

                                <Typography
                                    variant="h6"
                                    color="text.secondary"
                                >
                                    No Reviews Found
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    No reviews matched
                                    "{searchText}".
                                </Typography>

                            </Box>

                        ) : (

                            <Stack
                                spacing={2}
                            >

                                {results.map(
                                    (review) => (

                                        <Card
                                            key={
                                                review.reviewId
                                            }
                                            variant="outlined"
                                        >

                                            <CardContent>

                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight={700}
                                                >
                                                    {
                                                        review.reviewTitle ||
                                                        "Untitled Review"
                                                    }
                                                </Typography>


                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        mt: 0.5,
                                                    }}
                                                >
                                                    Customer:{" "}
                                                    {
                                                        review.customerName ||
                                                        "-"
                                                    }
                                                </Typography>


                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Product:{" "}
                                                    {
                                                        review.productName ||
                                                        "-"
                                                    }
                                                </Typography>


                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        mt: 1,
                                                    }}
                                                >
                                                    {
                                                        review.reviewText ||
                                                        "No review text"
                                                    }
                                                </Typography>


                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    sx={{
                                                        mt: 2,
                                                    }}
                                                >

                                                    <Typography
                                                        variant="caption"
                                                    >
                                                        Rating:{" "}
                                                        {
                                                            review.rating ??
                                                            "-"
                                                        }
                                                    </Typography>

                                                    <Typography
                                                        variant="caption"
                                                    >
                                                        Status:{" "}
                                                        {
                                                            review.status ||
                                                            "-"
                                                        }
                                                    </Typography>

                                                </Stack>

                                            </CardContent>

                                        </Card>

                                    )
                                )}

                            </Stack>

                        )}

                    </CardContent>

                </Card>

            )}

        </Box>

    );

};


// ======================================================
// Export
// ======================================================

export default ReviewSearch;
