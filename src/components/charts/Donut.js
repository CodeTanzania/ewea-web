import React from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/pie';

/**
 * @function
 * @name PieChart
 * @description Pie Chart widget by echarts
 * @returns {object} Render Pie chart widget
 * @version 0.1.0
 * @since 0.1.0
 */
const PieChart = () => {
  const option = {
    tooltip: {
      trigger: 'item', // configurable
      formatter: '{a} <br/>{b}: {c} ({d}%)', // configurable
    },
    legend: {
      orient: 'vertical',
      right: 10,
      icon: 'circle',
      data: ['Male', 'Female', 'Unknown'], // configurable
    },
    series: [
      {
        name: 'Gender Chart', // configurable
        type: 'pie',
        radius: ['50%', '70%'],
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
        data: [
          // configurable
          { value: 335, name: 'Male' },
          { value: 310, name: 'Female' },
          { value: 234, name: 'Unknown' },
        ],
      },
    ],
  };
  return (
    <ReactEchartsCore echarts={echarts} option={option} notMerge lazyUpdate />
  );
};

export default PieChart;
