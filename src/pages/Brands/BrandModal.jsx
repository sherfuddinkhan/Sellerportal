import React from "react";
import { Dialog,DialogTitle,DialogContent,DialogActions,IconButton,Button,Typography} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
const BrandModal = ({open,title,children,maxWidth = "md",onClose,onSave,saveText = "Save",cancelText = "Cancel",showSave = true
}) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth={maxWidth} >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight="bold"
                >
                    {title}
                </Typography>

                <IconButton
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>

            </DialogTitle>
            <DialogContent
                dividers
            >
                {children}
            </DialogContent>
            <DialogActions>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={onClose}
                >
                    {cancelText}
                </Button>
                {showSave && (
                    <Button
                        variant="contained"
                        onClick={onSave}
                    >
                        {saveText}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default BrandModal;