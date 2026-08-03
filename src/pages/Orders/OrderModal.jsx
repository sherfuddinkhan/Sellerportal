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



const OrderModal = ({

    open,

    order,

    onClose,

    onSave

}) => {



    const initialState = {


        OrderId: 0,


        SellerId: "",


        CustomerId: "",


        OrderNumber: "",


        OrderDate: "",


        OrderStatus: "",


        TotalAmount: ""

    };





    const [

        formData,

        setFormData

    ] = useState(initialState);







    useEffect(() => {



        if (order) {



            setFormData({



                OrderId:

                    order.OrderId || 0,



                SellerId:

                    order.SellerId || "",



                CustomerId:

                    order.CustomerId || "",



                OrderNumber:

                    order.OrderNumber || "",



                OrderDate:

                    order.OrderDate

                        ? order.OrderDate.substring(0,10)

                        : "",



                OrderStatus:

                    order.OrderStatus || "",



                TotalAmount:

                    order.TotalAmount || ""



            });



        }

        else {



            setFormData(initialState);



        }



    }, [order, open]);







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



            !formData.SellerId ||



            !formData.CustomerId ||



            !formData.OrderNumber



        ) {



            alert(

                "Seller, Customer and Order Number are required."

            );



            return;



        }






        onSave({



            ...formData,



            TotalAmount:



                Number(

                    formData.TotalAmount || 0

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



                    formData.OrderId



                        ? "Edit Order"



                        : "Add Order"



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



                            label="Seller ID"



                            name="SellerId"



                            type="number"



                            value={

                                formData.SellerId

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



                            label="Customer ID"



                            name="CustomerId"



                            type="number"



                            value={

                                formData.CustomerId

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



                            label="Order Number"



                            name="OrderNumber"



                            value={

                                formData.OrderNumber

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









                    <Grid



                        item



                        xs={12}



                        md={6}



                    >



                        <TextField



                            select



                            fullWidth



                            label="Order Status"



                            name="OrderStatus"



                            value={

                                formData.OrderStatus

                            }



                            onChange={handleChange}



                        >







                            <MenuItem value="Pending">



                                Pending



                            </MenuItem>









                            <MenuItem value="Confirmed">



                                Confirmed



                            </MenuItem>









                            <MenuItem value="Processing">



                                Processing



                            </MenuItem>









                            <MenuItem value="Packed">



                                Packed



                            </MenuItem>









                            <MenuItem value="Shipped">



                                Shipped



                            </MenuItem>









                            <MenuItem value="Delivered">



                                Delivered



                            </MenuItem>









                            <MenuItem value="Cancelled">



                                Cancelled



                            </MenuItem>









                            <MenuItem value="Returned">



                                Returned



                            </MenuItem>







                        </TextField>



                    </Grid>









                    <Grid



                        item



                        xs={12}



                        md={6}



                    >



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



                        formData.OrderId



                            ? "Update"



                            : "Save"



                    }



                </Button>







            </DialogActions>







        </Dialog>



    );

};



export default OrderModal;