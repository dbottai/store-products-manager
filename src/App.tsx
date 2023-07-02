import React, { useEffect } from "react";
import "./App.css";
import {
  AppBar,
  Box,
  Button,
  Skeleton,
  Tab,
  Tabs,
  ThemeProvider,
  Toolbar,
  createTheme,
} from "@mui/material";
import {
  AddCircleOutlined,
  FormatListBulleted,
  QueryStats,
  Store,
} from "@mui/icons-material";
import { storeId } from "./constants";
import useGetApi from "./hooks/useGetApi";
import StatsPage from "./StatsPage";
import ProductsPage from "./ProductsPage";
import { enqueueSnackbar } from "notistack";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF7527",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "18px",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          color: "white",
        },
      },
    },
  },
});

function App() {
  const [value, setValue] = React.useState(0);

  const {
    loading: loadingStore,
    error: errorStore,
    data: dataStore,
  } = useGetApi(
    "https://us-central1-test-b7665.cloudfunctions.net/api/stores/" + storeId
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (errorStore) {
      enqueueSnackbar("Could not retrieve the store", { variant: "error" });
    }
  }, [errorStore]);

  const [open, setOpen] = React.useState(false);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Box sx={{ height: "65px" }}>
          <AppBar position="static">
            <Toolbar>
              <div className="store-header">
                <h1 className="store-name">
                  {!loadingStore && !errorStore ? (
                    <>
                      <Store /> {dataStore.name}
                    </>
                  ) : (
                    <>
                      <Store />
                      <Skeleton
                        className="store-name-skeleton"
                        animation="wave"
                        height={"40px"}
                        variant="text"
                      />
                    </>
                  )}
                </h1>
                <Button
                  variant="outlined"
                  color="inherit"
                  aria-label="Add product"
                  onClick={() => {
                    setOpen(true);
                  }}
                  startIcon={<AddCircleOutlined />}
                >
                  Add product
                </Button>
              </div>
            </Toolbar>
          </AppBar>
        </Box>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              centered
              sx={{ textAlign: "center", justifyContent: "center" }}
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                icon={<FormatListBulleted />}
                iconPosition="start"
                label="Products"
              />
              <Tab icon={<QueryStats />} iconPosition="start" label="Stats" />
            </Tabs>
          </Box>

          {value === 0 && <ProductsPage open={open} setOpen={setOpen} />}

          {value === 1 && <StatsPage open={open} setOpen={setOpen} />}
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;
