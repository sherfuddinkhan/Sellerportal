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



const DeleteOrderItemDialog = ({

    open,

    item,

    onClose,

    onDeleted

}) => {



    if (!item) return null;







    const handleDelete = () => {



        onDeleted(

            item.OrderItemId

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



                Delete Order Item



            </DialogTitle>







            <Divider />









            <DialogContent



                sx={{ mt: 2 }}



            >







                <Typography>





                    Are you sure you want to delete this order item?





                </Typography>









                <Typography



                    sx={{ mt: 2 }}



                    fontWeight="bold"



                >



                    Item ID:

                    {" "}

                    {

                        item.OrderItemId

                    }



                </Typography>









                <Typography>



                    Order ID:

                    {" "}

                    {

                        item.OrderId

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



                    Quantity:

                    {" "}

                    {



                        Number(

                            item.Quantity || 0

                        )

                        .toFixed(2)



                    }



                </Typography>









                <Typography>



                    Total Amount:

                    {" "}

                    ₹



                    {



                        Number(

                            item.TotalAmount || 0

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



export default DeleteOrderItemDialog;