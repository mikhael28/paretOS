import React from "react";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryStack,
} from "victory";
import {
  CarouselProvider,
  Slider,
  Slide,
  // ButtonBack,
  // ButtonNext,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { I18n } from "@aws-amplify/core";
import classNames from "classnames";

/**
 * Analytics component is a carousel that CAN contain multiple charts. Right now it just contains one.
 * @TODO Adding in different statistical analyses, outside of just the overall performance.
 * @TODO Adding in historical information, from previous sprints/personal best.
 * @param {missions} props
 * @returns
 */
function Analytics(props) {
  let blockClass = classNames("context-card", "block");
  return (
    <div className="context-cards">
      <div
        className={blockClass}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <h4>{I18n.get("weeklyPerformanceAnalytics")}</h4>
        <CarouselProvider
          naturalSlideWidth={800}
          naturalSlideHeight={800}
          totalSlides={1}
          style={{ width: 300, height: 300 }}
        >
          <Slider>
            <Slide index={0}>
              <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
                <VictoryAxis
                  // tickValues specifies both the number of ticks and where
                  // they are placed on the axis
                  tickValues={[0, 1, 2, 3, 4]}
                  tickFormat={["Mon", "Tues", "Wed", "Thur", "Fri"]}
                />
                <VictoryAxis
                  dependentAxis
                  // tickFormat specifies how ticks should be displayed
                  tickFormat={(x) => `${x * 100}%`}
                />
                <VictoryStack colorScale="warm">
                  <VictoryBar
                    data={props.missions}
                    x="quarter"
                    y="dailyCompletion"
                  />
                </VictoryStack>
              </VictoryChart>
            </Slide>
          </Slider>
          {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<ButtonBack>{I18n.get('back')}</ButtonBack>
						<ButtonNext>{I18n.get('next')}</ButtonNext>
					</div> */}
        </CarouselProvider>
      </div>
    </div>
  );
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Analytics);
