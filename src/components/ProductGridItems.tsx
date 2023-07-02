import React from "react";
import { Product } from "../models/product";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import {
  ThumbsUpDown,
  Delete,
  SentimentDissatisfied,
} from "@mui/icons-material";

interface ProductGridItemsProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  products: Product[];
  setProduct: React.Dispatch<React.SetStateAction<Product | null>>;
}

export default function ProductPanelItems({
  open,
  setOpen,
  deleteDialogOpen,
  setDeleteDialogOpen,
  products,
  setProduct,
}: ProductGridItemsProps) {
  const onReviewButtonClick = (product: Product) => {
    setProduct(product);
    setOpen(true);
  };

  const onDeleteButtonClick = (product: Product) => {
    setProduct(product);
    setDeleteDialogOpen(true);
  };

  if (!products.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <SentimentDissatisfied />
        </div>
        <h3>No products</h3>
        <p>There are no products in the store.</p>
      </div>
    );
  }

  return (
    <Grid container spacing={2}>
      {products.map(function (product: Product) {
        return (
          <Grid key={product.id} item xs={12} sm={6} md={4} lg={3}>
            <Card className="same-height">
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Box flex="1">
                  <Typography textAlign="center" variant="h5" component="div">
                    {product.data.title}
                  </Typography>
                  <Typography
                    textAlign="center"
                    sx={{ mb: 1.5 }}
                    color="text.secondary"
                  >
                    {product.data.category}
                  </Typography>
                  <Typography textAlign="center" variant="body2">
                    {product.data.employee}
                  </Typography>
                  <Typography textAlign="center" variant="body2">
                    {product.data.description}
                  </Typography>
                </Box>

                <Box textAlign="center" mt="15px">
                  <Chip
                    color="primary"
                    sx={{ color: "common.white" }}
                    label={
                      new Intl.NumberFormat("it-IT", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(product.data.price) + " €"
                    }
                  />
                </Box>
              </CardContent>
              <CardActions disableSpacing>
                <Box marginX="auto">
                  <IconButton
                    onClick={() => onReviewButtonClick(product)}
                    aria-label="Show Reviews"
                  >
                    <ThumbsUpDown />
                  </IconButton>
                  <IconButton
                    onClick={() => onDeleteButtonClick(product)}
                    aria-label="Delete"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
