import React from "react";

import {
    Card,
    CardContent,
    Typography,
    Chip,
    Stack
} from "@mui/material";

const ProductTypeCard = ({ productType }) => {

    return (

        <Card>

            <CardContent>

                <Typography
                    variant="h6"
                    fontWeight="bold"
                >

                    {productType.productTypeName}

                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{ mt: 1 }}
                >

                    {productType.description || "-"}

                </Typography>

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ mt: 2 }}
                >

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

                    <Typography variant="caption">

                        ID :
                        {" "}
                        {productType.productTypeId}

                    </Typography>

                </Stack>

            </CardContent>

        </Card>

    );

};

export default ProductTypeCard;