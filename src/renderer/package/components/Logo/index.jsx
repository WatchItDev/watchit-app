// REACT IMPORTS
import React from 'react'

// MUI IMPORTS
import { Box, styled } from '@mui/material'

// ----------------------------------------------------------------------
// MAIN COMPONENT

export const Logo = (props) => {
    return (
        <LogoWrapper onClick={props.onClick} sx={{width: props.size ? `${props.size}px` : '200px'}}
                     data-testid={'logo-wrapper'}>
            <svg width="50" height="50" viewBox="0 0 627 435" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.9"
                      d="M150.25 434.386C136.939 434.397 127.331 421.644 131.014 408.852L244.312 15.3208C246.778 6.7541 254.616 0.854004 263.531 0.854004H358.2C371.482 0.854004 381.074 13.5626 377.434 26.3362L265.291 419.787C262.843 428.373 255.002 434.297 246.073 434.305L150.25 434.386Z"
                      fill="url(#paint0_linear_367_1004)"/>
                <path opacity="0.9"
                      d="M480.647 434.408C493.908 434.408 503.497 421.737 499.895 408.975L388.808 15.421C386.376 6.8044 378.513 0.854004 369.56 0.854004H274.842C261.599 0.854004 252.013 13.4915 255.582 26.2439L365.718 419.798C368.135 428.436 376.008 434.408 384.978 434.408H480.647Z"
                      fill="url(#paint1_linear_367_1004)"/>
                <path opacity="0.9"
                      d="M600.034 0.854004C613.457 0.854004 623.069 13.8143 619.173 26.659L499.805 420.213C497.248 428.644 489.476 434.408 480.666 434.408H384.803C371.281 434.408 361.657 421.268 365.735 408.376L490.229 14.8219C492.86 6.50614 500.576 0.854004 509.298 0.854004H600.034Z"
                      fill="url(#paint2_linear_367_1004)"/>
                <path opacity="0.9"
                      d="M27.2047 0.854004C13.7116 0.854004 4.09023 13.9413 8.11526 26.8201L131.114 420.374C133.723 428.723 141.456 434.408 150.203 434.408H246.705C260.224 434.408 269.849 421.273 265.775 408.381L141.402 14.8273C138.773 6.50882 131.056 0.854004 122.332 0.854004H27.2047Z"
                      fill="url(#paint3_linear_367_1004)"/>
                <path opacity="0.9"
                      d="M319.798 239.255C318.596 242.943 313.375 242.933 312.187 239.241L243.904 26.9788C239.751 14.0676 249.38 0.854004 262.943 0.854004H369.946C383.541 0.854004 393.174 14.1259 388.961 27.0517L319.798 239.255Z"
                      fill="url(#paint4_linear_367_1004)"/>
                <defs>
                    <linearGradient id="paint0_linear_367_1004" x1="308.153" y1="33.3095" x2="200.2" y2="407.071" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#48BBD3"/>
                        <stop offset="1" stopColor="#C1D946"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear_367_1004" x1="333.047" y1="34.9381" x2="434.368" y2="405.442" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#40BAB5"/>
                        <stop offset="1" stopColor="#68C749"/>
                    </linearGradient>
                    <linearGradient id="paint2_linear_367_1004" x1="549.068" y1="24.9339" x2="449.375" y2="407.071" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FE9900"/>
                        <stop offset="1" stopColor="#BE007A"/>
                    </linearGradient>
                    <linearGradient id="paint3_linear_367_1004" x1="75.6131" y1="34.9381" x2="188.568" y2="402.069" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#26B2FD"/>
                        <stop offset="1" stopColor="#A51687"/>
                    </linearGradient>
                    <linearGradient id="paint4_linear_367_1004" x1="316.645" y1="14.8134" x2="316.645" y2="208.15" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#2392C1"/>
                        <stop offset="1" stopColor="#349995"/>
                    </linearGradient>
                </defs>
            </svg>
        </LogoWrapper>
    )
}

// ----------------------------------------------------------------------
// SUB COMPONENTS

const LogoWrapper = styled(Box)(() => ({
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}))

// ----------------------------------------------------------------------

export default Logo
