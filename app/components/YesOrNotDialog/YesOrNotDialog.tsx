import { CircularProgress, Modal } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store/hook";
import { setProductToDeleteOpen } from "../../store/features/appSlice";
import styles from './yesOrNotDialog.module.css'
import toast from "react-hot-toast";
import { getToken } from "../../utils/helpers";
import axios from "axios";

function YesOrNotDialog() {
    const dispatch = useAppDispatch();

    const deleteOpen = useSelector((state: any) => state.app.productToDelete.open);
    const productId = useSelector((state: any) => state.app.productToDelete.id);

    const [loading, setLoading] = useState(false);

    const handleNo = () => {
        dispatch(setProductToDeleteOpen(false));
    }

    const handleYes = () => {
        setLoading(true);

        axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }).then(() => {
            dispatch(setProductToDeleteOpen(false));
            toast.success("Producto eliminado");
            setLoading(false);
            // getProducts();
        }).catch(error => {
            setLoading(false);
            console.error(error);
            toast.error("Error al eliminar el producto");
        });
    };

    return (
        <Modal open={deleteOpen} onClose={handleNo}>
            <div className={styles.dialogContainerYesOrNot}>
                <h2 className={styles.textTitle}>¿Estás seguro que quieres eliminar este producto?</h2>
                <div className={styles.buttonsContainer}>
                    <button className={styles.yesButton} onClick={handleYes}>
                        {loading && (
                        <CircularProgress size={17} color="secondary" />
                        )}
                        Sí</button>
                    <button className={styles.noButton} onClick={handleNo}>No</button>
                </div>
            </div>
        </Modal>
    );
}

export default YesOrNotDialog;
