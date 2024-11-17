import React, { useState } from 'react';
import { Button, Spinner } from "reactstrap";
import * as XLSX from "xlsx";

function BotonExcelDefault({ resultados }) {

    const [loadind, setLoading] = useState(false);

    const handleDownload = () => {
        setLoading(true);

        const libro = XLSX.utils.book_new();
        const hoja = XLSX.utils.json_to_sheet(resultados);

        XLSX.utils.book_append_sheet(libro, hoja, "Ventas");

        setTimeout(() => {
            XLSX.writeFile(libro, "Ventas_AQUACOLORS.xlsx");
            setLoading(false);
        }, 1000);
    };

    return (
        <>
            {
                !loadind ? (
                    <Button color="success" onClick={handleDownload}>
                        Excel
                    </Button>
                ) : (
                    <Button color="success" disabled>
                        <Spinner size="sm">Loading...</Spinner>
                        <span>Generando...</span>
                    </Button>
                )
            }
        </>
    );
}

export default BotonExcelDefault;