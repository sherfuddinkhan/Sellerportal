import React, {
    useEffect,
    useState
} from "react";

import {
    Box,
    Paper,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Grid,
    CircularProgress,
    Alert
} from "@mui/material";

import {
    useSearchParams,
    useNavigate
} from "react-router-dom";


const SERVER_URL = "http://localhost:5000";


const BrandFilters = () => {

    const navigate = useNavigate();

    const [searchParams] =
        useSearchParams();

    const searchFromUrl =
        searchParams.get("search") || "";


    const [search, setSearch] =
        useState(searchFromUrl);

    const [status, setStatus] =
        useState("All");

    const [brands, setBrands] =
        useState([]);

    const [filterOptions, setFilterOptions] =
        useState({
            brandNames: [],
            statuses: []
        });

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD FILTER OPTIONS
    // =====================================================

    const loadFilterOptions = async () => {

        try {

            const response =
                await fetch(
                    `${SERVER_URL}/api/brand/filters`
                );

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}`
                );
            }

            const data =
                await response.json();

            setFilterOptions({
                brandNames:
                    data?.brandNames || [],

                statuses:
                    data?.statuses || []
            });

        } catch (err) {

            console.error(
                "Filter options error:",
                err
            );

            setError(
                "Unable to load filter options."
            );

        }

    };


    // =====================================================
    // LOAD BRANDS
    // =====================================================

    const loadBrands = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await fetch(
                    `${SERVER_URL}/api/brand`
                );

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}`
                );
            }

            const data =
                await response.json();

            setBrands(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "Brand loading error:",
                err
            );

            setError(
                "Unable to load brands."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadFilterOptions();
        loadBrands();

    }, []);


    // =====================================================
    // FILTER BRANDS
    // =====================================================

    const filteredBrands =
        brands.filter((brand) => {

            const matchesSearch =
                !search.trim() ||
                brand.brandName
                    ?.toLowerCase()
                    .includes(
                        search.trim().toLowerCase()
                    ) ||
                brand.description
                    ?.toLowerCase()
                    .includes(
                        search.trim().toLowerCase()
                    );


            const matchesStatus =
                status === "All" ||
                (
                    status === "Active" &&
                    brand.isActive === true
                ) ||
                (
                    status === "Inactive" &&
                    brand.isActive === false
                );


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    // =====================================================
    // APPLY SEARCH
    // =====================================================

    const handleSearch = () => {

        const params = new URLSearchParams();

        if (search.trim()) {

            params.set(
                "search",
                search.trim()
            );

        }

        if (status !== "All") {

            params.set(
                "status",
                status
            );

        }

        navigate(
            `/brands/filters?${params.toString()}`
        );

    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <Box p={3}>

            <Paper
                sx={{
                    p: 3,
                    borderRadius: 3
                }}
            >

                <Typography
                    variant="h4"
                    mb={3}
                >
                    Brand Filters
                </Typography>


                {error && (

                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Alert>

                )}


                <Grid
                    container
                    spacing={2}
                >

                    {/* SEARCH */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            label="Search Brand"
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                    </Grid>


                    {/* STATUS */}

                    <Grid
                        item
                        xs={12}
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
                                onChange={(e) =>
                                    setStatus(
                                        e.target.value
                                    )
                                }
                            >

                                <MenuItem value="All">
                                    All
                                </MenuItem>

                                {filterOptions.statuses.map(
                                    (item) => (

                                        <MenuItem
                                            key={item}
                                            value={item}
                                        >
                                            {item}
                                        </MenuItem>

                                    )
                                )}

                            </Select>

                        </FormControl>

                    </Grid>


                    {/* SEARCH BUTTON */}

                    <Grid
                        item
                        xs={12}
                        md={3}
                    >

                        <Button
                            fullWidth
                            variant="contained"
                            sx={{
                                height: 56
                            }}
                            onClick={
                                handleSearch
                            }
                        >
                            Apply Filter
                        </Button>

                    </Grid>

                </Grid>


                {/* RESULTS */}

                <Box mt={4}>

                    <Typography
                        variant="h6"
                        mb={2}
                    >
                        Results:{" "}
                        {filteredBrands.length}
                    </Typography>


                    {loading ? (

                        <CircularProgress />

                    ) : (

                        filteredBrands.map(
                            (brand) => (

                                <Paper
                                    key={
                                        brand.brandId
                                    }
                                    sx={{
                                        p: 2,
                                        mb: 2
                                    }}
                                >

                                    <Typography
                                        variant="h6"
                                    >
                                        {
                                            brand.brandName
                                        }
                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                    >
                                        {
                                            brand.description ||
                                            "-"
                                        }
                                    </Typography>

                                    <Typography
                                        sx={{ mt: 1 }}
                                    >
                                        Status:{" "}
                                        {
                                            brand.isActive
                                                ? "Active"
                                                : "Inactive"
                                        }
                                    </Typography>

                                </Paper>

                            )
                        )

                    )}

                </Box>


                <Button
                    variant="outlined"
                    onClick={() =>
                        navigate("/brands")
                    }
                >
                    Back to Brands
                </Button>

            </Paper>

        </Box>

    );

};


export default BrandFilters;