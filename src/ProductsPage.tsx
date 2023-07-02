import React, { useEffect, useState } from "react";
import useGetApi from "./hooks/useGetApi";
import { Product } from "./models/product";
import FormDialog from "./FormDialog";
import {
  Box,
  CircularProgress,
  Container,
  IconButton,
  TablePagination,
  Typography,
} from "@mui/material";
import { GridView, List } from "@mui/icons-material";
import ProductPanelItems from "./components/ProductPanelItems";
import ProductGridItems from "./components/ProductGridItems";
import ReviewsDialog from "./ReviewsDialog";
import DeleteDialog from "./DeleteDialog";
import { enqueueSnackbar } from "notistack";

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
    `https://us-central1-test-b7665.cloudfunctions.net/api/stores/ijpxNJLM732vm8AeajMR/products?page=${
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
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress />
        </div>
      )}
      <FormDialog open={open} setOpen={setOpen} refetch={refetch} />
      <ReviewsDialog
        product={product}
        setProduct={setProduct}
        open={reviewsDialogOpen}
        setOpen={setReviewsDialogOpen}
      ></ReviewsDialog>
      <DeleteDialog
        product={product}
        setProduct={setProduct}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        refetch={refetch}
      ></DeleteDialog>
    </Container>
  );
}
