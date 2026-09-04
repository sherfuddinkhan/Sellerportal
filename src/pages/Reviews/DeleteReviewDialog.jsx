import React from "react";

import PropTypes from "prop-types";

import {
    Alert,
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import {
    Close,
    Delete,
    Image,
    Warning,
} from "@mui/icons-material";


// ======================================================
// DeleteReviewDialog Component
// ======================================================

const DeleteReviewDialog = ({
    open = false,
    review = null,
    loading = false,

    onClose,
    onDelete,
}) => {


    // ==================================================
    // Empty Review Protection
    // ==================================================

    if (!review) {
        return null;
    }


    // ==================================================
    // Review Data
    // ==================================================

    const {
        reviewId,

        customerName,

        productName,
        productImage,

        reviewTitle,
        reviewText,

        rating,

    } = review;


    // ==================================================
    // Safe Values
    // ==================================================

    const safeCustomerName =
        customerName ||
        "Customer";


    const safeProductName =
        productName ||
        "Unknown Product";


    const safeReviewTitle =
        reviewTitle ||
        "Review";


    const safeReviewText =
        reviewText ||
        "No review text provided.";


    const safeRating =
        Number(rating) || 0;


    const displayRating =
        Math.min(
            5,
            Math.max(
                0,
                safeRating
            )
        );


    // ==================================================
    // Delete Handler
    // ==================================================

    const handleDelete = () => {

        if (
            loading
        ) {
            return;
        }


        if (onDelete) {
            onDelete(review);
        }

    };


    // ==================================================
    // Close Handler
    // ==================================================

    const handleClose = () => {

        if (
            loading
        ) {
            return;
        }


        if (onClose) {
            onClose();
        }

    };


    // ==================================================
    // JSX
    // ==================================================

    return (

        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            disableEscapeKeyDown={
                loading
            }
        >

            {/* ==================================================
                Dialog Title
            ================================================== */}

            <DialogTitle>

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                >

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                    >

                        <Warning
                            color="error"
                        />


                        <Box>

                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                Delete Review
                            </Typography>


                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Review ID:{" "}
                                {reviewId ?? "-"}
                            </Typography>

                        </Box>

                    </Stack>

                </Stack>

            </DialogTitle>


            <Divider />


            {/* ==================================================
                Dialog Content
            ================================================== */}

            <DialogContent dividers>

                <Stack
                    spacing={3}
                >

                    {/* ==================================================
                        Warning Message
                    ================================================== */}

                    <Alert
                        severity="error"
                        variant="filled"
                        icon={
                            <Warning />
                        }
                    >
                        This action is permanent and
                        cannot be undone.
                    </Alert>


                    {/* ==================================================
                        Product Information
                    ================================================== */}

                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                    >

                        {/* Product Image */}

                        <Avatar
                            src={
                                productImage ||
                                undefined
                            }
                            alt={
                                safeProductName
                            }
                            variant="rounded"
                            sx={{
                                width: 72,
                                height: 72,
                                flexShrink: 0,
                            }}
                        >
                            <Image />
                        </Avatar>


                        {/* Product Details */}

                        <Box
                            sx={{
                                minWidth: 0,
                            }}
                        >

                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                sx={{
                                    wordBreak:
                                        "break-word",
                                }}
                            >
                                {
                                    safeProductName
                                }
                            </Typography>


                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Customer:{" "}
                                {
                                    safeCustomerName
                                }
                            </Typography>


                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Rating:{" "}
                                ⭐{" "}
                                {
                                    displayRating
                                }/5
                            </Typography>

                        </Box>

                    </Stack>


                    <Divider />


                    {/* ==================================================
                        Review Content
                    ================================================== */}

                    <Box>

                        <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            gutterBottom
                            sx={{
                                wordBreak:
                                    "break-word",
                            }}
                        >
                            {
                                safeReviewTitle
                            }
                        </Typography>


                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                whiteSpace:
                                    "pre-wrap",

                                wordBreak:
                                    "break-word",

                                maxHeight:
                                    180,

                                overflowY:
                                    "auto",

                                pr: 1,
                            }}
                        >
                            {
                                safeReviewText
                            }
                        </Typography>

                    </Box>


                    {/* ==================================================
                        Final Confirmation
                    ================================================== */}

                    <Alert
                        severity="warning"
                        variant="outlined"
                    >
                        Are you sure you want to permanently
                        delete this review?
                    </Alert>

                </Stack>

            </DialogContent>


            {/* ==================================================
                Dialog Actions
            ================================================== */}

            <DialogActions
                sx={{
                    px: 3,
                    py: 2,
                    gap: 1,
                }}
            >

                {/* ==================================================
                    Cancel
                ================================================== */}

                <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={
                        <Close />
                    }
                    onClick={
                        handleClose
                    }
                    disabled={
                        loading
                    }
                >
                    Cancel
                </Button>


                {/* ==================================================
                    Delete
                ================================================== */}

                <Button
                    variant="contained"
                    color="error"
                    startIcon={
                        <Delete />
                    }
                    onClick={
                        handleDelete
                    }
                    disabled={
                        loading
                    }
                >
                    {
                        loading
                            ? "Deleting..."
                            : "Delete Review"
                    }
                </Button>

            </DialogActions>

        </Dialog>
    );
};


// ======================================================
// PropTypes
// ======================================================

DeleteReviewDialog.propTypes = {

    open:
        PropTypes.bool,

    loading:
        PropTypes.bool,

    review:
        PropTypes.shape({

            reviewId:
                PropTypes.oneOfType([
                    PropTypes.number,
                    PropTypes.string,
                ]),

            customerName:
                PropTypes.string,

            productName:
                PropTypes.string,

            productImage:
                PropTypes.string,

            reviewTitle:
                PropTypes.string,

            reviewText:
                PropTypes.string,

            rating:
                PropTypes.oneOfType([
                    PropTypes.number,
                    PropTypes.string,
                ]),

        }),


    onClose:
        PropTypes.func,

    onDelete:
        PropTypes.func,

};


// ======================================================
// Default Props
// ======================================================

DeleteReviewDialog.defaultProps = {

    open:
        false,

    loading:
        false,

    review:
        null,

    onClose:
        () => {},

    onDelete:
        () => {},

};


// ======================================================
// Export
// ======================================================

export default DeleteReviewDialog;
