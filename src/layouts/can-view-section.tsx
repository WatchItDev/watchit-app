import {ReduxSession} from "@redux/types.ts"

export const canViewSection = (sessionData: ReduxSession): boolean => {
  // Allowed profileId to views (temporary) this section
  const allowedProfilesId = ['0x0563', '0x050d','0x055c','0x0514', '0x0510','0x05cd']; // Mihail, Carlos, Jacob, Geolffrey, Watchit Open, Alejandro
  // Verify if the current profile is allowed to views this section
  return allowedProfilesId.includes(sessionData?.profile?.id ?? '');
}
