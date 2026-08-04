import React from "react";
import apiService from "../../services/apiService";
import {Box,Button,Checkbox, FormControlLabel,Grid,TextField} from "@mui/material";
import { Formik, Form } from "formik";
import brandValidation from "../../validations/brandValidation";
const BrandForm = ({
    initialValues = {
        brandName: "",
        description: "",
        isActive: true
    },
    onSubmit,
    onCancel
}) => {

    return (

        <Formik

            initialValues={initialValues}

            validationSchema={brandValidation}

            enableReinitialize

            onSubmit={onSubmit}

        >

            {({

                values,

                handleChange,

                touched,

                errors,

                handleBlur,

                setFieldValue,

                resetForm

            }) => (

                <Form>

                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid
                            item
                            xs={12}
                        >

                            <TextField

                                fullWidth

                                label="Brand Name"

                                name="brandName"

                                value={values.brandName}

                                onChange={handleChange}

                                onBlur={handleBlur}

                                error={
                                    touched.brandName &&
                                    Boolean(errors.brandName)
                                }

                                helperText={
                                    touched.brandName &&
                                    errors.brandName
                                }

                            />

                        </Grid>

                        <Grid
                            item
                            xs={12}
                        >

                            <TextField

                                fullWidth

                                multiline

                                rows={4}

                                label="Description"

                                name="description"

                                value={values.description}

                                onChange={handleChange}

                                onBlur={handleBlur}

                                error={
                                    touched.description &&
                                    Boolean(errors.description)
                                }

                                helperText={
                                    touched.description &&
                                    errors.description
                                }

                            />

                        </Grid>

                        <Grid
                            item
                            xs={12}
                        >

                            <FormControlLabel

                                control={

                                    <Checkbox

                                        checked={values.isActive}

                                        onChange={(e) =>

                                            setFieldValue(

                                                "isActive",

                                                e.target.checked

                                            )

                                        }

                                    />

                                }

                                label="Active"

                            />

                        </Grid>

                        <Grid
                            item
                            xs={12}
                        >

                            <Box
                                display="flex"
                                gap={2}
                            >

                                <Button

                                    variant="contained"

                                    type="submit"

                                >

                                    Save

                                </Button>

                                <Button

                                    variant="outlined"

                                    onClick={() => resetForm()}

                                >

                                    Reset

                                </Button>

                                <Button

                                    color="error"

                                    variant="outlined"

                                    onClick={onCancel}

                                >

                                    Cancel

                                </Button>

                            </Box>

                        </Grid>

                    </Grid>

                </Form>

            )}

        </Formik>

    );

};

export default BrandForm;