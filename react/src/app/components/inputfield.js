'use client';
import { TextField } from '@mui/material';
import PropTypes from 'prop-types';

const InputField = ({ label, name, type, value, onChange, required, error, helperText, readOnly }) => {
  const handleChange = (e) => {
    if (!readOnly) {
      // Call the parent's onChange with both name and value if it's editable
      onChange(name, e.target.value);
    }
  };

  return (
    <TextField
      label={label}
      name={name}
      type={type}
      value={value}
      onChange={handleChange}
      required={required}
      error={(error)}
      helperText={error || helperText}
      fullWidth
      margin="normal"
      InputProps={{
        readOnly: readOnly,  // Adds readOnly to input field if true
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#ddd',
          },
          '&:hover fieldset': {
            borderColor: '#aaa',
          },
        },
        marginBottom: '15px'
      }}
    />
  );
};

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired, // Added name prop validation
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,   // Optional required prop
  readOnly: PropTypes.bool,   // Optional readOnly prop
};

InputField.defaultProps = {
  type: 'text',
  required: true,   // By default, make it required
  readOnly: false,  // By default, allow editing
};

export default InputField;
