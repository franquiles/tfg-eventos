import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


function LoginPage() {
  const navigate = useNavigate();

  const [vista, setVista] = useState("login");
  const [formData, setFormData] = useState({ correo: "", contraseña: "" });
  const [emailRecuperar, setEmailRecuperar] = useState("");
  const [codigoEnviado, setCodigoEnviado] = useState("");
  const [codigoIngresado, setCodigoIngresado] = useState("");
  const [nueva1, setNueva1] = useState("");
  const [nueva2, setNueva2] = useState("");

  //LOGIN
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

//ENVIAR CODIGO
const enviarCodigo = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/usuarios/recuperar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: emailRecuperar }),
      });
      const msg = await res.text();
      if (res.ok) {
        setVista("codigo");
        alert("Código enviado a tu correo");
      } else {
        alert(msg);
      }
    } catch (err) {
      alert("Error enviando el código");
      console.error(err);
    }
  };



  //VALIDAR CODIGO
 const validarCodigo = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/usuarios/validar-codigo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: emailRecuperar, codigo: codigoIngresado }),
      });
      const msg = await res.text();
      if (res.ok) {
        setVista("nueva");
      } else {
        alert(msg);
      }
    } catch (err) {
      alert("Error validando el código");
    }
  };


  //CAMBIAR CONTRASEÑA
const cambiarPassword = async () => {
    if (nueva1 !== nueva2) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/usuarios/cambiar-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: emailRecuperar, nueva: nueva1 }),
      });
      const msg = await res.text();
      if (res.ok) {
        alert("Contraseña cambiada correctamente");
        setVista("login");
      } else {
        alert(msg);
      }
    } catch (err) {
      alert("Error cambiando contraseña");
    }
  };



   return (
    <div className="login-background">
      <div className="login-card">
        {vista === "login" && (
          <>
            <h2>Inicia sesión</h2>
            <form onSubmit={handleSubmit}>
              <input name="correo" placeholder="Correo electrónico" onChange={(e) => setFormData({ ...formData, correo: e.target.value })} required />
              <input name="contraseña" type="password" placeholder="Contraseña" onChange={(e) => setFormData({ ...formData, contraseña: e.target.value })} required />
              <button type="submit">Iniciar sesión</button>
            </form>
            <p style={{ marginTop: "10px" }}>
              <button onClick={() => setVista("email")} className="link-button">¿Olvidaste tu contraseña?</button>
            </p>
          </>
        )}

        {vista === "email" && (
          <>
            <h2>Recuperar contraseña</h2>
            <input type="email" placeholder="Introduce tu correo" value={emailRecuperar} onChange={(e) => setEmailRecuperar(e.target.value)} />
            <button onClick={enviarCodigo}>Enviar código</button>
            <p style={{ marginTop: "10px" }}><button onClick={() => setVista("login")} className="link-button">Volver</button></p>
          </>
        )}

        {vista === "codigo" && (
          <>
            <h2>Introduce el código recibido</h2>
            <input maxLength="6" placeholder="Código de 6 cifras" value={codigoIngresado} onChange={(e) => setCodigoIngresado(e.target.value)} />
            <button onClick={validarCodigo}>Validar</button>
            <p style={{ marginTop: "10px" }}><button onClick={() => setVista("login")} className="link-button">Volver</button></p>
          </>
        )}

        {vista === "nueva" && (
          <>
            <h2>Nueva contraseña</h2>
            <input type="password" placeholder="Nueva contraseña" value={nueva1} onChange={(e) => setNueva1(e.target.value)} />
            <input type="password" placeholder="Repite la contraseña" value={nueva2} onChange={(e) => setNueva2(e.target.value)} />
            <button onClick={cambiarPassword}>Cambiar contraseña</button>
            <p style={{ marginTop: "10px" }}><button onClick={() => setVista("login")} className="link-button">Volver</button></p>
          </>
        )}
      </div>
    </div>
  );
}


export default LoginPage;
