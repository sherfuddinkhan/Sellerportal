import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Typography,
  Box
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const BrandModal = ({
  open,
  title = "",
  children,
  maxWidth = "md",
  onClose,
  onSave,
  saveText = "Save",
  cancelText = "Cancel",
  showSave = true,
  loading = false,
  disableSave = false
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      {/* HEADER */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 2
        }}
      >
        <Typography variant="h6" fontWeight={600} noWrap>
          {title}
        </Typography>

        <IconButton onClick={onClose} size="small" disabled={loading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent dividers sx={{ pt: 3 }}>
        <Box>{children}</Box>
      </DialogContent>

      {/* ACTIONS */}
      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={onClose}
          disabled={loading}
        >
          {cancelText}
        </Button>

        {showSave && (
          <Button
            variant="contained"
            onClick={onSave}
            disabled={disableSave || loading}
          >
            {loading ? "Saving..." : saveText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BrandModal;