import React, {
    useEffect,
    useState,
} from "react";

import PropTypes from "prop-types";

import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    MenuItem,
    Rating,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import {
    Cancel,
    CheckCircle,
    Close,
    Delete,
    Reply,
    Store,
    Verified,
} from "@mui/icons-material";


// ======================================================
// Date Formatter
// ======================================================

const formatDate = (date) => {

    if (!date) {
        return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "-";
    }

    return parsedDate.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
    );
};


// ======================================================
// Status Chip
// ======================================================

const StatusChip = ({
    status,
}) => {

    const normalizedStatus =
        status || "Pending";

    const color =
        normalizedStatus === "Approved"
            ? "success"
            : normalizedStatus === "Rejected"
                ? "error"
                : "warning";

    return (
        <Chip
            size="small"
            color={color}
            label={normalizedStatus}
        />
    );
};


// ======================================================
// Review Modal
// ======================================================

const ReviewModal = ({
    open,
    mode,
    review,
    loading,
    onClose,
    onSubmit,
}) => {

    // ==================================================
    // Form State
    // ==================================================

    const [formData, setFormData] = useState({
        action: "reply",
        sellerReply: "",
        rejectionReason: "",
        internalRemarks: "",
    });

    const [errors, setErrors] = useState({});


    // ==================================================
    // Populate Form
    // ==================================================

    useEffect(() => {

        if (!review) {
            return;
        }

        setFormData({
            action: mode,

            sellerReply:
                review.sellerReply?.replyText ||
                review.sellerReply ||
                "",

            rejectionReason:
                review.rejectionReason ||
                "",

            internalRemarks:
                review.internalRemarks ||
                "",
        });

        setErrors({});

    }, [
        review,
        mode,
    ]);


    // ==================================================
    // No Review
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
        customerImage,
        verifiedBuyer,
        productName,
        productSku,
        productImage,
        rating,
        reviewTitle,
        reviewText,
        marketplace,
        status,
        createdDate,
    } = review;


    // ==================================================
    // Form Change
    // ==================================================

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


    // ==================================================
    // Validation
    // ==================================================

    const validate = () => {

        const validationErrors = {};


        // ------------------------------------------------
        // Reply Validation
        // ------------------------------------------------

        if (
            mode === "reply" &&
            !formData.sellerReply.trim()
        ) {

            validationErrors.sellerReply =
                "Seller reply is required.";

        }


        // ------------------------------------------------
        // Reject Validation
        // ------------------------------------------------

        if (
            mode === "reject" &&
            !formData.rejectionReason.trim()
        ) {

            validationErrors.rejectionReason =
                "Please select a rejection reason.";

        }


        setErrors(
            validationErrors
        );

        return (
            Object.keys(
                validationErrors
            ).length === 0
        );

    };


    // ==================================================
    // Submit
    // ==================================================

    const handleSubmit = () => {

        if (mode !== "delete" && !validate()) {
            return;
        }

        if (!onSubmit) {
            return;
        }

        onSubmit({

            reviewId,

            action: mode,

            sellerReply:
                formData.sellerReply.trim(),

            rejectionReason:
                formData.rejectionReason,

            internalRemarks:
                formData.internalRemarks.trim(),

        });

    };


    // ==================================================
    // Close
    // ==================================================

    const handleClose = () => {

        if (loading) {
            return;
        }

        setErrors({});

        if (onClose) {
            onClose();
        }

    };


    // ==================================================
    // Modal Title
    // ==================================================

    const getTitle = () => {

        switch (mode) {

            case "reply":
                return "Reply to Review";

            case "approve":
                return "Approve Review";

            case "reject":
                return "Reject Review";

            case "delete":
                return "Delete Review";

            default:
                return "Review";

        }

    };


    // ==================================================
    // Alert Severity
    // ==================================================

    const getAlertSeverity = () => {

        switch (mode) {

            case "approve":
                return "success";

            case "reject":
                return "warning";

            case "delete":
                return "error";

            default:
                return "info";

        }

    };


    // ==================================================
    // Alert Message
    // ==================================================

    const getAlertMessage = () => {

        switch (mode) {

            case "reply":
                return (
                    "Your reply will be visible to the customer."
                );

            case "approve":
                return (
                    "Approving this review will make it publicly visible."
                );

            case "reject":
                return (
                    "Rejected reviews will not be displayed publicly."
                );

            case "delete":
                return (
                    "Deleting this review is permanent and cannot be undone."
                );

            default:
                return "";

        }

    };


    // ==================================================
    // JSX
    // ==================================================

    return (

        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            scroll="paper"
        >

            {/* ==========================================
                TITLE
            ========================================== */}

            <DialogTitle>

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >

                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        {getTitle()}
                    </Typography>

                    <IconButton
                        onClick={handleClose}
                        disabled={loading}
                    >
                        <Close />
                    </IconButton>

                </Stack>

            </DialogTitle>


            <Divider />


            {/* ==========================================
                CONTENT
            ========================================== */}

            <DialogContent dividers>

                {/* ======================================
                    REVIEW DETAILS
                ====================================== */}

                <Card
                    variant="outlined"
                    sx={{
                        mb: 3,
                    }}
                >

                    <CardContent>

                        <Grid
                            container
                            spacing={3}
                        >

                            {/* ==========================
                                CUSTOMER
                            ========================== */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <Stack
                                    spacing={2}
                                    alignItems="center"
                                >

                                    <Avatar
                                        src={
                                            customerImage ||
                                            undefined
                                        }
                                        sx={{
                                            width: 80,
                                            height: 80,
                                        }}
                                    >
                                        {customerName
                                            ?.charAt(0)
                                            ?.toUpperCase()}
                                    </Avatar>


                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                        textAlign="center"
                                    >
                                        {customerName || "-"}
                                    </Typography>


                                    {verifiedBuyer && (

                                        <Chip
                                            color="success"
                                            icon={<Verified />}
                                            label="Verified Buyer"
                                        />

                                    )}


                                    <StatusChip
                                        status={status}
                                    />


                                    <Chip
                                        color="primary"
                                        icon={<Store />}
                                        label={
                                            marketplace ||
                                            "Marketplace"
                                        }
                                    />


                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        textAlign="center"
                                    >
                                        {formatDate(
                                            createdDate
                                        )}
                                    </Typography>

                                </Stack>

                            </Grid>


                            {/* ==========================
                                PRODUCT / REVIEW
                            ========================== */}

                            <Grid
                                item
                                xs={12}
                                md={8}
                            >

                                <Stack spacing={2}>

                                    <Stack
                                        direction={{
                                            xs: "column",
                                            sm: "row",
                                        }}
                                        spacing={2}
                                    >

                                        <Avatar
                                            src={
                                                productImage ||
                                                undefined
                                            }
                                            variant="rounded"
                                            sx={{
                                                width: 90,
                                                height: 90,
                                            }}
                                        >
                                            {productName
                                                ?.charAt(0)
                                                ?.toUpperCase()}
                                        </Avatar>


                                        <Box>

                                            <Typography
                                                variant="h6"
                                                fontWeight={700}
                                            >
                                                {productName || "-"}
                                            </Typography>


                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                SKU:{" "}
                                                {productSku || "-"}
                                            </Typography>


                                            <Rating
                                                value={
                                                    Number(rating) || 0
                                                }
                                                precision={0.5}
                                                readOnly
                                                sx={{
                                                    mt: 1,
                                                }}
                                            />

                                        </Box>

                                    </Stack>


                                    <Divider />


                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                    >
                                        {reviewTitle || "Review"}
                                    </Typography>


                                    <Typography
                                        variant="body1"
                                        sx={{
                                            whiteSpace:
                                                "pre-wrap",
                                            wordBreak:
                                                "break-word",
                                        }}
                                    >
                                        {reviewText || "-"}
                                    </Typography>


                                    {/* ======================
                                        MODE MESSAGE
                                    ====================== */}

                                    <Alert
                                        severity={
                                            getAlertSeverity()
                                        }
                                        variant="outlined"
                                    >
                                        {getAlertMessage()}
                                    </Alert>

                                </Stack>

                            </Grid>

                        </Grid>

                    </CardContent>

                </Card>


                {/* ======================================
                    MODERATION FORM
                ====================================== */}

                <Card variant="outlined">

                    <CardContent>

                        <Stack spacing={3}>

                            {/* ==========================
                                SELLER REPLY
                            ========================== */}

                            {mode === "reply" && (

                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={5}
                                    maxRows={10}
                                    name="sellerReply"
                                    label="Seller Reply"
                                    placeholder="Enter your response to the customer..."
                                    value={
                                        formData.sellerReply
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    error={
                                        Boolean(
                                            errors.sellerReply
                                        )
                                    }
                                    helperText={
                                        errors.sellerReply ||
                                        `${formData.sellerReply.length} characters`
                                    }
                                />

                            )}


                            {/* ==========================
                                REJECTION REASON
                            ========================== */}

                            {mode === "reject" && (

                                <TextField
                                    select
                                    fullWidth
                                    name="rejectionReason"
                                    label="Rejection Reason"
                                    value={
                                        formData.rejectionReason
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    error={
                                        Boolean(
                                            errors.rejectionReason
                                        )
                                    }
                                    helperText={
                                        errors.rejectionReason
                                    }
                                >

                                    <MenuItem value="">
                                        Select Reason
                                    </MenuItem>

                                    <MenuItem value="Spam">
                                        Spam
                                    </MenuItem>

                                    <MenuItem value="Offensive Content">
                                        Offensive Content
                                    </MenuItem>

                                    <MenuItem value="Fake Review">
                                        Fake Review
                                    </MenuItem>

                                    <MenuItem value="Duplicate Review">
                                        Duplicate Review
                                    </MenuItem>

                                    <MenuItem value="Irrelevant">
                                        Irrelevant
                                    </MenuItem>

                                    <MenuItem value="Policy Violation">
                                        Policy Violation
                                    </MenuItem>

                                    <MenuItem value="Other">
                                        Other
                                    </MenuItem>

                                </TextField>

                            )}


                            {/* ==========================
                                INTERNAL REMARKS
                            ========================== */}

                            {(
                                mode === "reply" ||
                                mode === "approve" ||
                                mode === "reject"
                            ) && (

                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    maxRows={6}
                                    name="internalRemarks"
                                    label="Internal Remarks"
                                    placeholder="Optional internal notes..."
                                    value={
                                        formData.internalRemarks
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            )}


                            {/* ==========================
                                DELETE CONFIRMATION
                            ========================== */}

                            {mode === "delete" && (

                                <Alert
                                    severity="error"
                                    variant="filled"
                                >
                                    You are about to permanently
                                    delete this review. This
                                    action cannot be undone.
                                </Alert>

                            )}

                        </Stack>

                    </CardContent>

                </Card>

            </DialogContent>


            {/* ==========================================
                ACTIONS
            ========================================== */}

            <DialogActions
                sx={{
                    px: 3,
                    py: 2,
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                }}
            >

                {/* ======================================
                    CANCEL
                ====================================== */}

                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleClose}
                    disabled={loading}
                >
                    Cancel
                </Button>


                {/* ======================================
                    REPLY
                ====================================== */}

                {mode === "reply" && (

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Reply />}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading
                            ? "Sending..."
                            : "Send Reply"}
                    </Button>

                )}


                {/* ======================================
                    APPROVE
                ====================================== */}

                {mode === "approve" && (

                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircle />}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading
                            ? "Approving..."
                            : "Approve Review"}
                    </Button>

                )}


                {/* ======================================
                    REJECT
                ====================================== */}

                {mode === "reject" && (

                    <Button
                        variant="contained"
                        color="warning"
                        startIcon={<Cancel />}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading
                            ? "Rejecting..."
                            : "Reject Review"}
                    </Button>

                )}


                {/* ======================================
                    DELETE
                ====================================== */}

                {mode === "delete" && (

                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<Delete />}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading
                            ? "Deleting..."
                            : "Delete Review"}
                    </Button>

                )}

            </DialogActions>

        </Dialog>
    );
};


