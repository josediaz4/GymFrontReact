import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Landing.css";

const WHATSAPP = "3815556397";
const URL_TIKTOK = "https://www.tiktok.com";
const URL_INSTAGRAM = "https://www.instagram.com";

const CINTA = [
  "+190 ALUMNOS",
  "ENTRENAMIENTO ADAPTADO",
  "6 AÑOS DE EXPERIENCIA",
  "LUNES A VIERNES",
  "SERIEDAD Y RESPONSABILIDAD",
  "MAÑANA, TARDE Y NOCHE",
];

const PLANES = [
  {
    titulo: "CLASE",
    img: "/img/img1.png",
    texto:
      "Podés asistir cuando vos lo desees, abonando la clase. Vos decidís cuándo.",
    precio: "$6.000",
    detalle: "Consultar cupos",
  },
  {
    titulo: "3 VECES X SEMANA",
    img: "/img/img2.avif",
    texto:
      "Podrás asistir en el rango horario que elijas, ya sea mañana, siesta o noche, entre lunes y viernes.",
    precio: "$20.000",
    detalle: "12 clases por mes",
  },
  {
    titulo: "5 VECES X SEMANA",
    img: "/img/img3.avif",
    texto:
      "Vas a entrenar de lunes a viernes, los 5 días de la semana, en el horario que elijas.",
    precio: "$23.000",
    detalle: "20 clases por mes",
  },
];

const TURNOS = [
  {
    titulo: "Turnos Mañana",
    dias: "Lunes, miércoles y viernes",
    horas: ["8:00 a 9:00 hs", "9:00 a 10:00 hs"],
  },
  {
    titulo: "Turnos Siesta",
    dias: "Lunes a viernes",
    horas: ["15:00 a 16:00 hs", "16:30 a 17:30 hs"],
  },
  {
    titulo: "Turnos Noche",
    dias: "Lunes a viernes",
    horas: ["18:00 a 19:00 hs", "19:30 a 20:30 hs", "20:30 a 21:30 hs"],
  },
];

const linkWhatsapp = (texto) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;

