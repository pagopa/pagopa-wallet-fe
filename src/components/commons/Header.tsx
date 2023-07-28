import React from "react";
import { Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function Header() {
  return (
    <Box py={2} px={3} bgcolor={"white"} display="flex" justifyContent="end">
      <CloseIcon />
    </Box>
  );
}
