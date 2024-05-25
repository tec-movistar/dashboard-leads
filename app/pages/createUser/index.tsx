import React from "react";
import Nav from "../../components/Nav/Nav";
import axios from 'axios';
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/router";

function CreateUser() {
  const router = useRouter();

  const onSubmit = (e:any) => {
    e.preventDefault();
    
    // como tomodo los valores
    const formData = new FormData(e.target);
    const data: any = {};

    formData.forEach((value, key) => {
      data[key] = value;
    });


    if(data.password !== data.password2) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (data.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users`, data).then((response) => {
      e.target.reset();
      toast.success("Usuario creado correctamente");
      router.push('/users');
    }).catch((error) => {
      console.error(error);
      toast.error("Error al crear usuario");
    });

  }

  return (
    <div className="createUserContainer">
        <Nav />
        <div className="pageCreateUserContainer">
          <h1>Crear usuario</h1>
          <form className="createUserForm" onSubmit={onSubmit}>
            <input className="inputFormCreateUser" name="name" type="text" placeholder="Nombre" required />
            {/* select role */}
            <select className="inputFormCreateUser" name="role" defaultValue="admin" required>
              <option value="administrator">Administrador</option>
              <option value="asesor">Asesor</option>
            </select>
            <input className="inputFormCreateUser" name="email" type="email" placeholder="Email" required />
            <input className="inputFormCreateUser" name="password" type="password" placeholder="Contraseña" required />
            <input className="inputFormCreateUser" name="password2" type="password" placeholder="Repetir contraseña" required />
            <button className="primaryButton">Crear usuario</button>
          </form>
        </div>  

        <Toaster
          position="top-right"
          reverseOrder={false}
        />  
    </div>
  );
}

export default CreateUser;