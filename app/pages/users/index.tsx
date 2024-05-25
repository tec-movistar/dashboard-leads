import React, { useEffect } from "react";
import Nav from "../../components/Nav/Nav";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store/hook";
import { getUsers } from "../../store/features/appSlice";
import { useRouter } from "next/router";
import TableHeader from "../../components/TableHeader/TableHeader";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import TableBodyApp from "../../components/TableBody/TableBody";

interface Row {
    name: string;
    email: string;
    user_type_id: number;
    created_at: Date;
}


function Users() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const users = useSelector((state:any) => state.app.usersList);

    const handleCreateUser = () => {
        router.push('/createUser');
    }

    const getRole = (role: number) => {
        if (role === 1) {
            return 'Administrador';
        }

        if (role === 2) {
            return 'Asesor';
        }

        return 'Usuario'
    };

    useEffect(() => {
        dispatch(getUsers());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="container">
            <Nav />
            <div className="usuariosContainer">
                <div className="cardHeaderContainer">
                    <div className="usuariosHeader">
                        <h1>Usuarios</h1>
                        <button className="primaryButton" onClick={handleCreateUser}>Crear usuario</button>
                    </div>
                </div>
                <div className="cardContainer">
                    <div className="userContent">
                        <Table sx={{ minWidth: 650}} aria-label="simple table">
                            <TableHeader columns={["Nombre", "Email", "Rol", "Fecha de creación", "Acciones"]} />
                            <TableBody >
                                    {users.map((row: Row, index: number) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                          >
                                                <TableCell key={index}>{row.name}</TableCell>
                                                <TableCell key={index}>{row.email}</TableCell>
                                                <TableCell key={index}>{getRole(row.user_type_id)}</TableCell>
                                                <TableCell key={index}>{new Date(row.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</TableCell>
                                                <TableCell key={index}></TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Users;