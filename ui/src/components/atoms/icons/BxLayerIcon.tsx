function BxLayerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M22 7.999a1 1 0 00-.516-.874l-9.022-5a1.003 1.003 0 00-.968 0l-8.978 4.96a1 1 0 00-.003 1.748l9.022 5.04a.995.995 0 00.973.001l8.978-5A1 1 0 0022 7.999zm-9.977 3.855L5.06 7.965l6.917-3.822 6.964 3.859-6.918 3.852z" />
      <path d="M20.515 11.126L12 15.856l-8.515-4.73-.971 1.748 9 5a1 1 0 00.971 0l9-5-.97-1.748z" />
      <path d="M20.515 15.126L12 19.856l-8.515-4.73-.971 1.748 9 5a1 1 0 00.971 0l9-5-.97-1.748z" />
    </svg>
  );
}

export default BxLayerIcon;
