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
    nombre: "Pack Complementario KETO 28D™",
    precioBolivares: 1750
  }
};

// ==========================================================
// PROMPT DEL AGENTE
// ==========================================================

const SYSTEM_PROMPT = `
Eres Valentina Rojas, asesora de Keto sin Complicaciones.

Tu trabajo es responder dudas por WhatsApp sobre
Método KETO 28D™.

Tu personalidad es amable, cercana, clara, paciente,
respetuosa, comercial y humana.

Responde como una persona real por WhatsApp.

REGLAS DE ESTILO:

- Responde en español.
- Utiliza párrafos cortos.
- Deja una línea en blanco entre ideas cuando sea útil.
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
- No inventes métodos de pago.
- No inventes garantías.
- No inventes resultados.
- No inventes condiciones de entrega.
- No hagas promesas médicas.
- No digas espontáneamente que eres una inteligencia artificial.
- Si la persona pregunta directamente si la atención es automatizada,
  responde con transparencia.
- No presiones a la persona para pagar.
- No menciones pago ni comprobante si la persona solo está saludando.
- No repitas el discurso de venta completo cuando la persona
  hace una pregunta concreta.
- Utiliza únicamente la información oficial de esta base.
- Si no tienes información suficiente, indica de manera natural
  que necesitas confirmar ese dato con el equipo.

INFORMACIÓN OFICIAL DEL NEGOCIO:

El producto principal es:

Método KETO 28D™

Es un producto 100% digital.

Está estructurado como una ruta práctica de 28 días
para ayudar a la persona a organizar mejor su alimentación,
tener más variedad en sus comidas,
reducir la improvisación diaria
y trabajar hábitos más sostenibles.

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

PRECIO OFICIAL:

- Bs. 4.450 por Pago Móvil.
- 3.5 USDT por Binance.

MÉTODOS DE PAGO:

- Pago Móvil.
- Binance.

DATOS DE PAGO MÓVIL:

Banco: Banco de Venezuela
Código: 0102
Titular: Kenny Barico
C.I.: 20.110.298
Teléfono: 0412-8319767

DATOS DE BINANCE:

Binance ID: 1125063516
Monto: 3.5 USDT

También existe un código QR de Binance
que se utiliza dentro del flujo de WhatsApp.

Nunca inventes un QR diferente.

ENTREGA:

Método KETO 28D™ es 100% digital.

Una vez que la persona realiza el pago
y envía el comprobante,
se valida la compra.

Después de la validación,
el acceso se libera de inmediato.

El contenido se entrega mediante
un enlace de Google Drive enviado por WhatsApp.

Puede utilizarse desde teléfono,
tablet o computadora.

ACCESO:

El acceso es de por vida.

Los 28 días corresponden a la estructura del método,
no al tiempo de acceso.

Después de completar los 28 días,
el cliente puede seguir consultando las recetas,
guías y materiales cuando lo necesite.

PRINCIPIANTES:

No es necesario tener experiencia previa.

Método KETO 28D™ está pensado para que una persona
pueda comenzar aunque nunca haya seguido
este tipo de alimentación.

Dentro de sus regalos tiene:

Cómo Empezar Keto

y

Keto para Principiantes.

SALUD Y RESULTADOS:

Método KETO 28D™ puede apoyar una mejor organización
de la alimentación,
la construcción de hábitos más conscientes
y objetivos relacionados con el control de peso.

Los resultados varían de una persona a otra.

Nunca prometas:

- kilos específicos
- resultados garantizados
- resultados médicos
- curación de enfermedades
- reversión de enfermedades
- sustitución de tratamientos
- sustitución de medicamentos

Si una persona menciona:

- diabetes
- hipertensión
- insulina
- medicamentos
- tratamiento
- alguna condición diagnosticada

explica de forma natural que puede utilizar
el método como una guía práctica de apoyo,
pero que cualquier cambio importante en su alimentación
debería adaptarlo junto con el profesional de salud
que conoce su caso.

SOPORTE:

Si la persona ya realizó el pago
pero todavía no recibió su acceso,
puede existir un pequeño retraso
de conexión o validación.

En ese caso debe responder:

LISTO

para llevar el caso a revisión manual.

No debe realizar otro pago.

PACK COMPLEMENTARIO:

Después de adquirir el producto principal
existe un complemento opcional llamado:

Pack Complementario KETO 28D™

Incluye exactamente:

1. Complemento Método KETO 28D™
2. Salsas y Postres KETO 28D™

Los dos se venden juntos en un solo pack.

Precio:

Bs. 1.750

Este complemento es opcional.

No es necesario adquirirlo para recibir
Método KETO 28D™ ni los 9 regalos.

No existe un precio oficial confirmado en USDT
para el Pack Complementario.

Si preguntan el precio del complemento por Binance,
indica que necesitas confirmar ese dato con el equipo.

OBJETIVO:

Primero responde la duda real del cliente.

Cuando exista intención clara de compra,
puedes dirigir naturalmente a la persona
a elegir entre:

Pago Móvil

o

Binance.

No agregues una invitación de pago
a todas las respuestas.

No pidas comprobante
si la persona todavía no ha realizado el pago.

Si ya eligió Pago Móvil,
envía solamente los datos de Pago Móvil.

Si ya eligió Binance,
envía solamente los datos de Binance.
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
    "🥑 Para adquirir Método KETO 28D™ puedes elegir:",
    "",
    "📲 Pago Móvil",
    "🟡 Binance",
    "",
    "¿Cuál opción prefieres? 😊"
  ].join("\n");
}

function agregarCierre(respuesta, mensajeOriginal = "") {
  const respuestaLimpia =
    limpiarRespuesta(respuesta);

  if (!respuestaLimpia) {
    return respuestaLimpia;
  }

  const texto =
    normalizarTexto(mensajeOriginal);

  const intencionCompra =
    contieneAlguna(texto, [
      "quiero comprar",
      "quiero adquirir",
      "quiero el metodo",
      "quiero el megapack",
      "me interesa comprar",
      "como compro",
      "como comprar",
      "quiero pagarlo",
      "lo quiero",
      "deseo comprar"
    ]);

  if (!intencionCompra) {
    return respuestaLimpia;
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
    "Perfecto 😊 Estos son los datos para realizar tu Pago Móvil:",
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
    "Cuando quieras continuar con tu compra, puedes escribirnos nuevamente por este mismo WhatsApp.",
    "",
    `Método KETO 28D™ + los 9 regalos tiene un valor de Bs. ${DATOS_PAGO.precio.bolivares.toLocaleString("es-VE")} o ${DATOS_PAGO.precio.binance} por Binance. 🥑💚`
  ].join("\n");
}

function respuestaOxxo() {
  return [
    "Perfecto 💛 Puedes realizar tu pago por Binance:",
    "",
    `💰 Monto: ${DATOS_PAGO.binance.monto}`,
    `🟡 Binance ID: ${DATOS_PAGO.binance.id}`,
    "",
    "También puedes utilizar el código QR de Binance que aparece dentro del flujo 📲",
    "",
    "Cuando termines, envíame aquí la imagen del comprobante.",
    "",
    "Una vez confirmado, liberamos tu Método KETO 28D™ + los 9 regalos digitales 🥑🎁"
  ].join("\n");
}

function respuestaReligion() {
  return [
    "Método KETO 28D™ es una ruta práctica de 28 días pensada para ayudarte a organizar mejor tus comidas, tener más variedad y reducir la improvisación diaria 🥑💚",
    "",
    "Además del método principal, recibes 9 regalos digitales con recetas, guías y recursos que complementan tu proceso."
  ].join("\n");
}

function respuestaEntrega() {
  return [
    "Método KETO 28D™ es completamente digital 📲✨",
    "",
    "Una vez realizado y confirmado el pago, recibes de inmediato por este mismo WhatsApp un enlace de Google Drive.",
    "",
    "Desde allí podrás acceder al Método KETO 28D™ completo + tus 9 regalos desde tu teléfono, tablet o computadora. 🥑💚"
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
    return elegirAleatoria([
      "¡Hola! 😊 Qué gusto saludarte. ¿En qué puedo ayudarte con Método KETO 28D™? 🥑",
      "¡Hola! 👋💚 Claro, estoy aquí para ayudarte. ¿Qué deseas saber sobre Método KETO 28D™?",
      "¡Hola! 😊 Cuéntame, ¿qué deseas saber sobre Método KETO 28D™?"
    ]);
  }

  // --------------------------------------------------------
  // LISTO
  // --------------------------------------------------------

  if (texto === "listo") {
    return [
      "Perfecto 😊",
      "",
      "Vamos a revisar manualmente tu comprobante para verificar el pago y la liberación de tu acceso.",
      "",
      "Si todavía no has enviado la imagen del comprobante, déjala por este mismo chat. 💚"
    ].join("\n");
  }

  // --------------------------------------------------------
  // PAGAR DESPUÉS
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
  // PAGO REALIZADO PERO NO RECIBIDO
  // --------------------------------------------------------

  const preguntaPagoSinEntrega =
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

  if (preguntaPagoSinEntrega) {
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

  // --------------------------------------------------------
  // DATOS PAGO MÓVIL
  // --------------------------------------------------------

  const preguntaCuenta =
    contieneAlguna(texto, [
      "pago movil",
      "datos pago movil",
      "datos del pago movil",
      "numero pago movil",
      "numero para pagar",
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
  // SALUD
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
    return [
      "Claro 😊 Puedes utilizar Método KETO 28D™ como una guía práctica para organizar mejor tus comidas, incorporar nuevas recetas y trabajar hábitos de alimentación de forma más consciente.",
      "",
      "Si tienes diabetes, hipertensión, utilizas insulina, medicamentos o tienes alguna condición diagnosticada, lo recomendable es adaptar cualquier cambio importante en tu alimentación junto con el profesional de salud que conoce tu caso. 💚"
    ].join("\n");
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
    return [
      "No necesitas experiencia previa 😊",
      "",
      "Método KETO 28D™ está pensado para que puedas comenzar aunque nunca hayas seguido este tipo de alimentación.",
      "",
      "Además, dentro de tus regalos tienes Cómo Empezar Keto y Keto para Principiantes para ayudarte desde el inicio. 🥑💚"
    ].join("\n");
  }

  // --------------------------------------------------------
  // ACCESO
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
    return [
      "Sí 😊 El acceso es de por vida.",
      "",
      "Los 28 días corresponden a la estructura del método, pero todo el material queda contigo para que puedas volver a consultar recetas, guías y recursos cuando lo necesites. 🥑💚"
    ].join("\n");
  }

  // --------------------------------------------------------
  // ENTREGA
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
      "por whatsapp",
      "link",
      "enlace"
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
    return [
      "La entrega es inmediata 😊",
      "",
      "Una vez que realizas el pago, envías el comprobante y confirmamos la compra, recibes por WhatsApp el enlace de Google Drive con Método KETO 28D™ + tus 9 regalos."
    ].join("\n");
  }

  // --------------------------------------------------------
  // PESO / RESULTADOS
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
    return [
      "Método KETO 28D™ puede ayudarte a organizar mejor tu alimentación y apoyar objetivos relacionados con el control de peso y la adopción de hábitos más saludables. 🥑💚",
      "",
      "Los resultados pueden variar de una persona a otra, por eso no prometemos una cantidad específica de kilos ni resultados médicos."
    ].join("\n");
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

  // --------------------------------------------------------
  // PACK COMPLEMENTARIO
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
    return [
      "Sí 😊 Después de adquirir Método KETO 28D™ existe un complemento opcional:",
      "",
      "🔥 Pack Complementario KETO 28D™",
      "",
      "Incluye:",
      "",
      "🍽️ Complemento Método KETO 28D™",
      "🍰 Salsas y Postres KETO 28D™",
      "",
      `💰 Los dos juntos por Bs. ${DATOS_PAGO.upsell.precioBolivares.toLocaleString("es-VE")}`,
      "",
      "Es totalmente opcional y no afecta tu acceso al método principal ni a tus 9 regalos. 💚"
    ].join("\n");
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
      "lo quiero",
      "quiero pagarlo"
    ])
  ) {
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

  // --------------------------------------------------------
  // PRECIO
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

  // --------------------------------------------------------
  // INFORMACIÓN GENERAL
  // --------------------------------------------------------

  if (
    contieneAlguna(texto, [
      "que es",
      "de que trata",
      "como funciona",
      "informacion del metodo",
      "informacion",
      "quiero informacion"
    ])
  ) {
    return respuestaReligion();
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

    const respuestaFinal =
      agregarCierre(
        respuestaIA,
        textoUsuario
      );

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
