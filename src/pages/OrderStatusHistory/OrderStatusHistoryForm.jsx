import React, {
    useEffect,
    useState
} from "react";

import {
    Box,
    TextField,
    Grid,
    MenuItem,
    Button,
    Stack,
    CircularProgress
} from "@mui/material";


/* =========================================================
   DEFAULT VALUES
========================================================= */

const DEFAULT_SELLER_ID = 6;
const DEFAULT_CUSTOMER_ID = 3;


/* =========================================================
   STATUS OPTIONS
========================================================= */

const STATUS_OPTIONS = [
    "Pending",
    "Confirmed",
    "Processing",
    "Packed",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Returned"
];


/* =========================================================
   CURRENT LOCAL DATETIME
========================================================= */

const getCurrentDateTimeLocal = () => {

    const now = new Date();

    const offset =
        now.getTimezoneOffset() * 60000;

    return new Date(
        now.getTime() - offset
    )
        .toISOString()
        .slice(0, 16);
};


/* =========================================================
   FORMAT DATETIME FOR INPUT
========================================================= */

const formatDateTimeLocal = (value) => {

    if (!value) {
        return getCurrentDateTimeLocal();
    }

    const date = new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return getCurrentDateTimeLocal();
    }

    const offset =
        date.getTimezoneOffset() * 60000;

    return new Date(
        date.getTime() - offset
    )
        .toISOString()
        .slice(0, 16);
};


/* =========================================================
   COMPONENT
========================================================= */

