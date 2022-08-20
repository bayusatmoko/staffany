import React, { FunctionComponent } from "react";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import moment from 'moment'

interface IProps {
    currentDate: Date,
    setCurrentDate: (date: Date) => void,
    textColor: string
}

const WeekSlider: FunctionComponent<IProps> = ({currentDate, setCurrentDate, textColor = "black"}) => {
    const getWeek = (currentDate: Date) => {
        var now = moment(currentDate);
        var monday = now.clone().weekday(1).format("DD MMM");
        var friday = now.clone().weekday(7).format("DD MMM");
        return `${monday} - ${friday}`
    }

    return (
        <>
            <IconButton onClick={() => { setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7))) }}>
                <ChevronLeftIcon fontSize="small" />
            </IconButton>
            <span style={{color: textColor, fontWeight: 'bold'}}>{getWeek(currentDate)}</span>
            <IconButton onClick={() => { setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7))) }}>
                <ChevronRightIcon fontSize="small" />
            </IconButton>
        </>
    )
};

export default WeekSlider;