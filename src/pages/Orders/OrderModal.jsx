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
    Button,
    MenuItem
} from "@mui/material";


// =========================================================
// INITIAL STATE
// =========================================================

const initialState = {

    OrderId: 0,

    SellerId: "",

    CustomerId: "",

    OrderNumber: "",

    OrderDate: "",

    OrderStatus: "Pending",

    TotalAmount: ""

};


// =========================================================
// COMPONENT
// =========================================================

const OrderModal = ({

    open,

    order,

    onClose,

    onSave

}) => {


    // =====================================================
    // STATE
    // =====================================================

    const [

        formData,

        setFormData

    ] = useState(initialState);


    // =====================================================
    // LOAD ORDER INTO FORM
    // =====================================================

    useEffect(() => {

        if (!open) {

            return;

        }


        if (order) {

            setFormData({

                OrderId:
                    order.OrderId ??
                    order.orderId ??
                    0,


                SellerId:
                    order.SellerId ??
                    order.sellerId ??
                    "",


                CustomerId:
                    order.CustomerId ??
                    order.customerId ??
                    "",


                OrderNumber:
                    order.OrderNumber ??
                    order.orderNumber ??
                    "",


                OrderDate:

                    (
                        order.OrderDate ??
                        order.orderDate
                    )

                        ? (
                            order.OrderDate ??
                            order.orderDate
                        ).substring(0, 10)

                        : "",


                OrderStatus:
                    order.OrderStatus ??
                    order.orderStatus ??
                    "Pending",


                TotalAmount:
                    order.TotalAmount ??
                    order.totalAmount ??
                    ""

            });

        }
        else {

            setFormData(initialState);

        }

    }, [

        order,

        open

    ]);


    // =====================================================
    // HANDLE CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {

            name,

            value

        } = event.target;


        setFormData(prev => ({

            ...prev,

            [name]: value

        }));

    };


    // =====================================================
    // HANDLE SUBMIT
    // =====================================================

    const handleSubmit = () => {


        // ---------------------------------------------
        // VALIDATION
        // ---------------------------------------------

        if (!formData.SellerId) {

            alert(
                "Seller ID is required."
            );

            return;

        }


        if (!formData.CustomerId) {

            alert(
                "Customer ID is required."
            );

            return;

        }


        if (!formData.OrderNumber.trim()) {

            alert(
                "Order Number is required."
            );

            return;

        }


        if (!formData.OrderDate) {

            alert(
                "Order Date is required."
            );

            return;

        }


        if (!formData.OrderStatus) {

            alert(
                "Order Status is required."
            );

            return;

        }


        // ---------------------------------------------
        // PREPARE PAYLOAD
        // ---------------------------------------------

        const payload = {

            ...formData,


            OrderId:
                Number(formData.OrderId || 0),


            SellerId:
                Number(formData.SellerId),


            CustomerId:
                Number(formData.CustomerId),


            OrderNumber:
                formData.OrderNumber.trim(),


            OrderDate:
                formData.OrderDate,


            OrderStatus:
                formData.OrderStatus,


            TotalAmount:
                Number(
                    formData.TotalAmount || 0
                )

        };


        console.log(
            "ORDER PAYLOAD:",
            payload
        );


        // ---------------------------------------------
        // SEND TO PARENT
        // ---------------------------------------------

        onSave(payload);

    };


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const handleClose = () => {

        setFormData(initialState);

        onClose();

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Dialog

            open={open}

            onClose={handleClose}

            fullWidth

            maxWidth="md"

        >


            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle>

                {

                    formData.OrderId

                        ? "Edit Order"

                        : "Add Order"

                }

            </DialogTitle>


            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent dividers>

                <Grid

                    container

                    spacing={2}

                    sx={{
                        mt: 1
                    }}

                >


                    {/* =========================================
                        SELLER ID
                    ========================================= */}

                    <Grid

                        item

                        xs={12}

                        md={6}

                    >

                        <TextField

                            fullWidth

                            required

                            label="Seller ID"

                            name="SellerId"

                            type="number"

                            value={
                                formData.SellerId
                            }

                            onChange={
                                handleChange
                            }

                        />

                    </Grid>


                    {/* =========================================
                        CUSTOMER ID
                    ========================================= */}

                    <Grid

                        item

                        xs={12}

                        md={6}

                    >

                        <TextField

                            fullWidth

                            required

                            label="Customer ID"

                            name="CustomerId"

                            type="number"

                            value={
                                formData.CustomerId
                            }

                            onChange={
                                handleChange
                            }

                        />

                    </Grid>


                    {/* =========================================
                        ORDER NUMBER
                    ========================================= */}

                    <Grid

                        item

                        xs={12}

                        md={6}

                    >

                        <TextField

                            fullWidth

                            required

                            label="Order Number"

                            name="OrderNumber"

                            value={
                                formData.OrderNumber
                            }

                            onChange={
                                handleChange
                            }

                        />

                    </Grid>


                    {/* =========================================
                        ORDER DATE
                    ========================================= */}

                    <Grid

                        item

                        xs={12}

                        md={6}

                    >

                        <TextField

                            fullWidth

                            required

                            label="Order Date"

                            name="OrderDate"

                            type="date"

                            InputLabelProps={{
                                shrink: true
                            }}

                            value={
                                formData.OrderDate
                            }

                            onChange={
                                handleChange
                            }

                        />

                    </Grid>


                    {/* =========================================
                        ORDER STATUS
                    ========================================= */}

                    <Grid

                        item

                        xs={12}

                        md={6}

                    >

                        <TextField

                            select

                            fullWidth

                            required

                            label="Order Status"

                            name="OrderStatus"

                            value={
                                formData.OrderStatus
                            }

                            onChange={
                                handleChange
                            }

                        >

                            <MenuItem value="Pending">
                                Pending
                            </MenuItem>

                            <MenuItem value="Confirmed">
                                Confirmed
                            </MenuItem>

                            <MenuItem value="Processing">
                                Processing
                            </MenuItem>

                            <MenuItem value="Packed">
                                Packed
                            </MenuItem>

                            <MenuItem value="Shipped">
                                Shipped
                            </MenuItem>

                            <MenuItem value="Delivered">
                                Delivered
                            </MenuItem>

                            <MenuItem value="Cancelled">
                                Cancelled
                            </MenuItem>

                            <MenuItem value="Returned">
                                Returned
                            </MenuItem>

                        </TextField>

                    </Grid>


                    {/* =========================================
                        TOTAL AMOUNT
                    ========================================= */}

                    <Grid

                        item

                        xs={12}

                        md={6}

                    >

                        <TextField

                            fullWidth

                            required

                            label="Total Amount"

                            name="TotalAmount"

                            type="number"

                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}

                            value={
                                formData.TotalAmount
                            }

                            onChange={
                                handleChange
                            }

                        />

                    </Grid>

                </Grid>

            </DialogContent>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <DialogActions>

                <Button

                    variant="outlined"

                    onClick={handleClose}

                >

                    Cancel

                </Button>


                <Button

                    variant="contained"

                    onClick={handleSubmit}

                >

                    {

                        formData.OrderId

                            ? "Update"

                            : "Save"

                    }

                </Button>

            </DialogActions>

        </Dialog>

    );

};


export default OrderModal;
