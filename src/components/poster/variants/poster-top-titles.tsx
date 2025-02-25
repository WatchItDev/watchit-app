// @mui
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

// components is used to import the Image component
import Image from "@src/components/image";
import {useRouter} from "@src/routes/hooks";
import {paths} from "@src/routes/paths.ts";
import Button from "@mui/material/Button";
import {IconBookmark, IconBookmarkFilled, IconPlayerPlay} from "@tabler/icons-react";
import Box from "@mui/material/Box";
import TextMaxLine from "@src/components/text-max-line";
import {CircularProgress} from "@mui/material";
import {useBookmarkToggle} from "@lens-protocol/react-web";
import {openLoginModal} from "@redux/auth";
// @ts-ignore
import {ReadResult} from "@lens-protocol/react/dist/declarations/src/helpers/reads";
import {useDispatch, useSelector} from "react-redux";
import {addBookmark, removeBookmark} from "@redux/bookmark";
import {dicebear} from "@src/utils/dicebear.ts";

// ----------------------------------------------------------------------

const PosterTopTitles = ({post}: {post: any}) => {
  const router = useRouter();
  const {execute: toggleBookMarkFunction, loading: loadingBookMark} = useBookmarkToggle();
  const sessionData = useSelector((state: any) => state.auth.session);
  const dispatch = useDispatch();

  const handlePosterClick = () => {
    router.push(paths.dashboard.publication.details(post.id));
  };

  // const getMediaUri = (cid: string): string => `https://ipfs.io/ipfs/${cid?.replace?.('ipfs://', '')}`
  const getMediaUri = (cid: string): string => `${cid}`;

  const getWallpaperCid = (post: any): string =>
    post?.metadata?.attachments?.find((el: any) => el.altTag === "wallpaper")?.image?.raw?.uri;
  const getPosterCid = (post: any): string =>
    post?.metadata?.attachments?.find((el: any) => el.altTag === "poster")?.image?.raw?.uri;

  const toggleBookMark = async () => {
    if (!sessionData?.authenticated) return dispatch(openLoginModal());

    try {
      if (!post?.operations?.hasBookmarked) {
        dispatch(addBookmark(post));
      } else {
        dispatch(removeBookmark(post?.id));
      }

      await toggleBookMarkFunction({
        publication: post,
      });
    } catch (err) {
      console.error("Error toggling bookmark:", err);
    }
  };

  const goToProfile = () => {
    router.push(paths.dashboard.user.root(`${post?.by?.id}`));
  };

  return (
    <Stack
      sx={{position: "relative", display: "flex", alignItems: "center", justifyContent: "center"}}
      alignItems={"stretch"}
      spacing={{xs: 1, sm: 2, md: 4}}>
      <Image
        alt={post?.metadata?.title}
        src={getMediaUri(getWallpaperCid(post))}
        ratio="16/9"
        sx={{
          zIndex: 0,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.2,
          filter: "blur(5px) !important",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <Box
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: {xs: "100%", sm: "90%", md: "90%", lg: "90%", xlg: "75%"},
          py: 6,
          flexDirection: {
            xs: "column",
            sm: "row",
          },
        }}>
        <Box
          sx={{
            padding: {
              xs: "10px 5px",
              lg: "25px",
            },
            width: "100%",
            maxWidth: {xs: "100%", sm: "50%", md: "50%", lg: "50%"},
            mb: {xs: 3, sm: 0},
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Box
            sx={{
              width: "100%",
              maxWidth: {xs: "50%", sm: "75%", lg: "85%", xl: "70%"},
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Image
              style={{
                borderRadius: "10px",
                width: "100%",
              }}
              alt={post?.metadata?.title}
              src={getMediaUri(getPosterCid(post))}
              ratio="1/1"
            />
          </Box>
        </Box>

        <Box
          sx={{
            maxWidth: {xs: "100%", sm: "50%", md: "50%", lg: "50%"},
            display: "flex",
            alignItems: "center",
            background: "transparent",
            px: "12px",
            py: {xs: 0, md: 8},
          }}>
          <Stack spacing={1} gap={"16px"}>
            <Stack spacing={1} gap={0}>
              <TextMaxLine line={2} variant="h3" sx={{mb: 1}}>
                {post?.metadata?.title}
              </TextMaxLine>

              <Box sx={{display: "flex", alignItems: "flex-start"}}>
                <Button
                  variant="text"
                  sx={{cursor: "pointer", background: "transparent", p: 0, pl: 1}}
                  onClick={goToProfile}>
                  <Typography style={{marginRight: 5}} variant="caption">
                    by
                  </Typography>
                  <Typography
                    style={{
                      gap: 4,
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "rgba(0,0,0,.7)",
                      padding: "4px 10px",
                      borderRadius: 8,
                    }}
                    variant="caption">
                    <Image
                      ratio={"1/1"}
                      style={{width: "20px", height: "20px", borderRadius: "50%"}}
                      src={post?.by?.metadata?.picture?.optimized?.uri ?? dicebear(post?.by?.id)}
                    />
                    {post?.by?.metadata?.displayName ?? post?.by?.handle?.localName}
                  </Typography>
                </Button>
              </Box>
            </Stack>

            <Typography
              sx={{
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 4,
              }}
              variant="h6">
              {post?.metadata?.content ?? ""}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                variant="contained"
                sx={{
                  borderColor: "#FFFFFF",
                  color: "#000",
                  height: "40px",
                }}
                onClick={handlePosterClick}>
                <Box
                  sx={{
                    marginRight: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      xs: 0,
                      lg: "4px",
                    },
                  }}>
                  <IconPlayerPlay size={22} color="#000" />
                </Box>
                <TextMaxLine
                  sx={{
                    display: {
                      xs: "none",
                      lg: "inline",
                    },
                  }}
                  line={1}
                  variant="button">
                  Watch now
                </TextMaxLine>
              </Button>
              <Button
                variant="text"
                sx={{
                  borderColor: "#FFFFFF",
                  color: "#FFFFFF",
                  height: "40px",
                  minWidth: "40px",
                }}
                onClick={toggleBookMark}>
                {loadingBookMark ? (
                  <CircularProgress size="25px" sx={{color: "#fff"}} />
                ) : (
                  <>
                    {post?.operations?.hasBookmarked ? (
                      <IconBookmarkFilled size={22} color="#FFFFFF" />
                    ) : (
                      <IconBookmark size={22} color="#FFFFFF" />
                    )}
                  </>
                )}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
};

export default PosterTopTitles;
