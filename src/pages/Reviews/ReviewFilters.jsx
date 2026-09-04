import React, {
    useState
} from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Clear,
    FilterAlt,
    Search
} from "@mui/icons-material";

import axios from "axios";

import {
    useNavigate
} from "react-router-dom";


/* =========================================================
   API CONFIGURATION
========================================================= */

const SERVER_URL = "http://localhost:5000";

const REVIEW_API = `${SERVER_URL}/api/reviews`;


/* =========================================================
   INITIAL FILTER DATA
========================================================= */

const INITIAL_FILTERS = {

    search: "",

    rating: "",

    status: "",

    sort: ""

};


/* =========================================================
   REVIEW FILTERS
========================================================= */

const ReviewFilters = () => {

    const navigate =
        useNavigate();


    /* =====================================================
       STATE
    ===================================================== */

    const [filters, setFilters] =
        useState(INITIAL_FILTERS);

    const [results, setResults] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [searched, setSearched] =
        useState(false);

    const [error, setError] =
        useState("");


    /* =====================================================
       HANDLE CHANGE
    ===================================================== */

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFilters((previous) => ({

            ...previous,

            [name]: value

        }));


        setError("");

    };


    /* =====================================================
       APPLY FILTERS
    ===================================================== */

    const handleApplyFilters = async () => {

        try {

            setLoading(true);

            setError("");

            setSearched(false);


            const params = {};


            if (
                filters.search &&
                filters.search.trim()
            ) {

                params.search =
                    filters.search.trim();

            }


            if (filters.rating) {

                params.rating =
                    Number(filters.rating);

            }


            if (filters.status) {

                params.status =
                    filters.status;

            }


            if (filters.sort) {

                params.sort =
                    filters.sort;

            }


            const response =
                await axios.get(
                    `${REVIEW_API}/filter`,
                    {
                        params
                    }
                );


            console.log(
                "FILTERED REVIEWS:",
                response.data
            );


            const data =
                response.data;


            let reviewList = [];


            if (Array.isArray(data)) {

                reviewList = data;

            } else if (
                Array.isArray(data?.items)
            ) {

                reviewList =
                    data.items;

            } else if (
                Array.isArray(data?.reviews)
            ) {

                reviewList =
                    data.reviews;

            } else if (
                Array.isArray(data?.data)
            ) {

                reviewList =
                    data.data;

            }


            setResults(
                reviewList
            );

            setSearched(true);


        } catch (err) {

            console.error(
                "FILTER REVIEWS ERROR:",
                err
            );


            const message =
                err?.response?.data?.message ||
                err?.response?.data?.title ||
                "Unable to filter reviews.";


            setError(message);

            setResults([]);

        } finally {

            setLoading(false);

        }

    };


    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    const handleClear = () => {

        setFilters(
            INITIAL_FILTERS
        );

        setResults([]);

        setSearched(false);

        setError("");

    };


    /* =====================================================
       BACK TO REVIEWS
    ===================================================== */

    const handleBack = () => {

        navigate(
            "/reviews"
        );

    };


    /* =====================================================
       VIEW REVIEW
    ===================================================== */

    const handleView = (reviewId) => {

        navigate(
            `/reviews/details/${reviewId}`
        );

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Box
            sx={{
                width: "100%",
                p: 3
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <Stack
                direction={{
                    xs: "column",
                    sm: "row"
                }}
                justifyContent="space-between"
                alignItems={{
                    xs: "flex-start",
                    sm: "center"
                }}
                spacing={2}
                sx={{
                    mb: 3
                }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        Review Filters
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 0.5
                        }}
                    >
                        Filter customer reviews by search,
                        rating, status and sorting.
                    </Typography>

                </Box>


                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                >
                    Back to Reviews
                </Button>

            </Stack>


            {/* =================================================
                FILTER CARD
            ================================================= */}

            <Card
                elevation={2}
                sx={{
                    mb: 3
                }}
            >

                <CardContent>

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                            mb: 3
                        }}
                    >

                        <FilterAlt
                            color="primary"
                        />

                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Filter Reviews
                        </Typography>

                    </Stack>


                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "1fr 1fr",
                                md: "2fr 1fr 1fr 1fr"
                            },
                            gap: 2
                        }}
                    >

                        {/* SEARCH */}

                        <TextField
                            fullWidth
                            label="Search Reviews"
                            name="search"
                            value={
                                filters.search
                            }
                            onChange={
                                handleChange
                            }
                            placeholder={
                                "Customer, product or review title"
                            }
                        />


                        {/* RATING */}

                        <FormControl
                            fullWidth
                        >

                            <InputLabel>
                                Rating
                            </InputLabel>

                            <Select
                                label="Rating"
                                name="rating"
                                value={
                                    filters.rating
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <MenuItem value="">
                                    All Ratings
                                </MenuItem>

                                <MenuItem value="5">
                                    5 Stars
                                </MenuItem>

                                <MenuItem value="4">
                                    4 Stars
                                </MenuItem>

                                <MenuItem value="3">
                                    3 Stars
                                </MenuItem>

                                <MenuItem value="2">
                                    2 Stars
                                </MenuItem>

                                <MenuItem value="1">
                                    1 Star
                                </MenuItem>

                            </Select>

                        </FormControl>


                        {/* STATUS */}

                        <FormControl
                            fullWidth
                        >

                            <InputLabel>
                                Status
                            </InputLabel>

                            <Select
                                label="Status"
                                name="status"
                                value={
                                    filters.status
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <MenuItem value="">
                                    All Statuses
                                </MenuItem>

                                <MenuItem value="Pending">
                                    Pending
                                </MenuItem>

                                <MenuItem value="Approved">
                                    Approved
                                </MenuItem>

                                <MenuItem value="Rejected">
                                    Rejected
                                </MenuItem>

                            </Select>

                        </FormControl>


                        {/* SORT */}

                        <FormControl
                            fullWidth
                        >

                            <InputLabel>
                                Sort By
                            </InputLabel>

                            <Select
                                label="Sort By"
                                name="sort"
                                value={
                                    filters.sort
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <MenuItem value="">
                                    Default
                                </MenuItem>

                                <MenuItem value="rating-asc">
                                    Rating: Low to High
                                </MenuItem>

                                <MenuItem value="rating-desc">
                                    Rating: High to Low
                                </MenuItem>

                                <MenuItem value="date-asc">
                                    Date: Oldest First
                                </MenuItem>

                                <MenuItem value="date-desc">
                                    Date: Newest First
                                </MenuItem>

                            </Select>

                        </FormControl>

                    </Box>


                    {/* ACTIONS */}

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row"
                        }}
                        spacing={2}
                        justifyContent="flex-end"
                        sx={{
                            mt: 3
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
                            Clear Filters
                        </Button>


                        <Button
                            variant="contained"
                            startIcon={
                                loading
                                    ? (
                                        <CircularProgress
                                            size={18}
                                            color="inherit"
                                        />
                                    )
                                    : (
                                        <Search />
                                    )
                            }
                            onClick={
                                handleApplyFilters
                            }
                            disabled={loading}
                        >
                            {loading
                                ? "Filtering..."
                                : "Apply Filters"}
                        </Button>

                    </Stack>

                </CardContent>

            </Card>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{
                        mb: 3
                    }}
                >
                    {error}
                </Alert>

            )}


            {/* =================================================
                RESULTS
            ================================================= */}

            {searched && (

                <Card
                    elevation={2}
                >

                    <CardContent>

                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{
                                mb: 2
                            }}
                        >
                            Filter Results
                        </Typography>


                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: 3
                            }}
                        >
                            {results.length} review
                            {results.length !== 1
                                ? "s"
                                : ""} found.
                        </Typography>


                        {results.length === 0 ? (

                            <Alert
                                severity="info"
                            >
                                No reviews matched the selected
                                filters.
                            </Alert>

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
                                            sx={{
                                                cursor: "pointer",
                                                "&:hover": {
                                                    boxShadow: 2
                                                }
                                            }}
                                            onClick={() =>
                                                handleView(
                                                    review.reviewId
                                                )
                                            }
                                        >

                                            <CardContent>

                                                <Stack
                                                    direction={{
                                                        xs: "column",
                                                        md: "row"
                                                    }}
                                                    justifyContent="space-between"
                                                    spacing={2}
                                                >

                                                    <Box>

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
                                                                mt: 0.5
                                                            }}
                                                        >
                                                            Customer:{" "}
                                                            {
                                                                review.customerName ||
                                                                "—"
                                                            }
                                                        </Typography>


                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            Product:{" "}
                                                            {
                                                                review.productName ||
                                                                "—"
                                                            }
                                                        </Typography>

                                                    </Box>


                                                    <Stack
                                                        direction="row"
                                                        spacing={1}
                                                        alignItems="center"
                                                        flexWrap="wrap"
                                                    >

                                                        <Rating
                                                            value={
                                                                Number(
                                                                    review.rating
                                                                ) || 0
                                                            }
                                                            precision={0.5}
                                                            size="small"
                                                            readOnly
                                                        />

                                                        <Typography
                                                            variant="body2"
                                                            fontWeight={600}
                                                        >
                                                            {
                                                                Number(
                                                                    review.rating
                                                                ) || 0
                                                            }
                                                            /5
                                                        </Typography>


                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            {
                                                                review.status ||
                                                                "Pending"
                                                            }
                                                        </Typography>

                                                    </Stack>

                                                </Stack>


                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        mt: 2,
                                                        display:
                                                            "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient:
                                                            "vertical",
                                                        overflow:
                                                            "hidden"
                                                    }}
                                                >
                                                    {
                                                        review.reviewText ||
                                                        "No review text available."
                                                    }
                                                </Typography>


                                                <Button
                                                    size="small"
                                                    sx={{
                                                        mt: 1
                                                    }}
                                                    onClick={(
                                                        event
                                                    ) => {

                                                        event.stopPropagation();

                                                        handleView(
                                                            review.reviewId
                                                        );

                                                    }}
                                                >
                                                    View Details
                                                </Button>

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


export default ReviewFilters;

