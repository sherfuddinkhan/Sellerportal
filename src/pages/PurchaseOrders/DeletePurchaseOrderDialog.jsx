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



const DeletePurchaseOrderDialog = ({

    open,

    item,

    onClose,

    onDeleted

}) => {



    const handleDelete = () => {


        if (!item)

            return;



        onDeleted(

            item.PurchaseOrderId

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


                Delete Purchase Order


            </DialogTitle>





            <DialogContent>



                <DialogContentText

                    sx={{ mb: 2 }}

                >


                    Are you sure you want to delete this Purchase Order?

                    This action cannot be undone.


                </DialogContentText>




                {

                    item && (


                        <>


                            <Typography>

                                <strong>
                                    Purchase Order ID:
                                </strong>{" "}

                                {item.PurchaseOrderId}


                            </Typography>




                            <Typography>

                                <strong>
                                    Order Number:
                                </strong>{" "}

                                {item.PurchaseOrderNumber}


                            </Typography>





                            <Typography>

                                <strong>
                                    Seller ID:
                                </strong>{" "}

                                {item.SellerId}


                            </Typography>





                            <Typography>

                                <strong>
                                    Supplier ID:
                                </strong>{" "}

                                {item.SupplierId}


                            </Typography>





                            <Typography>

                                <strong>
                                    Status:
                                </strong>{" "}

                                {item.Status || "-"}


                            </Typography>





                            <Typography>

                                <strong>
                                    Total Amount:
                                </strong>{" "}

                                {formatCurrency(
                                    item.TotalAmount
                                )}


                            </Typography>





                            <Typography>

                                <strong>
                                    Remarks:
                                </strong>{" "}

                                {item.Remarks || "-"}


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



export default DeletePurchaseOrderDialog;