"use client";

import { useParams } from "next/navigation";
import Link, { LinkProps } from "next/link";
import { twMerge } from "tailwind-merge";
import { forwardRef } from "react";

interface LocaleLinkProps extends LinkProps {
  className?: string;
  children: React.ReactNode;
}

const LocaleLink = forwardRef<HTMLAnchorElement, LocaleLinkProps>(
  ({ href, className, children, ...props }, ref) => {
    const params = useParams();
    const locale = params?.locale as string;

    const localizedHref = typeof href === "string" ? `/${locale}${href}` : href;

    return (
      <Link
        href={localizedHref}
        {...props}
        ref={ref}
        className={twMerge(className)}
      >
        {children}
      </Link>
    );
  },
);

LocaleLink.displayName = "LocaleLink";

export default LocaleLink;
