import { Grid, Link, Typography } from "@mui/material";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { CustomDrawer } from "../modals/CustomDrawer";
import formatters from "../../utils";
import pspIcon from "../../assets/icons/psp.svg";
import securityIcon from "../../assets/icons/security.svg";
import tagIcon from "../../assets/icons/tag.svg";

interface Props {
  drawstate: boolean;
  toggleDrawer: () => void;
  pspName: string;
  pspFee: number;
}

export default function DrawerPSP(props: Props) {
  const { t } = useTranslation();
  const pspName = props.pspName;
  const pspFee = props.pspFee;
  const pspInfoPrivacyUrl = t("paypalPage.pspInfoModal.body3", { pspName });
  const maxFeeFriendlyComp = formatters.formatters.moneyFormat(pspFee || 0);
  return (
    <>
      {props.pspName && (
        <CustomDrawer open={props.drawstate} onClose={props.toggleDrawer}>
          <Typography variant="h4" component={"div"} my={1}>
            {t("paypalPage.pspInfoModal.title", { pspName })}
          </Typography>
          <Grid container spacing={2} my={2}>
            <Grid
              item
              xs={2}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <img
                src={pspIcon}
                alt={t("paypalPage.pspInfoModal.accessibilityIconAlt")}
                aria-hidden="true"
              />
            </Grid>
            <Grid item xs={10}>
              <Typography variant="body2">
                {t("paypalPage.pspInfoModal.body1", { pspName })}
              </Typography>
            </Grid>
            <Grid
              item
              xs={2}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <img
                src={securityIcon}
                alt={t("paypalPage.pspInfoModal.accessibilityIconAlt")}
                aria-hidden="true"
              />
            </Grid>
            <Grid item xs={10}>
              <Typography variant="body2">
                <Trans
                  values={{ maxFeeFriendlyComp }}
                  i18nKey={"paypalPage.pspInfoModal.body2"}
                />
              </Typography>
            </Grid>
            <Grid
              item
              xs={2}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <img
                src={tagIcon}
                alt={t("paypalPage.pspInfoModal.accessibilityIconAlt")}
                aria-hidden="true"
              />
            </Grid>
            <Grid item xs={10}>
              <Typography variant="body2">
                <Link
                  href="https://www.pagopa.gov.it/it/prestatori-servizi-di-pagamento/elenco-PSP-attivi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title={t("paypalPage.pspInfoModal.accessibilityLinkTitle")}
                  sx={{ textDecoration: "none", fontWeight: 600 }}
                >
                  {pspInfoPrivacyUrl}
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </CustomDrawer>
      )}
    </>
  );
}
