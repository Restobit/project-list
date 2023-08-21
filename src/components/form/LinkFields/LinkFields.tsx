import React, { useState } from "react";
import { FormWrapper } from "../../FormWrapper/FormWrapper";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import { Link, LinkFieldsProps } from "./LinkFields.types";

export function LinkFields({ links, updateFields }: LinkFieldsProps) {
  const initialData: Link[] = links.length > 0 ? links : [{ url: "" }];
  const [formFields, setFormFields] = useState<Link[]>(initialData);

  const addNewFields = () => {
    setFormFields([...formFields, { url: "" }]);
  };

  const removeFields = (index: number) => {
    let data = [...formFields];
    data.splice(index, 1);
    setFormFields(data);
  };

  const handlelLinktChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value: string = event.target.value;
    let data = [...formFields];
    const findedInput = data.find((field, fieldIndex) => fieldIndex === index) as Link;
    findedInput.url = value;
    setFormFields(data);
    updateFields({ links: data });
  };

  return (
    <FormWrapper title="Dokumentum linkek">
      <div className="dynamic-form">
        {formFields.map((field, index) => (
          <div className="dynamic-fields">
            <div key={index} className="dynamic-input">
              <label>Link</label>
              <input type="text" name="link" value={field.url} onChange={(e) => handlelLinktChange(e, index)} />
            </div>
            <IconButton color="error" aria-label="delete" onClick={() => removeFields(index)}>
              <DeleteIcon />
            </IconButton>
          </div>
        ))}
        <IconButton color="success" size="large" aria-label="add" onClick={addNewFields}>
          <AddIcon />
        </IconButton>
      </div>
    </FormWrapper>
  );
}
