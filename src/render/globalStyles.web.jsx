import React from "react";
import "plyr/src/sass/plyr";

const slideInBottom = `
  @keyframes slide-in-bottom {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const slideInTop = `
  @keyframes slide-in-top {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const slideInLeft = `
  @keyframes slide-in-left {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const slideInRight = `
  @keyframes slide-in-right {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const fadeIn = `
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const zoom = `
  @keyframes zoom {
    from {
      object-position: 0 50%;
    }
    to {
      object-position: 100% 50%;
    }
  }
`;

const GlobalStylesWeb = () => (
    <style jsx global>{`
        html {
            box-sizing: border-box;
            background-color: #1A1C20;
        }

        *, *:before, *:after {
            box-sizing: inherit;
        }
        
        body {
            margin: 0 !important;
            font-family: "Open Sans", Arial, sans-serif;
        }

        .hide-on-web {
            display: none;
        }

        .movies-box {
            height: calc(100% - 7rem);
        }
        
        .slide-in-bottom {
          animation: slide-in-bottom 0.65s ease forwards;
        }
    
        .slide-in-top {
          animation: slide-in-top 0.65s ease forwards;
        }
    
        .slide-in-left {
          animation: slide-in-left 0.65s ease forwards;
        }
    
        .slide-in-right {
          animation: slide-in-right 0.65s ease forwards;
        }
    
        .fade-in {
          animation: fade-in 0.65s ease forwards;
        }
    
        ${slideInBottom}
        ${slideInTop}
        ${slideInLeft}
        ${slideInRight}
        ${fadeIn}
        ${zoom}
  `}</style>
);

export { GlobalStylesWeb };