// ======================================================
// StatusChip PropTypes
// ======================================================

StatusChip.propTypes = {
    status: PropTypes.oneOf([
        "Pending",
        "Approved",
        "Rejected",
    ]),
};

StatusChip.defaultProps = {
    status: "Pending",
};


// ======================================================
// ReviewModal PropTypes
// ======================================================

ReviewModal.propTypes = {

    open: PropTypes.bool,

    mode: PropTypes.oneOf([
        "reply",
        "approve",
        "reject",
        "delete",
    ]),

    loading: PropTypes.bool,

    review: PropTypes.shape({

        reviewId:
            PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]),

        customerName:
            PropTypes.string,

        customerImage:
            PropTypes.string,

        verifiedBuyer:
            PropTypes.bool,

        productName:
            PropTypes.string,

        productSku:
            PropTypes.string,

        productImage:
            PropTypes.string,

        marketplace:
            PropTypes.string,

        rating:
            PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]),

        reviewTitle:
            PropTypes.string,

        reviewText:
            PropTypes.string,

        status:
            PropTypes.oneOf([
                "Pending",
                "Approved",
                "Rejected",
            ]),

        createdDate:
            PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.instanceOf(Date),
            ]),

        rejectionReason:
            PropTypes.string,

        internalRemarks:
            PropTypes.string,

        sellerReply:
            PropTypes.oneOfType([
                PropTypes.string,

                PropTypes.shape({
                    replyText:
                        PropTypes.string,

                    replyDate:
                        PropTypes.oneOfType([
                            PropTypes.string,
                            PropTypes.instanceOf(Date),
                        ]),
                }),
            ]),
    }),

    onClose:
        PropTypes.func,

    onSubmit:
        PropTypes.func,
};


// ======================================================
// Default Props
// ======================================================

ReviewModal.defaultProps = {

    open: false,

    mode: "reply",

    loading: false,

    review: null,

    onClose: () => {},

    onSubmit: () => {},

};


// ======================================================
// Export
// ======================================================

export default ReviewModal;
