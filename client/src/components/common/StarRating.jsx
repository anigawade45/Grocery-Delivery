import React from "react";
import Rating from "@mui/material/Rating";
import { styled } from "@mui/material/styles";

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#f59e0b", // Tailwind orange-500
  },
  "& .MuiRating-iconHover": {
    color: "#f97316", // Tailwind orange-600
  },
});

const StarRating = ({ rating, onChange, readOnly = !onChange, size = "medium" }) => {
  return (
    <StyledRating
      name="star-rating"
      value={Number.isFinite(Number(rating)) ? Number(rating) : 0}
      precision={0.5}
      readOnly={readOnly}
      onChange={(e, newValue) => onChange && onChange(newValue ?? 0)}
      size={size}
    />
  );
};

export default StarRating;