const OrderStatusHistoryForm = ({
    item = null,
    onSave,
    onCancel,
    loading = false
}) => {

    /* =====================================================
       FORM STATE
    ===================================================== */

    const [formData, setFormData] = useState({
        orderStatusHistoryId: 0,
        sellerId: DEFAULT_SELLER_ID,
        customerId: DEFAULT_CUSTOMER_ID,
        orderId: "",
        status: "",
        remarks: "",
        changedOn: getCurrentDateTimeLocal()
    });


    /* =====================================================
       VALIDATION
    ===================================================== */

    const [errors, setErrors] = useState({});


    /* =====================================================
       LOAD ITEM FOR EDIT
    ===================================================== */

    useEffect(() => {

        if (!item) {

            setFormData({
                orderStatusHistoryId: 0,
                sellerId: DEFAULT_SELLER_ID,
                customerId: DEFAULT_CUSTOMER_ID,
                orderId: "",
                status: "",
                remarks: "",
                changedOn:
                    getCurrentDateTimeLocal()
            });

            setErrors({});

            return;
        }


        const historyId =
            item.orderStatusHistoryId ??
            item.OrderStatusHistoryId ??
            item.historyId ??
            item.HistoryId ??
            0;


        const sellerId =
            item.sellerId ??
            item.SellerId ??
            DEFAULT_SELLER_ID;


        const customerId =
            item.customerId ??
            item.CustomerId ??
            DEFAULT_CUSTOMER_ID;


        const orderId =
            item.orderId ??
            item.OrderId ??
            "";


        const status =
            item.status ??
            item.Status ??
            "";


        const remarks =
            item.remarks ??
            item.Remarks ??
            "";


        const changedOn =
            item.changedOn ??
            item.ChangedOn ??
            item.timestamp ??
            item.Timestamp ??
            null;


        setFormData({

            orderStatusHistoryId:
                Number(historyId),

            sellerId:
                Number(sellerId),

            customerId:
                Number(customerId),

            orderId:
                orderId === null
                    ? ""
                    : String(orderId),

            status:
                status || "",

            remarks:
                remarks || "",

            changedOn:
                formatDateTimeLocal(
                    changedOn
                )
        });

        setErrors({});

    }, [item]);


    /* =====================================================
       HANDLE CHANGE
    ===================================================== */

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData(previous => ({
            ...previous,
            [name]: value
        }));


        setErrors(previous => ({
            ...previous,
            [name]: ""
        }));

    };


    /* =====================================================
       VALIDATE
    ===================================================== */

    const validate = () => {

        const validationErrors = {};


        if (!Number(formData.sellerId)) {

            validationErrors.sellerId =
                "Seller ID is required.";

        }


        if (!Number(formData.customerId)) {

            validationErrors.customerId =
                "Customer ID is required.";

        }


        if (!Number(formData.orderId)) {

            validationErrors.orderId =
                "Order ID is required.";

        }


        if (!formData.status) {

            validationErrors.status =
                "Status is required.";

        }


        setErrors(
            validationErrors
        );


        return (
            Object.keys(
                validationErrors
            ).length === 0
        );

    };


    /* =====================================================
       SUBMIT
    ===================================================== */

    const handleSubmit = (event) => {

        event.preventDefault();


        if (!validate()) {
            return;
        }


        const historyId =
            Number(
                formData.orderStatusHistoryId
            ) || 0;


        const payload = {

            orderStatusHistoryId:
                historyId,

            sellerId:
                Number(formData.sellerId),

            customerId:
                Number(formData.customerId),

            orderId:
                Number(formData.orderId),

            status:
                formData.status,

            remarks:
                formData.remarks?.trim() || "",

            changedOn:
                formData.changedOn
                    ? new Date(
                        formData.changedOn
                    ).toISOString()
                    : new Date().toISOString()

        };


        console.log(
            "ORDER STATUS HISTORY FORM PAYLOAD:",
            payload
        );


        if (
            typeof onSave === "function"
        ) {

            onSave(payload);

        }

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Box
            component="form"
            onSubmit={handleSubmit}
        >

            <Grid
                container
                spacing={2}
            >

                {/* =================================================
                    SELLER ID
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <TextField
                        fullWidth
                        label="Seller ID"
                        name="sellerId"
                        type="number"
                        value={formData.sellerId}
                        onChange={handleChange}
                        error={
                            Boolean(
                                errors.sellerId
                            )
                        }
                        helperText={
                            errors.sellerId
                        }
                    />

                </Grid>


                {/* =================================================
                    CUSTOMER ID
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <TextField
                        fullWidth
                        label="Customer ID"
                        name="customerId"
                        type="number"
                        value={formData.customerId}
                        onChange={handleChange}
                        error={
                            Boolean(
                                errors.customerId
                            )
                        }
                        helperText={
                            errors.customerId
                        }
                    />

                </Grid>


                {/* =================================================
                    ORDER ID
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <TextField
                        fullWidth
                        required
                        label="Order ID"
                        name="orderId"
                        type="number"
                        value={formData.orderId}
                        onChange={handleChange}
                        error={
                            Boolean(
                                errors.orderId
                            )
                        }
                        helperText={
                            errors.orderId ||
                            "Enter the marketplace order ID."
                        }
                        inputProps={{
                            min: 1
                        }}
                    />

                </Grid>


                {/* =================================================
                    STATUS
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <TextField
                        fullWidth
                        required
                        select
                        label="Status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        error={
                            Boolean(
                                errors.status
                            )
                        }
                        helperText={
                            errors.status
                        }
                    >

                        {STATUS_OPTIONS.map(
                            status => (

                                <MenuItem
                                    key={status}
                                    value={status}
                                >
                                    {status}
                                </MenuItem>

                            )
                        )}

                    </TextField>

                </Grid>


                {/* =================================================
                    REMARKS
                ================================================= */}

                <Grid
                    item
                    xs={12}
                >

                    <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        label="Remarks"
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        placeholder={
                            "Enter status change remarks"
                        }
                    />

                </Grid>


                {/* =================================================
                    CHANGED ON
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <TextField
                        fullWidth
                        type="datetime-local"
                        label="Changed On"
                        name="changedOn"
                        value={formData.changedOn}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true
                        }}
                    />

                </Grid>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <Grid
                    item
                    xs={12}
                >

                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="flex-end"
                        sx={{
                            mt: 1
                        }}
                    >

                        <Button
                            type="button"
                            variant="outlined"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancel
                        </Button>


                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                        >

                            {loading ? (

                                <>

                                    <CircularProgress
                                        size={20}
                                        sx={{
                                            mr: 1
                                        }}
                                    />

                                    Saving...

                                </>

                            ) : (

                                item
                                    ? "Update"
                                    : "Create"

                            )}

                        </Button>

                    </Stack>

                </Grid>

            </Grid>

        </Box>
    );
};


export default OrderStatusHistoryForm;

