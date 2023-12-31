import React, { useEffect, useState } from "react";
import useGetApi from "../hooks/useGetApi";
import { StatsCategory, StatsState } from "../models/stats";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  Colors,
} from "chart.js";
import { PolarArea } from "react-chartjs-2";
import { Box, Container, Typography } from "@mui/material";
import FormDialog from "../components/modals/FormDialog";
import { API_BASE_URL, storeId } from "../constants";
import { enqueueSnackbar } from "notistack";
import CenteredLoadingSpinner from "../components/CenteredLoadingSpinner";

interface StatsPageProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend, Colors);

export default function StatsPage({ open, setOpen }: StatsPageProps) {
  const [stats, setStats] = useState<StatsState>({
    labels: [],
    datasets: [],
  });

  const { loading, error, data, refetch } = useGetApi(
    `${API_BASE_URL}/stores/${storeId}/stats/categories`
  );

  useEffect(() => {
    if (error) {
      enqueueSnackbar("Could not retrieve stats data", { variant: "error" });
    }
  }, [error]);

  useEffect(() => {
    let categories: string[] = [];
    let numbersOfProducts: number[] = [];

    if (data) {
      data.forEach((item: StatsCategory) => {
        categories.push(item.category);
        numbersOfProducts.push(item.numberOfProducts);
      });
      const chartData = {
        labels: categories,
        datasets: [
          {
            label: "Products",
            data: numbersOfProducts,
            borderWidth: 1,
          },
        ],
      };
      setStats(chartData);
    }
  }, [data]);

  return loading ? (
    <CenteredLoadingSpinner />
  ) : (
    <Container maxWidth={false}>
      <Typography variant="h5" pt="15px" textAlign="center">
        Stats
      </Typography>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: { xs: "100vw", sm: "500px" } }}>
          <PolarArea
            options={{ responsive: true, maintainAspectRatio: true }}
            data={stats}
          ></PolarArea>
        </Box>
        <FormDialog open={open} setOpen={setOpen} refetch={refetch} />
      </Box>
    </Container>
  );
}
