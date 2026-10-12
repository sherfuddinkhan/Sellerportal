import React from "react";
import {
Table,
TableBody,
TableCell,
TableContainer,
TableHead,
TableRow,
Paper,
IconButton,
Tooltip,
Typography,
Box,
Chip
} from "@mui/material";

import {
Visibility,
Edit,
Delete
} from "@mui/icons-material";

const getExportJobId = (job) =>
job?.ExportJobId ??
job?.exportJobId ??
job?.Id ??
job?.id;

const getValue = (job, ...keys) => {
for (const key of keys) {
if (
job?.[key] !== undefined &&
job?.[key] !== null &&
job?.[key] !== ""
) {
return job[key];
}
}

return "";
};

const formatDate = (value) => {
if (!value) return "-";

const date = new Date(value);

if (Number.isNaN(date.getTime())) return String(value);

return date.toLocaleString("en-IN", {
day: "2-digit",
month: "2-digit",
year: "numeric",
hour: "2-digit",
minute: "2-digit"
});
};

const getStatusColor = (status) => {
switch (String(status || "").toLowerCase()) {
case "active":
case "completed":
case "success":
case "successful":
case "done":
return "success";

case "pending":
case "processing":
case "in progress":
case "running":
  return "warning";

case "failed":
case "error":
case "cancelled":
case "canceled":
  return "error";

case "created":
case "new":
  return "info";

default:
  return "default";


}
};

const ExportJobsTable = ({
exportJobs = [],
onView,
onEdit,
onDelete
}) => {
const handleView = (job) => {
console.log("View Export Job:", job);
if (typeof onView === "function") {
onView(job, getExportJobId(job));
} else {
console.error("onView handler was not passed by the parent component.");
}
};

const handleEdit = (job) => {
console.log("Edit Export Job:", job);
if (typeof onEdit === "function") {
onEdit(job, getExportJobId(job));
} else {
console.error("onEdit handler was not passed by the parent component.");
}
};

const handleDelete = (job) => {
console.log("Delete Export Job:", job);
if (typeof onDelete === "function") {
onDelete(job, getExportJobId(job));
} else {
console.error("onDelete handler was not passed by the parent component.");
}
};

return ( <TableContainer component={Paper} elevation={2}> <Table size="small" stickyHeader> <TableHead> <TableRow>
<TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
<TableCell sx={{ fontWeight: 700 }}>Job Code</TableCell>
<TableCell sx={{ fontWeight: 700 }}>Export Type</TableCell>
<TableCell sx={{ fontWeight: 700 }}>Report Name</TableCell>
<TableCell sx={{ fontWeight: 700 }}>Frequency</TableCell>
<TableCell sx={{ fontWeight: 700 }}>Schedule Time</TableCell>
<TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
<TableCell align="center" sx={{ fontWeight: 700 }}>
Actions </TableCell> </TableRow> </TableHead>


    <TableBody>
      {!Array.isArray(exportJobs) || exportJobs.length === 0 ? (
        <TableRow>
          <TableCell colSpan={8} align="center">
            <Box sx={{ py: 5 }}>
              <Typography color="text.secondary">
                No Export Jobs found.
              </Typography>
            </Box>
          </TableCell>
        </TableRow>
      ) : (
        exportJobs.map((job, index) => {
          const id = getExportJobId(job);

          const jobCode = getValue(job, "JobCode", "jobCode");
          const exportType = getValue(
            job,
            "ExportJobTypeName",
            "exportJobTypeName"
          );
          const reportName = getValue(
            job,
            "ReportName",
            "reportName"
          );
          const frequency = getValue(
            job,
            "Frequency",
            "frequency"
          );
          const scheduleTime = getValue(
            job,
            "ScheduleTime",
            "scheduleTime"
          );
          const status = getValue(job, "Status", "status");

          return (
            <TableRow key={id ?? index} hover>
              <TableCell>{id ?? "-"}</TableCell>
              <TableCell>{jobCode || "-"}</TableCell>
              <TableCell>{exportType || "-"}</TableCell>
              <TableCell>{reportName || "-"}</TableCell>
              <TableCell>{frequency || "-"}</TableCell>
              <TableCell>{formatDate(scheduleTime)}</TableCell>

              <TableCell>
                {status ? (
                  <Chip
                    label={status}
                    size="small"
                    color={getStatusColor(status)}
                  />
                ) : (
                  "-"
                )}
              </TableCell>

              <TableCell align="center">
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 0.5
                  }}
                >
                  <Tooltip title="View">
                    <IconButton
                      size="small"
                      color="info"
                      aria-label="View Export Job"
                      onClick={() => handleView(job)}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      color="warning"
                      aria-label="Edit Export Job"
                      onClick={() => handleEdit(job)}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      color="error"
                      aria-label="Delete Export Job"
                      onClick={() => handleDelete(job)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          );
        })
      )}
    </TableBody>
  </Table>
</TableContainer>


);
};

export default ExportJobsTable;
