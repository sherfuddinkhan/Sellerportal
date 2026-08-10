import React, {useEffect,useState} from "react";
import {Dialog,DialogTitle,DialogContent,DialogActions,Button,Grid,TextField,Divider,FormControl,InputLabel,Select,MenuItem,Switch,FormControlLabel} from "@mui/material";
const ProductImageModal = ({
    open,
    image,
    onClose,
    onSave
}) => {
    const [formData, setFormData] = useState({
        ProductImageId: 0,
        ProductId: "",
        ImageUrl: "",
        ImageName: "",
        ImageType: "Main",
        IsPrimary: false,
        IsActive: true
    });
    useEffect(() => {
        if (image) {
            setFormData({
                ProductImageId: image.ProductImageId || 0,
                ProductId: image.ProductId || "",
                ImageUrl: image.ImageUrl || "",
                ImageName: image.ImageName || "",
                ImageType: image.ImageType || "Main",
                IsPrimary: image.IsPrimary ?? false,
                IsActive: image.IsActive ?? true
            });
        }
        else {
            setFormData({
                ProductImageId:0,
                ProductId:"",
                ImageUrl:"",
                ImageName:"",
                ImageType:"Main",
                IsPrimary:false,
                IsActive:true
            });
        }
    },[image,open]);
    const handleChange = (e)=>{
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]:value
        });
    };
    const handleSubmit = ()=>{
        onSave(formData);
    };
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                { image ? "Edit Product Image" : "Add Product Image" }
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
                        md={6}
                    >
                        <TextField
                            fullWidth
                            label="Product ID"
                            name="ProductId"
                            value={formData.ProductId}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            label="Image Name"
                            name="ImageName"
                            value={formData.ImageName}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                    >
                        <TextField
                            fullWidth
                            label="Image URL"
                            name="ImageUrl"
                            value={formData.ImageUrl}
                            onChange={handleChange}
                        />
                    </Grid>
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
                                value={formData.ImageType}
                                label="Image Type"
                                onChange={handleChange}
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
                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={ formData.IsPrimary}
                                    onChange={(e)=>
                                        setFormData({
                                            ...formData,
                                            IsPrimary: e.target.checked
                                        })
                                    }
                                />
                            }
                            label="Primary Image"
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.IsActive}
                                    onChange={(e)=>
                                        setFormData({
                                            ...formData,
                                            IsActive: e.target.checked
                                        })
                                    }
                                />
                            }
                            label="Active"
                        />
                    </Grid>
                </Grid>
            </DialogContent>
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
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default ProductImageModal;