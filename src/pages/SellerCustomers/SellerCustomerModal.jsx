import React, { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    TextField,
    Button,
    FormControlLabel,
    Checkbox
} from "@mui/material";


const SellerCustomerModal = ({

    open,

    customer,

    onClose,

    onSave

}) => {


    const initialState = {

        CustomerId: 0,

        SellerId: "",

        CustomerCode: "",

        CustomerName: "",

        ContactPerson: "",

        Email: "",

        Phone: "",

        GSTIN: "",

        AddressLine1: "",

        AddressLine2: "",

        City: "",

        State: "",

        Country: "",

        PostalCode: "",

        CreditLimit: 0,

        IsActive: true

    };


    const [formData, setFormData] =

        useState(initialState);



    useEffect(() => {


        if (customer) {


            setFormData({

                CustomerId:

                    customer.CustomerId || 0,

                SellerId:

                    customer.SellerId || "",

                CustomerCode:

                    customer.CustomerCode || "",

                CustomerName:

                    customer.CustomerName || "",

                ContactPerson:

                    customer.ContactPerson || "",

                Email:

                    customer.Email || "",

                Phone:

                    customer.Phone || "",

                GSTIN:

                    customer.GSTIN || "",

                AddressLine1:

                    customer.AddressLine1 || "",

                AddressLine2:

                    customer.AddressLine2 || "",

                City:

                    customer.City || "",

                State:

                    customer.State || "",

                Country:

                    customer.Country || "",

                PostalCode:

                    customer.PostalCode || "",

                CreditLimit:

                    customer.CreditLimit || 0,

                IsActive:

                    customer.IsActive ?? true

            });


        }

        else {


            setFormData(initialState);


        }


    }, [customer, open]);



    const handleChange = (e) => {


        const {

            name,

            value,

            checked,

            type

        } = e.target;


        setFormData(prev => ({


            ...prev,


            [name]:

                type === "checkbox"

                    ? checked

                    : value


        }));

    };



    const handleSubmit = () => {


        if (

            !formData.SellerId ||

            !formData.CustomerName.trim()

        ) {


            alert(

                "Seller ID and Customer Name are required."

            );


            return;


        }


        onSave({

            ...formData,

            CreditLimit:

                Number(

                    formData.CreditLimit || 0

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

                    formData.CustomerId

                        ? "Edit Customer"

                        : "Add Customer"

                }


            </DialogTitle>



            <DialogContent dividers>


                <Grid

                    container

                    spacing={2}

                    sx={{ mt: 0.5 }}

                >


                    <Grid item xs={12} md={4}>


                        <TextField

                            fullWidth

                            label="Seller ID"

                            name="SellerId"

                            type="number"

                            value={formData.SellerId}

                            onChange={handleChange}

                        />


                    </Grid>



                    <Grid item xs={12} md={4}>


                        <TextField

                            fullWidth

                            label="Customer Code"

                            name="CustomerCode"

                            value={formData.CustomerCode}

                            onChange={handleChange}

                        />


                    </Grid>



                    <Grid item xs={12} md={4}>


                        <TextField

                            fullWidth

                            label="Customer Name"

                            name="CustomerName"

                            value={formData.CustomerName}

                            onChange={handleChange}

                        />


                    </Grid>



                    <Grid item xs={12} md={6}>


                        <TextField

                            fullWidth

                            label="Contact Person"

                            name="ContactPerson"

                            value={formData.ContactPerson}

                            onChange={handleChange}

                        />


                    </Grid>



                    <Grid item xs={12} md={6}>


                        <TextField

                            fullWidth

                            label="Email"

                            name="Email"

                            type="email"

                            value={formData.Email}

                            onChange={handleChange}

                        />


                    </Grid>



                    <Grid item xs={12} md={6}>


                        <TextField

                            fullWidth

                            label="Phone"

                            name="Phone"

                            value={formData.Phone}

                            onChange={handleChange}

                        />


                    </Grid>



                    <Grid item xs={12} md={6}>


                        <TextField

                            fullWidth

                            label="GSTIN"

                            name="GSTIN"

                            value={formData.GSTIN}

                            onChange={handleChange}

                        />


                    </Grid>



                    <Grid item xs={12}>


                        <TextField

                            fullWidth

                            label="Address Line 1"

                            name="AddressLine1"

                            value={formData.AddressLine1}

                            onChange={handleChange}

                        />


                    </Grid>



                    <Grid item xs={12}>


                        <TextField

                            fullWidth

                            label="Address Line 2"

                            name="AddressLine2"

                            value={formData.AddressLine2}

                            onChange={handleChange}

                        />


                    </Grid>



                    <Grid item xs={12} md={4}>


                        <TextField

                            fullWidth

                            label="City"

                            name="City"

                            value={formData.City}

                            onChange={handleChange}

                        />


                    </Grid>



                    <Grid item xs={12} md={4}>


                        <TextField

                            fullWidth

                            label="State"

                            name="State"

                            value={formData.State}

                            onChange={handleChange}

                        />


                    </Grid>



                    <Grid item xs={12} md={4}>


                        <TextField

                            fullWidth

                            label="Country"

                            name="Country"

                            value={formData.Country}

                            onChange={handleChange}

                        />


                    </Grid>



                    <Grid item xs={12} md={4}>


                        <TextField

                            fullWidth

                            label="Postal Code"

                            name="PostalCode"

                            value={formData.PostalCode}

                            onChange={handleChange}

                        />


                    </Grid>



                    <Grid item xs={12} md={4}>


                        <TextField

                            fullWidth

                            label="Credit Limit"

                            name="CreditLimit"

                            type="number"

                            value={formData.CreditLimit}

                            onChange={handleChange}

                        />


                    </Grid>



                    <Grid item xs={12}>


                        <FormControlLabel

                            control={

                                <Checkbox

                                    name="IsActive"

                                    checked={formData.IsActive}

                                    onChange={handleChange}

                                />

                            }

                            label="Active"

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

                        formData.CustomerId

                            ? "Update"

                            : "Save"

                    }

                </Button>


            </DialogActions>


        </Dialog>

    );

};


export default SellerCustomerModal;