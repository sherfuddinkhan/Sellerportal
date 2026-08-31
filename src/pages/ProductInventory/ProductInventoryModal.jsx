import React, {useEffect,useState} from "react";

import {Dialog,DialogTitle,DialogContent, DialogActions,Button, Grid,TextField,Divider,FormControl,InputLabel,Select,MenuItem,Switch,FormControlLabel} from "@mui/material";
const ProductInventoryModal = ({
    open,
    inventory,
    onClose,
    onSave
}) => {
    const [formData, setFormData] = useState({
        ProductInventoryId: 0,
        ProductId: "",
        SellerId: "",
        WarehouseId: "",
        Quantity: 0,
        AvailableQuantity: 0,
        ReservedQuantity: 0,
        ReorderLevel: 0,
        MinStockLevel: 0,
        MaxStockLevel: 0,
        StockStatus: "Available",
        IsActive: true
    });
    useEffect(() => {
        if (inventory) {
            setFormData({
                ProductInventoryId: inventory.ProductInventoryId || 0,
                ProductId: inventory.ProductId || "",
                SellerId: inventory.SellerId || "",
                WarehouseId: inventory.WarehouseId || "",
                Quantity:inventory.Quantity || 0,
                AvailableQuantity:inventory.AvailableQuantity || 0,
                ReservedQuantity: inventory.ReservedQuantity || 0,
                ReorderLevel:inventory.ReorderLevel || 0,
                MinStockLevel:inventory.MinStockLevel || 0,
                MaxStockLevel:inventory.MaxStockLevel || 0,
                StockStatus:inventory.StockStatus || "Available",
                IsActive:inventory.IsActive ?? true
            });
        }
        else {
            setFormData({
                ProductInventoryId: 0,
                ProductId: "",
                SellerId: "",
                WarehouseId: "",
                Quantity: 0,
                AvailableQuantity: 0,
                ReservedQuantity: 0,
                ReorderLevel: 0,
                MinStockLevel: 0,
                MaxStockLevel: 0,
                StockStatus: "Available",
                IsActive: true
            });
        }
    }, [inventory, open]);
    const handleChange = (e) => {
        const {name,value} = e.target;
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

                    inventory

                        ?

                        "Edit Product Inventory"

                        :

                        "Add Product Inventory"

                }


            </DialogTitle>



            <Divider />



            <DialogContent sx={{ mt:2 }}>


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

                            label="Warehouse ID"

                            name="WarehouseId"

                            value={formData.WarehouseId}

                            onChange={handleChange}

                        />


                    </Grid>




                    <Grid item xs={12} md={6}>


                        <TextField

                            fullWidth

                            type="number"

                            label="Quantity"

                            name="Quantity"

                            value={formData.Quantity}

                            onChange={handleChange}

                        />


                    </Grid>




                    <Grid item xs={12} md={6}>


                        <TextField

                            fullWidth

                            type="number"

                            label="Available Quantity"

                            name="AvailableQuantity"

                            value={formData.AvailableQuantity}

                            onChange={handleChange}

                        />


                    </Grid>




                    <Grid item xs={12} md={6}>


                        <TextField

                            fullWidth

                            type="number"

                            label="Reserved Quantity"

                            name="ReservedQuantity"

                            value={formData.ReservedQuantity}

                            onChange={handleChange}

                        />


                    </Grid>




                    <Grid item xs={12} md={4}>


                        <TextField

                            fullWidth

                            type="number"

                            label="Reorder Level"

                            name="ReorderLevel"

                            value={formData.ReorderLevel}

                            onChange={handleChange}

                        />


                    </Grid>




                    <Grid item xs={12} md={4}>


                        <TextField

                            fullWidth

                            type="number"

                            label="Minimum Stock"

                            name="MinStockLevel"

                            value={formData.MinStockLevel}

                            onChange={handleChange}

                        />


                    </Grid>




                    <Grid item xs={12} md={4}>


                        <TextField

                            fullWidth

                            type="number"

                            label="Maximum Stock"

                            name="MaxStockLevel"

                            value={formData.MaxStockLevel}

                            onChange={handleChange}

                        />


                    </Grid>




                    <Grid item xs={12} md={6}>


                        <FormControl fullWidth>


                            <InputLabel>

                                Stock Status

                            </InputLabel>



                            <Select

                                name="StockStatus"

                                value={formData.StockStatus}

                                label="Stock Status"

                                onChange={handleChange}

                            >


                                <MenuItem value="Available">

                                    Available

                                </MenuItem>


                                <MenuItem value="Low Stock">

                                    Low Stock

                                </MenuItem>


                                <MenuItem value="Out of Stock">

                                    Out of Stock

                                </MenuItem>


                            </Select>


                        </FormControl>


                    </Grid>




                    <Grid item xs={12} md={6}>


                        <FormControlLabel


                            control={

                                <Switch

                                    checked={
                                        formData.IsActive
                                    }

                                    onChange={(e)=>

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


export default ProductInventoryModal;