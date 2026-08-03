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
    Button
} from "@mui/material";



const OrderItemModal = ({

    open,

    item,

    onClose,

    onSave

}) => {



    const initialState = {



        OrderItemId: 0,

        OrderId: "",

        ProductId: "",

        Quantity: "",

        UnitPrice: "",

        TotalAmount: ""



    };







    const [

        formData,

        setFormData

    ] = useState(initialState);









    useEffect(() => {



        if (item) {



            setFormData({



                OrderItemId:

                    item.OrderItemId || 0,



                OrderId:

                    item.OrderId || "",



                ProductId:

                    item.ProductId || "",



                Quantity:

                    item.Quantity || "",



                UnitPrice:

                    item.UnitPrice || "",



                TotalAmount:

                    item.TotalAmount || ""



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









    const calculateTotal = () => {



        const quantity = Number(

            formData.Quantity || 0

        );



        const price = Number(

            formData.UnitPrice || 0

        );



        return quantity * price;



    };









    const handleSubmit = () => {



        if (



            !formData.OrderId ||



            !formData.ProductId



        ) {



            alert(

                "Order ID and Product ID are required."

            );



            return;



        }







        onSave({



            ...formData,



            Quantity:

                Number(

                    formData.Quantity || 0

                ),



            UnitPrice:

                Number(

                    formData.UnitPrice || 0

                ),



            TotalAmount:

                calculateTotal()



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



                    formData.OrderItemId



                        ? "Edit Order Item"



                        : "Add Order Item"



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



                            label="Order ID"



                            name="OrderId"



                            type="number"



                            value={

                                formData.OrderId

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



                        md={4}



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



                        md={4}



                    >







                        <TextField



                            fullWidth



                            label="Unit Price"



                            name="UnitPrice"



                            type="number"



                            value={

                                formData.UnitPrice

                            }



                            onChange={handleChange}



                        />







                    </Grid>









                    <Grid



                        item



                        xs={12}



                        md={4}



                    >







                        <TextField



                            fullWidth



                            label="Total Amount"



                            value={



                                calculateTotal()

                            }



                            InputProps={{



                                readOnly: true



                            }}



                        />







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



                        formData.OrderItemId



                            ? "Update"



                            : "Save"



                    }



                </Button>







            </DialogActions>







        </Dialog>



    );

};



export default OrderItemModal;