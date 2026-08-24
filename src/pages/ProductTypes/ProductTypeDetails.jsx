import React, { useEffect, useState } from "react";
import {Paper,Grid,Typography,Chip,Button,Divider,CircularProgress,Box} from "@mui/material";
import {ArrowBack,Edit} from "@mui/icons-material";
import {useNavigate,useParams} from "react-router-dom";


const ProductTypeDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [productType, setProductType] = useState(null);
    useEffect(() => {
        loadProductType();
    }, []);

    const loadProductType = async () => {
        try {
            setLoading(true);
            const response = await apiService.getProductTypeById(id);
            setProductType(response.data);
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    };

    if (loading)
        return (
            <Box
                display="flex"
                justifyContent="center"
                mt={5}
            >
                <CircularProgress />
            </Box>
        );

    if (!productType)

        return (

            <Typography>

                Product Type not found.

            </Typography>

        );

    return (

        <Paper sx={{ p: 4 }}>

            <Grid

                container

                justifyContent="space-between"

                alignItems="center"

                mb={2}

            >

                <Typography

                    variant="h5"

                    fontWeight="bold"

                >

                    Product Type Details

                </Typography>

                <Box>

                    <Button

                        variant="outlined"

                        startIcon={<ArrowBack />}

                        sx={{ mr: 2 }}

                        onClick={() =>
                            navigate("/product-types")
                        }

                    >

                        Back

                    </Button>

                    <Button

                        variant="contained"

                        startIcon={<Edit />}

                        onClick={() =>
                            navigate(`/product-types/edit/${id}`)
                        }

                    >

                        Edit

                    </Button>

                </Box>

            </Grid>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>

                <Grid item xs={12} md={6}>

                    <Typography color="text.secondary">

                        Product Type ID

                    </Typography>

                    <Typography variant="h6">

                        {productType.productTypeId}

                    </Typography>

                </Grid>

                <Grid item xs={12} md={6}>

                    <Typography color="text.secondary">

                        Product Type Name

                    </Typography>

                    <Typography variant="h6">

                        {productType.productTypeName}

                    </Typography>

                </Grid>

                <Grid item xs={12}>

                    <Typography color="text.secondary">

                        Description

                    </Typography>

                    <Typography>

                        {productType.description || "-"}

                    </Typography>

                </Grid>

                <Grid item xs={12} md={6}>

                    <Typography color="text.secondary">

                        Status

                    </Typography>

                    <Chip

                        label={
                            productType.isActive
                                ? "Active"
                                : "Inactive"
                        }

                        color={
                            productType.isActive
                                ? "success"
                                : "error"
                        }

                    />

                </Grid>

                <Grid item xs={12} md={6}>

                    <Typography color="text.secondary">

                        Created Date

                    </Typography>

                    <Typography>

                        {

                            productType.createdDate

                                ? new Date(
                                      productType.createdDate
                                  ).toLocaleString()

                                : "-"

                        }

                    </Typography>

                </Grid>

                <Grid item xs={12} md={6}>

                    <Typography color="text.secondary">

                        Updated Date

                    </Typography>

                    <Typography>

                        {

                            productType.updatedDate

                                ? new Date(
                                      productType.updatedDate
                                  ).toLocaleString()

                                : "-"

                        }

                    </Typography>

                </Grid>

            </Grid>

        </Paper>

    );

};

export default ProductTypeDetails;