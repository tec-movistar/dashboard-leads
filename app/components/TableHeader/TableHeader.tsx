import { TableCell, TableHead, TableRow } from "@mui/material";
import React from "react";

interface Props {
    columns: string[];
}

function TableHeader({ columns }: Props) {
    return (
        <TableHead>
        <TableRow>
            {columns.map((column, index) => (
                <TableCell key={index}>{column}</TableCell>
            ))}
        </TableRow>
      </TableHead>
    );
}

export default TableHeader;
