// =========================================================
// CatalogVariants.jsx
// =========================================================

import React, { useState } from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";

import {
    Add,
    CheckCircle,
    Delete,
    Edit,
    Inventory2,
    Save,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";

// =========================================================
// COMPONENT
// =========================================================

const CatalogVariants = ({
    catalogId = null,
    initialVariants = [],
    loading = false,
    onSave,
    onChange,
}) => {
    // =========================================================
    // STATE
    // =========================================================

    const [variants, setVariants] = useState(
        Array.isArray(initialVariants)
            ? initialVariants
            : []
    );

    const [editingId, setEditingId] =
        useState(null);

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    const [formData, setFormData] =
        useState({
            variantName: "",
            sku: "",
            barcode: "",
            price: "",
            stockQuantity: "",
            attributeValue: "",
            isActive: true,
        });

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
    };

    // =========================================================
    // RESET FORM
    // =========================================================

    const resetForm = () => {
        setFormData({
            variantName: "",
            sku: "",
            barcode: "",
            price: "",
            stockQuantity: "",
            attributeValue: "",
            isActive: true,
        });

        setEditingId(null);
    };

    // =========================================================
    // ADD / UPDATE
    // =========================================================

    const handleSubmit = () => {
        setSuccessMessage("");
        setErrorMessage("");

        if (!formData.variantName.trim()) {
            setErrorMessage(
                "Variant name is required."
            );
            return;
        }

        if (!formData.sku.trim()) {
            setErrorMessage(
                "SKU is required."
            );
            return;
        }

        if (
            formData.price === "" ||
            Number(formData.price) < 0
        ) {
            setErrorMessage(
                "Please enter a valid price."
            );
            return;
        }

        if (
            formData.stockQuantity === "" ||
            Number(formData.stockQuantity) < 0
        ) {
            setErrorMessage(
                "Please enter a valid stock quantity."
            );
            return;
        }

        if (editingId !== null) {
            const updatedVariants =
                variants.map(
                    (variant) =>
                        variant.id === editingId
                            ? {
                                  ...variant,
                                  ...formData,
                                  price: Number(
                                      formData.price
                                  ),
                                  stockQuantity:
                                      Number(
                                          formData.stockQuantity
                                      ),
                              }
                            : variant
                );

            setVariants(updatedVariants);

            if (onChange) {
                onChange(updatedVariants);
            }

            setSuccessMessage(
                "Catalog variant updated successfully."
            );
        } else {
            const newVariant = {
                id: Date.now(),
                catalogId,
                ...formData,
                price: Number(
                    formData.price
                ),
                stockQuantity: Number(
                    formData.stockQuantity
                ),
            };

            const updatedVariants = [
                ...variants,
                newVariant,
            ];

            setVariants(updatedVariants);

            if (onChange) {
                onChange(updatedVariants);
            }

            setSuccessMessage(
                "Catalog variant added successfully."
            );
        }

        resetForm();
    };

    // =========================================================
    // EDIT
    // =========================================================

    const handleEdit = (variant) => {
        setEditingId(variant.id);

        setFormData({
            variantName:
                variant.variantName ?? "",
            sku: variant.sku ?? "",
            barcode:
                variant.barcode ?? "",
            price:
                variant.price ?? "",
            stockQuantity:
                variant.stockQuantity ?? "",
            attributeValue:
                variant.attributeValue ?? "",
            isActive:
                variant.isActive !== false,
        });

        setSuccessMessage("");
        setErrorMessage("");
    };

    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = (id) => {
        const updatedVariants =
            variants.filter(
                (variant) =>
                    variant.id !== id
            );

        setVariants(updatedVariants);

        if (onChange) {
            onChange(updatedVariants);
        }

        setSuccessMessage(
            "Catalog variant deleted successfully."
        );
    };

    // =========================================================
    // TOGGLE ACTIVE
    // =========================================================

    const handleToggleActive = (id) => {
        const updatedVariants =
            variants.map(
                (variant) =>
                    variant.id === id
                        ? {
                              ...variant,
                              isActive:
                                  !variant.isActive,
                          }
                        : variant
            );

        setVariants(updatedVariants);

        if (onChange) {
            onChange(updatedVariants);
        }
    };

    // =========================================================
    // SAVE ALL
    // =========================================================

    const handleSaveAll = async () => {
        setSuccessMessage("");
        setErrorMessage("");

        try {
            if (onSave) {
                await onSave(variants);
            }

            setSuccessMessage(
                "Catalog variants saved successfully."
            );
        } catch (error) {
            console.error(
                "Save catalog variants error:",
                error
            );

            setErrorMessage(
                error?.message ||
                    "Failed to save catalog variants."
            );
        }
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Card
            elevation={2}
            sx={{
                width: "100%",
                borderRadius: 2,
                overflow: "hidden",
            }}
        >
            {/* =====================================================
                HEADER
               ===================================================== */}

            <Box
                sx={{
                    px: 3,
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                    }}
                >
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                                "center",
                            bgcolor:
                                "primary.main",
                            color:
                                "primary.contrastText",
                        }}
                    >
                        <Inventory2 />
                    </Box>

                    <Box>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            Catalog Variants
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Manage SKUs, pricing,
                            inventory, and variant
                            attributes.
                        </Typography>
                    </Box>
                </Box>

                <Chip
                    icon={<CheckCircle />}
                    label={`${variants.length} Variant${
                        variants.length === 1
                            ? ""
                            : "s"
                    }`}
                    color="primary"
                    variant="outlined"
                />
            </Box>

            <Divider />

            <CardContent sx={{ p: 3 }}>
                {/* =================================================
                    MESSAGES
                   ================================================= */}

                {successMessage && (
                    <Alert
                        severity="success"
                        sx={{ mb: 2 }}
                        onClose={() =>
                            setSuccessMessage("")
                        }
                    >
                        {successMessage}
                    </Alert>
                )}

                {errorMessage && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                        onClose={() =>
                            setErrorMessage("")
                        }
                    >
                        {errorMessage}
                    </Alert>
                )}

                {/* =================================================
                    FORM
                   ================================================= */}

                <Paper
                    variant="outlined"
                    sx={{
                        p: 2.5,
                        mb: 3,
                        borderRadius: 2,
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                    >
                        {editingId !== null
                            ? "Edit Variant"
                            : "Add Variant"}
                    </Typography>

                    <Grid
                        container
                        spacing={2}
                    >
                        {/* VARIANT NAME */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >
                            <TextField
                                fullWidth
                                label="Variant Name"
                                name="variantName"
                                value={
                                    formData.variantName
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. Red - Large"
                                disabled={loading}
                            />
                        </Grid>

                        {/* SKU */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >
                            <TextField
                                fullWidth
                                label="SKU"
                                name="sku"
                                value={
                                    formData.sku
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. PROD-RED-L"
                                disabled={loading}
                            />
                        </Grid>

                        {/* BARCODE */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >
                            <TextField
                                fullWidth
                                label="Barcode"
                                name="barcode"
                                value={
                                    formData.barcode
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter barcode"
                                disabled={loading}
                            />
                        </Grid>

                        {/* PRICE */}

                        <Grid
                            item
                            xs={12}
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
                                inputProps={{
                                    min: 0,
                                    step: "0.01",
                                }}
                                disabled={loading}
                            />
                        </Grid>

                        {/* STOCK */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >
                            <TextField
                                fullWidth
                                type="number"
                                label="Stock Quantity"
                                name="stockQuantity"
                                value={
                                    formData.stockQuantity
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 0,
                                }}
                                disabled={loading}
                            />
                        </Grid>

                        {/* ATTRIBUTE VALUE */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >
                            <TextField
                                fullWidth
                                label="Variant Attributes"
                                name="attributeValue"
                                value={
                                    formData.attributeValue
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Color: Red, Size: Large"
                                disabled={loading}
                            />
                        </Grid>

                        {/* BUTTONS */}

                        <Grid
                            item
                            xs={12}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent:
                                        "flex-end",
                                    gap: 1,
                                }}
                            >
                                {editingId !==
                                    null && (
                                    <Button
                                        variant="outlined"
                                        onClick={
                                            resetForm
                                        }
                                        disabled={
                                            loading
                                        }
                                    >
                                        Cancel
                                    </Button>
                                )}

                                <Button
                                    variant="contained"
                                    startIcon={
                                        editingId !==
                                        null ? (
                                            <Save />
                                        ) : (
                                            <Add />
                                        )
                                    }
                                    onClick={
                                        handleSubmit
                                    }
                                    disabled={
                                        loading
                                    }
                                >
                                    {editingId !==
                                    null
                                        ? "Update Variant"
                                        : "Add Variant"}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* =================================================
                    TABLE
                   ================================================= */}

                {variants.length === 0 ? (
                    <Box
                        sx={{
                            py: 6,
                            textAlign: "center",
                            border: "1px dashed",
                            borderColor:
                                "divider",
                            borderRadius: 2,
                        }}
                    >
                        <Inventory2
                            sx={{
                                fontSize: 52,
                                color:
                                    "text.disabled",
                                mb: 1,
                            }}
                        />

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            No Variants
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Add a variant to start
                            managing catalog
                            variations.
                        </Typography>
                    </Box>
                ) : (
                    <TableContainer
                        component={Paper}
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                        }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <strong>
                                            Variant
                                        </strong>
                                    </TableCell>

                                    <TableCell>
                                        <strong>
                                            SKU
                                        </strong>
                                    </TableCell>

                                    <TableCell>
                                        <strong>
                                            Barcode
                                        </strong>
                                    </TableCell>

                                    <TableCell>
                                        <strong>
                                            Price
                                        </strong>
                                    </TableCell>

                                    <TableCell>
                                        <strong>
                                            Stock
                                        </strong>
                                    </TableCell>

                                    <TableCell>
                                        <strong>
                                            Attributes
                                        </strong>
                                    </TableCell>

                                    <TableCell>
                                        <strong>
                                            Status
                                        </strong>
                                    </TableCell>

                                    <TableCell align="right">
                                        <strong>
                                            Actions
                                        </strong>
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {variants.map(
                                    (
                                        variant
                                    ) => (
                                        <TableRow
                                            key={
                                                variant.id
                                            }
                                            hover
                                        >
                                            {/* NAME */}

                                            <TableCell>
                                                <Typography
                                                    fontWeight={600}
                                                >
                                                    {
                                                        variant.variantName
                                                    }
                                                </Typography>
                                            </TableCell>

                                            {/* SKU */}

                                            <TableCell>
                                                <Chip
                                                    label={
                                                        variant.sku ||
                                                        "-"
                                                    }
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </TableCell>

                                            {/* BARCODE */}

                                            <TableCell>
                                                {
                                                    variant.barcode ||
                                                    "-"
                                                }
                                            </TableCell>

                                            {/* PRICE */}

                                            <TableCell>
                                                ₹
                                                {Number(
                                                    variant.price ||
                                                        0
                                                ).toLocaleString(
                                                    "en-IN",
                                                    {
                                                        minimumFractionDigits: 2,
                                                    }
                                                )}
                                            </TableCell>

                                            {/* STOCK */}

                                            <TableCell>
                                                <Chip
                                                    label={
                                                        variant.stockQuantity ??
                                                        0
                                                    }
                                                    size="small"
                                                    color={
                                                        Number(
                                                            variant.stockQuantity ||
                                                                0
                                                        ) >
                                                        0
                                                            ? "success"
                                                            : "error"
                                                    }
                                                />
                                            </TableCell>

                                            {/* ATTRIBUTES */}

                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {
                                                        variant.attributeValue ||
                                                        "-"
                                                    }
                                                </Typography>
                                            </TableCell>

                                            {/* STATUS */}

                                            <TableCell>
                                                <Chip
                                                    icon={
                                                        variant.isActive ? (
                                                            <Visibility fontSize="small" />
                                                        ) : (
                                                            <VisibilityOff fontSize="small" />
                                                        )
                                                    }
                                                    label={
                                                        variant.isActive
                                                            ? "Active"
                                                            : "Inactive"
                                                    }
                                                    size="small"
                                                    color={
                                                        variant.isActive
                                                            ? "success"
                                                            : "default"
                                                    }
                                                    variant="outlined"
                                                />
                                            </TableCell>

                                            {/* ACTIONS */}

                                            <TableCell align="right">
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() =>
                                                            handleEdit(
                                                                variant
                                                            )
                                                        }
                                                        disabled={
                                                            loading
                                                        }
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip
                                                    title={
                                                        variant.isActive
                                                            ? "Disable"
                                                            : "Enable"
                                                    }
                                                >
                                                    <IconButton
                                                        onClick={() =>
                                                            handleToggleActive(
                                                                variant.id
                                                            )
                                                        }
                                                        disabled={
                                                            loading
                                                        }
                                                    >
                                                        {variant.isActive ? (
                                                            <VisibilityOff />
                                                        ) : (
                                                            <Visibility />
                                                        )}
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        color="error"
                                                        onClick={() =>
                                                            handleDelete(
                                                                variant.id
                                                            )
                                                        }
                                                        disabled={
                                                            loading
                                                        }
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* =================================================
                    SAVE ALL
                   ================================================= */}

                {variants.length > 0 && (
                    <Box
                        sx={{
                            mt: 3,
                            display: "flex",
                            justifyContent:
                                "flex-end",
                        }}
                    >
                        <Button
                            variant="contained"
                            startIcon={<Save />}
                            onClick={
                                handleSaveAll
                            }
                            disabled={loading}
                        >
                            Save Variants
                        </Button>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default CatalogVariants;