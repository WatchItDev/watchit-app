// Watchit/components/AiLoader.tsx
import Box from '@mui/material/Box';
import { keyframes, styled } from '@mui/material/styles';

const spin = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;
const orbit = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;

const SvgWrap = styled('div')(() => ({
  width: 180,
  height: 180,
  '& svg': { width: '100%', height: '100%', display: 'block' },
  // rings
  '& .ring': { transformOrigin: '50% 50%', transformBox: 'fill-box', animation: `${spin} 10s linear infinite` },
  '& .ring.slow': { animationDuration: '18s' },
  // orbit groups rotate around the translated origin (center)
  '& .rotA, & .rotB': { animation: `${orbit} 7s linear infinite`, transformOrigin: '0 0' },
  '& .rotB': { animationDuration: '10s', animationDirection: 'reverse' },
}));

export default function AiLoader() {
  // center of the rings (aprox from paths): (152, 143)
  const cx = 152, cy = 143;
  const rA = 56;  // orbit radius for blob A
  const rB = 36;  // orbit radius for blob B

  return (
    <Box sx={{ display: 'grid', placeItems: 'center' }} aria-label="Processing">
      <SvgWrap>
        <svg viewBox="0 0 302 298" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* RINGS (rotate in place) */}
          <g opacity="0.8">
            <g className="ring">
              <path d="M151.943 92.2588C183.304 92.2588 208.469 114.893 208.469 142.512C208.469 170.131 183.304 192.766 151.943 192.766C120.582 192.766 95.418 170.131 95.418 142.512C95.4182 114.893 120.582 92.2588 151.943 92.2588Z" stroke="white" strokeWidth="2.574"/>
              <path d="M152.183 86.6704C180.283 86.6704 203.254 111.623 203.254 142.651C203.254 173.679 180.282 198.63 152.183 198.63C124.083 198.63 101.112 173.679 101.111 142.651C101.111 111.623 124.083 86.6705 152.183 86.6704Z" stroke="white" strokeWidth="2.574"/>
            </g>
            <g className="ring slow">
              <path d="M153.273 92.6694C184.634 92.6694 209.799 115.303 209.799 142.922C209.799 170.542 184.635 193.176 153.273 193.176C121.912 193.176 96.748 170.542 96.748 142.922C96.7483 115.303 121.912 92.6694 153.273 92.6694Z" stroke="white" strokeWidth="2.574"/>
              <path d="M182.413 97.0614C206.617 114.287 213.486 149.272 197.681 175.218C181.876 201.163 149.429 208.168 125.225 190.942C101.02 173.716 94.1518 138.732 109.957 112.786C125.762 86.8404 158.208 79.8355 182.413 97.0614Z" stroke="white" strokeWidth="2.574"/>
            </g>

            {/* ORBITING BLOBS */}
            {/* blob A */}
            <g transform={`translate(${cx} ${cy})`}>
              <g className="rotA">
                <g transform={`translate(${rA} 0)`}>
                  <g filter="url(#blurA)">
                    <circle r="14" fill="#B36358" />
                  </g>
                </g>
              </g>
            </g>

            {/* blob B */}
            <g transform={`translate(${cx} ${cy})`}>
              <g className="rotB">
                <g transform={`translate(${rB} 0)`}>
                  <g filter="url(#blurB)">
                    <circle r="12" fill="#74D0C3" />
                  </g>
                </g>
              </g>
            </g>

            {/* very soft background guides (static) */}
            <path d="M122.131 93.3311C147.668 78.9133 181.348 89.8039 197.268 118.002C213.188 146.201 205.114 180.665 179.577 195.082C154.039 209.5 120.359 198.61 104.439 170.411C88.5192 142.213 96.5933 107.749 122.131 93.3311Z" stroke="#F5F5F5" strokeOpacity="0.04" strokeWidth="2.686"/>
            <path d="M126.201 98.224C154.702 82.1328 189.186 89.7916 203.357 114.892C217.528 139.993 206.272 173.475 177.77 189.566C149.269 205.658 114.785 197.999 100.614 172.898C86.443 147.797 97.6995 114.315 126.201 98.224Z" stroke="#F5F5F5" strokeOpacity="0.04" strokeWidth="2.686"/>
            <path d="M154.936 87.2639C185.772 90.4999 209.964 118.771 208.913 150.46C207.862 182.149 181.968 205.163 151.132 201.927C120.296 198.691 96.1033 170.421 97.1546 138.731C98.206 107.042 124.1 84.0279 154.936 87.2639Z" stroke="#F5F5F5" strokeOpacity="0.04" strokeWidth="2.686"/>
          </g>

          <defs>
            <filter id="blurA" x="-60" y="-60" width="120" height="120" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feGaussianBlur stdDeviation="12" />
            </filter>
            <filter id="blurB" x="-60" y="-60" width="120" height="120" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feGaussianBlur stdDeviation="10" />
            </filter>
          </defs>
        </svg>
      </SvgWrap>
    </Box>
  );
}
