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

const DATOS_NEGOCIO = {
  negocio: "Keto sin Complicaciones",
  agente: "Valentina Rojas",
  producto: "Método KETO 28D™",

  precioBolivares: 4450,
  precioBinance: "3.5 USDT",

  pagoMovil: {
    banco: "Banco de Venezuela",
    codigo: "0102",
    titular: "Kenny Barico",
    cedula: "20.110.298",
    telefono: "0412-8319767"
  },

  binance: {
    id: "1125063516",
    monto: "3.5 USDT"
  },

  upsell: {
    nombre: "Pack Complementario KETO 28D™",
    precioBolivares: 1750
  }
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
  "Guía y Cuaderno Práctico para llevar el control del progreso Keto 28D"
];

// ==========================================================
// PROMPT DEL AGENTE
// ==========================================================

const SYSTEM_PROMPT = `
Atiendes las conversaciones de WhatsApp de
${DATOS_NEGOCIO.negocio} utilizando el nombre
${DATOS_NEGOCIO.agente}.

Tu trabajo es responder dudas sobre
${DATOS_NEGOCIO.producto}.

Tu personalidad es amable, cercana, clara,
paciente, comercial y humana.

Responde como una conversación natural de WhatsApp.

REGLAS DE ESTILO:

- Responde siempre en español.
- Utiliza párrafos cortos.
- Deja una línea en blanco cuando ayude a leer mejor.
- Usa emojis con moderación.
- No escribas bloques largos innecesarios.
- No repitas información que el cliente ya recibió.
- No saludes nuevamente si la conversación ya comenzó.
- Responde directamente la duda.
- No hagas preguntas innecesarias.
- No uses encabezados Markdown con símbolos #.
- No inventes información.
- No inventes precios.
- No inventes promociones.
- No inventes garantías.
- No inventes medios de pago.
- No inventes datos bancarios.
- No inventes enlaces.
- No inventes resultados.
- No asegures resultados médicos.
- No te presentes espontáneamente como bot,
  inteligencia artificial o agente automatizado.
- Si la persona pregunta directamente si la atención
  es automatizada, responde con transparencia.
- No menciones pagos o comprobantes cuando el usuario
  solamente está saludando.
- No agregues un cierre de compra a todas las respuestas.
- Solo dirige al pago cuando la persona demuestra intención
  real de compra o pregunta directamente cómo comprar.

INFORMACIÓN OFICIAL:

El producto es:
Método KETO 28D™

Es un producto 100% digital.

Es una ruta práctica de 28 días diseñada para ayudar
a organizar mejor la alimentación, tener mayor variedad
en las comidas, reducir la improvisación y desarrollar
hábitos más sostenibles.

El cliente recibe el Método KETO 28D™ completo
más 9 regalos digitales.

LOS 9 REGALOS SON:

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

PRECIO:

Pago Móvil:
Bs. 4.450

Binance:
3.5 USDT

PAGO MÓVIL:

Banco:
Banco de Venezuela

Código:
0102

Titular:
Kenny Barico

Cédula:
20.110.298

Teléfono:
0412-8319767

BINANCE:

Monto:
3.5 USDT

Binance ID:
1125063516

También existe un código QR de Binance
que puede mostrarse dentro del flujo de WhatsApp.

ENTREGA:

El producto se entrega después de confirmar el pago.

Una vez realizado el pago y enviado el comprobante,
el acceso se libera de inmediato.

El contenido se entrega mediante un enlace de Google Drive
enviado por WhatsApp.

El acceso es de por vida.

Los 28 días corresponden a la estructura del método,
no al tiempo de acceso.

SALUD:

El método puede apoyar una mejor organización de la alimentación,
hábitos más conscientes y objetivos relacionados con control de peso.

No prometas:
- kilos específicos
- resultados garantizados
- curación de enfermedades
- control médico de enfermedades
- reversión de diabetes
- reversión de hipertensión

Si alguien menciona diabetes, hipertensión,
insulina, medicamentos o alguna condición médica,
explica que puede utilizar el material como guía práctica
de apoyo, pero que cualquier cambio importante en
su alimentación debe adaptarse a las indicaciones
del profesional de salud que conoce su caso.

PACK COMPLEMENTARIO:

Después de la compra principal existe un complemento opcional:

Pack Complementario KETO 28D™

Incluye:

- Complemento Método KETO 28D™
- Salsas y Postres KETO 28D™

Precio:
Bs. 1.750

Este complemento es opcional.

No hace falta comprarlo para recibir
Método KETO 28D™ ni los 9 regalos.

SOPORTE:

Si una persona ya pagó y todavía no recibió el producto,
indícale que escriba la palabra LISTO.

Eso permitirá llevar el caso a revisión manual.

Nunca le pidas pagar nuevamente.

OBJETIVO:

Primero resuelve la duda del cliente.

Cuando exista intención clara de compra,
puedes llevarlo naturalmente a elegir entre:

Pago Móvil
o
Binance.

Si ya eligió uno,
no vuelvas a preguntarle cuál prefiere.
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
// MENSAJES REUTILIZABLES
// ==========================================================

function respuestaSaludo() {
  return elegirAleatoria([
    "¡Hola! 😊 Qué gusto saludarte. ¿En qué puedo ayudarte con Método KETO 28D™? 🥑",

    "¡Hola! 👋💚 Claro, estoy aquí para ayudarte. ¿Qué te gustaría saber sobre Método KETO 28D™?",

    "¡Hola! 😊 Bienvenido/a. Cuéntame qué deseas saber sobre Método KETO 28D™."
  ]);
}

function cierreCompra() {
  return elegirAleatoria([
    "¿Prefieres Pago Móvil o Binance? 😊",

    "Si deseas adquirirlo, dime si prefieres Pago Móvil o Binance 💚",

    "¿Te envío los datos de Pago Móvil o prefieres Binance? 🥑"
  ]);
}

function respuestaCompra() {
  return [
    `Claro 😊 Puedes adquirir ${DATOS_NEGOCIO.producto} completo + los 9 regalos digitales por:`,
    "",
    `📲 Bs. ${DATOS_NEGOCIO.precioBolivares.toLocaleString("es-VE")} por Pago Móvil`,
    `🟡 ${DATOS_NEGOCIO.precioBinance} por Binance`,
    "",
    "Todo es 100% digital y se entrega por WhatsApp una vez confirmado el pago.",
    "",
    cierreCompra()
  ].join("\n");
}

function respuestaPrecio() {
  return [
    `${DATOS_NEGOCIO.producto} completo + los 9 regalos digitales tiene un valor de:`,
    "",
    `📲 Bs. ${DATOS_NEGOCIO.precioBolivares.toLocaleString("es-VE")} por Pago Móvil`,
    `🟡 ${DATOS_NEGOCIO.precioBinance} por Binance`,
    "",
    "Todo el material es digital y el acceso es de por vida. 🥑💚"
  ].join("\n");
}

function respuestaPagoMovil() {
  return [
    "Perfecto 😊 Estos son los datos para realizar tu Pago Móvil:",
    "",
    `🏦 Banco: ${DATOS_NEGOCIO.pagoMovil.banco}`,
    `🔢 Código: ${DATOS_NEGOCIO.pagoMovil.codigo}`,
    `👤 Titular: ${DATOS_NEGOCIO.pagoMovil.titular}`,
    `🪪 C.I.: ${DATOS_NEGOCIO.pagoMovil.cedula}`,
    `📲 Teléfono: ${DATOS_NEGOCIO.pagoMovil.telefono}`,
    "",
    `💰 Monto: Bs. ${DATOS_NEGOCIO.precioBolivares.toLocaleString("es-VE")}`,
    "",
    "Cuando realices el pago, envíame por aquí el comprobante.",
    "",
    `Una vez confirmado, liberamos de inmediato tu ${DATOS_NEGOCIO.producto} + los 9 regalos. 🥑💚`
  ].join("\n");
}

function respuestaBinance() {
  return [
    "Perfecto 💛 Puedes realizar tu pago por Binance:",
    "",
    `💰 Monto: ${DATOS_NEGOCIO.binance.monto}`,
    `🟡 Binance ID: ${DATOS_NEGOCIO.binance.id}`,
    "",
    "También puedes utilizar el código QR de Binance que se muestra dentro del flujo.",
    "",
    "Cuando completes el pago, envíame el comprobante por este mismo chat.",
    "",
    `Una vez confirmado, liberamos tu ${DATOS_NEGOCIO.producto} + los 9 regalos. 🥑🎁`
  ].join("\n");
}

function respuestaContenido() {
  return [
    `${DATOS_NEGOCIO.producto} es una ruta digital de 28 días pensada para ayudarte a organizar mejor tu alimentación, tener más variedad y reducir la improvisación diaria. 🥑💚`,
    "",
    "Además recibes 9 regalos digitales:",
    "",
    ...REGALOS.map((regalo) => `🎁 ${regalo}`),
    "",
    "Así tienes recetas, orientación y herramientas adicionales para acompañarte durante todo el proceso."
  ].join("\n");
}

function respuestaEntrega() {
  return [
    `${DATOS_NEGOCIO.producto} es 100% digital 📲`,
    "",
    "Una vez confirmado el pago y recibido el comprobante, liberamos de inmediato tu acceso mediante un enlace de Google Drive enviado por este mismo WhatsApp.",
    "",
    "Puedes acceder desde tu teléfono, tablet o computadora. 🥑💚"
  ].join("\n");
}

function respuestaTiempoEntrega() {
  return [
    "La entrega es inmediata 😊",
    "",
    "Una vez realizado el pago, enviado el comprobante y confirmado el mismo, recibes por WhatsApp el enlace de Google Drive con Método KETO 28D™ + tus 9 regalos."
  ].join("\n");
}

function respuestaAccesoVida() {
  return [
    "Sí 😊 el acceso es de por vida.",
    "",
    "Los 28 días corresponden a la estructura del método, pero todo el material queda disponible para que puedas volver a consultar las recetas, guías y recursos cuando lo necesites. 🥑💚"
  ].join("\n");
}

function respuestaPrincipiante() {
  return [
    "No necesitas experiencia previa 😊",
    "",
    "Método KETO 28D™ está pensado para que puedas comenzar desde cero.",
    "",
    "Además, dentro de tus regalos tienes Cómo Empezar Keto y Keto para Principiantes, que te ayudan a familiarizarte con el proceso. 🥑💚"
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
    "Si tienes diabetes, hipertensión, utilizas insulina, medicamentos o tienes alguna condición diagnosticada, lo ideal es adaptar cualquier cambio importante en tu alimentación junto al profesional de salud que conoce tu caso. 💚"
  ].join("\n");
}

function respuestaNoRecibio() {
  return [
    "No te preocupes 😊",
    "",
    "Si ya realizaste el pago y todavía no recibes el acceso, puede existir un pequeño retraso de conexión o validación.",
    "",
    "Escribe la palabra LISTO y revisaremos manualmente tu comprobante para ayudarte a liberar el acceso.",
    "",
    "No necesitas volver a pagar. 💚"
  ].join("\n");
}

function respuestaListo() {
  return [
    "Perfecto 😊",
    "",
    "Vamos a revisar manualmente tu comprobante para verificar el pago y la liberación de tu acceso.",
    "",
    "Si todavía no has enviado la imagen del comprobante, déjala por este mismo chat. 💚"
  ].join("\n");
}

function respuestaSoporte() {
  return [
    "Claro 😊 Si tienes algún inconveniente para abrir el enlace o acceder al material, escríbenos por este mismo WhatsApp.",
    "",
    "Revisaremos tu caso para ayudarte a acceder correctamente a Método KETO 28D™ + tus 9 regalos. 💚"
  ].join("\n");
}

function respuestaUpsell() {
  return [
    "Sí 😊 Después de adquirir Método KETO 28D™ existe un complemento opcional:",
    "",
    `🔥 ${DATOS_NEGOCIO.upsell.nombre}`,
    "",
    "Incluye:",
    "",
    "🍽️ Complemento Método KETO 28D™",
    "🍰 Salsas y Postres KETO 28D™",
    "",
    `💰 Los dos juntos por Bs. ${DATOS_NEGOCIO.upsell.precioBolivares.toLocaleString("es-VE")}`,
    "",
    "Es opcional y no afecta tu acceso al método principal ni a tus 9 regalos. 💚"
  ].join("\n");
}

// ==========================================================
// RESPUESTAS DIRECTAS
// ==========================================================

function respuestaDirecta(mensajeOriginal) {

  const texto = normalizarTexto(mensajeOriginal);

  if (!texto) {
    return null;
  }

  // --------------------------------------------------------
  // SALUDO
  // --------------------------------------------------------

  const saludo =
    texto === "hola" ||
    texto === "buenas" ||
    texto === "buen dia" ||
    texto === "buenos dias" ||
    texto === "buenas tardes" ||
    texto === "buenas noches" ||
    texto === "hello" ||
    texto === "holaa" ||
    texto === "holaaa";

  if (saludo) {
    return {
      intencion: "saludo",
      respuesta: respuestaSaludo()
    };
  }

  // --------------------------------------------------------
  // LISTO / REVISIÓN MANUAL
  // --------------------------------------------------------

  if (texto === "listo") {
    return {
      intencion: "revision_manual",
      respuesta: respuestaListo()
    };
  }

  // --------------------------------------------------------
  // PAGO REALIZADO Y NO RECIBIDO
  // --------------------------------------------------------

  if (
    contieneAlguna(texto, [
      "ya pague y no",
      "pague y no",
      "ya hice el pago",
      "ya pague",
      "ya envie el comprobante",
      "envie el comprobante",
      "no me llego",
      "no he recibido",
      "todavia no recibo",
      "no recibi el producto",
      "no recibi el metodo",
      "no tengo acceso"
    ])
  ) {
    return {
      intencion: "pago_sin_entrega",
      respuesta: respuestaNoRecibio()
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
    return {
      intencion: "condicion_salud",
      respuesta: respuestaCondicionSalud()
    };
  }

  // --------------------------------------------------------
  // SOPORTE
  // --------------------------------------------------------

  if (
    contieneAlguna(texto, [
      "problema con el link",
      "problema con el enlace",
      "no puedo abrir",
      "no abre",
      "no puedo entrar",
      "no funciona el link",
      "no funciona el enlace",
      "problema de acceso",
      "ayuda con el acceso",
      "soporte"
    ])
  ) {
    return {
      intencion: "soporte",
      respuesta: respuestaSoporte()
    };
  }

  // --------------------------------------------------------
  // PAGO MÓVIL
  // --------------------------------------------------------

  const preguntaPagoMovil =
    contieneAlguna(texto, [
      "pago movil",
      "pagar por pago movil",
      "quiero pago movil",
      "prefiero pago movil",
      "datos del pago movil",
      "datos pago movil",
      "numero pago movil",
      "banco de venezuela",
      "codigo 0102"
    ]) ||
    texto === "movil";

  if (preguntaPagoMovil) {
    return {
      intencion: "pago_movil",
      respuesta: respuestaPagoMovil()
    };
  }

  // --------------------------------------------------------
  // BINANCE
  // --------------------------------------------------------

  const preguntaBinance =
    contieneAlguna(texto, [
      "binance",
      "binans",
      "binanse",
      "binnance",
      "vinas",
      "usdt",
      "pagar por binance",
      "quiero binance",
      "prefiero binance",
      "binance id",
      "id binance",
      "qr binance",
      "codigo qr"
    ]) ||
    texto === "binance" ||
    texto === "binans" ||
    texto === "vinas";

  if (preguntaBinance) {
    return {
      intencion: "binance",
      respuesta: respuestaBinance()
    };
  }

  // --------------------------------------------------------
  // UPSELL
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
    return {
      intencion: "upsell",
      respuesta: respuestaUpsell()
    };
  }

  // --------------------------------------------------------
  // INTENCIÓN DE COMPRA
  // Debe ir antes de precio genérico.
  // --------------------------------------------------------

  if (
    contieneAlguna(texto, [
      "quiero comprar",
      "quiero adquirir",
      "quiero el metodo",
      "quiero el megapack",
      "quiero comprar el megapack",
      "quiero comprar keto",
      "quiero comprar metodo keto",
      "me interesa comprar",
      "como compro",
      "como comprar",
      "deseo comprar",
      "lo quiero",
      "quiero pagarlo"
    ])
  ) {
    return {
      intencion: "intencion_compra",
      respuesta: respuestaCompra()
    };
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
      "valor",
      "cuanto pago",
      "cuanto debo pagar",
      "formas de pago",
      "metodos de pago"
    ])
  ) {
    return {
      intencion: "precio",
      respuesta: respuestaPrecio()
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
      "que contiene",
      "que viene",
      "recetas incluye"
    ])
  ) {
    return {
      intencion: "contenido",
      respuesta: respuestaContenido()
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
      "tiempo de entrega",
      "es inmediato",
      "entrega inmediata"
    ])
  ) {
    return {
      intencion: "tiempo_entrega",
      respuesta: respuestaTiempoEntrega()
    };
  }

  // --------------------------------------------------------
  // ENTREGA / FORMATO
  // --------------------------------------------------------

  if (
    contieneAlguna(texto, [
      "como lo recibo",
      "como recibo",
      "donde lo recibo",
      "como se entrega",
      "es digital",
      "es fisico",
      "producto digital",
      "google drive",
      "drive",
      "por whatsapp",
      "enlace",
      "link"
    ])
  ) {
    return {
      intencion: "entrega",
      respuesta: respuestaEntrega()
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
      "cuanto dura",
      "solo 28 dias",
      "despues de 28 dias",
      "acceso permanente",
      "puedo guardarlo"
    ])
  ) {
    return {
      intencion: "acceso_vida",
      respuesta: respuestaAccesoVida()
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
      "desde cero"
    ])
  ) {
    return {
      intencion: "principiante",
      respuesta: respuestaPrincipiante()
    };
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
    return {
      intencion: "salud_peso",
      respuesta: respuestaSaludPeso()
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
    .send("Bot ventas KETO activo ✅");
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
          "Estoy aquí para ayudarte 😊 Escríbeme tu duda sobre Método KETO 28D™."
      });
    }

    // ======================================================
    // 1. PRIMERO BUSCAMOS RESPUESTA DIRECTA
    // ======================================================

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
        respuesta: respuestaFinal
      });
    }

    // ======================================================
    // 2. SI NO HAY INTENCIÓN DIRECTA, USA OPENAI
    // ======================================================

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

    // IMPORTANTE:
    // YA NO AGREGAMOS UN CIERRE DE PAGO AUTOMÁTICAMENTE.
    // ESTA ERA UNA DE LAS CAUSAS DEL PROBLEMA.

    const respuestaFinal =
      limpiarRespuesta(respuestaIA);

    console.log(
      "Respuesta generada mediante OpenAI"
    );

    return res.json({
      respuesta:
        respuestaFinal ||
        "Con gusto te ayudo 😊 ¿Qué deseas saber sobre Método KETO 28D™?"
    });

  } catch (error) {

    console.error(
      "Error en /mensaje:",
      error?.message ||
      "Error desconocido"
    );

    // IMPORTANTE:
    // SI OPENAI FALLA, TAMPOCO MANDAMOS DATOS DE PAGO.
    // RESPONDEMOS NEUTRALMENTE.

    return res.status(200).json({
      respuesta:
        "En este momento tuve un pequeño inconveniente para procesar tu mensaje 😊 Inténtalo nuevamente en unos minutos."
    });
  }
});

app.listen(PORT, () => {

  console.log(
    `Servidor corriendo en puerto ${PORT}`
  );
});
