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



const OrderStatusHistoryModal = ({

    open,

    item,

    onClose,

    onSave

}) => {



    const initialState = {



        HistoryId: 0,

        OrderId: "",

        Status: "",

        Remarks: "",

        ChangedOn: ""



    };







    const [

        formData,

        setFormData

    ] = useState(initialState);









    const statusOptions = [



        "Pending",

        "Confirmed",

        "Processing",

        "Packed",

        "Shipped",

        "Delivered",

        "Cancelled",

        "Returned"



    ];









    useEffect(() => {



        if (item) {



            setFormData({



                HistoryId:

                    item.HistoryId || 0,



                OrderId:

                    item.OrderId || "",



                Status:

                    item.Status || "",



                Remarks:

                    item.Remarks || "",



                ChangedOn:

                    item.ChangedOn

                        ? item.ChangedOn.substring(

                            0,

                            16

                        )

                        : ""



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



            !formData.OrderId ||



            !formData.Status



        ) {



            alert(

                "Order ID and Status are required."

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



                    formData.HistoryId



                        ? "Edit Order Status History"



                        : "Add Order Status History"



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









                    <Grid



                        item



                        xs={12}



                    >







                        <TextField



                            fullWidth



                            multiline



                            rows={3}



                            label="Remarks"



                            name="Remarks"



                            value={

                                formData.Remarks

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



                            label="Changed On"



                            name="ChangedOn"



                            type="datetime-local"



                            value={

                                formData.ChangedOn

                            }



                            onChange={handleChange}



                            InputLabelProps={{



                                shrink: true



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



                        formData.HistoryId



                            ? "Update"



                            : "Save"



                    }



                </Button>







            </DialogActions>







        </Dialog>



    );

};



export default OrderStatusHistoryModal;