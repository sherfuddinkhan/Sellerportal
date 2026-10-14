import React from "react";

import {
    Box,
    Chip,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

const SaleOrderAddressesTable = ({
    addresses = [],
    onView,
    onEdit,
    onDelete
}) => {
    const getValue = (item, camelCase, pascalCase, fallback = "") =>
        item?.[camelCase] ?? item?.[pascalCase] ?? fallback;

    const getAddressId = (address) =>
        getValue(address, "addressId", "AddressId") ||
        getValue(address, "id", "Id");

    const getFullAddress = (address) => {
        const line1 = getValue(address, "addressLine1", "AddressLine1");
        const line2 = getValue(address, "addressLine2", "AddressLine2");
        const city = getValue(address, "city", "City");
        const state = getValue(address, "state", "State");
        const pincode = getValue(address, "pincode", "Pincode");

        return [line1, line2, city, state, pincode]
            .filter((value) => String(value).trim() !== "")
            .join(", ");
    };

    if (!addresses.length) {
        return (
            <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography color="text.secondary">
                    No sale order addresses to display.
                </Typography>
            </Box>
        );
    }

    return (
        <TableContainer component={Paper} elevation={0}>
            <Table sx={{ minWidth: 1100 }} aria-label="Sale order addresses table">
                <TableHead>
                    <TableRow
                        sx={{
                            "& th": {
                                backgroundColor: "grey.100",
                                fontWeight: 700,
                                whiteSpace: "nowrap"
                            }
                        }}
                    >
                        <TableCell>Address ID</TableCell>
                        <TableCell>Sales Order ID</TableCell>
                        <TableCell>Customer Name</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>City</TableCell>
                        <TableCell>State</TableCell>
                        <TableCell>Pincode</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {addresses.map((address, index) => {
                        const addressId = getAddressId(address);
                        const city = getValue(address, "city", "City");
                        const state = getValue(address, "state", "State");
                        const pincode = getValue(address, "pincode", "Pincode");
                        const phone = getValue(address, "phone", "Phone");
                        const email = getValue(address, "email", "Email");
                        const customerName = getValue(
                            address,
                            "name",
                            "Name",
                            "—"
                        );
                        const salesOrderId = getValue(
                            address,
                            "salesOrderId",
                            "SalesOrderId",
                            "—"
                        );

                        return (
                            <TableRow
                                key={String(addressId || index)}
                                hover
                                sx={{
                                    "&:last-child td": { borderBottom: 0 },
                                    "& td": { verticalAlign: "top" }
                                }}
                            >
                                <TableCell>
                                    <Chip
                                        label={addressId || "—"}
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                    />
                                </TableCell>

                                <TableCell>
                                    <Typography variant="body2" fontWeight={600}>
                                        {salesOrderId}
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    <Typography variant="body2" fontWeight={600}>
                                        {customerName}
                                    </Typography>
                                </TableCell>

                                <TableCell sx={{ minWidth: 220, maxWidth: 300 }}>
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        <LocationOnIcon
                                            fontSize="small"
                                            color="action"
                                            sx={{ mt: 0.2 }}
                                        />

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                overflowWrap: "anywhere",
                                                whiteSpace: "normal"
                                            }}
                                        >
                                            {getFullAddress(address) || "—"}
                                        </Typography>
                                    </Box>
                                </TableCell>

                                <TableCell>{city || "—"}</TableCell>

                                <TableCell>
                                    <Box>
                                        <Typography variant="body2">
                                            {state || "—"}
                                        </Typography>

                                        {getValue(
                                            address,
                                            "stateCode",
                                            "StateCode"
                                        ) && (
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                Code:{" "}
                                                {getValue(
                                                    address,
                                                    "stateCode",
                                                    "StateCode"
                                                )}
                                            </Typography>
                                        )}
                                    </Box>
                                </TableCell>

                                <TableCell>{pincode || "—"}</TableCell>

                                <TableCell sx={{ minWidth: 170 }}>
                                    {phone && (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.75,
                                                mb: email ? 1 : 0
                                            }}
                                        >
                                            <PhoneIcon
                                                sx={{
                                                    fontSize: 16,
                                                    color: "text.secondary"
                                                }}
                                            />
                                            <Typography variant="body2">
                                                {phone}
                                            </Typography>
                                        </Box>
                                    )}

                                    {email && (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.75
                                            }}
                                        >
                                            <EmailIcon
                                                sx={{
                                                    fontSize: 16,
                                                    color: "text.secondary"
                                                }}
                                            />
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    overflowWrap: "anywhere"
                                                }}
                                            >
                                                {email}
                                            </Typography>
                                        </Box>
                                    )}

                                    {!phone && !email && "—"}
                                </TableCell>

                                <TableCell align="center">
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: 0.25
                                        }}
                                    >
                                        <Tooltip title="View address">
                                            <span>
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    aria-label="View address"
                                                    disabled={!addressId}
                                                    onClick={() =>
                                                        onView?.(address)
                                                    }
                                                >
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                            </span>
                                        </Tooltip>

                                        <Tooltip title="Edit address">
                                            <span>
                                                <IconButton
                                                    size="small"
                                                    color="success"
                                                    aria-label="Edit address"
                                                    disabled={!addressId}
                                                    onClick={() =>
                                                        onEdit?.(address)
                                                    }
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </span>
                                        </Tooltip>

                                        <Tooltip title="Delete address">
                                            <span>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    aria-label="Delete address"
                                                    disabled={!addressId}
                                                    onClick={() =>
                                                        onDelete?.(address)
                                                    }
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default SaleOrderAddressesTable;
