import JSZip from "jszip";
import { createContext, useContext, useMemo, useState, PropsWithChildren } from "react";


export interface ExportFileContextValue {
    data: { [key: string]: JSZip.JSZipObject } | null;
    files: string[] | null;
    setFiles: (files: string[]) => void;
    setData: (payload: { [key: string]: JSZip.JSZipObject }) => void;
    reset: () => void;
}

const ExportFileContext = createContext<ExportFileContextValue | undefined>(undefined);

export function ExportFileProvider({ children }: PropsWithChildren) {
    const [data, setData] = useState<{ [key: string]: JSZip.JSZipObject } | null>(null);
    const [files, setFiles] = useState<string[] | null>(null);

    const reset = () => {
        setData(null);
        setFiles(null);
    };

    const value = useMemo<ExportFileContextValue>(
        () => ({
            data,
            files,
            setFiles,
            setData,
            reset,
        }),
        [data, files]
    );

    return <ExportFileContext.Provider value={value}>{children}</ExportFileContext.Provider>;
}

export function useExportFile(): ExportFileContextValue {
    const ctx = useContext(ExportFileContext);
    if (!ctx) {
        throw new Error("useExportFile must be used within an ExportFileProvider");
    }
    return ctx;
}