import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {Alert,Box,Button,CircularProgress,Dialog,DialogActions,DialogContent,DialogTitle,Divider,IconButton,Stack,Typography,} from "@mui/material";
import {Close,Edit,Visibility,Delete} from "@mui/icons-material";
import CustomerReportView from "./CustomerReportView";
//======================================================
// CustomerReportModal
//======================================================

const CustomerReportModal = ({
  open = false,
  mode = "view",
  customer = null,
  loading = false,
  error = "",
  onClose,
  onSave,
  onDelete,
}) => {
  //====================================================
  // Local State
  //====================================================
  const [localCustomer, setLocalCustomer] = useState(customer);
  //====================================================
  // Sync Customer
  //====================================================
  useEffect(() => {
    setLocalCustomer(customer);
  }, [customer]);
  //====================================================
  // Mode Helpers
  //====================================================
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isDeleteMode = mode === "delete";
  //====================================================
  // Modal Title
  //====================================================
  const modalTitle = isViewMode ? "Customer Details" : isEditMode ? "Edit Customer" : isDeleteMode ? "Delete Customer" : "Customer";
  //====================================================
  // Close Handler
  //====================================================
  const handleClose = () => {
    if (loading) {
      return;
    }
    if (onClose) {
      onClose();
    }
  };
  //====================================================
  // Save Handler
  //====================================================
  const handleSave = () => {
    if (!localCustomer) {
      return;
    }
    if (onSave) {
      onSave(localCustomer);
    }
  };
  //====================================================
  // Delete Handler
  //====================================================
  const handleDelete = () => {
    if (!localCustomer) {
      return;
    }
    if (onDelete) {
      onDelete(localCustomer);
    }
  };
    //====================================================
  // Dialog Content
  //====================================================

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      fullScreen={false}
      scroll="paper"
      aria-labelledby="customer-report-modal-title"
    >
      {/*================================================
          Dialog Title
      =================================================*/}
      <DialogTitle
        id="customer-report-modal-title"
        sx={{
          pr: 7,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack spacing={0.5}>
            <Typography
              variant="h6"
              fontWeight={700}
            >
              {modalTitle}
            </Typography>
            {localCustomer && (
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Customer ID:{" "}
                {localCustomer.customerId ??
                  localCustomer.id ??
                  "-"}
              </Typography>
            )}
          </Stack>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            disabled={loading}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
            }}
          >
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <Divider />
      {/*================================================
          Dialog Content
      =================================================*/}
      <DialogContent
        dividers
        sx={{
          p: {
            xs: 2,
            sm: 3,
          },
          minHeight: 300,
        }}
      >
        {/*================================================
            Loading
        =================================================*/}
        {loading && (
          <Box
            sx={{
              minHeight: 250,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Stack
              spacing={2}
              alignItems="center"
            >
              <CircularProgress />
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Loading customer details...
              </Typography>
            </Stack>
          </Box>
        )}
        {/*================================================
            Error
        =================================================*/}
        {!loading && error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}
        {/*================================================
            View Mode
        =================================================*/}
        {!loading &&
          !error &&
          isViewMode &&
          localCustomer && (
            <CustomerReportView
              customer={localCustomer}
              onClose={handleClose}
            />
          )}
        {/*================================================
            Edit Mode
        =================================================*/}
        {!loading && !error && isEditMode && localCustomer && (
            <Box>
              <Alert
                severity="info"
                sx={{ mb: 2 }}
              >
                Customer editing is ready for the
                edit form integration.
              </Alert>
              <Stack spacing={2}>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                >
                  {localCustomer.customerName ??
                    localCustomer.name ??
                    "Customer"}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Use the customer edit form here.
                  The updated customer object will
                  be submitted through <strong>onSave</strong>.
                </Typography>
              </Stack>
            </Box>
          )}
        {/*================================================
            Delete Mode
        =================================================*/}
        {!loading && !error && isDeleteMode && localCustomer && (
            <Box
              sx={{
                py: 3,
              }}
            >
              <Stack
                spacing={2}
                alignItems="center"
                textAlign="center"
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      "error.lighter",
                  }}
                >
                  <Delete
                    color="error"
                    sx={{
                      fontSize: 32,
                    }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Delete Customer?
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    maxWidth: 500,
                  }}
                >
                  Are you sure you want to delete{" "}
                  <strong>
                    {localCustomer.customerName ??
                      localCustomer.name ??
                      "this customer"}
                  </strong>
                  ? This action cannot be undone.
                </Typography>
              </Stack>
            </Box>
          )}
        {/*================================================
            No Customer
        =================================================*/}
        {!loading && !error && !localCustomer && (
            <Alert severity="warning">
              No customer information is available.
            </Alert>
          )}
      </DialogContent>
      {/*================================================
          Dialog Actions
      =================================================*/}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Button
          variant="outlined"
          onClick={handleClose}
          disabled={loading}
          startIcon={<Close />}
        >
          Cancel
        </Button>

        {/*================================================
            Edit Action
        =================================================*/}
        {isEditMode && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={
              loading ||
              !localCustomer
            }
            startIcon={<Edit />}
          >
            {loading
              ? "Saving..."
              : "Save Changes"}
          </Button>
        )}
        {/*================================================
            Delete Action
        =================================================*/}
        {isDeleteMode && (
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={
              loading ||
              !localCustomer
            }
            startIcon={<Delete />}
          >
            {loading
              ? "Deleting..."
              : "Delete Customer"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
//======================================================
// PropTypes
//======================================================

CustomerReportModal.propTypes = {
  open: PropTypes.bool,
  mode: PropTypes.oneOf(["view","edit","delete",]),
  customer: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string,PropTypes.node,]),
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  onDelete: PropTypes.func,
};

//======================================================
// Default Props
//======================================================
CustomerReportModal.defaultProps = {
  open: false,
  mode: "view",
  customer: null,
  loading: false,
  error: "",
  onClose: () => {},
  onSave: () => {},
  onDelete: () => {},
};
//======================================================
// Export
//======================================================
export default CustomerReportModal;