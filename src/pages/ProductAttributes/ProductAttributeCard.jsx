import React from "react";

import {
    Card,
    CardContent,
    Typography,
    Chip,
    Grid,
    Stack,
    Divider
} from "@mui/material";

const ProductAttributeCard = ({

    attribute

}) => {

    return (

        <Card

            elevation={3}

            sx={{

                borderRadius: 2,

                height: "100%"

            }}

        >

            <CardContent>

                <Stack

                    direction="row"

                    justifyContent="space-between"

                    alignItems="center"

                    mb={2}

                >

                    <Typography

                        variant="h6"

                        fontWeight="bold"

                    >

                        {attribute.AttributeName}

                    </Typography>

                    <Chip

                        label={

                            attribute.IsActive

                                ? "Active"

                                : "Inactive"

                        }

                        color={

                            attribute.IsActive

                                ? "success"

                                : "error"

                        }

                        size="small"

                    />

                </Stack>

                <Divider sx={{ mb: 2 }} />

                <Grid

                    container

                    spacing={2}

                >

                    <Grid item xs={6}>

                        <Typography

                            variant="caption"

                            color="text.secondary"

                        >

                            Attribute ID

                        </Typography>

                        <Typography>

                            {

                                attribute.ProductAttributeId

                            }

                        </Typography>

                    </Grid>

                    <Grid item xs={6}>

                        <Typography

                            variant="caption"

                            color="text.secondary"

                        >

                            Product ID

                        </Typography>

                        <Typography>

                            {

                                attribute.ProductId

                            }

                        </Typography>

                    </Grid>

                    <Grid item xs={6}>

                        <Typography

                            variant="caption"

                            color="text.secondary"

                        >

                            Attribute Type

                        </Typography>

                        <Typography>

                            {

                                attribute.AttributeType ||

                                "-"

                            }

                        </Typography>

                    </Grid>

                    <Grid item xs={6}>

                        <Typography

                            variant="caption"

                            color="text.secondary"

                        >

                            Required

                        </Typography>

                        <Chip

                            label={

                                attribute.IsRequired

                                    ? "Yes"

                                    : "No"

                            }

                            color={

                                attribute.IsRequired

                                    ? "primary"

                                    : "default"

                            }

                            size="small"

                        />

                    </Grid>

                    <Grid item xs={12}>

                        <Typography

                            variant="caption"

                            color="text.secondary"

                        >

                            Attribute Value

                        </Typography>

                        <Typography>

                            {

                                attribute.AttributeValue ||

                                "-"

                            }

                        </Typography>

                    </Grid>

                    <Grid item xs={12}>

                        <Typography

                            variant="caption"

                            color="text.secondary"

                        >

                            Created Date

                        </Typography>

                        <Typography>

                            {

                                attribute.CreatedDate

                                    ?

                                    new Date(

                                        attribute.CreatedDate

                                    ).toLocaleString()

                                    :

                                    "-"

                            }

                        </Typography>

                    </Grid>

                </Grid>

            </CardContent>

        </Card>

    );

};

export default ProductAttributeCard;