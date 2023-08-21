import React from "react";
import { TEXTAREA_ERROR_MESSAGE } from "../../../utils/constants";
import { FormWrapper } from "../../FormWrapper/FormWrapper";
import { ProjectFormProps } from "./ProjectFields.types";

export function ProjectFields({ projectName, title, updateFields }: ProjectFormProps) {
  const hasTextareaLengthError = title!.length > 0 && title!.length < 50;

  return (
    <FormWrapper title="Projekt adatok">
      <div className="dynamic-form">
        <div className="dynamic-fields">
          <div className="dynamic-input">
            <label>Project neve</label>
            <input
              type="text"
              name="project_name"
              value={projectName}
              autoFocus={true}
              required
              max={255}
              onChange={(event) => updateFields({ projectName: event.target.value })}
            />
            <label>Leírás</label>
            <textarea
              name="title"
              cols={8}
              rows={5}
              minLength={50}
              maxLength={500}
              value={title}
              onChange={(event) => updateFields({ title: event.target.value })}
            />
          </div>
        </div>
        {hasTextareaLengthError && <span className="error">{TEXTAREA_ERROR_MESSAGE}</span>}
      </div>
    </FormWrapper>
  );
}
