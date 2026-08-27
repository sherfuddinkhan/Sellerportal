// =========================================================
// WishlistModal.jsx
// =========================================================

import React, { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";

import {
    Add,
    Close,
    Delete,
    Edit,
    Favorite,
    Inventory2,
    Save,
} from "@mui/icons-material";

// =========================================================
// DEFAULT FORM
// =========================================================

const EMPTY_FORM = {
    wishlistId: "",
    customerId: "",
    customerName: "",
    productId: "",
    productName: "",
    productCode: "",
    quantity: 1,
    price: "",
    status: "Active",
    notes: "",
};

// =========================================================
// COMPONENT
// =========================================================

const WishlistModal = ({
    open = false,
    onClose,
    wishlist = null,

    mode = "view",

    customers = [],
    products = [],

    onSave,
    onDelete,

    loading = false,
}) => {
    // =========================================================
    // STATE
    // =========================================================

    const [formData, setFormData] =
        useState(EMPTY_FORM);

    const [errors, setErrors] = useState({});

    const [saving, setSaving] =
        useState(false);

    const [deleting, setDeleting] =
        useState(false);

    // =========================================================
    // DETERMINE MODE
    // =========================================================

    const isView =
        mode === "view";

    const isEdit =
        mode === "edit";

    const isCreate =
        mode === "create" ||
        mode === "add";

    // =========================================================
    // LOAD WISHLIST
    // =========================================================

    useEffect(() => {
        if (!open) {
            return;
        }

        if (wishlist) {
            setFormData({
                ...EMPTY_FORM,
                ...wishlist,

                wishlistId:
                    wishlist.wishlistId ??
                    wishlist.id ??
                    "",

                customerId:
                    wishlist.customerId ??
                    wishlist.customer?.customerId ??
                    "",

                customerName:
                    wishlist.customerName ??
                    wishlist.customer?.customerName ??
                    "",

                productId:
                    wishlist.productId ??
                    wishlist.product?.productId ??
                    "",

                productName:
                    wishlist.productName ??
                    wishlist.product?.productName ??
                    "",

                productCode:
                    wishlist.productCode ??
                    wishlist.product?.productCode ??
                    "",

                quantity:
                    wishlist.quantity ??
                    1,

                price:
                    wishlist.price ??
                    wishlist.product?.price ??
                    "",

                status:
                    wishlist.status ??
                    "Active",

                notes:
                    wishlist.notes ??
                    "",
            });
        } else {
            setFormData(EMPTY_FORM);
        }

        setErrors({});
    }, [open, wishlist]);

    // =========================================================
    // HANDLE CHANGE
    // =========================================================

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    // =========================================================
    // CUSTOMER CHANGE
    // =========================================================

    const handleCustomerChange = (
        event
    ) => {
        const customerId =
            event.target.value;

        const customer =
            customers.find(
                (item) =>
                    String(
                        item.customerId ??
                            item.id
                    ) ===
                    String(customerId)
            );

        setFormData((prev) => ({
            ...prev,
            customerId,
            customerName:
                customer?.customerName ??
                customer?.name ??
                "",
        }));

        setErrors((prev) => ({
            ...prev,
            customerId: "",
        }));
    };

    // =========================================================
    // PRODUCT CHANGE
    // =========================================================

    const handleProductChange = (
        event
    ) => {
        const productId =
            event.target.value;

        const product =
            products.find(
                (item) =>
                    String(
                        item.productId ??
                            item.id
                    ) ===
                    String(productId)
            );

        setFormData((prev) => ({
            ...prev,

            productId,

            productName:
                product?.productName ??
                product?.name ??
                "",

            productCode:
                product?.productCode ??
                product?.sku ??
                "",

            price:
                product?.price ??
                product?.sellingPrice ??
                prev.price,
        }));

        setErrors((prev) => ({
            ...prev,
            productId: "",
        }));
    };

    // =========================================================
    // VALIDATION
    // =========================================================

    const validate = () => {
        const newErrors = {};

        if (!formData.customerId) {
            newErrors.customerId =
                "Customer is required.";
        }

        if (!formData.productId) {
            newErrors.productId =
                "Product is required.";
        }

        if (
            !formData.quantity ||
            Number(formData.quantity) <= 0
        ) {
            newErrors.quantity =
                "Quantity must be greater than 0.";
        }

        if (
            formData.price !== "" &&
            Number(formData.price) < 0
        ) {
            newErrors.price =
                "Price cannot be negative.";
        }

        setErrors(newErrors);

        return (
            Object.keys(newErrors).length === 0
        );
    };

    // =========================================================
    // SAVE
    // =========================================================

    const handleSave = async () => {
        if (!validate()) {
            return;
        }

        try {
            setSaving(true);

            const payload = {
                ...formData,

                wishlistId:
                    formData.wishlistId || undefined,

                customerId:
                    Number(
                        formData.customerId
                    ),

                productId:
                    Number(
                        formData.productId
                    ),

                quantity:
                    Number(
                        formData.quantity
                    ),

                price:
                    formData.price === ""
                        ? null
                        : Number(
                              formData.price
                          ),
            };

            if (onSave) {
                await onSave(
                    payload,
                    isEdit
                );
            }

            if (onClose) {
                onClose();
            }
        } catch (error) {
            console.error(
                "Wishlist save error:",
                error
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = async () => {
        if (!formData.wishlistId) {
            return;
        }

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this wishlist item?"
            );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);

            if (onDelete) {
                await onDelete(
                    formData.wishlistId,
                    formData
                );
            }

            if (onClose) {
                onClose();
            }
        } catch (error) {
            console.error(
                "Wishlist delete error:",
                error
            );
        } finally {
            setDeleting(false);
        }
    };

    // =========================================================
    // TITLE
    // =========================================================

    const getTitle = () => {
        if (isCreate) {
            return "Add Wishlist";
        }

        if (isEdit) {
            return "Edit Wishlist";
        }

        return "Wishlist Details";
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            aria-labelledby="wishlist-dialog-title"
        >
            {/* =====================================================
                TITLE
               ===================================================== */}

            <DialogTitle
                id="wishlist-dialog-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "space-between",
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <Favorite color="error" />

                    <Box>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            {getTitle()}
                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Wishlist information
                        </Typography>
                    </Box>
                </Box>

                <IconButton
                    onClick={onClose}
                    aria-label="Close"
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <Divider />

            {/* =====================================================
                CONTENT
               ===================================================== */}

            <DialogContent
                sx={{ pt: 3 }}
            >
                {/* VIEW MODE SUMMARY */}

                {isView && (
                    <Alert
                        severity="info"
                        sx={{ mb: 3 }}
                    >
                        You are viewing this wishlist
                        item. Click Edit to modify it.
                    </Alert>
                )}

                <Grid
                    container
                    spacing={2}
                >
                    {/* =================================================
                        WISHLIST ID
                       ================================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >
                        <TextField
                            fullWidth
                            label="Wishlist ID"
                            value={
                                formData.wishlistId ||
                                "New"
                            }
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>

                    {/* =================================================
                        STATUS
                       ================================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >
                        <TextField
                            fullWidth
                            select
                            label="Status"
                            name="status"
                            value={
                                formData.status
                            }
                            onChange={
                                handleChange
                            }
                            disabled={isView}
                        >
                            <MenuItem value="Active">
                                Active
                            </MenuItem>

                            <MenuItem value="Inactive">
                                Inactive
                            </MenuItem>

                            <MenuItem value="Purchased">
                                Purchased
                            </MenuItem>

                            <MenuItem value="Removed">
                                Removed
                            </MenuItem>
                        </TextField>
                    </Grid>

                    {/* =================================================
                        CUSTOMER
                       ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        {customers.length >
                        0 ? (
                            <TextField
                                fullWidth
                                select
                                required
                                label="Customer"
                                name="customerId"
                                value={
                                    formData.customerId
                                }
                                onChange={
                                    handleCustomerChange
                                }
                                disabled={
                                    isView
                                }
                                error={
                                    !!errors.customerId
                                }
                                helperText={
                                    errors.customerId
                                }
                            >
                                {customers.map(
                                    (
                                        customer
                                    ) => (
                                        <MenuItem
                                            key={
                                                customer.customerId ??
                                                customer.id
                                            }
                                            value={
                                                customer.customerId ??
                                                customer.id
                                            }
                                        >
                                            {customer.customerName ??
                                                customer.name ??
                                                `Customer ${
                                                    customer.customerId ??
                                                    customer.id
                                                }`}
                                        </MenuItem>
                                    )
                                )}
                            </TextField>
                        ) : (
                            <TextField
                                fullWidth
                                required
                                label="Customer ID"
                                name="customerId"
                                value={
                                    formData.customerId
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    isView
                                }
                                error={
                                    !!errors.customerId
                                }
                                helperText={
                                    errors.customerId
                                }
                            />
                        )}
                    </Grid>

                    {/* =================================================
                        CUSTOMER NAME
                       ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            label="Customer Name"
                            value={
                                formData.customerName
                            }
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>

                    {/* =================================================
                        PRODUCT
                       ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        {products.length >
                        0 ? (
                            <TextField
                                fullWidth
                                select
                                required
                                label="Product"
                                name="productId"
                                value={
                                    formData.productId
                                }
                                onChange={
                                    handleProductChange
                                }
                                disabled={
                                    isView
                                }
                                error={
                                    !!errors.productId
                                }
                                helperText={
                                    errors.productId
                                }
                            >
                                {products.map(
                                    (
                                        product
                                    ) => (
                                        <MenuItem
                                            key={
                                                product.productId ??
                                                product.id
                                            }
                                            value={
                                                product.productId ??
                                                product.id
                                            }
                                        >
                                            {product.productName ??
                                                product.name ??
                                                `Product ${
                                                    product.productId ??
                                                    product.id
                                                }`}
                                        </MenuItem>
                                    )
                                )}
                            </TextField>
                        ) : (
                            <TextField
                                fullWidth
                                required
                                label="Product ID"
                                name="productId"
                                value={
                                    formData.productId
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    isView
                                }
                                error={
                                    !!errors.productId
                                }
                                helperText={
                                    errors.productId
                                }
                            />
                        )}
                    </Grid>

                    {/* =================================================
                        PRODUCT CODE
                       ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            label="Product Code / SKU"
                            value={
                                formData.productCode
                            }
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>

                    {/* =================================================
                        QUANTITY
                       ================================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >
                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="Quantity"
                            name="quantity"
                            value={
                                formData.quantity
                            }
                            onChange={
                                handleChange
                            }
                            disabled={isView}
                            error={
                                !!errors.quantity
                            }
                            helperText={
                                errors.quantity
                            }
                            inputProps={{
                                min: 1,
                            }}
                        />
                    </Grid>

                    {/* =================================================
                        PRICE
                       ================================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >
                        <TextField
                            fullWidth
                            type="number"
                            label="Price"
                            name="price"
                            value={
                                formData.price
                            }
                            onChange={
                                handleChange
                            }
                            disabled={isView}
                            error={
                                !!errors.price
                            }
                            helperText={
                                errors.price
                            }
                            inputProps={{
                                min: 0,
                                step: "0.01",
                            }}
                            InputProps={{
                                startAdornment:
                                    "₹",
                            }}
                        />
                    </Grid>

                    {/* =================================================
                        STATUS CHIP
                       ================================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >
                        <Box
                            sx={{
                                height: "100%",
                                display: "flex",
                                alignItems:
                                    "center",
                                px: 1,
                            }}
                        >
                            <Chip
                                label={
                                    formData.status ||
                                    "Active"
                                }
                                color={
                                    formData.status ===
                                    "Active"
                                        ? "success"
                                        : "default"
                                }
                                variant="outlined"
                            />
                        </Box>
                    </Grid>

                    {/* =================================================
                        NOTES
                       ================================================= */}

                    <Grid
                        item
                        xs={12}
                    >
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Notes"
                            name="notes"
                            value={
                                formData.notes
                            }
                            onChange={
                                handleChange
                            }
                            disabled={isView}
                            placeholder="Enter optional notes..."
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <Divider />

            {/* =====================================================
                ACTIONS
               ===================================================== */}

            <DialogActions
                sx={{
                    px: 3,
                    py: 2,
                    justifyContent:
                        "space-between",
                }}
            >
                {/* LEFT ACTION */}

                <Box>
                    {!isCreate &&
                        !isView &&
                        formData.wishlistId && (
                            <Button
                                color="error"
                                variant="outlined"
                                startIcon={
                                    <Delete />
                                }
                                onClick={
                                    handleDelete
                                }
                                disabled={
                                    deleting ||
                                    saving ||
                                    loading
                                }
                            >
                                {deleting
                                    ? "Deleting..."
                                    : "Delete"}
                            </Button>
                        )}
                </Box>

                {/* RIGHT ACTIONS */}

                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        disabled={
                            saving ||
                            deleting
                        }
                    >
                        Close
                    </Button>

                    {isView && (
                        <Button
                            variant="contained"
                            startIcon={<Edit />}
                            onClick={() => {
                                /*
                                 * Parent component should
                                 * change mode to "edit".
                                 */
                                if (
                                    onClose
                                ) {
                                    onClose();
                                }
                            }}
                        >
                            Edit
                        </Button>
                    )}

                    {!isView && (
                        <Button
                            variant="contained"
                            startIcon={
                                isCreate ? (
                                    <Add />
                                ) : (
                                    <Save />
                                )
                            }
                            onClick={
                                handleSave
                            }
                            disabled={
                                saving ||
                                deleting ||
                                loading
                            }
                        >
                            {saving
                                ? "Saving..."
                                : isCreate
                                ? "Add Wishlist"
                                : "Save Changes"}
                        </Button>
                    )}
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default WishlistModal;