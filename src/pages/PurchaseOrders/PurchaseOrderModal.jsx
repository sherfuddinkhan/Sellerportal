import React, {
    useEffect,
    useState
} from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    TextField,
    Button,
    MenuItem
} from "@mui/material";


const initialState = {

    PurchaseOrderId: 0,

    SellerId: "",

    SupplierId: "",

    PurchaseOrderNumber: "",

    OrderDate: "",

    ExpectedDeliveryDate: "",

    Status: "Pending",

    TotalAmount: "",

    Remarks: ""

};


const statusOptions = [

    "Pending",

    "Processing",

    "Completed",

    "Cancelled"

];


const PurchaseOrderModal = ({

    open,

    item,

    onClose,

    onSave

}) => {


    const [formData, setFormData] =

        useState(initialState);



    useEffect(() => {


        if (item) {


            setFormData({

                ...initialState,

                ...item,


                OrderDate:

                    item.OrderDate

                        ? item.OrderDate.substring(0, 10)

                        : "",


                ExpectedDeliveryDate:

                    item.ExpectedDeliveryDate

                        ? item.ExpectedDeliveryDate.substring(0, 10)

                        : ""

            });


        }

        else {


            setFormData(initialState);


        }


    }, [item]);



    const handleChange = (e) => {


        const {

            name,

            value

        } = e.target;



        setFormData((prev) => ({


            ...prev,


            [name]: value


        }));


    };



    const handleSubmit = () => {


        onSave(formData);


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


                    formData.PurchaseOrderId


                        ? "Edit Purchase Order"


                        : "Add Purchase Order"


                }


            </DialogTitle>



            <DialogContent dividers>



                <Grid

                    container

                    spacing={2}

                    sx={{ mt: 0.5 }}

                >



                    <Grid item xs={12} md={6}>


                        <TextField

                            fullWidth

                            label="Seller ID"

                            name="SellerId"

                            type="number"

                            value={
                                formData.SellerId
                            }

                            onChange={handleChange}

                        />


                    </Grid>



                    <Grid item xs={12} md={6}>


                        <TextField

                            fullWidth

                            label="Supplier ID"

                            name="SupplierId"

                            type="number"

                            value={
                                formData.SupplierId
                            }

                            onChange={handleChange}

                        />


                    </Grid>




                    <Grid item xs={12} md={6}>


                        <TextField

                            fullWidth

                            label="Purchase Order Number"

                            name="PurchaseOrderNumber"

                            value={
                                formData.PurchaseOrderNumber
                            }

                            onChange={handleChange}

                        />


                    </Grid>




                    <Grid item xs={12} md={6}>


                        <TextField

                            fullWidth

                            label="Order Date"

                            name="OrderDate"

                            type="date"

                            InputLabelProps={{

                                shrink: true

                            }}

                            value={
                                formData.OrderDate
                            }

                            onChange={handleChange}

                        />


                    </Grid>




                    <Grid item xs={12} md={6}>


                        <TextField

                            fullWidth

                            label="Expected Delivery Date"

                            name="ExpectedDeliveryDate"

                            type="date"

                            InputLabelProps={{

                                shrink: true

                            }}

                            value={
                                formData.ExpectedDeliveryDate
                            }

                            onChange={handleChange}

                        />


                    </Grid>




                    <Grid item xs={12} md={6}>


                        <TextField

                            select

                            fullWidth

                            label="Status"

                            name="Status"

                            value={
                                formData.Status
                            }

                            onChange={handleChange}

                        >


                            {

                                statusOptions.map((status) => (


                                    <MenuItem

                                        key={status}

                                        value={status}

                                    >

                                        {status}

                                    </MenuItem>


                                ))

                            }


                        </TextField>


                    </Grid>




                    <Grid item xs={12} md={6}>


                        <TextField

                            fullWidth

                            label="Total Amount"

                            name="TotalAmount"

                            type="number"

                            value={
                                formData.TotalAmount
                            }

                            onChange={handleChange}

                        />


                    </Grid>




                    <Grid item xs={12}>


                        <TextField

                            fullWidth

                            multiline

                            rows={4}

                            label="Remarks"

                            name="Remarks"

                            value={
                                formData.Remarks
                            }

                            onChange={handleChange}

                        />


                    </Grid>



                </Grid>



            </DialogContent>




            <DialogActions>



                <Button

                    onClick={onClose}

                    color="inherit"

                >

                    Cancel

                </Button>



                <Button

                    variant="contained"

                    onClick={handleSubmit}

                >


                    {


                        formData.PurchaseOrderId


                            ? "Update"


                            : "Save"


                    }


                </Button>



            </DialogActions>



        </Dialog>


    );


};


export default PurchaseOrderModal;