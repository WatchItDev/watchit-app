import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import { icons } from '@tabler/icons-react';
import { useRouter } from '@src/routes/hooks';
import { paths } from '@src/routes/paths';
import type { Post } from '@src/graphql/generated/graphql';
import { getAttachmentCid, getMediaUri } from '@src/utils/publication';

type Props = {
  title: string;
  posts: Post[];
  span: { w: number; h: number }; // celdas 1x1 asignadas por el grid
  cell: number;                   // px por celda (de useGridSizing)
  gapPx?: number;                 // opcional, para cálculos finos
  loading?: boolean;
};

// === util: tamaño del contenedor ===
function useElementRect<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [rect, setRect] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const r = entry.contentRect;
      setRect({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, rect };
}

// === util: elegir layout por espacio ===
type Variant = 'mini' | 'compact' | 'standard' | 'hero';
function chooseVariant(w: number, h: number): Variant {
  if (h < 180 || w < 260) return 'mini';
  if (h < 260 || w < 380) return 'compact';
  if (h >= 420 && w >= 700) return 'hero';
  return 'standard';
}

// === util: imagen a usar según forma ===
function pickImage(post: Post, w: number, h: number) {
  const sq = getAttachmentCid(post as any, 'square') || getAttachmentCid(post as any, 'poster');
  const wp = getAttachmentCid(post as any, 'wallpaper');
  const useWallpaper = w / Math.max(1, h) >= 1.4 && wp; // ancho ≥ 1.4 → wallpaper si existe
  const src = getMediaUri(useWallpaper ? wp : sq);
  return { src, kind: useWallpaper ? 'wallpaper' : 'poster' as const };
}

