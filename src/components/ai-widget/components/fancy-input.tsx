import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { styled, keyframes } from "@mui/material/styles";
import { icons } from "@tabler/icons-react";

/* ---------- Constantes para reservar espacios ---------- */
// Ajusta si cambias tamaños/espaciados de iconos
const LEADING_RESERVED = 36;     // hueco para icono izquierdo (varita/plus)
const TRAILING_RESERVED = 88;    // hueco para dos iconos a la derecha (mic + send)
const MULTI_TOPBAR_HEIGHT = 28;  // alto de la barra inferior (Topbar) en multilinea
const BASE_PADDING_Y = 10;       // padding vertical base del textarea

/* ---------- Estilos base y borde animado ---------- */
const pulse = keyframes`
  0% { filter: saturate(1) brightness(1); }
  50% { filter: saturate(1.15) brightness(1.06); }
  100% { filter: saturate(1) brightness(1); }
`;

const Shell = styled("div")(() => ({
  position: "relative",
  borderRadius: 14,
  padding: 2,
  transition: "transform 160ms ease",
  "&:hover": { transform: "translateY(-1px)" },
  "&:before": {
    content: '""',
    position: "absolute",
    inset: 0,
    padding: 1,
    borderRadius: 14,
    background: "linear-gradient(135deg, #FF9D2F, #FF4ECD, #2EE6A6)",
    WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
    opacity: 0.7,
    pointerEvents: "none",
    transition: "opacity 220ms ease",
  },
  "&.focus:before": { opacity: 1, animation: `${pulse} 1600ms ease-in-out infinite` },
  background: "rgba(255,255,255,0.04)",
}));

const Composer = styled("div")(() => ({
  position: "relative",
  borderRadius: 12,
  background: "transparent",
}));

/* ---------- Topbar (varita + mic) ABAJO ---------- */
const Topbar = styled("div")(() => ({
  height: MULTI_TOPBAR_HEIGHT,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  pointerEvents: "none",
  transition: "opacity 160ms ease",
  opacity: 0.92,
  padding: "1.5rem 0.5rem",
  "& .clickable": { pointerEvents: "auto" },
}));

/* ---------- Textarea ---------- */
const Ta = styled("textarea")(() => ({
  display: "block",
  width: "100%",
  border: 0,
  outline: "none",
  background: "transparent",
  color: "inherit",
  font: "inherit",
  lineHeight: 1.55,
  fontSize: 14,
  borderRadius: 12,
  // padding base (laterales y top/bottom se ajustan via style según estado)
  paddingTop: BASE_PADDING_Y,
  paddingBottom: BASE_PADDING_Y + 2,
  minHeight: 40,
  resize: "none",
  transition: "height 180ms ease, padding 180ms ease, left 180ms ease, right 180ms ease, transform 180ms ease",
  overflow: "auto",
  transformOrigin: "bottom",
  "::placeholder": { color: "rgba(255,255,255,0.55)" },
}));

/* ---------- Botón enviar anclado abajo-derecha ---------- */
const SendBtn = styled(IconButton)(() => ({
  width: 36,
  height: 36,
  borderRadius: 999,
  background: "rgba(255,255,255,0.96)",
  color: "#111",
  boxShadow: "0 8px 22px rgba(0,0,0,.28)",
  transition: "transform 160ms ease, box-shadow 160ms ease, background 160ms ease",
  "&:hover": { transform: "translateY(-1px)", boxShadow: "0 10px 26px rgba(0,0,0,.34)" },
  "&.Mui-disabled": { opacity: 0.6, boxShadow: "none" },
}));

/* =========================================================
   HOOK DE AUTOSIZE ESTABLE (sin flapping)
   - Mide en clon oculto (offscreen) con anchos fijos por estado
   - Observa el ancho del CONTENEDOR (no del textarea visible)
   ========================================================= */
type AutoOpts = { minRows?: number; maxRows?: number };

