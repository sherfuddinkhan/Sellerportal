import React, { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    MenuItem,
    CircularProgress,
    IconButton,
    Typography
} from "@mui/material";

import {
    Close,
    Save
} from "@mui/icons-material";


/* =========================================================
   WISHLIST ITEM MODAL
========================================================= */

const WishlistItemModal = ({
    open,
    onClose,
    onSave,

    item = null,
    wishlistItem = null,

    loading = false,

    wishlistOptions = [],
    productOptions = []
}) => {

    const selectedItem = item || wishlistItem;


    /* =====================================================
       FORM STATE
    ===================================================== */

    const [formData, setFormData] = useState({
        wishlistItemId: "",
        wishlistId: "",
        productId: "",
        quantity: 1,
        price: "",
        status: "Active"
    });


    /* =====================================================
       LOAD ITEM
    ===================================================== */

    useEffect(() => {

        if (selectedItem) {

            setFormData({
                wishlistItemId:
                    selectedItem.wishlistItemId ??
                    selectedItem.WishlistItemId ??
                    "",

                wishlistId:
                    selectedItem.wishlistId ??
                    selectedItem.WishlistId ??
                    "",

                productId:
                    selectedItem.productId ??
                    selectedItem.ProductId ??
                    "",

                quantity:
                    selectedItem.quantity ??
                    selectedItem.Quantity ??
                    1,

                price:
                    selectedItem.price ??
                    selectedItem.Price ??
                    "",

                status:
                    selectedItem.status ??
                    selectedItem.Status ??
                    "Active"
            });

        } else {

            setFormData({
                wishlistItemId: "",
                wishlistId: "",
                productId: "",
                quantity: 1,
                price: "",
                status: "Active"
            });

        }

    }, [selectedItem, open]);


    /* =====================================================
       CHANGE HANDLER
    ===================================================== */

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };


    /* =====================================================
       SUBMIT
    ===================================================== */

    const handleSubmit = (event) => {

        event.preventDefault();

        const payload = {
            ...formData,

            wishlistItemId:
                formData.wishlistItemId
                    ? Number(formData.wishlistItemId)
                    : undefined,

            wishlistId:
                formData.wishlistId
                    ? Number(formData.wishlistId)
                    : null,

            productId:
                formData.productId
                    ? Number(formData.productId)
                    : null,

            quantity:
                formData.quantity
                    ? Number(formData.quantity)
                    : 0,

            price:
                formData.price
                    ? Number(formData.price)
                    : 0
        };

        if (typeof onSave === "function") {
            onSave(payload);
        }
    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Dialog
            open={Boolean(open)}
            onClose={loading ? undefined : onClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight={600}
                >
                    {selectedItem
                        ? "Edit Wishlist Item"
                        : "Add Wishlist Item"}
                </Typography>

                <IconButton
                    onClick={onClose}
                    disabled={loading}
                >
                    <Close />
                </IconButton>

            </DialogTitle>


            <form onSubmit={handleSubmit}>

                <DialogContent dividers>

                    <Grid
                        container
                        spacing={2}
                    >

                        {/* =================================================
                           WISHLIST
                        ================================================= */}

                        <Grid item xs={12}>

                            {wishlistOptions.length > 0 ? (

                                <TextField
                                    fullWidth
                                    select
                                    label="Wishlist"
                                    name="wishlistId"
                                    value={formData.wishlistId}
                                    onChange={handleChange}
                                    required
                                >

                                    {wishlistOptions.map((wishlist) => {

                                        const id =
                                            wishlist.wishlistId ??
                                            wishlist.WishlistId ??
                                            wishlist.id;

                                        const label =
                                            wishlist.wishlistName ??
                                            wishlist.WishlistName ??
                                            `Wishlist #${id}`;

                                        return (
                                            <MenuItem
                                                key={id}
                                                value={id}
                                            >
                                                {label}
                                            </MenuItem>
                                        );

                                    })}

                                </TextField>

                            ) : (

                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Wishlist ID"
                                    name="wishlistId"
                                    value={formData.wishlistId}
                                    onChange={handleChange}
                                    required
                                />

                            )}

                        </Grid>


                        {/* =================================================
                           PRODUCT
                        ================================================= */}

                        <Grid item xs={12}>

                            {productOptions.length > 0 ? (

                                <TextField
                                    fullWidth
                                    select
                                    label="Product"
                                    name="productId"
                                    value={formData.productId}
                                    onChange={handleChange}
                                    required
                                >

                                    {productOptions.map((product) => {

                                        const id =
                                            product.productId ??
                                            product.ProductId ??
                                            product.id;

                                        const name =
                                            product.productName ??
                                            product.ProductName ??
                                            product.name ??
                                            `Product #${id}`;

                                        return (
                                            <MenuItem
                                                key={id}
                                                value={id}
                                            >
                                                {name}
                                            </MenuItem>
                                        );

                                    })}

                                </TextField>

                            ) : (

                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Product ID"
                                    name="productId"
                                    value={formData.productId}
                                    onChange={handleChange}
                                    required
                                />

                            )}

                        </Grid>


                        {/* =================================================
                           QUANTITY
                        ================================================= */}

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                type="number"
                                label="Quantity"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                inputProps={{
                                    min: 1
                                }}
                                required
                            />

                        </Grid>


                        {/* =================================================
                           PRICE
                        ================================================= */}

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                type="number"
                                label="Price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                inputProps={{
                                    min: 0,
                                    step: "0.01"
                                }}
                            />

                        </Grid>


                        {/* =================================================
                           STATUS
                        ================================================= */}

                        <Grid item xs={12}>

                            <TextField
                                fullWidth
                                select
                                label="Status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >

                                <MenuItem value="Active">
                                    Active
                                </MenuItem>

                                <MenuItem value="Inactive">
                                    Inactive
                                </MenuItem>

                                <MenuItem value="Removed">
                                    Removed
                                </MenuItem>

                            </TextField>

                        </Grid>

                    </Grid>

                </DialogContent>


                <DialogActions
                    sx={{
                        px: 3,
                        py: 2
                    }}
                >

                    <Button
                        variant="outlined"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>


                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={
                            loading
                                ? (
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                )
                                : <Save />
                        }
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : selectedItem
                                ? "Update"
                                : "Save"}
                    </Button>

                </DialogActions>

            </form>

        </Dialog>
    );
};


export default WishlistItemModal;