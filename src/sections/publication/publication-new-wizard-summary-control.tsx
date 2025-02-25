// @mui
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
// utils
import {fCurrency} from "@src/utils/format-number";
import {IconCheck} from "@tabler/icons-react";
import Scrollbar from "../../components/scrollbar";

// ----------------------------------------------------------------------

interface Props {
  data: any;
}

export default function PublicationNewWizardSummaryControl({data}: Props) {
  const renderSection = (title: string, items: any) => {
    const filteredItems = items.filter((item: any) => item.value);

    if (filteredItems.length === 0) {
      return null;
    }

    return (
      <Section title={title}>
        {filteredItems.map((item: any, index: number) => (
          <InfoItem key={index} label={item.label} value={item.value} />
        ))}
      </Section>
    );
  };

  function formatDate(date: any) {
    if (date)
      return new Date(date).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

    return undefined as any;
  }

  const basicInfoItems = [
    {label: "Title", value: data?.title},
    {label: "Description", value: data?.description},
    {label: "Genre", value: data?.genre?.join?.(", ")},
    {label: "Release Date", value: formatDate(data?.releaseDate)},
    {label: "Duration", value: data?.duration ? `${data?.duration} minutes` : null},
    {label: "Language", value: data?.language},
    {label: "Country", value: data?.country},
    {label: "Rating", value: data?.rating},
    {label: "Format", value: data?.format},
    {label: "Studio Name", value: data?.studioName},
    {label: "Filming Location", value: data?.filmingLocation},
    {label: "Budget", value: fCurrency(data?.budget)},
    {label: "Filming Start", value: formatDate(data?.filmingStart)},
    {label: "Filming End", value: formatDate(data?.filmingEnd)},
    {label: "Director", value: data?.director},
    {label: "Writer", value: data?.writer},
    {label: "Producers", value: data?.producers},
    {label: "Editor", value: data?.editor},
    {label: "Sound Engineer", value: data?.soundEngineer},
    {label: "VFX Supervisor", value: data?.vfxSupervisor},
    {label: "Lead Actor", value: data?.leadActor},
    {label: "Supporting Actor", value: data?.supportingActor},
    {label: "Supporting Actress", value: data?.supportingActress},
  ];

  const mediaAssetsItems = [
    {
      label: "Vertical Poster",
      value: data?.verticalPoster && <IconCheck color="success" style={{stroke: "#22C55E"}} />,
    },
    {
      label: "Horizontal Poster",
      value: data?.horizontalPoster && <IconCheck color="success" style={{stroke: "#22C55E"}} />,
    },
    {
      label: "Wallpaper",
      value: data?.wallpaper && <IconCheck color="success" style={{stroke: "#22C55E"}} />,
    },
    {
      label: "Trailer",
      value: data?.trailer && <IconCheck color="success" style={{stroke: "#22C55E"}} />,
    },
    {
      label: "Full Movie",
      value: data?.fullMovie && <IconCheck color="success" style={{stroke: "#22C55E"}} />,
    },
    {
      label: "Subtitle",
      value: data?.subtitles && <IconCheck color="success" style={{stroke: "#22C55E"}} />,
    },
    {label: "Video Format", value: data?.videoFormat},
    {label: "Resolution", value: data?.resolution},
    {label: "Bitrate", value: data?.bitrate ? `${data?.bitrate} kbps` : null},
    {label: "Codec", value: data?.codec},
    {label: "Audio Format", value: data?.audioFormat},
    {label: "Audio Channels", value: data?.audioChannels},
    {label: "Audio Bitrate", value: data?.audioBitrate ? `${data?.audioBitrate} kbps` : null},
    {label: "Subtitle Format", value: data?.subtitleFormat},
    {label: "Subtitle Language", value: data?.subtitleLanguage},
  ];

  const distributionItems = [
    {label: "License Type", value: data?.licenseType},
    {label: "Territory", value: data?.territory},
    {label: "License Duration", value: data?.licenseDuration?.toString?.()},
    {label: "Copyright Holder", value: data?.copyrightHolder},
    {label: "Copyright Registration Number", value: data?.copyrightRegistrationNumber},
    {
      label: "Terms of Service URL",
      value: data?.termsOfServiceURL && <IconCheck color="success" style={{stroke: "#22C55E"}} />,
    },
  ];

  const hasCreators = data?.creators && data?.creators.length > 0;
  const hasDistribution = data?.distribution && data?.distribution.length > 0;

  return (
    <Card sx={{mt: 3, backgroundColor: "#2B2D31"}}>
      <CardHeader title="Movie Summary" sx={{pb: 2}} />
      <Divider sx={{borderStyle: "dashed"}} />
      <CardContent>
        <Scrollbar sx={{maxHeight: "75vh"}}>
          <Stack spacing={2}>
            {renderSection("Basic Information", basicInfoItems)}
            {basicInfoItems.some((item) => item.value) && <Divider sx={{borderStyle: "dashed"}} />}
            {renderSection("Media Assets", mediaAssetsItems)}
            {mediaAssetsItems.some((item) => item.value) && (
              <Divider sx={{borderStyle: "dashed"}} />
            )}
            {renderSection("Distribution", distributionItems)}
            {distributionItems.some((item) => item.value) && (
              <Divider sx={{borderStyle: "dashed"}} />
            )}
            {hasCreators && (
              <Section title="Creators">
                <ul>
                  {data?.creators.map((creator: any, index: number) => (
                    <li key={index}>
                      <InfoItem label="Role" value={creator.role} />
                      <InfoItem label="Name" value={creator.name} />
                      <InfoItem label="Wallet Address" value={creator.walletAddress} />
                      <InfoItem label="Revenue Share" value={`${creator.revenueShare}%`} />
                    </li>
                  ))}
                </ul>
              </Section>
            )}
            {hasDistribution && (
              <Section title="Distribution">
                <ul>
                  {data?.distribution.map((dist: any, index: number) => (
                    <li key={index}>
                      <InfoItem label="Type" value={dist.type} />
                      <InfoItem label="Currency" value={dist.currency} />
                      <InfoItem label="Price" value={fCurrency(dist.price)} />
                    </li>
                  ))}
                </ul>
              </Section>
            )}
            {!basicInfoItems.some((item) => item.value) &&
              !mediaAssetsItems.some((item) => item.value) &&
              !distributionItems.some((item) => item.value) &&
              !hasCreators &&
              !hasDistribution && (
                <Typography variant="h6" color="text.secondary">
                  No information available.
                </Typography>
              )}
          </Stack>
        </Scrollbar>
      </CardContent>
    </Card>
  );
}

// Component for each section
function Section({title, children}: any) {
  return (
    <Box>
      <Typography
        variant="h6"
        gutterBottom
        sx={{position: "sticky", top: 0, pb: 2, mb: "0 !important", backgroundColor: "#2B2D31"}}>
        {title}
      </Typography>
      <Stack spacing={1}>{children}</Stack>
    </Box>
  );
}

// Component for each info item
function InfoItem({label, value}: any) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="body2" sx={{color: "text.secondary", mr: 2}}>
        {label}
      </Typography>
      <Typography variant="subtitle2">{value}</Typography>
    </Stack>
  );
}
