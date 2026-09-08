import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Chip,
    Stack
} from "@mui/material";

const MarketplaceModal = ({
    open,
    marketplace,
    onClose
}) => {
    if (!marketplace) return null;

    const id =
        marketplace.marketplaceId ??
        marketplace.MarketplaceId;

    const name =
        marketplace.marketplaceName ??
        marketplace.MarketplaceName ??
        "-";

    const code =
        marketplace.marketplaceCode ??
        marketplace.MarketplaceCode ??
        "-";

    const active =
        marketplace.isActive ??
        marketplace.IsActive ??
        false;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                Marketplace Details
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <Typography>
                        <strong>ID:</strong> {id}
                    </Typography>

                    <Typography>
                        <strong>Name:</strong> {name}
                    </Typography>

                    <Typography>
                        <strong>Code:</strong> {code}
                    </Typography>

                    <BoxStatus active={active} />
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const BoxStatus = ({ active }) => (
    <Typography>
        <strong>Status:</strong>{" "}
        <Chip
            size="small"
            label={active ? "Active" : "Inactive"}
            color={active ? "success" : "default"}
        />
    </Typography>
);

export default MarketplaceModal;