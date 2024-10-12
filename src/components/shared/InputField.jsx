const Input = ({ type = "text", value, placeholder, onChange, maxLength }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:[#205fa8ff]"
      maxLength={maxLength}
    />
  );
};

export default Input;
