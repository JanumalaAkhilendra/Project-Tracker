const Button = ({ children, type = 'button', disabled = false, fullWidth = false, ...props }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${fullWidth ? 'w-full' : ''} group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;