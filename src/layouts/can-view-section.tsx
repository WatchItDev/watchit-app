import { ReduxSession } from '@redux/types.ts';

export const canViewSection = (sessionData: ReduxSession): boolean => {
  // Allowed profileId to views (temporary) this section
  const allowedProfilesId = [
    '0xbd14406cd21cD358947163de34310950F99F4098', // Mihail
    '0xeE580C7e379b97303d1Bc4400dc95D72092CA85a', // Jacob 1
    '0x61Cad4F0fd9F93482095b4882111f953e563b404', // Jacob 2
    '0x4AEa45E7c5a1C63424D003114b9C80F4DEa64c1B', // Geolffrey
    '0xbB97F1234282ff8f74c7d091CB2eDC4F82A311C0', // Watchit Open
    '0x71B9d744Ad4E43d3A4Ff1DEADbf8058c24c8521a', // Alejandro
    '0xa15a3D394E029212023C3D696640721c2623b79A', // Alexandra,
    '0x1f2500701594E3413CC129cb8Fe6ed0291291135', // Kana
  ];
  // Verify if the current profile is allowed to views this section
  return allowedProfilesId.includes(sessionData?.address ?? '');
};
