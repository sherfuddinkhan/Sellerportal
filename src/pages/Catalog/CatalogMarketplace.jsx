import React, {useState,useEffect,useMemo,useCallback} from "react";
import PropTypes from "prop-types";
import {Box,Grid,Card,CardContent,CardHeader,Typography,Divider,Avatar,Chip,Stack,Paper,Button,IconButton,Tooltip,LinearProgress,Alert,TextField,InputAdornment,} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  CheckCircle,
  Error,
  Sync,
  Refresh,
  Visibility,
  Launch,
  Store,
  Inventory2,
  MoreVert,
  Edit,
  Delete,
  Search
} from "@mui/icons-material";
import { format } from "date-fns";
import "./Catalog.css";

// =========================================================
// Default Marketplace Status Colors
// =========================================================

const STATUS_COLORS = {
  Active: "success",
  Inactive: "default",
  Draft: "warning",
  Pending: "info",
  Error: "error",
  Disabled: "secondary",
};

// =========================================================
// Marketplace Icons
// =========================================================

const MARKETPLACE_ICONS = {
  Amazon: <Store color="warning" />,
  Flipkart: <Store color="primary" />,
  Meesho: <Store color="secondary" />,
  Myntra: <Store color="error" />,
  Shopify: <Store color="success" />,
  WooCommerce: <Store color="info" />,
};

// =========================================================
// Currency Formatter
// =========================================================

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
});

// =========================================================
// Quantity Formatter
// =========================================================

const quantityFormatter = (qty) => {
  if (qty === null || qty === undefined) {
    return "-";
  }

  return Number(qty).toLocaleString("en-IN");
};

// =========================================================
// Date Formatter
// =========================================================

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  try {
    return format(
      new Date(value),
      "dd-MMM-yyyy hh:mm a"
    );
  } catch {
    return "-";
  }
};

// =========================================================
// Status Chip
// =========================================================

const getStatusChip = (status) => {
  return (
    <Chip
      size="small"
      label={status || "Unknown"}
      color={
        STATUS_COLORS[status] || "default"
      }
      variant="filled"
    />
  );
};

// =========================================================
// Marketplace Icon
// =========================================================

const getMarketplaceIcon = (name) => {
  return (
    MARKETPLACE_ICONS[name] || (
      <Store color="action" />
    )
  );
};

// =========================================================
// Empty Message
// =========================================================

const EMPTY_MESSAGE =
  "No marketplace listing available for this product.";

// =========================================================
// Page Size Options
// =========================================================

const PAGE_SIZE_OPTIONS = [
  5,
  10,
  25,
  50,
  100,
];

// =========================================================
// Initial Snackbar
// =========================================================

const INITIAL_SNACKBAR = {
  open: false,
  severity: "success",
  message: "",
};

// =========================================================
// Initial Menu
// =========================================================

const INITIAL_MENU = {
  anchorEl: null,
  row: null,
};

// =========================================================
// CatalogMarketplace Component
// =========================================================

