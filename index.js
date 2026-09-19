require("dotenv").config();

const express = require("express");
const OpenAI = require("openai");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8080;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ==========================================================
// INFORMACIÓN OFICIAL
// ==========================================================

const DATOS_PAGO = {
  banco: "Banco de Venezuela",
  codigo: "0102",
  titular: "Kenny Barico",
  cedula: "20.110.298",
  telefono: "0412-8319767",

  binance: {
    id: "1125063516",
    monto: "3.5 USDT"
  },

  precio: {
    bolivares: 4450,
    binance: "3.5 USDT"
  },

  upsell: {
    bolivares: 1750
  }
};

// ==========================================================
// PROMPT DEL AGENTE
// ==========================================================

const SYSTEM_PROMPT = `
Eres Valentina Rojas, asesora de atención de
Keto sin Complicaciones.

Tu trabajo es responder dudas por WhatsApp sobre
Método KETO 28D™.

Tu personalidad es amable, cercana, clara, paciente,
respetuosa, comercial y humana.

Responde como una persona real por WhatsApp.

REGLAS DE ESTILO:

- Responde en español.
- Utiliza párrafos cortos.
- Deja una línea en blanco entre ideas.
- Usa emojis con moderación.
- Evita bloques largos de texto.
- No repitas información innecesariamente.
- No saludes nuevamente si la conversación ya comenzó.
- No hagas preguntas innecesarias.
- Responde directamente la duda del usuario.
- No uses Markdown como encabezados con símbolos #.
- No inventes enlaces, promociones, cuentas ni información.
- No inventes productos.
- No inventes precios.
- No inventes beneficios.
- No inventes garantías.
- No inventes métodos de pago.
- No inventes condiciones de entrega.
- No inventes resultados.
- No hagas promesas médicas.
- No digas espontáneamente que eres una inteligencia artificial,
  un bot o un agente automatizado.
- Si la persona pregunta directamente si la atención es automatizada,
  responde con transparencia.
- No presiones a la persona para pagar.
- Cuando respondas una pregunta concreta, no repitas todo el
  discurso de venta.
- Contesta únicamente lo necesario de manera clara, amable,
  ordenada y visual.
- Si no tienes información suficiente para responder algo,
  indica de forma natural que necesitas confirmar ese dato
  con el equipo.
- Utiliza únicamente la información oficial proporcionada
  en esta base de conocimiento.

INFORMACIÓN OFICIAL DEL NEGOCIO:

El producto principal es un producto digital llamado:

Método KETO 28D™

Es una ruta práctica organizada durante 28 días
para ayudar a la persona a organizar mejor su alimentación,
tener más variedad en sus comidas,
reducir la improvisación diaria
y desarrollar hábitos más sostenibles.

El cliente recibe:

Método KETO 28D™ completo

más 9 regalos digitales:

1. 11 Recetas Keto
2. Cómo Empezar Keto
3. Keto Postres
4. Dieta Keto 2026
5. Recetario Keto Entre Amigos
6. Keto para Principiantes
7. Estrategia y Hábitos
8. Fin de Semana Keto Parrilla
9. Guía y Cuaderno Práctico para llevar el control
   del progreso Keto 28D

El precio oficial es:

- Bs. 4.450 por Pago Móvil.
- 3.5 USDT por Binance.

La persona puede realizar su pago mediante:

- Pago Móvil.
- Binance.

DATOS PARA PAGO MÓVIL:

Banco: Banco de Venezuela
Código: 0102
Titular: Kenny Barico
C.I.: 20.110.298
Teléfono: 0412-8319767

DATOS PARA BINANCE:

Binance ID: 1125063516
Monto: 3.5 USDT

También existe un código QR de Binance que se utiliza
dentro del flujo de WhatsApp.

Nunca inventes un código QR diferente.

ENTREGA:

Método KETO 28D™ es 100% digital.

Después de realizar el pago,
la persona debe enviar su comprobante
por este mismo WhatsApp.

Una vez confirmado el pago,
el acceso se libera de inmediato.

El contenido se entrega mediante un enlace de Google Drive.

El cliente puede acceder desde su teléfono,
tablet o computadora.

El acceso es de por vida.

Los 28 días corresponden a la estructura del método,
no al tiempo durante el cual el cliente puede utilizarlo.

SALUD Y RESULTADOS:

Método KETO 28D™ puede ayudar a la persona a organizar
mejor su alimentación, tener mayor variedad,
desarrollar hábitos más conscientes
y apoyar objetivos relacionados con control de peso.

Los resultados pueden variar de una persona a otra.

Nunca prometas:

- Una cantidad específica de kilos.
- Resultados garantizados.
- Resultados médicos.
- Curación de enfermedades.
- Control de enfermedades.
- Reversión de diabetes.
- Reversión de hipertensión.
- Sustitución de medicamentos o tratamientos.

Si una persona menciona diabetes,
hipertensión,
insulina,
medicamentos
o alguna condición diagnosticada,
explica de manera natural que puede utilizar
el método como una guía práctica de apoyo,
pero que cualquier cambio importante en su alimentación
debe adaptarlo junto al profesional de salud
que conoce su caso.

PRINCIPIANTES:

No es necesario tener experiencia previa.

Método KETO 28D™ está diseñado para que una persona
pueda comenzar aunque nunca haya seguido este tipo
de alimentación.

Dentro de los regalos se incluyen:

Cómo Empezar Keto

y

Keto para Principiantes.

ACCESO:

El acceso es de por vida.

Después de terminar los 28 días,
la persona puede seguir consultando,
repitiendo recetas
y utilizando todas las guías cuando lo necesite.

SOPORTE:

Si la persona ya realizó el pago
pero todavía no recibió su producto,
puede existir un pequeño retraso
de conexión o validación.

En ese caso debe responder con la palabra:

LISTO

para llevar el caso a revisión manual.

No debe realizar un segundo pago.

PACK COMPLEMENTARIO:

Después de adquirir Método KETO 28D™
existe un complemento opcional llamado:

Pack Complementario KETO 28D™

Incluye exactamente:

- Complemento Método KETO 28D™
- Salsas y Postres KETO 28D™

Los dos se venden juntos como un solo pack.

Precio:

Bs. 1.750

Este pack es opcional.

No es necesario adquirirlo para recibir
Método KETO 28D™ ni los 9 regalos.

No existe todavía un precio oficial confirmado
en USDT para este complemento.

Si alguien pregunta su precio por Binance,
indica que ese dato debe confirmarse con el equipo.

OBJETIVO DE LA CONVERSACIÓN:

Primero responde la duda real de la persona.

Cuando exista intención clara de compra,
dirige naturalmente a elegir entre:

Pago Móvil

o

Binance.

No agregues mensajes de pago
cuando la persona solamente está saludando.

No pidas comprobante
si la persona todavía no ha indicado
que realizó el pago.

Si ya eligió Pago Móvil,
envía únicamente los datos de Pago Móvil.

Si ya eligió Binance,
envía únicamente los datos de Binance.
`;

