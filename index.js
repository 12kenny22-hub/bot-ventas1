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
  pagoMovil: {
    banco: "Banco de Venezuela",
    titular: "Kenny Barico",
    telefono: "0412-8319767",
    cedula: "V-20.110.298"
  },

  binance: {
    id: "1125063516"
  },

  precios: {
    venezuela: "Bs. 4.450",
    colombia: "14.000 COP",
    internacional: "USD 3.50"
  },

  complemento: "Bs. 1.750"
};

// ==========================================================
// PROMPT DEL AGENTE
// ==========================================================

const SYSTEM_PROMPT = `
Eres la asistente de soporte y ventas de NutreVida Salud Integral
para el proyecto Método KETO 28D™.

Tu personalidad es amable, cálida, paciente,
respetuosa, profesional y humana.

Responde como una persona real por WhatsApp.

REGLAS DE ESTILO:

- Responde en español.
- Utiliza párrafos cortos.
- Deja una línea en blanco entre ideas.
- Usa emojis relacionados con alimentación saludable con moderación.
- Evita bloques largos de texto.
- No repitas información innecesariamente.
- No saludes nuevamente si la conversación ya comenzó.
- No hagas preguntas innecesarias.
- Responde directamente la duda del usuario.
- No uses Markdown como encabezados con símbolos #.
- No inventes enlaces, promociones, cuentas ni información.
- No digas que eres una inteligencia artificial.
- No presiones a la persona para pagar.
- No prometas resultados específicos de pérdida de peso.
- No presentes el material como sustituto de atención médica o nutricional.
- No agregues las formas de pago si la persona no está preguntando por
  el precio, la compra o el pago.
- Si no tienes suficiente contexto para entender una respuesta corta,
  pide una aclaración breve en lugar de asumir.

INFORMACIÓN OFICIAL DEL PROYECTO:

El producto principal es un paquete digital en formato PDF
llamado "Método KETO 28D™".

El Método KETO 28D™ fue creado para ayudar a la persona a
organizar su alimentación durante 28 días sin tener que pensar
todos los días qué cocinar.

La oferta principal incluye:

- Plan completo de 28 días.
- Menús y listas de compras.
- Más de 250 recetas fáciles, snacks y postres.
- Bonos digitales incluidos.

Los precios de la oferta principal son:

- Bs. 4.450 para Venezuela.
- 14.000 COP para Colombia.
- USD 3.50 para pago internacional.

La persona puede realizar su pago por:

- Pago Móvil.
- Binance.

DATOS PARA PAGO MÓVIL:

Banco: Banco de Venezuela
Titular: Kenny Barico
Teléfono: 0412-8319767
Cédula: V-20.110.298
Monto: Bs. 4.450

DATOS PARA BINANCE:

ID: 1125063516
Monto: USD 3.50

Después de realizar el pago, la persona debe enviar en este
mismo chat la imagen de su comprobante.

Después de validar el pago principal, se puede ofrecer por
Bs. 1.750 adicionales el paquete de dos complementos:

- Complemento Método KETO 28D.
- Salsas y Postres KETO 28D.

Si la persona no desea los complementos, se continúa con la
entrega del producto principal sin insistir.

Todo el contenido es digital y se entrega en formato PDF.
No se realiza envío físico.

El pago puede hacerse después, mañana o cuando la persona
tenga oportunidad. No existe ningún problema por esperar.

El material es educativo. Los resultados pueden variar entre
personas. Quienes tengan una condición de salud, utilicen
medicamentos, estén embarazadas o amamantando deben consultar
con un profesional de salud antes de realizar cambios importantes
en su alimentación.

Cuando respondas una pregunta concreta, no repitas todo el
discurso de venta. Contesta únicamente lo necesario de manera
clara, amable, ordenada y visual.
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
    "🥑 Para comenzar con el Método KETO 28D™ puedes elegir:",
    "",
    "💳 Pago Móvil",
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

function respuestaPagoMovil() {
  return [
    "Perfecto 😊 Estos son los datos para realizar tu pago:",
    "",
    "💳 PAGO MÓVIL",
    `🏦 Banco: ${DATOS_PAGO.pagoMovil.banco}`,
    `👤 Titular: ${DATOS_PAGO.pagoMovil.titular}`,
    `📱 Teléfono: ${DATOS_PAGO.pagoMovil.telefono}`,
    `🪪 C.I.: ${DATOS_PAGO.pagoMovil.cedula}`,
    `💰 Monto: ${DATOS_PAGO.precios.venezuela}`,
    "",
    "Cuando realices el pago, envíame aquí la imagen del comprobante y continuamos con tu acceso al Método KETO 28D™ 🥑📲"
  ].join("\n");
}

function respuestaPagoPosterior() {
  return [
    "Claro 😊 No hay ningún problema, puedes realizar tu pago después.",
    "",
    "Cuando estés listo, puedes elegir:",
    "",
    "💳 Pago Móvil",
    "🟡 Binance",
    "",
    "Después solo envíame aquí la imagen del comprobante para continuar con tu acceso al Método KETO 28D™ 🥑📲"
  ].join("\n");
}

function respuestaBinance() {
  return [
    "Perfecto 😊 También puedes realizar tu pago mediante Binance.",
    "",
    `🟡 ID de Binance: ${DATOS_PAGO.binance.id}`,
    `💰 Monto: ${DATOS_PAGO.precios.internacional}`,
    "",
    "Cuando termines, envíame aquí una imagen completa y legible del comprobante para continuar con tu acceso al Método KETO 28D™ 🥑📲"
  ].join("\n");
}

function respuestaContenido() {
  return [
    "El Método KETO 28D™ es un paquete digital creado para ayudarte a organizar tu alimentación durante 28 días 🥑📚",
    "",
    "Incluye:",
    "",
    "✅ Plan completo de 28 días",
    "✅ Menús y listas de compras",
    "✅ Más de 250 recetas fáciles, snacks y postres",
    "✅ Bonos digitales incluidos"
  ].join("\n");
}

function respuestaEntrega() {
  return [
    "El Método KETO 28D™ es completamente digital y se entrega en formato PDF 📚✨",
    "",
    "Después de validar tu pago, recibirás el acceso en esta misma conversación para descargarlo en tu teléfono, computadora o tableta 📲"
  ].join("\n");
}

function respuestaPrecio() {
  return [
    "El Método KETO 28D™ está disponible por:",
    "",
    `🇻🇪 ${DATOS_PAGO.precios.venezuela}`,
    `🇨🇴 ${DATOS_PAGO.precios.colombia}`,
    `🌎 ${DATOS_PAGO.precios.internacional}`,
    "",
    "Todo el contenido es digital y no tiene costo de envío.",
    "",
    cierrePago()
  ].join("\n");
}

function respuestaInteresCompra() {
  return [
    "¡Excelente! 🙌🥑",
    "",
    "Estás a un paso de comenzar con el Método KETO 28D™.",
    "",
    cierrePago()
  ].join("\n");
}

function respuestaComprobante() {
  return [
    "¡Listo! 🙌",
    "",
    "Envíame aquí una imagen completa y legible del comprobante.",
    "",
    "Déjame validar tu pago y enseguida continuamos con tu acceso al Método KETO 28D™ 🥑"
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
  // INTERÉS EN COMPRAR
  // --------------------------------------------------------

  if (
    contieneAlguna(texto, [
      "quiero comprar",
      "quiero comenzar",
      "quiero el metodo",
      "me interesa",
      "como compro",
      "deseo comprar",
      "lo quiero"
    ]) ||
    texto === "si" ||
    texto === "sí"
  ) {
    return respuestaInteresCompra();
  }

  // --------------------------------------------------------
  // PAGAR DESPUÉS
  // Debe evaluarse antes de la intención genérica de pago.
  // --------------------------------------------------------

  const preguntaPagoPosterior =
    contieneAlguna(texto, [
      "pagar despues",
      "pago despues",
      "depositar despues",
      "transferir despues",
      "hacerlo despues",
      "puedo hacerlo despues",
      "puedo pagar manana",
      "pagar manana",
      "pago manana",
      "depositar manana",
      "transferir manana",
      "lo hago manana",
      "mas tarde",
      "otro dia",
      "la proxima semana",
      "cuando tenga dinero"
    ]) ||
    texto === "despues" ||
    texto === "manana";

  if (preguntaPagoPosterior) {
    return respuestaPagoPosterior();
  }

  // --------------------------------------------------------
  // PAGO MÓVIL
  // --------------------------------------------------------

  const preguntaPagoMovil =
    contieneAlguna(texto, [
      "pago movil",
      "pagomovil",
      "datos bancarios",
      "datos de pago",
      "cuenta bancaria",
      "a que banco",
      "en que banco",
      "donde transfiero",
      "cual es la cuenta",
      "pasame la cuenta",
      "mandame la cuenta",
      "pagar en bolivares"
    ]) ||
    texto === "cuenta";

  if (preguntaPagoMovil) {
    return respuestaPagoMovil();
  }

  // --------------------------------------------------------
  // BINANCE
  // --------------------------------------------------------

  const preguntaBinance =
    contieneAlguna(texto, [
      "pagar por binance",
      "pago por binance",
      "como pago por binance",
      "id de binance",
      "pagar en dolares",
      "pago en dolares",
      "pagar con usdt",
      "pago con usdt"
    ]) ||
    texto === "binance";

  if (preguntaBinance) {
    return respuestaBinance();
  }

  // --------------------------------------------------------
  // COMPROBANTE
  // --------------------------------------------------------

  if (
    contieneAlguna(texto, [
      "ya pague",
      "ya transferi",
      "pago realizado",
      "envio comprobante",
      "enviar comprobante",
      "aqui esta el comprobante",
      "te mando el comprobante"
    ]) ||
    texto === "comprobante"
  ) {
    return respuestaComprobante();
  }

  // --------------------------------------------------------
  // CONTENIDO DEL MÉTODO
  // --------------------------------------------------------

  if (
    contieneAlguna(texto, [
      "que incluye",
      "que contiene",
      "que trae",
      "cuantas recetas",
      "lista de compras",
      "plan de 28 dias",
      "bonos incluidos",
      "de que trata"
    ])
  ) {
    return respuestaContenido();
  }

  // --------------------------------------------------------
  // ENTREGA, PDF O PRODUCTO FÍSICO
  // --------------------------------------------------------

  if (
    contieneAlguna(texto, [
      "es fisico",
      "libro fisico",
      "producto fisico",
      "formato fisico",
      "es digital",
      "libro digital",
      "es pdf",
      "archivo pdf",
      "como lo recibo",
      "cuando lo recibo",
      "donde lo recibo",
      "como se entrega",
      "donde esta el libro",
      "no encuentro el libro",
      "no me llego",
      "no lo recibi",
      "envio",
      "domicilio"
    ])
  ) {
    return respuestaEntrega();
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
      "cuanto deposito",
      "cuanto transfiero",
      "cuanto hay que pagar",
      "cuanto debo pagar",
      "de cuanto es",
      "cantidad"
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
    .send("Bot ventas Método KETO 28D activo ✅");
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
    );

    if (!textoUsuario) {
      return res.json({
        respuesta: [
          "Estoy aquí para ayudarte 😊",
          "",
          "Puedes escribirme tu duda sobre el Método KETO 28D™, la entrega o las formas de pago 🥑"
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

    // Las respuestas directas de precio y compra ya incluyen su cierre.
    // Para preguntas abiertas se conserva solo la respuesta pertinente,
    // evitando insertar opciones de pago fuera de contexto.
    const respuestaFinal =
      limpiarRespuesta(respuestaIA) || cierrePago();

    console.log(
      "Respuesta enviada:",
      respuestaFinal
    );

    return res.json({
      respuesta: respuestaFinal
    });
  } catch (error) {
    console.error(
      "Error en /mensaje:",
      error
    );

    return res.json({
      respuesta: [
        "Con mucho gusto te ayudo 😊",
        "",
        cierrePago()
      ].join("\n")
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `Servidor corriendo en puerto ${PORT}`
  );
});
