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



const GoodsReceiptNoteView = ({

    open,

    note,

    onClose

}) => {



    if (!note)

        return null;





    return (



        <Dialog


            open={open}


            onClose={onClose}


            fullWidth


            maxWidth="md"



        >



            <DialogTitle>


                Goods Receipt Note Details


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

                                GRN ID:

                            </strong>


                        </Typography>



                        <Typography>


                            {

                                note.GoodsReceiptNoteId

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

                                GRN Number:

                            </strong>


                        </Typography>



                        <Typography>


                            {

                                note.GRNNumber

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

                                note.PurchaseOrderId

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

                                Seller ID:

                            </strong>


                        </Typography>



                        <Typography>


                            {

                                note.SellerId

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

                                Supplier ID:

                            </strong>


                        </Typography>



                        <Typography>


                            {

                                note.SupplierId

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

                                Receipt Date:

                            </strong>


                        </Typography>



                        <Typography>


                            {

                                note.ReceiptDate

                                ?

                                new Date(

                                    note.ReceiptDate

                                ).toLocaleDateString()

                                :

                                "-"

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

                                Status:

                            </strong>


                        </Typography>



                        <Typography>


                            {

                                note.Status

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

                                    note.TotalAmount

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

                                my:2

                            }}

                        />



                        <Typography>


                            <strong>

                                Remarks:

                            </strong>


                        </Typography>





                        <Typography

                            color="text.secondary"

                        >


                            {

                                note.Remarks ||

                                "No remarks"

                            }


                        </Typography>



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



export default GoodsReceiptNoteView;