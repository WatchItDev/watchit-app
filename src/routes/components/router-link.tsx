import { forwardRef } from 'react';
import { Link, LinkProps } from 'react-router-dom';

// ----------------------------------------------------------------------

interface RouterLinkProps extends Omit<LinkProps, 'to'> {
  href?: string
}

const RouterLink = forwardRef<HTMLAnchorElement, RouterLinkProps>(({ href = '/default-path', ...other }, ref) => (
  <Link ref={ref} to={href} {...other} />
));

export default RouterLink;
