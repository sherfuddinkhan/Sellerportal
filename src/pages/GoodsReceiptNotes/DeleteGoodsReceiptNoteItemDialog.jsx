import React from "react";


import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography
} from "@mui/material";



const formatCurrency = (value) =>

    `₹ ${Number(value || 0).toLocaleString(undefined, {

        minimumFractionDigits: 2,

        maximumFractionDigits: 2

    })}`;



const DeleteGoodsReceiptNoteItemDialog = ({

    open,

    item,

    onClose,

    onDeleted

}) => {





    const handleDelete = () => {



        if (!item)

            return;




        onDeleted(

            item.GoodsReceiptNoteItemId

        );



    };








    return (



        <Dialog



            open={open}



            onClose={onClose}



            fullWidth



            maxWidth="sm"




        >




            <DialogTitle>



                Delete Goods Receipt Note Item



            </DialogTitle>








            <DialogContent>






                <DialogContentText

                    sx={{

                        mb:2

                    }}

                >



                    Are you sure you want to delete this Goods Receipt Note Item?

                    This action cannot be undone.



                </DialogContentText>









                {



                    item && (



                        <>



                            <Typography>



                                <strong>

                                    GRN Item ID:

                                </strong>



                                {" "}



                                {

                                    item.GoodsReceiptNoteItemId

                                }



                            </Typography>









                            <Typography>



                                <strong>

                                    GRN ID:

                                </strong>



                                {" "}



                                {

                                    item.GoodsReceiptNoteId

                                }



                            </Typography>









                            <Typography>



                                <strong>

                                    Product ID:

                                </strong>



                                {" "}



                                {

                                    item.ProductId

                                }



                            </Typography>









                            <Typography>



                                <strong>

                                    Received Quantity:

                                </strong>



                                {" "}



                                {

                                    item.ReceivedQuantity

                                }



                            </Typography>









                            <Typography>



                                <strong>

                                    Accepted Quantity:

                                </strong>



                                {" "}



                                {

                                    item.AcceptedQuantity

                                }



                            </Typography>









                            <Typography>



                                <strong>

                                    Total Amount:

                                </strong>



                                {" "}



                                {

                                    formatCurrency(

                                        item.TotalAmount

                                    )

                                }



                            </Typography>






                        </>



                    )



                }






            </DialogContent>









            <DialogActions>







                <Button



                    onClick={onClose}



                    color="inherit"



                >



                    Cancel



                </Button>









                <Button



                    variant="contained"



                    color="error"



                    onClick={handleDelete}



                >



                    Delete



                </Button>






            </DialogActions>







        </Dialog>


    );


};



export default DeleteGoodsReceiptNoteItemDialog;s