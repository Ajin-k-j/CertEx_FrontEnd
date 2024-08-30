import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { submitNomination } from "../../api/NominationApi";
import { showToast } from "../../utils/toastUtils";
import { NominationData } from "../../types/NominationForm.types";

interface NominationFormModalProps {
  open: boolean;
  onClose: () => void;
  id: number;
  certificationName: string;
  nominationOpenDate: string;
  nominationCloseDate: string;
  nominationStatus: string;
}

const NominationFormModal: React.FC<NominationFormModalProps> = ({
  open,
  onClose,
  id,
  certificationName,
  nominationStatus,
  nominationOpenDate,
  nominationCloseDate,
}) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    plannedExamMonth: "",
    motivation: "",
  };

  const validationSchema = Yup.object({
    plannedExamMonth: Yup.string().required("Planned Exam Month is required"),
    motivation: Yup.string().required("Motivation is required"),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      setIsSubmitting(true); // Set submitting state to true
      const getEmployeeId = () => 3; // Replace with actual logic to get employee ID

      const newNomination: NominationData = {
        certificationId: id,
        plannedExamMonth: values.plannedExamMonth,
        motivationDescription: values.motivation,
        employeeId: getEmployeeId(),
        createdBy: getEmployeeId().toString(),
        updatedBy: getEmployeeId().toString(),
      };

      await submitNomination(newNomination);
      showToast("Nomination submitted successfully!", "success");
      navigate("/dashboard");
      onClose();
    } catch (error: unknown) {
      // Handle error and show toast message
      const errorMessage =
        error instanceof Error ? error.message : "Failed to submit nomination.";
      showToast(errorMessage, "error");
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  const minDate = new Date(
    Math.max(new Date(nominationOpenDate).getTime(), new Date().setDate(1))
  )
    .toISOString()
    .slice(0, 7);

  const maxDate = new Date(nominationCloseDate).toISOString().slice(0, 7);

  const isNominationOpen = nominationStatus === "Accepting";
  const isNominationClosed = nominationStatus === "Not Accepting";
  const isAlwaysAccepting = nominationStatus === "Always Accepting";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "10px",
          padding: "10px",
          minWidth: "300px",
        },
      }}
    >
      <DialogTitle>
        Nominate for{" "}
        <Typography
          component="span"
          sx={{ color: "#1976d2", fontWeight: "bold", fontSize: "1.2rem" }}
        >
          {certificationName}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Please fill in the following details to nominate yourself for this
          certification.
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur }) => (
            <Form>
              <Field
                as={TextField}
                name="plannedExamMonth"
                label="Planned Exam Month"
                type="month"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  inputProps: {
                    min: isNominationOpen || isAlwaysAccepting ? minDate : "",
                    max: isNominationOpen ? maxDate : "",
                    disabled: isNominationClosed,
                  },
                }}
                value={values.plannedExamMonth}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="dense"
                disabled={isNominationClosed}
              />
              <ErrorMessage name="plannedExamMonth">
                {(msg) => <Typography color="error">{msg}</Typography>}
              </ErrorMessage>

              <Field
                as={TextField}
                name="motivation"
                label="What motivates you to take this certification?"
                type="text"
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                placeholder="This will be reviewed by the Department head and L&D."
                value={values.motivation}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="dense"
              />
              <ErrorMessage name="motivation">
                {(msg) => <Typography color="error">{msg}</Typography>}
              </ErrorMessage>

              {isNominationClosed && (
                <Typography variant="body2" sx={{ mt: 2, color: "red" }}>
                  Nomination is Closed.
                </Typography>
              )}

              <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={isNominationClosed || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default NominationFormModal;
