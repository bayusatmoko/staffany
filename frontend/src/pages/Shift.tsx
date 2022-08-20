import React, { FunctionComponent, useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import { getErrorMessage } from "../helper/error/index";
import { deleteShiftById, getShifts, publishWeek } from "../helper/api/shift";
import DataTable from "react-data-table-component";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import TaskAltIcon from '@material-ui/icons/CheckCircleOutlineSharp';
import { useHistory } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";
import Alert from "@material-ui/lab/Alert";
import { Link as RouterLink } from "react-router-dom";
import { Button } from "@material-ui/core";
import WeekSlider from "../components/WeekSlider"
import moment from "moment"

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
  },
  fab: {
    position: "absolute",
    bottom: 40,
    right: 40,
    backgroundColor: 'white',
    color: theme.color.turquoise
  },
  addShiftBtn: {
    color: theme.color.turqouise,
    float: "right",
    position: "relative",
    marginLeft: 10,
  },
  publishBtn: {
    color: "white",
    background: theme.color.turqouise,
    marginLeft: 10,
    float: "right",
    position: "relative",
  },
  additionalInfo: {
    float: "right",
    position: "relative",
    color: theme.color.turqouise,
  }
}));

interface ActionButtonProps {
  id: string;
  isDisabled: boolean | undefined;
  onDelete: () => void;
}
const ActionButton: FunctionComponent<ActionButtonProps> = ({
  id,
  isDisabled,
  onDelete,
}) => {
  return (
    <div>
      <IconButton
        size="small"
        aria-label="delete"
        component={RouterLink}
        to={`/shift/${id}/edit`}
        disabled={isDisabled}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton disabled={isDisabled} size="small" aria-label="delete" onClick={() => onDelete()}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

interface Week {
  start: string,
  end: string
}

interface Row {
    "createdAt": Date,
    "updatedAt": Date,
    "id": string,
    "name": string,
    "startTime": string,
    "endTime": string,
    "weekId": string
}

const Shift = () => {
  const getWeek = (currentDate: Date) => {
    const now = moment(currentDate).add(-1, 'days');
    const start = now.clone().weekday(1).format("YYYY-MM-DD");
    const end = now.clone().weekday(7).format("YYYY-MM-DD");
    return {
      start,
      end
    }
  }

  const classes = useStyles();
  const history = useHistory();

  const [rows, setRows] = useState<Row[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [week, setWeek] = useState<Week>(getWeek(new Date()))
  const [weekPublished, setWeekPublished] = useState<boolean | undefined>(false)
  const [weekAdditionalInfo, setWeekAdditionalInfo] = useState<string>("")
  
  const onDeleteClick = (id: string) => {
    setSelectedId(id);
    setShowDeleteConfirm(true);
  };

  const onCloseDeleteDialog = () => {
    setSelectedId(null);
    setShowDeleteConfirm(false);
  };

  const getData = async (week: Week) => {
    try {
      setIsLoading(true);
      setErrMsg("");
      const { results } = await getShifts(week);
      setRows(results.shift);
      if(results.week){
        setWeekPublished(true)
        console.log(results.week.createdAt)
        setWeekAdditionalInfo(getAdditionalInfo(results.week.createdAt))
      } else {
        setWeekAdditionalInfo("")
        setWeekPublished(false)
      }
    } catch (error) {
      const message = getErrorMessage(error);
      setErrMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setWeek(getWeek(currentDate))
  }, [currentDate]);

  useEffect(() => {
    getData(week);
  }, [week])

  const columns = [
    {
      name: "Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Date",
      selector: "date",
      sortable: true,
    },
    {
      name: "Start Time",
      selector: "startTime",
      sortable: true,
    },
    {
      name: "End Time",
      selector: "endTime",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: any) => (
        <ActionButton isDisabled={weekPublished} id={row.id} onDelete={() => onDeleteClick(row.id)} />
      ),
    },
  ];

  interface AdditionalInfoProps {
    weekAdditionalInfo: string;
  }
  const AdditionalInfo: FunctionComponent<AdditionalInfoProps> = ({
    weekAdditionalInfo
  }) => {
    if(weekPublished) {
      return (
        <span className={classes.additionalInfo}><TaskAltIcon style={{paddingTop:10}} />{weekAdditionalInfo}</span>
      )
    } else {
      return (
        <></>
      )
    }
  }

  const getAdditionalInfo = (date: Date) => {
    const dateInput = new Date(date)
    const dateMoment = moment(dateInput)
    return `Week published on ${dateMoment.format("DD MMM YYYY, HH:mm A")}`
  }

  const publish = async () => {
    try {
      setIsLoading(true);
      setErrMsg("");
      const weekId = week.start.replace(/-/g, "")
      const { results } = await publishWeek(weekId);
      if(results){
        setWeekPublished(true)
        setWeekAdditionalInfo(getAdditionalInfo(results.createdAt))
      } else {
        setWeekAdditionalInfo("")
        setWeekPublished(false)
      }
    } catch (error) {
      const message = getErrorMessage(error);
      setErrMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDataById = async () => {
    try {
      setDeleteLoading(true);
      setErrMsg("");

      if (selectedId === null) {
        throw new Error("ID is null");
      }

      console.log(deleteDataById);

      await deleteShiftById(selectedId);

      const tempRows = [...rows];
      const idx = tempRows.findIndex((v: any) => v.id === selectedId);
      tempRows.splice(idx, 1);
      setRows(tempRows);
    } catch (error) {
      const message = getErrorMessage(error);
      setErrMsg(message);
    } finally {
      setDeleteLoading(false);
      onCloseDeleteDialog();
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card className={classes.root}>
          <CardContent>
            {errMsg.length > 0 ? (
              <Alert severity="error">{errMsg}</Alert>
            ) : (
              <></>
            )}
              <WeekSlider 
                currentDate={currentDate} 
                setCurrentDate={setCurrentDate} 
                textColor={weekPublished ? "turquoise": ""} />
              <Button
                variant="contained"
                color="primary"
                className={classes.publishBtn}
                onClick={publish}
                disabled={rows.length === 0 || weekPublished}
              >
                PUBLISH
              </Button>
              <Button
                variant="outlined"
                className={classes.addShiftBtn}
                onClick={() => history.push("/shift/add")}
                disabled={weekPublished}
              >
                ADD SHIFT
              </Button>
              <AdditionalInfo weekAdditionalInfo={weekAdditionalInfo} />
            <DataTable
              columns={columns}
              data={rows}
              pagination
              progressPending={isLoading}
            />
          </CardContent>
        </Card>
      </Grid>
      <ConfirmDialog
        title="Delete Confirmation"
        description={`Do you want to delete this data ?`}
        onClose={onCloseDeleteDialog}
        open={showDeleteConfirm}
        onYes={deleteDataById}
        loading={deleteLoading}
      />
    </Grid>
  );
};

export default Shift;
