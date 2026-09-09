import React, { useEffect, useState } from "react";

import {
    TextField,
    InputAdornment,
    CircularProgress
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import axios from "axios";

const CategorySearch = ({
    searchText,
    setSearchText,
    setCategories
}) => {

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const searchCategories = async () => {

            // If search box is empty, don't call API
            if (!searchText.trim()) {
                setCategories([]);
                return;
            }

            try {

                setLoading(true);

                const response = await axios.get(
                    "https://localhost:7203/api/categories/search",
                    {
                        params: {
                            search: searchText
                        }
                    }
                );

                setCategories(response.data);

            } catch (error) {

                console.error(
                    "CATEGORY SEARCH ERROR:",
                    error
                );

                setCategories([]);

            } finally {

                setLoading(false);

            }
        };

        // Small delay so API is not called on every keystroke
        const timer = setTimeout(() => {
            searchCategories();
        }, 400);

        return () => clearTimeout(timer);

    }, [searchText, setCategories]);


    return (

        <TextField
            fullWidth
            size="small"

            placeholder="Search Category..."

            value={searchText}

            onChange={(e) =>
                setSearchText(e.target.value)
            }

            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),

                endAdornment: loading ? (
                    <InputAdornment position="end">
                        <CircularProgress size={20} />
                    </InputAdornment>
                ) : null
            }}
        />

    );
};

export default CategorySearch;
