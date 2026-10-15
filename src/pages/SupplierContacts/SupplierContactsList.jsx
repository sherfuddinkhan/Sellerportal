import React, {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Grid,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Typography,
    CircularProgress,
    Snackbar,
    Alert,
    IconButton,
    InputAdornment,
    Divider,
    FormControlLabel,
    Switch,
    Chip,
    Stack,
} from "@mui/material";

import {
    Search,
    Close,
    Save,
    PersonAdd,
    FilterAlt,
    Delete
} from "@mui/icons-material";

import SupplierContactToolbar from "./SupplierContactToolbar";
import SupplierContactStatistics from "./SupplierContactStatistics";
import SupplierContactTable from "./SupplierContactTable";
import SupplierContactView from "./SupplierContactView";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL = (
    import.meta.env.VITE_API_URL || ""
).replace(/\/$/, "");

const SUPPLIER_CONTACT_API =
    `${API_BASE_URL}/supplier-contacts`;

const SUPPLIER_API =
    `${API_BASE_URL}/Supplier`;

/* =========================================================
   EMPTY FORM
========================================================= */

const INITIAL_FORM = {
    supplierId: "",
    contactName: "",
    designation: "",
    department: "",
    email: "",
    phoneNumber: "",
    alternatePhone: "",
    contactType: "PRIMARY",
    isPrimary: true,
    isActive: true,
    notes: ""
};

/* =========================================================
   SAFE VALUE
========================================================= */

const getValue = (obj, ...keys) => {
    for (const key of keys) {
        const value = obj?.[key];

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            return value;
        }
    }

    return null;
};

/* =========================================================
   NORMALIZE API RESPONSE
========================================================= */

const normalizeArray = (response) => {
    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.$values)) {
        return response.$values;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response?.data?.$values)) {
        return response.data.$values;
    }

    if (Array.isArray(response?.items)) {
        return response.items;
    }

    if (Array.isArray(response?.result)) {
        return response.result;
    }

    if (Array.isArray(response?.data?.items)) {
        return response.data.items;
    }

    if (Array.isArray(response?.data?.result)) {
        return response.data.result;
    }

    return [];
};

/* =========================================================
   GET CONTACT ID
   Backend response uses partyContactId
========================================================= */

const getContactId = (contact) => {
    return getValue(
        contact,
        "partyContactId",
        "PartyContactId",
        "supplierContactId",
        "SupplierContactId",
        "id",
        "Id"
    );
};

/* =========================================================
   GET SUPPLIER ID
========================================================= */

const getSupplierId = (contact) => {
    return getValue(
        contact,
        "supplierId",
        "SupplierId"
    );
};

/* =========================================================
   CHECK PRIMARY CONTACT
========================================================= */

const isPrimaryContact = (contact) => {
    const contactType = getValue(
        contact,
        "contactType",
        "ContactType"
    );

    if (
        String(contactType ?? "")
            .trim()
            .toUpperCase() === "PRIMARY"
    ) {
        return true;
    }

    const value = getValue(
        contact,
        "isPrimary",
        "IsPrimary"
    );

    return (
        value === true ||
        value === 1 ||
        String(value).toLowerCase() === "true"
    );
};

/* =========================================================
   CHECK ACTIVE CONTACT
   Backend currently does not return isActive.
   Default to true when missing.
========================================================= */

const isActiveContact = (contact) => {
    const value = getValue(
        contact,
        "isActive",
        "IsActive"
    );

    if (value === null) {
        return true;
    }

    return (
        value === true ||
        value === 1 ||
        String(value).toLowerCase() === "true" ||
        String(value).toLowerCase() === "active"
    );
};

/* =========================================================
   NORMALIZE CONTACT FOR FORM
========================================================= */

