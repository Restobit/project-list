import React, { useEffect, useState, useMemo, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Stepper } from "react-form-stepper";
import { Project } from "./ts/interfaces";
import ProjectForm from "./components/projectForm/ProjectForm";
import { useDebounce } from "use-debounce";
import { shortProjectName } from "./utils/shortProjectName";
import { asyncFetchProjects } from "./services/asyncFetchProjects";
import "./App.scss";
import "./style/main.scss";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40rem",
  height: "30rem",
  bgcolor: "background.paper",
  border: "1px solid #000",
  p: 4,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  overflowX: "auto",
};

function App() {
  const [searchInput, setSearchInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [debouncedFilter] = useDebounce(inputRef.current?.value, 500);
  const [projects, setProjects] = useState<Project[]>([]);
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);
  const [projectFormData, setProjectFormData] = useState<Project>({
    id: 1,
    name: "",
    title: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [step, setStep] = useState(0);
  const increseStep = () => {
    if (step < 2) {
      setStep(step + 1);
    }
  };
  const decreaseStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const memoizedAsyncFetchProjects = useMemo(() => asyncFetchProjects(), []);

  const fetchProjects = async () => {
    try {
      const fetchedProjects = await memoizedAsyncFetchProjects;
      setProjects(fetchedProjects);
      setLoading(false);
    } catch (error) {
      setError("Error fetching projects.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [memoizedAsyncFetchProjects]);

  useEffect(() => {
    if (searchInput.length > 0) {
      const filteredProjectsByName = projects.filter((project) => {
        if (inputRef.current) {
          return project.name.match(inputRef?.current?.value.toLowerCase());
        }
        return [];
      });

      setProjects(filteredProjectsByName);
    } else {
      setProjects(savedProjects);
    }
  }, [debouncedFilter]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchInput(e.target.value.toLowerCase());
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleClose();
    setProjectFormData({
      id: 1,
      name: "",
      title: "",
    });

    setProjects((prevProjects) => [...prevProjects, ...[projectFormData]]);
    setSavedProjects((prevProjects) => [...prevProjects, ...[projectFormData]]);
    setStep(0);
  };

  const disableNextButton =
    (projectFormData.title!.length > 0 && projectFormData.title!.length < 50) ||
    projectFormData.name!.length === 0;

  return (
    <div>
      <nav>
        <div className="search">
          <input
            type="text"
            className="search-term"
            placeholder="Keresés"
            onChange={handleChange}
            ref={inputRef}
          />
        </div>
        <Button
          variant="contained"
          onClick={handleOpen}
          startIcon={<AddIcon />}
        >
          Új projekt
        </Button>
      </nav>

      <div className="container">
        <h2>Projektek</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : projects.length > 0 ? (
          <div className="card-list">
            {projects.map((project) => (
              <div className="card">
                <img
                  src={
                    "https://fakeimg.pl/100x100/ffffff/66b3ff?text=" +
                    shortProjectName(project.name)
                  }
                  alt={project.name}
                />
                <p>{project.name}</p>
                <p>{project.title}</p>
              </div>
            ))}
          </div>
        ) : savedProjects.length === 0 ? (
          <p>Önnek még nincs projektje.</p>
        ) : (
          <p>A keresett projekt nem található.</p>
        )}

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <p>Projekt hozzáadása</p>
            <Stepper
              steps={[
                { label: "Project adatok" },
                { label: "Kollégák" },
                { label: "Linkek" },
              ]}
              activeStep={step}
              styleConfig={{
                activeBgColor: "#2b7cff",
                activeTextColor: "#fff",
                inactiveBgColor: "#fff",
                inactiveTextColor: "#2b7cff",
                completedBgColor: "#fff",
                completedTextColor: "#2b7cff",
                size: "3em",
                circleFontSize: "1rem",
                labelFontSize: "1rem",
                borderRadius: "1rem",
                fontWeight: "700",
              }}
              className={"stepper"}
              stepClassName={"stepper__step"}
            />

            <ProjectForm
              step={step}
              data={projectFormData}
              setProjectFormData={setProjectFormData}
            />

            <div className="step-buttons">
              <Button
                variant="contained"
                onClick={decreaseStep}
                disabled={step < 1}
              >
                Vissza
              </Button>

              {step > 1 ? (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<SaveIcon />}
                  onClick={handleSubmit}
                >
                  Mentés
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={increseStep}
                  disabled={disableNextButton}
                >
                  Tovább
                </Button>
              )}
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default App;
