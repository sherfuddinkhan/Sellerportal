import React, { useEffect, useState } from "react";

import {
    Card,
    CardContent,
    Typography,
    Box,
    TextField,
    Chip,
    Button,
    CircularProgress,
    Alert,
    Stack
} from "@mui/material";

import {
    Refresh,
    Visibility
} from "@mui/icons-material";

import {
    DataGrid
} from "@mui/x-data-grid";

import { useNavigate } from "react-router-dom";

import apiService from "../../services/apiService";

const LowStockProducts = () => {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const [filteredProducts, setFilteredProducts] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        loadProducts();

    }, []);

    useEffect(() => {

        const result = products.filter(item =>

            item.productName
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||

            item.sku
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||

            item.brandName
                ?.toLowerCase()
                .includes(search.toLowerCase())

        );

        setFilteredProducts(result);

    }, [search, products]);

    const loadProducts = async () => {

        try {

            setLoading(true);

            const response =
                await apiService.getLowStockProducts();

            setProducts(response.data);

            setFilteredProducts(response.data);

        }
        catch (err) {

            console.log(err);

            setError("Unable to load Low Stock Products.");

        }
        finally {

            setLoading(false);

        }

    };

    const columns = [

        {
            field: "productName",
            headerName: "Product",
            flex: 1.4
        },

        {
            field: "sku",
            headerName: "SKU",
            flex: 1
        },

        {
            field: "brandName",
            headerName: "Brand",
            flex: 1
        },

        {
            field: "categoryName",
            headerName: "Category",
            flex: 1
        },

        {
            field: "warehouse",
            headerName: "Warehouse",
            flex: 1
        },

        {
            field: "availableQty",
            headerName: "Available",
            width: 110
        },

        {
            field: "minimumQty",
            headerName: "Minimum",
            width: 110
        },

        {
            field: "status",

            headerName: "Status",

            width: 140,

            renderCell: (params) => (

                <Chip

                    size="small"

                    color={
                        params.row.availableQty <= 0
                            ? "error"
                            : "warning"
                    }

                    label={
                        params.row.availableQty <= 0
                            ? "Out Of Stock"
                            : "Low Stock"
                    }

                />

            )

        },

        {

            field: "action",

            headerName: "Action",

            width: 120,

            sortable: false,

            renderCell: (params) => (

                <Button

                    size="small"

                    variant="contained"

                    startIcon={<Visibility />}

                    onClick={() =>
                        navigate(`/products/${params.row.productId}`)
                    }

                >

                    View

                </Button>

            )

        }

    ];

    if (loading)

        return (

            <Box textAlign="center" mt={5}>

                <CircularProgress />

            </Box>

        );

    if (error)

        return (

            <Alert severity="error">

                {error}

            </Alert>

        );

    return (

        <Card>

            <CardContent>

                <Stack

                    direction="row"

                    justifyContent="space-between"

                    alignItems="center"

                    mb={3}

                >

                    <Typography variant="h6">

                        Low Stock Products

                    </Typography>

                    <Button

                        variant="contained"

                        startIcon={<Refresh />}

                        onClick={loadProducts}

                    >

                        Refresh

                    </Button>

                </Stack>

                <TextField

                    fullWidth

                    placeholder="Search Product..."

                    value={search}

                    onChange={(e) =>
                        setSearch(e.target.value)
                    }

                    sx={{
                        mb: 3
                    }}

                />

                <Box
                    sx={{
                        height: 550,
                        width: "100%"
                    }}
                >

                    <DataGrid

                        rows={filteredProducts}

                        columns={columns}

                        getRowId={(row) => row.productId}

                        pageSizeOptions={[10, 20, 50]}

                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 10
                                }
                            }
                        }}

                    />

                </Box>

            </CardContent>

        </Card>

    );

};

export default LowStockProducts;