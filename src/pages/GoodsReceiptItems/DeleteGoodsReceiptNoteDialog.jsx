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



const DeleteGoodsReceiptNoteDialog = ({

    open,

    note,

    onClose,

    onDeleted

}) => {



    const handleDelete = () => {


        if (!note)

            return;



        onDeleted(

            note.GoodsReceiptNoteId

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


                Delete Goods Receipt Note


            </DialogTitle>







            <DialogContent>





                <DialogContentText

                    sx={{

                        mb:2

                    }}

                >



                    Are you sure you want to delete this Goods Receipt Note?

                    This action cannot be undone.



                </DialogContentText>








                {


                    note && (



                        <>



                            <Typography>


                                <strong>

                                    GRN ID:

                                </strong>


                                {" "}


                                {

                                    note.GoodsReceiptNoteId

                                }



                            </Typography>







                            <Typography>


                                <strong>

                                    GRN Number:

                                </strong>


                                {" "}


                                {

                                    note.GRNNumber

                                }



                            </Typography>







                            <Typography>


                                <strong>

                                    Purchase Order ID:

                                </strong>


                                {" "}


                                {

                                    note.PurchaseOrderId

                                }



                            </Typography>







                            <Typography>


                                <strong>

                                    Supplier ID:

                                </strong>


                                {" "}


                                {

                                    note.SupplierId

                                }



                            </Typography>







                            <Typography>


                                <strong>

                                    Status:

                                </strong>


                                {" "}


                                {

                                    note.Status

                                }



                            </Typography>







                            <Typography>


                                <strong>

                                    Total Amount:

                                </strong>


                                {" "}


                                {

                                    formatCurrency(

                                        note.TotalAmount

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



export default DeleteGoodsReceiptNoteDialog;