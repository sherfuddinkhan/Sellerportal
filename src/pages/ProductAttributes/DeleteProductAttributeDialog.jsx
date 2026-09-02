// =========================================================
// DeleteProductAttributeDialog.jsx
// Delete Product Attribute Confirmation Dialog
// =========================================================

import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Divider,
    Box
} from "@mui/material";


// =========================================================
// COMPONENT
// =========================================================

const DeleteProductAttributeDialog = ({
    open,
    attribute,
    onClose,
    onDeleted
}) => {


    // =====================================================
    // NO ATTRIBUTE
    // =====================================================

    if (!attribute) {
        return null;
    }


    // =====================================================
    // SUPPORT BOTH JSON NAMING STYLES
    // =====================================================

    const attributeId =
        attribute.productAttributeId ??
        attribute.ProductAttributeId;

    const productId =
        attribute.productId ??
        attribute.ProductId;

    const attributeName =
        attribute.attributeName ??
        attribute.AttributeName;

    const attributeValue =
        attribute.attributeValue ??
        attribute.AttributeValue;

    const attributeType =
        attribute.attributeType ??
        attribute.AttributeType;


    // =====================================================
    // DELETE HANDLER
    // =====================================================

    const handleDelete = () => {

        if (!attributeId) {
            return;
        }

        onDeleted?.(attributeId);
    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle
                sx={{
                    fontWeight: "bold"
                }}
            >
                Delete Product Attribute
            </DialogTitle>


            <Divider />


            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent
                sx={{
                    mt: 2
                }}
            >

                <Typography>
                    Are you sure you want to delete this Product
                    Attribute?
                </Typography>


                {/* ATTRIBUTE DETAILS */}

                <Box
                    sx={{
                        mt: 2
                    }}
                >

                    {/* ATTRIBUTE ID */}

                    <Typography
                        sx={{
                            mb: 0.5
                        }}
                    >
                        <strong>Attribute ID:</strong>{" "}
                        {attributeId ?? "-"}
                    </Typography>


                    {/* PRODUCT ID */}

                    <Typography
                        sx={{
                            mb: 0.5
                        }}
                    >
                        <strong>Product ID:</strong>{" "}
                        {productId ?? "-"}
                    </Typography>


                    {/* ATTRIBUTE NAME */}

                    <Typography
                        sx={{
                            mb: 0.5
                        }}
                    >
                        <strong>Attribute Name:</strong>{" "}
                        {attributeName || "-"}
                    </Typography>


                    {/* ATTRIBUTE VALUE */}

                    <Typography
                        sx={{
                            mb: 0.5
                        }}
                    >
                        <strong>Attribute Value:</strong>{" "}
                        {attributeValue || "-"}
                    </Typography>


                    {/* ATTRIBUTE TYPE */}

                    <Typography>
                        <strong>Attribute Type:</strong>{" "}
                        {attributeType || "-"}
                    </Typography>

                </Box>

            </DialogContent>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2
                }}
            >

                <Button
                    variant="outlined"
                    onClick={() => onClose?.()}
                >
                    Cancel
                </Button>


                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                    disabled={!attributeId}
                >
                    Delete
                </Button>

            </DialogActions>

        </Dialog>
    );
};


export default DeleteProductAttributeDialog;
