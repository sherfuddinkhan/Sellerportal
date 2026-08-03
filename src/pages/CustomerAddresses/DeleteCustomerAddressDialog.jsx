import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Divider
} from "@mui/material";


const DeleteCustomerAddressDialog = ({

    open,

    address,

    onClose,

    onDeleted

}) => {


    if (!address) return null;



    const handleDelete = () => {


        onDeleted(

            address.CustomerAddressId

        );


    };



    return (


        <Dialog

            open={open}

            onClose={onClose}

            fullWidth

            maxWidth="sm"

        >


            <DialogTitle>

                Delete Customer Address

            </DialogTitle>



            <Divider />



            <DialogContent

                sx={{

                    mt: 2

                }}

            >


                <Typography>

                    Are you sure you want to delete this customer address?

                </Typography>



                <Typography

                    sx={{ mt: 2 }}

                    fontWeight="bold"

                >

                    Address ID :

                    {" "}

                    {

                        address.CustomerAddressId

                    }

                </Typography>



                <Typography>

                    Customer ID :

                    {" "}

                    {

                        address.CustomerId

                    }

                </Typography>



                <Typography>

                    Address Type :

                    {" "}

                    {

                        address.AddressType

                    }

                </Typography>



                <Typography>

                    Address :

                    {" "}

                    {

                        address.AddressLine1 ||

                        "-"

                    }

                </Typography>



                {

                    address.AddressLine2 &&

                    <Typography>

                        {

                            address.AddressLine2

                        }

                    </Typography>

                }



                <Typography>

                    City :

                    {" "}

                    {

                        address.City ||

                        "-"

                    }

                </Typography>



                <Typography>

                    State :

                    {" "}

                    {

                        address.State ||

                        "-"

                    }

                </Typography>



                <Typography>

                    Postal Code :

                    {" "}

                    {

                        address.PostalCode ||

                        "-"

                    }

                </Typography>



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

                    color="error"

                    onClick={handleDelete}

                >

                    Delete

                </Button>



            </DialogActions>


        </Dialog>


    );

};


export default DeleteCustomerAddressDialog;