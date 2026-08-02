import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    Divider,
    Chip
} from "@mui/material";


const ProductInventoryView = ({

    open,

    inventory,

    onClose

}) => {


    if (!inventory) return null;



    const Field = ({

        label,

        value

    }) => (


        <Grid

            item

            xs={12}

            md={6}

        >

            <Typography

                variant="caption"

                color="text.secondary"

            >

                {label}

            </Typography>


            <Typography

                variant="body1"

                fontWeight={500}

            >

                {value || "-"}

            </Typography>


        </Grid>


    );



    return (

        <Dialog


            open={open}


            onClose={onClose}


            fullWidth


            maxWidth="md"


        >



            <DialogTitle>


                Product Inventory Details


            </DialogTitle>



            <Divider />



            <DialogContent

                sx={{ mt:2 }}

            >


                <Grid

                    container

                    spacing={3}

                >



                    <Field

                        label="Inventory ID"

                        value={
                            inventory.ProductInventoryId
                        }

                    />



                    <Field

                        label="Product ID"

                        value={
                            inventory.ProductId
                        }

                    />



                    <Field

                        label="Seller ID"

                        value={
                            inventory.SellerId
                        }

                    />



                    <Field

                        label="Warehouse ID"

                        value={
                            inventory.WarehouseId
                        }

                    />



                    <Field

                        label="Quantity"

                        value={
                            inventory.Quantity
                        }

                    />



                    <Field

                        label="Available Quantity"

                        value={
                            inventory.AvailableQuantity
                        }

                    />



                    <Field

                        label="Reserved Quantity"

                        value={
                            inventory.ReservedQuantity
                        }

                    />



                    <Field

                        label="Reorder Level"

                        value={
                            inventory.ReorderLevel
                        }

                    />



                    <Field

                        label="Minimum Stock Level"

                        value={
                            inventory.MinStockLevel
                        }

                    />



                    <Field

                        label="Maximum Stock Level"

                        value={
                            inventory.MaxStockLevel
                        }

                    />



                    <Field

                        label="Stock Status"

                        value={
                            inventory.StockStatus
                        }

                    />



                    <Grid

                        item

                        xs={12}

                        md={6}

                    >

                        <Typography

                            variant="caption"

                            color="text.secondary"

                        >

                            Active Status

                        </Typography>


                        <br />



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



                        />


                    </Grid>




                    <Field

                        label="Last Updated"

                        value={

                            inventory.LastUpdated

                                ?

                                new Date(

                                    inventory.LastUpdated

                                ).toLocaleString()

                                :

                                "-"

                        }

                    />



                    <Field

                        label="Created Date"

                        value={

                            inventory.CreatedDate

                                ?

                                new Date(

                                    inventory.CreatedDate

                                ).toLocaleString()

                                :

                                "-"

                        }

                    />



                    <Field

                        label="Updated Date"

                        value={

                            inventory.UpdatedDate

                                ?

                                new Date(

                                    inventory.UpdatedDate

                                ).toLocaleString()

                                :

                                "-"

                        }

                    />


                </Grid>


            </DialogContent>




            <DialogActions>


                <Button


                    variant="contained"


                    onClick={onClose}


                >


                    Close


                </Button>


            </DialogActions>



        </Dialog>


    );

};


export default ProductInventoryView;