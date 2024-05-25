import styles from './register.module.css';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';


function Register() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: '',
        password: ''
    });

    const handleSend = async () => {
        const response = await axios.post('/api/user', user);
        
        if (response.status === 201) {
            console.log('Usuario creado');
            router.push('/');
        } else {
            alert('Error al crear usuario');
        }
    }



    return (
      <div className={styles.registerContainer}>
          <div className={styles.registerFormContainer}>
              <h1>Crear usuario</h1>
              <input className={styles.registerInput} onChange={ev => setUser({...user, email: ev.target.value})} type="email" placeholder="email" />
              <input className={styles.registerInput} onChange={ev => setUser({...user, password: ev.target.value})}  type="password" placeholder="password" />
              <button className={styles.submmit} onClick={handleSend}>Registrar</button>
          </div>
      </div>
    );
}

export default Register;