import React, {

    useEffect,

    useState

} from "react";


import {

    Dialog,

    DialogTitle,

    DialogContent,

    DialogActions,

    Button,

    Grid,

    TextField,

    MenuItem

} from "@mui/material";



const initialState = {



    StockLedgerId: null,

    SellerId: "",

    ProductId: "",

    WarehouseId: "",

    TransactionType: "",

    ReferenceNumber: "",

    Quantity: "",

    BalanceQuantity: "",

    Remarks: "",

    TransactionDate: ""



};







const transactionTypes = [



    "PURCHASE",

    "SALE",

    "ADJUSTMENT",

    "RETURN",

    "TRANSFER"



];









const StockLedgerModal = ({

    open,

    ledger,

    onClose,

    onSave

}) => {



    const [formData,setFormData] = useState(

        initialState

    );







    useEffect(()=>{



        if(ledger){



            setFormData({



                StockLedgerId:

                    ledger.StockLedgerId || null,



                SellerId:

                    ledger.SellerId || "",



                ProductId:

                    ledger.ProductId || "",



                WarehouseId:

                    ledger.WarehouseId || "",



                TransactionType:

                    ledger.TransactionType || "",



                ReferenceNumber:

                    ledger.ReferenceNumber || "",



                Quantity:

                    ledger.Quantity || "",



                BalanceQuantity:

                    ledger.BalanceQuantity || "",



                Remarks:

                    ledger.Remarks || "",



                TransactionDate:

                    ledger.TransactionDate

                    ?

                    ledger.TransactionDate.substring(0,10)

                    :

                    ""



            });



        }

        else {



            setFormData(initialState);



        }



    },[ledger,open]);









    const handleChange = (e)=>{



        const {

            name,

            value

        } = e.target;



        setFormData(prev=>({



            ...prev,

            [name]:value



        }));



    };









    const handleSubmit = ()=>{



        const data = {



            ...formData,



            SellerId:

                Number(

                    formData.SellerId

                ),



            ProductId:

                Number(

                    formData.ProductId

                ),



            WarehouseId:

                Number(

                    formData.WarehouseId

                ),



            Quantity:

                Number(

                    formData.Quantity || 0

                ),



            BalanceQuantity:

                Number(

                    formData.BalanceQuantity || 0

                )



        };





        onSave(data);



    };









    return (



        <Dialog



            open={open}



            onClose={onClose}



            fullWidth



            maxWidth="md"




        >





            <DialogTitle>



                {

                    formData.StockLedgerId

                    ?

                    "Edit Stock Ledger Entry"

                    :

                    "Add Stock Ledger Entry"



                }



            </DialogTitle>








            <DialogContent dividers>





                <Grid



                    container



                    spacing={2}



                    mt={1}



                >







                    <Grid item xs={12} md={4}>



                        <TextField



                            fullWidth



                            label="Seller ID"



                            name="SellerId"



                            value={formData.SellerId}



                            onChange={handleChange}



                        />



                    </Grid>









                    <Grid item xs={12} md={4}>



                        <TextField



                            fullWidth



                            label="Product ID"



                            name="ProductId"



                            value={formData.ProductId}



                            onChange={handleChange}



                        />



                    </Grid>









                    <Grid item xs={12} md={4}>



                        <TextField



                            fullWidth



                            label="Warehouse ID"



                            name="WarehouseId"



                            value={formData.WarehouseId}



                            onChange={handleChange}



                        />



                    </Grid>









                    <Grid item xs={12} md={6}>



                        <TextField



                            select



                            fullWidth



                            label="Transaction Type"



                            name="TransactionType"



                            value={formData.TransactionType}



                            onChange={handleChange}



                        >





                            {



                                transactionTypes.map(type=>(



                                    <MenuItem



                                        key={type}



                                        value={type}



                                    >



                                        {

                                            type

                                        }



                                    </MenuItem>





                                ))



                            }





                        </TextField>



                    </Grid>









                    <Grid item xs={12} md={6}>



                        <TextField



                            fullWidth



                            label="Reference Number"



                            name="ReferenceNumber"



                            value={formData.ReferenceNumber}



                            onChange={handleChange}



                        />



                    </Grid>









                    <Grid item xs={12} md={4}>



                        <TextField



                            fullWidth



                            type="number"



                            label="Quantity"



                            name="Quantity"



                            value={formData.Quantity}



                            onChange={handleChange}



                        />



                    </Grid>









                    <Grid item xs={12} md={4}>



                        <TextField



                            fullWidth



                            type="number"



                            label="Balance Quantity"



                            name="BalanceQuantity"



                            value={formData.BalanceQuantity}



                            onChange={handleChange}



                        />



                    </Grid>









                    <Grid item xs={12} md={4}>



                        <TextField



                            fullWidth



                            type="date"



                            label="Transaction Date"



                            name="TransactionDate"



                            InputLabelProps={{



                                shrink:true



                            }}



                            value={formData.TransactionDate}



                            onChange={handleChange}



                        />



                    </Grid>









                    <Grid item xs={12}>



                        <TextField



                            fullWidth



                            multiline



                            rows={3}



                            label="Remarks"



                            name="Remarks"



                            value={formData.Remarks}



                            onChange={handleChange}



                        />



                    </Grid>







                </Grid>






            </DialogContent>









            <DialogActions>



                <Button



                    onClick={onClose}



                >



                    Cancel



                </Button>









                <Button



                    variant="contained"



                    onClick={handleSubmit}



                >



                    Save



                </Button>






            </DialogActions>







        </Dialog>



    );


};



export default StockLedgerModal;