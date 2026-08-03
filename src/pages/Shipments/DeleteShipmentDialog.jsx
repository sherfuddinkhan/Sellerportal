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



const DeleteShipmentDialog = ({

    open,

    item,

    onClose,

    onDeleted

}) => {



    if (!item) return null;







    const handleDelete = () => {



        onDeleted(

            item.ShipmentId

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



                Delete Shipment



            </DialogTitle>







            <Divider />









            <DialogContent



                sx={{ mt: 2 }}



            >







                <Typography>





                    Are you sure you want to delete this shipment?





                </Typography>









                <Typography



                    sx={{ mt: 2 }}



                    fontWeight="bold"



                >



                    Shipment ID:

                    {" "}

                    {

                        item.ShipmentId

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



                    Courier:

                    {" "}

                    {



                        item.CourierName ||

                        "-"



                    }



                </Typography>









                <Typography>



                    Tracking Number:

                    {" "}

                    {



                        item.TrackingNumber ||

                        "-"



                    }



                </Typography>









                <Typography>



                    Status:

                    {" "}

                    {



                        item.ShipmentStatus ||

                        "-"



                    }



                </Typography>









                <Typography>



                    Shipment Date:

                    {" "}

                    {



                        item.ShipmentDate



                            ? new Date(

                                item.ShipmentDate

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



export default DeleteShipmentDialog;