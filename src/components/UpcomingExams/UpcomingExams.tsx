import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { styled } from "@mui/system";
import { UpcomingExam } from "../../types/UpcomingExams.types";
import { fetchUpcomingExams } from "../../api/UpcomingExamsApi";
import { Link } from "react-router-dom";

// Function to calculate days until the exam
const calculateDaysUntilExam = (examDate: string) => {
  const today = new Date();
  const exam = new Date(examDate);
  const diffTime = exam.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays < 0) return "Past";
  return `${diffDays} days left`;
};

// Style the card with a dynamic border color based on the level
const LevelCard = styled(Card)<{
  level: "Beginner" | "Intermediate" | "Expert";
}>(({ level }) => ({
  borderTop: `4px solid ${
    level === "Beginner" ? "green" : level === "Intermediate" ? "blue" : "red"
  }`,
  backgroundColor: "#fff",
  minHeight: 150,
  maxWidth: 300,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  padding: "5px",
  borderRadius: "8px",
}));

const UpcomingExams: React.FC = () => {
  const [exams, setExams] = useState<UpcomingExam[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUpcomingExams();
        setExams(data);
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      }
    };

    fetchData();
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? exams.length - 1 : prevIndex - 1
    );
  };

  // Memoize handleNext to avoid re-creating it on every render
  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === exams.length - 1 ? 0 : prevIndex + 1
    );
  }, [exams.length]);

  useEffect(() => {
    const intervalId = setInterval(handleNext, 3000); // Change slide every 3 seconds

    return () => {
      clearInterval(intervalId); // Cleanup interval on component unmount
    };
  }, [handleNext]);

  return (
    <Box
      sx={{
        maxWidth: 300,
        height: 215,
        m: "2vh",
        backgroundColor: "white",
        padding: "10px",
        paddingBottom: "4vh",
        borderRadius: "8px",
      }}
    >
      <Typography
        variant="h6"
        component="h2"
        gutterBottom
        sx={{ textAlign: "center", fontSize: "1rem", marginBottom: "0" }}
      >
        Upcoming Exams <span>({exams.length})</span>
      </Typography>
      {exams.length === 0 ? (
        <Box
          sx={{
            maxWidth: 300,
            backgroundColor: "#f9f9f9",
            padding: "1.6rem",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <InfoOutlinedIcon sx={{ fontSize: "2rem", color: "#757575" }} />
          <Typography
            variant="body1"
            sx={{ mt: ".5rem", mb: ".2rem", textAlign: "center" }}
          >
            No upcoming exams
          </Typography>
          <Typography variant="body2" sx={{ mb: ".5rem", textAlign: "center" }}>
            Explore all available certifications
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="success" // Green color
            sx={{ padding: "0.3rem 2rem", borderRadius: "8px" }}
          >
            Explore
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center", marginTop: ".4rem" }}>
          <IconButton onClick={handlePrevious}>
            <ArrowBackIosIcon />
          </IconButton>
          <LevelCard level={exams[currentIndex].level} sx={{ flex: 1 }}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h6"
                component="h3"
                sx={{ fontWeight: "bold", fontSize: "1rem", mb: 1 }}
              >
                {exams[currentIndex].title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontWeight: "bold",
                  mb: 1,
                  border: "1px solid",
                  borderColor:
                    calculateDaysUntilExam(exams[currentIndex].date) === "Today"
                      ? "green"
                      : "text.secondary",
                  borderRadius: "4px",
                  padding: "4px",
                }}
              >
                {calculateDaysUntilExam(exams[currentIndex].date)}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", color: "#1976d2" }}
              >
                {exams[currentIndex].date}
              </Typography>
            </CardContent>
          </LevelCard>
          <IconButton onClick={handleNext}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default UpcomingExams;
