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



const CustomerReturnModal = ({

    open,

    item,

    onClose,

    onSave

}) => {



    const initialState = {



        CustomerReturnId: 0,

        SalesInvoiceId: "",

        ProductId: "",

        ReturnNumber: "",

        ReturnDate: "",

        Quantity: "",

        ReturnAmount: "",

        Reason: "",

        Status: ""



    };







    const [

        formData,

        setFormData

    ] = useState(initialState);









    const statusOptions = [



        "Pending",

        "Approved",

        "Rejected",

        "Processing",

        "Completed",

        "Cancelled"



    ];









    useEffect(() => {



        if (item) {



            setFormData({



                CustomerReturnId:

                    item.CustomerReturnId || 0,



                SalesInvoiceId:

                    item.SalesInvoiceId || "",



                ProductId:

                    item.ProductId || "",



                ReturnNumber:

                    item.ReturnNumber || "",



                ReturnDate:

                    item.ReturnDate

                        ? item.ReturnDate.substring(

                            0,

                            16

                        )

                        : "",



                Quantity:

                    item.Quantity || "",



                ReturnAmount:

                    item.ReturnAmount || "",



                Reason:

                    item.Reason || "",



                Status:

                    item.Status || ""



            });



        }

        else {



            setFormData(initialState);



        }



    }, [item, open]);









    const handleChange = (e) => {



        const {

            name,

            value

        } = e.target;



        setFormData(prev => ({



            ...prev,



            [name]: value



        }));



    };









    const handleSubmit = () => {



        if (



            !formData.SalesInvoiceId



        ) {



            alert(

                "Sales Invoice ID is required."

            );



            return;



        }







        if (

            !formData.ProductId

        ) {



            alert(

                "Product ID is required."

            );



            return;



        }









        onSave({



            ...formData,



            SalesInvoiceId:

                Number(

                    formData.SalesInvoiceId

                ),



            ProductId:

                Number(

                    formData.ProductId

                ),



            Quantity:

                Number(

                    formData.Quantity

                ),



            ReturnAmount:

                Number(

                    formData.ReturnAmount

                )



        });



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



                    formData.CustomerReturnId



                        ? "Edit Customer Return"



                        : "Add Customer Return"



                }





            </DialogTitle>









            <DialogContent



                dividers



            >







                <Grid



                    container



                    spacing={2}



                    sx={{ mt: 1 }}



                >







                    <Grid



                        item



                        xs={12}



                        md={6}



                    >







                        <TextField



                            fullWidth



                            label="Sales Invoice ID"



                            name="SalesInvoiceId"



                            type="number"



                            value={

                                formData.SalesInvoiceId

                            }



                            onChange={handleChange}



                        />







                    </Grid>









                    <Grid



                        item



                        xs={12}



                        md={6}



                    >







                        <TextField



                            fullWidth



                            label="Product ID"



                            name="ProductId"



                            type="number"



                            value={

                                formData.ProductId

                            }



                            onChange={handleChange}



                        />







                    </Grid>









                    <Grid



                        item



                        xs={12}



                        md={6}



                    >







                        <TextField



                            fullWidth



                            label="Return Number"



                            name="ReturnNumber"



                            value={

                                formData.ReturnNumber

                            }



                            onChange={handleChange}



                        />







                    </Grid>









                    <Grid



                        item



                        xs={12}



                        md={6}



                    >







                        <TextField



                            fullWidth



                            label="Return Date"



                            name="ReturnDate"



                            type="datetime-local"



                            value={

                                formData.ReturnDate

                            }



                            onChange={handleChange}



                            InputLabelProps={{



                                shrink: true



                            }}



                        />







                    </Grid>









                    <Grid



                        item



                        xs={12}



                        md={6}



                    >







                        <TextField



                            fullWidth



                            label="Quantity"



                            name="Quantity"



                            type="number"



                            value={

                                formData.Quantity

                            }



                            onChange={handleChange}



                        />







                    </Grid>









                    <Grid



                        item



                        xs={12}



                        md={6}



                    >







                        <TextField



                            fullWidth



                            label="Return Amount"



                            name="ReturnAmount"



                            type="number"



                            value={

                                formData.ReturnAmount

                            }



                            onChange={handleChange}



                        />







                    </Grid>









                    <Grid



                        item



                        xs={12}



                    >







                        <TextField



                            fullWidth



                            multiline



                            rows={3}



                            label="Reason"



                            name="Reason"



                            value={

                                formData.Reason

                            }



                            onChange={handleChange}



                        />







                    </Grid>









                    <Grid



                        item



                        xs={12}



                    >







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



                                statusOptions.map(

                                    status => (



                                        <MenuItem



                                            key={status}



                                            value={status}



                                        >



                                            {

                                                status

                                            }



                                        </MenuItem>



                                    )

                                )



                            }







                        </TextField>







                    </Grid>







                </Grid>







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



                    onClick={handleSubmit}



                >



                    {



                        formData.CustomerReturnId



                            ? "Update"



                            : "Save"



                    }



                </Button>







            </DialogActions>







        </Dialog>



    );

};



export default CustomerReturnModal;