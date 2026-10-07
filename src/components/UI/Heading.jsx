export const Heading = ({
  as: Component = 'h1', // Zadana vrijednost je 'h1'
  color,
  size,
  className = '',
  style = {},
  children,
  ...restProps
}) => {
  // Spajamo proslijeđene style objekte sa custom color i size propovima
  const combinedStyle = {
    ...(color && { color }),
    ...(size && { fontSize: typeof size === 'number' ? `${size}px` : size }),
    ...style,
  };

  return (
    <Component
      style={combinedStyle}
      className={`heading ${className}`.trim()}
      {...restProps}
    >
      {children}
    </Component>
  );
};

export default Heading;