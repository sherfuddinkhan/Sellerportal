import React from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Typography,
    Box,
    Chip,
    Stack
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete,
    LocationOn
} from "@mui/icons-material";

/* =========================================================
   FORMAT VALUE
========================================================= */

const formatValue = (value) => {
    if (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
    ) {
        return "N/A";
    }

    return String(value);
};

/* =========================================================
   GET SUPPLIER ADDRESS ID
========================================================= */

const getAddressId = (row) => {
    return (
        row?.supplierAddressId ??
        row?.SupplierAddressId ??
        row?.addressId ??
        row?.AddressId ??
        row?.id ??
        row?.Id ??
        null
    );
};

/* =========================================================
   GET STATUS COLOR
========================================================= */

const getStatusColor = (status) => {
    const normalizedStatus = String(status ?? "")
        .trim()
        .toLowerCase();

    if (["active", "enabled", "true"].includes(normalizedStatus)) {
        return "success";
    }

    if (["inactive", "disabled", "false"].includes(normalizedStatus)) {
        return "default";
    }

    if (["pending", "draft"].includes(normalizedStatus)) {
        return "warning";
    }

    return "default";
};

/* =========================================================
   SUPPLIER ADDRESS TABLE
========================================================= */

const SupplierAddressTable = ({
    supplierAddresses = [],
    loading = false,
    onView,
    onEdit,
    onDelete
}) => {

    /* =====================================================
       SAFE DATA
    ===================================================== */

    const rows = Array.isArray(supplierAddresses)
        ? supplierAddresses
        : [];

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <TableContainer
            component={Paper}
            elevation={2}
            sx={{
                borderRadius: 2,
                overflowX: "auto"
            }}
        >
            <Table
                stickyHeader
                size="medium"
                aria-label="Supplier addresses table"
            >
                {/* =============================================
                   TABLE HEADER
                ============================================= */}

                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Typography fontWeight={700}>
                                #
                            </Typography>
                        </TableCell>

                        <TableCell>
                            <Typography fontWeight={700}>
                                Supplier
                            </Typography>
                        </TableCell>

                        <TableCell>
                            <Typography fontWeight={700}>
                                Address Type
                            </Typography>
                        </TableCell>

                        <TableCell>
                            <Typography fontWeight={700}>
                                Address
                            </Typography>
                        </TableCell>

                        <TableCell>
                            <Typography fontWeight={700}>
                                City
                            </Typography>
                        </TableCell>

                        <TableCell>
                            <Typography fontWeight={700}>
                                State
                            </Typography>
                        </TableCell>

                        <TableCell>
                            <Typography fontWeight={700}>
                                Postal Code
                            </Typography>
                        </TableCell>

                        <TableCell>
                            <Typography fontWeight={700}>
                                Country
                            </Typography>
                        </TableCell>

                        <TableCell>
                            <Typography fontWeight={700}>
                                Status
                            </Typography>
                        </TableCell>

                        <TableCell align="center">
                            <Typography fontWeight={700}>
                                Actions
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>

                {/* =============================================
                   TABLE BODY
                ============================================= */}

                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell
                                colSpan={10}
                                align="center"
                                sx={{ py: 5 }}
                            >
                                <Typography color="text.secondary">
                                    Loading supplier addresses...
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : rows.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={10}
                                align="center"
                                sx={{ py: 5 }}
                            >
                                <LocationOn
                                    sx={{
                                        fontSize: 42,
                                        color: "text.disabled",
                                        mb: 1
                                    }}
                                />

                                <Typography
                                    variant="body1"
                                    fontWeight={600}
                                >
                                    No supplier addresses found
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Supplier addresses will appear here
                                    once they are available.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        rows.map((row, index) => {
                            const addressId = getAddressId(row);

                            const supplierName =
                                row?.supplierName ??
                                row?.SupplierName ??
                                row?.supplier?.supplierName ??
                                row?.Supplier?.SupplierName;

                            const addressType =
                                row?.addressType ??
                                row?.AddressType;

                            const addressLine1 =
                                row?.addressLine1 ??
                                row?.AddressLine1;

                            const addressLine2 =
                                row?.addressLine2 ??
                                row?.AddressLine2;

                            const city =
                                row?.city ??
                                row?.City;

                            const state =
                                row?.state ??
                                row?.State;

                            const postalCode =
                                row?.postalCode ??
                                row?.PostalCode ??
                                row?.zipCode ??
                                row?.ZipCode;

                            const country =
                                row?.country ??
                                row?.Country;

                            const status =
                                row?.status ??
                                row?.Status;

                            const fullAddress = [
                                addressLine1,
                                addressLine2
                            ]
                                .filter(
                                    (value) =>
                                        value !== null &&
                                        value !== undefined &&
                                        String(value).trim() !== ""
                                )
                                .join(", ");

                            return (
                                <TableRow
                                    key={addressId ?? index}
                                    hover
                                >
                                    {/* ROW NUMBER */}

                                    <TableCell>
                                        {index + 1}
                                    </TableCell>

                                    {/* SUPPLIER NAME */}

                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                        >
                                            {formatValue(supplierName)}
                                        </Typography>

                                        {addressId !== null && (
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                ID: {addressId}
                                            </Typography>
                                        )}
                                    </TableCell>

                                    {/* ADDRESS TYPE */}

                                    <TableCell>
                                        <Chip
                                            label={formatValue(addressType)}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>

                                    {/* ADDRESS */}

                                    <TableCell
                                        sx={{
                                            minWidth: 180,
                                            maxWidth: 280
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                overflowWrap: "anywhere"
                                            }}
                                        >
                                            {formatValue(fullAddress)}
                                        </Typography>
                                    </TableCell>

                                    {/* CITY */}

                                    <TableCell>
                                        {formatValue(city)}
                                    </TableCell>

                                    {/* STATE */}

                                    <TableCell>
                                        {formatValue(state)}
                                    </TableCell>

                                    {/* POSTAL CODE */}

                                    <TableCell>
                                        {formatValue(postalCode)}
                                    </TableCell>

                                    {/* COUNTRY */}

                                    <TableCell>
                                        {formatValue(country)}
                                    </TableCell>

                                    {/* STATUS */}

                                    <TableCell>
                                        <Chip
                                            label={formatValue(status)}
                                            color={getStatusColor(status)}
                                            size="small"
                                        />
                                    </TableCell>

                                    {/* ACTIONS */}

                                    <TableCell align="center">
                                        <Stack
                                            direction="row"
                                            spacing={0.5}
                                            justifyContent="center"
                                        >
                                            {/* VIEW */}

                                            <Tooltip title="View address">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    aria-label="View supplier address"
                                                    disabled={addressId === null}
                                                    onClick={() =>
                                                        onView?.(row)
                                                    }
                                                >
                                                    <Visibility fontSize="small" />
                                                </IconButton>
                                            </Tooltip>

                                            {/* EDIT */}

                                            <Tooltip title="Edit address">
                                                <IconButton
                                                    size="small"
                                                    color="success"
                                                    aria-label="Edit supplier address"
                                                    disabled={addressId === null}
                                                    onClick={() =>
                                                        onEdit?.(row)
                                                    }
                                                >
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                            </Tooltip>

                                            {/* DELETE */}

                                            <Tooltip title="Delete address">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    aria-label="Delete supplier address"
                                                    disabled={addressId === null}
                                                    onClick={() =>
                                                        onDelete?.(row)
                                                    }
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default SupplierAddressTable;

