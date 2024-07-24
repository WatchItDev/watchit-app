import {
  varFade,
  varZoom,
  varFlip,
  varSlide,
  varScale,
  varBgPan,
  varBounce,
  varRotate,
  varBgColor,
  varBgKenburns,
} from 'src/components/animate';

// ----------------------------------------------------------------------

export default function getVariant(variant = 'slideInUp') {
  return {
    // Slide
    slideInUp: varSlide().inUp,
    slideInDown: varSlide().inDown,
    slideInLeft: varSlide().inLeft,
    slideInRight: varSlide().inRight,
    slideOutUp: varSlide().outUp,
    slideOutDown: varSlide().outDown,
    slideOutLeft: varSlide().outLeft,
    slideOutRight: varSlide().outRight,
    // Fade
    fadeIn: varFade().in,
    fadeInUp: varFade().inUp,
    fadeInDown: varFade().inDown,
    fadeInLeft: varFade().inLeft,
    fadeInRight: varFade().inRight,
    fadeOut: varFade().out,
    fadeOutUp: varFade().outUp,
    fadeOutDown: varFade().outDown,
    fadeOutLeft: varFade().outLeft,
    fadeOutRight: varFade().outRight,
    // Zoom
    zoomIn: varZoom({ distance: 80 }).in,
    zoomInUp: varZoom({ distance: 80 }).inUp,
    zoomInDown: varZoom({ distance: 80 }).inDown,
    zoomInLeft: varZoom({ distance: 240 }).inLeft,
    zoomInRight: varZoom({ distance: 240 }).inRight,
    zoomOut: varZoom().out,
    zoomOutLeft: varZoom().outLeft,
    zoomOutRight: varZoom().outRight,
    zoomOutUp: varZoom().outUp,
    zoomOutDown: varZoom().outDown,
    // Bounce
    bounceIn: varBounce().in,
    bounceInUp: varBounce().inUp,
    bounceInDown: varBounce().inDown,
    bounceInLeft: varBounce().inLeft,
    bounceInRight: varBounce().inRight,
    bounceOut: varBounce().out,
    bounceOutUp: varBounce().outUp,
    bounceOutDown: varBounce().outDown,
    bounceOutLeft: varBounce().outLeft,
    bounceOutRight: varBounce().outRight,
    // Flip
    flipInX: varFlip().inX,
    flipInY: varFlip().inY,
    flipOutX: varFlip().outX,
    flipOutY: varFlip().outY,
    // Scale
    scaleInX: varScale().inX,
    scaleInY: varScale().inY,
    scaleOutX: varScale().outX,
    scaleOutY: varScale().outY,
    // Rotate
    rotateIn: varRotate().in,
    rotateOut: varRotate().out,
    // Background
    kenburnsTop: varBgKenburns().top,
    kenburnsBottom: varBgKenburns().bottom,
    kenburnsLeft: varBgKenburns().left,
    kenburnsRight: varBgKenburns().right,
    panTop: varBgPan().top,
    panBottom: varBgPan().bottom,
    panLeft: varBgPan().left,
    panRight: varBgPan().right,
    color2x: varBgColor(),
    color3x: varBgColor({ colors: ['#19dcea', '#b22cff', '#ea2222'] }),
    color4x: varBgColor({
      colors: ['#19dcea', '#b22cff', '#ea2222', '#f5be10'],
    }),
    color5x: varBgColor({
      colors: ['#19dcea', '#b22cff', '#ea2222', '#f5be10', '#3bd80d'],
    }),
  }[variant];
}
