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


const ProductInventoryCard = ({
    inventory
}) => {


    return (

        <Card

            elevation={3}

            sx={{

                borderRadius:2,

                height:"100%"

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


                        Inventory #

                        {inventory.ProductInventoryId}


                    </Typography>




                    <Chip


                        label={

                            inventory.IsActive

                                ?

                                "Active"

                                :

                                "Inactive"

                        }



                        color={

                            inventory.IsActive

                                ?

                                "success"

                                :

                                "error"

                        }



                        size="small"


                    />


                </Stack>




                <Divider

                    sx={{ mb:2 }}

                />





                <Grid

                    container

                    spacing={2}

                >



                    <Grid

                        item

                        xs={6}

                    >

                        <Typography

                            variant="caption"

                            color="text.secondary"

                        >

                            Product ID

                        </Typography>


                        <Typography>

                            {inventory.ProductId || "-"}

                        </Typography>


                    </Grid>





                    <Grid

                        item

                        xs={6}

                    >

                        <Typography

                            variant="caption"

                            color="text.secondary"

                        >

                            Seller ID

                        </Typography>


                        <Typography>

                            {inventory.SellerId || "-"}

                        </Typography>


                    </Grid>





                    <Grid

                        item

                        xs={6}

                    >

                        <Typography

                            variant="caption"

                            color="text.secondary"

                        >

                            Warehouse ID

                        </Typography>


                        <Typography>

                            {
                                inventory.WarehouseId || "-"
                            }

                        </Typography>


                    </Grid>





                    <Grid

                        item

                        xs={6}

                    >

                        <Typography

                            variant="caption"

                            color="text.secondary"

                        >

                            Stock Status

                        </Typography>


                        <Typography>

                            {
                                inventory.StockStatus || "-"
                            }

                        </Typography>


                    </Grid>





                    <Grid

                        item

                        xs={6}

                    >

                        <Typography

                            variant="caption"

                            color="text.secondary"

                        >

                            Quantity

                        </Typography>


                        <Typography>

                            {
                                inventory.Quantity || 0
                            }

                        </Typography>


                    </Grid>





                    <Grid

                        item

                        xs={6}

                    >

                        <Typography

                            variant="caption"

                            color="text.secondary"

                        >

                            Available Quantity

                        </Typography>


                        <Typography>

                            {
                                inventory.AvailableQuantity || 0
                            }

                        </Typography>


                    </Grid>





                    <Grid

                        item

                        xs={6}

                    >

                        <Typography

                            variant="caption"

                            color="text.secondary"

                        >

                            Reserved Quantity

                        </Typography>


                        <Typography>

                            {
                                inventory.ReservedQuantity || 0
                            }

                        </Typography>


                    </Grid>





                    <Grid

                        item

                        xs={6}

                    >

                        <Typography

                            variant="caption"

                            color="text.secondary"

                        >

                            Reorder Level

                        </Typography>


                        <Typography>

                            {
                                inventory.ReorderLevel || 0
                            }

                        </Typography>


                    </Grid>





                    <Grid

                        item

                        xs={6}

                    >

                        <Typography

                            variant="caption"

                            color="text.secondary"

                        >

                            Minimum Stock

                        </Typography>


                        <Typography>

                            {
                                inventory.MinStockLevel || 0
                            }

                        </Typography>


                    </Grid>





                    <Grid

                        item

                        xs={6}

                    >

                        <Typography

                            variant="caption"

                            color="text.secondary"

                        >

                            Maximum Stock

                        </Typography>


                        <Typography>

                            {
                                inventory.MaxStockLevel || 0
                            }

                        </Typography>


                    </Grid>





                    <Grid

                        item

                        xs={12}

                    >

                        <Typography

                            variant="caption"

                            color="text.secondary"

                        >

                            Last Updated

                        </Typography>


                        <Typography>


                            {

                                inventory.LastUpdated

                                    ?

                                    new Date(

                                        inventory.LastUpdated

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


export default ProductInventoryCard;