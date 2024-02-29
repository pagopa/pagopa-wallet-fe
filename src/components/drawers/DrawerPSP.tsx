import { Grid, Typography } from "@mui/material";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { CustomDrawer } from "../modals/CustomDrawer";
import { PayPalPsp } from "../../../generated/definitions/payment-manager-v1/PayPalPsp";
import formatters from "../../utils";

interface Props {
  drawstate: boolean;
  toggleDrawer: () => void;
  pspInfo: PayPalPsp | undefined;
}

export default function DrawerPSP(props: Props) {
  const { t } = useTranslation();
  const pspInfo = props.pspInfo;
  const maxFeeFriendlyComp = formatters.formatters.moneyFormat(
    pspInfo?.maxFee || 0
  );
  return (
    <>
      {pspInfo && (
        <CustomDrawer open={props.drawstate} onClose={props.toggleDrawer}>
          <Typography variant="h4" component={"div"} my={1}>
            {t("paypalPage.pspInfoModal.title", { pspInfo })}
          </Typography>
          <Grid container spacing={2} my={2}>
            <Grid item xs={2}>
              asd
            </Grid>
            <Grid item xs={10}>
              <Typography variant="body2">
                {t("paypalPage.pspInfoModal.body1", { pspInfo })}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              asd
            </Grid>
            <Grid item xs={10}>
              <Typography variant="body2">
                <Trans
                  values={{ maxFeeFriendlyComp }}
                  i18nKey={"paypalPage.pspInfoModal.body2"}
                />
              </Typography>
            </Grid>
            <Grid item xs={2}>
              asd
            </Grid>
            <Grid item xs={10}>
              <Typography variant="body2">
                {t("paypalPage.pspInfoModal.body3", { pspInfo })}
              </Typography>
            </Grid>
          </Grid>
        </CustomDrawer>
      )}
    </>
  );
}
