import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

import PropTypes from "prop-types";

import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Divider,
  Avatar,
  Chip,
  Stack,
  Paper,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  LinearProgress,
  Alert,
  Snackbar,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
} from "@mui/material";

import {
  DataGrid,
} from "@mui/x-data-grid";

import {
  CheckCircle,
  Cancel,
  ErrorOutline,
  Sync,
  Refresh,
  Visibility,
  Launch,
  Store,
  Inventory2,
  LocalOffer,
  Paid,
  ShoppingCart,
  CloudDone,
  CloudOff,
  MoreVert,
  Edit,
  Delete,
  Link,
} from "@mui/icons-material";

import { format } from "date-fns";

import catalogService from "../../services/catalogService";

import "../../styles/Catalog.css";

//=========================================================
// Default Marketplace Status Colors
//=========================================================
const STATUS_COLORS = {
  Active: "success",
  Inactive: "default",
  Draft: "warning",
  Pending: "info",
  Error: "error",
  Disabled: "secondary",
};

//=========================================================
// Marketplace Logos (can be replaced with image URLs)
//=========================================================
const MARKETPLACE_ICONS = {
  Amazon: <Store color="warning" />,
  Flipkart: <Store color="primary" />,
  Meesho: <Store color="secondary" />,
  Myntra: <Store color="error" />,
  Shopify: <Store color="success" />,
  WooCommerce: <Store color="info" />,
};

//=========================================================
// Default Marketplace Object
//=========================================================
const defaultMarketplace = {
  marketplaceListingId: 0,
  marketplaceAccountId: 0,
  marketplaceName: "",
  marketplaceType: "",
  marketplaceSku: "",
  externalListingId: "",
  productName: "",
  category: "",
  brand: "",
  sellingPrice: 0,
  mrp: 0,
  availableQuantity: 0,
  reservedQuantity: 0,
  status: "Draft",
  syncStatus: "Pending",
  lastSyncDate: null,
  listingUrl: "",
  imageUrl: "",
};

//=========================================================
// Currency Formatter
//=========================================================
const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
});

//=========================================================
// Quantity Formatter
//=========================================================
const quantityFormatter = (qty) => {
  if (qty === null || qty === undefined) return "-";
  return qty.toLocaleString("en-IN");
};

//=========================================================
// Date Formatter
//=========================================================
const formatDate = (value) => {
  if (!value) return "-";

  try {
    return format(new Date(value), "dd-MMM-yyyy hh:mm a");
  } catch {
    return "-";
  }
};

//=========================================================
// Status Chip
//=========================================================
const getStatusChip = (status) => (
  <Chip
    size="small"
    label={status}
    color={STATUS_COLORS[status] || "default"}
    variant="filled"
  />
);

//=========================================================
// Marketplace Icon
//=========================================================
const getMarketplaceIcon = (name) =>
  MARKETPLACE_ICONS[name] || <Store color="action" />;

//=========================================================
// Empty State
//=========================================================
const EMPTY_MESSAGE =
  "No marketplace listing available for this product.";

//=========================================================
// Page Size Options
//=========================================================
const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

//=========================================================
// Initial Snackbar State
//=========================================================
const INITIAL_SNACKBAR = {
  open: false,
  severity: "success",
  message: "",
};

