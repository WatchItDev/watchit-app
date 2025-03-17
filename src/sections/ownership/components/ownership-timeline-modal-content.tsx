import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import {FC, useEffect, useState} from 'react'
import {Button, DialogActions, LinearProgress} from '@mui/material'
import {
  OwnershipSettingsModalContentProps,
  OwnershipTimelineItemProps,
} from "@src/sections/ownership/types.ts"
import Timeline from '@mui/lab/Timeline';
import {timelineItemClasses} from '@mui/lab/TimelineItem'

import {OwnershipTimelineItem} from "@src/sections/ownership/components/ownership-timeline-modal-item.tsx"

const list: OwnershipTimelineItemProps[] = [
  {
    id: '1',
    title: '0x9d1f...4751DD listed for',
    time: new Date(),
    type: 'order1',
  },
  {
    id: '2',
    title: '0x9d1f...4751DD transferred to 0x9d1f...4751DD',
    time: new Date(),
    type: 'order2',
  },
  {
    id: '3',
    title: '0x9d1f...4751DD transferred to 0x212121....',
    time: new Date(),
    type: 'order2',
  },
  {
    id: '4',
    title: '0x9d1f...4751DD transferred to 0x9d1f...4751DD',
    time: new Date(),
    type: 'order2',
  },
  ]

// ----------------------------------------------------------------------
const OwnershipTimelineModalContent: FC<OwnershipSettingsModalContentProps> = (props) => {
  const { onClose } = props;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [])

 return (
    <>


      <Divider sx={{ padding: '0.3rem 0', mb: 1, borderStyle: 'dashed' }} />

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <Grid container spacing={2} sx={{ mb: 2, px: 2, m: 0, width: '100%' }}>
        <Timeline
          sx={{
            m: 0,
            p: 1,
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }}
        >
          {list.map((item, index) => (
            <OwnershipTimelineItem key={item.id} item={item} lastTimeline={index === list.length - 1} />
          ))}
        </Timeline>
      </Grid>

      <Divider sx={{ padding: '0.3rem 0', borderStyle: 'dashed' }} />

      <DialogActions sx={{ px: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </>
  );
};

export {OwnershipTimelineModalContent};
