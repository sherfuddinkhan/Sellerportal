import React, {
    useEffect,
    useState
} from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    TextField,
    Button
} from "@mui/material";


const OrderItemModal = ({
    open,
    item,
    onClose,
    onSave
}) => {

    // =====================================================
    // Initial State
    // =====================================================

    const initialState = {
        OrderItemId: 0,
        OrderId: "",
        ProductId: "",
        Quantity: "",
        UnitPrice: "",
        TotalAmount: ""
    };


    const [
        formData,
        setFormData
    ] = useState(initialState);


    // =====================================================
    // Load Item For Edit
    // =====================================================

    useEffect(() => {

        if (item) {

            setFormData({
                OrderItemId:
                    item.OrderItemId ??
                    item.orderItemId ??
                    0,

                OrderId:
                    item.OrderId ??
                    item.orderId ??
                    "",

                ProductId:
                    item.ProductId ??
                    item.productId ??
                    "",

                Quantity:
                    item.Quantity ??
                    item.quantity ??
                    "",

                UnitPrice:
                    item.UnitPrice ??
                    item.unitPrice ??
                    "",

                TotalAmount:
                    item.TotalAmount ??
                    item.totalAmount ??
                    ""
            });

        } else {

            setFormData(initialState);

        }

    }, [item, open]);


    // =====================================================
    // Handle Input Change
    // =====================================================

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


    // =====================================================
    // Calculate Total
    // =====================================================

    const calculateTotal = () => {

        const quantity = Number(
            formData.Quantity || 0
        );

        const unitPrice = Number(
            formData.UnitPrice || 0
        );


        return quantity * unitPrice;

    };


    // =====================================================
    // Submit
    // =====================================================

    const handleSubmit = () => {

        const orderId =
            Number(formData.OrderId);

        const productId =
            Number(formData.ProductId);

        const quantity =
            Number(formData.Quantity || 0);

        const unitPrice =
            Number(formData.UnitPrice || 0);


        // -------------------------------------------------
        // Validation
        // -------------------------------------------------

        if (!orderId) {

            alert(
                "Order ID is required."
            );

            return;

        }


        if (!productId) {

            alert(
                "Product ID is required."
            );

            return;

        }


        if (quantity <= 0) {

            alert(
                "Quantity must be greater than 0."
            );

            return;

        }


        if (unitPrice < 0) {

            alert(
                "Unit Price cannot be negative."
            );

            return;

        }


        // -------------------------------------------------
        // Payload
        // -------------------------------------------------

        const payload = {

            OrderItemId:
                Number(
                    formData.OrderItemId || 0
                ),

            OrderId:
                orderId,

            ProductId:
                productId,

            Quantity:
                quantity,

            UnitPrice:
                unitPrice,

            TotalAmount:
                quantity * unitPrice

        };


        // Send data to OrderItemList

        onSave(payload);

    };


    // =====================================================
    // Render
    // =====================================================

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >

            <DialogTitle>

                {formData.OrderItemId
                    ? "Edit Order Item"
                    : "Add Order Item"}

            </DialogTitle>


            <DialogContent dividers>

                <Grid
                    container
                    spacing={2}
                    sx={{ mt: 1 }}
                >

                    {/* =====================================
                        Order ID
                    ====================================== */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            label="Order ID"
                            name="OrderId"
                            type="number"
                            value={
                                formData.OrderId
                            }
                            onChange={
                                handleChange
                            }
                            inputProps={{
                                min: 1
                            }}
                        />

                    </Grid>


                    {/* =====================================
                        Product ID
                    ====================================== */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            label="Product ID"
                            name="ProductId"
                            type="number"
                            value={
                                formData.ProductId
                            }
                            onChange={
                                handleChange
                            }
                            inputProps={{
                                min: 1
                            }}
                        />

                    </Grid>


                    {/* =====================================
                        Quantity
                    ====================================== */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <TextField
                            fullWidth
                            label="Quantity"
                            name="Quantity"
                            type="number"
                            value={
                                formData.Quantity
                            }
                            onChange={
                                handleChange
                            }
                            inputProps={{
                                min: 1
                            }}
                        />

                    </Grid>


                    {/* =====================================
                        Unit Price
                    ====================================== */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <TextField
                            fullWidth
                            label="Unit Price"
                            name="UnitPrice"
                            type="number"
                            value={
                                formData.UnitPrice
                            }
                            onChange={
                                handleChange
                            }
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                        />

                    </Grid>


                    {/* =====================================
                        Total Amount
                    ====================================== */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <TextField
                            fullWidth
                            label="Total Amount"
                            value={
                                calculateTotal()
                            }
                            InputProps={{
                                readOnly: true
                            }}
                        />

                    </Grid>

                </Grid>

            </DialogContent>


            {/* =============================================
                Actions
            ============================================== */}

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
                    {formData.OrderItemId
                        ? "Update"
                        : "Save"}
                </Button>

            </DialogActions>

        </Dialog>
    );
};


export default OrderItemModal;
