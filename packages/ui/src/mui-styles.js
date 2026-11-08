/*! Adapted from HA+ Matter Hub. Licensed under Apache-2.0. See ha-plus-ui.NOTICE and ha-plus-ui.LICENSE-APACHE-2.0 in the distribution. */
// Shared presentation for MUI consumers. Values use MUI spacing units.
export const muiStyles = {
  centered: { justifyContent: "center" },
  centeredRow: { display: "flex", alignItems: "center" },
  growColumn: {
    paddingInlineStart: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    flexGrow: 1,
    minWidth: 0,
  },
  endRow: { display: "flex", justifyContent: "flex-end" },
  wrap: { flexWrap: "wrap" },
  centeredHorizontal: { display: "flex", justifyContent: "center" },
  qrContainer: { position: "relative", maxWidth: "160px" },
  absoluteCenter: { position: "absolute", top: "50%", left: "50%" },
  codeText: { fontFamily: "monospace", fontSize: "0.9em" },
  ellipsis: {
    marginInlineStart: 1,
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  centeredContent: { alignItems: "center", textAlign: "center" },
  loadingRow: { height: 88 },
  titleRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 1,
  },
  wrappedActions: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 1,
    flexWrap: "wrap",
  },
  pageActions: {
    display: "flex",
    justifyContent: "end",
    paddingTop: { xs: 1, sm: 0 },
  },
  relative: { position: "relative" },
  footer: { mt: 16, mb: 4 },
  dividerSpacing: { mt: 4, mb: 4 },
  padded: { padding: 2 },
  brandImage: {
    height: "32px",
    width: "32px",
    flexShrink: 0,
    objectFit: "contain",
  },
  brandText: { mr: 1, ml: 1 },
  topBar: { height: "var(--header-height, 56px)" },
  toolbar: { paddingLeft: "0 !important", paddingRight: "0 !important" },
  headerContent: {
    padding: 2,
    height: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  wrapText: { overflowWrap: "anywhere" },
  breadcrumbs: { "& li": { minWidth: 0, maxWidth: "100%" } },
  row: { display: "flex" },
  largeIcon: { height: "3em", width: "3em" },
  actionTarget: { minHeight: 44 },
  desktopOnly: { display: { xs: "none", sm: "block" } },
  shrinkable: { minWidth: 0 },
  wrappingChip: {
    maxWidth: "100%",
    height: "auto",
    "& .MuiChip-label": {
      whiteSpace: "normal",
      overflowWrap: "anywhere",
      py: 0.5,
    },
  },
  diagonalBadge: { transform: "translate(-50%, -50%) rotate(-45deg)" },
  helpLink: {
    textDecoration: "underline",
    textDecorationStyle: "dashed",
    cursor: "help",
    color: "inherit",
  },
  scrollableList: { maxHeight: 560, overflow: "auto" },
  emptyList: { p: 3, textAlign: "center" },
  unstyledListItem: { listStyle: "none" },
  listSubheading: { overflowWrap: "anywhere", lineHeight: 1.5, py: 1 },
  sectionHeading: { mb: 2 },
  sectionPaper: { p: 2, mb: 2 },
  wrappingTable: { tableLayout: "fixed", "& td": { overflowWrap: "anywhere" } },
  themedIcon: { fill: (theme) => theme.palette.text.primary },
  pageState: { p: 4 },
  stateIcon: { fontSize: 48 },
  notification: { minWidth: "300px" },
  wrappingHeading: { minWidth: 0, overflowWrap: "anywhere" },
  iconAction: { flexShrink: 0, width: 44, height: 44 },
  editor: { minWidth: 0, maxWidth: "100%" },
  editorAction: {
    position: "absolute",
    insetInlineEnd: "0",
    bottom: "0",
  },
};
export const inlineStyles = {
  qrSurface: {
    background: "white",
    padding: "9px",
    paddingBottom: "2.6px",
  },
  fill: { width: "100%", height: "100%" },
  enlargedText: { fontSize: "1.5em" },
  brandIcon: {
    maxHeight: "1em",
    maxWidth: "3em",
  },
};
export const brandLinkStyles = (large) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: large ? "flex-start" : "center",
  flexGrow: 1,
  textDecoration: "none",
  color: "inherit",
});

export const globalStyles = {
  // @rsjf/mui has a bug which breaks nested item rendering (see https://github.com/rjsf-team/react-jsonschema-form/issues/4838)
  ".rjsf-field-array > .MuiFormControl-root > .MuiPaper-root > .MuiBox-root > .MuiGrid-root > .MuiGrid-root:has(> .MuiBox-root > .MuiPaper-root > .MuiBox-root > .rjsf-field)":
    {
      overflow: "initial !important",
      flexGrow: 1,
    },
};

export const editorHeight = "400px";
