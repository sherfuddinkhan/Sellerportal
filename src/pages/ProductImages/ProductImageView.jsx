import React from "react";
import {Dialog,DialogTitle,DialogContent,DialogActions,Button,Grid,Typography,Divider,Chip,Box} from "@mui/material";


const ProductImageView = ({
    open,
    image,
    onClose
}) => {
    if (!image) return null;
    const Field = ({
        label,
        value
    }) => (
        <Grid
            item
            xs={12}
            md={6}
        >
            <Typography
                variant="caption"
                color="text.secondary"
            >
                {label}
            </Typography>
            <Typography
                variant="body1"
                fontWeight={500}
            >
                {value || "-"}
            </Typography>
        </Grid>
    );
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                Product Image Details
            </DialogTitle>
            <Divider />
            <DialogContent
                sx={{mt:2}}
            >
                <Grid
                    container
                    spacing={3}
                >
                    <Grid
                        item
                        xs={12}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Image Preview
                        </Typography>
                        {
                            image.ImageUrl &&
                            <Box
                                sx={{
                                    mt:2,
                                    textAlign:"center"
                                }}
                            >
                                <img
                                    src={image.ImageUrl}
                                    alt={image.ImageName}
                                    style={{
                                        maxWidth:"100%",
                                        maxHeight:"300px",
                                        borderRadius:"8px"
                                    }}
                                />
                            </Box>
                        }
                    </Grid>
                    <Field
                        label="Product Image ID"
                        value={image.ProductImageId}
                    />
                    <Field
                        label="Product ID"
                        value={image.ProductId}
                    />
                    <Field
                        label="Image Name"
                        value={image.ImageName}
                    />
                    <Field
                        label="Image Type"
                        value={image.ImageType}
                    />
                    <Field
                        label="Image URL"
                        value={image.ImageUrl}
                    />
                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Primary Image
                        </Typography>
                        <br />
                        <Chip
                            label={ image.IsPrimary ? "Yes" : "No"}
                            color={  image.IsPrimary ? "success" : "default"}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Status
                        </Typography>
                        <br />
                        <Chip
                            label={ image.IsActive ? "Active" : "Inactive"}
                            color={ image.IsActive ? "success" : "error" }
                        />
                    </Grid>
                    <Field
                        label="Created Date"
                        value={ image.CreatedDate ? new Date(image.CreatedDate).toLocaleString() :"-"}
                    />
                    <Field
                        label="Updated Date"
                        value={ image.UpdatedDate ? new Date( image.UpdatedDate).toLocaleString():"-"}
                    />
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={onClose}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default ProductImageView;