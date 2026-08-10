import React from "react";
import {Dialog, DialogTitle,DialogContent,DialogActions,Button,Typography,Divider} from "@mui/material";

const DeleteProductAttributeDialog = ({
    open,
    attribute,
    onClose,
    onDeleted
}) => {
    if (!attribute) return null;
    const handleDelete = () => {
        onDeleted(attribute.ProductAttributeId);
    };
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                Delete Product Attribute
            </DialogTitle>
            <Divider />
            <DialogContent
                sx={{ mt: 2 }}
            >
                <Typography>
                    Are you sure you want to delete this Product Attribute?
                </Typography>
                <Typography
                    sx={{ mt: 2 }}
                    fontWeight="bold"
                >
                    Attribute ID :
                    {" "}
                    {
                        attribute.ProductAttributeId || "-"
                    }
                </Typography>
                <Typography>
                    Product ID :
                    {" "}
                    {
                        attribute.ProductId || "-"
                    }
                </Typography>
                <Typography>
                    Attribute Name :
                    {" "}
                    {
                        attribute.AttributeName || "-"
                    }
                </Typography>
                <Typography>
                    Attribute Value :
                    {" "}
                    {
                        attribute.AttributeValue || "-"
                    }
                </Typography>
                <Typography>
                    Attribute Type :
                    {" "}
                    {
                        attribute.AttributeType || "-"
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

export default DeleteProductAttributeDialog;