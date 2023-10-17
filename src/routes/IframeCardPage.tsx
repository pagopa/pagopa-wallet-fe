import { Box } from "@mui/material";
import React from "react";
import PageContainer from "../components/commons/PageContainer";
import IframeCardForm from "../features/onboard/components/IframeCardForm";

export default function IFrameCardPage() {
  const [loading] = React.useState(false);
  // const [errorModalOpen, setErrorModalOpen] = React.useState(false);
  // const [error, setError] = React.useState("");
  // Is It allowed to store the bin temporary?
  // const [bin, setBin] = React.useState("");

  // const dispatch = useAppDispatch();

  return (
    <PageContainer title="inputCardPage.title">
      <Box sx={{ mt: 6 }}>
        <IframeCardForm loading={loading} />
      </Box>
    </PageContainer>
  );
}
