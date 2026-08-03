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



const DeleteCustomerReturnDialog = ({

    open,

    item,

    onClose,

    onDeleted

}) => {



    if (!item) return null;







    const handleDelete = () => {



        onDeleted(

            item.CustomerReturnId

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



                Delete Customer Return



            </DialogTitle>







            <Divider />









            <DialogContent



                sx={{ mt: 2 }}



            >







                <Typography>





                    Are you sure you want to delete this customer return?





                </Typography>









                <Typography



                    sx={{ mt: 2 }}



                    fontWeight="bold"



                >



                    Return ID:

                    {" "}

                    {

                        item.CustomerReturnId

                    }



                </Typography>









                <Typography>



                    Invoice ID:

                    {" "}

                    {

                        item.SalesInvoiceId

                    }



                </Typography>









                <Typography>



                    Product ID:

                    {" "}

                    {

                        item.ProductId

                    }



                </Typography>









                <Typography>



                    Return Number:

                    {" "}

                    {



                        item.ReturnNumber ||

                        "-"



                    }



                </Typography>









                <Typography>



                    Quantity:

                    {" "}

                    {

                        item.Quantity

                    }



                </Typography>









                <Typography>



                    Return Amount:

                    {" "}

                    {



                        item.ReturnAmount

                            ? `₹ ${item.ReturnAmount}`

                            : "-"



                    }



                </Typography>









                <Typography>



                    Status:

                    {" "}

                    {



                        item.Status ||

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



export default DeleteCustomerReturnDialog;