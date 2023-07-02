import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import React from "react";
import { Product } from "./models/product";

interface ReviewsDialogProps {
  product: Product | null;
  setProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ReviewsDialog({
  product,
  setProduct,
  open,
  setOpen,
}: ReviewsDialogProps) {
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="reviews-dialog"
      TransitionProps={{ timeout: 50 }}
    >
      {product ? (
        <>
          <DialogTitle id="reviews-dialog">
            Reviews for {product.data.title}
          </DialogTitle>
          <DialogContent>
            {product.data.reviews ? (
              product.data.reviews.map(function (
                review: string,
                index: number
              ) {
                return (
                  <Box key={index}>
                    <Box marginY="15px">{review}</Box>
                    <Divider></Divider>
                  </Box>
                );
              })
            ) : (
              <Typography variant="body1">
                There are no reviews for this product.
              </Typography>
            )}
          </DialogContent>
        </>
      ) : null}

      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
