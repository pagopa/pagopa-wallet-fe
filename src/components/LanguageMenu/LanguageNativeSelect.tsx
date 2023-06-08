import { Box, InputBase, NativeSelect, styled, useTheme } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { fallbackLang } from "../../translations/i18n";
import supportedLang, { getSortedLang } from "../../translations/lang";

export default function LanguageNativeSelect() {
  const { i18n, t } = useTranslation();
  const theme = useTheme();
  const [lang, setLang] = React.useState<string>(i18n.language.split("-")[0]);

  const languages = getSortedLang().map((elem, index) => (
    <option key={index} value={elem.lang.split("-")[0]}>
      {elem.label}
    </option>
  ));

  const changeLanguageHandler = React.useCallback(async (lang: string) => {
    setLang(lang);
    await i18n.changeLanguage(lang);
  }, []);

  const StyledInput = styled(InputBase)(() => ({
    "& .MuiInputBase-input": {
      padding: 0,
      fontSize: theme.typography.caption.fontSize,
    },
  }));

  return (
    <>
      <Box sx={visuallyHidden}>{t("ariaLabels.languageMenu")}</Box>
      <NativeSelect
        defaultValue={lang in supportedLang ? lang : fallbackLang}
        input={<StyledInput />}
        onChange={(e) => changeLanguageHandler(e.target.value)}
        aria-label={t("ariaLabels.appLanguage")}
      >
        {languages}
      </NativeSelect>
    </>
  );
}