// ==========================================================
// FUNCIONES GENERALES
// ==========================================================

function normalizarTexto(valor) {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[¿?¡!.,;:()[\]{}"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function contieneAlguna(texto, frases) {
  return frases.some((frase) => texto.includes(frase));
}

function elegirAleatoria(opciones) {
  return opciones[
    Math.floor(Math.random() * opciones.length)
  ];
}

function limpiarRespuesta(valor) {
  return String(valor ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ==========================================================
// MENSAJES REUTILIZABLES
// ==========================================================

function cierrePago() {
  return [
    "🥑 Puedes adquirir Método KETO 28D™ mediante:",
    "",
    "📲 Pago Móvil",
    "🟡 Binance",
    "",
    "¿Cuál opción prefieres? 😊"
  ].join("\n");
}

function agregarCierre(respuesta) {
  const respuestaLimpia = limpiarRespuesta(respuesta);

  if (!respuestaLimpia) {
    return cierrePago();
  }

  const normalizada =
    normalizarTexto(respuestaLimpia);

  const yaIncluyeCierre =
    normalizada.includes("cual opcion prefieres") ||
    (
      normalizada.includes("pago movil") &&
      normalizada.includes("binance")
    );

  if (yaIncluyeCierre) {
    return respuestaLimpia;
  }

  return `${respuestaLimpia}\n\n${cierrePago()}`;
}

function respuestaCuenta() {
  return [
    "Claro 😊 Estos son los datos para realizar tu Pago Móvil:",
    "",
    `🏦 Banco: ${DATOS_PAGO.banco}`,
    `🔢 Código: ${DATOS_PAGO.codigo}`,
    `👤 Titular: ${DATOS_PAGO.titular}`,
    `🪪 C.I.: ${DATOS_PAGO.cedula}`,
    `📲 Teléfono: ${DATOS_PAGO.telefono}`,
    "",
    `💰 Monto: Bs. ${DATOS_PAGO.precio.bolivares.toLocaleString("es-VE")}`,
    "",
    "Cuando realices el pago, envíame aquí la imagen del comprobante.",
    "",
    "Una vez confirmado, liberamos de inmediato tu Método KETO 28D™ + los 9 regalos digitales 🥑💚"
  ].join("\n");
}

function respuestaPagoPosterior() {
  return [
    "Claro 😊 No hay problema.",
    "",
    "Cuando estés listo para continuar con tu compra, puedes escribirnos nuevamente por este mismo WhatsApp.",
    "",
    `El valor de Método KETO 28D™ + los 9 regalos es Bs. ${DATOS_PAGO.precio.bolivares.toLocaleString("es-VE")} o ${DATOS_PAGO.precio.binance} por Binance. 🥑💚`
  ].join("\n");
}

function respuestaOxxo() {
  return [
    "Claro 😊 También puedes realizar tu pago mediante Binance.",
    "",
    `💰 Monto: ${DATOS_PAGO.binance.monto}`,
    `🟡 Binance ID: ${DATOS_PAGO.binance.id}`,
    "",
    "También puedes escanear el código QR de Binance que te mostramos dentro del flujo 📲",
    "",
    "Cuando termines, envíame aquí la imagen del comprobante.",
    "",
    "Una vez confirmado, liberamos tu Método KETO 28D™ + los 9 regalos digitales 🥑🎁"
  ].join("\n");
}

function respuestaReligion() {
  return [
    "Método KETO 28D™ está diseñado para ayudarte a organizar mejor tu alimentación durante 28 días 🥑💚",
    "",
    "Incluye recetas, ideas prácticas, orientación y recursos para que tengas más variedad y no tengas que improvisar cada día.",
    "",
    "Además recibes 9 regalos digitales que complementan el método."
  ].join("\n");
}

function respuestaEntrega() {
  return [
    "Método KETO 28D™ es completamente digital 📲✨",
    "",
    "Una vez realizado y confirmado el pago, recibes de inmediato por este mismo WhatsApp un enlace de Google Drive.",
    "",
    "Desde allí podrás acceder al Método KETO 28D™ completo + tus 9 regalos digitales desde tu teléfono, tablet o computadora. 🥑💚"
  ].join("\n");
}

function respuestaPrecio() {
  return [
    "Método KETO 28D™ completo + los 9 regalos digitales tiene un valor de:",
    "",
    `📲 Bs. ${DATOS_PAGO.precio.bolivares.toLocaleString("es-VE")} por Pago Móvil`,
    `🟡 ${DATOS_PAGO.precio.binance} por Binance`,
    "",
    "Todo es 100% digital y el acceso es de por vida. 💚",
    "",
    cierrePago()
  ].join("\n");
}

// ==========================================================
// RESPUESTAS ADICIONALES DE LA BASE DE CONOCIMIENTO
// ==========================================================

function respuestaSaludo() {
  return elegirAleatoria([
    "¡Hola! 😊 Qué gusto saludarte. ¿En qué puedo ayudarte con Método KETO 28D™? 🥑",
    "¡Hola! 👋💚 Claro, estoy aquí para ayudarte. ¿Qué deseas saber sobre Método KETO 28D™?",
    "¡Hola! 😊 Cuéntame, ¿qué deseas saber sobre Método KETO 28D™?"
  ]);
}

function respuestaCompra() {
  return [
    "Claro 😊",
    "",
    "Puedes adquirir Método KETO 28D™ completo + los 9 regalos digitales por:",
    "",
    `📲 Bs. ${DATOS_PAGO.precio.bolivares.toLocaleString("es-VE")} por Pago Móvil`,
    `🟡 ${DATOS_PAGO.precio.binance} por Binance`,
    "",
    "Todo es 100% digital y se entrega inmediatamente después de confirmar el pago.",
    "",
    "¿Prefieres Pago Móvil o Binance? 🥑💚"
  ].join("\n");
}

function respuestaContenido() {
  return [
    "Al adquirir Método KETO 28D™ recibes el método principal completo y además 9 regalos digitales 🎁:",
    "",
    "🎁 11 Recetas Keto",
    "🎁 Cómo Empezar Keto",
    "🎁 Keto Postres",
    "🎁 Dieta Keto 2026",
    "🎁 Recetario Keto Entre Amigos",
    "🎁 Keto para Principiantes",
    "🎁 Estrategia y Hábitos",
    "🎁 Fin de Semana Keto Parrilla",
    "🎁 Guía y Cuaderno Práctico para llevar el control del progreso Keto 28D",
    "",
    "La idea es que tengas más recetas, variedad, orientación y herramientas prácticas para acompañarte durante todo el proceso. 🥑💚"
  ].join("\n");
}

function respuestaTiempoEntrega() {
  return [
    "La entrega es inmediata 😊",
    "",
    "Una vez que realizas el pago, envías el comprobante y confirmamos la compra, recibes por WhatsApp el enlace de Google Drive con Método KETO 28D™ + tus 9 regalos."
  ].join("\n");
}

function respuestaAccesoVida() {
  return [
    "Sí 😊 El acceso es de por vida.",
    "",
    "Los 28 días corresponden a la estructura del método, pero todo el material queda contigo para que puedas volver a consultar recetas, guías y recursos cuando lo necesites. 🥑💚"
  ].join("\n");
}

function respuestaPrincipiante() {
  return [
    "No necesitas experiencia previa 😊",
    "",
    "Método KETO 28D™ está pensado para que puedas comenzar aunque nunca hayas seguido este tipo de alimentación.",
    "",
    "Además, dentro de tus regalos tienes Cómo Empezar Keto y Keto para Principiantes para ayudarte desde el inicio. 🥑💚"
  ].join("\n");
}

function respuestaSaludPeso() {
  return [
    "Método KETO 28D™ puede ayudarte a organizar mejor tu alimentación y apoyar objetivos relacionados con el control de peso y la adopción de hábitos más saludables. 🥑💚",
    "",
    "Los resultados pueden variar de una persona a otra, por eso no prometemos una cantidad específica de kilos ni resultados médicos."
  ].join("\n");
}

function respuestaCondicionSalud() {
  return [
    "Claro 😊 Puedes utilizar Método KETO 28D™ como una guía práctica para organizar mejor tus comidas, incorporar nuevas recetas y trabajar hábitos de alimentación de forma más consciente.",
    "",
    "Si tienes diabetes, hipertensión, utilizas insulina, medicamentos o tienes alguna condición diagnosticada, lo recomendable es adaptar cualquier cambio importante en tu alimentación junto al profesional de salud que conoce tu caso. 💚"
  ].join("\n");
}

function respuestaNoRecibio() {
  return [
    "No te preocupes 😊",
    "",
    "Si ya realizaste el pago y todavía no recibes tu acceso, puede tratarse de un pequeño retraso de conexión o validación.",
    "",
    "Responde con la palabra LISTO para que podamos revisar manualmente tu comprobante y ayudarte a liberar el acceso.",
    "",
    "No necesitas volver a pagar. 💚"
  ].join("\n");
}

function respuestaListo() {
  return [
    "Perfecto 😊",
    "",
    "Vamos a revisar manualmente tu comprobante y verificar la liberación de tu acceso.",
    "",
    "Si todavía no has enviado la imagen del comprobante, déjala por este mismo chat. 💚"
  ].join("\n");
}

function respuestaUpsell() {
  return [
    "Sí 😊 Después de adquirir Método KETO 28D™ existe un complemento opcional:",
    "",
    "🔥 Pack Complementario KETO 28D™",
    "",
    "Incluye los 2 complementos juntos:",
    "",
    "🍽️ Complemento Método KETO 28D™",
    "🍰 Salsas y Postres KETO 28D™",
    "",
    `💰 Precio: Bs. ${DATOS_PAGO.upsell.bolivares.toLocaleString("es-VE")}`,
    "",
    "Es totalmente opcional y no afecta tu acceso al método principal ni a tus 9 regalos. 💚"
  ].join("\n");
}

// ==========================================================
// RESPUESTAS DIRECTAS
// ==========================================================

function respuestaDirecta(mensajeOriginal) {
  const texto =
    normalizarTexto(mensajeOriginal);

  if (!texto) {
    return null;
  }

  // --------------------------------------------------------
  // SALUDO
  // --------------------------------------------------------

  const preguntaSaludo =
    texto === "hola" ||
    texto === "holaa" ||
    texto === "holaaa" ||
    texto === "buenas" ||
    texto === "buenos dias" ||
    texto === "buenas tardes" ||
    texto === "buenas noches";

  if (preguntaSaludo) {
    return respuestaSaludo();
  }

  // --------------------------------------------------------
  // LISTO / REVISIÓN MANUAL
  // --------------------------------------------------------

  if (texto === "listo") {
    return respuestaListo();
  }

  // --------------------------------------------------------
  // PAGAR DESPUÉS
  // Debe evaluarse antes de la intención genérica de pago.
  // --------------------------------------------------------

  const preguntaPagoPosterior =
    contieneAlguna(texto, [
      "pagar despues",
      "pago despues",
      "hacerlo despues",
      "puedo hacerlo despues",
      "puedo pagar manana",
      "pagar manana",
      "pago manana",
      "lo hago manana",
      "mas tarde",
      "otro dia",
      "la proxima semana"
    ]) ||
    texto === "despues" ||
    texto === "manana";

  if (preguntaPagoPosterior) {
    return respuestaPagoPosterior();
  }

  // --------------------------------------------------------
  // PAGO REALIZADO SIN ENTREGA
  // --------------------------------------------------------

  const preguntaNoRecibio =
    contieneAlguna(texto, [
      "ya pague y no",
      "pague y no",
      "ya hice el pago",
      "ya envie el comprobante",
      "envie el comprobante",
      "no me llego",
      "no he recibido",
      "todavia no recibo",
      "no recibi el producto",
      "no recibi el metodo",
      "no tengo acceso"
    ]);

  if (preguntaNoRecibio) {
    return respuestaNoRecibio();
  }

  // --------------------------------------------------------
  // DATOS PAGO MÓVIL
  // --------------------------------------------------------

  const preguntaCuenta =
    contieneAlguna(texto, [
      "pago movil",
      "datos pago movil",
      "datos del pago movil",
      "numero para pagar",
      "numero pago movil",
      "datos bancarios",
      "datos de pago",
      "banco de venezuela",
      "codigo 0102",
      "cedula para pagar",
      "telefono para pagar"
    ]) ||
    texto === "pago movil" ||
    texto === "movil";

  if (preguntaCuenta) {
    return respuestaCuenta();
  }

  // --------------------------------------------------------
  // BINANCE
  // --------------------------------------------------------

  const preguntaOxxo =
    contieneAlguna(texto, [
      "binance",
      "binans",
      "binanse",
      "binnance",
      "vinas",
      "usdt",
      "pagar por binance",
      "pago por binance",
      "como pago por binance",
      "binance id",
      "id de binance",
      "qr de binance",
      "codigo qr"
    ]) ||
    texto === "binance" ||
    texto === "binans" ||
    texto === "vinas";

  if (preguntaOxxo) {
    return respuestaOxxo();
  }

  // --------------------------------------------------------
  // CONDICIÓN DE SALUD
  // --------------------------------------------------------

  if (
    contieneAlguna(texto, [
      "diabetes",
      "diabetico",
      "diabetica",
      "azucar alta",
      "hipertension",
      "presion alta",
      "insulina",
      "medicamentos",
      "medicamento",
      "tratamiento",
      "condicion de salud",
      "enfermedad"
    ])
  ) {
    return respuestaCondicionSalud();
  }

  // --------------------------------------------------------
  // PRINCIPIANTE
  // --------------------------------------------------------

  if (
    contieneAlguna(texto, [
      "principiante",
      "soy nuevo",
      "soy nueva",
      "nunca he hecho keto",
      "nunca hice keto",
      "como empezar",
      "puedo empezar",
      "sin experiencia",
      "primera vez",
      "desde cero"
    ])
  ) {
    return respuestaPrincipiante();
  }

  // --------------------------------------------------------
  // ACCESO DE POR VIDA
  // --------------------------------------------------------

  if (
    contieneAlguna(texto, [
      "de por vida",
      "para siempre",
      "se vence",
      "vence",
      "caduca",
      "cuanto dura el acceso",
      "solo 28 dias",
      "despues de 28 dias",
      "acceso permanente",
      "puedo guardarlo"
    ])
  ) {
    return respuestaAccesoVida();
  }

  // --------------------------------------------------------
  // ENTREGA, DIGITAL O GOOGLE DRIVE
  // --------------------------------------------------------

  if (
    contieneAlguna(texto, [
      "es fisico",
      "producto fisico",
      "formato fisico",
      "es digital",
      "producto digital",
      "como lo recibo",
      "donde lo recibo",
      "como se entrega",
      "google drive",
      "drive",
      "link",
      "enlace",
      "por whatsapp"
    ])
  ) {
    return respuestaEntrega();
  }

  // --------------------------------------------------------
  // TIEMPO DE ENTREGA
  // --------------------------------------------------------

  if (
    contieneAlguna(texto, [
      "cuanto tarda",
      "cuanto demora",
      "cuando llega",
      "cuando recibo",
      "en cuanto tiempo",
      "tiempo de entrega",
      "entrega inmediata"
    ])
  ) {
    return respuestaTiempoEntrega();
  }

  // --------------------------------------------------------
  // SALUD O PESO
  // --------------------------------------------------------

  if (
    contieneAlguna(texto, [
      "bajar de peso",
      "adelgazar",
      "perder peso",
      "control de peso",
      "mejorar mi salud",
      "resultados",
      "funciona",
      "habitos saludables",
      "bienestar"
    ])
  ) {
    return respuestaSaludPeso();
  }

  // --------------------------------------------------------
  // CONTENIDO
  // --------------------------------------------------------

  if (
    contieneAlguna(texto, [
      "que incluye",
      "que trae",
      "que recibo",
      "contenido",
      "bonos",
      "regalos",
      "material",
      "que contiene",
      "que viene"
    ])
  ) {
    return respuestaContenido();
  }

  // --------------------------------------------------------
  // UPSELL / COMPLEMENTO
  // --------------------------------------------------------

  if (
    contieneAlguna(texto, [
      "pack complementario",
      "complemento keto",
      "complemento metodo",
      "salsas y postres",
      "upsell",
      "producto adicional",
      "otro producto"
    ])
  ) {
    return respuestaUpsell();
  }

  // --------------------------------------------------------
  // INTENCIÓN DE COMPRA
  // --------------------------------------------------------

  if (
    contieneAlguna(texto, [
      "quiero comprar",
      "quiero adquirir",
      "quiero el metodo",
      "quiero el megapack",
      "quiero comprar el megapack",
      "quiero comprar metodo keto",
      "me interesa comprar",
      "como compro",
      "como comprar",
      "deseo comprar",
      "lo quiero"
    ])
  ) {
    return respuestaCompra();
  }

  // --------------------------------------------------------
  // PRECIO O MONTO
  // --------------------------------------------------------

  if (
    contieneAlguna(texto, [
      "cuanto cuesta",
      "cuanto vale",
      "que precio",
      "precio",
      "costo",
      "cuanto pago",
      "cuanto debo pagar",
      "valor",
      "cantidad",
      "formas de pago",
      "metodos de pago"
    ])
  ) {
    return respuestaPrecio();
  }

  return null;
}

// ==========================================================
// RUTAS
// ==========================================================

app.get("/", (req, res) => {
  return res
    .status(200)
    .send("Bot ventas activo ✅");
});

app.post("/mensaje", async (req, res) => {
  try {
    const mensaje =
      req.body?.texto ??
      req.body?.mensaje ??
      req.body?.message ??
      "";

    const textoUsuario =
      String(mensaje).trim();

    console.log(
      "Mensaje recibido:",
      textoUsuario
        ? "[contenido recibido]"
        : "[vacío]"
    );

    if (!textoUsuario) {
      return res.json({
        respuesta: [
          "Estoy aquí para ayudarte 😊",
          "",
          "Puedes escribirme tu duda sobre Método KETO 28D™, el contenido, la entrega o las formas de pago 🥑"
        ].join("\n")
      });
    }

    const directa =
      respuestaDirecta(textoUsuario);

    if (directa) {
      const respuestaFinal =
        limpiarRespuesta(directa);

      console.log(
        "Respuesta directa enviada:",
        respuestaFinal
      );

      return res.json({
        respuesta: respuestaFinal
      });
    }

    const response =
      await openai.responses.create({
        model: "gpt-4.1-mini",

        temperature: 0.4,

        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text: SYSTEM_PROMPT
              }
            ]
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: textoUsuario
              }
            ]
          }
        ]
      });

    const respuestaIA =
      response.output_text || "";

    /*
      IMPORTANTE:
      Conservamos el mismo flujo del índice original,
      pero NO agregamos automáticamente un cierre de pago
      a cualquier respuesta abierta.

      Esto evita que "Hola" o una pregunta normal
      terminen mostrando un mensaje de pago/comprobante.
    */

    const respuestaFinal =
      limpiarRespuesta(respuestaIA);

    console.log(
      "Respuesta enviada:",
      respuestaFinal
    );

    return res.json({
      respuesta:
        respuestaFinal ||
        "Con gusto te ayudo 😊 Escríbeme tu duda sobre Método KETO 28D™."
    });

  } catch (error) {
    console.error(
      "Error en /mensaje:",
      error
    );

    return res.json({
      respuesta: [
        "En este momento tuve un pequeño inconveniente para procesar tu mensaje 😊",
        "",
        "Por favor, inténtalo nuevamente en unos minutos."
      ].join("\n")
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `Servidor corriendo en puerto ${PORT}`
  );
});
