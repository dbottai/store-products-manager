import React from "react";
import { Product } from "../../models/product";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import axios from "axios";
import { API_BASE_URL, storeId } from "../../constants";
import { enqueueSnackbar } from "notistack";

interface DeleteDialogProps {
  product: Product | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: React.Dispatch<React.SetStateAction<{}>>;
}

export default function DeleteDialog({
  product,
  open,
  setOpen,
  refetch,
}: DeleteDialogProps) {
  const onConfirmButtonClick = () => {
    axios
      .delete(`${API_BASE_URL}/stores/${storeId}/products/${product?.id}`)
      .then(() => {
        refetch({});
        setOpen(false);
        enqueueSnackbar("Product successfully deleted.", {
          variant: "success",
        });
      })
      .catch(() => {
        refetch({});
        setOpen(false);
        //setProduct(null);
        enqueueSnackbar("There was an error deleting the product.", {
          variant: "error",
        });
      });
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      TransitionProps={{ timeout: 50 }}
      aria-labelledby="delete-dialog"
    >
      <DialogTitle id="delete-dialog">Delete {product?.data.title}</DialogTitle>
      <DialogContent>
        Do you really want to delete the product {product?.data.title}?
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>No</Button>
        <Button onClick={onConfirmButtonClick}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
}
