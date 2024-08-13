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
import {NominationData} from "../../types/NominationForm.types"

interface NominationFormModalProps {
  open: boolean;
  onClose: () => void;
  id: number;
  certificationName: string;
  nomination_open_date: string; 
  nomination_close_date: string; 
}

const NominationFormModal: React.FC<NominationFormModalProps> = ({
  open,
  onClose,
  id,
  certificationName,
  nomination_open_date,
  nomination_close_date,
}) => {
  const navigate = useNavigate();

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
      const getEmployeeId = () => 123;

      const newNomination: NominationData = {
        certification_id: id,
        planned_exam_month: values.plannedExamMonth,
        motivation_description: values.motivation,
        employee_id: getEmployeeId(),
      };

      await submitNomination(newNomination);
      showToast("Nomination submitted successfully!", "success");
      navigate("/user-dashboard");
      onClose();
    } catch {
      showToast("Failed to submit nomination.", "error");
    }
  };

  const minDate = new Date(
    Math.max(new Date(nomination_open_date).getTime(), new Date().setDate(1))
  )
    .toISOString()
    .slice(0, 7);

  const maxDate = new Date(nomination_close_date)
    .toISOString()
    .slice(0, 7);

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
          Please fill in the following details to nominate yourself for this certification.
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
                InputProps={{ inputProps: { min: minDate, max: maxDate } }}
                value={values.plannedExamMonth}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="dense"
              />
              <ErrorMessage name="plannedExamMonth">
                {msg => <Typography color="error">{msg}</Typography>}
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
                {msg => <Typography color="error">{msg}</Typography>}
              </ErrorMessage>

              <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit" color="primary" variant="contained">
                  Submit
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
