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



const OrderStatusHistoryView = ({

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



            case "confirmed":

                return "info";



            case "processing":

                return "primary";



            case "packed":

                return "secondary";



            case "shipped":

                return "success";



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









    return (



        <Dialog



            open={open}



            onClose={onClose}



            fullWidth



            maxWidth="md"



        >







            <DialogTitle>



                Order Status History Details



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



                        label="History ID"



                        value={

                            item.HistoryId

                        }



                    />









                    <Field



                        label="Order ID"



                        value={

                            item.OrderId

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



                            Status



                        </Typography>









                        <br />









                        <Chip



                            label={



                                item.Status ||

                                "N/A"



                            }



                            color={



                                getStatusColor(

                                    item.Status

                                )



                            }



                            size="small"



                        />







                    </Grid>









                    <Field



                        label="Remarks"



                        value={

                            item.Remarks ||

                            "-"

                        }



                    />









                    <Field



                        label="Changed On"



                        value={



                            item.ChangedOn



                                ? new Date(

                                    item.ChangedOn

                                )

                                .toLocaleString()



                                : "-"



                        }



                    />







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



export default OrderStatusHistoryView;