//=========================================================
// Initial Menu State
//=========================================================
const INITIAL_MENU = {
  anchorEl: null,
  row: null,
};
//=========================================================
// CatalogMarketplace Component
//=========================================================
const CatalogMarketplace = ({
  productId,
  refreshTrigger = 0,
  readOnly = true,
  onView,
  onEdit,
  onDelete,
}) => {
  //=======================================================
  // State
  //=======================================================

  const [loading, setLoading] = useState(false);

  const [marketplaces, setMarketplaces] = useState([]);

  const [selectedMarketplace, setSelectedMarketplace] =
    useState(null);

  const [page, setPage] = useState(0);

  const [pageSize, setPageSize] = useState(10);

  const [searchText, setSearchText] = useState("");

  const [snackbar, setSnackbar] =
    useState(INITIAL_SNACKBAR);

  const [menuState, setMenuState] =
    useState(INITIAL_MENU);

  const [error, setError] = useState("");

  //=======================================================
  // Close Snackbar
  //=======================================================

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  //=======================================================
  // Menu
  //=======================================================

  const handleMenuOpen = (event, row) => {
    setMenuState({
      anchorEl: event.currentTarget,
      row,
    });
  };

  const handleMenuClose = () => {
    setMenuState(INITIAL_MENU);
  };

  //=======================================================
  // Load Marketplace Listings
  //=======================================================

  const loadMarketplaceListings =
    useCallback(async () => {
      if (!productId) return;

      try {
        setLoading(true);
        setError("");

        const response =
          await catalogService.getMarketplaceListings(
            productId
          );

        setMarketplaces(
          response?.data ||
            response ||
            []
        );
      } catch (err) {
        console.error(err);

        setError(
          err?.response?.data?.message ||
            "Unable to load marketplace listings."
        );

        setSnackbar({
          open: true,
          severity: "error",
          message:
            "Failed to load marketplace listings.",
        });
      } finally {
        setLoading(false);
      }
    }, [productId]);

  //=======================================================
  // Initial Load
  //=======================================================

  useEffect(() => {
    loadMarketplaceListings();
  }, [
    loadMarketplaceListings,
    refreshTrigger,
  ]);

  //=======================================================
  // Selected Marketplace
  //=======================================================

  useEffect(() => {
    if (marketplaces.length > 0) {
      setSelectedMarketplace(
        marketplaces[0]
      );
    } else {
      setSelectedMarketplace(null);
    }
  }, [marketplaces]);
    //=======================================================
  // Search / Filter
  //=======================================================

  const filteredMarketplaces = useMemo(() => {
    if (!searchText.trim()) return marketplaces;

    const keyword = searchText.toLowerCase();

    return marketplaces.filter((item) => {
      return (
        item.marketplaceName?.toLowerCase().includes(keyword) ||
        item.marketplaceType?.toLowerCase().includes(keyword) ||
        item.marketplaceSku?.toLowerCase().includes(keyword) ||
        item.externalListingId?.toLowerCase().includes(keyword) ||
        item.productName?.toLowerCase().includes(keyword) ||
        item.brand?.toLowerCase().includes(keyword) ||
        item.category?.toLowerCase().includes(keyword) ||
        item.status?.toLowerCase().includes(keyword) ||
        item.syncStatus?.toLowerCase().includes(keyword)
      );
    });
  }, [marketplaces, searchText]);

  //=======================================================
  // Refresh
  //=======================================================

  const handleRefresh = () => {
    loadMarketplaceListings();
  };

  //=======================================================
  // Search Change
  //=======================================================

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  //=======================================================
  // DataGrid Pagination
  //=======================================================

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
  };

  //=======================================================
  // View
  //=======================================================

  const handleView = (row) => {
    setSelectedMarketplace(row);

    if (onView) {
      onView(row);
    }
  };

  //=======================================================
  // Edit
  //=======================================================

  const handleEdit = (row) => {
    if (readOnly) return;

    if (onEdit) {
      onEdit(row);
    }
  };

  //=======================================================
  // Delete
  //=======================================================

  const handleDelete = (row) => {
    if (readOnly) return;

    if (onDelete) {
      onDelete(row);
    }
  };

  //=======================================================
  // DataGrid Columns
  //=======================================================

  const columns = [
    {
      field: "marketplaceName",
      headerName: "Marketplace",
      flex: 1.2,
      minWidth: 170,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
        >
          {getMarketplaceIcon(params.value)}

          <Typography variant="body2">
            {params.value}
          </Typography>
        </Stack>
      ),
    },

    {
      field: "marketplaceSku",
      headerName: "Marketplace SKU",
      flex: 1.2,
      minWidth: 170,
    },

    {
      field: "externalListingId",
      headerName: "Listing ID",
      flex: 1.4,
      minWidth: 180,
    },

    {
      field: "sellingPrice",
      headerName: "Selling Price",
      width: 150,
      align: "right",
      headerAlign: "right",
      renderCell: (params) =>
        currencyFormatter.format(params.value || 0),
    },

    {
      field: "availableQuantity",
      headerName: "Available Qty",
      width: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        quantityFormatter(params.value),
    },

    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) =>
        getStatusChip(params.value),
    },

    {
      field: "syncStatus",
      headerName: "Sync",
      width: 130,
      renderCell: (params) => (
        <Chip
          size="small"
          color={
            params.value === "Success"
              ? "success"
              : params.value === "Pending"
              ? "warning"
              : "error"
          }
          label={params.value}
        />
      ),
    },

    {
      field: "lastSyncDate",
      headerName: "Last Sync",
      width: 170,
      renderCell: (params) =>
        formatDate(params.value),
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View">
            <IconButton
              color="primary"
              onClick={() => handleView(row)}
            >
              <Visibility />
            </IconButton>
          </Tooltip>

          {!readOnly && (
            <>
              <Tooltip title="Edit">
                <IconButton
                  color="warning"
                  onClick={() => handleEdit(row)}
                >
                  <Edit />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete">
                <IconButton
                  color="error"
                  onClick={() => handleDelete(row)}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </>
          )}

          <Tooltip title="More">
            <IconButton
              onClick={(e) =>
                handleMenuOpen(e, row)
              }
            >
              <MoreVert />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];
    //=======================================================
  // Search & Filter
  //=======================================================

  const filteredRows = useMemo(() => {
    if (!searchText.trim()) return marketplaces;

    const keyword = searchText.toLowerCase();

    return marketplaces.filter((item) => {
      return (
        item.marketplaceName?.toLowerCase().includes(keyword) ||
        item.marketplaceType?.toLowerCase().includes(keyword) ||
        item.marketplaceSku?.toLowerCase().includes(keyword) ||
        item.externalListingId?.toLowerCase().includes(keyword) ||
        item.productName?.toLowerCase().includes(keyword) ||
        item.brand?.toLowerCase().includes(keyword) ||
        item.category?.toLowerCase().includes(keyword) ||
        item.status?.toLowerCase().includes(keyword) ||
        item.syncStatus?.toLowerCase().includes(keyword)
      );
    });
  }, [marketplaces, searchText]);

  //=======================================================
  // Search Handler
  //=======================================================

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  //=======================================================
  // Refresh Marketplace Data
  //=======================================================

  const handleRefresh = () => {
    loadMarketplaceListings();
  };

  //=======================================================
  // Pagination
  //=======================================================

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
  };

  //=======================================================
  // View Marketplace
  //=======================================================

  const handleView = (row) => {
    setSelectedMarketplace(row);

    if (onView) {
      onView(row);
    }
  };

  //=======================================================
  // Edit Marketplace
  //=======================================================

  const handleEdit = (row) => {
    if (readOnly) return;

    if (onEdit) {
      onEdit(row);
    }
  };

  //=======================================================
  // Delete Marketplace
  //=======================================================

  const handleDelete = (row) => {
    if (readOnly) return;

    if (onDelete) {
      onDelete(row);
    }
  };

  //=======================================================
  // Open Marketplace Listing
  //=======================================================

  const handleOpenListing = (row) => {
    if (row.listingUrl) {
      window.open(row.listingUrl, "_blank");
    }
  };

  //=======================================================
  // DataGrid Columns
  //=======================================================

  const columns = [
    {
      field: "marketplaceName",
      headerName: "Marketplace",
      flex: 1.2,
      minWidth: 180,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={1} alignItems="center">
          {getMarketplaceIcon(row.marketplaceName)}
          <Typography variant="body2">
            {row.marketplaceName}
          </Typography>
        </Stack>
      ),
    },

    {
      field: "marketplaceSku",
      headerName: "Marketplace SKU",
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
      width: 120,
      align: "right",
      headerAlign: "right",
      renderCell: ({ value }) =>
        currencyFormatter.format(value || 0),
    },

    {
      field: "availableQuantity",
      headerName: "Stock",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: ({ value }) =>
        quantityFormatter(value),
    },

    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: ({ value }) =>
        getStatusChip(value),
    },

    {
      field: "syncStatus",
      headerName: "Sync Status",
      width: 140,
      renderCell: ({ value }) => (
        <Chip
          size="small"
          label={value}
          color={
            value === "Success"
              ? "success"
              : value === "Pending"
              ? "warning"
              : "error"
          }
        />
      ),
    },

    {
      field: "lastSyncDate",
      headerName: "Last Sync",
      width: 170,
      renderCell: ({ value }) =>
        formatDate(value),
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 210,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="View">
            <IconButton
              color="primary"
              onClick={() => handleView(row)}
            >
              <Visibility />
            </IconButton>
          </Tooltip>

          <Tooltip title="Open Listing">
            <IconButton
              color="success"
              onClick={() => handleOpenListing(row)}
            >
              <Launch />
            </IconButton>
          </Tooltip>

          {!readOnly && (
            <>
              <Tooltip title="Edit">
                <IconButton
                  color="warning"
                  onClick={() => handleEdit(row)}
                >
                  <Edit />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete">
                <IconButton
                  color="error"
                  onClick={() => handleDelete(row)}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </>
          )}

          <Tooltip title="More">
            <IconButton
              onClick={(e) =>
                handleMenuOpen(e, row)
              }
            >
              <MoreVert />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];
  `  //=========================================================
  // JSX Begins
  //=========================================================

  return (
    <Box sx={{ width: "100%", p: 2 }}>

      {/* Loading */}
      {loading && (
        <LinearProgress sx={{ mb: 2 }} />
      )}

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
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
          <Typography variant="h5" fontWeight={700}>
            Marketplace Listings
          </Typography>

          <Typography variant="body2" color="text.secondary">
            View and manage marketplace availability, pricing, inventory and sync status.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </Stack>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} mb={3}>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Listings
                  </Typography>

                  <Typography variant="h4" fontWeight={700}>
                    {marketplaceListings.length}
                  </Typography>
                </Box>

                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <Store />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Active
                  </Typography>

                  <Typography variant="h4" fontWeight={700}>
                    {marketplaceListings.filter(x => x.status === "Active").length}
                  </Typography>
                </Box>

                <Avatar sx={{ bgcolor: "success.main" }}>
                  <CheckCircle />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    In Stock
                  </Typography>

                  <Typography variant="h4" fontWeight={700}>
                    {
                      marketplaceListings.filter(
                        x => (x.availableQuantity || 0) > 0
                      ).length
                    }
                  </Typography>
                </Box>

                <Avatar sx={{ bgcolor: "info.main" }}>
                  <Inventory2 />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Sync Errors
                  </Typography>

                  <Typography variant="h4" fontWeight={700}>
                    {marketplaceListings.filter(x => x.syncStatus === "Error").length}
                  </Typography>
                </Box>

                <Avatar sx={{ bgcolor: "error.main" }}>
                  <ErrorOutline />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Toolbar */}
      <Paper sx={{ p: 2, mb: 3 }}>

        <Grid container spacing={2} alignItems="center">

          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search marketplace, SKU, listing ID, brand, category..."
              value={searchText}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1} justifyContent="flex-end">

              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleRefresh}
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

      {/* DataGrid Section */}
      <Card>

        <CardHeader
          title="Marketplace Listings"
          subheader={\`\${filteredListings.length} listing(s) found\`}
        />

        <Divider />

        <CardContent sx={{ p: 0 }}>

          {filteredListings.length === 0 ? (

            <Box
              py={8}
              textAlign="center"
            >
              <Typography variant="h6" gutterBottom>
                No Listings Found
              </Typography>

              <Typography color="text.secondary">
                {EMPTY_MESSAGE}
              </Typography>
            </Box>

          ) : (

            <Box sx={{ height: 600, width: "100%" }}>

              <DataGrid
                rows={filteredListings}
                columns={columns}
                getRowId={(row) => row.marketplaceListingId}
                pagination
                page={page}
                pageSize={pageSize}
                rowsPerPageOptions={PAGE_SIZE_OPTIONS}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                onRowClick={handleRowClick}
                disableSelectionOnClick
                loading={loading}
                sx={{
                  border: 0,
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "action.hover",
                    fontWeight: 600,
                  },
                }}
              />

            </Box>

          )}

        </CardContent>
      </Card>
`