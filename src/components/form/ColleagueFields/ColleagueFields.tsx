import React, { useState } from "react";
import { FormWrapper } from "../../FormWrapper/FormWrapper";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import { Colleague, ColleagueFieldsProps } from "./ColleagueFields.types";

export const ColleagueFields: React.FC<ColleagueFieldsProps> = ({ colleagues, updateFields }) => {
  const initialData: Colleague[] =
    colleagues.length > 0
      ? colleagues
      : [
          {
            name: "",
            position: "",
          },
        ];

  const [formFields, setFormFields] = useState<Colleague[]>(initialData);

  const addNewFields = () => {
    const initialColleague: Colleague = {
      name: "",
      position: "",
    };
    setFormFields([...formFields, initialColleague]);
  };

  const removeFields = (index: number) => {
    let data = [...formFields];
    data.splice(index, 1);
    setFormFields(data);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const targetName: keyof Colleague = event.target.name as keyof Colleague;
    const value: string = event.target.value;
    let data = [...formFields];
    const findedInput = data.find((field, fieldIndex) => fieldIndex === index) as Colleague;
    findedInput[targetName] = value;
    setFormFields(data);
    updateFields({ colleagues: data });
  };

  return (
    <FormWrapper title="Kollégák">
      <div className="dynamic-form">
        {formFields.map((input, index) => (
          <div className="dynamic-fields">
            <div key={index} className="dynamic-input">
              <label>Kolléga neve</label>
              <input type="text" name="name" onChange={(event) => handleInputChange(event, index)} value={input.name} />
              <label>Kolléga pozíciója</label>
              <input
                type="text"
                name="position"
                onChange={(event) => handleInputChange(event, index)}
                value={input.position}
              />
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
};
