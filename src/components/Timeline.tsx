import React, { useMemo } from 'react';
import { isAfter, eachDayOfInterval, startOfDay, addDays } from 'date-fns';
import './Timeline.css';

interface DataItem {
  date: Date;
  duration: number;
}

interface TimelineProps<D = DataItem> {
  items: DataItem[];
  // renderItem: (item: D) => React.ReactElement;
}


const TIMELINE_ITEM_HEIGHT = 80;
const TIMELINE_ITEM_WIDTH_MS_TIME_MULTIPLIER = 0.00001;

function Timeline<D = DataItem>(props: TimelineProps<D>) {
  const { items } = props;

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
          width: `${timelineTotalSeconds * TIMELINE_ITEM_WIDTH_MS_TIME_MULTIPLIER}px`,
          height: `${items.length * TIMELINE_ITEM_HEIGHT}px`
        }}
        className="timeline"
      >
        {sortedItems.map((sortedItem, index) => (
          <div
            style={{
              height: `${TIMELINE_ITEM_HEIGHT}px`,
              width: `${sortedItem.duration * TIMELINE_ITEM_WIDTH_MS_TIME_MULTIPLIER}px`,
              transform: `translateX(${(sortedItem.date.getTime() - startTime) * TIMELINE_ITEM_WIDTH_MS_TIME_MULTIPLIER}px) translateY(${TIMELINE_ITEM_HEIGHT * index}px)`
            }}
            className="timeline__item"
          >
          </div>
        ))}
      </div>
    </div>
  );
}

export default Timeline;
