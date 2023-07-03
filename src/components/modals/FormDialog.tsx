import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Grid, Typography } from "@mui/material";
import { usePostApi } from "../../hooks/usePostApi";
import { enqueueSnackbar } from "notistack";
import { API_BASE_URL, storeId } from "../../constants";

interface FormDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: React.Dispatch<React.SetStateAction<{}>>;
}

const emptyData = {
  title: "",
  description: "",
  category: "",
  employee: "",
  price: "",
};

export default function FormDialog({
  open,
  setOpen,
  refetch,
}: FormDialogProps) {
  const [data, setData] = React.useState(emptyData);

  const [validationData, setValidationData] = React.useState({
    title: false,
    category: false,
    price: false,
  });

  const [reviewsFields, setReviewsFields] = React.useState<string[]>([]);
  const [reviewsFieldsValidation, setReviewsFieldsValidation] = React.useState<
    boolean[]
  >([]);

  const { responseData, error, loading, post } = usePostApi(
    `${API_BASE_URL}/stores/${storeId}/products`
  );

  const handleClose = () => {
    setOpen(false);
    setData(emptyData);
    setReviewsFields([]);
    setReviewsFieldsValidation([]);
    setValidationData({
      price: false,
      category: false,
      title: false,
    });
  };

  const addInputField = () => {
    setReviewsFields([...reviewsFields, ""]);
    setReviewsFieldsValidation([...reviewsFieldsValidation, true]);
  };

  const removeInputFields = (index: number) => {
    const rows = [...reviewsFields];
    rows.splice(index, 1);
    setReviewsFields(rows);

    const validationRows = [...reviewsFieldsValidation];
    validationRows.splice(index, 1);
    setReviewsFieldsValidation(validationRows);
  };

  const onChangeData = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = event.target.name;
    const value = event.target.value;

    const newValue = { [name]: value };

    setData({
      ...data,
      ...newValue,
    });

    switch (name) {
      case "title":
      case "category":
      case "price":
        if (!value || value === undefined || value === "") {
          const newValidationKeyValue = { [name]: true };
          setValidationData({
            ...validationData,
            ...newValidationKeyValue,
          });
        } else {
          const newValidationKeyValue = { [name]: false };
          setValidationData({
            ...validationData,
            ...newValidationKeyValue,
          });
        }
        break;
      default:
        break;
    }
  };

  const onChangeReviewField = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    event.preventDefault();

    const target = event.currentTarget;

    let items = [...reviewsFields];
    items[index] = target.value;

    let validationItems = [...reviewsFieldsValidation];
    if (target.value === "") {
      validationItems[index] = true;
    } else {
      validationItems[index] = false;
    }

    setReviewsFields(items);
    setReviewsFieldsValidation(validationItems);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    post({
      title: data.title,
      category: data.category,
      price: data.price,
      employee: data.employee,
      description: data.description,
      reviews: reviewsFields,
    })
      .then(() => {
        console.log(responseData);
        refetch({});
        setOpen(false);
        setData(emptyData);
        setReviewsFields([]);
        setReviewsFieldsValidation([]);
        setValidationData({
          price: false,
          category: false,
          title: false,
        });
        enqueueSnackbar("Product created successfully.", {
          variant: "success",
        });
      })
      .catch(() => {
        console.log(error);
        refetch({});
        setReviewsFields([]);
        setReviewsFieldsValidation([]);
        setValidationData({
          price: false,
          category: false,
          title: false,
        });
        setOpen(false);
        enqueueSnackbar("There was an error when creating the product.", {
          variant: "error",
        });
      });
  };

  const validateReviewsFields: () => boolean = () => {
    return !reviewsFieldsValidation.every((element) => element === false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionProps={{ timeout: 50 }}
      fullScreen
    >
      <DialogTitle>Add Product</DialogTitle>
      <form method="POST" onSubmit={handleSubmit} autoComplete="off">
        <DialogContent>
          <DialogContentText>
            Fill the form below to add a new product.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            error={validationData.title}
            helperText={validationData.title ? "Insert a product title" : ""}
            onChange={onChangeData}
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            required={true}
            value={data.title}
          />
          <TextField
            margin="dense"
            id="category"
            error={validationData.category}
            helperText={validationData.category ? "Insert a category" : ""}
            onChange={onChangeData}
            name="category"
            label="Category"
            type="text"
            fullWidth
            variant="standard"
            required={true}
            value={data.category}
          />
          <TextField
            margin="dense"
            id="price"
            error={validationData.price}
            helperText={validationData.price ? "Insert a price" : ""}
            onChange={onChangeData}
            name="price"
            label="Price"
            type="number"
            fullWidth
            variant="standard"
            required={true}
            value={data.price}
            inputProps={{
              min: 0,
              step: "any",
            }}
          />
          <TextField
            margin="dense"
            id="employee"
            onChange={onChangeData}
            name="employee"
            label="Employee"
            type="text"
            fullWidth
            variant="standard"
            value={data.employee}
          />
          <TextField
            margin="dense"
            id="description"
            name="description"
            label="Description"
            onChange={onChangeData}
            type="text"
            multiline
            rows="3"
            fullWidth
            variant="standard"
            value={data.description}
          />

          <Typography gutterBottom variant="h6" mt="15px">
            Reviews
          </Typography>
          <Box textAlign="right">
            <Button onClick={addInputField}>Add Review</Button>
          </Box>
          {reviewsFields.map((data, index) => {
            return (
              <Grid container key={index}>
                <Grid item style={{ display: "flex", flexGrow: 1 }}>
                  <TextField
                    onChange={(event) => onChangeReviewField(event, index)}
                    key={"reviews-" + index}
                    error={reviewsFieldsValidation[index]}
                    helperText={
                      reviewsFieldsValidation[index] ? "Insert a review" : ""
                    }
                    margin="dense"
                    name={data}
                    label="Review"
                    type="text"
                    variant="standard"
                    required
                    fullWidth
                    value={data}
                  />
                </Grid>
                <Grid item alignItems="stretch" style={{ display: "flex" }}>
                  <Button
                    key={"remove-button-" + index}
                    color="error"
                    onClick={() => removeInputFields(index)}
                    sx={{ marginLeft: "5px" }}
                  >
                    Remove
                  </Button>
                </Grid>
              </Grid>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            disabled={
              validateReviewsFields() ||
              loading ||
              !data.title ||
              !data.category ||
              data.price === null ||
              data.price === undefined ||
              data.price === ""
                ? true
                : false
            }
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
