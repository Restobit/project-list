import React, { useEffect, useState, useMemo, useRef, FormEvent } from "react";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import { INITIAL_FORM_DATA } from "./utils/constants";
import { Stepper } from "react-form-stepper";
import { Project } from "./ts/interfaces";
import { useDebounce } from "use-debounce";
import { shortProjectName } from "./utils/shortProjectName";
import { asyncFetchProjects } from "./services/asyncFetchProjects";
import { useMultistepForm } from "./hooks/useMultistepForm";
import { ProjectFields } from "./components/form/ProjectFields/ProjectFields";
import { ColleagueFields } from "./components/form/ColleagueFields/ColleagueFields";
import { LinkFields } from "./components/form/LinkFields/LinkFields";
import CardInfo from "./components/CardInfo/CardInfo";
import "./App.scss";
import "./style/main.scss";

const BoxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40rem",
  height: "40rem",
  bgcolor: "background.paper",
  border: "1px solid #000",
  p: 4,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  overflowX: "auto",
};

function App() {
  const [searchInput, setSearchInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [debouncedFilter] = useDebounce(inputRef.current?.value, 500);
  const [projects, setProjects] = useState<Project[]>([]);
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState<Project>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [showCardInfo, setShowCardInfo] = useState(false);
  const handleCloseShowInfo = () => setShowCardInfo(false);
  const [showCardIndex, setShowCardIndex] = useState<number>(0);

  const showMoreInfo = (index: number) => {
    setShowCardInfo(true);
    setShowCardIndex(index);
  };

  function updateFields(fields: Partial<Project>) {
    setFormData((prev) => {
      return { ...prev, ...fields };
    });
  }

  const { currentStepIndex, formStep, isFirstStep, isLastStep, back, next, goTo } = useMultistepForm([
    <ProjectFields {...formData} updateFields={updateFields} />,
    <ColleagueFields {...formData} updateFields={updateFields} />,
    <LinkFields {...formData} updateFields={updateFields} />,
  ]);

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
          return project.projectName.match(inputRef?.current?.value.toLowerCase());
        }
        return [];
      });

      setProjects(filteredProjectsByName);
    } else {
      setProjects(savedProjects);
    }
  }, [debouncedFilter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchInput(e.target.value.trim().toLowerCase());
  };

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isLastStep) return next();

    goTo(0);
    handleClose();
    setProjects((prevProjects) => [...prevProjects, ...[formData]]);
    setSavedProjects((prevProjects) => [...prevProjects, ...[formData]]);
    setFormData({
      projectName: "",
      title: "",
      colleagues: [{ name: "", position: "" }],
      links: [{ url: "" }],
    });
  }

  const hasTextareaLengthError = formData.title!.length > 0 && formData.title!.length < 50;

  return (
    <div>
      <nav>
        <div className="search">
          <input
            type="text"
            className="search-term"
            placeholder="Keresés"
            onChange={handleSearchChange}
            ref={inputRef}
          />
        </div>
        <Button variant="contained" onClick={handleOpen} startIcon={<AddIcon />}>
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
            {projects.map((project, index) => (
              <div key={index} className="card">
                <img
                  src={"https://fakeimg.pl/100x100/ffffff/66b3ff?text=" + shortProjectName(project.projectName)}
                  alt={project.projectName}
                />
                <p>Projekt neve:{project.projectName}</p>
                <p>Leírás: {project.title}</p>
                <IconButton
                  color="primary"
                  aria-label="show more info about project"
                  onClick={() => showMoreInfo(index)}
                >
                  <InfoIcon />
                </IconButton>
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
          <Box sx={BoxStyle}>
            <p>Projekt hozzáadása</p>
            <Stepper
              steps={[{ label: "Project adatok" }, { label: "Kollégák" }, { label: "Linkek" }]}
              activeStep={currentStepIndex}
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

            <form onSubmit={onSubmit}>
              {formStep}
              <div className="step-buttons">
                <Button variant="contained" onClick={back} disabled={isFirstStep}>
                  Vissza
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  startIcon={isLastStep ? <SaveIcon /> : ""}
                  disabled={hasTextareaLengthError}
                >
                  {isLastStep ? "Mentés" : "Tovább"}
                </Button>
              </div>
            </form>
          </Box>
        </Modal>

        <CardInfo
          showCardInfo={showCardInfo}
          handleCloseShowInfo={handleCloseShowInfo}
          project={projects[showCardIndex]}
        />
      </div>
    </div>
  );
}

export default App;
