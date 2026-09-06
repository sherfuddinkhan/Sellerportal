
import React, {
    useEffect,
    useState
} from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    MenuItem,
    Divider,
    CircularProgress
} from "@mui/material";


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
   FORMAT DATETIME LOCAL
========================================================= */

const formatDateTimeLocal = (value) => {

    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }

    const offset =
        date.getTimezoneOffset() *
        60000;

    return new Date(
        date.getTime() - offset
    )
        .toISOString()
        .slice(0, 16);
};


/* =========================================================
   EDIT ORDER STATUS HISTORY
========================================================= */

const EditOrderStatusHistory = ({
    open,
    item,
    onClose,
    onSave,
    loading = false
}) => {

    /* =====================================================
       FORM STATE
    ===================================================== */

    const [formData, setFormData] = useState({
        orderStatusHistoryId: 0,
        sellerId: 6,
        customerId: 3,
        orderId: "",
        status: "",
        remarks: "",
        changedOn: "",
        timestamp: ""
    });


    /* =====================================================
       LOAD ITEM
    ===================================================== */

    useEffect(() => {

        if (
            open &&
            item
        ) {

            setFormData({

                orderStatusHistoryId:
                    item.orderStatusHistoryId ??
                    item.OrderStatusHistoryId ??
                    item.historyId ??
                    item.HistoryId ??
                    0,

                sellerId:
                    item.sellerId ??
                    item.SellerId ??
                    6,

                customerId:
                    item.customerId ??
                    item.CustomerId ??
                    3,

                orderId:
                    item.orderId ??
                    item.OrderId ??
                    "",

                status:
                    item.status ??
                    item.Status ??
                    "",

                remarks:
                    item.remarks ??
                    item.Remarks ??
                    "",

                changedOn:
                    formatDateTimeLocal(
                        item.changedOn ??
                        item.ChangedOn
                    ),

                timestamp:
                    item.timestamp ??
                    item.Timestamp ??
                    ""
            });

        }

    }, [open, item]);


    /* =====================================================
       HANDLE CHANGE
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
       HANDLE SUBMIT
    ===================================================== */

    const handleSubmit = () => {

        const historyId =
            Number(
                formData.orderStatusHistoryId
            );

        const sellerId =
            Number(
                formData.sellerId
            );

        const customerId =
            Number(
                formData.customerId
            );

        const orderId =
            Number(
                formData.orderId
            );


        /* ================================================
           VALIDATION
        ================================================ */

        if (!historyId) {
            return;
        }

        if (!sellerId) {
            return;
        }

        if (!customerId) {
            return;
        }

        if (!orderId) {
            return;
        }

        if (!formData.status) {
            return;
        }


        /* ================================================
           PAYLOAD
        ================================================ */

        const payload = {

            orderStatusHistoryId:
                historyId,

            sellerId,

            customerId,

            orderId,

            status:
                formData.status,

            remarks:
                formData.remarks || "",

            changedOn:
                formData.changedOn
                    ? new Date(
                        formData.changedOn
                    ).toISOString()
                    : new Date().toISOString(),

            timestamp:
                formData.timestamp ||
                new Date().toISOString()
        };


        /* ================================================
           SAVE
        ================================================ */

        if (
            typeof onSave === "function"
        ) {

            onSave(payload);

        }

    };


    /* =====================================================
       RENDER
    ===================================================== */

    if (!item) {
        return null;
    }


    return (

        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            fullWidth
            maxWidth="md"
        >

            <DialogTitle
                sx={{
                    fontWeight: 700
                }}
            >
                Edit Order Status History
            </DialogTitle>

            <Divider />

            <DialogContent
                sx={{
                    mt: 2
                }}
            >

                <Grid
                    container
                    spacing={2}
                >

                    {/* =========================================
                        HISTORY ID
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            label="History ID"
                            value={
                                formData.orderStatusHistoryId
                            }
                            InputProps={{
                                readOnly: true
                            }}
                        />

                    </Grid>


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
                            name="sellerId"
                            type="number"
                            value={formData.sellerId}
                            onChange={handleChange}
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
                            label="Customer ID"
                            name="customerId"
                            type="number"
                            value={formData.customerId}
                            onChange={handleChange}
                        />

                    </Grid>


                    {/* =========================================
                        ORDER ID
                    ========================================= */}

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
                            fullWidth
                            required
                            select
                            label="Status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >

                            {STATUS_OPTIONS.map(
                                (status) => (

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
                            minRows={3}
                            label="Remarks"
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                        />

                    </Grid>


                    {/* =========================================
                        CHANGED ON
                    ========================================= */}

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


                    {/* =========================================
                        TIMESTAMP
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            type="text"
                            label="Timestamp"
                            value={
                                formData.timestamp
                            }
                            InputProps={{
                                readOnly: true
                            }}
                        />

                    </Grid>

                </Grid>

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
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={
                        loading ||
                        !formData.orderStatusHistoryId
                    }
                >

                    {loading ? (
                        <>
                            <CircularProgress
                                size={20}
                                sx={{ mr: 1 }}
                            />
                            Updating...
                        </>
                    ) : (
                        "Update"
                    )}

                </Button>

            </DialogActions>

        </Dialog>
    );
};


export default EditOrderStatusHistory;