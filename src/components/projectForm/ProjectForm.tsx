import React from "react";
import { ProjectFormProps } from "../../ts/interfaces";
import DynamicForm from "../dynamicForm/DynamicForm";

const ProjectForm = ({ step, data, setProjectFormData }: ProjectFormProps) => {
  const { name, title, link } = data;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFormInputData = { ...data, name: event.target.value };
    setProjectFormData(newFormInputData);
  };

  const handlelLinktChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFormInputData = { ...data, link: event.target.value };
    setProjectFormData(newFormInputData);
  };

  switch (step) {
    case 0:
      return (
        <>
          <label>Project neve</label>
          <input
            type="text"
            name="project_name"
            defaultValue={name.length > 0 ? name : ""}
            required
            max={255}
            onChange={(e) => handleInputChange(e)}
          />
          <label>Leírás</label>
          {title!.length > 0 && title!.length < 50 && (
            <p>Legalább 50 karater hosszú szövegnek kell lennie!</p>
          )}
          <textarea
            name="title"
            cols={10}
            rows={10}
            minLength={50}
            maxLength={500}
            value={title}
            onChange={(e) =>
              setProjectFormData({ ...data, title: e.target.value })
            }
          />
        </>
      );
    case 1:
      return (
        <>
          <DynamicForm
            settings={[
              { labelTitle: "Kolléga neve", inputName: "name" },
              {
                labelTitle: "Kolléga pozíciója",
                inputName: "position",
              },
            ]}
            data={data}
            step={step}
            setProjectFormData={setProjectFormData}
          />
        </>
      );
    case 2:
      return (
        <div className="input-link">
          <label>Link</label>
          <input
            type="text"
            name="link"
            defaultValue={name.length > 0 ? link : ""}
            onChange={(e) => handlelLinktChange(e)}
          />
        </div>
      );

    default:
      return null;
  }
};

export default ProjectForm;
