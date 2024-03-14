import { XIcon } from "@primer/octicons-react";
import { ActionList, Box, Checkbox, TextInput } from "@primer/react";
import { useState } from "react";


export interface DropdownItems {
  value: string;
  name: string;
  checked: boolean;
}

export interface SearchableSelectProps<T extends DropdownItems> {
  options: T[];
  onItemSelect: (item: T) => void;
}


// Renderer for the searchable select filter
export const SearchableSelect = (props: SearchableSelectProps<DropdownItems>) => {
  const { onItemSelect, options } = props;
  const [filteredOptions, setFilteredOptions] = useState<string>('');

  return (
    <Box>
      <TextInput
        className="w-full"
        value={filteredOptions}
        onChange={(e) => setFilteredOptions(e.target.value)}
        trailingAction={
          <TextInput.Action
            onClick={() => {
              setFilteredOptions('');
            }}
            icon={XIcon}
            aria-label="Clear input"
            sx={{ color: 'fg.subtle' }}
          />
        }
      />
      <Box className="h-80 overflow-auto w-100 mt-2">
        <ActionList>
          {options.map((selectOption) => {
            if (selectOption.value === '') {
              return (
                <>
                  <ActionList.Item
                    onClick={() => onItemSelect(selectOption)}
                  >
                    <ActionList.LeadingVisual>
                      <Checkbox
                        type="checkbox"
                        checked={selectOption.checked
                        }
                      />
                    </ActionList.LeadingVisual>
                    <Box>No License</Box>
                  </ActionList.Item>
                </>
              );
            }

            return (
              <>
                <ActionList.Item
                  onClick={() =>
                    onItemSelect(selectOption)
                  }
                >
                  <ActionList.LeadingVisual>
                    <Checkbox
                      type="checkbox"
                      checked={selectOption.checked}
                    />
                  </ActionList.LeadingVisual>
                  <Box>{selectOption.value}</Box>
                </ActionList.Item>
              </>
            );
          })}
        </ActionList>
      </Box>
    </Box >
  )
}