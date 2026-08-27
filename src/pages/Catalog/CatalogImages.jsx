// =========================================================
// CatalogImages.jsx
// =========================================================

import React, { useRef, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Paper,
    Snackbar,
    Tooltip,
    Typography,
} from "@mui/material";

import {
    AddPhotoAlternate,
    Delete,
    Image,
    Star,
    StarBorder,
    Upload,
    Visibility,
} from "@mui/icons-material";

// =========================================================
// COMPONENT
// =========================================================

const CatalogImages = ({
    productId = null,
    images: initialImages = [],
    onUpload,
    onDelete,
    onSetPrimary,
    maxImages = 10,
    readOnly = false,
}) => {
    // =========================================================
    // STATE
    // =========================================================

    const [images, setImages] =
        useState(initialImages);

    const [selectedFiles, setSelectedFiles] =
        useState([]);

    const [previewUrl, setPreviewUrl] =
        useState(null);

    const [uploading, setUploading] =
        useState(false);

    const [message, setMessage] = useState({
        open: false,
        type: "success",
        text: "",
    });

    const fileInputRef = useRef(null);

    // =========================================================
    // HANDLE FILE SELECTION
    // =========================================================

    const handleFileSelect = (event) => {
        const files = Array.from(
            event.target.files || []
        );

        if (!files.length) {
            return;
        }

        const remainingSlots =
            maxImages - images.length;

        if (files.length > remainingSlots) {
            showMessage(
                "error",
                `You can upload only ${remainingSlots} more image(s).`
            );

            return;
        }

        const validFiles = files.filter((file) => {
            const isImage =
                file.type.startsWith("image/");

            const isValidSize =
                file.size <= 5 * 1024 * 1024;

            if (!isImage) {
                showMessage(
                    "error",
                    `${file.name} is not an image.`
                );

                return false;
            }

            if (!isValidSize) {
                showMessage(
                    "error",
                    `${file.name} exceeds the 5 MB limit.`
                );

                return false;
            }

            return true;
        });

        setSelectedFiles(validFiles);
    };

    // =========================================================
    // UPLOAD
    // =========================================================

    const handleUpload = async () => {
        if (!selectedFiles.length) {
            showMessage(
                "error",
                "Please select at least one image."
            );

            return;
        }

        try {
            setUploading(true);

            /*
             * API integration example:
             *
             * const formData = new FormData();
             *
             * formData.append(
             *     "productId",
             *     productId
             * );
             *
             * selectedFiles.forEach((file) => {
             *     formData.append(
             *         "images",
             *         file
             *     );
             * });
             *
             * const response =
             *     await apiService.post(
             *         "/ProductImages",
             *         formData,
             *         {
             *             headers: {
             *                 "Content-Type":
             *                     "multipart/form-data",
             *             },
             *         }
             *     );
             *
             * setImages(response.data);
             */

            if (onUpload) {
                const result = await onUpload(
                    selectedFiles,
                    productId
                );

                if (Array.isArray(result)) {
                    setImages((prev) => [
                        ...prev,
                        ...result,
                    ]);
                }
            } else {
                // Local preview fallback
                const newImages =
                    selectedFiles.map(
                        (file, index) => ({
                            imageId:
                                `temp-${Date.now()}-${index}`,
                            productId,
                            imageUrl:
                                URL.createObjectURL(
                                    file
                                ),
                            imageName:
                                file.name,
                            isPrimary:
                                images.length === 0 &&
                                index === 0,
                        })
                    );

                setImages((prev) => [
                    ...prev,
                    ...newImages,
                ]);
            }

            setSelectedFiles([]);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            showMessage(
                "success",
                "Images uploaded successfully."
            );
        } catch (error) {
            console.error(
                "Catalog image upload error:",
                error
            );

            showMessage(
                "error",
                "Unable to upload images."
            );
        } finally {
            setUploading(false);
        }
    };

    // =========================================================
    // DELETE IMAGE
    // =========================================================

    const handleDelete = async (image) => {
        const confirmed =
            window.confirm(
                "Are you sure you want to delete this image?"
            );

        if (!confirmed) {
            return;
        }

        try {
            if (onDelete) {
                await onDelete(image);
            }

            setImages((prev) =>
                prev.filter(
                    (item) =>
                        item.imageId !==
                        image.imageId
                )
            );

            showMessage(
                "success",
                "Image deleted successfully."
            );
        } catch (error) {
            console.error(
                "Delete image error:",
                error
            );

            showMessage(
                "error",
                "Unable to delete image."
            );
        }
    };

    // =========================================================
    // SET PRIMARY
    // =========================================================

    const handleSetPrimary = async (image) => {
        try {
            if (onSetPrimary) {
                await onSetPrimary(image);
            }

            setImages((prev) =>
                prev.map((item) => ({
                    ...item,
                    isPrimary:
                        item.imageId ===
                        image.imageId,
                }))
            );

            showMessage(
                "success",
                "Primary image updated."
            );
        } catch (error) {
            console.error(
                "Primary image error:",
                error
            );

            showMessage(
                "error",
                "Unable to update primary image."
            );
        }
    };

    // =========================================================
    // PREVIEW
    // =========================================================

    const handlePreview = (image) => {
        setPreviewUrl(
            image.imageUrl ||
                image.url ||
                image.image ||
                ""
        );
    };

    // =========================================================
    // MESSAGE
    // =========================================================

    const showMessage = (type, text) => {
        setMessage({
            open: true,
            type,
            text,
        });
    };

    const closeMessage = () => {
        setMessage((prev) => ({
            ...prev,
            open: false,
        }));
    };

    // =========================================================
    // IMAGE URL HELPER
    // =========================================================

    const getImageUrl = (image) => {
        return (
            image.imageUrl ||
            image.url ||
            image.image ||
            image.imagePath ||
            ""
        );
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Box>
            {/* =====================================================
                HEADER
               ===================================================== */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "space-between",
                    gap: 2,
                    mb: 2,
                    flexWrap: "wrap",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <Image color="primary" />

                    <Box>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            Catalog Images
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Manage product images and
                            primary image.
                        </Typography>
                    </Box>

                    <Chip
                        label={`${images.length}/${maxImages}`}
                        size="small"
                    />
                </Box>
            </Box>

            {/* =====================================================
                UPLOAD AREA
               ===================================================== */}

            {!readOnly && (
                <Paper
                    variant="outlined"
                    sx={{
                        p: 3,
                        mb: 3,
                        textAlign: "center",
                        borderStyle: "dashed",
                    }}
                >
                    <AddPhotoAlternate
                        sx={{
                            fontSize: 48,
                            color: "text.secondary",
                            mb: 1,
                        }}
                    />

                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                    >
                        Add Product Images
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        JPG, JPEG, PNG or WEBP.
                        Maximum 5 MB per image.
                    </Typography>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        multiple
                        hidden
                        onChange={
                            handleFileSelect
                        }
                    />

                    <Button
                        variant="outlined"
                        startIcon={
                            <AddPhotoAlternate />
                        }
                        onClick={() =>
                            fileInputRef.current?.click()
                        }
                        disabled={
                            images.length >=
                                maxImages ||
                            uploading
                        }
                    >
                        Select Images
                    </Button>

                    {/* Selected files */}

                    {selectedFiles.length >
                        0 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography
                                variant="body2"
                                fontWeight="bold"
                            >
                                {
                                    selectedFiles.length
                                }{" "}
                                image(s) selected
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent:
                                        "center",
                                    gap: 1,
                                    flexWrap:
                                        "wrap",
                                    mt: 1,
                                }}
                            >
                                {selectedFiles.map(
                                    (
                                        file
                                    ) => (
                                        <Chip
                                            key={
                                                file.name
                                            }
                                            label={
                                                file.name
                                            }
                                            size="small"
                                        />
                                    )
                                )}
                            </Box>

                            <Button
                                variant="contained"
                                startIcon={
                                    uploading ? (
                                        <CircularProgress
                                            size={
                                                18
                                            }
                                        />
                                    ) : (
                                        <Upload />
                                    )
                                }
                                onClick={
                                    handleUpload
                                }
                                disabled={
                                    uploading
                                }
                                sx={{
                                    mt: 2,
                                }}
                            >
                                {uploading
                                    ? "Uploading..."
                                    : "Upload Images"}
                            </Button>
                        </Box>
                    )}
                </Paper>
            )}

            {/* =====================================================
                IMAGE GRID
               ===================================================== */}

            {images.length === 0 ? (
                <Paper
                    variant="outlined"
                    sx={{
                        p: 5,
                        textAlign: "center",
                    }}
                >
                    <Image
                        sx={{
                            fontSize: 60,
                            color: "text.secondary",
                        }}
                    />

                    <Typography
                        variant="h6"
                        sx={{ mt: 1 }}
                    >
                        No Images
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        No catalog images have been
                        added yet.
                    </Typography>
                </Paper>
            ) : (
                <Grid
                    container
                    spacing={2}
                >
                    {images.map((image) => {
                        const imageUrl =
                            getImageUrl(image);

                        return (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                key={
                                    image.imageId
                                }
                            >
                                <Card
                                    sx={{
                                        position:
                                            "relative",
                                        borderRadius: 2,
                                        overflow:
                                            "hidden",
                                        height: "100%",
                                    }}
                                >
                                    {/* IMAGE */}

                                    {imageUrl ? (
                                        <CardMedia
                                            component="img"
                                            image={
                                                imageUrl
                                            }
                                            alt={
                                                image.imageName ||
                                                "Catalog image"
                                            }
                                            sx={{
                                                height: 200,
                                                objectFit:
                                                    "cover",
                                                cursor:
                                                    "pointer",
                                            }}
                                            onClick={() =>
                                                handlePreview(
                                                    image
                                                )
                                            }
                                        />
                                    ) : (
                                        <Box
                                            sx={{
                                                height: 200,
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "center",
                                                bgcolor:
                                                    "action.hover",
                                            }}
                                        >
                                            <Image
                                                sx={{
                                                    fontSize: 60,
                                                    color:
                                                        "text.secondary",
                                                }}
                                            />
                                        </Box>
                                    )}

                                    {/* PRIMARY BADGE */}

                                    {image.isPrimary && (
                                        <Chip
                                            icon={
                                                <Star />
                                            }
                                            label="Primary"
                                            color="primary"
                                            size="small"
                                            sx={{
                                                position:
                                                    "absolute",
                                                top: 10,
                                                left: 10,
                                            }}
                                        />
                                    )}

                                    <CardContent
                                        sx={{
                                            p: 1.5,
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            noWrap
                                            title={
                                                image.imageName
                                            }
                                        >
                                            {image.imageName ||
                                                "Product Image"}
                                        </Typography>

                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                justifyContent:
                                                    "space-between",
                                                alignItems:
                                                    "center",
                                                mt: 1,
                                            }}
                                        >
                                            {/* PRIMARY */}

                                            {!readOnly && (
                                                <Tooltip
                                                    title={
                                                        image.isPrimary
                                                            ? "Primary image"
                                                            : "Set as primary"
                                                    }
                                                >
                                                    <IconButton
                                                        size="small"
                                                        color={
                                                            image.isPrimary
                                                                ? "primary"
                                                                : "default"
                                                        }
                                                        onClick={() =>
                                                            !image.isPrimary &&
                                                            handleSetPrimary(
                                                                image
                                                            )
                                                        }
                                                    >
                                                        {image.isPrimary ? (
                                                            <Star />
                                                        ) : (
                                                            <StarBorder />
                                                        )}
                                                    </IconButton>
                                                </Tooltip>
                                            )}

                                            <Box>
                                                {/* PREVIEW */}

                                                <Tooltip title="Preview">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() =>
                                                            handlePreview(
                                                                image
                                                            )
                                                        }
                                                    >
                                                        <Visibility />
                                                    </IconButton>
                                                </Tooltip>

                                                {/* DELETE */}

                                                {!readOnly && (
                                                    <Tooltip title="Delete">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    image
                                                                )
                                                            }
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            {/* =====================================================
                IMAGE PREVIEW DIALOG
               ===================================================== */}

            <Dialog
                open={Boolean(previewUrl)}
                onClose={() =>
                    setPreviewUrl(null)
                }
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Image Preview
                </DialogTitle>

                <DialogContent
                    sx={{
                        display: "flex",
                        justifyContent:
                            "center",
                        alignItems: "center",
                        p: 2,
                    }}
                >
                    {previewUrl && (
                        <Box
                            component="img"
                            src={previewUrl}
                            alt="Catalog preview"
                            sx={{
                                maxWidth:
                                    "100%",
                                maxHeight:
                                    "70vh",
                                objectFit:
                                    "contain",
                            }}
                        />
                    )}
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() =>
                            setPreviewUrl(null)
                        }
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* =====================================================
                SNACKBAR
               ===================================================== */}

            <Snackbar
                open={message.open}
                autoHideDuration={4000}
                onClose={closeMessage}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                <Alert
                    severity={message.type}
                    variant="filled"
                    onClose={closeMessage}
                >
                    {message.text}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CatalogImages;