import React, { PureComponent } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
class OutputsChart extends PureComponent {
  static jsfiddleUrl = "https://jsfiddle.net/alidingling/30763kr7/";

  render() {
    const { t } = this.props;
    return (
      <>
        {" "}
        <div className="outputHeader">
          <h5 className="p-3">{t("subTasksOutput")}</h5>
          <p className="pt-4">
            <span className="ml-3">
              <span
                style={{ backgroundColor: "#011354" }}
                className="outPutColor"
              ></span>
              {t("common:allTasks")}
            </span>
            <span className="mr-3">
              <span
                style={{ backgroundColor: "#025358" }}
                className="outPutdoneColor"
              ></span>
              {t("common:finishedTasks")}
            </span>
          </p>
          <span></span>
        </div>
        <BarChart
          className="outputChart "
          width={450}
          height={300}
          data={this.props.outputsData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
          barSize={5}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            dx={1}
            minTickGap={5}
            orientation="right"
            width={30}
            padding={{ left: 8 }}
            label={{
              value: "معاملة",
              offset: "-4",
              position: "insideTopRight"
            }}
            tickMargin={30}
          />
          <Bar dataKey="finishedCount" fill="#025358" />
          <Bar dataKey="allCount" fill="#011354" />
        </BarChart>
      </>
    );
  }
}
export default connect(null)(
  withTranslation(["performance", "common"])(OutputsChart)
);
