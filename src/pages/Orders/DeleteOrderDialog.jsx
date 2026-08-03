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



const DeleteOrderDialog = ({

    open,

    order,

    onClose,

    onDeleted

}) => {



    if (!order) return null;





    const handleDelete = () => {



        onDeleted(

            order.OrderId

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



                Delete Order



            </DialogTitle>







            <Divider />







            <DialogContent



                sx={{ mt: 2 }}



            >





                <Typography>



                    Are you sure you want to delete this order?



                </Typography>









                <Typography



                    sx={{ mt: 2 }}



                    fontWeight="bold"



                >



                    Order ID :

                    {" "}

                    {

                        order.OrderId

                    }



                </Typography>









                <Typography>



                    Order Number :

                    {" "}

                    {

                        order.OrderNumber

                    }



                </Typography>









                <Typography>



                    Customer ID :

                    {" "}

                    {

                        order.CustomerId

                    }



                </Typography>









                <Typography>



                    Order Status :

                    {" "}

                    {

                        order.OrderStatus ||

                        "-"

                    }



                </Typography>









                <Typography>



                    Total Amount :

                    {" "}

                    ₹



                    {



                        Number(

                            order.TotalAmount || 0

                        )

                        .toLocaleString()



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



export default DeleteOrderDialog;