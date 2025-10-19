import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  PointerEvent as ReactPointerEvent,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import { icons } from '@tabler/icons-react';
import { useRouter } from '@src/routes/hooks';
import { paths } from '@src/routes/paths';
import type { Post } from '@src/graphql/generated/graphql';
import { getAttachmentCid, getMediaUri } from '@src/utils/publication';

// ==================== Props / Types ====================

type Props = {
  title: string;
  posts: Post[];
  span: { w: number; h: number };
  cell: number;
  gapPx?: number;
  loading?: boolean;

  // nuevo (opcional)
  autoPlayMs?: number;     // default 6000
  pauseOnHover?: boolean;  // default true
  onPostSelect?: (post: Post) => void;
};

type Variant = 'mini' | 'compact' | 'standard' | 'hero';

export type SliderVariantProps = Pick<Props, 'span' | 'cell' | 'gapPx' | 'onPostSelect'>;

// ==================== Hooks utilitarios ====================

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

function chooseVariant(w: number, h: number): Variant {
  if (h < 180 || w < 260) return 'mini';
  if (h < 260 || w < 380) return 'compact';
  if (h >= 420 && w >= 700) return 'hero';
  return 'standard';
}

function pickImage(post: Post, w: number, h: number) {
  const sq = getAttachmentCid(post as any, 'square') || getAttachmentCid(post as any, 'poster');
  const wp = getAttachmentCid(post as any, 'wallpaper');
  const useWallpaper = w / Math.max(1, h) >= 1.4 && !!wp;
  const src = getMediaUri(useWallpaper ? wp : sq);
  return { src, kind: (useWallpaper ? 'wallpaper' : 'poster') as const };
}

// autoplay con pausa por hover o drag
function useAutoplay(enabled: boolean, delayMs: number, tick: () => void) {
  useEffect(() => {
    if (!enabled) return;
    let id = window.setInterval(tick, delayMs);

    const onVisibility = () => {
      // pausa cuando la pestaña no está visible
      if (document.hidden) {
        window.clearInterval(id);
      } else {
        window.clearInterval(id);
        id = window.setInterval(tick, delayMs);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [enabled, delayMs, tick]);
}

// ==================== Subcomponentes ====================

function ProgressDots({
                        total,
                        current,
                        onSelect,
                      }: {
  total: number;
  current: number;
  onSelect?: (i: number) => void;
}) {
  if (total <= 1) return null;
  const arr = Array.from({ length: total }, (_, i) => i);
  return (
    <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
      {arr.map((i) => (
        <Box
          key={i}
          role={onSelect ? 'button' : undefined}
          aria-label={`Ir al slide ${i + 1}`}
          onClick={onSelect ? () => onSelect(i) : undefined}
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: '#fff',
            opacity: i === current ? 1 : 0.35,
            transform: i === current ? 'scale(1)' : 'scale(0.9)',
            transition: 'opacity 160ms ease, transform 160ms ease',
            cursor: onSelect ? 'pointer' : 'default',
          }}
        />
      ))}
    </Stack>
  );
}

function SliderHeader({
                        title,
                        total,
                        index,
                        onDotClick,
                      }: {
  title: string;
  total: number;
  index: number;
  onDotClick?: (i: number) => void;
}) {
  return (
    <Box
      // header absoluto sobre el slider
      sx={{
        position: 'absolute',
        inset: 0,
        p: { xs: 1, sm: 1.25, md: 1.5 },
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        pointerEvents: 'none', // el contenedor no captura, sólo sus hijos
        zIndex: 3,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 40%)',
      }}
      data-interactive="true" // permite excluir de drag
    >
      <Typography
        variant="h6"
        sx={{ color: '#fff', fontWeight: 700, pointerEvents: 'auto', pr: 1, textShadow: '0 1px 2px rgba(0,0,0,.4)' }}
      >
        {title}
      </Typography>

      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', color: '#fff', pointerEvents: 'auto' }}
      >
        <Typography variant="caption" sx={{ opacity: 0.9 }}>
          {index + 1}/{total}
        </Typography>
        <ProgressDots total={total} current={index} onSelect={onDotClick} />
      </Stack>
    </Box>
  );
}

