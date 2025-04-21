import { TextField } from '@mui/material';
import PropTypes from 'prop-types'; // To validate props

const InputField = ({ label, type, value, onChange }) => {
  return (
    <TextField
      label={label}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.name, e.target.value)} // Trigger the onChange function
      required
      fullWidth
      margin="normal"
    />
  );
};

// Prop validation for the component
InputField.propTypes = {
  label: PropTypes.string.isRequired, // label should be a string
  type: PropTypes.string, // type should be a string, default to "text" if not provided
  value: PropTypes.string.isRequired, // value should be a string
  onChange: PropTypes.func.isRequired, // onChange should be a function
};

// Default props if not passed
InputField.defaultProps = {
  type: 'text', // Default type is 'text'
};

export default InputField;
