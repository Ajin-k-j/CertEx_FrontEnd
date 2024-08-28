import AwsStatisticsCard from "../../components/AwsStatistics/AwsStatisticsCard"
import AWSAdminBarGraph from "../../components/BarGraph/AWSAdminBarGraph/AWSAdminBarGraph"
import AwsAccountTable from '../../components/AwsAccountTable/AwsAccountTable'
import { fetchPendingNominations } from "../../api/PendingActionTableAPI"

import PendingNominationsTable from "../../components/PendingActions/PendingActionsTable/PendingActionsTable"
import PendingNominationCard from "../../components/PendingActions/PendingNominationCardList/PendingNominationCardList"
import { Grid } from "@mui/material";

const AwsAdminDashboard = () => {
  return (

    <Grid container spacing={-1} sx={{ padding: ".1rem" }}>
      <Grid container item xs={12} spacing={-1}>
        <Grid item xs={12} md={6} lg={5.9}>
          <Grid container direction="column" spacing={-2}>
            <Grid item>
            <AWSAdminBarGraph />
            </Grid>
            <Grid item>
            <AwsStatisticsCard/>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
        <PendingNominationsTable fetchNominations={fetchPendingNominations} itemsPerPage={3} CardComponent={PendingNominationCard} containerHeight="71vh" containerWidth="600px" />
        </Grid>
      </Grid>
    
      {/* Full-width row for DepartmentNominationsTable */}
      <Grid item xs={12}>
      <AwsAccountTable />
      </Grid>
    </Grid>

  )
}

export default AwsAdminDashboard
