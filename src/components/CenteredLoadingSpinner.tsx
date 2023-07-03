import { CircularProgress } from "@mui/material";
import React from "react";

export default function CenteredLoadingSpinner() {
  return (
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
  )
}