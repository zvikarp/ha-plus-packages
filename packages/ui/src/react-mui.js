/*! Adapted from HA+ Matter Hub. Apache-2.0. See bundled notices. */
import { footerStyles } from "./footer.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useLocalizer } from "./react.js";
import { muiStyles } from "./mui.js";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InboxIcon from "@mui/icons-material/Inbox";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const commonMessages = {};

export function PageMessage({ title, message, action, kind = "empty" }) {
  return jsx(Paper, {
    variant: "outlined",
    sx: muiStyles.pageState,
    role: kind === "error" ? "alert" : "status",
    children: jsxs(Stack, {
      spacing: 2,
      sx: muiStyles.centeredContent,
      children: [
        kind === "error"
          ? jsx(ErrorOutlineIcon, { color: "error", sx: muiStyles.stateIcon })
          : jsx(InboxIcon, { color: "disabled", sx: muiStyles.stateIcon }),
        jsxs("div", {
          children: [
            jsx(Typography, { variant: "h6", children: title }),
            jsx(Typography, { color: "text.secondary", children: message }),
          ],
        }),
        action,
      ],
    }),
  });
}

export function RetryButton({ onClick }) {
  const t = useLocalizer(commonMessages);
  return jsx(Button, { variant: "contained", onClick, children: t("common.retry") });
}

export function PageLoading({ label }) {
  const t = useLocalizer(commonMessages);
  return jsxs(Stack, {
    spacing: 2,
    "aria-busy": "true",
    "aria-label": label || t("common.loading"),
    children: [0, 1, 2].map(key => jsx(Skeleton, {
      variant: "rounded", sx: muiStyles.loadingRow,
    }, key)),
  });
}

export function PageHeader({ title, actions }) {
  return jsxs(Stack, {
    direction: "row",
    spacing: 2,
    sx: muiStyles.titleRow,
    children: [
      jsx(Typography, {
        component: "h1", variant: "h6", sx: muiStyles.wrappingHeading, children: title,
      }),
      actions,
    ],
  });
}


export function AppFooter({ githubUrl, documentationUrl, version }) {
  return jsxs("footer", {
    className: "ha-plus-footer",
    children: [
      jsx("style", { children: footerStyles }),
      githubUrl && jsx("a", { href: githubUrl, target: "_blank", rel: "noopener noreferrer", children: "GitHub" }),
      documentationUrl && jsx("a", { href: documentationUrl, target: "_blank", rel: "noopener noreferrer", children: "Documentation" }),
      jsx("span", { "data-version": "", children: version ? `v${String(version).replace(/^v/, "")}` : "" }),
    ],
  });
}

export function ContentCard({ title, actions, children }) {
  return jsxs(Box, {
    component: "section", sx: muiStyles.contentCard,
    children: [jsx(PageHeader, { title, actions }), children],
  });
}

export function FormActions({ onSave, onCancel, disabled, saving }) {
  const t = useLocalizer(commonMessages);
  return jsxs(Stack, {
    direction: "row", spacing: 1, sx: muiStyles.wrappedActions,
    children: [
      jsx(Button, { onClick: onCancel, disabled: saving, children: t("common.cancel") }),
      jsx(Button, { onClick: onSave, variant: "contained", disabled: disabled || saving, loading: saving, children: t("common.save") }),
    ],
  });
}