function useAutosizeStable(
  containerRef: React.RefObject<HTMLElement>,
  textareaRef: React.RefObject<HTMLTextAreaElement>,
  value: string,
  { minRows = 1, maxRows = 6 }: AutoOpts = {},
) {
  const [height, setHeight] = useState<number>();
  const [isMulti, setIsMulti] = useState(false);

  const measurerRef = useRef<HTMLTextAreaElement | null>(null);
  const raf = useRef<number>();

  useLayoutEffect(() => {
    const ta = document.createElement("textarea");
    measurerRef.current = ta;
    Object.assign(ta.style, {
      position: "fixed",
      visibility: "hidden",
      zIndex: "-1",
      top: "-9999px",
      left: "0",
      height: "auto",
      minHeight: "0",
      maxHeight: "none",
      border: "0",
      outline: "0",
      resize: "none",
      overflow: "auto",
      whiteSpace: "pre-wrap",
      background: "transparent",
    } as CSSStyleDeclaration);
    document.body.appendChild(ta);
    return () => {
      cancelAnimationFrame(raf.current!);
      if (ta.parentNode) ta.parentNode.removeChild(ta);
      measurerRef.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const visible = textareaRef.current;
    const measurer = measurerRef.current;
    if (!container || !visible || !measurer) return;

    const cs = getComputedStyle(visible);
    const copyFont = () => {
      measurer.style.font = cs.font;
      measurer.style.lineHeight = cs.lineHeight;
      measurer.style.letterSpacing = cs.letterSpacing;
      measurer.style.padding = "0"; // el padding lo seteamos por estado
    };
    copyFont();

    const lineHeight = parseFloat(cs.lineHeight) || 16;

    const measure = () => {
      const containerW = container.clientWidth;

      // 1) ¿Multilínea? → usar ancho de SINGLE-LINE (contenedor - reservas laterales)
      const singleTextWidth = Math.max(0, containerW - LEADING_RESERVED - TRAILING_RESERVED);
      measurer.value = value || "";
      measurer.style.width = singleTextWidth + "px";
      // single-line: paddings simétricos básicos
      measurer.style.paddingTop = BASE_PADDING_Y + "px";
      measurer.style.paddingBottom = BASE_PADDING_Y + 2 + "px";
      measurer.style.paddingLeft = "0px";
      measurer.style.paddingRight = "0px";
      measurer.style.height = "auto";

      const scrollSingle = measurer.scrollHeight;
      const contentSingle = scrollSingle - (BASE_PADDING_Y + BASE_PADDING_Y + 2);
      const rowsSingle = contentSingle / lineHeight;

      // margen anti-subpíxel
      const shouldMulti = value.includes("\n") || rowsSingle > 1.02;

      // 2) Altura objetivo con ancho de MULTILINEA (si aplica)
      if (shouldMulti) {
        const multiTextWidth = Math.max(0, containerW - 12 - 12);
        measurer.style.width = multiTextWidth + "px";
        // ⬇️ ahora reservamos espacio en el FONDO (Topbar abajo)
        measurer.style.paddingTop = BASE_PADDING_Y + "px";
        measurer.style.paddingBottom = BASE_PADDING_Y + MULTI_TOPBAR_HEIGHT + 4 + "px";
        measurer.style.paddingLeft = "12px";
        measurer.style.paddingRight = TRAILING_RESERVED + "px"; // hueco para botón enviar
      } else {
        // ya seteado para single-line
      }
      measurer.style.height = "auto";
      const full = measurer.scrollHeight;

      const paddV = shouldMulti
        ? (BASE_PADDING_Y + MULTI_TOPBAR_HEIGHT + 4) + BASE_PADDING_Y
        : (BASE_PADDING_Y + BASE_PADDING_Y + 2);

      const minH = Math.max(1, minRows) * lineHeight + paddV;
      const maxH = Math.max(minRows, maxRows) * lineHeight + paddV;
      const targetH = Math.min(Math.max(full, minH), maxH);

      if (targetH !== height) setHeight(targetH);
      if (shouldMulti !== isMulti) setIsMulti(shouldMulti);
    };

    measure();
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf.current!);
      raf.current = requestAnimationFrame(measure);
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf.current!);
    };
  }, [containerRef, textareaRef, value, minRows, maxRows, isMulti, height]);

  return { height, isMulti };
}

/* =========================================================
   HOOK TYPEWRITER PARA PLACEHOLDER
   - Escribe → pausa → borra → siguiente
   - Pausa automáticamente si value tiene texto
   ========================================================= */
type TypewriterOpts = {
  typingMinMs?: number;  // min delay por carácter
  typingMaxMs?: number;  // max delay por carácter
  deletingMinMs?: number;
  deletingMaxMs?: number;
  holdOnFullMs?: number; // pausa cuando completa la frase
  holdOnEmptyMs?: number; // pausa tras borrar
  blinkMs?: number;       // cursor blink
};

