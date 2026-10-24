"use client";

import * as React from "react";

export function LocaleLangSync({ locale }: { locale: string }) {
  React.useEffect(() => {
    if (typeof document !== "undefined" && document.documentElement.lang !== locale) {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return (
    <script
      id="locale-lang-sync-script"
      dangerouslySetInnerHTML={{
        __html: `if (document.documentElement.lang !== ${JSON.stringify(locale)}) { document.documentElement.lang = ${JSON.stringify(locale)}; }`,
      }}
    />
  );
}
