// =========================================================
// ProductImageModal.jsx
// Create / Edit Product Image
//
// This component is FRONTEND ONLY.
// API calls are handled by ProductImageList.jsx
// through server.js.
// =========================================================

import React, {
    useEffect,
    useState,
} from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
} from "@mui/material";


// =========================================================
// EMPTY FORM
// =========================================================

const EMPTY_FORM = {
    ProductImageId: 0,
    ProductId: "",
    ImageUrl: "",
    ImageName: "",
    ImageType: "Main",
    IsPrimary: false,
    IsActive: true,
};


// =========================================================
// COMPONENT
// =========================================================

const ProductImageModal = ({
    open,
    image,
    onClose,
    onSave,
}) => {

    // =====================================================
    // STATE
    // =====================================================

    const [formData, setFormData] =
        useState(EMPTY_FORM);


    // =====================================================
    // LOAD IMAGE FOR EDIT
    // OR RESET FORM FOR CREATE
    // =====================================================

    useEffect(() => {

        if (image) {

            setFormData({

                ProductImageId:
                    image.ProductImageId ??
                    image.productImageId ??
                    0,

                ProductId:
                    image.ProductId ??
                    image.productId ??
                    "",

                ImageUrl:
                    image.ImageUrl ??
                    image.imageUrl ??
                    "",

                ImageName:
                    image.ImageName ??
                    image.imageName ??
                    "",

                ImageType:
                    image.ImageType ??
                    image.imageType ??
                    "Main",

                IsPrimary:
                    image.IsPrimary ??
                    image.isPrimary ??
                    false,

                IsActive:
                    image.IsActive ??
                    image.isActive ??
                    true,
            });

        }

        else {

            setFormData({
                ...EMPTY_FORM,
            });

        }

    }, [
        image,
        open,
    ]);


    // =====================================================
    // HANDLE TEXT / SELECT CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;


        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

    };


    // =====================================================
    // HANDLE PRIMARY SWITCH
    // =====================================================

    const handlePrimaryChange = (event) => {

        setFormData((previous) => ({
            ...previous,
            IsPrimary:
                event.target.checked,
        }));

    };


    // =====================================================
    // HANDLE ACTIVE SWITCH
    // =====================================================

    const handleActiveChange = (event) => {

        setFormData((previous) => ({
            ...previous,
            IsActive:
                event.target.checked,
        }));

    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = () => {

        const payload = {

            ProductImageId:
                Number(
                    formData.ProductImageId || 0
                ),

            ProductId:
                Number(
                    formData.ProductId || 0
                ),

            ImageUrl:
                formData.ImageUrl.trim(),

            ImageName:
                formData.ImageName.trim(),

            ImageType:
                formData.ImageType,

            IsPrimary:
                Boolean(
                    formData.IsPrimary
                ),

            IsActive:
                Boolean(
                    formData.IsActive
                ),
        };


        onSave(payload);

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle>

                {image
                    ? "Edit Product Image"
                    : "Add Product Image"
                }

            </DialogTitle>


            <Divider />


            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent
                sx={{
                    mt: 2,
                }}
            >

                <Grid
                    container
                    spacing={3}
                >

                    {/* =========================================
                        PRODUCT ID
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField

                            fullWidth

                            required

                            type="number"

                            label="Product ID"

                            name="ProductId"

                            value={
                                formData.ProductId
                            }

                            onChange={
                                handleChange
                            }

                            inputProps={{
                                min: 1,
                            }}

                        />

                    </Grid>


                    {/* =========================================
                        IMAGE NAME
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField

                            fullWidth

                            required

                            label="Image Name"

                            name="ImageName"

                            value={
                                formData.ImageName
                            }

                            onChange={
                                handleChange
                            }

                            placeholder="product-main.jpg"

                        />

                    </Grid>


                    {/* =========================================
                        IMAGE URL
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                    >

                        <TextField

                            fullWidth

                            required

                            label="Image URL"

                            name="ImageUrl"

                            value={
                                formData.ImageUrl
                            }

                            onChange={
                                handleChange
                            }

                            placeholder="https://example.com/image.jpg"

                        />

                    </Grid>


                    {/* =========================================
                        IMAGE TYPE
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <FormControl
                            fullWidth
                        >

                            <InputLabel>
                                Image Type
                            </InputLabel>

                            <Select

                                name="ImageType"

                                value={
                                    formData.ImageType
                                }

                                label="Image Type"

                                onChange={
                                    handleChange
                                }

                            >

                                <MenuItem value="Main">
                                    Main
                                </MenuItem>

                                <MenuItem value="Gallery">
                                    Gallery
                                </MenuItem>

                                <MenuItem value="Thumbnail">
                                    Thumbnail
                                </MenuItem>

                            </Select>

                        </FormControl>

                    </Grid>


                    {/* =========================================
                        PRIMARY IMAGE
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <FormControlLabel

                            control={

                                <Switch

                                    checked={
                                        Boolean(
                                            formData.IsPrimary
                                        )
                                    }

                                    onChange={
                                        handlePrimaryChange
                                    }

                                />

                            }

                            label="Primary Image"

                        />

                    </Grid>


                    {/* =========================================
                        ACTIVE
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                    >

                        <FormControlLabel

                            control={

                                <Switch

                                    checked={
                                        Boolean(
                                            formData.IsActive
                                        )
                                    }

                                    onChange={
                                        handleActiveChange
                                    }

                                />

                            }

                            label="Active"

                        />

                    </Grid>

                </Grid>

            </DialogContent>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <DialogActions>

                <Button
                    variant="outlined"
                    onClick={onClose}
                >
                    Cancel
                </Button>


                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={
                        !formData.ProductId ||
                        !formData.ImageName.trim() ||
                        !formData.ImageUrl.trim()
                    }
                >
                    {image
                        ? "Update"
                        : "Save"
                    }
                </Button>

            </DialogActions>

        </Dialog>

    );

};


export default ProductImageModal;
