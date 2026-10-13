import React from "react";

import {
    Alert,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";

import { getPutawayValue } from "./PutawayForm";

export default function PutawayDelete({
    open,
    putaway,
    loading = false,
    error = "",
    onCancel,
    onConfirm
}) {
    const code = getPutawayValue(
        putaway,
        "putawayCode",
        getPutawayValue(putaway, "putawayId", "selected record")
    );

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onCancel}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle>Delete Putaway</DialogTitle>

            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <DialogContentText>
                    Are you sure you want to delete putaway{" "}
                    <strong>{code}</strong>? This action cannot be undone.
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={onConfirm}
                    disabled={loading || !putaway}
                    startIcon={
                        loading
                            ? <CircularProgress size={16} color="inherit" />
                            : <></>
                    }
                >
                    {loading ? "Deleting..." : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

