import React, { useMemo } from 'react';
import { isAfter, eachDayOfInterval, startOfDay, addDays } from 'date-fns';
import './Timeline.css';

interface DataItem {
  date: Date;
  duration: number;
}

interface TimelineProps<D extends DataItem> {
  items: D[];
  renderItem: (item: D) => React.ReactElement;
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

  const startTime = sortedItems[0].date.getTime();
  const endTime = lastItem.date.getTime() + lastItem.duration;

  const firstDate = firstItem.date;
  const lastDate = lastItem.date;

  const dayDates = eachDayOfInterval({
    start: startOfDay(firstDate),
    end: startOfDay(addDays(new Date(lastDate), 1)),
  });

  const timelineTotalSeconds = endTime - startTime;

  return (
    <div className="timeline-wrapper">
      <div
        style={{
          width: `${timelineTotalSeconds * itemWidthMsMultipler}px`,
          height: `${(itemHeight * items.length)}px`,
        }}
        className="timeline"
      >
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
              {props.renderItem(sortedItem)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Timeline;
