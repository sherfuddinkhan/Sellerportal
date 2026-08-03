import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Divider
} from "@mui/material";



const DeleteCustomerPaymentDialog = ({

    open,

    payment,

    onClose,

    onDeleted

}) => {



    if (!payment) return null;





    const handleDelete = () => {


        onDeleted(

            payment.CustomerPaymentId

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



                Delete Customer Payment



            </DialogTitle>







            <Divider />







            <DialogContent



                sx={{ mt: 2 }}



            >





                <Typography>



                    Are you sure you want to delete this customer payment?



                </Typography>







                <Typography



                    sx={{ mt: 2 }}



                    fontWeight="bold"



                >



                    Payment ID :

                    {" "}

                    {

                        payment.CustomerPaymentId

                    }



                </Typography>







                <Typography>



                    Invoice ID :

                    {" "}

                    {

                        payment.SalesInvoiceId

                    }



                </Typography>







                <Typography>



                    Payment Number :

                    {" "}

                    {

                        payment.PaymentNumber

                    }



                </Typography>







                <Typography>



                    Amount :

                    {" "}

                    ₹

                    {

                        Number(

                            payment.Amount || 0

                        ).toLocaleString()

                    }



                </Typography>







                <Typography>



                    Payment Mode :

                    {" "}

                    {

                        payment.PaymentMode ||

                        "-"

                    }



                </Typography>







                <Typography>



                    Reference Number :

                    {" "}

                    {

                        payment.ReferenceNumber ||

                        "-"

                    }



                </Typography>







            </DialogContent>







            <DialogActions>







                <Button



                    variant="outlined"



                    onClick={onClose}



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



export default DeleteCustomerPaymentDialog;