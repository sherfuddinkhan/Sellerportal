import React, { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel
} from "@mui/material";

const ProductPriceModal = ({
    open,
    productPrice,
    onClose,
    onSave
}) => {

    const [formData, setFormData] = useState({

        ProductPriceId: 0,

        ProductId: "",

        SellerId: "",

        PriceType: "",

        Price: "",

        Currency: "INR",

        EffectiveFrom: "",

        EffectiveTo: "",

        IsActive: true

    });


    useEffect(() => {

        if (productPrice) {

            setFormData({

                ProductPriceId:
                    productPrice.ProductPriceId || 0,

                ProductId:
                    productPrice.ProductId || "",

                SellerId:
                    productPrice.SellerId || "",

                PriceType:
                    productPrice.PriceType || "",

                Price:
                    productPrice.Price || "",

                Currency:
                    productPrice.Currency || "INR",

                EffectiveFrom:
                    productPrice.EffectiveFrom
                        ? productPrice.EffectiveFrom.substring(0, 10)
                        : "",

                EffectiveTo:
                    productPrice.EffectiveTo
                        ? productPrice.EffectiveTo.substring(0, 10)
                        : "",

                IsActive:
                    productPrice.IsActive ?? true

            });

        }

        else {

            setFormData({

                ProductPriceId: 0,

                ProductId: "",

                SellerId: "",

                PriceType: "",

                Price: "",

                Currency: "INR",

                EffectiveFrom: "",

                EffectiveTo: "",

                IsActive: true

            });

        }

    }, [productPrice, open]);



    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormData({

            ...formData,

            [name]: value

        });

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
                    productPrice

                        ?

                        "Edit Product Price"

                        :

                        "Add Product Price"
                }

            </DialogTitle>


            <Divider />


            <DialogContent sx={{ mt: 2 }}>


                <Grid
                    container
                    spacing={3}
                >


                    <Grid item xs={12} md={6}>

                        <TextField

                            fullWidth

                            label="Product ID"

                            name="ProductId"

                            value={formData.ProductId}

                            onChange={handleChange}

                        />

                    </Grid>


                    <Grid item xs={12} md={6}>

                        <TextField

                            fullWidth

                            label="Seller ID"

                            name="SellerId"

                            value={formData.SellerId}

                            onChange={handleChange}

                        />

                    </Grid>


                    <Grid item xs={12} md={6}>

                        <TextField

                            fullWidth

                            label="Price Type"

                            name="PriceType"

                            value={formData.PriceType}

                            onChange={handleChange}

                        />

                    </Grid>


                    <Grid item xs={12} md={6}>

                        <TextField

                            fullWidth

                            label="Price"

                            type="number"

                            name="Price"

                            value={formData.Price}

                            onChange={handleChange}

                        />

                    </Grid>


                    <Grid item xs={12} md={6}>

                        <FormControl fullWidth>

                            <InputLabel>

                                Currency

                            </InputLabel>


                            <Select

                                name="Currency"

                                value={formData.Currency}

                                label="Currency"

                                onChange={handleChange}

                            >

                                <MenuItem value="INR">

                                    INR

                                </MenuItem>


                                <MenuItem value="USD">

                                    USD

                                </MenuItem>


                                <MenuItem value="EUR">

                                    EUR

                                </MenuItem>


                            </Select>


                        </FormControl>


                    </Grid>


                    <Grid item xs={12} md={6}>

                        <TextField

                            fullWidth

                            type="date"

                            label="Effective From"

                            name="EffectiveFrom"

                            InputLabelProps={{
                                shrink: true
                            }}

                            value={formData.EffectiveFrom}

                            onChange={handleChange}

                        />

                    </Grid>


                    <Grid item xs={12} md={6}>

                        <TextField

                            fullWidth

                            type="date"

                            label="Effective To"

                            name="EffectiveTo"

                            InputLabelProps={{
                                shrink: true
                            }}

                            value={formData.EffectiveTo}

                            onChange={handleChange}

                        />

                    </Grid>


                    <Grid item xs={12} md={6}>

                        <FormControlLabel

                            control={

                                <Switch

                                    checked={
                                        formData.IsActive
                                    }

                                    onChange={(e) =>

                                        setFormData({

                                            ...formData,

                                            IsActive:
                                                e.target.checked

                                        })

                                    }

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

                    Save

                </Button>


            </DialogActions>


        </Dialog>

    );

};


export default ProductPriceModal;