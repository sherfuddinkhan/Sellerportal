import React from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Grid,
    MenuItem,
    Paper,
    TextField
} from "@mui/material";

const initialValues = {
    putawayCode: "",
    shelfCode: "",
    itemTypeSkuCode: "",
    putawayQuantity: 0,
    batchCode: "",
    inventoryType: "",
    statusCode: "Pending",
    facilityCode: "",
    putawayType: "",
    createdBy: "",
    sellerId: 6,
    customerId: 3,
    createdDate: "",
    updatedDate: ""
};

export const getPutawayValue = (obj, key, fallback = "") => {
    if (!obj) return fallback;

    const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);

    return obj[key] ?? obj[pascalKey] ?? fallback;
};

export const normalizePutaway = (obj = {}) => ({
    putawayId: getPutawayValue(obj, "putawayId", 0),
    putawayCode: getPutawayValue(obj, "putawayCode"),
    shelfCode: getPutawayValue(obj, "shelfCode"),
    itemTypeSkuCode: getPutawayValue(obj, "itemTypeSkuCode"),
    putawayQuantity: getPutawayValue(obj, "putawayQuantity", 0),
    batchCode: getPutawayValue(obj, "batchCode"),
    inventoryType: getPutawayValue(obj, "inventoryType"),
    statusCode: getPutawayValue(obj, "statusCode", "Pending"),
    facilityCode: getPutawayValue(obj, "facilityCode"),
    putawayType: getPutawayValue(obj, "putawayType"),
    createdBy: getPutawayValue(obj, "createdBy"),
    sellerId: getPutawayValue(obj, "sellerId", 6),
    customerId: getPutawayValue(obj, "customerId", 3),
    createdDate: getPutawayValue(obj, "createdDate"),
    updatedDate: getPutawayValue(obj, "updatedDate")
});

export default function PutawayForm({
    initialData,
    onSubmit,
    onCancel,
    loading = false,
    error = "",
    sellerId = 6,
    customerId = 3
}) {
    const [form, setForm] = React.useState(() => ({
        ...initialValues,
        sellerId,
        customerId,
        ...(initialData ? normalizePutaway(initialData) : {})
    }));

    const [validationError, setValidationError] = React.useState("");

    React.useEffect(() => {
        setForm({
            ...initialValues,
            sellerId,
            customerId,
            ...(initialData ? normalizePutaway(initialData) : {})
        });
    }, [initialData, sellerId, customerId]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!form.putawayCode.trim()) {
            setValidationError("Putaway Code is required.");
            return;
        }

        if (
            form.putawayQuantity === "" ||
            !Number.isFinite(Number(form.putawayQuantity)) ||
            Number(form.putawayQuantity) < 0
        ) {
            setValidationError("Enter a valid putaway quantity.");
            return;
        }

        setValidationError("");

        onSubmit({
            ...form,
            putawayId: Number(form.putawayId || 0),
            putawayQuantity: Number(form.putawayQuantity),
            sellerId: Number(sellerId),
            customerId: Number(customerId)
        });
    };

    const fields = [
        { name: "putawayCode", label: "Putaway Code", required: true },
        { name: "shelfCode", label: "Shelf Code" },
        { name: "itemTypeSkuCode", label: "Item / SKU Code" },
        { name: "putawayQuantity", label: "Putaway Quantity", type: "number" },
        { name: "batchCode", label: "Batch Code" },
        { name: "inventoryType", label: "Inventory Type" },
        { name: "facilityCode", label: "Facility Code" },
        { name: "putawayType", label: "Putaway Type" },
        { name: "createdBy", label: "Created By" }
    ];

    return (
        <Paper variant="outlined" sx={{ p: 3 }}>
            <Box component="form" onSubmit={handleSubmit}>
                {(error || validationError) && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {validationError || error}
                    </Alert>
                )}

                <Grid container spacing={2}>
                    <Grid xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Seller ID"
                            value={sellerId}
                            disabled
                        />
                    </Grid>

                    <Grid xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Customer ID"
                            value={customerId}
                            disabled
                        />
                    </Grid>

                    {fields.map((field) => (
                        <Grid xs={12} sm={6} md={4} key={field.name}>
                            <TextField
                                fullWidth
                                name={field.name}
                                label={field.label}
                                type={field.type || "text"}
                                value={form[field.name] ?? ""}
                                onChange={handleChange}
                                required={Boolean(field.required)}
                                disabled={loading}
                                inputProps={
                                    field.type === "number"
                                        ? { min: 0, step: 1 }
                                        : undefined
                                }
                            />
                        </Grid>
                    ))}

                    <Grid xs={12} sm={6} md={4}>
                        <TextField
                            select
                            fullWidth
                            name="statusCode"
                            label="Status"
                            value={form.statusCode}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            {[
                                "Pending",
                                "InProgress",
                                "Completed",
                                "Cancelled"
                            ].map((status) => (
                                <MenuItem key={status} value={status}>
                                    {status}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                        mt: 3
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        startIcon={
                            loading
                                ? <CircularProgress size={18} color="inherit" />
                                : null
                        }
                    >
                        {loading ? "Saving..." : "Save Putaway"}
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
}

