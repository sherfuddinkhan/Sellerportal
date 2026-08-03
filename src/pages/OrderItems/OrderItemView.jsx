import React from "react";


import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    Divider
} from "@mui/material";



const OrderItemView = ({

    open,

    item,

    onClose

}) => {



    if (!item) return null;







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



                Order Item Details



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



                        label="Order Item ID"



                        value={

                            item.OrderItemId

                        }



                    />









                    <Field



                        label="Order ID"



                        value={

                            item.OrderId

                        }



                    />









                    <Field



                        label="Product ID"



                        value={

                            item.ProductId

                        }



                    />









                    <Field



                        label="Quantity"



                        value={



                            Number(

                                item.Quantity || 0

                            )

                            .toFixed(2)



                        }



                    />









                    <Field



                        label="Unit Price"



                        value={



                            `₹ ${Number(

                                item.UnitPrice || 0

                            )

                            .toLocaleString()}`



                        }



                    />









                    <Field



                        label="Total Amount"



                        value={



                            `₹ ${Number(

                                item.TotalAmount || 0

                            )

                            .toLocaleString()}`



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



export default OrderItemView;