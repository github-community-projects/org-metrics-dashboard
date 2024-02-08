import { TriangleDownIcon } from "@primer/octicons-react";
import { Button, SelectPanel } from "@primer/react";
import { ItemInput } from "@primer/react/lib/deprecated/ActionList/List";
import { useState } from "react";

export const RepositorySelector = ({
  selectedNames,
  setSelectedNames,
  repositoryNames,
}: {
  selectedNames: string[];
  setSelectedNames: (nextSelection: string[]) => void;
  repositoryNames: string[];
}) => {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const items: ItemInput[] = repositoryNames.map((repositoryName, index) => {
    return {
      text: repositoryName,
      id: index,
    };
  });

  const filteredItems = items.filter((item) => item.text?.includes(filter));

  const selected = items.filter((item) => {
    return item.text && selectedNames.includes(item.text);
  });

  const updateSelection = (selectedItems: ItemInput[]) => {
    const updatedNames: string[] = selectedItems.map((item) => item.text || "");
    setSelectedNames(updatedNames.filter((updatedName) => updatedName !== ""));
  };
  return (
    <SelectPanel
      renderAnchor={({ "aria-labelledby": ariaLabelledBy, ...anchorProps }) => (
        <Button
          trailingAction={TriangleDownIcon}
          aria-labelledby={` ${ariaLabelledBy}`}
          {...anchorProps}
        >
          Select repositories
        </Button>
      )}
      title="Select repositories"
      placeholderText="Filter repositories"
      open={open}
      onOpenChange={setOpen}
      items={filteredItems}
      selected={selected}
      onSelectedChange={updateSelection}
      onFilterChange={setFilter}
      showItemDividers={true}
      overlayProps={{ width: "xlarge", height: "xlarge" }}
    />
  );
};
