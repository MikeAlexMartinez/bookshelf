// this is for extra credit
import React from 'react';
import {client} from 'utils/api-client';

let queue = [];

setInterval(sendProfileQueue, 5000);

function sendProfileQueue() {
  console.log('snedProfileQueue')
  console.log(`queue.length: ${queue.length}`);
  if (!queue.length) {
    return Promise.resolve({ success: true });
  }
  const queueToSend = [...queue];
  queue = [];
  return client('profile', { data: queueToSend });
}

function Profiler({ metadata, phases, ...props }) {
   function handleReportOnRender(
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions,
  ) {
    if (!phases || phases.includes(phase)) {
      console.log(`push handleReportOnRender ${id}`);
      queue.push({
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions: [...interactions],
        metadata,
      });
    }
  } 
  return (
    <React.Profiler onRender={handleReportOnRender} {...props} />
  );
}

export {Profiler};
export { unstable_trace as trace, unstable_wrap as wrap } from 'scheduler/tracing';
