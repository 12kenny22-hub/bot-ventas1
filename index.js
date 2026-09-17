require("dotenv").config();

const express = require("express");
const OpenAI = require("openai");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ==========================================================
// INFORMACIÓN OFICIAL DEL NEGOCIO
// ==========================================================

const NEGOCIO = {
  nombre: "Keto sin Complicaciones",
  agente: "Valentina Rojas",
  producto: "Método KETO 28D™",
  tipo: "Producto digital",
  precioBolivares: 4450,
  precioBinance: "3.5 USDT",
  entrega: "Inmediata después de validar el pago y recibir el comprobante",
  canalEntrega: "Enlace de Google Drive enviado por WhatsApp",
  acceso: "De por vida",

  upsell: {
    nombre: "Pack Complementario KETO 28D™",
    precioBolivares: 1750,
    productos: [
      "Complemento Método KETO 28D™",
      "Salsas y Postres KETO 28D™",
    ],
  },
};

const DATOS_PAGO = {
  pagoMovil: {
    banco: "Banco de Venezuela",
    codigoBanco: "0102",
    titular: "Kenny Barico",
    cedula: "20.110.298",
    telefono: "0412-8319767",
  },

  binance: {
    id: "1125063516",
    monto: "3.5 USDT",
  },
};

const REGALOS = [
  "11 Recetas Keto",
  "Cómo Empezar Keto",
  "Keto Postres",
  "Dieta Keto 2026",
  "Recetario Keto Entre Amigos",
  "Keto para Principiantes",
  "Estrategia y Hábitos",
  "Fin de Semana Keto Parrilla",
  "Guía y Cuaderno Práctico para llevar el control del progreso Keto 28D",
];

// ==========================================================
// SYSTEM PROMPT
// ==========================================================