const CatalogMarketplace = ({
  productId,
  refreshTrigger = 0,
  readOnly = true,
  onView,
  onEdit,
  onDelete,
}) => {
  // =======================================================
  // State
  // =======================================================

  const [loading, setLoading] =
    useState(false);

  const [marketplaces, setMarketplaces] =
    useState([]);

  const [
    selectedMarketplace,
    setSelectedMarketplace,
  ] = useState(null);

  const [searchText, setSearchText] =
    useState("");

  const [page, setPage] = useState(0);

  const [pageSize, setPageSize] =
    useState(10);

  const [error, setError] =
    useState("");

  const [snackbar, setSnackbar] =
    useState(INITIAL_SNACKBAR);

  const [menuState, setMenuState] =
    useState(INITIAL_MENU);

  // =======================================================
  // Load Marketplace Listings
  // =======================================================

  const loadMarketplaceListings =
    useCallback(async () => {
      if (!productId) {
        setMarketplaces([]);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await catalogService.getMarketplaceListings(
            productId
          );

        const data =
          response?.data ?? response ?? [];

        setMarketplaces(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        console.error(
          "Marketplace listings error:",
          err
        );

        const message =
          err?.response?.data?.message ||
          "Unable to load marketplace listings.";

        setError(message);

        setSnackbar({
          open: true,
          severity: "error",
          message:
            "Failed to load marketplace listings.",
        });

        setMarketplaces([]);
      } finally {
        setLoading(false);
      }
    }, [productId]);

  // =======================================================
  // Initial Load / Refresh
  // =======================================================

  useEffect(() => {
    loadMarketplaceListings();
  }, [
    loadMarketplaceListings,
    refreshTrigger,
  ]);

  // =======================================================
  // Selected Marketplace
  // =======================================================

  useEffect(() => {
    if (marketplaces.length > 0) {
      setSelectedMarketplace(
        marketplaces[0]
      );
    } else {
      setSelectedMarketplace(null);
    }
  }, [marketplaces]);

  // =======================================================
  // Search
  // =======================================================

  const filteredMarketplaces = useMemo(() => {
    const keyword =
      searchText.trim().toLowerCase();

    if (!keyword) {
      return marketplaces;
    }

    return marketplaces.filter((item) => {
      return (
        item.marketplaceName
          ?.toLowerCase()
          .includes(keyword) ||

        item.marketplaceType
          ?.toLowerCase()
          .includes(keyword) ||

        item.marketplaceSku
          ?.toLowerCase()
          .includes(keyword) ||

        item.externalListingId
          ?.toLowerCase()
          .includes(keyword) ||

        item.productName
          ?.toLowerCase()
          .includes(keyword) ||

        item.brand
          ?.toLowerCase()
          .includes(keyword) ||

        item.category
          ?.toLowerCase()
          .includes(keyword) ||

        item.status
          ?.toLowerCase()
          .includes(keyword) ||

        item.syncStatus
          ?.toLowerCase()
          .includes(keyword)
      );
    });
  }, [
    marketplaces,
    searchText,
  ]);

  // =======================================================
  // Search Handler
  // =======================================================

  const handleSearchChange = (
    event
  ) => {
    setSearchText(
      event.target.value
    );

    setPage(0);
  };

  // =======================================================
  // Refresh
  // =======================================================

  const handleRefresh = () => {
    loadMarketplaceListings();
  };

  // =======================================================
  // Pagination
  // =======================================================

  const handlePageChange = (
    newPage
  ) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (
    newPageSize
  ) => {
    setPageSize(newPageSize);
    setPage(0);
  };

  // =======================================================
  // View
  // =======================================================

  const handleView = (row) => {
    setSelectedMarketplace(row);

    if (typeof onView === "function") {
      onView(row);
    }
  };

  // =======================================================
  // Edit
  // =======================================================

  const handleEdit = (row) => {
    if (readOnly) {
      return;
    }

    if (typeof onEdit === "function") {
      onEdit(row);
    }
  };

  // =======================================================
  // Delete
  // =======================================================

  const handleDelete = (row) => {
    if (readOnly) {
      return;
    }

    if (typeof onDelete === "function") {
      onDelete(row);
    }
  };

  // =======================================================
  // Open Listing
  // =======================================================

  const handleOpenListing = (row) => {
    if (!row?.listingUrl) {
      return;
    }

    window.open(
      row.listingUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =======================================================
  // Row Click
  // =======================================================

  const handleRowClick = (params) => {
    setSelectedMarketplace(
      params.row
    );
  };

  // =======================================================
  // Menu
  // =======================================================

  const handleMenuOpen = (
    event,
    row
  ) => {
    setMenuState({
      anchorEl:
        event.currentTarget,
      row,
    });
  };

  const handleMenuClose = () => {
    setMenuState(INITIAL_MENU);
  };

  // =======================================================
  // Snackbar
  // =======================================================

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // =======================================================
  // DataGrid Columns
  // =======================================================

  const columns = useMemo(
    () => [
      {
        field: "marketplaceName",
        headerName: "Marketplace",
        flex: 1.2,
        minWidth: 180,

        renderCell: ({
          value,
        }) => (
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            {getMarketplaceIcon(value)}

            <Typography variant="body2">
              {value || "-"}
            </Typography>
          </Stack>
        ),
      },

      {
        field: "marketplaceSku",
        headerName:
          "Marketplace SKU",
        minWidth: 170,
        flex: 1,
      },

      {
        field: "externalListingId",
        headerName: "Listing ID",
        minWidth: 180,
        flex: 1.2,
      },

      {
        field: "sellingPrice",
        headerName: "Price",
        width: 130,
        align: "right",
        headerAlign: "right",

        renderCell: ({
          value,
        }) =>
          currencyFormatter.format(
            Number(value) || 0
          ),
      },

      {
        field: "availableQuantity",
        headerName: "Stock",
        width: 110,
        align: "center",
        headerAlign: "center",

        renderCell: ({
          value,
        }) =>
          quantityFormatter(value),
      },

      {
        field: "status",
        headerName: "Status",
        width: 130,

        renderCell: ({
          value,
        }) =>
          getStatusChip(value),
      },

      {
        field: "syncStatus",
        headerName: "Sync Status",
        width: 140,

        renderCell: ({
          value,
        }) => (
          <Chip
            size="small"
            label={
              value || "Unknown"
            }
            color={
              value === "Success"
                ? "success"
                : value === "Pending"
                ? "warning"
                : value === "Error"
                ? "error"
                : "default"
            }
          />
        ),
      },

      {
        field: "lastSyncDate",
        headerName: "Last Sync",
        width: 170,

        renderCell: ({
          value,
        }) =>
          formatDate(value),
      },

      {
        field: "actions",
        headerName: "Actions",
        width: readOnly
          ? 150
          : 210,

        sortable: false,
        filterable: false,

        renderCell: ({
          row,
        }) => (
          <Stack
            direction="row"
            spacing={0.5}
          >
            <Tooltip title="View">
              <IconButton
                color="primary"
                size="small"
                onClick={() =>
                  handleView(row)
                }
              >
                <Visibility />
              </IconButton>
            </Tooltip>

            {row.listingUrl && (
              <Tooltip title="Open Listing">
                <IconButton
                  color="success"
                  size="small"
                  onClick={() =>
                    handleOpenListing(
                      row
                    )
                  }
                >
                  <Launch />
                </IconButton>
              </Tooltip>
            )}

            {!readOnly && (
              <>
                <Tooltip title="Edit">
                  <IconButton
                    color="warning"
                    size="small"
                    onClick={() =>
                      handleEdit(row)
                    }
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() =>
                      handleDelete(row)
                    }
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </>
            )}

            <Tooltip title="More">
              <IconButton
                size="small"
                onClick={(event) =>
                  handleMenuOpen(
                    event,
                    row
                  )
                }
              >
                <MoreVert />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [readOnly]
  );

  // =======================================================
  // Summary Statistics
  // =======================================================

  const totalListings =
    marketplaces.length;

  const activeListings =
    marketplaces.filter(
      (item) =>
        item.status === "Active"
    ).length;

  const inStockListings =
    marketplaces.filter(
      (item) =>
        Number(
          item.availableQuantity
        ) > 0
    ).length;

  const syncErrors =
    marketplaces.filter(
      (item) =>
        item.syncStatus === "Error"
    ).length;

  // =======================================================
  // JSX
  // =======================================================

  return (
    <Box
      sx={{
        width: "100%",
        p: 2,
      }}
    >
      {/* Loading */}

      {loading && (
        <LinearProgress
          sx={{ mb: 2 }}
        />
      )}

      {/* Error */}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}

      {/* Header */}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
          >
            Marketplace Listings
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            View and manage marketplace
            availability, pricing,
            inventory and sync status.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Summary Cards */}

      <Grid
        container
        spacing={2}
        mb={3}
      >
        {/* Total */}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Total Listings
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={700}
                  >
                    {totalListings}
                  </Typography>
                </Box>

                <Avatar
                  sx={{
                    bgcolor:
                      "primary.main",
                  }}
                >
                  <Store />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Active */}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Active
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={700}
                  >
                    {activeListings}
                  </Typography>
                </Box>

                <Avatar
                  sx={{
                    bgcolor:
                      "success.main",
                  }}
                >
                  <CheckCircle />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* In Stock */}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    In Stock
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={700}
                  >
                    {inStockListings}
                  </Typography>
                </Box>

                <Avatar
                  sx={{
                    bgcolor:
                      "info.main",
                  }}
                >
                  <Inventory2 />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Sync Errors */}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Sync Errors
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={700}
                  >
                    {syncErrors}
                  </Typography>
                </Box>

                <Avatar
                  sx={{
                    bgcolor:
                      "error.main",
                  }}
                >
                  <ErrorOutline />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Toolbar */}

      <Paper
        sx={{
          p: 2,
          mb: 3,
        }}
      >
        <Grid
          container
          spacing={2}
          alignItems="center"
        >
          <Grid
            item
            xs={12}
            md={8}
          >
            <TextField
              fullWidth
              size="small"
              label="Search Marketplace Listings"
              placeholder="Search marketplace, SKU, listing ID, brand, category..."
              value={searchText}
              onChange={
                handleSearchChange
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={4}
          >
            <Stack
              direction="row"
              spacing={1}
              justifyContent="flex-end"
            >
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={
                  handleRefresh
                }
                disabled={loading}
              >
                Refresh
              </Button>

              <Button
                variant="contained"
                startIcon={<Sync />}
                disabled={loading}
              >
                Sync All
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* DataGrid */}

      <Card>
        <CardHeader
          title="Marketplace Listings"
          subheader={`${filteredMarketplaces.length} listing(s) found`}
        />

        <Divider />

        <CardContent
          sx={{ p: 0 }}
        >
          {filteredMarketplaces.length ===
          0 ? (
            <Box
              py={8}
              textAlign="center"
            >
              <Typography
                variant="h6"
                gutterBottom
              >
                No Listings Found
              </Typography>

              <Typography color="text.secondary">
                {EMPTY_MESSAGE}
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                height: 600,
                width: "100%",
              }}
            >
              <DataGrid
                rows={
                  filteredMarketplaces
                }
                columns={columns}
                getRowId={(row) =>
                  row.marketplaceListingId
                }
                pagination
                pageSizeOptions={
                  PAGE_SIZE_OPTIONS
                }
                paginationModel={{
                  page,
                  pageSize,
                }}
                onPaginationModelChange={(
                  model
                ) => {
                  setPage(model.page);
                  setPageSize(
                    model.pageSize
                  );
                }}
                onRowClick={
                  handleRowClick
                }
                disableRowSelectionOnClick
                loading={loading}
                sx={{
                  border: 0,

                  "& .MuiDataGrid-columnHeaders":
                    {
                      backgroundColor:
                        "action.hover",
                      fontWeight: 600,
                    },
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* More Menu */}

      <Menu
        anchorEl={
          menuState.anchorEl
        }
        open={Boolean(
          menuState.anchorEl
        )}
        onClose={
          handleMenuClose
        }
      >
        <MenuItem
          onClick={() => {
            if (
              menuState.row
            ) {
              handleView(
                menuState.row
              );
            }

            handleMenuClose();
          }}
        >
          <Visibility
            fontSize="small"
            sx={{ mr: 1 }}
          />
          View
        </MenuItem>

        {!readOnly && (
          <>
            <MenuItem
              onClick={() => {
                if (
                  menuState.row
                ) {
                  handleEdit(
                    menuState.row
                  );
                }

                handleMenuClose();
              }}
            >
              <Edit
                fontSize="small"
                sx={{ mr: 1 }}
              />
              Edit
            </MenuItem>

            <MenuItem
              onClick={() => {
                if (
                  menuState.row
                ) {
                  handleDelete(
                    menuState.row
                  );
                }

                handleMenuClose();
              }}
            >
              <Delete
                fontSize="small"
                sx={{ mr: 1 }}
              />
              Delete
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Snackbar */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={
          handleSnackbarClose
        }
      >
        <Alert
          severity={
            snackbar.severity
          }
          onClose={
            handleSnackbarClose
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// =========================================================
// PropTypes
// =========================================================

CatalogMarketplace.propTypes = {
  productId:
    PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

  refreshTrigger:
    PropTypes.number,

  readOnly:
    PropTypes.bool,

  onView:
    PropTypes.func,

  onEdit:
    PropTypes.func,

  onDelete:
    PropTypes.func,
};

// =========================================================
// Default Props
// =========================================================

CatalogMarketplace.defaultProps = {
  productId: null,
  refreshTrigger: 0,
  readOnly: true,
  onView: null,
  onEdit: null,
  onDelete: null,
};

// =========================================================
// Export
// =========================================================

export default CatalogMarketplace;