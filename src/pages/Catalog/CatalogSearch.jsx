import React from "react";
import {
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
  Paper,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const CatalogSearch = ({
  filters,
  onChange,
  onSearch,
  onClear,
}) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2,
      }}
    >
      <Grid container spacing={2}>
        {/* Search */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Search Catalog"
            name="search"
            value={filters.search || ""}
            onChange={onChange}
            placeholder="Catalog Name / SKU / Product..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Category */}
        <Grid item xs={12} md={2}>
          <TextField
            select
            fullWidth
            label="Category"
            name="category"
            value={filters.category || ""}
            onChange={onChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Electronics">
              Electronics
            </MenuItem>
            <MenuItem value="Fashion">
              Fashion
            </MenuItem>
            <MenuItem value="Home">
              Home
            </MenuItem>
            <MenuItem value="Books">
              Books
            </MenuItem>
          </TextField>
        </Grid>

        {/* Brand */}
        <Grid item xs={12} md={2}>
          <TextField
            select
            fullWidth
            label="Brand"
            name="brand"
            value={filters.brand || ""}
            onChange={onChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Apple">Apple</MenuItem>
            <MenuItem value="Samsung">
              Samsung
            </MenuItem>
            <MenuItem value="Sony">Sony</MenuItem>
            <MenuItem value="Dell">Dell</MenuItem>
          </TextField>
        </Grid>

        {/* Status */}
        <Grid item xs={12} md={2}>
          <TextField
            select
            fullWidth
            label="Status"
            name="status"
            value={filters.status || ""}
            onChange={onChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Active">
              Active
            </MenuItem>
            <MenuItem value="Inactive">
              Inactive
            </MenuItem>
            <MenuItem value="Draft">
              Draft
            </MenuItem>
            <MenuItem value="Published">
              Published
            </MenuItem>
          </TextField>
        </Grid>

        {/* Visibility */}
        <Grid item xs={12} md={2}>
          <TextField
            select
            fullWidth
            label="Visibility"
            name="visibility"
            value={filters.visibility || ""}
            onChange={onChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Public">
              Public
            </MenuItem>
            <MenuItem value="Private">
              Private
            </MenuItem>
            <MenuItem value="Hidden">
              Hidden
            </MenuItem>
          </TextField>
        </Grid>

        {/* Buttons */}
        <Grid item xs={12}>
          <Grid
            container
            spacing={2}
            justifyContent="flex-end"
          >
            <Grid item>
              <Button
                variant="contained"
                startIcon={<FilterAltIcon />}
                onClick={onSearch}
              >
                Search
              </Button>
            </Grid>

            <Grid item>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<ClearIcon />}
                onClick={onClear}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CatalogSearch;