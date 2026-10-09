import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    Divider,
    Box,
    Chip
} from "@mui/material";

import {
    Business,
    Person,
    LocationOn,
    Phone,
    Email,
    Public
} from "@mui/icons-material";

/* =========================================================
   SUPPLIER ADDRESS VIEW
========================================================= */

const SupplierAddressView = ({
    open,
    onClose,
    supplierAddress
}) => {

    /* =====================================================
       SAFE VALUE
    ===================================================== */

    const getValue = (value) => {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "N/A";
        }

        return value;
    };

    /* =====================================================
       ADDRESS FIELD
    ===================================================== */

    const AddressField = ({ label, value }) => (
        <Grid item xs={12} sm={6}>
            <Typography
                variant="caption"
                color="text.secondary"
            >
                {label}
            </Typography>

            <Typography
                variant="body1"
                fontWeight={500}
                sx={{
                    overflowWrap: "anywhere",
                    mt: 0.5
                }}
            >
                {getValue(value)}
            </Typography>
        </Grid>
    );

    /* =====================================================
       EMPTY STATE
    ===================================================== */

    if (!supplierAddress && open) {
        return (
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Supplier Address Details
                </DialogTitle>

                <DialogContent dividers>
                    <Typography color="text.secondary">
                        No supplier address details available.
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    if (!supplierAddress) {
        return null;
    }

    /* =====================================================
       STATUS
    ===================================================== */

    const status = supplierAddress.status;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            {/* =============================================
               HEADER
            ============================================= */}

            <DialogTitle>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    gap={2}
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                    >
                        <LocationOn color="primary" />

                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >
                            Supplier Address Details
                        </Typography>
                    </Box>

                    {status !== undefined && (
                        <Chip
                            label={String(status)}
                            color={
                                String(status).toLowerCase() === "active"
                                    ? "success"
                                    : "default"
                            }
                            size="small"
                        />
                    )}
                </Box>
            </DialogTitle>

            <Divider />

            {/* =============================================
               CONTENT
            ============================================= */}

            <DialogContent dividers>
                {/* SUPPLIER INFORMATION */}

                <Box mb={3}>
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        mb={2}
                    >
                        <Business color="primary" />

                        <Typography
                            variant="subtitle1"
                            fontWeight={600}
                        >
                            Supplier Information
                        </Typography>
                    </Box>

                    <Grid container spacing={2}>
                        <AddressField
                            label="Supplier ID"
                            value={
                                supplierAddress.supplierId ??
                                supplierAddress.SupplierId ??
                                supplierAddress.id ??
                                supplierAddress.Id
                            }
                        />

                        <AddressField
                            label="Supplier Name"
                            value={
                                supplierAddress.supplierName ??
                                supplierAddress.SupplierName
                            }
                        />

                        <AddressField
                            label="Contact Person"
                            value={
                                supplierAddress.contactPerson ??
                                supplierAddress.ContactPerson
                            }
                        />

                        <AddressField
                            label="Address Type"
                            value={
                                supplierAddress.addressType ??
                                supplierAddress.AddressType
                            }
                        />
                    </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* ADDRESS INFORMATION */}

                <Box mb={3}>
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        mb={2}
                    >
                        <LocationOn color="primary" />

                        <Typography
                            variant="subtitle1"
                            fontWeight={600}
                        >
                            Address Information
                        </Typography>
                    </Box>

                    <Grid container spacing={2}>
                        <AddressField
                            label="Address Line 1"
                            value={
                                supplierAddress.addressLine1 ??
                                supplierAddress.AddressLine1
                            }
                        />

                        <AddressField
                            label="Address Line 2"
                            value={
                                supplierAddress.addressLine2 ??
                                supplierAddress.AddressLine2
                            }
                        />

                        <AddressField
                            label="City"
                            value={
                                supplierAddress.city ??
                                supplierAddress.City
                            }
                        />

                        <AddressField
                            label="State"
                            value={
                                supplierAddress.state ??
                                supplierAddress.State
                            }
                        />

                        <AddressField
                            label="Postal Code"
                            value={
                                supplierAddress.postalCode ??
                                supplierAddress.PostalCode ??
                                supplierAddress.zipCode ??
                                supplierAddress.ZipCode
                            }
                        />

                        <AddressField
                            label="Country"
                            value={
                                supplierAddress.country ??
                                supplierAddress.Country
                            }
                        />
                    </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* CONTACT INFORMATION */}

                <Box mb={3}>
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        mb={2}
                    >
                        <Person color="primary" />

                        <Typography
                            variant="subtitle1"
                            fontWeight={600}
                        >
                            Contact Information
                        </Typography>
                    </Box>

                    <Grid container spacing={2}>
                        <AddressField
                            label="Phone Number"
                            value={
                                supplierAddress.phoneNumber ??
                                supplierAddress.PhoneNumber ??
                                supplierAddress.phone ??
                                supplierAddress.Phone
                            }
                        />

                        <AddressField
                            label="Email Address"
                            value={
                                supplierAddress.emailAddress ??
                                supplierAddress.EmailAddress ??
                                supplierAddress.email ??
                                supplierAddress.Email
                            }
                        />

                        <AddressField
                            label="Website"
                            value={
                                supplierAddress.website ??
                                supplierAddress.Website
                            }
                        />
                    </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* ADDITIONAL INFORMATION */}

                <Box>
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        mb={2}
                    >
                        <Public color="primary" />

                        <Typography
                            variant="subtitle1"
                            fontWeight={600}
                        >
                            Additional Information
                        </Typography>
                    </Box>

                    <Grid container spacing={2}>
                        <AddressField
                            label="GST Number"
                            value={
                                supplierAddress.gstNumber ??
                                supplierAddress.GSTNumber
                            }
                        />

                        <AddressField
                            label="Tax Number"
                            value={
                                supplierAddress.taxNumber ??
                                supplierAddress.TaxNumber
                            }
                        />

                        <AddressField
                            label="Created At"
                            value={
                                supplierAddress.createdAt ??
                                supplierAddress.CreatedAt
                            }
                        />

                        <AddressField
                            label="Updated At"
                            value={
                                supplierAddress.updatedAt ??
                                supplierAddress.UpdatedAt
                            }
                        />
                    </Grid>
                </Box>
            </DialogContent>

            {/* =============================================
               ACTIONS
            ============================================= */}

            <DialogActions sx={{ p: 2 }}>
                <Button
                    variant="contained"
                    onClick={onClose}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SupplierAddressView;