const normalizeContact = (contact) => {
    const primary = isPrimaryContact(contact);

    return {
        supplierId:
            getValue(
                contact,
                "supplierId",
                "SupplierId"
            ) ?? "",

        contactName:
            getValue(
                contact,
                "contactName",
                "ContactName",
                "name",
                "Name"
            ) ?? "",

        designation:
            getValue(
                contact,
                "designation",
                "Designation",
                "jobTitle",
                "JobTitle",
                "position",
                "Position"
            ) ?? "",

        department:
            getValue(
                contact,
                "department",
                "Department"
            ) ?? "",

        email:
            getValue(
                contact,
                "email",
                "Email",
                "emailAddress",
                "EmailAddress"
            ) ?? "",

        phoneNumber:
            getValue(
                contact,
                "phoneNumber",
                "PhoneNumber",
                "phone",
                "Phone",
                "mobileNumber",
                "MobileNumber"
            ) ?? "",

        alternatePhone:
            getValue(
                contact,
                "alternatePhone",
                "AlternatePhone",
                "alternatePhoneNumber",
                "AlternatePhoneNumber"
            ) ?? "",

        contactType:
            getValue(
                contact,
                "contactType",
                "ContactType"
            ) ?? (primary ? "PRIMARY" : "STANDARD"),

        isPrimary: primary,

        isActive: isActiveContact(contact),

        notes:
            getValue(
                contact,
                "notes",
                "Notes",
                "remarks",
                "Remarks"
            ) ?? ""
    };
};

/* =========================================================
   COMPONENT
========================================================= */

