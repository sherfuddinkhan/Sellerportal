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



const CustomerReturnView = ({

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



            case "approved":

                return "info";



            case "processing":

                return "primary";



            case "completed":

                return "success";



            case "rejected":

                return "error";



            case "cancelled":

                return "error";



            default:

                return "default";



        }



    };









    const formatDate = (date) => {



        return date



            ? new Date(date)

                .toLocaleString()



            : "-";



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



                Customer Return Details



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



                        label="Return ID"



                        value={

                            item.CustomerReturnId

                        }



                    />









                    <Field



                        label="Sales Invoice ID"



                        value={

                            item.SalesInvoiceId

                        }



                    />









                    <Field



                        label="Product ID"



                        value={

                            item.ProductId

                        }



                    />









                    <Field



                        label="Return Number"



                        value={

                            item.ReturnNumber

                        }



                    />









                    <Field



                        label="Return Date"



                        value={

                            formatDate(

                                item.ReturnDate

                            )

                        }



                    />









                    <Field



                        label="Quantity"



                        value={

                            item.Quantity

                        }



                    />









                    <Field



                        label="Return Amount"



                        value={



                            item.ReturnAmount

                                ? `₹ ${item.ReturnAmount}`

                                : "-"



                        }



                    />









                    <Field



                        label="Reason"



                        value={

                            item.Reason

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



                        label="Created Date"



                        value={

                            formatDate(

                                item.CreatedDate

                            )

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



export default CustomerReturnView;