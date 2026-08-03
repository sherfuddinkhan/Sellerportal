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



const GoodsReceiptNoteItemView = ({

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


                Goods Receipt Note Item Details


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

                                GRN Item ID:

                            </strong>



                        </Typography>



                        <Typography>



                            {

                                item.GoodsReceiptNoteItemId

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

                                Goods Receipt Note ID:

                            </strong>



                        </Typography>



                        <Typography>



                            {

                                item.GoodsReceiptNoteId

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

                                Received Quantity:

                            </strong>



                        </Typography>



                        <Typography>



                            {

                                item.ReceivedQuantity

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

                                Accepted Quantity:

                            </strong>



                        </Typography>



                        <Typography>



                            {

                                item.AcceptedQuantity

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

                                Rejected Quantity:

                            </strong>



                        </Typography>



                        <Typography>



                            {

                                item.RejectedQuantity

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








                </Grid>







                <Divider

                    sx={{


                        mt:3,


                        mb:2



                    }}



                />





                <Typography

                    color="text.secondary"

                >



                    GRN Item information is linked with the Goods Receipt Note and Product master.



                </Typography>






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



export default GoodsReceiptNoteItemView;