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


/* =========================================================
   INITIAL FORM STATE
========================================================= */

const initialState = {

    PurchaseOrderId: 0,

    SellerId: "",

    SupplierId: "",

    PurchaseOrderNumber: "",

    OrderDate: "",

    ExpectedDeliveryDate: "",

    Status: "Pending",

    TotalAmount: "",

    Remarks: ""

};


/* =========================================================
   STATUS OPTIONS
========================================================= */

const statusOptions = [

    "Pending",

    "Processing",

    "Completed",

    "Cancelled"

];


/* =========================================================
   DATE FORMATTER
========================================================= */

const formatDate = (value) => {

    if (!value) {
        return "";
    }

    try {

        return String(value).substring(0, 10);

    }
    catch {

        return "";

    }

};


/* =========================================================
   PURCHASE ORDER MODAL
========================================================= */

const PurchaseOrderModal = ({

    open,

    item,

    onClose,

    onSave

}) => {


    /* =====================================================
       STATE
    ===================================================== */

    const [formData, setFormData] =

        useState(initialState);


    const [errors, setErrors] =

        useState({});


    /* =====================================================
       LOAD ITEM INTO FORM
    ===================================================== */

    useEffect(() => {

        if (item) {

            setFormData({

                PurchaseOrderId:
                    item.PurchaseOrderId ??
                    item.purchaseOrderId ??
                    0,

                SellerId:
                    item.SellerId ??
                    item.sellerId ??
                    "",

                SupplierId:
                    item.SupplierId ??
                    item.supplierId ??
                    "",

                PurchaseOrderNumber:
                    item.PurchaseOrderNumber ??
                    item.purchaseOrderNumber ??
                    "",

                OrderDate:
                    formatDate(
                        item.OrderDate ??
                        item.orderDate
                    ),

                ExpectedDeliveryDate:
                    formatDate(
                        item.ExpectedDeliveryDate ??
                        item.expectedDeliveryDate
                    ),

                Status:
                    item.Status ??
                    item.status ??
                    "Pending",

                TotalAmount:
                    item.TotalAmount ??
                    item.totalAmount ??
                    "",

                Remarks:
                    item.Remarks ??
                    item.remarks ??
                    ""

            });

        }
        else {

            setFormData({
                ...initialState
            });

        }

        setErrors({});

    }, [item, open]);


    /* =====================================================
       HANDLE INPUT CHANGE
    ===================================================== */

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData((prev) => ({

            ...prev,

            [name]: value

        }));


        setErrors((prev) => ({

            ...prev,

            [name]: ""

        }));

    };


    /* =====================================================
       VALIDATION
    ===================================================== */

    const validateForm = () => {

        const newErrors = {};


        /* -------------------------------------------------
           SELLER ID
        ------------------------------------------------- */

        if (!formData.SellerId) {

            newErrors.SellerId =
                "Seller ID is required.";

        }
        else if (
            Number(formData.SellerId) <= 0
        ) {

            newErrors.SellerId =
                "Seller ID must be greater than 0.";

        }


        /* -------------------------------------------------
           SUPPLIER ID
        ------------------------------------------------- */

        if (!formData.SupplierId) {

            newErrors.SupplierId =
                "Supplier ID is required.";

        }
        else if (
            Number(formData.SupplierId) <= 0
        ) {

            newErrors.SupplierId =
                "Supplier ID must be greater than 0.";

        }


        /* -------------------------------------------------
           PURCHASE ORDER NUMBER
        ------------------------------------------------- */

        if (
            !String(
                formData.PurchaseOrderNumber
            ).trim()
        ) {

            newErrors.PurchaseOrderNumber =
                "Purchase Order Number is required.";

        }


        /* -------------------------------------------------
           ORDER DATE
        ------------------------------------------------- */

        if (!formData.OrderDate) {

            newErrors.OrderDate =
                "Order Date is required.";

        }


        /* -------------------------------------------------
           EXPECTED DELIVERY DATE
        ------------------------------------------------- */

        if (
            !formData.ExpectedDeliveryDate
        ) {

            newErrors.ExpectedDeliveryDate =
                "Expected Delivery Date is required.";

        }


        /* -------------------------------------------------
           TOTAL AMOUNT
        ------------------------------------------------- */

        if (
            formData.TotalAmount === "" ||
            formData.TotalAmount === null ||
            formData.TotalAmount === undefined
        ) {

            newErrors.TotalAmount =
                "Total Amount is required.";

        }
        else if (
            Number(formData.TotalAmount) < 0
        ) {

            newErrors.TotalAmount =
                "Total Amount cannot be negative.";

        }


        setErrors(newErrors);


        return Object.keys(newErrors).length === 0;

    };


    /* =====================================================
       HANDLE SUBMIT
    ===================================================== */

    const handleSubmit = () => {

        if (!validateForm()) {

            return;

        }


        /* -------------------------------------------------
           PREPARE API PAYLOAD
        ------------------------------------------------- */

        const payload = {

            PurchaseOrderId:
                Number(
                    formData.PurchaseOrderId || 0
                ),

            SellerId:
                Number(
                    formData.SellerId
                ),

            SupplierId:
                Number(
                    formData.SupplierId
                ),

            PurchaseOrderNumber:
                String(
                    formData.PurchaseOrderNumber
                ).trim(),

            OrderDate:
                formData.OrderDate,

            ExpectedDeliveryDate:
                formData.ExpectedDeliveryDate,

            Status:
                formData.Status,

            TotalAmount:
                Number(
                    formData.TotalAmount || 0
                ),

            Remarks:
                String(
                    formData.Remarks || ""
                ).trim()

        };


        onSave(payload);

    };


    /* =====================================================
       HANDLE CLOSE
    ===================================================== */

    const handleClose = () => {

        setErrors({});

        setFormData({
            ...initialState
        });

        onClose();

    };


    /* =====================================================
       RENDER
    ===================================================== */

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

                    formData.PurchaseOrderId

                        ? "Edit Purchase Order"

                        : "Add Purchase Order"

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
                        mt: 0.5
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

                            label="Seller ID"

                            name="SellerId"

                            type="number"

                            value={
                                formData.SellerId
                            }

                            onChange={
                                handleChange
                            }

                            error={
                                Boolean(
                                    errors.SellerId
                                )
                            }

                            helperText={
                                errors.SellerId
                            }

                            inputProps={{
                                min: 1
                            }}

                        />

                    </Grid>


                    {/* =========================================
                       SUPPLIER ID
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField

                            fullWidth

                            label="Supplier ID"

                            name="SupplierId"

                            type="number"

                            value={
                                formData.SupplierId
                            }

                            onChange={
                                handleChange
                            }

                            error={
                                Boolean(
                                    errors.SupplierId
                                )
                            }

                            helperText={
                                errors.SupplierId
                            }

                            inputProps={{
                                min: 1
                            }}

                        />

                    </Grid>


                    {/* =========================================
                       PURCHASE ORDER NUMBER
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField

                            fullWidth

                            label="Purchase Order Number"

                            name="PurchaseOrderNumber"

                            value={
                                formData.PurchaseOrderNumber
                            }

                            onChange={
                                handleChange
                            }

                            error={
                                Boolean(
                                    errors.PurchaseOrderNumber
                                )
                            }

                            helperText={
                                errors.PurchaseOrderNumber
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

                            label="Order Date"

                            name="OrderDate"

                            type="date"

                            value={
                                formData.OrderDate
                            }

                            onChange={
                                handleChange
                            }

                            InputLabelProps={{
                                shrink: true
                            }}

                            error={
                                Boolean(
                                    errors.OrderDate
                                )
                            }

                            helperText={
                                errors.OrderDate
                            }

                        />

                    </Grid>


                    {/* =========================================
                       EXPECTED DELIVERY DATE
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField

                            fullWidth

                            label="Expected Delivery Date"

                            name="ExpectedDeliveryDate"

                            type="date"

                            value={
                                formData.ExpectedDeliveryDate
                            }

                            onChange={
                                handleChange
                            }

                            InputLabelProps={{
                                shrink: true
                            }}

                            error={
                                Boolean(
                                    errors.ExpectedDeliveryDate
                                )
                            }

                            helperText={
                                errors.ExpectedDeliveryDate
                            }

                        />

                    </Grid>


                    {/* =========================================
                       STATUS
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField

                            select

                            fullWidth

                            label="Status"

                            name="Status"

                            value={
                                formData.Status
                            }

                            onChange={
                                handleChange
                            }

                        >

                            {

                                statusOptions.map(
                                    (status) => (

                                        <MenuItem

                                            key={status}

                                            value={status}

                                        >

                                            {status}

                                        </MenuItem>

                                    )
                                )

                            }

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

                            label="Total Amount"

                            name="TotalAmount"

                            type="number"

                            value={
                                formData.TotalAmount
                            }

                            onChange={
                                handleChange
                            }

                            error={
                                Boolean(
                                    errors.TotalAmount
                                )
                            }

                            helperText={
                                errors.TotalAmount
                            }

                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}

                        />

                    </Grid>


                    {/* =========================================
                       REMARKS
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                    >

                        <TextField

                            fullWidth

                            multiline

                            rows={4}

                            label="Remarks"

                            name="Remarks"

                            value={
                                formData.Remarks
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

                    onClick={handleClose}

                    color="inherit"

                >

                    Cancel

                </Button>


                <Button

                    variant="contained"

                    onClick={handleSubmit}

                >

                    {

                        formData.PurchaseOrderId

                            ? "Update"

                            : "Save"

                    }

                </Button>

            </DialogActions>


        </Dialog>

    );

};


export default PurchaseOrderModal;
