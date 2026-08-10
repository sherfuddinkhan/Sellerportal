
//======================================================
// StockLedgerReportModal.jsx
// Part 1A
//======================================================

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

//======================================================
// Helpers
//======================================================

import {
  formatDate,
  formatNumber,
  normalizeStockLedgerReport,
  getStockLedgerStatusColor,
} from "./StockLedgerReportHelpers";

//======================================================
// StockLedgerReportModal
//======================================================

const StockLedgerReportModal = ({
  open = false,
  report = null,
  mode = "view",
  loading = false,
  onClose,
  onEdit,
  onDelete,
  onSave,
}) => {
  //====================================================
  // Local State
  //====================================================

  const [formData, setFormData] =
    useState({});

  const [saving, setSaving] =
    useState(false);

  const [deleteConfirm, setDeleteConfirm] =
    useState(false);

  const [localError, setLocalError] =
    useState("");

  //====================================================
  // Normalized Report
  //====================================================

  const normalizedReport = useMemo(() => {
    if (!report) {
      return null;
    }

    return normalizeStockLedgerReport(
      report
    );
  }, [report]);

  //====================================================
  // Initialize Form
  //====================================================

  useEffect(() => {
    if (!normalizedReport) {
      setFormData({});
      return;
    }

    setFormData({
      ...normalizedReport,
    });

    setDeleteConfirm(false);
    setLocalError("");
  }, [normalizedReport, open]);

  //====================================================
  // Edit Mode
  //====================================================

  const isEditMode =
    mode === "edit";

  //====================================================
  // Field Change
  //====================================================

  const handleChange = useCallback(
    (field) => (event) => {
      const value =
        event?.target?.value ?? "";

      setFormData(
        (previous) => ({
          ...previous,
          [field]: value,
        })
      );
    },
    []
  );

  //====================================================
  // Close Modal
  //====================================================

  const handleClose = useCallback(() => {
    if (saving) {
      return;
    }

    setLocalError("");
    setDeleteConfirm(false);

    if (
      typeof onClose ===
      "function"
    ) {
      onClose();
    }
  }, [
    onClose,
    saving,
  ]);

  //====================================================
  // Edit
  //====================================================

  const handleEdit = useCallback(() => {
    if (
      typeof onEdit !==
      "function" ||
      !report
    ) {
      return;
    }

    onEdit(report);
  }, [
    onEdit,
    report,
  ]);

  //====================================================
  // Save
  //====================================================

  const handleSave = useCallback(
    async () => {
      if (
        typeof onSave !==
        "function"
      ) {
        return;
      }

      setSaving(true);
      setLocalError("");

      try {
        await onSave(
          formData
        );
      } catch (saveError) {
        console.error(
          "Failed to save stock ledger report:",
          saveError
        );

        setLocalError(
          saveError?.message ||
            "Failed to save stock ledger report."
        );
      } finally {
        setSaving(false);
      }
    },
    [
      formData,
      onSave,
    ]
  );

  //====================================================
  // Delete
  //====================================================

  const handleDelete = useCallback(
    async () => {
      if (
        typeof onDelete !==
        "function" ||
        !report
      ) {
        return;
      }

      setSaving(true);
      setLocalError("");

      try {
        await onDelete(
          report
        );

        setDeleteConfirm(false);
      } catch (deleteError) {
        console.error(
          "Failed to delete stock ledger report:",
          deleteError
        );

        setLocalError(
          deleteError?.message ||
            "Failed to delete stock ledger report."
        );
      } finally {
        setSaving(false);
      }
    },
    [
      onDelete,
      report,
    ]
  );

  //====================================================
  // Status Color
  //====================================================

  const statusColor =
    getStockLedgerStatusColor(
      normalizedReport?.status
    );

  //====================================================
  // No Report
  //====================================================

  if (!normalizedReport) {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Stock Ledger Report
        </DialogTitle>

        <DialogContent>
          <Alert severity="info">
            No stock ledger report
            selected.
          </Alert>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  //====================================================
  // Render
  //====================================================

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      scroll="paper"
    >
      {/*==============================================
          Dialog Title
      ===============================================*/}

      <DialogTitle
        sx={{
          pr: 6,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
            >
              Stock Ledger Details
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {normalizedReport.stockItem ||
                normalizedReport.itemName ||
                "Stock Item"}
            </Typography>
          </Box>

          <Chip
            size="small"
            label={
              normalizedReport.status ||
              "Pending"
            }
            color={statusColor}
            variant="outlined"
          />
        </Stack>

        <IconButton
          aria-label="Close"
          onClick={
            handleClose
          }
          disabled={saving}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseOutlinedIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      {/*==============================================
          Dialog Content
      ===============================================*/}

      <DialogContent dividers>
        <Stack spacing={3}>
          {localError && (
            <Alert severity="error">
              {localError}
            </Alert>
          )}

          {/*============================================
              Transaction Information
          =============================================*/}

          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              gutterBottom
            >
              Transaction Information
            </Typography>

            <Grid
              container
              spacing={2}
            >
              {/* Date */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                {isEditMode ? (
                  <TextField
                    fullWidth
                    size="small"
                    label="Date"
                    type="date"
                    value={
                      formData.date ||
                      ""
                    }
                    onChange={handleChange(
                      "date"
                    )}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={
                      loading ||
                      saving
                    }
                  />
                ) : (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Date
                    </Typography>

                    <Typography
                      variant="body2"
                      fontWeight={600}
                    >
                      {formatDate(
                        normalizedReport.date
                      )}
                    </Typography>
                  </Box>
                )}
              </Grid>

              {/* Voucher Number */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                {isEditMode ? (
                  <TextField
                    fullWidth
                    size="small"
                    label="Voucher Number"
                    value={
                      formData.voucherNumber ||
                      ""
                    }
                    onChange={handleChange(
                      "voucherNumber"
                    )}
                    disabled={
                      loading ||
                      saving
                    }
                  />
                ) : (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Voucher Number
                    </Typography>

                    <Typography
                      variant="body2"
                      fontWeight={600}
                    >
                      {normalizedReport.voucherNumber ||
                        "-"}
                    </Typography>
                  </Box>
                )}
              </Grid>

              {/* Voucher Type */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                {isEditMode ? (
                  <TextField
                    fullWidth
                    size="small"
                    label="Voucher Type"
                    value={
                      formData.voucherType ||
                      ""
                    }
                    onChange={handleChange(
                      "voucherType"
                    )}
                    disabled={
                      loading ||
                      saving
                    }
                  />
                ) : (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Voucher Type
                    </Typography>

                    <Typography
                      variant="body2"
                      fontWeight={600}
                    >
                      {normalizedReport.voucherType ||
                        "-"}
                    </Typography>
                  </Box>
                )}
              </Grid>

              {/* Transaction Type */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                {isEditMode ? (
                  <TextField
                    fullWidth
                    size="small"
                    label="Transaction Type"
                    value={
                      formData.transactionType ||
                      ""
                    }
                    onChange={handleChange(
                      "transactionType"
                    )}
                    disabled={
                      loading ||
                      saving
                    }
                  />
                ) : (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Transaction Type
                    </Typography>

                    <Typography
                      variant="body2"
                      fontWeight={600}
                    >
                      {normalizedReport.transactionType ||
                        "-"}
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/*============================================
              Stock Information
          =============================================*/}

          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              gutterBottom
            >
              Stock Information
            </Typography>

            <Grid
              container
              spacing={2}
            >
              {/* Stock Item */}

              <Grid
                item
                xs={12}
                md={6}
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Stock Item
                  </Typography>

                  <Typography
                    variant="body2"
                    fontWeight={600}
                  >
                    {normalizedReport.stockItem ||
                      normalizedReport.itemName ||
                      "-"}
                  </Typography>
                </Box>
              </Grid>

              {/* Warehouse */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Warehouse
                  </Typography>

                  <Typography
                    variant="body2"
                    fontWeight={600}
                  >
                    {normalizedReport.warehouse ||
                      "-"}
                  </Typography>
                </Box>
              </Grid>

              {/* Godown */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Godown
                  </Typography>

                  <Typography
                    variant="body2"
                    fontWeight={600}
                  >
                    {normalizedReport.godown ||
                      "-"}
                  </Typography>
                </Box>
              </Grid>

              {/* Inward */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Inward Quantity
                  </Typography>

                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color="success.main"
                  >
                    {formatNumber(
                      normalizedReport.inwardQuantity
                    )}
                  </Typography>
                </Box>
              </Grid>

              {/* Outward */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Outward Quantity
                  </Typography>

                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color="error.main"
                  >
                    {formatNumber(
                      normalizedReport.outwardQuantity
                    )}
                  </Typography>
                </Box>
              </Grid>

              {/* Closing */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Closing Quantity
                  </Typography>

                  <Typography
                    variant="body2"
                    fontWeight={700}
                  >
                    {formatNumber(
                      normalizedReport.closingQuantity ??
                        normalizedReport.balanceQuantity
                    )}
                  </Typography>
                </Box>
              </Grid>

              {/* Unit */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Unit
                  </Typography>

                  <Typography
                    variant="body2"
                    fontWeight={600}
                  >
                    {normalizedReport.unit ||
                      "-"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/*============================================
              Part 1A Ends Here
          =============================================*/}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

          <Divider />

          {/*============================================
              Remarks / Notes
          =============================================*/}

          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              gutterBottom
            >
              Additional Information
            </Typography>

            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={12}
              >
                {isEditMode ? (
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    maxRows={6}
                    label="Remarks"
                    value={
                      formData.remarks ||
                      formData.notes ||
                      ""
                    }
                    onChange={handleChange(
                      "remarks"
                    )}
                    disabled={
                      loading ||
                      saving
                    }
                  />
                ) : (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Remarks
                    </Typography>
                    <Typography
                      variant="body2"
                    >
                      {normalizedReport.remarks ||
                        normalizedReport.notes ||
                        "No remarks available"}
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </DialogContent>

      {/*==============================================
          Dialog Actions
      ==============================================*/}

      <DialogActions
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Button
          onClick={handleClose}
          disabled={saving}
        >
          Close
        </Button>

        {!isEditMode &&
          typeof onEdit ===
            "function" && (
            <Button
              startIcon={
                <EditOutlinedIcon />
              }
              onClick={
                handleEdit
              }
              disabled={
                loading ||
                saving
              }
            >
              Edit
            </Button>
          )}

        {!isEditMode &&
          typeof onDelete ===
            "function" && (
            <Button
              color="error"
              startIcon={
                <DeleteOutlineOutlinedIcon />
              }
              onClick={() =>
                setDeleteConfirm(
                  true
                )
              }
              disabled={
                loading ||
                saving
              }
            >
              Delete
            </Button>
          )}

        {isEditMode && (
          <Button
            variant="contained"
            startIcon={
              saving ? (
                <CircularProgress
                  size={18}
                />
              ) : (
                <SaveOutlinedIcon />
              )
            }
            onClick={
              handleSave
            }
            disabled={
              loading ||
              saving
            }
          >
            Save
          </Button>
        )}
      </DialogActions>

      {/*==============================================
          Delete Confirmation
      ==============================================*/}

      <Dialog
        open={
          deleteConfirm
        }
        onClose={() =>
          setDeleteConfirm(
            false
          )
        }
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Delete Stock Ledger Entry
        </DialogTitle>

        <DialogContent>
          <Typography
            variant="body2"
          >
            Are you sure you want
            to delete this stock
            ledger record?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setDeleteConfirm(
                false
              )
            }
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={
              handleDelete
            }
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

//======================================================
// PropTypes
//======================================================

StockLedgerReportModal.propTypes = {
  open: PropTypes.bool,

  report: PropTypes.object,

  mode: PropTypes.oneOf([
    "view",
    "edit",
  ]),

  loading:
    PropTypes.bool,

  onClose:
    PropTypes.func,

  onEdit:
    PropTypes.func,

  onDelete:
    PropTypes.func,

  onSave:
    PropTypes.func,
};

//======================================================
// Default Props
//======================================================

StockLedgerReportModal.defaultProps = {
  open: false,
  report: null,
  mode: "view",
  loading: false,
  onClose: null,
  onEdit: null,
  onDelete: null,
  onSave: null,
};

//======================================================
// Export
//======================================================

export default StockLedgerReportModal;
