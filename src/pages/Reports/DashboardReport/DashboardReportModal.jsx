import React, {useEffect,useState} from "react";
import PropTypes from "prop-types";
import {Alert,Box,Button,Dialog,DialogActions,DialogContent,DialogTitle,Divider,FormControl,InputLabel,MenuItem,Select,Stack,TextField} from "@mui/material";
import {Close,Save} from "@mui/icons-material";

//======================================================
// DashboardReportModal
//======================================================

const DashboardReportModal = ({
  open = false,
  mode = "add",
  report = null,
  loading = false,
  error = "",
  onClose,
  onSubmit,
}) => {

  //====================================================
  // Form State
  //====================================================

  const [formData, setFormData] =
    useState({
      reportName: "",
      reportType: "Dashboard",
      status: "Active",
      description: "",
      remarks: "",
    });

  //====================================================
  // Validation State
  //====================================================

  const [validationErrors, setValidationErrors] =
    useState({});

  //====================================================
  // Edit / Add Mode
  //====================================================

  const isEditMode =
    mode === "edit";

  const isViewMode =
    mode === "view";

  //====================================================
  // Modal Title
  //====================================================

  const modalTitle =
    isViewMode
      ? "View Dashboard Report"
      : isEditMode
        ? "Edit Dashboard Report"
        : "Add Dashboard Report";

  //====================================================
  // Sync Report Data
  //====================================================

  useEffect(() => {

    if (!open) {
      return;
    }

    if (report) {

      setFormData({
        reportName:
          report?.reportName ||
          report?.name ||
          report?.title ||
          "",

        reportType:
          report?.reportType ||
          report?.type ||
          "Dashboard",

        status:
          report?.status ||
          report?.reportStatus ||
          "Active",

        description:
          report?.description ||
          report?.summary ||
          "",

        remarks:
          report?.remarks ||
          report?.internalRemarks ||
          "",
      });

    } else {

      setFormData({
        reportName: "",
        reportType: "Dashboard",
        status: "Active",
        description: "",
        remarks: "",
      });

    }

    setValidationErrors({});

  }, [
    open,
    report,
  ]);

  //====================================================
  // Input Change
  //====================================================

  const handleChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    setValidationErrors(
      (previous) => ({
        ...previous,
        [name]: "",
      })
    );

  };

  //====================================================
  // Validate Form
  //====================================================

  const validateForm = () => {

    const errors = {};

    if (
      !formData.reportName
        ?.trim()
    ) {
      errors.reportName =
        "Report name is required.";
    }

    if (
      !formData.reportType
    ) {
      errors.reportType =
        "Report type is required.";
    }

    if (
      !formData.status
    ) {
      errors.status =
        "Status is required.";
    }

    setValidationErrors(
      errors
    );

    return (
      Object.keys(errors)
        .length === 0
    );

  };

  //====================================================
  // Submit Handler
  //====================================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    if (isViewMode) {
      return;
    }

    const isValid =
      validateForm();

    if (!isValid) {
      return;
    }

    if (
      typeof onSubmit !==
      "function"
    ) {
      return;
    }

    await onSubmit(
      formData,
      report
    );

  };

  //====================================================
  // Close Handler
  //====================================================

  const handleClose = () => {

    if (loading) {
      return;
    }

    if (
      typeof onClose ===
      "function"
    ) {
      onClose();
    }

  };

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // JSX
  //====================================================

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      fullScreen={false}
      aria-labelledby="dashboard-report-modal-title"
    >

      {/*================================================
          Dialog Title
      =================================================*/}

      <DialogTitle
        id="dashboard-report-modal-title"
        sx={{
          fontWeight: 600,
        }}
      >
        {modalTitle}
      </DialogTitle>

      <Divider />

      {/*================================================
          Dialog Content
      =================================================*/}

      <DialogContent
        sx={{
          pt: 3,
        }}
      >

        {/*==============================================
            API Error
        ==============================================*/}

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
            }}
          >
            {error}
          </Alert>
        )}

        <Box
          component="form"
          id="dashboard-report-form"
          onSubmit={handleSubmit}
        >

          <Stack spacing={2.5}>

            {/*==========================================
                Report Name
            ==========================================*/}

            <TextField
              fullWidth
              required
              label="Report Name"
              name="reportName"
              value={
                formData.reportName
              }
              onChange={
                handleChange
              }
              error={Boolean(
                validationErrors.reportName
              )}
              helperText={
                validationErrors.reportName ||
                "Enter a name for the dashboard report."
              }
              disabled={
                loading ||
                isViewMode
              }
              inputProps={{
                maxLength: 150,
              }}
            />

            {/*==========================================
                Report Type
            ==========================================*/}

            <FormControl
              fullWidth
              required
              error={Boolean(
                validationErrors.reportType
              )}
              disabled={
                loading ||
                isViewMode
              }
            >

              <InputLabel id="dashboard-report-type-label">
                Report Type
              </InputLabel>

              <Select
                labelId="dashboard-report-type-label"
                name="reportType"
                value={
                  formData.reportType
                }
                label="Report Type"
                onChange={
                  handleChange
                }
              >

                <MenuItem value="Dashboard">
                  Dashboard
                </MenuItem>

                <MenuItem value="Sales">
                  Sales
                </MenuItem>

                <MenuItem value="Orders">
                  Orders
                </MenuItem>

                <MenuItem value="Customers">
                  Customers
                </MenuItem>

                <MenuItem value="Products">
                  Products
                </MenuItem>

                <MenuItem value="Inventory">
                  Inventory
                </MenuItem>

                <MenuItem value="Finance">
                  Finance
                </MenuItem>

              </Select>

              {validationErrors.reportType && (
                <Box
                  component="span"
                  sx={{
                    color: "error.main",
                    fontSize: "0.75rem",
                    mt: 0.5,
                    ml: 1.5,
                  }}
                >
                  {
                    validationErrors.reportType
                  }
                </Box>
              )}

            </FormControl>

            {/*==========================================
                Status
            ==========================================*/}

            <FormControl
              fullWidth
              required
              error={Boolean(
                validationErrors.status
              )}
              disabled={
                loading ||
                isViewMode
              }
            >

              <InputLabel id="dashboard-report-status-label">
                Status
              </InputLabel>

              <Select
                labelId="dashboard-report-status-label"
                name="status"
                value={
                  formData.status
                }
                label="Status"
                onChange={
                  handleChange
                }
              >

                <MenuItem value="Active">
                  Active
                </MenuItem>

                <MenuItem value="Inactive">
                  Inactive
                </MenuItem>

                <MenuItem value="Draft">
                  Draft
                </MenuItem>

                <MenuItem value="Archived">
                  Archived
                </MenuItem>

              </Select>

              {validationErrors.status && (
                <Box
                  component="span"
                  sx={{
                    color: "error.main",
                    fontSize: "0.75rem",
                    mt: 0.5,
                    ml: 1.5,
                  }}
                >
                  {
                    validationErrors.status
                  }
                </Box>
              )}

            </FormControl>

            {/*==========================================
                Description
            ==========================================*/}

            <TextField
              fullWidth
              multiline
              minRows={4}
              maxRows={8}
              label="Description"
              name="description"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              disabled={
                loading ||
                isViewMode
              }
              placeholder="Enter report description..."
              inputProps={{
                maxLength: 1000,
              }}
            />

            {/*==========================================
                Internal Remarks
            ==========================================*/}

            <TextField
              fullWidth
              multiline
              minRows={3}
              maxRows={6}
              label="Internal Remarks"
              name="remarks"
              value={
                formData.remarks
              }
              onChange={
                handleChange
              }
              disabled={
                loading ||
                isViewMode
              }
              placeholder="Enter internal remarks..."
              inputProps={{
                maxLength: 1000,
              }}
            />

          </Stack>

        </Box>

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
          startIcon={<Close />}
          onClick={handleClose}
          disabled={loading}
        >
          Close
        </Button>

        {!isViewMode && (
          <Button
            type="submit"
            form="dashboard-report-form"
            variant="contained"
            startIcon={<Save />}
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : isEditMode
                ? "Update Report"
                : "Save Report"}
          </Button>
        )}

      </DialogActions>

    </Dialog>
  );
};

//======================================================
// Part 1B Ends Here
//======================================================
//======================================================
// PropTypes
//======================================================

DashboardReportModal.propTypes = {
  open: PropTypes.bool,

  mode: PropTypes.oneOf([
    "add",
    "edit",
    "view",
  ]),

  report: PropTypes.object,

  loading: PropTypes.bool,

  error: PropTypes.string,

  onClose: PropTypes.func,

  onSubmit: PropTypes.func,
};

//======================================================
// Default Props
//======================================================

DashboardReportModal.defaultProps = {
  open: false,

  mode: "add",

  report: null,

  loading: false,

  error: "",

  onClose: () => {},

  onSubmit: () => {},
};

//======================================================
// Export
//======================================================

export default DashboardReportModal;