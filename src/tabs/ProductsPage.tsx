import React, { useEffect, useState } from "react";
import useGetApi from "../hooks/useGetApi";
import { Product } from "../models/product";
import FormDialog from "../components/modals/FormDialog";
import {
  Box,
  Container,
  IconButton,
  TablePagination,
  Typography,
} from "@mui/material";
import { GridView, List } from "@mui/icons-material";
import ProductPanelItems from "../components/ProductPanelItems";
import ProductGridItems from "../components/ProductGridItems";
import ReviewsDialog from "../components/modals/ReviewsDialog";
import DeleteDialog from "../components/modals/DeleteDialog";
import { enqueueSnackbar } from "notistack";
import { API_BASE_URL, storeId } from "../constants";
import CenteredLoadingSpinner from "../components/CenteredLoadingSpinner";

interface ProductsPageProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProductsPage({ open, setOpen }: ProductsPageProps) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState("list");
  const [reviewsDialogOpen, setReviewsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!deleteDialogOpen && !reviewsDialogOpen) {
      setProduct(null);
    }
  }, [deleteDialogOpen, reviewsDialogOpen]);

  const handleSwitchView = (mode: string) => {
    switch (mode) {
      case "list":
        setViewMode("list");
        break;
      case "grid":
        setViewMode("grid");
        break;
      default:
        setViewMode("list");
    }
  };

  const { loading, error, data, refetch } = useGetApi(
    `${API_BASE_URL}/stores/${storeId}/products?page=${
      page + 1
    }&elements=${pageSize}`
  );

  useEffect(() => {
    if (error) {
      enqueueSnackbar("Could not retrieve the products", { variant: "error" });
    }
  }, [error]);

  return (
    <Container maxWidth={false} sx={{ marginBottom: "20px" }}>
      <Typography variant="h5" pt="15px" textAlign="center">
        Products
      </Typography>
      <Box textAlign="right">
        <IconButton
          color={viewMode === "list" ? "primary" : "default"}
          onClick={() => handleSwitchView("list")}
        >
          <List />
        </IconButton>
        <IconButton
          color={viewMode === "grid" ? "primary" : "default"}
          onClick={() => handleSwitchView("grid")}
        >
          <GridView />
        </IconButton>
      </Box>
      <TablePagination
        labelRowsPerPage=""
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data !== null ? data.length : 0}
        rowsPerPage={pageSize}
        page={page}
        onPageChange={(e, page) => {
          setPage(page || 0);
        }}
        onRowsPerPageChange={(e) => {
          setPage(0);
          setPageSize(parseInt(e.target.value) || 10);
        }}
      />
      {!loading && !error ? (
        <>
          {viewMode === "list" ? (
            <ProductPanelItems
              open={reviewsDialogOpen}
              setOpen={setReviewsDialogOpen}
              deleteDialogOpen={deleteDialogOpen}
              setDeleteDialogOpen={setDeleteDialogOpen}
              products={data.list}
              setProduct={setProduct}
            />
          ) : null}
          {viewMode === "grid" ? (
            <ProductGridItems
              open={reviewsDialogOpen}
              setOpen={setReviewsDialogOpen}
              deleteDialogOpen={deleteDialogOpen}
              setDeleteDialogOpen={setDeleteDialogOpen}
              products={data.list}
              setProduct={setProduct}
            />
          ) : null}
        </>
      ) : (
        <CenteredLoadingSpinner />
      )}
      <FormDialog open={open} setOpen={setOpen} refetch={refetch} />
      <ReviewsDialog
        product={product}
        open={reviewsDialogOpen}
        setOpen={setReviewsDialogOpen}
      ></ReviewsDialog>
      <DeleteDialog
        product={product}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        refetch={refetch}
      ></DeleteDialog>
    </Container>
  );
}
