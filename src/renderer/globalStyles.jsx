import React from "react";
import "plyr/src/sass/plyr.scss";

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

const GlobalStyles = () => (
    <style jsx global>{`
        :root {
            --plyr-font-size-large: 3.5vw;
            --plyr-font-size-base: 3.5vw;
            --plyr-captions-background: rgba(0, 0, 0, 0);
        }

        .plyr {
            height: 100% !important;
        }

        .plyr__captions {
            bottom: 4rem !important;

            .plyr__caption {
                color: #fff;
                font-family: var(--font-family-titles);
                font-size: 1rem !important;
                display: block;
                line-height: 1.2;
                font-style: normal !important;
                font-weight: bold !important;
                text-shadow: 0px 0px 10px #000, -2px -2px 1px #000, 2px -2px 1px #000, -2px 2px 1px #000, 2px 2px 1px #000;
            }
        }

        @media (min-width: 500px) {
            .plyr__captions {
                .plyr__caption {
                    font-size: 1.5rem !important;
                }
            }
        }

        @media (min-width: 768px) {
            .plyr__captions {
                .plyr__caption {
                    font-size: 2rem !important;
                }
            }
        }

        @media (min-width: 992px) {
            .plyr__captions {
                .plyr__caption {
                    font-size: 2.5rem !important;
                }
            }
        }

        @media (min-width: 1200px) {
            .plyr__captions {
                .plyr__caption {
                    font-size: 3rem !important;
                }
            }
        }

        @media (min-width: 2000px) {
            .plyr__captions {
                .plyr__caption {
                    font-size: 3.5rem !important;
                }
            }
        }

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

        .hide-on-desktop {
            display: none;
        }

        .movies-box {
            height: calc(100% - 11rem);
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

export { GlobalStyles };
