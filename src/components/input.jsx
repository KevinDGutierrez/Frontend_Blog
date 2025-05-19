import React from 'react';

export const Input = ({
  field,
  label,
  value,
  onChangeHandler,
  type = 'text',
  showErrorMessage,
  validationMessage,
  onBlurHandler,
  textArea
}) => {
  const handleValueChange = (event) => {
    onChangeHandler(event.target.value, field);
  };

  const handleInputBlur = (event) => {
    if (typeof onBlurHandler === 'function') {
      onBlurHandler(event.target.value, field);
    }
  };

  return (
    <>
      <div className="auth-form-label">
        <span>{label}</span>
      </div>
      <div>
        {textArea ? (
          <textarea
            value={value}
            onChange={handleValueChange}
            onBlur={handleInputBlur}
            rows={5}
            style={{ maxWidth: '400px' }}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={handleValueChange}
            onBlur={handleInputBlur}
          />
        )}
        <span className="auth-form-validation-message">
          {showErrorMessage && validationMessage}
        </span>
      </div>
    </>
  );
};
