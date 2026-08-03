import React from "react";


import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    Divider,
    Chip
} from "@mui/material";



const ShipmentView = ({

    open,

    item,

    onClose

}) => {



    if (!item) return null;







    const getStatusColor = (status) => {



        switch (

            status?.toLowerCase()

        ) {



            case "pending":

                return "warning";



            case "processing":

                return "info";



            case "packed":

                return "secondary";



            case "shipped":

                return "primary";



            case "in transit":

                return "info";



            case "out for delivery":

                return "warning";



            case "delivered":

                return "success";



            case "cancelled":

                return "error";



            case "returned":

                return "error";



            default:

                return "default";



        }



    };









    const Field = ({

        label,

        value

    }) => (



        <Grid



            item



            xs={12}



            md={6}



        >







            <Typography



                variant="caption"



                color="text.secondary"



            >



                {label}



            </Typography>









            <Typography



                variant="body1"



                fontWeight={500}



            >





                {

                    value ?? "-"

                }





            </Typography>







        </Grid>



    );









    const formatDate = (date) => {



        return date



            ? new Date(date)

                .toLocaleString()



            : "-";



    };









    return (



        <Dialog



            open={open}



            onClose={onClose}



            fullWidth



            maxWidth="md"



        >







            <DialogTitle>



                Shipment Details



            </DialogTitle>







            <Divider />









            <DialogContent



                sx={{ mt: 2 }}



            >







                <Grid



                    container



                    spacing={3}



                >







                    <Field



                        label="Shipment ID"



                        value={

                            item.ShipmentId

                        }



                    />









                    <Field



                        label="Order ID"



                        value={

                            item.OrderId

                        }



                    />









                    <Field



                        label="Courier Name"



                        value={

                            item.CourierName ||

                            "-"

                        }



                    />









                    <Field



                        label="Tracking Number"



                        value={

                            item.TrackingNumber ||

                            "-"

                        }



                    />









                    <Field



                        label="Shipment Date"



                        value={

                            formatDate(

                                item.ShipmentDate

                            )

                        }



                    />









                    <Field



                        label="Delivery Date"



                        value={

                            formatDate(

                                item.DeliveryDate

                            )

                        }



                    />









                    <Grid



                        item



                        xs={12}



                        md={6}



                    >







                        <Typography



                            variant="caption"



                            color="text.secondary"



                        >



                            Shipment Status



                        </Typography>









                        <br />









                        <Chip



                            label={



                                item.ShipmentStatus ||

                                "N/A"



                            }



                            color={



                                getStatusColor(

                                    item.ShipmentStatus

                                )



                            }



                            size="small"



                        />







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



export default ShipmentView;