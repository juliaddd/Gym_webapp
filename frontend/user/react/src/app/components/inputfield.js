'use client';
import { TextField } from '@mui/material';
import PropTypes from 'prop-types';

const InputField = ({ label, name, type, value, onChange }) => {
  const handleChange = (e) => {
    // Call the parent's onChange with both name and value
    onChange(name, e.target.value);
  };

  return (
    <TextField
      label={label}
      name={name}
      type={type}
      value={value}
      onChange={handleChange}
      required
      fullWidth
      margin="normal"
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
};

InputField.defaultProps = {
  type: 'text',
};

export default InputField;