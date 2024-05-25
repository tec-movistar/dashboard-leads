import React from "react";
import { TableBody, TableCell, TableRow } from "@mui/material";

interface Row {
    name: string;
    email: string;
    user_type_id: number;
    created_at: Date;
}


interface Props {
    rows: Row[];
}

function TableBodyApp ({ rows }: Props) {
    return (
        <TableBody>
            <TableRow>
                {/* {rows.map((row, index) => (
                    <>
                        <TableCell key={index}>{row.name}</TableCell>
                        <TableCell key={index}>{row.email}</TableCell>
                        <TableCell key={index}>{row.user_type_id}</TableCell>
                        <TableCell key={index}>{row.created_at.toString()}</TableCell>
                        <TableCell key={index}></TableCell>
                    </>
                ))} */}
            </TableRow>
        </TableBody>
    );
}

export default TableBodyApp;