function Landing() {
  const videoRef = useRef(null);
  const [contacto, setContacto] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  // React no siempre aplica el atributo "muted" a tiempo y el navegador
  // bloquea el autoplay; lo forzamos.
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.play().catch(() => {});
    }
  }, []);

  const handleChange = (e) => {
    setContacto({ ...contacto, [e.target.name]: e.target.value });
  };

  // El formulario abre WhatsApp con el mensaje ya armado
  const handleSubmit = (e) => {
    e.preventDefault();
    const texto = `Hola soy ${contacto.nombre} (${contacto.email}). ${contacto.mensaje}`;
    window.open(linkWhatsapp(texto), "_blank", "noopener");
    setContacto({ nombre: "", email: "", mensaje: "" });
  };

  return (
    <div className="landing">
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-dark fixed-top"
        style={{ background: "rgba(0, 0, 0, 0.3)" }}
      >
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="#hero">
            <img
              className="me-2"
              src="/pit.png"
              alt="Pitbull Gym"
              width="100"
              height="100"
            />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Abrir menú"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="#hero">
                  Inicio
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#precios">
                  Precios
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#acerca">
                  Acerca de
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#mapa">
                  Horarios
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contacto">
                  Contacto
                </a>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Ingresar
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section
        id="hero"
        className="position-relative text-center text-light"
        style={{ height: "85vh" }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-100 h-100 position-absolute top-0 start-0 object-fit-cover"
        >
          <source src="/img/14646230_1080_1920_25fps.mp4" type="video/mp4" />
          Tu navegador no soporta videos HTML5.
        </video>

        {/* Overlay oscuro para mejorar el contraste */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: "rgba(0, 0, 0, 0.5)" }}
        />

        <div className="d-flex align-items-center justify-content-center h-100 position-relative">
          <div className="container text-center">
            <p className="lead mb-4">+190 alumnos ya se animaron</p>
            <h1 className="display-4 fw-bold">
              MEJORÁ TU SALUD Y ESTILO DE VIDA
            </h1>
            <h1 className="display-4 fw-bold text-warning">
              EN EL GIMNASIO #1 DE FAMAILLÁ
            </h1>
            <p className="fs-2 lead mb-4">
              Entrenamiento personalizado <br /> y adaptado a cada persona.
            </p>
            <a
              href="#contacto"
              className="btn btn-warning btn-lg text-white rounded-pill"
            >
              Inscribirme ahora
            </a>
          </div>
        </div>

        {/* Cinta animada (el contenido va duplicado para que el loop sea continuo) */}
        <section id="cinta" aria-label="Beneficios del gimnasio">
          <div className="cinta bg-warning text-dark">
            <div className="cinta-track">
              {[...CINTA, ...CINTA].map((item, i) => (
                <span key={i}>&gt;&gt; {item}</span>
              ))}
            </div>
          </div>
        </section>
      </section>

      {/* Planes */}
      <section id="precios" className="container my-5 py-5">
        <div className="row">
          {PLANES.map((plan) => (
            <div className="col-md-4 mb-4 mb-md-0" key={plan.titulo}>
              <div className="card bg-dark text-light h-100">
                <img
                  src={plan.img}
                  className="card-img-top p-1"
                  alt={plan.titulo}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{plan.titulo}</h5>
                  <p className="card-text">{plan.texto}</p>
                  <div className="mb-3">
                    <h4 className="fs-1 mb-0 fw-bold">{plan.precio}</h4>
                    <small className="opacity-75">{plan.detalle}</small>
                  </div>
                  <div className="my-3 d-grid gap-2">
                    <a
                      href={linkWhatsapp(
                        `Hola! Me interesa el plan "${plan.titulo}".`,
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-warning"
                    >
                      ¡Me interesa!
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Acerca de */}
      <section id="acerca" className="container my-5 py-5">
        <div className="row align-items-center">
          <div className="col-md-6 mb-4 mb-md-0">
            <img
              src="/img/personal-trainer.jpg"
              className="img-fluid rounded shadow"
              alt="Entrenador personal"
            />
          </div>
          <div className="col-md-6 text-center">
            <h2 className="mb-5">Acerca de Nosotros</h2>
            <p>
              ¡Hola! Mi nombre es Javier Fanari y soy Profesor en Educación
              Física recibido en la UNT, apasionado por el cuidado de la salud
              personal y el entrenamiento adaptado.
            </p>
            <p>
              Lo que nos distingue de otros es que somos un gimnasio con
              entrenamientos personalizados y adaptados a cada persona, no
              importa la edad: nos adaptamos a vos y a tus necesidades. Siempre
              cuidándote y acompañándote en tu proceso de cambio.
            </p>
            <p>
              Con una trayectoria de 6 años en el rubro de la salud y el cuidado
              personal, instalaciones cómodas y los aparatos que necesitás para
              mantenerte en forma y cuidar tu salud.
            </p>
          </div>
        </div>
      </section>

      {/* Horarios y ubicación */}
      <section id="mapa" className="container my-5 py-5">
        <div className="row">
          <div className="col-md-6 text-center mb-5 mb-md-0">
            <div className="horarios my-4">
              <h2>
                <i className="bi bi-clock me-2" /> Horarios
              </h2>
              {TURNOS.map((turno) => (
                <div key={turno.titulo} className="mt-4">
                  <div className="d-inline-block rounded bg-warning text-dark px-4 py-2">
                    <h5 className="fw-bold">{turno.titulo}</h5>
                    <p className="mb-0">{turno.dias}</p>
                  </div>
                  <p className="mt-2 mb-0 fw-bold">
                    {turno.horas.map((hora) => (
                      <span key={hora} className="d-block">
                        {hora}
                      </span>
                    ))}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="col-md-6 text-center">
            <h2 className="mb-4">Dónde encontrarnos</h2>
            <p className="fs-4">
              Nos encontramos en{" "}
              <strong>Congreso 337, Famaillá, Tucumán</strong>. Vení a
              visitarnos y conocé nuestras instalaciones.
            </p>
            <div className="ratio ratio-16x9">
              <iframe
                className="rounded shadow"
                title="Ubicación del gimnasio"
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d373.47928362640124!2d-65.4040974862326!3d-27.056893761172102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2sar!4v1789156546632!5m2!1ses!2sar"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="container my-5">
        <h2 className="mb-4">Contacto</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="nombre">
              Nombre
            </label>
            <input
              className="form-control"
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Tu nombre"
              value={contacto.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="email">
              Correo electrónico
            </label>
            <input
              className="form-control"
              type="email"
              id="email"
              name="email"
              placeholder="nombre@ejemplo.com"
              value={contacto.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="mensaje">
              Mensaje
            </label>
            <textarea
              className="form-control"
              id="mensaje"
              name="mensaje"
              rows="4"
              placeholder="Escribí tu mensaje"
              value={contacto.mensaje}
              onChange={handleChange}
              required
            />
          </div>
          <button className="btn btn-warning btn-lg px-5" type="submit">
            Enviar por WhatsApp
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="bg-warning text-dark text-center py-4 mt-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <span className="fs-3 fw-bold">Pitbull Gym. </span>
              <span>Entrenamiento Adaptado.</span>
            </div>
            <div className="col-md-6 mt-3 mt-md-0">
              <h6>Nuestras Redes</h6>
              <a
                href={URL_TIKTOK}
                target="_blank"
                rel="noreferrer"
                className="text-dark me-3"
                aria-label="TikTok"
              >
                <i className="bi bi-tiktok" style={{ fontSize: "2rem" }} />
              </a>
              <a
                href={linkWhatsapp("Hola!")}
                target="_blank"
                rel="noreferrer"
                className="text-dark me-3"
                aria-label="WhatsApp"
              >
                <i className="bi bi-whatsapp" style={{ fontSize: "2rem" }} />
              </a>
              <a
                href={URL_INSTAGRAM}
                target="_blank"
                rel="noreferrer"
                className="text-dark"
                aria-label="Instagram"
              >
                <i className="bi bi-instagram" style={{ fontSize: "2rem" }} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
