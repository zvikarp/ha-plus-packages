import type { ReactElement, ReactNode } from "react";
export interface PageMessageProps {
  title: string;
  message: string;
  action?: ReactNode;
  kind?: "empty" | "error";
}
export declare function PageMessage(props: PageMessageProps): ReactElement;
export declare function PageLoading(props: { label?: string }): ReactElement;
export declare function RetryButton(props: { onClick: () => void }): ReactElement;
export declare function PageHeader(props: { title: ReactNode; actions?: ReactNode }): ReactElement;

export declare function AppFooter(props: { githubUrl: string; documentationUrl?: string; version?: string }): ReactElement;
export declare function ContentCard(props: { title: ReactNode; actions?: ReactNode; children?: ReactNode }): ReactElement;
export declare function FormActions(props: { onSave: () => void; onCancel: () => void; disabled?: boolean; saving?: boolean }): ReactElement;