// === componente principal ===
export default function AdaptiveSlider({
                                           title,
                                           posts,
                                           span,
                                           cell,
                                           gapPx = 12,
                                         }: Props) {
  const { ref, rect } = useElementRect<HTMLDivElement>();
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState<{ x: number; active: boolean }>({ x: 0, active: false });
  const router = useRouter();

  // ancho/alto reales del bloque
  const W = Math.max(0, span.w * cell + (span.w - 1) * gapPx);
  const H = Math.max(0, span.h * cell + (span.h - 1) * gapPx);

  const variant = chooseVariant(rect.w || W, rect.h || H);
  const total = posts?.length ?? 0;
  const current = posts?.[index];

  useEffect(() => {
    if (index >= total) setIndex(0);
  }, [total, index]);

  // teclado ← →
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + total) % Math.max(1, total));
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % Math.max(1, total));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [total]);

  const onPrev = () => setIndex((i) => (i - 1 + total) % Math.max(1, total));
  const onNext = () => setIndex((i) => (i + 1) % Math.max(1, total));

  // swipe táctil / mouse
  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as any).setPointerCapture?.(e.pointerId);
    setDrag({ x: e.clientX, active: true });
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag.active) return;
    const dx = e.clientX - drag.x;
    const threshold = Math.max(40, (rect.w || W) * 0.15);
    if (dx > threshold) onPrev();
    else if (dx < -threshold) onNext();
    setDrag({ x: 0, active: false });
  };

  const goTo = (post?: Post) => {
    if (!post) return;
    router.push(paths.dashboard.publication.details(post.id));
  };

  const { src, kind } = current ? pickImage(current, rect.w || W, rect.h || H) : { src: '', kind: 'poster' as const };
  const author =
    (current as any)?.author?.displayName ??
    (current as any)?.owner?.displayName ??
    (current as any)?.author?.username ??
    'Unknown';

  // densidad de contenido por variante
  const linesDesc = variant === 'hero' ? 5 : variant === 'standard' ? 3 : variant === 'compact' ? 2 : 0;
  const showActions = variant !== 'mini';
  const showAuthor = variant !== 'mini';
  const showMeta = variant === 'hero' || variant === 'standard';
  const showBackdrop = variant !== 'mini' && kind === 'wallpaper';

  return (
    <Stack sx={{ height: '100%' }} spacing={1}>
      {/* Header con título y progresión */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 0.5 }}>
        <Typography variant="h6">{title}</Typography>
        {total > 1 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 120 }}>
            <Typography variant="caption">{index + 1}/{total}</Typography>
            <Box sx={{ flex: 1 }}>
              <LinearProgress
                variant="determinate"
                value={total ? ((index + 1) / total) * 100 : 0}
                sx={{ height: 6, borderRadius: 999 }}
              />
            </Box>
          </Box>
        )}
      </Box>

      {/* Área del slide */}
      <Box
        ref={ref}
        sx={{
          position: 'relative',
          flex: 1,
          minHeight: 160,
          borderRadius: 2,
          overflow: 'hidden',
          // fondo
          backgroundColor: '#000',
        }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {/* Imagen de fondo */}
        {current && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: showBackdrop ? 'blur(6px) brightness(0.9)' : 'none',
              transform: showBackdrop ? 'scale(1.05)' : 'none',
              transition: 'opacity 240ms ease',
              opacity: 1,
            }}
          />
        )}

        {/* Capa de oscurecido para contraste de textos */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              variant === 'mini'
                ? `linear-gradient(180deg, ${alpha('#000', 0)} 40%, ${alpha('#000', 0.75)} 100%)`
                : `linear-gradient(180deg, ${alpha('#000', 0.35)} 0%, ${alpha('#000', 0.8)} 100%)`,
          }}
        />

        {/* Contenido según variante */}
        {current && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: variant === 'standard' || variant === 'hero' ? 'row' : 'column',
              alignItems: 'stretch',
              justifyContent: 'flex-end',
              gap: 2,
              p: { xs: 1.25, sm: 2, md: 2.5 },
            }}
          >
            {/* Poster en variantes con split o si no hay wallpaper */}
            {(variant === 'standard' || variant === 'hero' || kind !== 'wallpaper') && (
              <Box
                sx={{
                  alignSelf: variant === 'mini' ? 'flex-end' : 'center',
                  width:
                    variant === 'hero' ? { xs: '38%', md: '34%' } :
                      variant === 'standard' ? { xs: '36%', md: '32%' } : '40%',
                  maxWidth: 420,
                  minWidth: variant === 'mini' ? 120 : 120,
                  aspectRatio: '2 / 3',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: 3,
                  backgroundImage: `url(${getMediaUri(getAttachmentCid(current as any, 'square') || getAttachmentCid(current as any, 'poster'))})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: (variant === 'mini' || variant === 'compact') && kind === 'wallpaper' ? 'none' : 'block',
                }}
              />
            )}

            {/* Texto / acciones */}
            <Stack
              spacing={variant === 'hero' ? 1.25 : 0.75}
              sx={{
                flex: 1,
                color: '#fff',
                justifyContent: 'flex-end',
              }}
            >
              {/* Título */}
              <Typography
                variant={variant === 'hero' ? 'h3' : variant === 'standard' ? 'h4' : 'h5'}
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.1,
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: variant === 'mini' ? 1 : 2,
                  overflow: 'hidden',
                }}
              >
                {current.title ?? ''}
              </Typography>

              {/* Autor / meta */}
              {showAuthor && (
                <Typography
                  variant="caption"
                  sx={{
                    opacity: 0.9,
                    bgcolor: alpha('#000', 0.5),
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    alignSelf: 'flex-start',
                  }}
                >
                  by {author}
                </Typography>
              )}
              {showMeta && (
                <Stack direction="row" spacing={1.5} sx={{ opacity: 0.95 }}>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <icons.IconHeart size={16} /> <Typography variant="caption">{(current as any).likeCount ?? 0}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <icons.IconEye size={16} /> <Typography variant="caption">{(current as any).viewCount ?? 0}</Typography>
                  </Stack>
                  {(current as any).duration && (
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <icons.IconClock size={16} /> <Typography variant="caption">{(current as any).duration}</Typography>
                    </Stack>
                  )}
                </Stack>
              )}

              {/* Descripción (según espacio) */}
              {linesDesc > 0 && (
                <Typography
                  variant={variant === 'hero' ? 'h6' : 'body2'}
                  sx={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: linesDesc,
                    overflow: 'hidden',
                    opacity: 0.9,
                  }}
                >
                  {current.description ?? ''}
                </Typography>
              )}

              {/* Acciones */}
              {showActions && (
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => goTo(current)}
                    startIcon={<icons.IconPlayerPlay size={18} />}
                    sx={{ color: '#000', fontWeight: 700 }}
                  >
                    Watch now
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => goTo(current)}
                    startIcon={<icons.IconInfoCircle size={18} />}
                  >
                    Details
                  </Button>
                </Stack>
              )}
            </Stack>
          </Box>
        )}

        {/* Controles izquierda/derecha */}
        {total > 1 && (
          <>
            <IconButton
              onClick={onPrev}
              size="small"
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: alpha('#000', 0.5),
                color: '#fff',
                '&:hover': { bgcolor: alpha('#000', 0.7) },
              }}
            >
              <icons.IconChevronLeft />
            </IconButton>
            <IconButton
              onClick={onNext}
              size="small"
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: alpha('#000', 0.5),
                color: '#fff',
                '&:hover': { bgcolor: alpha('#000', 0.7) },
              }}
            >
              <icons.IconChevronRight />
            </IconButton>
          </>
        )}
      </Box>
    </Stack>
  );
}