function useTypewriterPlaceholder(
  items: string[],
  enabled: boolean,
  opts: TypewriterOpts = {},
) {
  const {
    typingMinMs = 22,
    typingMaxMs = 55,
    deletingMinMs = 12,
    deletingMaxMs = 28,
    holdOnFullMs = 900,
    holdOnEmptyMs = 500,
    blinkMs = 500,
  } = opts;

  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"type" | "hold-full" | "delete" | "hold-empty">("type");
  const [cursorOn, setCursorOn] = useState(true);

  // Cursor blink
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => setCursorOn(v => !v), blinkMs);
    return () => clearInterval(id);
  }, [enabled, blinkMs]);

  // Motor
  useEffect(() => {
    if (!enabled || items.length === 0) {
      setText("");
      setPhase("type");
      return;
    }
    const current = items[i % items.length];

    let t: number | undefined;

    const rand = (a: number, b: number) => Math.floor(a + Math.random() * (b - a));

    if (phase === "type") {
      if (text.length < current.length) {
        t = window.setTimeout(() => {
          setText(current.slice(0, text.length + 1));
        }, rand(typingMinMs, typingMaxMs));
      } else {
        t = window.setTimeout(() => setPhase("hold-full"), holdOnFullMs);
      }
    } else if (phase === "hold-full") {
      t = window.setTimeout(() => setPhase("delete"), holdOnFullMs);
    } else if (phase === "delete") {
      if (text.length > 0) {
        t = window.setTimeout(() => {
          setText(current.slice(0, text.length - 1));
        }, rand(deletingMinMs, deletingMaxMs));
      } else {
        t = window.setTimeout(() => {
          setPhase("hold-empty");
          setI((i + 1) % items.length);
        }, 0);
      }
    } else if (phase === "hold-empty") {
      t = window.setTimeout(() => setPhase("type"), holdOnEmptyMs);
    }

    return () => { if (t) clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, items, i, text, phase]);

  return enabled ? (text + (cursorOn ? " ▋" : "")) : "";
}

/* ---------- Componente ---------- */
export default function FancyInput({
                                     value,
                                     onChange,
                                     onSubmit,
                                     placeholder,
                                     minRows = 1,
                                     maxRows = 6,
                                   }: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  const { height } = useAutosizeStable(containerRef, taRef, value, { minRows, maxRows });

  const [focus, setFocus] = useState(false);
  const [listening, setListening] = useState(false);
  const canSend = value.trim().length > 0;
  const demoPlaceholders = useMemo(
    () => [
      "I'm feeling low—suggest a 20-min feel-good show.",
      "Recommend a mind-bending sci-fi movie under 2 hours.",
      "I’ve got 10 minutes. A short documentary about space?",
      "Something spooky but not too gory for tonight.",
      "Find a cozy comedy series like The Office.",
    ],
    []
  );

  const suggestions = useMemo(
    () => ["Make me feel better", "A 20-min thriller", "Feel-good comedy", "Documentary about space"],
    [],
  );

  const typedPlaceholder = useTypewriterPlaceholder(
    demoPlaceholders,
    value.trim().length === 0
  );

  // Mic (tu lógica original)
  useEffect(() => {
    let rec: any;
    if (!listening) return;
    const W = window as any;
    const Speech = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!Speech) { setListening(false); return; }
    rec = new Speech();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.onresult = (e: any) => {
      const t = Array.from(e.results).map((r: any) => r[0].transcript).join(" ");
      onChange(t);
    };
    rec.onend = () => setListening(false);
    rec.start();
    return () => { try { rec.stop(); } catch {} };
  }, [listening, onChange]);

  const submit = () => { if (canSend) onSubmit(); };

  return (
    <Stack spacing={1} sx={{ mb: 2 }}>
      <Typography sx={{ fontWeight: 'bold', width: '100%', textAlign: 'center', mt: 2, mb: 2 }}>What do you want to watch today?</Typography>
      <Shell className={focus ? "focus" : ""}>
        <Composer ref={containerRef}>
          {/* Textarea */}
          <Ta
            ref={taRef}
            value={value}
            placeholder={typedPlaceholder || (placeholder ?? "Describe what you want to watch…")}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
            }}
            rows={minRows}
            style={{
              height,
              position: "relative",
              width: "100%",
              maxWidth: "100%",
              paddingLeft: 12,
              paddingRight: 12,
              paddingTop: BASE_PADDING_Y,
              paddingBottom: 12,
              marginBottom: 0,
            }}
            aria-label="Prompt"
            aria-multiline="true"
          />

          <Topbar aria-hidden>
            <div className="clickable">
              <Tooltip title="Let AI enhance your prompt">
                <span><icons.IconWand size={18} /></span>
              </Tooltip>
            </div>

            <div className="clickable" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Tooltip title={listening ? "Listening… click to stop" : "Speak your request"}>
                <IconButton size="small" onClick={() => setListening(v => !v)}>
                  {listening ? <icons.IconMicrophoneFilled size={18} /> : <icons.IconMicrophone size={18} />}
                </IconButton>
              </Tooltip>
              <Tooltip title={canSend ? "Send" : "Type something to send"}>
                <SendBtn disabled={!canSend} onClick={submit} aria-label="Send">
                  <icons.IconArrowUp size={18} />
                </SendBtn>
              </Tooltip>
            </div>
          </Topbar>
        </Composer>
      </Shell>

      <Typography variant="caption" color="text.secondary">Try:</Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {suggestions.map((s) => (
          <Tooltip key={s} title="Click to use this idea">
            <Chip label={s} variant="outlined" onClick={() => onChange(s)} sx={{ mb: 0.5 }} />
          </Tooltip>
        ))}
      </Stack>
    </Stack>
  );
}
