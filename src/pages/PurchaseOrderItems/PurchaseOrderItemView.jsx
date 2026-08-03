import React from "react";


import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    Divider
} from "@mui/material";



const formatCurrency = (value) =>

    `₹ ${Number(value || 0).toLocaleString(undefined, {

        minimumFractionDigits: 2,

        maximumFractionDigits: 2

    })}`;



const PurchaseOrderItemView = ({

    open,

    item,

    onClose

}) => {



    if (!item)

        return null;





    return (



        <Dialog


            open={open}


            onClose={onClose}


            fullWidth


            maxWidth="md"



        >



            <DialogTitle>


                Purchase Order Item Details


            </DialogTitle>






            <DialogContent dividers>



                <Grid

                    container

                    spacing={2}

                >





                    <Grid

                        item

                        xs={12}

                        md={6}

                    >


                        <Typography>


                            <strong>

                                Purchase Order Item ID:

                            </strong>


                        </Typography>



                        <Typography>


                            {

                                item.PurchaseOrderItemId

                            }


                        </Typography>


                    </Grid>







                    <Grid

                        item

                        xs={12}

                        md={6}

                    >


                        <Typography>


                            <strong>

                                Purchase Order ID:

                            </strong>


                        </Typography>



                        <Typography>


                            {

                                item.PurchaseOrderId

                            }


                        </Typography>


                    </Grid>








                    <Grid

                        item

                        xs={12}

                        md={6}

                    >


                        <Typography>


                            <strong>

                                Product ID:

                            </strong>


                        </Typography>



                        <Typography>


                            {

                                item.ProductId

                            }


                        </Typography>


                    </Grid>








                    <Grid

                        item

                        xs={12}

                        md={6}

                    >


                        <Typography>


                            <strong>

                                Quantity:

                            </strong>


                        </Typography>



                        <Typography>


                            {

                                Number(

                                    item.Quantity || 0

                                ).toFixed(2)

                            }


                        </Typography>


                    </Grid>








                    <Grid

                        item

                        xs={12}

                        md={6}

                    >


                        <Typography>


                            <strong>

                                Unit Price:

                            </strong>


                        </Typography>



                        <Typography>


                            {

                                formatCurrency(

                                    item.UnitPrice

                                )

                            }


                        </Typography>


                    </Grid>








                    <Grid

                        item

                        xs={12}

                        md={6}

                    >


                        <Typography>


                            <strong>

                                Discount:

                            </strong>


                        </Typography>



                        <Typography>


                            {

                                formatCurrency(

                                    item.Discount

                                )

                            }


                        </Typography>


                    </Grid>








                    <Grid

                        item

                        xs={12}

                        md={6}

                    >


                        <Typography>


                            <strong>

                                Tax Amount:

                            </strong>


                        </Typography>



                        <Typography>


                            {

                                formatCurrency(

                                    item.TaxAmount

                                )

                            }


                        </Typography>


                    </Grid>








                    <Grid

                        item

                        xs={12}

                        md={6}

                    >


                        <Typography>


                            <strong>

                                Total Amount:

                            </strong>


                        </Typography>



                        <Typography


                            fontWeight="bold"


                        >


                            {

                                formatCurrency(

                                    item.TotalAmount

                                )

                            }


                        </Typography>


                    </Grid>







                    <Grid

                        item

                        xs={12}

                    >



                        <Divider

                            sx={{

                                my: 2

                            }}

                        />



                    </Grid>





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



export default PurchaseOrderItemView;