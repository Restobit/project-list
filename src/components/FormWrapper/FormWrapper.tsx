import { FormWrapperProps } from "./FormWrapper.types";

export function FormWrapper({ title, children }: FormWrapperProps) {
  return (
    <>
      <h2 style={{ textAlign: "center", margin: 0, marginBottom: "1rem" }}>{title}</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "1rem",
          minHeight: "320px",
        }}
      >
        {children}
      </div>
    </>
  );
}
