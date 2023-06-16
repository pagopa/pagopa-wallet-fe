import { Box, Link, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import pagopaLogo from "../../assets/images/logo-pagopa-spa.svg";
import LanguageFooterMenu from "../LanguageMenu/LanguageNativeSelect";
import lang from "../../translations/lang";

export default function Footer(props: { fixedPages: Array<string> }) {
  const { t } = useTranslation();
  const location = useLocation();
  const isFixed = () =>
    props.fixedPages.includes(location.pathname.split("/").slice(-1)[0]);

  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      pb={{ ...(isFixed() ? {} : { xs: 16 }), sm: 0 }}
      pl={{ xs: 3, sm: 6 }}
      pr={{ xs: 3, sm: 6 }}
      pt={{
        ...(isFixed() ? {} : { xs: "3rem" }),
        sm: 0,
      }}
      bgcolor={{
        ...(isFixed()
          ? { xs: "background.paper" }
          : { xs: "background.default" }),
        sm: "background.paper",
      }}
    >
      <Typography variant="caption" component={"div"}>
        <Box display={"flex"} alignItems={"center"} gap={1}>
          <Link
            href="https://form.agid.gov.it/view/7628e161-33c0-420f-8c80-4fe362d2c7c5/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "black", textDecoration: "none" }}
            title={t("mainPage.footer.accessibility")}
          >
            {t("mainPage.footer.accessibility")}
          </Link>
          <p aria-hidden="true">·</p>
          <Link
            href="https://www.pagopa.gov.it/it/helpdesk/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "black", textDecoration: "none" }}
            title={t("mainPage.footer.help")}
          >
            {t("mainPage.footer.help")}
          </Link>
          {Object.keys(lang).length > 1 && (
            <>
              <p aria-hidden="true">·</p>
              <LanguageFooterMenu />
            </>
          )}
        </Box>
      </Typography>
      <Link
        href="https://www.pagopa.it/it/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "flex" }}
        title={t("mainPage.footer.pagoPA")}
      >
        <img
          src={pagopaLogo}
          alt="pagoPA"
          style={{ width: "60px", height: "17px" }}
          aria-hidden="true"
        />
      </Link>
    </Box>
  );
}
