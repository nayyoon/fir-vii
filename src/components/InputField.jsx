import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

const InputField = ({ name, placeholder, type = 'text' }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="mb-3 position-relative">
      <input
        type={isPassword && showPassword ? 'text' : type}
        placeholder={placeholder}
        {...register(name)}
        className={`form-control bg-secondary text-white border-0 pe-5 ${errors[name] ? 'is-invalid' : ''}`}
      />
      {isPassword && (
        <button
          type="button"
          className="btn btn-sm btn-outline-light position-absolute top-50 end-0 translate-middle-y me-2"
          onClick={() => setShowPassword(!showPassword)}
          style={{ zIndex: 1 }}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      )}
      {errors[name] && <div className="invalid-feedback d-block">{errors[name]?.message}</div>}
    </div>
  );
};

export default InputField;
