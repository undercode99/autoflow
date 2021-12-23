import * as React from "react";

function BxUserPlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        fill="none"
        d="M6 8c0 1.178.822 2 2 2s2-.822 2-2-.822-2-2-2-2 .822-2 2z"
      />
      <path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3zM4 8c0 2.28 1.72 4 4 4s4-1.72 4-4-1.72-4-4-4-4 1.72-4 4zm6 0c0 1.178-.822 2-2 2s-2-.822-2-2 .822-2 2-2 2 .822 2 2zM4 18c0-1.654 1.346-3 3-3h2c1.654 0 3 1.346 3 3v1h2v-1c0-2.757-2.243-5-5-5H7c-2.757 0-5 2.243-5 5v1h2v-1z" />
    </svg>
  );
}

export default BxUserPlusIcon;