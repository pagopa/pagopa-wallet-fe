import { Box, Typography } from "@mui/material";
import { CSSProperties } from "@mui/material/styles/createTypography";
import React from "react";
import { usePromiseTracker } from "react-promise-tracker";
import WalletLoader from "../../components/commons/WalletLoader";

export default function PageContainer(props: {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  link?: React.ReactNode;
  childrenSx?: CSSProperties;
}) {
  const { promiseInProgress } = usePromiseTracker({
    area: "page-container"
  });
  const { title, description, link, children, childrenSx } = props;

  const Content = () => (
    <>
      {!!title && (
        <Typography variant="h4" component={"div"} mb={2} color="text.primary">
          {props.title}
        </Typography>
      )}
      {!!description && (
        <Typography
          variant="body2"
          sx={{ mb: 1 }}
          color="text.light"
          whiteSpace="pre-line"
        >
          {description}
          {!!link && link}
        </Typography>
      )}
      <Box sx={childrenSx}>{children}</Box>
    </>
  );

  return (
    <Box mb={4} aria-live="polite">
      {promiseInProgress && <WalletLoader />}
      <Content />
    </Box>
  );
}
