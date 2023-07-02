import React from "react";
import { Product } from "../models/product";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import {
  Delete,
  SentimentDissatisfied,
  ThumbsUpDown,
} from "@mui/icons-material";

interface ProductPanelItemsProps {
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
}: ProductPanelItemsProps) {
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
    <Stack spacing={2}>
      {products.map(function (product: Product) {
        return (
          <Card key={product.id}>
            <CardContent>
              <Typography variant="h5" component="div">
                {product.data.title}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {product.data.category}
              </Typography>
              <Typography variant="body2">{product.data.employee}</Typography>
              <Typography variant="body2">
                {product.data.description}
              </Typography>
              <Box textAlign="right">
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
              <Box marginLeft="auto">
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
        );
      })}
    </Stack>
  );
}
