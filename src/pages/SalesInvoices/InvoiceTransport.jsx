import React from "react";
import {
    Box,
    Grid,
    Typography
} from "@mui/material";

const formatDate = value => {
    if (!value) return "N/A";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString("en-IN");
};

const Field = ({
    label,
    value
}) => (
    <Box sx={{ mb: 0.75 }}>
        <Typography
            variant="body2"
            fontWeight={700}
        >
            {label}
        </Typography>

        <Typography variant="body2">
            {value || "N/A"}
        </Typography>
    </Box>
);

const InvoiceTransport = ({
    invoice
}) => {

    return (
        <Box
            sx={{
                borderLeft: "1px solid #222",
                borderRight: "1px solid #222",
                borderBottom: "1px solid #222"
            }}
        >
            <Box sx={{ p: 1 }}>
                <Typography
                    variant="subtitle2"
                    fontWeight={800}
                >
                    TRANSPORT / DELIVERY DETAILS
                </Typography>
            </Box>

            <Grid container>

                <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                        p: 1.5,
                        borderTop: "1px solid #222",
                        borderRight: {
                            xs: "none",
                            md: "1px solid #222"
                        }
                    }}
                >
                    <Field
                        label="Delivery Note"
                        value={invoice?.DeliveryNote}
                    />

                    <Field
                        label="Delivery Note Date"
                        value={formatDate(
                            invoice?.DeliveryNoteDate
                        )}
                    />

                    <Field
                        label="E-Way Bill Number"
                        value={invoice?.EWayBillNumber}
                    />

                    <Field
                        label="Vehicle No"
                        value={invoice?.VehicleNo}
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                        p: 1.5,
                        borderTop: "1px solid #222",
                        borderRight: {
                            xs: "none",
                            md: "1px solid #222"
                        }
                    }}
                >
                    <Field
                        label="Transporter"
                        value={invoice?.TransporterName}
                    />

                    <Field
                        label="Transporter ID"
                        value={invoice?.TransporterID}
                    />

                    <Field
                        label="Transporter Document No"
                        value={invoice?.TransporterDocNo}
                    />

                    <Field
                        label="Transport Mode"
                        value={invoice?.TransportMode}
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                        p: 1.5,
                        borderTop: "1px solid #222"
                    }}
                >
                    <Field
                        label="Destination"
                        value={invoice?.Destination}
                    />

                    <Field
                        label="Bill of Landing / LR-RR No"
                        value={
                            invoice?.BillOfLandingOrLRRRNo
                        }
                    />

                    <Field
                        label="Despatched Through"
                        value={
                            invoice?.DespatchedThrough
                        }
                    />

                    <Field
                        label="Terms of Payment"
                        value={
                            invoice?.ModeOrTermsOfPayment
                        }
                    />

                    <Field
                        label="Distance"
                        value={invoice?.Distance}
                    />
                </Grid>

            </Grid>
        </Box>
    );
};

export default InvoiceTransport;