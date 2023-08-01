import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Colleague, DynamicFormProps, FormInput } from "../../ts/interfaces";
import { ColleagueName, ColleaguePosition } from "./dynamicForm.types";
import Button from "@mui/material/Button";

const DynamicForm: React.FC<DynamicFormProps> = ({
  settings,
  data,
  step,
  setProjectFormData,
}) => {
  const initialFormInputs: FormInput[] = settings.map((setting) => ({
    matchId: 1,
    label: setting.labelTitle,
    inputName: setting.inputName,
  }));

  const [formInputs, setFormInputs] = useState<FormInput[]>(initialFormInputs);
  const [colleagueName, setColleagueName] = useState<ColleagueName[]>([]);
  const [colleaguePosition, setColleaguePosition] = useState<
    ColleaguePosition[]
  >([]);

  const [colleaguesData, setColleaguesData] = useState<Colleague[]>([]);

  useEffect(() => {
    setFormInputs(initialFormInputs);
  }, [step]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFormInputs = [...formInputs];
    const inputName = event.target.name;
    const value = event.target.value;

    setFormInputs(newFormInputs);

    const inputMatchId = event.target.getAttribute("data-matchid");
    if (inputName === "name") {
      const nameWithMatchId = { name: value, matchId: Number(inputMatchId) };
      setColleagueName((prevColleagueNames) => [
        ...prevColleagueNames,
        ...[nameWithMatchId],
      ]);
    }

    if (inputName === "position") {
      const positionWithMatchId = {
        position: value,
        matchId: Number(inputMatchId),
      };

      setColleaguePosition((prevColleagueNames) => [
        ...prevColleagueNames,
        ...[positionWithMatchId],
      ]);
    }

    const mergedMap = new Map();
    colleagueName.forEach((item) => mergedMap.set(item.matchId, { ...item }));
    colleaguePosition.forEach((item) =>
      mergedMap.set(item.matchId, { ...mergedMap.get(item.matchId), ...item })
    );

    const colleagues = Array.from(mergedMap.values());
    if (colleagues) {
      setColleaguesData(colleagues);
      const newColleaguesFormData = {
        ...data,
        colleagues: [...colleaguesData],
      };
      setProjectFormData(newColleaguesFormData);
    }
  };

  const handleAddNewInputs = () => {
    const matchId = formInputs[formInputs.length - 1].matchId + 1;

    setFormInputs((prevFormInputs) => [
      ...prevFormInputs,
      ...settings.map((setting) => ({
        matchId,
        label: setting.labelTitle,
        inputName: setting.inputName,
      })),
    ]);
  };

  return (
    <div className="dynamic-form">
      {formInputs.map((input, index) => (
        <div key={index} className="input-group">
          <label>
            {input.label}:
            <input
              type="text"
              onChange={(e) => handleInputChange(e)}
              name={input.inputName}
              data-matchid={input.matchId}
            />
          </label>
        </div>
      ))}

      <Button
        variant="contained"
        color="info"
        startIcon={<AddIcon />}
        onClick={handleAddNewInputs}
        size="small"
      >
        Hozzáadás
      </Button>
    </div>
  );
};

export default DynamicForm;
