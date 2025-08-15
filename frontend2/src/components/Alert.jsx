const Alert = ({ type = 'error', message }) => {
  const alertClasses = {
    error: 'bg-red-100 border-red-400 text-red-700',
    success: 'bg-green-100 border-green-400 text-green-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
  };

  return (
    <div className={`border-l-4 p-4 mb-6 ${alertClasses[type]}`}>
      <p>{message}</p>
    </div>
  );
};

export default Alert;