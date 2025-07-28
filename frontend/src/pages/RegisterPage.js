import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


function RegisterPage() {
  const [formData, setFormData] = useState({
    correo: "",
    nombreUsuario: "",
    contraseña: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


     try {
      const res = await fetch(`${BACKEND_URL}/api/usuarios/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const msg = await res.text();

      if (msg === "Usuario registrado correctamente") {
        localStorage.setItem("usuario", formData.nombreUsuario);
        navigate("/");
      } else {
        alert(msg);
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="register-background">
      <div className="register-card">
        <h2>¡Bienvenido, crea tu cuenta!</h2>
        <form onSubmit={handleSubmit}>
          <input name="correo" placeholder="Correo electrónico" onChange={handleChange} required />
          <input name="nombreUsuario" placeholder="Nombre de usuario" onChange={handleChange} required />
          <input name="contraseña" type="password" placeholder="Contraseña" onChange={handleChange} required />
          <button type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
}
export default RegisterPage;
