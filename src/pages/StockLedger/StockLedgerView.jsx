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



const formatDate = (date) => {



    if(!date)

        return "-";



    return new Date(date).toLocaleDateString();



};







const StockLedgerView = ({

    open,

    ledger,

    onClose

}) => {



    if(!ledger)

        return null;







    const fields = [



        {

            label:"Stock Ledger ID",

            value:ledger.StockLedgerId

        },



        {

            label:"Seller ID",

            value:ledger.SellerId

        },



        {

            label:"Product ID",

            value:ledger.ProductId

        },



        {

            label:"Warehouse ID",

            value:ledger.WarehouseId

        },



        {

            label:"Reference Number",

            value:

                ledger.ReferenceNumber || "-"

        },



        {

            label:"Quantity",

            value:

                Number(

                    ledger.Quantity || 0

                ).toFixed(2)

        },



        {

            label:"Balance Quantity",

            value:

                Number(

                    ledger.BalanceQuantity || 0

                ).toFixed(2)

        },



        {

            label:"Transaction Date",

            value:

                formatDate(

                    ledger.TransactionDate

                )

        },



        {

            label:"Created Date",

            value:

                formatDate(

                    ledger.CreatedDate

                )

        }



    ];







    return (



        <Dialog



            open={open}



            onClose={onClose}



            fullWidth



            maxWidth="md"



        >





            <DialogTitle>



                Stock Ledger Details



            </DialogTitle>








            <DialogContent dividers>





                <Grid



                    container



                    spacing={2}



                >







                    <Grid



                        item



                        xs={12}



                    >





                        <Typography



                            variant="subtitle2"



                            color="text.secondary"



                        >



                            Transaction Type



                        </Typography>









                        <Chip



                            label={

                                ledger.TransactionType

                                ||

                                "-"

                            }



                            color={



                                ledger.TransactionType

                                ?.toUpperCase()

                                === "PURCHASE"

                                ?

                                "success"

                                :



                                ledger.TransactionType

                                ?.toUpperCase()

                                === "SALE"

                                ?

                                "error"

                                :

                                "default"



                            }



                        />







                    </Grid>









                    {

                        fields.map((field,index)=>(



                            <Grid



                                item



                                xs={12}



                                sm={6}



                                key={index}



                            >





                                <Typography



                                    variant="subtitle2"



                                    color="text.secondary"



                                >



                                    {

                                        field.label

                                    }



                                </Typography>









                                <Typography



                                    variant="body1"



                                >



                                    {

                                        field.value

                                    }



                                </Typography>







                            </Grid>





                        ))



                    }









                    <Grid



                        item



                        xs={12}



                    >





                        <Divider



                            sx={{

                                my:2

                            }}



                        />









                        <Typography



                            variant="subtitle2"



                            color="text.secondary"



                        >



                            Remarks



                        </Typography>









                        <Typography



                            variant="body1"



                        >



                            {

                                ledger.Remarks

                                ||

                                "-"

                            }



                        </Typography>







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



export default StockLedgerView;