import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    MenuItem,
    CircularProgress,
    Alert,
    Box,
    Typography,
    Divider,
    Card,
    CardContent,
    Container
} from "@mui/material";

import {
    AddLocationAlt,
    Close,
    Save
} from "@mui/icons-material";


// ============================================================
// Get value supporting camelCase / PascalCase
// ============================================================
const getFieldValue = (data, ...fields) => {
    for (const field of fields) {
        if (
            data?.[field] !== undefined &&
            data?.[field] !== null &&
            String(data?.[field]).trim() !== ""
        ) {
            return data[field];
        }
    }

    return "";
};


// ============================================================
// Initial Form
// ============================================================
const initialFormData = {
    supplierId: "",
    addressType: "Billing",
    addressLine1: "",
    addressLine2: "",
    countryCode: "IN",
    stateCode: "TG",
    city: "",
    pincode: "",
    phone: "",
    latitude: "",
    longitude: "",
    sellerId: "",
    customerId: ""
};


// ============================================================
// Component
// ============================================================
const SupplierAddressCreate = ({
    open,
    onClose,
    onSubmit,
    loading = false
}) => {

    // ========================================================
    // Form State
    // ========================================================
    const [formData, setFormData] = useState(initialFormData);

    const [errors, setErrors] = useState({});

    const [submitError, setSubmitError] = useState("");

    // ========================================================
    // Supplier State
    // ========================================================
    const [suppliers, setSuppliers] = useState([]);

    const [supplierLoading, setSupplierLoading] = useState(false);

    const [supplierError, setSupplierError] = useState("");


    // ========================================================
    // Dialog / Page Mode
    // ========================================================
    const isDialogMode = typeof open === "boolean";

    const isOpen = isDialogMode ? open : true;


    // ========================================================
    // Load Suppliers
    // ========================================================
   useEffect(() => {
    const fetchSuppliers = async () => {
        try {
            setSupplierLoading(true);
            setSupplierError("");

            const response = await axios.get("/api/Supplier");

            console.log("=================================");
            console.log("SUPPLIER API STATUS:", response.status);
            console.log("SUPPLIER API DATA:", response.data);
            console.log("SUPPLIER API DATA TYPE:", typeof response.data);
            console.log("=================================");

            let supplierData = [];

            // Direct array
            if (Array.isArray(response.data)) {
                supplierData = response.data;
            }

            // { data: [...] }
            else if (Array.isArray(response.data?.data)) {
                supplierData = response.data.data;
            }

            // { items: [...] }
            else if (Array.isArray(response.data?.items)) {
                supplierData = response.data.items;
            }

            // { suppliers: [...] }
            else if (Array.isArray(response.data?.suppliers)) {
                supplierData = response.data.suppliers;
            }

            // { result: [...] }
            else if (Array.isArray(response.data?.result)) {
                supplierData = response.data.result;
            }

            // { results: [...] }
            else if (Array.isArray(response.data?.results)) {
                supplierData = response.data.results;
            }

            console.log("SUPPLIER ARRAY:", supplierData);

            setSuppliers(supplierData);

            if (supplierData.length === 0) {
                setSupplierError("No suppliers returned from API.");
            }

        } catch (error) {
            console.error("SUPPLIER API ERROR:", error);
            console.error("ERROR RESPONSE:", error?.response?.data);

            setSupplierError(
                error?.response?.data?.message ||
                error?.response?.data?.title ||
                error?.message ||
                "Unable to load suppliers."
            );
        } finally {
            setSupplierLoading(false);
        }
    };

    fetchSuppliers();
}, []);


    // ========================================================
    // Reset Form When Open
    // ========================================================
    useEffect(() => {

        if (isOpen) {

            setFormData({
                ...initialFormData
            });

            setErrors({});

            setSubmitError("");

        }

    }, [isOpen]);


    // ========================================================
    // Handle Input Change
    // ========================================================
    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));


        setErrors((prev) => ({
            ...prev,
            [name]: ""
        }));


        setSubmitError("");
    };


    // ========================================================
    // Validate Form
    // ========================================================
    const validateForm = () => {

        const newErrors = {};


        if (!formData.supplierId) {

            newErrors.supplierId =
                "Please select a supplier.";

        }


        if (!formData.addressLine1.trim()) {

            newErrors.addressLine1 =
                "Address line 1 is required.";

        }


        if (!formData.city.trim()) {

            newErrors.city =
                "City is required.";

        }


        if (!formData.countryCode.trim()) {

            newErrors.countryCode =
                "Country code is required.";

        }


        if (!formData.stateCode.trim()) {

            newErrors.stateCode =
                "State code is required.";

        }


        if (!formData.pincode.trim()) {

            newErrors.pincode =
                "Pincode is required.";

        }


        if (!formData.phone.trim()) {

            newErrors.phone =
                "Phone is required.";

        }


        setErrors(newErrors);


        return Object.keys(newErrors).length === 0;
    };


    // ========================================================
    // Submit
    // ========================================================
    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!validateForm()) {

            return;

        }


        setSubmitError("");


        const payload = {

            supplierId:
                Number(formData.supplierId),

            addressType:
                formData.addressType.trim(),

            addressLine1:
                formData.addressLine1.trim(),

            addressLine2:
                formData.addressLine2.trim(),

            countryCode:
                formData.countryCode.trim(),

            stateCode:
                formData.stateCode.trim(),

            city:
                formData.city.trim(),

            pincode:
                formData.pincode.trim(),

            phone:
                formData.phone.trim(),

            latitude:
                formData.latitude.trim() ||
                "17.4485",

            longitude:
                formData.longitude.trim() ||
                "78.3908",

            sellerId:
                Number(formData.sellerId) || 0,

            customerId:
                Number(formData.customerId) || 0,

            createdDate:
                new Date().toISOString()
        };


        console.log(
            "Supplier Address Payload:",
            payload
        );


        try {

            await onSubmit(payload);

        } catch (error) {

            console.error(
                "Create supplier address error:",
                error
            );


            setSubmitError(
                error?.response?.data?.message ||
                error?.response?.data?.title ||
                error?.message ||
                "Failed to create supplier address."
            );

        }
    };


    // ========================================================
    // Close
    // ========================================================
