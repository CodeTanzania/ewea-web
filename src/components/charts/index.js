import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';

// echarts components
import 'echarts/lib/component/grid';
import 'echarts/lib/component/graphic';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

// echarts charts
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';

import macaronsTheme from './macarons.theme.json';

echarts.registerTheme('macarons', macaronsTheme.theme);

/**
 * @function
 * @name generateDonutChartOption
 * @description Generate Donut chart option
 * @param {string} chartName Chart name
 * @param {object[]} data List of data to be visualized
 * @returns {object} Option object
 * @version 0.1.0
 * @since 0.1.0
 */
export const generateDonutChartOption = (chartName, data) => {
  const legendLabels = map(data, (item) => item.name);
  const option = {
    textStyle: { fontFamily: 'Lato' },
    tooltip: {
      trigger: 'item', // configurable
      formatter: '{a} <br/>{b}: {c} ({d}%)', // configurable
    },
    legend: {
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      icon: 'circle',
      data: legendLabels,
    },
    series: [
      {
        name: chartName,
        type: 'pie',
        radius: ['40%', '60%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'outside',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '30',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: true,
        },
        data,
      },
    ],
  };

  return option;
};

/**
 * @function
 * @name generateInvertedBarChartOption
 * @description Generate option for inverted bar chart
 * @param {string} chartName Chart name
 * @param {object[]} data List of data to be visualized
 * @param {string} xLabel X-Axis label
 * @param {string} yLabel Y-Axis label
 * @returns {object} Option object
 * @version 0.1.0
 * @since 0.1.0
 *
 */
export const generateInvertedBarChartOption = (
  chartName,
  data,
  xLabel,
  yLabel
) => {
  const Y_AXIS = map(data, (item) => item.name);
  const SERIES_DATA = map(data, (item) => item.value);
  const option = {
    textStyle: { fontFamily: 'Lato' },
    title: {
      text: chartName,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      grid: 100,
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 1],
      name: xLabel,
      nameLocation: 'center',
      nameTextStyle: {
        fontWeight: 'bold',
        padding: [20, 0, 0, 0],
      },
    },
    yAxis: {
      type: 'category',
      data: Y_AXIS,
      nameGap: 15,
      boundaryGap: ['20%', '20%'],
      name: yLabel,
      nameTextStyle: { fontWeight: 'bold', align: 'left' },
    },
    series: [
      {
        name: chartName,
        type: 'bar',
        data: SERIES_DATA,
      },
    ],
  };

  return option;
};

export const EChart = ({ option, style }) => {
  return (
    <ReactEchartsCore
      echarts={echarts}
      option={option}
      notMerge
      lazyUpdate
      style={style}
      theme="macarons"
    />
  );
};

EChart.propTypes = {
  option: PropTypes.shape(PropTypes.any).isRequired,
  style: PropTypes.shape(PropTypes.any),
};

EChart.defaultProps = {
  style: null,
};
