import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Typography,
    Button,
    Divider,
    Chip
} from "@mui/material";



const CustomerPaymentView = ({

    open,

    payment,

    onClose

}) => {



    if (!payment) return null;





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

                    value || "-"

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



                Customer Payment Details



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



                        label="Customer Payment ID"



                        value={

                            payment.CustomerPaymentId

                        }



                    />









                    <Field



                        label="Sales Invoice ID"



                        value={

                            payment.SalesInvoiceId

                        }



                    />









                    <Field



                        label="Payment Number"



                        value={

                            payment.PaymentNumber

                        }



                    />









                    <Field



                        label="Payment Date"



                        value={



                            payment.PaymentDate



                                ? new Date(

                                    payment.PaymentDate

                                  )

                                  .toLocaleDateString()



                                : "-"



                        }



                    />









                    <Field



                        label="Amount"



                        value={



                            `₹ ${Number(

                                payment.Amount || 0

                            ).toLocaleString()}`



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



                            Payment Mode



                        </Typography>







                        <br />







                        <Chip



                            label={



                                payment.PaymentMode ||

                                "N/A"



                            }



                            color="primary"



                        />





                    </Grid>









                    <Field



                        label="Reference Number"



                        value={

                            payment.ReferenceNumber

                        }



                    />









                    <Field



                        label="Remarks"



                        value={

                            payment.Remarks

                        }



                    />









                    <Field



                        label="Created Date"



                        value={



                            payment.CreatedDate



                                ? new Date(

                                    payment.CreatedDate

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



export default CustomerPaymentView;