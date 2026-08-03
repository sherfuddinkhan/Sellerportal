import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Typography,
    Button,
    Divider,
    Chip
} from "@mui/material";


const CustomerAddressView = ({

    open,

    address,

    onClose

}) => {


    if (!address) return null;



    const Field = ({

        label,

        value

    }) => (

        <Grid

            item

            xs={12}

            md={6}

        >

            <Typography

                variant="caption"

                color="text.secondary"

            >

                {label}

            </Typography>



            <Typography

                variant="body1"

                fontWeight={500}

            >

                {

                    value || "-"

                }

            </Typography>


        </Grid>

    );



    return (


        <Dialog

            open={open}

            onClose={onClose}

            fullWidth

            maxWidth="md"

        >


            <DialogTitle>

                Customer Address Details

            </DialogTitle>



            <Divider />



            <DialogContent

                sx={{

                    mt: 2

                }}

            >


                <Grid

                    container

                    spacing={3}

                >



                    <Field

                        label="Customer Address ID"

                        value={

                            address.CustomerAddressId

                        }

                    />



                    <Field

                        label="Customer ID"

                        value={

                            address.CustomerId

                        }

                    />



                    <Field

                        label="Address Type"

                        value={

                            address.AddressType

                        }

                    />



                    <Field

                        label="Address Line 1"

                        value={

                            address.AddressLine1

                        }

                    />



                    <Field

                        label="Address Line 2"

                        value={

                            address.AddressLine2

                        }

                    />



                    <Field

                        label="City"

                        value={

                            address.City

                        }

                    />



                    <Field

                        label="State"

                        value={

                            address.State

                        }

                    />



                    <Field

                        label="Country"

                        value={

                            address.Country

                        }

                    />



                    <Field

                        label="Postal Code"

                        value={

                            address.PostalCode

                        }

                    />



                    <Grid

                        item

                        xs={12}

                        md={6}

                    >

                        <Typography

                            variant="caption"

                            color="text.secondary"

                        >

                            Default Address

                        </Typography>



                        <br />


                        <Chip

                            label={

                                address.IsDefault

                                    ? "Yes"

                                    : "No"

                            }

                            color={

                                address.IsDefault

                                    ? "success"

                                    : "default"

                            }

                        />


                    </Grid>



                    <Field

                        label="Created Date"

                        value={

                            address.CreatedDate

                                ? new Date(

                                    address.CreatedDate

                                  ).toLocaleString()

                                : "-"

                        }

                    />



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


export default CustomerAddressView;