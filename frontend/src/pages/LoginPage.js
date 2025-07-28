import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


function LoginPage() {
  const [formData, setFormData] = useState({ correo: "", contraseña: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();

       try {
      const res = await fetch(`${BACKEND_URL}/api/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });


      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("usuario", data.nombreUsuario);
        localStorage.setItem("usuarioId", data.id);
        navigate("/");
      } else {
        const errorMsg = await res.text();
        alert(errorMsg);
      }
    } catch (error) {
      alert("Error al conectar con el servidor.");
      console.error(error);
    }
  };


  return (
    <div className="login-background">
      <div className="login-card">
        <h2>Inicia sesión</h2>
        <form onSubmit={handleSubmit}>
          <input name="correo" placeholder="Correo electrónico" onChange={handleChange} required />
          <input name="contraseña" type="password" placeholder="Contraseña" onChange={handleChange} required />
          <button type="submit">Iniciar sesión</button>
        </form>
      </div>
    </div>
  );
}


export default LoginPage;
