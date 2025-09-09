import React, { useMemo, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { icons } from '@tabler/icons-react';

import FancyInput from './components/fancy-input.tsx';
import MoodPickerInline from './components/mood-picker-inline.tsx';
import TimePickerInline from './components/time-picker-inline.tsx';
import OnboardingCarousel from './components/onboarding-carousel.tsx';
import ProcessingOverlay from './components/processing-overlay.tsx';
import { useWidget } from './context/widget-context.tsx';
import { WidgetProvider } from '@src/components/ai-widget/context/widget-context.tsx';
import WidgetLauncher from '@src/components/ai-widget/components/widget-launcher.tsx';
import WidgetPanel from '@src/components/ai-widget/components/widget-panel.tsx';

export function WidgetHome() {
  const { state, dispatch } = useWidget();
  const [value, setValue] = useState(state.selection.prompt ?? '');

  const explore = () => {
    dispatch({ type: 'SET_PROMPT', prompt: value });
    dispatch({ type: 'SET_PROCESSING', value: true });
    try { window.dispatchEvent(new CustomEvent('watchit:explore', { detail: { selection: { ...state.selection, prompt: value } } })); } catch {}
    setTimeout(() => dispatch({ type: 'SET_PROCESSING', value: false }), 1100);
  };

  const showLearnMore = () => dispatch({ type: 'SET_ONBOARDING', show: true });

  // View router: show only ONE view at a time
  const view: 'onboarding' | 'mood' | 'time' | 'prompt' = useMemo(() => {
    if (state.ui.showOnboarding) return 'onboarding';
    if (state.ui.showMoodPanel) return 'mood';
    if (state.ui.showTimePanel) return 'time';
    return 'prompt';
  }, [state.ui.showOnboarding, state.ui.showMoodPanel, state.ui.showTimePanel]);

  return (
    <>
      <ProcessingOverlay open={state.ui.processing} />

      {view === 'onboarding' && (
        <Stack>
          <OnboardingCarousel onDone={() => dispatch({ type: 'SET_ONBOARDING', show: false })} />
        </Stack>
      )}

      {view === 'mood' && (
        <Stack>
          <MoodPickerInline />
          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
            <Tooltip title="Done">
              <Button variant="contained" size="small" onClick={() => dispatch({ type: 'TOGGLE_MOOD_PANEL' })}>Done</Button>
            </Tooltip>
          </Stack>
        </Stack>
      )}

      {view === 'time' && (
        <Stack>
          <TimePickerInline />
          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
            <Tooltip title="Done">
              <Button variant="contained" size="small" onClick={() => dispatch({ type: 'TOGGLE_TIME_PANEL' })}>Done</Button>
            </Tooltip>
          </Stack>
        </Stack>
      )}

      {view === 'prompt' && (
        <>
          <FancyInput value={value} onChange={setValue} onSubmit={explore} />
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Tooltip title="Learn what Watchit can do">
              <Button
                size="small"
                onClick={showLearnMore}
                startIcon={<icons.IconInfoCircle size={16} />}
                sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.16)' } }}
              >
                Learn more
              </Button>
            </Tooltip>
            {/*<Tooltip title="Send to AI and refresh the grid">*/}
            {/*  <div>*/}
            {/*    <GradientOutlineButton onClick={explore} endIcon={<icons.IconSparkles size={18} />}>Explore content</GradientOutlineButton>*/}
            {/*  </div>*/}
            {/*</Tooltip>*/}
          </Stack>
        </>
      )}
    </>
  );
}

export default function WatchitWidget() {
  return (
    <WidgetProvider>
      <Entry />
    </WidgetProvider>
  );
}

function Entry() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <WidgetLauncher onOpen={() => setOpen(true)} />
      <WidgetPanel open={open} onClose={() => setOpen(false)}>
        <WidgetHome />
      </WidgetPanel>
    </>
  );
}
