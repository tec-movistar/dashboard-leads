'use client'


import { useState } from 'react';
import styles from './login.module.css';
import { useRouter } from 'next/router';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function Login() {
    const router = useRouter();

    const [user, setUser] = useState({
        email: '',
        password: ''
    });

    const handleRegister = () => {
        router.push('/register');
    }

    const handleLogin = async () => {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, user);

        if (response.status === 200) {
            toast.success('Usuario logueado correctamente');

            localStorage.setItem('tokenTecMovistarDashboardLeads', JSON.stringify(response.data.token));
            router.push('/home');
        } else {
            toast.error('Error al loguear usuario');
        }
    }

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginFormContainer}>
                <h1>Login</h1>
                <input className={styles.loginInput} type="email" placeholder="email" onChange={ev => setUser({ ...user, email: ev.target.value })} />
                <input className={styles.loginInput} type="password" placeholder="password" onChange={ev => setUser({ ...user, password: ev.target.value })} />
                <button className={styles.submmit} onClick={handleLogin}>Login</button>
                {/* <div>
                    <p>No tienes una cuenta?</p>
                    <button className={styles.submmit} onClick={handleRegister}>Regístrate</button>
                </div> */}
            </div>
        </div>
    );
}

export default Login;
