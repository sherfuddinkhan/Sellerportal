import React from "react";


import {

    Dialog,

    DialogTitle,

    DialogContent,

    DialogActions,

    Button,

    Typography,

    Alert

} from "@mui/material";



const DeleteStockLedgerDialog = ({

    open,

    ledger,

    onClose,

    onDeleted

}) => {



    if(!ledger)

        return null;







    const handleDelete = () => {



        onDeleted(

            ledger.StockLedgerId

        );



    };







    return (



        <Dialog



            open={open}



            onClose={onClose}



            maxWidth="sm"



            fullWidth



        >





            <DialogTitle>



                Delete Stock Ledger Entry



            </DialogTitle>








            <DialogContent dividers>





                <Alert



                    severity="warning"



                    sx={{mb:2}}



                >



                    This action cannot be undone.



                </Alert>









                <Typography>



                    Are you sure you want to delete this Stock Ledger record?



                </Typography>









                <Typography



                    variant="subtitle2"



                    sx={{mt:2}}



                >



                    Stock Ledger ID:

                    {" "}

                    {

                        ledger.StockLedgerId

                    }



                </Typography>









                <Typography



                    variant="subtitle2"



                >



                    Transaction Type:

                    {" "}

                    {

                        ledger.TransactionType

                    }



                </Typography>







                <Typography



                    variant="subtitle2"



                >



                    Product ID:

                    {" "}

                    {

                        ledger.ProductId

                    }



                </Typography>







            </DialogContent>









            <DialogActions>



                <Button



                    onClick={onClose}



                    color="inherit"



                >



                    Cancel



                </Button>









                <Button



                    onClick={handleDelete}



                    variant="contained"



                    color="error"



                >



                    Delete



                </Button>







            </DialogActions>







        </Dialog>



    );


};



export default DeleteStockLedgerDialog;