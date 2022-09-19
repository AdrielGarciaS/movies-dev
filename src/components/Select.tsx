import { ChangeEvent } from 'react';
import { Select as ChakraSelect } from '@chakra-ui/react';

interface Props {
  options: string[];
  onChange?(value: string): void;
  value?: string;
}

export const Select = (props: Props) => {
  const { options, onChange, value } = props;

  const onSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange?.(event.target.value);
  };

  return (
    <ChakraSelect variant="filled" onChange={onSelect} value={value}>
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </ChakraSelect>
  );
};