const navigate = useNavigate();

const handleClose = () => {

    if (loading) {
        return;
    }

    if (isDialogMode) {
        onClose?.();
    } else {
        navigate("/supplier-addresses");
    }
};


    // ========================================================
    // Supplier Dropdown
    // ========================================================
    const supplierDropdown = (
       <Grid item xs={12} md={6}>
    <TextField
        select
        fullWidth
        required
        label="Supplier"
        name="supplierId"
        value={formData.supplierId}
        onChange={handleChange}
        error={Boolean(errors.supplierId)}
        helperText={
            errors.supplierId ||
            supplierError ||
            (supplierLoading ? "Loading suppliers..." : "")
        }
        disabled={loading || supplierLoading}
    >
        <MenuItem value="">
            {supplierLoading
                ? "Loading suppliers..."
                : "Select Supplier"}
        </MenuItem>

        {!supplierLoading &&
            suppliers.length === 0 && (
                <MenuItem disabled>
                    No suppliers found
                </MenuItem>
            )}

        {suppliers.map((supplier, index) => {
            const id =
                supplier?.supplierId ??
                supplier?.SupplierId ??
                supplier?.id ??
                supplier?.Id ??
                supplier?.supplierID ??
                supplier?.SupplierID;

            const name =
                supplier?.supplierName ??
                supplier?.SupplierName ??
                supplier?.name ??
                supplier?.Name ??
                supplier?.companyName ??
                supplier?.CompanyName ??
                supplier?.supplierCompanyName ??
                supplier?.SupplierCompanyName;

            console.log(
                "SUPPLIER DROPDOWN ITEM:",
                supplier,
                "ID:",
                id,
                "NAME:",
                name
            );

            return (
                <MenuItem
                    key={id ?? index}
                    value={String(id ?? "")}
                >
                    {name || `Supplier ${id}`}
                </MenuItem>
            );
        })}
    </TextField>
</Grid>
    );


    // ========================================================
    // Form Content
    // ========================================================
    const formContent = (
        <>

            {submitError && (

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >

                    {submitError}

                </Alert>

            )}


            <Grid
                container
                spacing={2.5}
            >

                {/* Supplier */}
                {supplierDropdown}


                {/* Address Type */}
                <Grid item xs={12} md={6}>

                    <TextField
                        select
                        fullWidth
                        required
                        label="Address Type"
                        name="addressType"
                        value={formData.addressType}
                        onChange={handleChange}
                        error={Boolean(
                            errors.addressType
                        )}
                        helperText={
                            errors.addressType
                        }
                        disabled={loading}
                    >

                        <MenuItem value="Billing">
                            Billing
                        </MenuItem>

                        <MenuItem value="Shipping">
                            Shipping
                        </MenuItem>

                        <MenuItem value="Office">
                            Office
                        </MenuItem>

                        <MenuItem value="Warehouse">
                            Warehouse
                        </MenuItem>

                    </TextField>

                </Grid>


                {/* Address Line 1 */}
                <Grid item xs={12}>

                    <TextField
                        fullWidth
                        required
                        label="Address Line 1"
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleChange}
                        error={Boolean(
                            errors.addressLine1
                        )}
                        helperText={
                            errors.addressLine1
                        }
                        disabled={loading}
                    />

                </Grid>


                {/* Address Line 2 */}
                <Grid item xs={12}>

                    <TextField
                        fullWidth
                        label="Address Line 2"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleChange}
                        disabled={loading}
                    />

                </Grid>


                {/* Country */}
                <Grid item xs={12} sm={4}>

                    <TextField
                        fullWidth
                        required
                        label="Country Code"
                        name="countryCode"
                        placeholder="IN"
                        value={formData.countryCode}
                        onChange={handleChange}
                        error={Boolean(
                            errors.countryCode
                        )}
                        helperText={
                            errors.countryCode
                        }
                        disabled={loading}
                    />

                </Grid>


                {/* State */}
                <Grid item xs={12} sm={4}>

                    <TextField
                        fullWidth
                        required
                        label="State Code"
                        name="stateCode"
                        placeholder="TG"
                        value={formData.stateCode}
                        onChange={handleChange}
                        error={Boolean(
                            errors.stateCode
                        )}
                        helperText={
                            errors.stateCode
                        }
                        disabled={loading}
                    />

                </Grid>


                {/* City */}
                <Grid item xs={12} sm={4}>

                    <TextField
                        fullWidth
                        required
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        error={Boolean(
                            errors.city
                        )}
                        helperText={
                            errors.city
                        }
                        disabled={loading}
                    />

                </Grid>


                {/* Pincode */}
                <Grid item xs={12} sm={6}>

                    <TextField
                        fullWidth
                        required
                        label="Pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        error={Boolean(
                            errors.pincode
                        )}
                        helperText={
                            errors.pincode
                        }
                        disabled={loading}
                    />

                </Grid>


                {/* Phone */}
                <Grid item xs={12} sm={6}>

                    <TextField
                        fullWidth
                        required
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        error={Boolean(
                            errors.phone
                        )}
                        helperText={
                            errors.phone
                        }
                        disabled={loading}
                    />

                </Grid>


                {/* Latitude */}
                <Grid item xs={12} sm={6}>

                    <TextField
                        fullWidth
                        label="Latitude"
                        name="latitude"
                        placeholder="17.4485"
                        value={formData.latitude}
                        onChange={handleChange}
                        disabled={loading}
                    />

                </Grid>


                {/* Longitude */}
                <Grid item xs={12} sm={6}>

                    <TextField
                        fullWidth
                        label="Longitude"
                        name="longitude"
                        placeholder="78.3908"
                        value={formData.longitude}
                        onChange={handleChange}
                        disabled={loading}
                    />

                </Grid>


                {/* Seller / Customer */}
                <Grid item xs={12}>

                    <Divider sx={{ my: 1 }} />

                    <Typography
                        variant="subtitle2"
                        fontWeight={700}
                    >
                        Seller / Customer
                    </Typography>

                </Grid>


                {/* Seller ID */}
                <Grid item xs={12} sm={6}>

                    <TextField
                        fullWidth
                        label="Seller ID"
                        type="number"
                        name="sellerId"
                        value={formData.sellerId}
                        onChange={handleChange}
                        disabled={loading}
                    />

                </Grid>


                {/* Customer ID */}
                <Grid item xs={12} sm={6}>

                    <TextField
                        fullWidth
                        label="Customer ID"
                        type="number"
                        name="customerId"
                        value={formData.customerId}
                        onChange={handleChange}
                        disabled={loading}
                    />

                </Grid>

            </Grid>

        </>
    );


    // ========================================================
    // PAGE MODE
    // /supplier-addresses/create
    // ========================================================
    if (!isDialogMode) {

        return (

            <Container
                maxWidth="md"
                sx={{ py: 4 }}
            >

                <Card>

                    <CardContent sx={{ p: 3 }}>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                mb: 2
                            }}
                        >

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 46,
                                    height: 46,
                                    borderRadius: 2,
                                    bgcolor: "action.hover",
                                    color: "primary.main"
                                }}
                            >

                                <AddLocationAlt />

                            </Box>


                            <Box>

                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                >
                                    Create Supplier Address
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Enter the supplier address
                                    details below
                                </Typography>

                            </Box>

                        </Box>


                        <Divider sx={{ mb: 3 }} />


                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            noValidate
                        >

                            {formContent}


                            <Box
                                sx={{
                                    mt: 3,
                                    display: "flex",
                                    gap: 2
                                }}
                            >

                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    startIcon={<Close />}
                                    onClick={handleClose}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>


                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={
                                        loading
                                            ? (
                                                <CircularProgress
                                                    size={18}
                                                    color="inherit"
                                                />
                                            )
                                            : <Save />
                                    }
                                    disabled={loading}
                                >

                                    {loading
                                        ? "Creating..."
                                        : "Create Address"
                                    }

                                </Button>

                            </Box>

                        </Box>

                    </CardContent>

                </Card>

            </Container>

        );

    }


    // ========================================================
    // DIALOG MODE
    // ========================================================
    return (

        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
            scroll="paper"
        >

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
            >

                <DialogTitle>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5
                        }}
                    >

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 46,
                                height: 46,
                                borderRadius: 2,
                                bgcolor: "action.hover",
                                color: "primary.main"
                            }}
                        >

                            <AddLocationAlt />

                        </Box>


                        <Box>

                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                Create Supplier Address
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Enter the supplier address
                                details below
                            </Typography>

                        </Box>

                    </Box>

                </DialogTitle>


                <Divider />


                <DialogContent sx={{ pt: 3 }}>

                    {formContent}

                </DialogContent>


                <Divider />


                <DialogActions sx={{ p: 2 }}>

                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<Close />}
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>


                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={
                            loading
                                ? (
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                )
                                : <Save />
                        }
                        disabled={loading}
                    >

                        {loading
                            ? "Creating..."
                            : "Create Address"
                        }

                    </Button>

                </DialogActions>

            </Box>

        </Dialog>

    );
};


export default SupplierAddressCreate;
