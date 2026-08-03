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



const DeleteOrderStatusHistoryDialog = ({

    open,

    item,

    onClose,

    onDeleted

}) => {



    if (!item) return null;







    const handleDelete = () => {



        onDeleted(

            item.HistoryId

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



                Delete Order Status History



            </DialogTitle>







            <Divider />









            <DialogContent



                sx={{ mt: 2 }}



            >







                <Typography>





                    Are you sure you want to delete this order status history record?





                </Typography>









                <Typography



                    sx={{ mt: 2 }}



                    fontWeight="bold"



                >



                    History ID:

                    {" "}

                    {

                        item.HistoryId

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



                    Status:

                    {" "}

                    {

                        item.Status ||

                        "-"

                    }



                </Typography>









                <Typography>



                    Remarks:

                    {" "}

                    {

                        item.Remarks ||

                        "-"

                    }



                </Typography>









                <Typography>



                    Changed On:

                    {" "}

                    {



                        item.ChangedOn



                            ? new Date(

                                item.ChangedOn

                            )

                            .toLocaleString()



                            : "-"



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



export default DeleteOrderStatusHistoryDialog;