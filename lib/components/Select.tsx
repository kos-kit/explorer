"use client";

import {
  ClearIndicatorProps,
  GroupBase,
  MultiValueRemoveProps,
  components,
} from "react-select";
import ReactSelect, { AsyncProps } from "react-select/async";
import clsx from "clsx";
import { XMarkIcon } from "@heroicons/react/24/solid";

// Styling adapted from https://www.jussivirtanen.fi/writing/styling-react-select-with-tailwind
// const DropdownIndicator = <
//   Option = unknown,
//   IsMulti extends boolean = boolean,
//   Group extends GroupBase<Option> = GroupBase<Option>,
// >(
//   props: DropdownIndicatorProps<Option, IsMulti, Group>,
// ) => {
//   return (
//     <components.DropdownIndicator {...props}>
//       <ChevronDownIcon className="h-5 w-5" />
//     </components.DropdownIndicator>
//   );
// };

const ClearIndicator = <
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: ClearIndicatorProps<Option, IsMulti, Group>,
) => {
  return (
    <components.ClearIndicator {...props}>
      <XMarkIcon className="h-5 w-5" />
    </components.ClearIndicator>
  );
};

const MultiValueRemove = <
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: MultiValueRemoveProps<Option, IsMulti, Group>,
) => {
  return (
    <components.MultiValueRemove {...props}>
      <XMarkIcon className="h-5 w-5" />
    </components.MultiValueRemove>
  );
};

const controlStyles = {
  base: "border rounded-lg bg-white hover:cursor-pointer min-w-64",
  focus: "border-primary-600 ring-1 ring-primary-500",
  nonFocus: "border-gray-300 hover:border-gray-400",
};
const placeholderStyles = "text-gray-500 pl-1 py-0.5";
const selectInputStyles = "pl-1 py-0.5";
const valueContainerStyles = "p-1 gap-1";
const singleValueStyles = "leading-7 ml-1";
const multiValueStyles =
  "bg-gray-100 rounded items-center py-0.5 pl-2 pr-1 gap-1.5";
const multiValueLabelStyles = "leading-6 py-0.5";
const multiValueRemoveStyles =
  "border border-gray-200 bg-white hover:bg-red-50 hover:text-red-800 text-gray-500 hover:border-red-300 rounded-md";
const indicatorsContainerStyles = "p-1 gap-1";
const clearIndicatorStyles =
  "text-gray-500 p-1 rounded-md hover:bg-red-50 hover:text-red-800";
const indicatorSeparatorStyles = "bg-gray-300";
const dropdownIndicatorStyles =
  "p-1 hover:bg-gray-100 text-gray-500 rounded-md hover:text-black";
const menuStyles = "p-1 mt-2 border border-gray-200 bg-white rounded-lg";
const groupHeadingStyles = "ml-3 mt-2 mb-1 text-gray-500 text-sm";
const optionStyles = {
  base: "hover:cursor-pointer px-3 py-2 rounded",
  focus: "bg-gray-100 active:bg-gray-200",
  selected:
    "after:content-['✔'] after:ml-2 after:text-green-500 text-gray-500",
};
const noOptionsMessageStyles =
  "text-gray-500 p-2 bg-gray-50 border border-dashed border-gray-200 rounded-sm";

export function Select<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: AsyncProps<Option, IsMulti, Group>) {
  return (
    <ReactSelect
      components={{
        DropdownIndicator: null, //DropdownIndicator,
        ClearIndicator,
        MultiValueRemove,
      }}
      styles={{
        input: (base) => ({
          ...base,
          "input:focus": {
            boxShadow: "none",
          },
        }),
        // On mobile, the label will truncate automatically, so we want to
        // override that behaviour.
        multiValueLabel: (base) => ({
          ...base,
          whiteSpace: "normal",
          overflow: "visible",
        }),
        control: (base) => ({
          ...base,
          transition: "none",
        }),
      }}
      classNames={{
        control: ({ isFocused }) =>
          clsx(
            isFocused ? controlStyles.focus : controlStyles.nonFocus,
            controlStyles.base,
          ),
        placeholder: () => placeholderStyles,
        input: () => selectInputStyles,
        valueContainer: () => valueContainerStyles,
        singleValue: () => singleValueStyles,
        multiValue: () => multiValueStyles,
        multiValueLabel: () => multiValueLabelStyles,
        multiValueRemove: () => multiValueRemoveStyles,
        indicatorsContainer: () => indicatorsContainerStyles,
        clearIndicator: () => clearIndicatorStyles,
        indicatorSeparator: () => indicatorSeparatorStyles,
        dropdownIndicator: () => dropdownIndicatorStyles,
        menu: () => menuStyles,
        groupHeading: () => groupHeadingStyles,
        option: ({ isFocused, isSelected }) =>
          clsx(
            isFocused && optionStyles.focus,
            isSelected && optionStyles.selected,
            optionStyles.base,
          ),
        noOptionsMessage: () => noOptionsMessageStyles,
      }}
      unstyled
      {...props}
    />
  );
}
