export function GlassDefs() {
  // Definición del filtro SVG para una ligera “ondulación” líquida
  // Renderízalo una vez en el árbol (layout o vista raíz).
  return (
    <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }} aria-hidden>
      <filter id="watchit-glass-refraction" primitiveUnits="objectBoundingBox">
        {/* Mapa de ruido sutil para refraction */}
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="1" seed="9" result="map" />
        {/* Ligero blur del contenido del panel */}
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.04" result="blur" />
        {/* Pequeña refracción (líquido) */}
        <feDisplacementMap in="blur" in2="map" scale="0.6" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}

export default GlassDefs;