// Layouts separados para tunear fácil
function VerticalStackLayout({
                               current,
                               linesDesc,
                               showAuthor,
                               showMeta,
                               showActions,
                               onPrimary,
                               onDetails,
                             }: {
  current: Post;
  linesDesc: number;
  showAuthor: boolean;
  showMeta: boolean;
  showActions: boolean;
  onPrimary: () => void;
  onDetails: () => void;
}) {
  const author =
    (current as any)?.author?.displayName ??
    (current as any)?.owner?.displayName ??
    (current as any)?.author?.username ??
    'Unknown';

  return (
    <Stack
      spacing={1.25}
      sx={{
        position: 'absolute',
        inset: 0,
        p: { xs: 1.25, sm: 2, md: 2.5 },
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'flex-end',
        color: '#fff',
      }}
    >
      {/* Poster cuadrado arriba */}
      <Box
        sx={{
          alignSelf: 'center',
          width: '70%',
          maxWidth: 420,
          aspectRatio: '1 / 1',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: 3,
          backgroundImage: `url(${getMediaUri(
            getAttachmentCid(current as any, 'square') || getAttachmentCid(current as any, 'poster')
          )})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Contenido debajo */}
      <Stack spacing={1} sx={{ textAlign: 'left', alignItems: 'flex-start' }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            lineHeight: 1.1,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            overflow: 'hidden',
          }}
        >
          {current.title ?? ''}
        </Typography>

        {showAuthor && (
          <Typography
            variant="caption"
            sx={{
              opacity: 0.95,
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
              <icons.IconHeart size={16} />{' '}
              <Typography variant="caption">{(current as any).likeCount ?? 0}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <icons.IconEye size={16} />{' '}
              <Typography variant="caption">{(current as any).viewCount ?? 0}</Typography>
            </Stack>
            {(current as any).duration && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <icons.IconClock size={16} />{' '}
                <Typography variant="caption">{(current as any).duration}</Typography>
              </Stack>
            )}
          </Stack>
        )}

        {/*{linesDesc > 0 && (*/}
        {/*  <Typography*/}
        {/*    variant="body2"*/}
        {/*    sx={{*/}
        {/*      display: '-webkit-box',*/}
        {/*      WebkitBoxOrient: 'vertical',*/}
        {/*      WebkitLineClamp: linesDesc,*/}
        {/*      overflow: 'hidden',*/}
        {/*      opacity: 0.9,*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    {current.description ?? ''}*/}
        {/*  </Typography>*/}
        {/*)}*/}

        {/*{showActions && (*/}
        {/*  <Stack direction="row" spacing={1} data-interactive="true">*/}
        {/*    <Button*/}
        {/*      variant="contained"*/}
        {/*      color="primary"*/}
        {/*      onClick={onPrimary}*/}
        {/*      startIcon={<icons.IconPlayerPlay size={18} />}*/}
        {/*      sx={{ color: '#000', fontWeight: 700 }}*/}
        {/*    >*/}
        {/*      Watch now*/}
        {/*    </Button>*/}
        {/*    <Button*/}
        {/*      variant="outlined"*/}
        {/*      color="inherit"*/}
        {/*      onClick={onDetails}*/}
        {/*      startIcon={<icons.IconInfoCircle size={18} />}*/}
        {/*    >*/}
        {/*      Details*/}
        {/*    </Button>*/}
        {/*  </Stack>*/}
        {/*)}*/}
      </Stack>
    </Stack>
  );
}

function SplitLayout({
                       current,
                       variant,
                       linesDesc,
                       showAuthor,
                       showMeta,
                       showActions,
                       onPrimary,
                       onDetails,
                       kind,
                     }: {
  current: Post;
  variant: Variant;
  linesDesc: number;
  showAuthor: boolean;
  showMeta: boolean;
  showActions: boolean;
  onPrimary: () => void;
  onDetails: () => void;
  kind: 'poster' | 'wallpaper';
}) {
  const author =
    (current as any)?.author?.displayName ??
    (current as any)?.owner?.displayName ??
    (current as any)?.author?.username ??
    'Unknown';

  return (
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
      {(variant === 'standard' || variant === 'hero' || kind !== 'wallpaper') && (
        <Box
          sx={{
            alignSelf: variant === 'mini' ? 'flex-end' : 'center',
            width:
              variant === 'hero'
                ? { xs: '38%', md: '34%' }
                : variant === 'standard'
                  ? { xs: '36%', md: '32%' }
                  : '40%',
            maxWidth: 420,
            minWidth: variant === 'mini' ? 120 : 120,
            aspectRatio: '2 / 3',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 3,
            backgroundImage: `url(${getMediaUri(
              getAttachmentCid(current as any, 'wallpaper') || getAttachmentCid(current as any, 'wallpaper')
            )})`,
            filter: 'blur(24px) brightness(0.9)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: (variant === 'mini' || variant === 'compact') && kind === 'wallpaper' ? 'none' : 'block',
          }}
        />
      )}

      <Stack
        spacing={variant === 'hero' ? 1.25 : 0.75}
        sx={{
          flex: 1,
          color: '#fff',
          justifyContent: 'flex-end',
        }}
      >
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
              <icons.IconHeart size={16} />{' '}
              <Typography variant="caption">{(current as any).likeCount ?? 0}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <icons.IconEye size={16} />{' '}
              <Typography variant="caption">{(current as any).viewCount ?? 0}</Typography>
            </Stack>
            {(current as any).duration && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <icons.IconClock size={16} />{' '}
                <Typography variant="caption">{(current as any).duration}</Typography>
              </Stack>
            )}
          </Stack>
        )}

        {/*{linesDesc > 0 && (*/}
        {/*  <Typography*/}
        {/*    variant={variant === 'hero' ? 'h6' : 'body2'}*/}
        {/*    sx={{*/}
        {/*      display: '-webkit-box',*/}
        {/*      WebkitBoxOrient: 'vertical',*/}
        {/*      WebkitLineClamp: linesDesc,*/}
        {/*      overflow: 'hidden',*/}
        {/*      opacity: 0.9,*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    {current.description ?? ''}*/}
        {/*  </Typography>*/}
        {/*)}*/}

        {/*{showActions && (*/}
        {/*  <Stack direction="row" spacing={1} data-interactive="true">*/}
        {/*    <Button*/}
        {/*      variant="contained"*/}
        {/*      color="primary"*/}
        {/*      onClick={onPrimary}*/}
        {/*      startIcon={<icons.IconPlayerPlay size={18} />}*/}
        {/*      sx={{ color: '#000', fontWeight: 700 }}*/}
        {/*    >*/}
        {/*      Watch now*/}
        {/*    </Button>*/}
        {/*    <Button*/}
        {/*      variant="outlined"*/}
        {/*      color="inherit"*/}
        {/*      onClick={onDetails}*/}
        {/*      startIcon={<icons.IconInfoCircle size={18} />}*/}
        {/*    >*/}
        {/*      Details*/}
        {/*    </Button>*/}
        {/*  </Stack>*/}
        {/*)}*/}
      </Stack>
    </Box>
  );
}

// ==================== Componente principal ====================

export default function AdaptiveSlider({
                                         title,
                                         posts,
                                         span,
                                         cell,
                                         gapPx = 12,
                                         loading,
                                         autoPlayMs = 6000,
                                         pauseOnHover = true,
                                         onPostSelect,
                                       }: Props) {
  const { ref, rect } = useElementRect<HTMLDivElement>();
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState<{ x: number; active: boolean }>({ x: 0, active: false });
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  const W = Math.max(0, span.w * cell + (span.w - 1) * gapPx);
  const H = Math.max(0, span.h * cell + (span.h - 1) * gapPx);

  const vw = rect.w || W;
  const vh = rect.h || H;

  const ratio = vw / Math.max(1, vh);
  const isSquareContainer = Math.abs(ratio - 1) <= 0.2; // ≈ cuadrado
  const variant: Variant = chooseVariant(vw, vh);
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

  const goTo = (post?: Post) => {
    if (!post) return;
    router.push(paths.dashboard.publication.details(post.id));
  };

  const { src, kind } = current
    ? pickImage(current, vw, vh)
    : { src: '', kind: 'poster' as const };

  // densidad de contenido por variante
  const linesDesc = variant === 'hero' ? 5 : variant === 'standard' ? 3 : variant === 'compact' ? 2 : 0;
  const showActions = variant !== 'mini';
  const showAuthor = variant !== 'mini';
  const showMeta = variant === 'hero' || variant === 'standard';
  const showBackdrop = variant !== 'mini' && kind === 'wallpaper';

  // ====== Swipe / drag: no capturar sobre UI interactiva ======
  const isInteractiveTarget = (el: EventTarget | null) => {
    return el instanceof HTMLElement && !!el.closest('[data-interactive="true"],button,a,[role="button"]');
  };

  const selectCurrentPost = useCallback(() => {
    if (current) onPostSelect?.(current);
  }, [current, onPostSelect]);
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (isInteractiveTarget(e.target)) {
      if (drag.active) setDrag({ x: 0, active: false });
      return; // no iniciar drag encima de UI
    }
    (e.currentTarget as any).setPointerCapture?.(e.pointerId);
    setDrag({ x: e.clientX, active: true });
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.active) return;
    if ((e.currentTarget as any).releasePointerCapture) {
      try {
        (e.currentTarget as any).releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }
    const dx = e.clientX - drag.x;
    const threshold = Math.max(40, vw * 0.15);
    if (dx > threshold) {
      onPrev();
    } else if (dx < -threshold) {
      onNext();
    }
    setDrag({ x: 0, active: false });
  };
  const onPointerCancel = (e: ReactPointerEvent<HTMLDivElement>) => {
    if ((e.currentTarget as any).releasePointerCapture) {
      try {
        (e.currentTarget as any).releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }
    setDrag({ x: 0, active: false });
  };

  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (!onPostSelect) return;
      if (e.target !== e.currentTarget) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectCurrentPost();
      }
    },
    [onPostSelect, selectCurrentPost]
  );

  const handleClick = useCallback(() => {
      selectCurrentPost();
    },
    [selectCurrentPost]
  );

  // ====== Autoplay (pausa por hover/drag) ======
  const autoplayEnabled = total > 1 && (!pauseOnHover || !hovered) && !drag.active;
  useAutoplay(autoplayEnabled, autoPlayMs, () => {
    setIndex((i) => (i + 1) % Math.max(1, total));
  });

  // memo layout element
  const Layout = useMemo(() => {
    if (isSquareContainer) return 'vertical' as const;
    return 'split' as const;
  }, [isSquareContainer]);

  return (
    <Stack sx={{ height: '100%', position: 'relative' }} spacing={0}>
      <Box
        ref={ref}
        sx={{
          position: 'relative',
          flex: 1,
          minHeight: 160,
          borderRadius: 2,
          overflow: 'hidden',
          backgroundColor: '#000',
          touchAction: 'pan-y', // permite scroll vertical en táctil
          // asegúrate de que el header se vea encima
          '& [data-interactive="true"]': { zIndex: 4, pointerEvents: 'auto' },
          cursor: onPostSelect ? 'pointer' : 'default',
        }}
        onClick={handleClick}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onKeyDown={handleKeyDown}
        role={onPostSelect ? 'button' : undefined}
        tabIndex={onPostSelect ? 0 : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* BG */}
        {current && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(24px) brightness(0.9)',
              transform: showBackdrop ? 'scale(1.05)' : 'none',
              transition: 'opacity 240ms ease',
              opacity: 1,
              zIndex: 0,
            }}
          />
        )}

        {/* Header absoluto con dots */}
        <SliderHeader
          title={title}
          total={total}
          index={index}
          onDotClick={(i) => setIndex(i)}
        />

        {/* Contenido */}
        {current && (
          <>
            {Layout === 'vertical' ? (
              <VerticalStackLayout
                current={current}
                linesDesc={linesDesc}
                showAuthor={showAuthor}
                showMeta={showMeta}
                showActions={showActions}
                onPrimary={() => goTo(current)}
                onDetails={() => goTo(current)}
              />
            ) : (
              <SplitLayout
                current={current}
                variant={variant}
                linesDesc={linesDesc}
                showAuthor={showAuthor}
                showMeta={showMeta}
                showActions={showActions}
                onPrimary={() => goTo(current)}
                onDetails={() => goTo(current)}
                kind={kind}
              />
            )}
          </>
        )}

        {/* Controles */}
        {total > 1 && (
          <>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              size="small"
              data-interactive="true"
              onPointerDown={(e) => {
                e.stopPropagation();
                if (drag.active) setDrag({ x: 0, active: false });
              }}
              onPointerUp={(e) => e.stopPropagation()}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: alpha('#000', 0.5),
                color: '#fff',
                '&:hover': { bgcolor: alpha('#000', 0.7) },
                zIndex: 4,
              }}
            >
              <icons.IconChevronLeft />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              size="small"
              data-interactive="true"
              onPointerDown={(e) => {
                e.stopPropagation();
                if (drag.active) setDrag({ x: 0, active: false });
              }}
              onPointerUp={(e) => e.stopPropagation()}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: alpha('#000', 0.5),
                color: '#fff',
                '&:hover': { bgcolor: alpha('#000', 0.7) },
                zIndex: 4,
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
