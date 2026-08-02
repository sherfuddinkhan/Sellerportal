import React from "react";

import {
    Grid
} from "@mui/material";

import ProductTypeCard from "./ProductTypeCard";

const ProductTypeView = ({ productTypes }) => {

    return (

        <Grid container spacing={2}>

            {

                productTypes.map(item => (

                    <Grid

                        item

                        xs={12}

                        md={4}

                        key={item.productTypeId}

                    >

                        <ProductTypeCard

                            productType={item}

                        />

                    </Grid>

                ))

            }

        </Grid>

    );

};

export default ProductTypeView;