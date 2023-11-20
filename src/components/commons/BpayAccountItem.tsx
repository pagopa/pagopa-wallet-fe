import React from "react";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import { Box, Typography, Stack } from "@mui/material";
import { IBpayAccountItems } from "../../features/onboard/models";

type IBpayAccountItem = IBpayAccountItems[number];

const BpayAccountItem = (props: IBpayAccountItem) => {
  const { numberObfuscated, nameObfuscated, surnameObfuscated } = props;
  return (
    <Box
      boxShadow={16}
      sx={(theme) => ({
        padding: 2,
        backgroundColor: theme.palette.grey[100],
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[4]
      })}
    >
      <Stack minHeight={120} justifyContent={"space-between"}>
        <Stack direction={"row"} spacing={1}>
          <PhoneInTalkOutlinedIcon />
          <Typography>{numberObfuscated}</Typography>
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems="center"
        >
          <Typography
            sx={{ textTransform: "upperCase" }}
          >{`${nameObfuscated} ${surnameObfuscated}`}</Typography>
          <img
            style={{ mixBlendMode: "multiply" }}
            src="https://api.dev.platform.pagopa.it/wallet/assets/img/externalps/bpay.png"
            alt="bancomat pay logo"
          />
        </Stack>
      </Stack>
    </Box>
  );
};

export default BpayAccountItem;
