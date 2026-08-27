// =========================================================
// CatalogAttributes.jsx
// =========================================================

import React, { useState } from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Chip,
    Divider,
    FormControlLabel,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Select,
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
    Save,
    Tune,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";

// =========================================================
// COMPONENT
// =========================================================

const CatalogAttributes = ({
    catalogId = null,
    initialAttributes = [],
    loading = false,
    onSave,
    onChange,
}) => {
    // =========================================================
    // STATE
    // =========================================================

    const [attributes, setAttributes] =
        useState(
            Array.isArray(initialAttributes)
                ? initialAttributes
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
            attributeName: "",
            attributeValue: "",
            attributeType: "Text",
            isRequired: false,
            isActive: true,
        });

    // =========================================================
    // HANDLE FORM CHANGE
    // =========================================================

    const handleChange = (event) => {
        const {
            name,
            value,
            checked,
            type,
        } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    // =========================================================
    // RESET FORM
    // =========================================================

    const resetForm = () => {
        setFormData({
            attributeName: "",
            attributeValue: "",
            attributeType: "Text",
            isRequired: false,
            isActive: true,
        });

        setEditingId(null);
    };

    // =========================================================
    // ADD / UPDATE ATTRIBUTE
    // =========================================================

    const handleSubmit = () => {
        setSuccessMessage("");
        setErrorMessage("");

        if (
            !formData.attributeName.trim()
        ) {
            setErrorMessage(
                "Attribute name is required."
            );
            return;
        }

        if (
            !formData.attributeValue.trim()
        ) {
            setErrorMessage(
                "Attribute value is required."
            );
            return;
        }

        if (editingId !== null) {
            const updatedAttributes =
                attributes.map(
                    (attribute) =>
                        attribute.id ===
                            editingId
                            ? {
                                  ...attribute,
                                  ...formData,
                              }
                            : attribute
                );

            setAttributes(
                updatedAttributes
            );

            if (onChange) {
                onChange(
                    updatedAttributes
                );
            }

            setSuccessMessage(
                "Attribute updated successfully."
            );
        } else {
            const newAttribute = {
                id: Date.now(),
                catalogId,
                ...formData,
            };

            const updatedAttributes = [
                ...attributes,
                newAttribute,
            ];

            setAttributes(
                updatedAttributes
            );

            if (onChange) {
                onChange(
                    updatedAttributes
                );
            }

            setSuccessMessage(
                "Attribute added successfully."
            );
        }

        resetForm();
    };

    // =========================================================
    // EDIT ATTRIBUTE
    // =========================================================

    const handleEdit = (attribute) => {
        setEditingId(attribute.id);

        setFormData({
            attributeName:
                attribute.attributeName ??
                "",
            attributeValue:
                attribute.attributeValue ??
                "",
            attributeType:
                attribute.attributeType ??
                "Text",
            isRequired:
                Boolean(
                    attribute.isRequired
                ),
            isActive:
                attribute.isActive !==
                false,
        });

        setSuccessMessage("");
        setErrorMessage("");
    };

    // =========================================================
    // DELETE ATTRIBUTE
    // =========================================================

    const handleDelete = (id) => {
        const updatedAttributes =
            attributes.filter(
                (attribute) =>
                    attribute.id !== id
            );

        setAttributes(
            updatedAttributes
        );

        if (onChange) {
            onChange(
                updatedAttributes
            );
        }

        setSuccessMessage(
            "Attribute deleted successfully."
        );
    };

    // =========================================================
    // TOGGLE ACTIVE
    // =========================================================

    const handleToggleActive = (id) => {
        const updatedAttributes =
            attributes.map(
                (attribute) =>
                    attribute.id === id
                        ? {
                              ...attribute,
                              isActive:
                                  !attribute.isActive,
                          }
                        : attribute
            );

        setAttributes(
            updatedAttributes
        );

        if (onChange) {
            onChange(
                updatedAttributes
            );
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
                await onSave(
                    attributes
                );
            }

            setSuccessMessage(
                "Catalog attributes saved successfully."
            );
        } catch (error) {
            console.error(
                "Save attributes error:",
                error
            );

            setErrorMessage(
                error?.message ||
                    "Failed to save catalog attributes."
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
                        <Tune />
                    </Box>

                    <Box>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            Catalog Attributes
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Manage attributes and
                            attribute values for this
                            catalog.
                        </Typography>
                    </Box>
                </Box>

                <Chip
                    icon={<CheckCircle />}
                    label={`${attributes.length} Attribute${
                        attributes.length ===
                        1
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
                            setSuccessMessage(
                                ""
                            )
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
                            setErrorMessage(
                                ""
                            )
                        }
                    >
                        {errorMessage}
                    </Alert>
                )}

                {/* =================================================
                    ATTRIBUTE FORM
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
                            ? "Edit Attribute"
                            : "Add Attribute"}
                    </Typography>

                    <Grid
                        container
                        spacing={2}
                    >
                        {/* ATTRIBUTE NAME */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >
                            <TextField
                                fullWidth
                                label="Attribute Name"
                                name="attributeName"
                                value={
                                    formData.attributeName
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. Color"
                                disabled={
                                    loading
                                }
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
                                label="Attribute Value"
                                name="attributeValue"
                                value={
                                    formData.attributeValue
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. Red"
                                disabled={
                                    loading
                                }
                            />
                        </Grid>

                        {/* ATTRIBUTE TYPE */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >
                            <TextField
                                select
                                fullWidth
                                label="Attribute Type"
                                name="attributeType"
                                value={
                                    formData.attributeType
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    loading
                                }
                            >
                                <MenuItem value="Text">
                                    Text
                                </MenuItem>

                                <MenuItem value="Number">
                                    Number
                                </MenuItem>

                                <MenuItem value="Boolean">
                                    Boolean
                                </MenuItem>

                                <MenuItem value="Date">
                                    Date
                                </MenuItem>

                                <MenuItem value="Select">
                                    Select
                                </MenuItem>
                            </TextField>
                        </Grid>

                        {/* OPTIONS */}

                        <Grid
                            item
                            xs={12}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    flexWrap:
                                        "wrap",
                                    gap: 2,
                                }}
                            >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="isRequired"
                                            checked={
                                                formData.isRequired
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                loading
                                            }
                                        />
                                    }
                                    label="Required"
                                />

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="isActive"
                                            checked={
                                                formData.isActive
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                loading
                                            }
                                        />
                                    }
                                    label="Active"
                                />

                                <Box
                                    sx={{
                                        ml: "auto",
                                        display:
                                            "flex",
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
                                            ? "Update Attribute"
                                            : "Add Attribute"}
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* =================================================
                    ATTRIBUTES TABLE
                   ================================================= */}

                {attributes.length === 0 ? (
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
                        <Tune
                            sx={{
                                fontSize: 48,
                                color: "text.disabled",
                                mb: 1,
                            }}
                        />

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            No Attributes
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Add an attribute to
                            start configuring
                            your catalog.
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
                                            Attribute
                                        </strong>
                                    </TableCell>

                                    <TableCell>
                                        <strong>
                                            Value
                                        </strong>
                                    </TableCell>

                                    <TableCell>
                                        <strong>
                                            Type
                                        </strong>
                                    </TableCell>

                                    <TableCell>
                                        <strong>
                                            Required
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
                                {attributes.map(
                                    (
                                        attribute
                                    ) => (
                                        <TableRow
                                            key={
                                                attribute.id
                                            }
                                            hover
                                        >
                                            {/* NAME */}

                                            <TableCell>
                                                <Typography
                                                    fontWeight={
                                                        600
                                                    }
                                                >
                                                    {
                                                        attribute.attributeName
                                                    }
                                                </Typography>
                                            </TableCell>

                                            {/* VALUE */}

                                            <TableCell>
                                                {
                                                    attribute.attributeValue
                                                }
                                            </TableCell>

                                            {/* TYPE */}

                                            <TableCell>
                                                <Chip
                                                    label={
                                                        attribute.attributeType ||
                                                        "Text"
                                                    }
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </TableCell>

                                            {/* REQUIRED */}

                                            <TableCell>
                                                {attribute.isRequired ? (
                                                    <Chip
                                                        label="Required"
                                                        size="small"
                                                        color="warning"
                                                    />
                                                ) : (
                                                    <Chip
                                                        label="Optional"
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                )}
                                            </TableCell>

                                            {/* STATUS */}

                                            <TableCell>
                                                <Chip
                                                    icon={
                                                        attribute.isActive ? (
                                                            <Visibility fontSize="small" />
                                                        ) : (
                                                            <VisibilityOff fontSize="small" />
                                                        )
                                                    }
                                                    label={
                                                        attribute.isActive
                                                            ? "Active"
                                                            : "Inactive"
                                                    }
                                                    size="small"
                                                    color={
                                                        attribute.isActive
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
                                                                attribute
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
                                                        attribute.isActive
                                                            ? "Disable"
                                                            : "Enable"
                                                    }
                                                >
                                                    <IconButton
                                                        onClick={() =>
                                                            handleToggleActive(
                                                                attribute.id
                                                            )
                                                        }
                                                        disabled={
                                                            loading
                                                        }
                                                    >
                                                        {attribute.isActive ? (
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
                                                                attribute.id
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
                    SAVE BUTTON
                   ================================================= */}

                {attributes.length >
                    0 && (
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
                            color="primary"
                            startIcon={<Save />}
                            onClick={
                                handleSaveAll
                            }
                            disabled={loading}
                        >
                            Save Attributes
                        </Button>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default CatalogAttributes;