const SupplierContactsList = () => {

    /* =====================================================
       STATE
    ===================================================== */

    const [supplierContacts, setSupplierContacts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");

    const [statusFilter, setStatusFilter] = useState("all");
    const [primaryFilter, setPrimaryFilter] = useState("all");
    const [supplierFilter, setSupplierFilter] = useState("all");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [formOpen, setFormOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [editingContact, setEditingContact] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null);
    const [contactToDelete, setContactToDelete] = useState(null);

    const [formData, setFormData] = useState(INITIAL_FORM);
    const [formErrors, setFormErrors] = useState({});

    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    /* =====================================================
       NOTIFICATION
    ===================================================== */

    const showNotification = (
        message,
        severity = "success"
    ) => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    const closeNotification = (_, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setNotification((previous) => ({
            ...previous,
            open: false
        }));
    };

    /* =====================================================
       GET ALL SUPPLIER CONTACTS
       GET /api/supplier-contacts/all
    ===================================================== */

    const fetchSupplierContacts = useCallback(async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${SUPPLIER_CONTACT_API}/all`
            );

            const records = normalizeArray(response.data);

            console.log(
                "Supplier Contacts API Response:",
                records
            );

            setSupplierContacts(records);
        } catch (error) {
            console.error(
                "GET ALL SUPPLIER CONTACTS ERROR:",
                error.response?.data ?? error.message
            );

            showNotification(
                error.response?.data?.message ||
                error.response?.data?.title ||
                "Failed to load supplier contacts.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    /* =====================================================
       GET ALL SUPPLIERS
    ===================================================== */

    const fetchSuppliers = useCallback(async () => {
        try {
            const response = await axios.get(
                SUPPLIER_API
            );

            const records = normalizeArray(response.data);

            setSuppliers(records);
        } catch (error) {
            console.error(
                "GET SUPPLIERS ERROR:",
                error.response?.data ?? error.message
            );

            showNotification(
                "Failed to load suppliers for the contact form.",
                "error"
            );
        }
    }, []);

    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {
        fetchSupplierContacts();
        fetchSuppliers();
    }, [
        fetchSupplierContacts,
        fetchSuppliers
    ]);

    /* =====================================================
       FILTER SUPPLIER CONTACTS
    ===================================================== */

    const filteredContacts = useMemo(() => {
        const search = searchTerm
            .trim()
            .toLowerCase();

        return supplierContacts.filter((contact) => {

            const id = getContactId(contact);

            const name = getValue(
                contact,
                "contactName",
                "ContactName",
                "name",
                "Name"
            );

            const supplierName = getValue(
                contact,
                "supplierName",
                "SupplierName"
            );

            const email = getValue(
                contact,
                "email",
                "Email",
                "emailAddress",
                "EmailAddress"
            );

            const phone = getValue(
                contact,
                "phoneNumber",
                "PhoneNumber",
                "phone",
                "Phone",
                "mobileNumber",
                "MobileNumber"
            );

            const designation = getValue(
                contact,
                "designation",
                "Designation",
                "jobTitle",
                "JobTitle"
            );

            const contactSupplierId =
                getSupplierId(contact);

            const contactType = getValue(
                contact,
                "contactType",
                "ContactType"
            );

            const matchesSearch =
                !search ||
                [
                    id,
                    name,
                    supplierName,
                    email,
                    phone,
                    designation,
                    contactType,
                    contactSupplierId
                ].some((value) =>
                    String(value ?? "")
                        .toLowerCase()
                        .includes(search)
                );

            const active =
                isActiveContact(contact);

            const primary =
                isPrimaryContact(contact);

            const matchesStatus =
                statusFilter === "all" ||
                (
                    statusFilter === "active" &&
                    active
                ) ||
                (
                    statusFilter === "inactive" &&
                    !active
                );

            const matchesPrimary =
                primaryFilter === "all" ||
                (
                    primaryFilter === "primary" &&
                    primary
                ) ||
                (
                    primaryFilter === "standard" &&
                    !primary
                );

            const matchesSupplier =
                supplierFilter === "all" ||
                String(contactSupplierId) ===
                    String(supplierFilter);

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPrimary &&
                matchesSupplier
            );
        });
    }, [
        supplierContacts,
        searchTerm,
        statusFilter,
        primaryFilter,
        supplierFilter
    ]);


    const navigate = useNavigate();

    const handleDeleteContact = (contact) => {
    const id =
        contact?.partyContactId ??
        contact?.PartyContactId ??
        contact?.supplierContactId ??
        contact?.SupplierContactId;

    if (!id || Number(id) <= 0) {
        showNotification("Supplier contact ID is missing.", "error");
        return;
    }

    navigate(`/supplier-contacts/${id}/delete`);
};
    /* =====================================================
       PAGINATION
    ===================================================== */

    const paginatedContacts = useMemo(() => {
        const start = page * rowsPerPage;

        return filteredContacts.slice(
            start,
            start + rowsPerPage
        );
    }, [
        filteredContacts,
        page,
        rowsPerPage
    ]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (value) => {
        setRowsPerPage(value);
        setPage(0);
    };

    /* =====================================================
       RESET FORM
    ===================================================== */

    const resetForm = () => {
        setFormData({
            ...INITIAL_FORM
        });

        setFormErrors({});
        setEditingContact(null);
    };


// Navigate to the Create page
const handleAddContact = () => {
    navigate("/supplier-contacts/create");
};

// Navigate to the Edit page
const handleEditContact = (contact) => {
    const id = getContactId(contact);

    if (id == null) {
        showNotification(
            "Supplier contact ID is missing.",
            "error"
        );
        return;
    }

    navigate(`/supplier-contacts/${id}/edit`, {
        state: {
            supplierContact: contact
        }
    });
};

// Navigate to the View page
const handleViewContact = (contact) => {
    const id = getContactId(contact);

    if (id == null) {
        showNotification(
            "Supplier contact ID is missing.",
            "error"
        );
        return;
    }

    navigate(`/supplier-contacts/${id}/view`, {
        state: {
            supplierContact: contact
        }
    });
};

    /* =====================================================
       CLOSE FORM
    ===================================================== */

    const handleCloseForm = () => {
        if (saving) {
            return;
        }

        setFormOpen(false);
        resetForm();
    };

    /* =====================================================
       FORM INPUT CHANGE
    ===================================================== */

    const handleFormChange = (event) => {
        const {
            name,
            value,
            checked,
            type
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));

        setFormErrors((previous) => ({
            ...previous,
            [name]: ""
        }));
    };

    /* =====================================================
       VALIDATE FORM
    ===================================================== */

    const validateForm = () => {
        const errors = {};

        if (!formData.supplierId) {
            errors.supplierId =
                "Please select a supplier.";
        }

        if (!formData.contactName.trim()) {
            errors.contactName =
                "Contact name is required.";
        }

        if (
            formData.email.trim() &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                formData.email.trim()
            )
        ) {
            errors.email =
                "Enter a valid email address.";
        }

        setFormErrors(errors);

        return (
            Object.keys(errors).length === 0
        );
    };

    /* =====================================================
       CREATE / UPDATE SUPPLIER CONTACT
    ===================================================== */

    const handleSubmitContact = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const payload = {
            supplierId:
                Number(formData.supplierId),

            contactType:
                formData.isPrimary
                    ? "PRIMARY"
                    : "STANDARD",

            name:
                formData.contactName.trim(),

            contactName:
                formData.contactName.trim(),

            email:
                formData.email.trim() || null,

            phone:
                formData.phoneNumber.trim() || null,

            designation:
                formData.designation.trim() || null,

            department:
                formData.department.trim() || null,

            alternatePhone:
                formData.alternatePhone.trim() || null,

            isPrimary:
                Boolean(formData.isPrimary),

            isActive:
                Boolean(formData.isActive),

            notes:
                formData.notes.trim() || null
        };

        try {
            setSaving(true);

            /* =================================================
               UPDATE
               PUT /api/supplier-contacts/{id}
            ================================================= */

            if (editingContact) {

                const id =
                    getContactId(editingContact);

                if (id == null) {
                    throw new Error(
                        "Supplier contact ID is missing."
                    );
                }

                console.log(
                    "Updating Supplier Contact:",
                    id,
                    payload
                );

                await axios.put(
                    `${SUPPLIER_CONTACT_API}/${id}`,
                    payload
                );

                showNotification(
                    "Supplier contact updated successfully."
                );

            } else {

                /* =============================================
                   CREATE
                   POST /api/supplier-contacts
                ============================================= */

                console.log(
                    "Creating Supplier Contact:",
                    payload
                );

                await axios.post(
                    SUPPLIER_CONTACT_API,
                    payload
                );

                showNotification(
                    "Supplier contact created successfully."
                );
            }

            setFormOpen(false);

            resetForm();

            await fetchSupplierContacts();

        } catch (error) {
            console.error(
                "SAVE SUPPLIER CONTACT ERROR:",
                error.response?.data ??
                error.message
            );

            showNotification(
                error.response?.data?.message ||
                error.response?.data?.title ||
                error.message ||
                "Failed to save supplier contact.",
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    /* =====================================================
       VIEW CONTACT
    ===================================================== */

    const handleCloseView = () => {
        setViewOpen(false);
        setSelectedContact(null);
    };

    const handleEditFromView = (contact) => {
        setViewOpen(false);
        handleEditContact(contact);
    };

    /* =====================================================
       CONFIRM DELETE
       DELETE /api/supplier-contacts/{id}
    ===================================================== */

    const handleConfirmDelete = async () => {
        if (!contactToDelete || deleting) {
            return;
        }

        const id =
            getContactId(contactToDelete);

        if (id == null) {
            showNotification(
                "Cannot delete contact because its ID is missing.",
                "error"
            );

            return;
        }

        try {
            setDeleting(true);

            console.log(
                "Deleting Supplier Contact:",
                id
            );

            await axios.delete(
                `${SUPPLIER_CONTACT_API}/${id}`
            );

            setDeleteOpen(false);
            setContactToDelete(null);

            showNotification(
                "Supplier contact deleted successfully."
            );

            await fetchSupplierContacts();

        } catch (error) {
            console.error(
                "DELETE SUPPLIER CONTACT ERROR:",
                error.response?.data ??
                error.message
            );

            showNotification(
                error.response?.data?.message ||
                error.response?.data?.title ||
                "Failed to delete supplier contact.",
                "error"
            );
        } finally {
            setDeleting(false);
        }
    };

    /* =====================================================
       EXPORT CONTACTS TO CSV
    ===================================================== */

    const handleExportContacts = () => {
        if (filteredContacts.length === 0) {
            showNotification(
                "There are no supplier contacts to export.",
                "warning"
            );

            return;
        }

        const headers = [
            "Contact ID",
            "Supplier ID",
            "Supplier Name",
            "Contact Type",
            "Contact Name",
            "Designation",
            "Department",
            "Email",
            "Phone Number",
            "Alternate Phone",
            "Primary Contact",
            "Active",
            "Seller ID",
            "Customer ID",
            "Created Date",
            "Notes"
        ];

        const escapeCsv = (value) => {
            const text =
                String(value ?? "");

            return `"${text.replace(
                /"/g,
                '""'
            )}"`;
        };

        const rows =
            filteredContacts.map(
                (contact) => [
                    getContactId(contact),

                    getValue(
                        contact,
                        "supplierId",
                        "SupplierId"
                    ),

                    getValue(
                        contact,
                        "supplierName",
                        "SupplierName"
                    ),

                    getValue(
                        contact,
                        "contactType",
                        "ContactType"
                    ),

                    getValue(
                        contact,
                        "contactName",
                        "ContactName",
                        "name",
                        "Name"
                    ),

                    getValue(
                        contact,
                        "designation",
                        "Designation",
                        "jobTitle",
                        "JobTitle"
                    ),

                    getValue(
                        contact,
                        "department",
                        "Department"
                    ),

                    getValue(
                        contact,
                        "email",
                        "Email"
                    ),

                    getValue(
                        contact,
                        "phoneNumber",
                        "PhoneNumber",
                        "phone",
                        "Phone"
                    ),

                    getValue(
                        contact,
                        "alternatePhone",
                        "AlternatePhone"
                    ),

                    isPrimaryContact(contact)
                        ? "Yes"
                        : "No",

                    isActiveContact(contact)
                        ? "Yes"
                        : "No",

                    getValue(
                        contact,
                        "sellerId",
                        "SellerId"
                    ),

                    getValue(
                        contact,
                        "customerId",
                        "CustomerId"
                    ),

                    getValue(
                        contact,
                        "createdDate",
                        "CreatedDate"
                    ),

                    getValue(
                        contact,
                        "notes",
                        "Notes"
                    )
                ]
            );

        const csvContent = [
            headers
                .map(escapeCsv)
                .join(","),

            ...rows.map((row) =>
                row
                    .map(escapeCsv)
                    .join(",")
            )
        ].join("\r\n");

        const blob = new Blob(
            [
                "\uFEFF",
                csvContent
            ],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            "supplier-contacts.csv";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        showNotification(
            "Supplier contacts exported successfully."
        );
    };

    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    const handleClearFilters = () => {
        setSearchTerm("");
        setStatusFilter("all");
        setPrimaryFilter("all");
        setSupplierFilter("all");
        setPage(0);
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box
            sx={{
                p: {
                    xs: 1.5,
                    md: 3
                }
            }}
        >

            {/* =================================================
                TOOLBAR
            ================================================= */}

            <SupplierContactToolbar
                title="Supplier Contacts"
                subtitle="Manage supplier contact information"
                totalContacts={
                    supplierContacts.length
                }
                activeContacts={
                    supplierContacts.filter(
                        (contact) =>
                            isActiveContact(contact)
                    ).length
                }
                loading={loading}
                onAdd={handleAddContact}
                onRefresh={fetchSupplierContacts}
                onExport={handleExportContacts}
            />

            {/* =================================================
                STATISTICS
            ================================================= */}

            <SupplierContactStatistics
                supplierContacts={
                    supplierContacts
                }
                loading={loading}
            />

            {/* =================================================
                SEARCH AND FILTERS
            ================================================= */}

            <Paper
                elevation={1}
                sx={{
                    p: 2.5,
                    mt: 3,
                    mb: 3,
                    borderRadius: 3
                }}
            >

                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mb: 2 }}
                >
                    <FilterAlt color="primary" />

                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        Search and Filters
                    </Typography>

                    <Box sx={{ flex: 1 }} />

                    <Button
                        size="small"
                        onClick={
                            handleClearFilters
                        }
                    >
                        Clear Filters
                    </Button>
                </Stack>

                <Grid
                    container
                    spacing={2}
                >

                    {/* SEARCH */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >
                        <TextField
                            fullWidth
                            size="small"
                            label="Search contacts"
                            placeholder="Name, email, phone, supplier..."
                            value={searchTerm}
                            onChange={(event) => {
                                setSearchTerm(
                                    event.target.value
                                );

                                setPage(0);
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>

                    {/* STATUS */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={2.5}
                    >
                        <TextField
                            select
                            fullWidth
                            size="small"
                            label="Contact Status"
                            value={statusFilter}
                            onChange={(event) => {
                                setStatusFilter(
                                    event.target.value
                                );

                                setPage(0);
                            }}
                        >
                            <MenuItem value="all">
                                All Statuses
                            </MenuItem>

                            <MenuItem value="active">
                                Active
                            </MenuItem>

                            <MenuItem value="inactive">
                                Inactive
                            </MenuItem>
                        </TextField>
                    </Grid>

                    {/* PRIMARY / STANDARD */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={2.5}
                    >
                        <TextField
                            select
                            fullWidth
                            size="small"
                            label="Contact Type"
                            value={primaryFilter}
                            onChange={(event) => {
                                setPrimaryFilter(
                                    event.target.value
                                );

                                setPage(0);
                            }}
                        >
                            <MenuItem value="all">
                                All Contacts
                            </MenuItem>

                            <MenuItem value="primary">
                                Primary
                            </MenuItem>

                            <MenuItem value="standard">
                                Standard
                            </MenuItem>
                        </TextField>
                    </Grid>

                    {/* SUPPLIER */}

                    <Grid
                        item
                        xs={12}
                        md={3}
                    >
                        <TextField
                            select
                            fullWidth
                            size="small"
                            label="Supplier"
                            value={supplierFilter}
                            onChange={(event) => {
                                setSupplierFilter(
                                    event.target.value
                                );

                                setPage(0);
                            }}
                        >
                            <MenuItem value="all">
                                All Suppliers
                            </MenuItem>

                            {suppliers.map(
                                (supplier, index) => {

                                    const id =
                                        getValue(
                                            supplier,
                                            "supplierId",
                                            "SupplierId",
                                            "id",
                                            "Id"
                                        );

                                    const name =
                                        getValue(
                                            supplier,
                                            "supplierName",
                                            "SupplierName",
                                            "name",
                                            "Name"
                                        ) ||
                                        `Supplier ${
                                            id ??
                                            index + 1
                                        }`;

                                    if (
                                        id == null
                                    ) {
                                        return null;
                                    }

                                    return (
                                        <MenuItem
                                            key={id}
                                            value={String(
                                                id
                                            )}
                                        >
                                            {name}
                                        </MenuItem>
                                    );
                                }
                            )}
                        </TextField>
                    </Grid>

                </Grid>

                <Box sx={{ mt: 2 }}>
                    <Chip
                        size="small"
                        variant="outlined"
                        label={`${filteredContacts.length} matching contact(s)`}
                    />
                </Box>

            </Paper>

            {/* =================================================
                CONTACT TABLE
            ================================================= */}

           <SupplierContactTable
    supplierContacts={paginatedContacts}
    loading={loading}
    page={page}
    rowsPerPage={rowsPerPage}
    totalCount={filteredContacts.length}
    onPageChange={handlePageChange}
    onRowsPerPageChange={handleRowsPerPageChange}
    onView={handleViewContact}
    onEdit={handleEditContact}
    onDelete={handleDeleteContact}
    emptyMessage="No supplier contacts match your search."
/>

            {/* =================================================
                CREATE / EDIT DIALOG
            ================================================= */}

            <Dialog
                open={formOpen}
                onClose={handleCloseForm}
                fullWidth
                maxWidth="md"
            >

                <Box
                    component="form"
                    onSubmit={
                        handleSubmitContact
                    }
                >

                    <DialogTitle
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1
                        }}
                    >

                        {editingContact
                            ? "Edit Supplier Contact"
                            : "Create Supplier Contact"}

                        <Box
                            sx={{
                                flex: 1
                            }}
                        />

                        <IconButton
                            onClick={
                                handleCloseForm
                            }
                            disabled={saving}
                            aria-label="Close form"
                        >
                            <Close />
                        </IconButton>

                    </DialogTitle>

                    <Divider />

                    <DialogContent
                        sx={{ pt: 3 }}
                    >

                        <Grid
                            container
                            spacing={2}
                        >

                            {/* BASIC INFORMATION */}

                            <Grid xs={12}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={700}
                                >
                                    Basic Information
                                </Typography>
                            </Grid>

                            {/* SUPPLIER */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                            >
                                <TextField
                                    select
                                    fullWidth
                                    required
                                    label="Supplier"
                                    name="supplierId"
                                    value={
                                        formData.supplierId
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    error={Boolean(
                                        formErrors.supplierId
                                    )}
                                    helperText={
                                        formErrors.supplierId
                                    }
                                >

                                    {suppliers.map(
                                        (
                                            supplier,
                                            index
                                        ) => {

                                            const id =
                                                getValue(
                                                    supplier,
                                                    "supplierId",
                                                    "SupplierId",
                                                    "id",
                                                    "Id"
                                                );

                                            const name =
                                                getValue(
                                                    supplier,
                                                    "supplierName",
                                                    "SupplierName",
                                                    "name",
                                                    "Name"
                                                ) ||
                                                `Supplier ${
                                                    id ??
                                                    index + 1
                                                }`;

                                            if (
                                                id == null
                                            ) {
                                                return null;
                                            }

                                            return (
                                                <MenuItem
                                                    key={id}
                                                    value={String(
                                                        id
                                                    )}
                                                >
                                                    {name}
                                                </MenuItem>
                                            );
                                        }
                                    )}

                                </TextField>
                            </Grid>

                            {/* CONTACT NAME */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                            >
                                <TextField
                                    fullWidth
                                    required
                                    label="Contact Name"
                                    name="contactName"
                                    value={
                                        formData.contactName
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    error={Boolean(
                                        formErrors.contactName
                                    )}
                                    helperText={
                                        formErrors.contactName
                                    }
                                />
                            </Grid>

                            {/* DESIGNATION */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                            >
                                <TextField
                                    fullWidth
                                    label="Designation"
                                    name="designation"
                                    value={
                                        formData.designation
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                />
                            </Grid>

                            {/* DEPARTMENT */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                            >
                                <TextField
                                    fullWidth
                                    label="Department"
                                    name="department"
                                    value={
                                        formData.department
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                />
                            </Grid>

                            {/* CONTACT DETAILS */}

                            <Grid xs={12}>

                                <Divider
                                    sx={{
                                        my: 1
                                    }}
                                />

                                <Typography
                                    variant="subtitle1"
                                    fontWeight={700}
                                >
                                    Contact Details
                                </Typography>

                            </Grid>

                            {/* EMAIL */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                            >
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    error={Boolean(
                                        formErrors.email
                                    )}
                                    helperText={
                                        formErrors.email
                                    }
                                />
                            </Grid>

                            {/* PHONE */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                            >
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    name="phoneNumber"
                                    value={
                                        formData.phoneNumber
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                />
                            </Grid>

                            {/* ALTERNATE PHONE */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                            >
                                <TextField
                                    fullWidth
                                    label="Alternate Phone"
                                    name="alternatePhone"
                                    value={
                                        formData.alternatePhone
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                />
                            </Grid>

                            {/* NOTES */}

                            <Grid xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    label="Notes / Remarks"
                                    name="notes"
                                    value={
                                        formData.notes
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                />
                            </Grid>

                            {/* SWITCHES */}

                            <Grid xs={12}>

                                <Divider
                                    sx={{
                                        my: 1
                                    }}
                                />

                                <Stack
                                    direction={{
                                        xs: "column",
                                        sm: "row"
                                    }}
                                    spacing={2}
                                >

                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={
                                                    formData.isPrimary
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setFormData(
                                                        (
                                                            previous
                                                        ) => ({
                                                            ...previous,
                                                            isPrimary:
                                                                event
                                                                    .target
                                                                    .checked
                                                        })
                                                    )
                                                }
                                            />
                                        }
                                        label="Primary Contact"
                                    />

                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={
                                                    formData.isActive
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setFormData(
                                                        (
                                                            previous
                                                        ) => ({
                                                            ...previous,
                                                            isActive:
                                                                event
                                                                    .target
                                                                    .checked
                                                        })
                                                    )
                                                }
                                            />
                                        }
                                        label="Active Contact"
                                    />

                                </Stack>

                            </Grid>

                        </Grid>

                    </DialogContent>

                    <Divider />

                    <DialogActions
                        sx={{ p: 2.5 }}
                    >

                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={
                                handleCloseForm
                            }
                            disabled={saving}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={
                                saving ? (
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                ) : editingContact ? (
                                    <Save />
                                ) : (
                                    <PersonAdd />
                                )
                            }
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : editingContact
                                    ? "Update Contact"
                                    : "Create Contact"}
                        </Button>

                    </DialogActions>

                </Box>

            </Dialog>

            {/* =================================================
                DELETE CONFIRMATION
            ================================================= */}

            <Dialog
                open={deleteOpen}
                onClose={() => {
                    if (!deleting) {
                        setDeleteOpen(false);
                        setContactToDelete(null);
                    }
                }}
                fullWidth
                maxWidth="xs"
            >

                <DialogTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                    }}
                >
                    <Delete color="error" />

                    Delete Supplier Contact
                </DialogTitle>

                <DialogContent>

                    <Typography>

                        Are you sure you want to delete{" "}

                        <strong>
                            {getValue(
                                contactToDelete,
                                "contactName",
                                "ContactName",
                                "name",
                                "Name"
                            ) ||
                                "this contact"}
                        </strong>

                        ?

                        {" "}This action cannot be undone.

                    </Typography>

                </DialogContent>

                <DialogActions
                    sx={{ p: 2 }}
                >

                    <Button
                        color="inherit"
                        onClick={() => {
                            setDeleteOpen(false);
                            setContactToDelete(null);
                        }}
                        disabled={deleting}
                    >
                        Cancel
                    </Button>

                    <Button
                        color="error"
                        variant="contained"
                        onClick={
                            handleConfirmDelete
                        }
                        disabled={deleting}
                        startIcon={
                            deleting ? (
                                <CircularProgress
                                    size={18}
                                    color="inherit"
                                />
                            ) : (
                                <Delete/>
                            )
                        }
                    >
                        {deleting
                            ? "Deleting..."
                            : "Delete"}
                    </Button>

                </DialogActions>

            </Dialog>

            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            <Snackbar
                open={
                    notification.open
                }
                autoHideDuration={5000}
                onClose={
                    closeNotification
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >

                <Alert
                    onClose={
                        closeNotification
                    }
                    severity={
                        notification.severity
                    }
                    variant="filled"
                    sx={{
                        width: "100%"
                    }}
                >
                    {
                        notification.message
                    }
                </Alert>

            </Snackbar>

        </Box>
    );
};

export default SupplierContactsList;
