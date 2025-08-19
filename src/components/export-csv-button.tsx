"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { exportProductsToCSV } from "@/app/actions/products";
import Button from "./button";
import { DownloadIcon } from "lucide-react";

export default function ExportCSVButton() {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);

        try {
            const result = await exportProductsToCSV();

            if (!result.success) {
                toast(`Erreur: ${result.error}`, { type: "error" });
            } else if(result.data) {
                // Création et téléchargement du fichier
                const blob = new Blob([result.data], {
                    type: 'text/csv;charset=utf-8;'
                });

                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = result.filename;
                link.style.display = 'none';

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                URL.revokeObjectURL(url);

                toast("Export CSV terminé ✅", {type: "success"});
            }
        } catch (error) {
            console.error('Erreur lors de l\'export:', error);
            toast("Erreur lors de l'export", { type: "error" });
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Button
            onClick={handleExport}
            disabled={isExporting}
            icon={DownloadIcon}
            label={isExporting ? "Export en cours..." : "Exporter CSV"}
        />
    );
}