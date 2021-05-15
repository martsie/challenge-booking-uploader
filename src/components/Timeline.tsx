import React, { useMemo } from 'react';
import { isAfter, eachDayOfInterval, startOfDay, addDays, format } from 'date-fns';
import './Timeline.css';

interface DataItem {
  date: Date;
  duration: number;
}

interface TimelineProps<D extends DataItem> {
  items: D[];
  renderTimelineItem: (item: D, index: number) => React.ReactElement;
  itemHeight: number;
  itemWidthMsMultipler: number;
}

const verticalBufferBetweenTimelineItems = 20;

function Timeline<D extends DataItem>(props: TimelineProps<D>) {
  const { items, itemHeight, itemWidthMsMultipler } = props;

  const sortedItems = useMemo(() => {
    return items.slice(0).sort((a: DataItem, b: DataItem) => isAfter(a.date.getTime(), b.date.getTime()) ? 1 : -1);
  }, [items]);

  if (items.length === 0) {
    return <div>No items</div>
  }

  const firstItem = sortedItems[0];
  const lastItem = sortedItems[sortedItems.length - 1];

  const firstDate = firstItem.date;
  const lastDate = lastItem.date;

  const dayDates = eachDayOfInterval({
    start: startOfDay(firstDate),
    end: startOfDay(addDays(new Date(lastDate), 1)),
  });

  const startTime = dayDates[0].getTime();
  const endTime = dayDates[dayDates.length - 1].getTime();

  const timelineTotalSeconds = endTime - startTime;

  return (
    <div className="timeline-wrapper">
      <div className="timeline-scroller">
        <div
          style={{
            width: `${timelineTotalSeconds * itemWidthMsMultipler}px`,
            height: `${(itemHeight * items.length)}px`,
          }}
          className="timeline"
        >
          <div
            className="timeline__header"
          >
            {dayDates.slice(0, dayDates.length - 1).map((dayDate, index) => (
              <div
                style={{
                  transform: `translateX(${(dayDate.getTime() - startTime) * itemWidthMsMultipler}px)`,
                  width: `${(dayDates[index + 1].getTime() - dayDate.getTime()) * itemWidthMsMultipler}px`,
                }}
                className="timeline__header-item"
              >
                <span className="timeline__header-item-day">{format(dayDate, 'd')}</span>
                <span className="timeline__header-item-month">{format(dayDate, 'MMMM')}</span>
              </div>
            ))}
          </div>
          {sortedItems.map((sortedItem, index) => (
            <div
              className="timeline__item-wrapper"
              style={{
                height: `${itemHeight + verticalBufferBetweenTimelineItems}px`,
                transform: `translateY(${(itemHeight * index) + (verticalBufferBetweenTimelineItems * index)}px)`,
                padding: `${verticalBufferBetweenTimelineItems / 2}px 0`,
              }}
            >
              <div
                style={{
                  height: `${itemHeight}px`,
                  width: `${sortedItem.duration * itemWidthMsMultipler}px`,
                  transform: `translateX(${(sortedItem.date.getTime() - startTime) * itemWidthMsMultipler}px)`
                }}
                className="timeline__item"
              >
                {props.renderTimelineItem(sortedItem, index)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Timeline;