const SYSTEM_PROMPT = `
Atiendes las conversaciones de WhatsApp de ${NEGOCIO.nombre}
usando el nombre de atención ${NEGOCIO.agente}.

Tu trabajo es responder dudas sobre ${NEGOCIO.producto}
de forma natural, breve, clara, cálida y comercial.

Debes responder como una atención humana de WhatsApp,
sin sonar robótico.

REGLAS DE ESTILO:

- Responde siempre en español.
- Usa lenguaje natural de WhatsApp.
- Mantén las respuestas breves.
- Normalmente responde en 1 o 2 párrafos cortos.
- Usa emojis con moderación.
- No saludes nuevamente si la conversación ya comenzó.
- No repitas información innecesariamente.
- No copies discursos largos si el cliente hizo una pregunta concreta.
- Responde directamente lo que la persona está preguntando.
- No hagas preguntas abiertas innecesarias.
- No presiones a la persona.
- No uses Markdown con encabezados tipo #.
- No inventes información.
- No inventes precios.
- No inventes métodos de pago.
- No inventes garantías.
- No inventes promociones.
- No inventes resultados.
- No inventes condiciones médicas.
- No inventes enlaces.
- No inventes datos bancarios.
- No inventes información sobre los bonos.
- No te presentes espontáneamente como inteligencia artificial,
  bot o agente automatizado.
- Si la persona pregunta directamente si la atención es automatizada,
  responde con transparencia y continúa ayudándola.
- Utiliza únicamente la información oficial incluida en este prompt.
- Si no tienes un dato confirmado, indica de forma natural
  que necesitas verificarlo con el equipo.

INFORMACIÓN OFICIAL:

Negocio:
${NEGOCIO.nombre}

Producto:
${NEGOCIO.producto}

Tipo:
Producto 100% digital.

El producto está estructurado como una ruta práctica de 28 días
para ayudar a la persona a organizar mejor su alimentación,
tener más variedad,
reducir la improvisación al momento de preparar sus comidas
y desarrollar hábitos más sostenibles.

PRECIO:

Pago Móvil:
Bs. ${NEGOCIO.precioBolivares.toLocaleString("es-VE")}

Binance:
${NEGOCIO.precioBinance}

ENTREGA:

La entrega es inmediata una vez que el pago es validado
y el cliente envía el comprobante.

El acceso se entrega mediante un enlace de Google Drive
enviado por WhatsApp.

ACCESO:

El acceso es de por vida.

Los 28 días corresponden a la estructura del método,
no al tiempo durante el cual el cliente puede utilizarlo.

El material queda disponible para que pueda volver a consultarlo
cuando lo necesite.

MATERIAL:

El cliente recibe:

${NEGOCIO.producto}

+

9 regalos digitales.

LOS 9 REGALOS OFICIALES SON:

1. 11 Recetas Keto.
2. Cómo Empezar Keto.
3. Keto Postres.
4. Dieta Keto 2026.
5. Recetario Keto Entre Amigos.
6. Keto para Principiantes.
7. Estrategia y Hábitos.
8. Fin de Semana Keto Parrilla.
9. Guía y Cuaderno Práctico para llevar el control del progreso Keto 28D.

DATOS OFICIALES DE PAGO MÓVIL:

Banco:
Banco de Venezuela

Código bancario:
0102

Titular:
Kenny Barico

C.I.:
20.110.298

Teléfono:
0412-8319767

DATOS OFICIALES DE BINANCE:

Monto:
3.5 USDT

Binance ID:
1125063516

También existe un código QR de Binance
que se muestra dentro del flujo de WhatsApp.

Nunca inventes otro QR.

PACK COMPLEMENTARIO:

Después de adquirir el producto principal
puede presentarse un complemento opcional.

Nombre:

${NEGOCIO.upsell.nombre}

Incluye exactamente:

1. Complemento Método KETO 28D™
2. Salsas y Postres KETO 28D™

Precio:

Bs. ${NEGOCIO.upsell.precioBolivares.toLocaleString("es-VE")}

El pack complementario es opcional.

No es necesario comprarlo para recibir
${NEGOCIO.producto}
ni los 9 regalos.

No existe dentro de la información oficial
un precio confirmado en USDT para este complemento.

Si una persona pregunta cuánto cuesta por Binance,
indica que ese monto debe confirmarse con el equipo.

SALUD Y RESULTADOS:

${NEGOCIO.producto}
puede ayudar a la persona a organizar mejor su alimentación,
adoptar hábitos más conscientes,
tener más variedad
y apoyar objetivos relacionados con el control de peso.

Sin embargo:

- No prometas kilos específicos.
- No garantices resultados.
- No prometas resultados médicos.
- No afirmes que el método cura enfermedades.
- No afirmes que controla enfermedades.
- No afirmes que revierte enfermedades.
- No afirmes que sustituye tratamientos médicos.

Si la persona menciona:

- diabetes
- hipertensión
- insulina
- medicamentos
- tratamientos
- alguna condición de salud diagnosticada

explica de forma natural que puede utilizar
el material como guía práctica de apoyo,
pero que cualquier cambio importante en su alimentación
debería conversarlo también con el profesional
de salud que conoce su caso.

No uses afirmaciones como:

"esta comida te inflama"

como una verdad médica general.

SOPORTE:

Si el cliente ya realizó el pago
pero todavía no recibió su acceso,
puede existir un pequeño retraso de conexión
o validación.

En ese caso debe escribir la palabra:

LISTO

para solicitar revisión manual.

No le pidas realizar un segundo pago.

Si tiene problemas con:

- Google Drive
- enlace
- acceso
- apertura de archivos
- material

debe escribir por este mismo WhatsApp
para que se revise su caso.

OBJETIVO DE LA CONVERSACIÓN:

Tu objetivo principal es:

1. Resolver la duda real del cliente.
2. Dar claridad.
3. Dar confianza.
4. Evitar respuestas robóticas.
5. Llevar de manera natural al siguiente paso comercial
   cuando exista intención de compra.

Cuando la persona tenga intención de compra,
el siguiente paso correcto es preguntarle si prefiere:

- Pago Móvil
- Binance

No agregues un cierre comercial a todas las respuestas.

Solo hazlo cuando tenga sentido dentro de la conversación.

Si la persona ya eligió Pago Móvil,
envía solamente los datos de Pago Móvil.

Si la persona ya eligió Binance,
envía solamente los datos de Binance.

Nunca vuelvas a preguntarle qué método prefiere
si ya lo indicó.
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
  return frases.some((frase) =>
    texto.includes(normalizarTexto(frase))
  );
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
// CIERRES COMERCIALES
// ==========================================================

function cierreCompra() {
  return elegirAleatoria([
    "¿Prefieres Pago Móvil o Binance? 😊",

    "Si deseas adquirirlo, dime si prefieres Pago Móvil o Binance 💚",

    "¿Te envío los datos de Pago Móvil o prefieres Binance? 🥑",
  ]);
}

function debeAgregarCierre(textoNormalizado) {
  return contieneAlguna(textoNormalizado, [
    "quiero comprar",
    "quiero adquirir",
    "como compro",
    "como comprar",
    "me interesa",
    "quiero el metodo",
    "quiero el producto",
    "quiero pagarlo",
    "donde pago",
  ]);
}

function agregarCierre(
  texto,
  textoNormalizado
) {
  const limpio =
    limpiarRespuesta(texto);

  if (!limpio) {
    return cierreCompra();
  }

  if (!debeAgregarCierre(textoNormalizado)) {
    return limpio;
  }

  const normalizada =
    normalizarTexto(limpio);

  const yaTieneCierre =
    normalizada.includes(
      "pago movil o binance"
    ) ||
    normalizada.includes(
      "prefieres pago movil"
    ) ||
    normalizada.includes(
      "prefieres binance"
    );

  if (yaTieneCierre) {
    return limpio;
  }

  return `${limpio}\n\n${cierreCompra()}`;
}

// ==========================================================
// RESPUESTAS REUTILIZABLES
// ==========================================================

function respuestaContenido() {

  const variantesIntro = [

    `${NEGOCIO.producto} es un sistema digital de 28 días pensado para ayudarte a organizar mejor tu alimentación, tener más variedad en tus comidas y desarrollar hábitos más sostenibles.`,

    `${NEGOCIO.producto} te da una ruta práctica de 28 días para organizar tus comidas, reducir la improvisación y tener más opciones durante el proceso.`,

    `Con ${NEGOCIO.producto} tienes una estructura práctica de 28 días para organizar mejor tus comidas y acompañar cambios de hábitos de una forma más ordenada.`,
  ];

  return [
    elegirAleatoria(variantesIntro),

    "",

    "Además recibes 9 regalos digitales 🎁:",

    "",

    ...REGALOS.map(
      (regalo) => `🎁 ${regalo}`
    ),

    "",

    "La idea es que tengas más recetas, orientación, variedad y herramientas prácticas para aprovechar mejor tus 28 días. 🥑💚",
  ].join("\n");
}

// ==========================================================
// ENTREGA
// ==========================================================

function respuestaEntrega() {

  return elegirAleatoria([

    [
      `${NEGOCIO.producto} es 100% digital 😊`,

      "",

      "Una vez validado tu pago y recibido el comprobante, el acceso se libera de inmediato mediante un enlace de Google Drive enviado por este mismo WhatsApp.",

      "",

      "Desde allí puedes abrir tu método y tus 9 regalos desde el teléfono, tablet o computadora. 🥑💚",
    ].join("\n"),

    [
      "La entrega es completamente digital y muy sencilla 📲",

      "",

      "Después de confirmar tu pago y comprobante, recibes de inmediato por WhatsApp el enlace de Google Drive con Método KETO 28D™ + tus 9 regalos.",
    ].join("\n"),
  ]);
}

// ==========================================================
// PRECIO
// ==========================================================

function respuestaPrecioGeneral() {

  return elegirAleatoria([

    [
      `${NEGOCIO.producto} completo + tus 9 regalos digitales tiene un valor de:`,

      "",

      `📲 Bs. ${NEGOCIO.precioBolivares.toLocaleString("es-VE")} por Pago Móvil`,

      `🟡 ${NEGOCIO.precioBinance} por Binance`,

      "",

      "Una vez realizado el pago, envías el comprobante por este mismo WhatsApp y se libera tu acceso digital. 💚",
    ].join("\n"),

    [
      `El valor de ${NEGOCIO.producto} + los 9 regalos es Bs. ${NEGOCIO.precioBolivares.toLocaleString("es-VE")} por Pago Móvil o ${NEGOCIO.precioBinance} por Binance. 🥑`,

      "",

      "Después de validar el comprobante recibes el acceso de inmediato por WhatsApp.",
    ].join("\n"),
  ]);
}

// ==========================================================
// PAGO MÓVIL
// ==========================================================

function respuestaPagoMovil() {

  return [

    "Perfecto 😊 Estos son los datos para Pago Móvil:",

    "",

    `🏦 Banco: ${DATOS_PAGO.pagoMovil.banco}`,

    `🔢 Código: ${DATOS_PAGO.pagoMovil.codigoBanco}`,

    `👤 Titular: ${DATOS_PAGO.pagoMovil.titular}`,

    `🪪 C.I.: ${DATOS_PAGO.pagoMovil.cedula}`,

    `📲 Teléfono: ${DATOS_PAGO.pagoMovil.telefono}`,

    "",

    `💰 Monto: Bs. ${NEGOCIO.precioBolivares.toLocaleString("es-VE")}`,

    "",

    `Cuando realices el pago, envíame el comprobante por este mismo chat. Una vez validado, se libera de inmediato tu ${NEGOCIO.producto} + los 9 regalos. 🥑💚`,
  ].join("\n");
}

// ==========================================================
// BINANCE
// ==========================================================

function respuestaBinance() {

  return [

    "Perfecto 💛 Puedes realizar el pago por Binance con estos datos:",

    "",

    `💰 Monto: ${DATOS_PAGO.binance.monto}`,

    `🟡 Binance ID: ${DATOS_PAGO.binance.id}`,

    "",

    "También puedes utilizar el código QR que te compartimos dentro del flujo de WhatsApp.",

    "",

    `Cuando completes el pago, envíame el comprobante por aquí y, una vez validado, se libera tu ${NEGOCIO.producto} + los 9 regalos. 🥑🎁`,
  ].join("\n");
}

// ==========================================================
// TIEMPO DE ENTREGA
// ==========================================================

function respuestaTiempoEntrega() {

  return elegirAleatoria([

    `La entrega es inmediata 😊 Una vez realizas el pago, envías el comprobante y se valida, recibes por WhatsApp el enlace de Google Drive con ${NEGOCIO.producto} + tus 9 regalos.`,

    `No tienes que esperar días 💚 Después de validar tu pago y comprobante, el acceso digital se libera de inmediato por este mismo WhatsApp mediante Google Drive.`,
  ]);
}

// ==========================================================
// PAGO REALIZADO PERO SIN ENTREGA
// ==========================================================

function respuestaNoRecibio() {

  return elegirAleatoria([

    [
      "No te preocupes 😊 Si ya realizaste el pago y todavía no recibes tu acceso, puede tratarse de un pequeño retraso de conexión o validación.",

      "",

      "Responde con la palabra LISTO y nuestro equipo revisará manualmente tu comprobante para ayudarte a liberar el acceso.",

      "",

      "No necesitas volver a pagar. 💚",
    ].join("\n"),

    [
      "Si ya pagaste y aún no recibes el material, tranquilo 😊",

      "",

      "Escribe LISTO para solicitar una revisión manual de tu comprobante y verificar la liberación de tu acceso.",

      "",

      "No hagas un segundo pago.",
    ].join("\n"),
  ]);
}

// ==========================================================
// SOPORTE MANUAL
// ==========================================================

function respuestaListoSoporte() {

  return [

    "Perfecto 😊 Ya recibimos tu aviso.",

    "",

    "Nuestro equipo debe revisar manualmente el comprobante y verificar la liberación de tu acceso.",

    "",

    "Si todavía no has enviado la imagen del comprobante, déjala en este mismo chat. 💚",
  ].join("\n");
}

// ==========================================================
// PESO Y SALUD
// ==========================================================

function respuestaSaludPeso() {

  return elegirAleatoria([

    [
      `${NEGOCIO.producto} puede ayudarte a organizar mejor tu alimentación y apoyar objetivos como el control de peso y la adopción de hábitos más saludables. 🥑💚`,

      "",

      "Durante los 28 días tienes una guía práctica con recetas, ideas y recursos para reducir la improvisación y mantener una rutina con mayor constancia.",

      "",

      "Los resultados pueden variar de una persona a otra y no se garantizan resultados médicos ni una cantidad específica de kilos.",
    ].join("\n"),

    [
      "El método está pensado para ayudarte a mejorar la organización de tus comidas, tener más variedad y construir hábitos más conscientes. 💚",

      "",

      "Puede acompañar objetivos de control de peso, pero cada persona responde de forma diferente y no prometemos resultados específicos ni médicos.",
    ].join("\n"),
  ]);
}

// ==========================================================
// CONDICIONES DE SALUD
// ==========================================================

function respuestaCondicionSalud() {

  return elegirAleatoria([

    [
      `Claro 😊 ${NEGOCIO.producto} puede servirte como una guía práctica para organizar mejor tus comidas, incorporar nuevas recetas y trabajar hábitos de alimentación de forma más consciente.`,

      "",

      "Si tienes diabetes, hipertensión, usas medicamentos, insulina o tienes alguna condición diagnosticada, lo ideal es que cualquier cambio importante en tu alimentación lo converses también con el profesional de salud que conoce tu caso. 💚",
    ].join("\n"),

    [
      "Puedes aprovechar el método como material de apoyo con recetas, planificación e ideas para organizarte mejor 😊",

      "",

      "Si tienes una condición de salud diagnosticada o utilizas medicamentos, conviene adaptar cualquier cambio importante a las indicaciones del profesional que conoce tu caso.",
    ].join("\n"),
  ]);
}

// ==========================================================
// PRINCIPIANTES
// ==========================================================

function respuestaPrincipiante() {

  return elegirAleatoria([

    [
      `No necesitas experiencia previa 😊 ${NEGOCIO.producto} está pensado para que puedas comenzar aunque nunca hayas seguido este tipo de alimentación.`,

      "",

      "Además, dentro de tus regalos tienes Cómo Empezar Keto y Keto para Principiantes, justamente para ayudarte a familiarizarte con el proceso desde el inicio. 🥑💚",
    ].join("\n"),

    [
      "Sí puedes empezar desde cero 💚",

      "",

      "El contenido está organizado de forma práctica para acompañarte durante los 28 días, y tienes materiales específicos para principiantes dentro de tus regalos.",
    ].join("\n"),
  ]);
}

// ==========================================================
// ACCESO DE POR VIDA
// ==========================================================

function respuestaAccesoVida() {

  return elegirAleatoria([

    [
      "Sí 😊 el acceso es de por vida.",

      "",

      "Los 28 días corresponden a la estructura del método, pero una vez recibes Método KETO 28D™ + tus 9 regalos, el material queda contigo para que puedas volver a consultar recetas, guías y recursos cuando lo necesites. 🥑💚",
    ].join("\n"),

    [
      "Tu acceso no vence 💚",

      "",

      "El método está organizado en 28 días, pero el contenido queda disponible para ti de forma permanente y puedes volver a utilizarlo más adelante.",
    ].join("\n"),
  ]);
}

// ==========================================================
// SOPORTE DE ACCESO
// ==========================================================

function respuestaSoporteAcceso() {

  return elegirAleatoria([

    [
      "Claro 😊 Si después de tu compra tienes alguna duda o problema para abrir o acceder al material, escríbenos por este mismo WhatsApp.",

      "",

      "Revisamos tu caso para ayudarte a verificar el enlace y que puedas acceder correctamente a Método KETO 28D™ + tus 9 regalos. 💚",
    ].join("\n"),

    [
      "Si tienes algún inconveniente con el enlace o el acceso, escríbenos por aquí 😊",

      "",

      "Revisamos contigo lo necesario para que no te quedes sin tu material.",
    ].join("\n"),
  ]);
}

// ==========================================================
// UPSELL
// ==========================================================

function respuestaUpsell() {

  return [

    `Sí 😊 Después de la compra principal existe un complemento opcional llamado ${NEGOCIO.upsell.nombre}.`,

    "",

    `Incluye ${NEGOCIO.upsell.productos[0]} + ${NEGOCIO.upsell.productos[1]}.`,

    "",

    `El valor del pack es Bs. ${NEGOCIO.upsell.precioBolivares.toLocaleString("es-VE")}.`,

    "",

    `Es totalmente opcional y no afecta tu acceso a ${NEGOCIO.producto} ni a los 9 regalos. 💚`,
  ].join("\n");
}

function respuestaUpsellBinance() {

  return [

    `El ${NEGOCIO.upsell.nombre} tiene un precio oficial de Bs. ${NEGOCIO.upsell.precioBolivares.toLocaleString("es-VE")}.`,

    "",

    "El monto en USDT para este complemento debe confirmarse con el equipo antes de indicarlo, para no darte un dato incorrecto. 😊",
  ].join("\n");
}

// ==========================================================
// RESPUESTAS DIRECTAS / INTENCIONES
// ==========================================================

function respuestaDirecta(mensajeOriginal) {

  const texto =
    normalizarTexto(mensajeOriginal);

  if (!texto) {
    return null;
  }

  // --------------------------------------------------------
  // REVISIÓN MANUAL
  // --------------------------------------------------------

  if (texto === "listo") {

    return {
      intencion: "revision_manual",
      respuesta: respuestaListoSoporte(),
    };
  }

  // --------------------------------------------------------
  // CONDICIONES DE SALUD
  // --------------------------------------------------------

  if (
    contieneAlguna(texto, [
      "diabetes",
      "diabetico",
      "diabetica",
      "azucar",
      "hipertension",
      "presion alta",
      "insulina",
      "medicamento",
      "medicamentos",
      "tratamiento",
      "condicion de salud",
      "enfermedad",
    ])
  ) {

    return {
      intencion: "condicion_salud",
      respuesta: respuestaCondicionSalud(),
    };
  }

  // --------------------------------------------------------
  // PAGO REALIZADO PERO NO RECIBIÓ
  // --------------------------------------------------------

  if (
    contieneAlguna(texto, [
      "ya pague y no",
      "pague y no",
      "ya hice el pago",
      "ya envie el comprobante",
      "no me llego",
      "no he recibido",
      "todavia no recibo",
      "no recibi el producto",
      "no recibi el metodo",
      "no tengo acceso",
    ])
  ) {

    return {
      intencion: "pago_sin_entrega",
      respuesta: respuestaNoRecibio(),
    };
  }

  // --------------------------------------------------------
  // SOPORTE DE ACCESO
  // --------------------------------------------------------

  if (
    contieneAlguna(texto, [
      "problema con el link",
      "problema con el enlace",
      "no abre",
      "no puedo abrir",
      "no puedo entrar",
      "no funciona el link",
      "no funciona el enlace",
      "ayuda con el acceso",
      "problema de acceso",
      "soporte",
    ])
  ) {

    return {
      intencion: "soporte_acceso",
      respuesta: respuestaSoporteAcceso(),
    };
  }

  // --------------------------------------------------------
  // UPSELL EN BINANCE
  // --------------------------------------------------------

  if (
    contieneAlguna(texto, [
      "upsell binance",
      "complemento binance",
      "pack complementario binance",
      "complemento usdt",
      "pack en usdt",
    ])
  ) {

    return {
      intencion: "upsell_binance",
      respuesta: respuestaUpsellBinance(),
    };
  }

  // --------------------------------------------------------
  // UPSELL
  // --------------------------------------------------------

  if (
    contieneAlguna(texto, [
      "pack complementario",
      "complemento metodo",
      "salsas y postres",
      "complemento keto",
      "otro pack",
      "adicional",
      "upsell",
    ])
  ) {

    return {
      intencion: "upsell",
      respuesta: respuestaUpsell(),
    };
  }

  // --------------------------------------------------------
  // PAGO MÓVIL
  // --------------------------------------------------------

  if (
    contieneAlguna(texto, [
      "pago movil",
      "datos pago movil",
      "datos del pago movil",
      "numero para pago movil",
      "telefono para pagar",
      "cedula para pagar",
      "banco de venezuela",
      "codigo 0102",
    ])
  ) {

    return {
      intencion: "pago_movil",
      respuesta: respuestaPagoMovil(),
    };
  }

  // --------------------------------------------------------
  // BINANCE
  // --------------------------------------------------------

  if (
    contieneAlguna(texto, [
      "binance",
      "usdt",
      "binance id",
      "id de binance",
      "codigo qr",
      "qr de binance",
    ])
  ) {

    return {
      intencion: "binance",
      respuesta: respuestaBinance(),
    };
  }

  // --------------------------------------------------------
  // PRECIO / FORMAS DE PAGO
  // --------------------------------------------------------

  if (
    contieneAlguna(texto, [
      "precio",
      "cuanto cuesta",
      "cuanto vale",
      "valor",
      "costo",
      "cuanto pago",
      "como pago",
      "metodos de pago",
      "formas de pago",
      "donde pago",
    ])
  ) {

    return {
      intencion: "precio_pago",
      respuesta: agregarCierre(
        respuestaPrecioGeneral(),
        texto
      ),
    };
  }

  // --------------------------------------------------------
  // ENTREGA / DRIVE
  // --------------------------------------------------------

  if (
    contieneAlguna(texto, [
      "como lo recibo",
      "como recibo",
      "donde lo recibo",
      "como se entrega",
      "es digital",
      "es fisico",
      "pdf",
      "google drive",
      "drive",
      "enlace",
      "link",
      "por whatsapp",
    ])
  ) {

    return {
      intencion: "entrega",
      respuesta: respuestaEntrega(),
    };
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
      "entrega inmediata",
      "tiempo de entrega",
      "cuanto hay que esperar",
    ])
  ) {

    return {
      intencion: "tiempo_entrega",
      respuesta: respuestaTiempoEntrega(),
    };
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
      "puedo guardarlo",
    ])
  ) {

    return {
      intencion: "acceso_vida",
      respuesta: respuestaAccesoVida(),
    };
  }

  // --------------------------------------------------------
  // PRINCIPIANTES
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
      "desde cero",
    ])
  ) {

    return {
      intencion: "principiante",
      respuesta: respuestaPrincipiante(),
    };
  }

  // --------------------------------------------------------
  // SALUD / PESO
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
      "bienestar",
    ])
  ) {

    return {
      intencion: "salud_peso",
      respuesta: respuestaSaludPeso(),
    };
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
      "que viene",
      "que contiene",
      "recetas incluye",
    ])
  ) {

    return {
      intencion: "contenido",
      respuesta: respuestaContenido(),
    };
  }

  // --------------------------------------------------------
  // INTENCIÓN DE COMPRA
  // --------------------------------------------------------

  if (
    contieneAlguna(texto, [
      "quiero comprar",
      "quiero adquirir",
      "quiero el metodo",
      "quiero el producto",
      "me interesa comprar",
      "como compro",
      "como comprar",
    ])
  ) {

    const base = [

      `${NEGOCIO.producto} + los 9 regalos digitales tiene un valor de Bs. ${NEGOCIO.precioBolivares.toLocaleString("es-VE")} por Pago Móvil o ${NEGOCIO.precioBinance} por Binance. Todo es 100% digital y se entrega por WhatsApp una vez validado el pago. 💚`,

      `Claro 😊 Puedes adquirir ${NEGOCIO.producto} completo + 9 regalos por Bs. ${NEGOCIO.precioBolivares.toLocaleString("es-VE")} o ${NEGOCIO.precioBinance}. La entrega es digital e inmediata después de validar el comprobante.`,
    ];

    return {
      intencion: "intencion_compra",
      respuesta: agregarCierre(
        elegirAleatoria(base),
        texto
      ),
    };
  }

  return null;
}

// ==========================================================
// RUTAS
// ==========================================================

app.get("/", (req, res) => {

  return res
    .status(200)
    .send("Agente de soporte activo ✅");
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
        respuesta:
          "No pude identificar el mensaje 😊 Escríbeme nuevamente tu duda y con gusto te ayudo.",
      });
    }

    const textoNormalizado =
      normalizarTexto(textoUsuario);

    const directa =
      respuestaDirecta(textoUsuario);

    if (directa) {

      const respuestaFinal =
        limpiarRespuesta(
          directa.respuesta
        );

      console.log(
        "Intención detectada:",
        directa.intencion
      );

      console.log(
        "Respuesta generada mediante base de conocimiento"
      );

      return res.json({
        respuesta: respuestaFinal,
      });
    }

    console.log(
      "Intención detectada: consulta_abierta"
    );

    const response =
      await openai.responses.create({

        model: "gpt-4.1-mini",

        temperature: 0.4,

        input: [

          {
            role: "system",
            content: SYSTEM_PROMPT,
          },

          {
            role: "user",
            content: textoUsuario,
          },
        ],
      });

    const respuestaIA =
      response.output_text || "";

    const respuestaFinal =
      agregarCierre(
        limpiarRespuesta(respuestaIA),
        textoNormalizado
      );

    console.log(
      "Respuesta generada mediante OpenAI"
    );

    return res.json({
      respuesta:
        respuestaFinal ||
        "En este momento necesito confirmar ese dato con el equipo para darte una respuesta correcta. 😊",
    });

  } catch (error) {

    console.error(
      "Error en /mensaje:",
      error?.message ||
      "Error desconocido"
    );

    return res
      .status(200)
      .json({

        respuesta:
          "En este momento no pude procesar tu mensaje. Por favor, inténtalo nuevamente en unos minutos. 😊",
      });
  }
});

app.listen(PORT, () => {

  console.log(
    `Servidor corriendo en puerto ${PORT}`
  );
});
