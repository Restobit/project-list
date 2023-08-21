import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { CardInfoProps } from "./CardInfo.types";

const MoreInfoBoxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "25rem",
  minHeight: "30rem",
  bgcolor: "background.paper",
  border: "1px solid #000",
  p: 4,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  overflowX: "auto",
};

export default function CardInfo({ showCardInfo, handleCloseShowInfo, project }: CardInfoProps) {
  return (
    <Modal
      open={showCardInfo}
      onClose={handleCloseShowInfo}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={MoreInfoBoxStyle}>
        {project?.colleagues?.map(
          (colleague, index) =>
            colleague.name.length > 0 && (
              <p key={index}>
                Kolléga neve: {colleague.name} - Pozíció: {colleague.position}
              </p>
            )
        )}

        {project?.links?.map(
          (link, index) =>
            link.url.length > 0 && (
              <p key={index}>
                Link {index + 1}: <a href={link.url}>{link.url}</a>
              </p>
            )
        )}
      </Box>
    </Modal>
  );
}
