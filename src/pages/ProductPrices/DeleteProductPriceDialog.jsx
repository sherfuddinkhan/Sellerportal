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

const DeleteProductPriceDialog = ({

    open,

    productPrice,

    onClose,

    onDeleted

}) => {


    if (!productPrice) return null;


    const handleDelete = () => {

        onDeleted(productPrice.ProductPriceId);

    };


    return (

        <Dialog

            open={open}

            onClose={onClose}

            fullWidth

            maxWidth="sm"

        >

            <DialogTitle>

                Delete Product Price

            </DialogTitle>


            <Divider />


            <DialogContent sx={{ mt: 2 }}>


                <Typography>

                    Are you sure you want to delete this product price?

                </Typography>


                <Typography
                    sx={{ mt: 2 }}
                    fontWeight="bold"
                >

                    Price Type :
                    {" "}
                    {productPrice.PriceType || "-"}

                </Typography>


                <Typography>

                    Price :
                    {" "}
                    {productPrice.Price || 0}

                    {" "}

                    {productPrice.Currency || ""}

                </Typography>


                <Typography>

                    Product ID :
                    {" "}
                    {productPrice.ProductId}

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


export default DeleteProductPriceDialog;