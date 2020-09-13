import React from "react";
import { Card, CardBody, CardSubtitle, CardText, CardTitle } from "reactstrap";
import CloseButton from "./CloseButton";

class EventDetail extends React.Component {
  render() {
    const event = this.props.event;

    return (
      <Card className="border-dark">
        <CardBody>
          <CardTitle tag="h5" className="mw-100 mb-4">
            {event.group}{" "}
            <small className="text-muted">({this.props.objClass})</small>
            <CloseButton
              divKey={`popper-details-${event.subgroup}`}
              popperKey={`details-${event.subgroup}`}
            />
          </CardTitle>
          <CardSubtitle className="mw-100">
            {event.content} - {event.title.toString()}
          </CardSubtitle>
          <CardText tag="div" className="border-top mw-100">
            {this.props.children}
          </CardText>
        </CardBody>
      </Card>
    );
  }
}

export default EventDetail;
