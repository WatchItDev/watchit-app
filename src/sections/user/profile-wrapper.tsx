import {FC, PropsWithChildren} from "react"
import Stack from "@mui/material/Stack"

interface ProfileWrapperProps extends  PropsWithChildren {
  sidebar: React.ReactNode;
}

const ProfileWrapper: FC<ProfileWrapperProps> = ({children, sidebar}) => {
  return (
    <Stack
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        zIndex: 10,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      }}
    >
      <Stack
        direction="column"
        sx={{
          zIndex: 10,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          width: '100%',
          marginTop: { xs: '-48px', md: '-64px' },
          ml: {
            xs: 4,
            md: 4,
          },
        }}
      >
      {children}
      </Stack>

      {sidebar}

    </Stack>
  )
}

export default ProfileWrapper
