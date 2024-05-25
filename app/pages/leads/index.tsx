import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav/Nav";
import TableHeader from "../../components/TableHeader/TableHeader";
import { CircularProgress, Table, TableBody, TableCell, TableRow } from "@mui/material";
import axios from "axios";
import { getToken } from "../../utils/helpers";
import moment from "moment";
import LoaderSpinner from "../../components/LoaderSpinner/LoaderSpinner";
import * as XLSX from 'xlsx';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(50);
  const [order, setOrder] = useState('asc');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);

  const getLeads = async () => {
    setLoading(true);
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/leads?offset=${offset}&limit=${limit}&order=${order}`,
    {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    }
    )
    .then((response) => {
      setLeads(response.data);
    })
    .finally(() => {
      setLoading(false);
    });
  }

  const handleGetTotal = async () => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/leads/total`,
    {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    }
    )
    .then((response) => {
      setTotal(response.data.count);
    });
  }

  const handleGetExport = async () => {
    setExporting(true);
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/leads/listExport`,
    {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    }
    )
    .then((response) => {
      console.log(response.data);
      // necesito crear un archivo xlsx con la data de response.data usa las cabeceras de la tabla

      // organiza la data para exportar
      const data = response.data.map((item: any) => {
        return [
          item.id,
          item.lead_type,
          item.name,
          item.document_id,
          item.expidition_date,
          item.addres,
          item.city,
          item.mail,
          item.phone_number,
          item.phone_number_operator,
          item.actual_status,
          item.donor_operator,
          moment(item.created_at).format('DD-MM-YYYY')
          ];
      }
      );
      
      data.unshift(['id', 'Tipo de venta', 'Nombre completo', '# cedula', 'Fecha de expedición', 'Dirección', 'Cartago', 'Correo electrónico', 'Número de celular', 'Número de celular adicional', 'Estado de linea', 'Operador donante', 'Fecha de creación']);

      const fileName = 'Leads de ventas.xlsx';
      const ws_name = 'Leads de ventas';
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, ws_name);
      XLSX.writeFile(wb, fileName);

    })
    .finally(() => {
      setExporting(false);
    });
  }
  

  const handleNextPage = () => {
    setPage(page + 1);
    setOffset(offset + limit);
  }

  const handlePrevPage = () => {
    if (offset === 0) return;
    setPage(page - 1);
    setOffset(offset - limit);
  }

  useEffect(() => {
    getLeads();
    handleGetTotal();
  }, []);

  useEffect(() => {
    getLeads();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, offset, limit, page]);
  


  return (
    <div className="container">
          <Nav />
          <div className="usuariosContainer">
            <div className="cardHeaderContainer">
                <div className="usuariosHeader">
                    <h1>Leads de ventas</h1>
                    <div style={{ width: '500px', display: 'flex', alignItems: 'center' }}>
                      <button className="primaryButton exportButton" onClick={() => handleGetExport()}>{exporting && <CircularProgress size={20} />}Exportar</button>
                      <button className="primaryButton middleWidth" onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}>{order}</button>
                      <button className="primaryButton middleWidth" onClick={() => handlePrevPage()}>{offset + ' <'}</button>
                      <button className="primaryButton middleWidth" onClick={() => handleNextPage()}>{'>' + (limit + offset)}</button>
                      <p style={{ width: 90 }}>Total: {total}</p>
                    </div>
                </div>
            </div>
            <div className="cardContainer" style={{ overflowY: 'scroll', height: '80vh'}}>
              {loading ? <LoaderSpinner />:
                        <Table sx={{ minWidth: 650, maxHeight: 1000}} aria-label="simple table">
                          <TableHeader columns={['Tipo de venta', 'Nombre completo', '# cedula', 'Fecha de expedición', 'Dirección', 'Cartago', 'Correo electrónico', 'Número de celular', 'Número de celular adicional', 'Estado de linea', 'Operador donante', 'Fecha de creación']} />
                          <TableBody >
                            {leads.map((row: any, index: number) => (
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                  >
                                    <TableCell component="th" scope="row">
                                      {row.lead_type}
                                    </TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.document_id}</TableCell>
                                    <TableCell>{row.expidition_date}</TableCell>
                                    <TableCell>{row.addres}</TableCell>
                                    <TableCell>{row.city}</TableCell>
                                    <TableCell>{row.mail}</TableCell>
                                    <TableCell>{row.phone_number}</TableCell>
                                    <TableCell>{row.phone_number_operator}</TableCell>
                                    <TableCell>{row.actual_status}</TableCell>
                                    <TableCell>{row.donor_operator}</TableCell>
                                    <TableCell>{moment(row.created_at).format('DD-MM-YYYY')}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>}

            </div>
          </div>
    </div>
  );
}