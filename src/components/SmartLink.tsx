import React from 'react';
import { Link } from 'react-router-dom';
import { isExternalLink, formatExternalLink } from '../utils/formatters';

interface SmartLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: React.ReactNode;
  className?: string;
}

export const SmartLink: React.FC<SmartLinkProps> = ({ to, children, className = '', ...rest }) => {
  if (isExternalLink(to)) {
    return (
      <a
        href={formatExternalLink(to)}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={className} {...rest}>
      {children}
    </Link>
  );
}; 