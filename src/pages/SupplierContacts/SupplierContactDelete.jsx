import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
Alert,
Box,
Button,
Card,
CardContent,
CircularProgress,
Container,
Divider,
Stack,
Typography
} from "@mui/material";

import {
ArrowBack,
Delete as DeleteIcon,
WarningAmber,
Person,
Email,
Phone,
Business
} from "@mui/icons-material";

const API_URL = "http://localhost:5000/api/supplier-contacts";

const getValue = (obj, ...keys) => {
for (const key of keys) {
const value = obj?.[key];


    if (value !== undefined && value !== null && value !== "") {
        return value;
    }
}

return null;


};

function SupplierContactDelete() {
const { id } = useParams();
const navigate = useNavigate();


const [contact, setContact] = useState(null);
const [loading, setLoading] = useState(true);
const [deleting, setDeleting] = useState(false);
const [error, setError] = useState("");

useEffect(() => {
    const fetchContact = async () => {
        if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
            setError("Invalid supplier contact ID.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await axios.get(`${API_URL}/${id}`);

            const data = Array.isArray(response.data)
                ? response.data[0]
                : response.data;

            if (!data) {
                setError("Supplier contact was not found.");
                return;
            }

            setContact(data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load supplier contact. Please check the API endpoint."
            );
        } finally {
            setLoading(false);
        }
    };

    fetchContact();
}, [id]);

const handleDelete = async () => {
    if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
        setError("Invalid supplier contact ID.");
        return;
    }

    try {
        setDeleting(true);
        setError("");

        await axios.delete(`${API_URL}/${id}`);

        navigate("/supplier-contacts", {
            replace: true,
            state: {
                message: "Supplier contact deleted successfully."
            }
        });
    } catch (err) {
        setError(
            err.response?.data?.message ||
            "Failed to delete supplier contact."
        );
    } finally {
        setDeleting(false);
    }
};

if (loading) {
    return (
        <Container
            maxWidth="sm"
            sx={{ py: 6, textAlign: "center" }}
        >
            <CircularProgress />

            <Typography sx={{ mt: 2 }}>
                Loading supplier contact...
            </Typography>
        </Container>
    );
}

if (!contact) {
    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Alert severity="error">
                {error || "Supplier contact was not found."}
            </Alert>

            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate("/supplier-contacts")}
                sx={{ mt: 2 }}
            >
                Back to Supplier Contacts
            </Button>
        </Container>
    );
}

const contactId = getValue(
    contact,
    "partyContactId",
    "PartyContactId",
    "supplierContactId",
    "SupplierContactId"
) ?? id;

const contactName = getValue(
    contact,
    "contactName",
    "ContactName",
    "name",
    "Name"
) ?? "N/A";

const email = getValue(
    contact,
    "email",
    "Email"
) ?? "N/A";

const phone = getValue(
    contact,
    "phone",
    "Phone"
) ?? "N/A";

const supplierId = getValue(
    contact,
    "supplierId",
    "SupplierId"
) ?? "N/A";

return (
    <Container maxWidth="sm" sx={{ py: { xs: 2, md: 5 } }}>
        <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ mb: 2 }}
                >
                    <Box
                        sx={{
                            width: 52,
                            height: 52,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                            bgcolor: "error.light",
                            color: "error.dark"
                        }}
                    >
                        <WarningAmber fontSize="large" />
                    </Box>

                    <Box>
                        <Typography
                            variant="h5"
                            fontWeight={700}
                        >
                            Delete Supplier Contact
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Review the contact before confirming deletion.
                        </Typography>
                    </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Alert severity="warning" sx={{ mb: 3 }}>
                    Are you sure you want to delete this supplier contact?
                    This action may not be reversible.
                </Alert>

                <Stack spacing={2}>
                    <DetailRow
                        icon={<Person />}
                        label="Contact ID"
                        value={contactId}
                    />

                    <DetailRow
                        icon={<Person />}
                        label="Contact Name"
                        value={contactName}
                    />

                    <DetailRow
                        icon={<Email />}
                        label="Email"
                        value={email}
                    />

                    <DetailRow
                        icon={<Phone />}
                        label="Phone"
                        value={phone}
                    />

                    <DetailRow
                        icon={<Business />}
                        label="Supplier ID"
                        value={supplierId}
                    />
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Stack
                    direction={{ xs: "column-reverse", sm: "row" }}
                    spacing={1.5}
                    justifyContent="flex-end"
                >
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() => navigate("/supplier-contacts")}
                        disabled={deleting}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={handleDelete}
                        disabled={deleting}
                    >
                        {deleting
                            ? "Deleting..."
                            : "Confirm Delete"}
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    </Container>
);


}

function DetailRow({ icon, label, value }) {
return (
<Box
sx={{
display: "flex",
alignItems: "center",
gap: 1.5,
p: 1.5,
border: 1,
borderColor: "divider",
borderRadius: 2
}}
>
<Box
sx={{
color: "text.secondary",
display: "flex",
alignItems: "center"
}}
>
{icon} </Box>


        <Box sx={{ minWidth: 0 }}>
            <Typography
                variant="caption"
                color="text.secondary"
            >
                {label}
            </Typography>

            <Typography
                variant="body2"
                fontWeight={600}
                sx={{ overflowWrap: "anywhere" }}
            >
                {value}
            </Typography>
        </Box>
    </Box>
);
}

export default SupplierContactDelete;
