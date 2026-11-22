import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  getPlanesPublicos,
  getHorariosPublicos,
} from "../../services/publicoService";
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

// Las fotos se asignan por orden; los planes vienen de la base, ordenados por precio
const IMAGENES = ["/img/img1.png", "/img/img2.avif", "/img/img3.avif"];

const formatoMoneda = (valor) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);

const detallePlan = (plan) => {
  const periodo =
    plan.duracionDias === 1
      ? "por día"
      : plan.duracionDias === 30
        ? "por mes"
        : `cada ${plan.duracionDias} dias`;

  return `${plan.cantidadClases} ${plan.cantidadClases === 1 ? "clase" : "clases"} ${periodo}`;
};

const ABREV_DIAS = {
  Lunes: "Lun",
  Martes: "Mar",
  Miercoles: "Mié",
  Jueves: "Jue",
  Viernes: "Vie",
  Sabado: "Sáb",
  Domingo: "Dom",
};

const hhmm = (hora) => hora.slice(0, 5); // "08:00:00" -> "08:00"
const sinCero = (hora) => hhmm(hora).replace(/^0/, ""); // "08:00" -> "8:00"

const nombreTurno = (hora) => {
  const h = parseInt(hora.slice(0, 2), 10);
  return h < 13 ? "Mañana" : h < 18 ? "Siesta" : "Noche";
};

// Agrupa las clases en Mañana / Siesta / Noche y junta los días
// que comparten el mismo rango horario
const agruparTurnos = (horarios) => {
  const turnos = { Mañana: {}, Siesta: {}, Noche: {} };

  horarios.forEach((h) => {
    const clave = `${hhmm(h.horaInicio)}|${hhmm(h.horaFin)}`;
    const rangos = turnos[nombreTurno(h.horaInicio)];
    rangos[clave] ??= { inicio: h.horaInicio, fin: h.horaFin, dias: new Set() };
    rangos[clave].dias.add(h.diaSemana);
  });

  return Object.entries(turnos)
    .filter(([, rangos]) => Object.keys(rangos).length > 0)
    .map(([nombre, rangos]) => ({
      nombre: `Turnos ${nombre}`,
      rangos: Object.keys(rangos)
        .sort()
        .map((clave) => {
          const r = rangos[clave];
          return {
            rango: `${sinCero(r.inicio)} a ${sinCero(r.fin)} hs`,
            dias: Object.keys(ABREV_DIAS)
              .filter((d) => r.dias.has(d))
              .map((d) => ABREV_DIAS[d])
              .join(", "),
          };
        }),
    }));
};

const linkWhatsapp = (texto) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;

function Landing() {
  const videoRef = useRef(null);
  const [planes, setPlanes] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorDatos, setErrorDatos] = useState(false);
  const [contacto, setContacto] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  // React no siempre aplica el atributo "muted" a tiempo y el navegador
  // bloquea el autoplay; lo forzamos.
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [planesData, horariosData] = await Promise.all([
          getPlanesPublicos(),
          getHorariosPublicos(),
        ]);
        setPlanes(planesData);
        setTurnos(agruparTurnos(horariosData));
        console.log(planes);
      } catch (err) {
        console.error(err);
        setErrorDatos(true);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
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
        {cargando && <p className="text-center">Cargando planes...</p>}

        {!cargando && planes.length === 0 && (
          <p className="text-center">
            {errorDatos
              ? "No pudimos cargar los planes."
              : "Pronto vamos a publicar nuestros planes."}{" "}
            <a
              href={linkWhatsapp("Hola! Quisiera consultar los planes.")}
              target="_blank"
              rel="noreferrer"
            >
              Consultanos por WhatsApp
            </a>
          </p>
        )}

        <div className="row justify-content-center">
          {planes.map((plan, i) => (
            <div className="col-md-4 mb-4" key={`${plan.nombrePlan}-${i}`}>
              <div className="card bg-dark text-light h-100">
                <img
                  src={IMAGENES[i % IMAGENES.length]}
                  className="card-img-top p-1"
                  alt={plan.nombrePlan}
                />
                <div className="card-body text-center d-flex flex-column">
                  <h5 className="card-title">
                    {plan.nombrePlan.toUpperCase()}
                  </h5>
                  <div className="my-3">
                    <h4 className="fs-1 mb-0 fw-bold">
                      {formatoMoneda(plan.precio)}
                    </h4>
                    <small className="opacity-75">{detallePlan(plan)}</small>
                  </div>
                  <div className="mt-auto d-grid gap-2">
                    <a
                      href={linkWhatsapp(
                        `Hola! Me interesa el plan "${plan.nombrePlan}".`,
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
            <div class="horarios my-4">
              <h2>
                <i class="bi bi-clock me-2"></i> Horarios
              </h2>
              <div>
                <div class="d-inline-block rounded bg-warning text-dark px-3 py-2">
                  <h5 class="fw-bold">Turnos Mañana</h5>
                  <p>Lunes Miercoles y Viernes</p>
                </div>
                <p class="mt-0 font-bold">
                  8:00 a 9:00hs <br /> 9:00 a 10:00hs
                </p>
              </div>
              <div>
                <div class="d-inline-block rounded bg-warning text-dark px-5 py-2">
                  <h5 class="fw-bold">Turnos Siesta</h5>
                  <p>Lunes a Viernes</p>
                </div>
                <p class="mt-0 font-bold">
                  15:00 a 16:00hs <br /> 16:30 a 17:30hs
                </p>
              </div>
              <div>
                <div class="d-inline-block rounded bg-warning text-dark px-5 py-2">
                  <h5 class="fw-bold">Turnos Noche</h5>
                  <p>Lunes a Viernes</p>
                </div>
                <p class="my-0 font-bold">18:00 a 19:00hs</p>
                <p class="my-0 font-bold">19:30 a 20:30hs</p>
                <p class="my-0 font-bold">20:30 a 21:30hs</p>
              </div>
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
