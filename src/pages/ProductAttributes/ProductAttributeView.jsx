import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    Divider,
    Chip
} from "@mui/material";

const ProductAttributeView = ({

    open,

    attribute,

    onClose

}) => {

    if (!attribute) return null;

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

                Product Attribute Details

            </DialogTitle>

            <Divider />

            <DialogContent sx={{ mt: 2 }}>

                <Grid

                    container

                    spacing={3}

                >

                    <Field

                        label="Attribute ID"

                        value={

                            attribute.ProductAttributeId

                        }

                    />

                    <Field

                        label="Product ID"

                        value={

                            attribute.ProductId

                        }

                    />

                    <Field

                        label="Attribute Name"

                        value={

                            attribute.AttributeName

                        }

                    />

                    <Field

                        label="Attribute Value"

                        value={

                            attribute.AttributeValue

                        }

                    />

                    <Field

                        label="Attribute Type"

                        value={

                            attribute.AttributeType

                        }

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

                            Required

                        </Typography>

                        <br />

                        <Chip

                            label={

                                attribute.IsRequired

                                    ? "Yes"

                                    : "No"

                            }

                            color={

                                attribute.IsRequired

                                    ? "primary"

                                    : "default"

                            }

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

                            label={

                                attribute.IsActive

                                    ? "Active"

                                    : "Inactive"

                            }

                            color={

                                attribute.IsActive

                                    ? "success"

                                    : "error"

                            }

                        />

                    </Grid>

                    <Field

                        label="Created Date"

                        value={

                            attribute.CreatedDate

                                ?

                                new Date(

                                    attribute.CreatedDate

                                ).toLocaleString()

                                :

                                "-"

                        }

                    />

                    <Field

                        label="Updated Date"

                        value={

                            attribute.UpdatedDate

                                ?

                                new Date(

                                    attribute.UpdatedDate

                                ).toLocaleString()

                                :

                                "-"

                        }

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

export default ProductAttributeView;