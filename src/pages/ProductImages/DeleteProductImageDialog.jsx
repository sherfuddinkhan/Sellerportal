import React from "react";
import {Dialog,DialogTitle,DialogContent,DialogActions,Button,Typography,Divider} from "@mui/material";

const DeleteProductImageDialog = ({
    open,
    image,
    onClose,
    onDeleted
}) => {
    if (!image) return null;
    const handleDelete = () => {
        onDeleted(
            image.ProductImageId
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
                Delete Product Image
            </DialogTitle>
            <Divider />
            <DialogContent
                sx={{mt:2}}
            >
                <Typography>
                    Are you sure you want to delete this product image?
                </Typography>
                <Typography
                    sx={{mt:2}}
                    fontWeight="bold"
                >
                    Image ID :
                    {" "}
                    {
                        image.ProductImageId || "-"
                    }
                </Typography>
                <Typography>
                    Product ID :
                    {" "}
                    {
                        image.ProductId || "-"
                    }
                </Typography>
                <Typography>
                    Image Name :
                    {" "}
                    {
                        image.ImageName || "-"
                    }
                </Typography>
                <Typography>
                    Image Type :
                    {" "}
                    {
                        image.ImageType || "-"
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

export default DeleteProductImageDialog;