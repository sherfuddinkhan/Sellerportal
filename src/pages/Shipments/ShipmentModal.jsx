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



const ShipmentModal = ({

    open,

    item,

    onClose,

    onSave

}) => {



    const initialState = {



        ShipmentId: 0,

        OrderId: "",

        CourierName: "",

        TrackingNumber: "",

        ShipmentDate: "",

        DeliveryDate: "",

        ShipmentStatus: ""



    };







    const [

        formData,

        setFormData

    ] = useState(initialState);









    const statusOptions = [



        "Pending",

        "Processing",

        "Packed",

        "Shipped",

        "In Transit",

        "Out for Delivery",

        "Delivered",

        "Cancelled",

        "Returned"



    ];









    useEffect(() => {



        if (item) {



            setFormData({



                ShipmentId:

                    item.ShipmentId || 0,



                OrderId:

                    item.OrderId || "",



                CourierName:

                    item.CourierName || "",



                TrackingNumber:

                    item.TrackingNumber || "",



                ShipmentDate:

                    item.ShipmentDate

                        ? item.ShipmentDate.substring(

                            0,

                            16

                        )

                        : "",



                DeliveryDate:

                    item.DeliveryDate

                        ? item.DeliveryDate.substring(

                            0,

                            16

                        )

                        : "",



                ShipmentStatus:

                    item.ShipmentStatus || ""



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



            !formData.OrderId



        ) {



            alert(

                "Order ID is required."

            );



            return;



        }







        onSave({



            ...formData,



            OrderId:

                Number(

                    formData.OrderId

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



                    formData.ShipmentId



                        ? "Edit Shipment"



                        : "Add Shipment"



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



                            label="Courier Name"



                            name="CourierName"



                            value={

                                formData.CourierName

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



                            label="Tracking Number"



                            name="TrackingNumber"



                            value={

                                formData.TrackingNumber

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



                            label="Shipment Date"



                            name="ShipmentDate"



                            type="datetime-local"



                            value={

                                formData.ShipmentDate

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



                            label="Delivery Date"



                            name="DeliveryDate"



                            type="datetime-local"



                            value={

                                formData.DeliveryDate

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



                    >







                        <TextField



                            select



                            fullWidth



                            label="Shipment Status"



                            name="ShipmentStatus"



                            value={

                                formData.ShipmentStatus

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



                        formData.ShipmentId



                            ? "Update"



                            : "Save"



                    }



                </Button>







            </DialogActions>







        </Dialog>



    );

};



export default ShipmentModal;