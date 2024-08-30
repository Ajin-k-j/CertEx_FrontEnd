import { fetchPendingNominations } from "../../api/PendingActionTableAPI"
import DUBarGraph from "../../components/BarGraph/DUBarGraph/DUBargraph"
import PendingNominationsTable from "../../components/PendingActions/PendingActionsTable/PendingActionsTable"
import PendingNominationCard from "../../components/PendingActions/PendingNominationCardList/PendingNominationCardList"
import DepartmentStatisticsCard from "../../components/DepartmentStatistics/DepartmentStatisticsCard"
import DepartmentNominationsTable from '../../components/DepartmentNominationsTable/DepartmentNominationsTable'
import { Grid } from "@mui/material";

const DepartmentAdminDashboard = () => {
  return ( 


    <Grid container spacing={-2} sx={{ padding: ".1rem" }}>
      <Grid container item xs={12} spacing={-3}>
        <Grid item xs={12} md={6} lg={5.9}>
          <Grid container direction="column" spacing={-2}>
            <Grid item>
              <DUBarGraph />
            </Grid>
            <Grid item>
              <DepartmentStatisticsCard />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <PendingNominationsTable
            fetchNominations={fetchPendingNominations}
            itemsPerPage={3}
            CardComponent={PendingNominationCard}
            containerHeight="250px"
            containerWidth="100%" // Make it responsive
          />
        </Grid>
      </Grid>
    
      {/* Full-width row for DepartmentNominationsTable */}
      <Grid item xs={12}>
        <DepartmentNominationsTable />
      </Grid>
    </Grid>
    

  );
}

export default DepartmentAdminDashboard

