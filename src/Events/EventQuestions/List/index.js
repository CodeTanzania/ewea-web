import { httpActions } from '@codetanzania/ewea-api-client';
import {
  deleteEventQuestion,
  paginateEventQuestions,
  refreshEventQuestions,
} from '@codetanzania/ewea-api-states';
import { List } from 'antd';
import concat from 'lodash/concat';
import intersectionBy from 'lodash/intersectionBy';
import map from 'lodash/map';
import remove from 'lodash/remove';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ListHeader from '../../../components/ListHeader';
import Toolbar from '../../../components/Toolbar';
import { notifyError, notifySuccess } from '../../../util';
import EventQuestionsListItem from '../ListItem';

/* constants */
const nameSpan = { xxl: 5, xl: 5, lg: 4, md: 5, sm: 10, xs: 10 };
const codeSpan = { xxl: 2, xl: 2, lg: 2, md: 2, sm: 5, xs: 5 };
const indicatorSpan = { xxl: 6, xl: 6, lg: 6, md: 5, sm: 4, xs: 4 };
const descriptionSpan = { xxl: 8, xl: 8, lg: 9, md: 9, sm: 0, xs: 0 };

const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...codeSpan, header: 'Code' },
  { ...indicatorSpan, header: 'Indicator' },
  { ...descriptionSpan, header: 'Description' },
];
const { getEventQuestionsExportUrl } = httpActions;

/**
 * @class
 * @name EventQuestionsList
 *
 * @description Render EventQuestions List
 * component which have actionBar, event questions
 * header and event questions list components
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventQuestionsList extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    selectedEventQuestions: [],
    selectedPages: [],
  };

  /**
   * @function
   * @name handleOnSelectEventQuestion
   * @description Handle select a single eventQuestion action
   *
   * @param {object} eventQuestion selected eventQuestion object
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnSelectEventQuestion = eventQuestion => {
    const { selectedEventQuestions } = this.state;
    this.setState({
      selectedEventQuestions: concat([], selectedEventQuestions, eventQuestion),
    });
  };

  /**
   * @function
   * @name handleSelectAll
   * @description Handle select all event Questions actions from current page
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleSelectAll = () => {
    const { selectedEventQuestions, selectedPages } = this.state;
    const { eventQuestions, page } = this.props;
    const selectedList = uniqBy(
      [...selectedEventQuestions, ...eventQuestions],
      '_id'
    );
    const pages = uniq([...selectedPages, page]);
    this.setState({
      selectedEventQuestions: selectedList,
      selectedPages: pages,
    });
  };

  /**
   * @function
   * @name handleDeselectAll
   * @description Handle deselect all event Questions in a current page
   *
   * @returns {undefined} undefined
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleDeselectAll = () => {
    const { eventQuestions, page } = this.props;
    const { selectedEventQuestions, selectedPages } = this.state;
    const selectedList = uniqBy([...selectedEventQuestions], '_id');
    const pages = uniq([...selectedPages]);

    remove(pages, item => item === page);

    eventQuestions.forEach(eventQuestion => {
      remove(
        selectedList,
        item => item._id === eventQuestion._id // eslint-disable-line
      );
    });

    this.setState({
      selectedEventQuestions: selectedList,
      selectedPages: pages,
    });
  };

  /**
   * @function
   * @name handleOnDeselectEventQuestions
   * @description Handle deselect a single event question action
   *
   * @param {object} eventQuestion event question instance to be removed from selected event questions
   * @returns {undefined} undefined
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnDeselectEventQuestions = eventQuestion => {
    const { selectedEventQuestions } = this.state;
    const selectedList = [...selectedEventQuestions];

    remove(
      selectedList,
      item => item._id === eventQuestion._id // eslint-disable-line
    );

    this.setState({ selectedEventQuestions: selectedList });
  };

  render() {
    const { eventQuestions, loading, page, total, onEdit } = this.props;
    const { selectedEventQuestions, selectedPages } = this.state;
    const selectedEventCertaintiesCount = intersectionBy(
      selectedEventQuestions,
      eventQuestions,
      '_id'
    ).length;

    return (
      <>
        {/* toolbar */}
        <Toolbar
          itemName="event question"
          page={page}
          total={total}
          selectedItemsCount={selectedEventCertaintiesCount}
          exportUrl={getEventQuestionsExportUrl({
            filter: { _id: map(selectedEventQuestions, '_id') },
          })}
          onPaginate={nextPage => {
            paginateEventQuestions(nextPage);
          }}
          onRefresh={() =>
            refreshEventQuestions(
              () => {
                notifySuccess('Event Questions refreshed successfully');
              },
              () => {
                notifyError(
                  'An Error occurred while refreshing Event Questions please contact system administrator'
                );
              }
            )
          }
        />
        {/* end toolbar */}

        {/* event question list header */}
        <ListHeader
          headerLayout={headerLayout}
          onSelectAll={this.handleSelectAll}
          onDeselectAll={this.handleDeselectAll}
          isBulkSelected={selectedPages.includes(page)}
        />
        {/* end event Question list header */}

        {/* event questions list */}
        <List
          loading={loading}
          dataSource={eventQuestions}
          renderItem={eventQuestion => (
            <EventQuestionsListItem
              key={eventQuestion._id} // eslint-disable-line
              abbreviation={eventQuestion.strings.abbreviation.en}
              name={eventQuestion.strings.name.en}
              code={eventQuestion.strings.code}
              indicator={
                eventQuestion.relations.indicator
                  ? eventQuestion.relations.indicator.strings.name.en
                  : 'N/A'
              }
              description={
                eventQuestion.strings.description
                  ? eventQuestion.strings.description.en
                  : 'N/A'
              }
              isSelected={
                // eslint-disable-next-line
                map(selectedEventQuestions, item => item._id).includes(
                  eventQuestion._id // eslint-disable-line
                )
              }
              onSelectItem={() => {
                this.handleOnSelectEventQuestion(eventQuestion);
              }}
              onDeselectItem={() => {
                this.handleOnDeselectEventQuestions(eventQuestion);
              }}
              onEdit={() => onEdit(eventQuestion)}
              onArchive={() =>
                deleteEventQuestion(
                  eventQuestion._id, // eslint-disable-line
                  () => {
                    notifySuccess('Event question was archived successfully');
                  },
                  () => {
                    notifyError(
                      'An Error occurred while archiving Event question please contact system administrator'
                    );
                  }
                )
              }
            />
          )}
        />
        {/* end event Questions list */}
      </>
    );
  }
}

EventQuestionsList.propTypes = {
  loading: PropTypes.bool.isRequired,
  eventQuestions: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default EventQuestionsList;
