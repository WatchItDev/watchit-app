import {LazyMotion, m} from "framer-motion";

// ----------------------------------------------------------------------

// @ts-expect-error loading css from framer-motion
const loadFeatures = () => import("./features.js").then((res) => res.default);

interface Props {
  children: React.ReactNode;
}

function MotionLazy({children}: Props) {
  return (
    <LazyMotion strict features={loadFeatures}>
      <m.div style={{height: "100%"}}> {children} </m.div>
    </LazyMotion>
  );
}

export default MotionLazy;
