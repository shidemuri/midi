const fs = require("fs");
const file = JSON.parse(fs.readFileSync("./input.seq")+"");

function buildGlobalTimeline(json) {
  const map = new Map();

  for (const trackName of Object.keys(json)) {
    const [onEvents, offEvents] = json[trackName];

    for (const [ts, notes] of onEvents) {
      if (!map.has(ts)) map.set(ts, []);
      for (const n of notes)
        map.get(ts).push({ note:n, type:"on", track:trackName });
    }

    for (const [ts, notes] of offEvents) {
      if (!map.has(ts)) map.set(ts, []);
      for (const n of notes)
        map.get(ts).push({ note:n, type:"off", track:trackName });
    }
  }

  return [...map.entries()]
    .sort((a,b)=>a[0]-b[0])
    .map(([time, events]) => ({ time, events }));
}

const timeline = buildGlobalTimeline(file);

const timeline_buffers = [];
for(const keypoint of timeline) {
    const evt = Buffer.alloc(4 + 1 + (keypoint.events.length * 2));
    evt.writeFloatLE(keypoint.time,0);
    evt.writeUInt8(keypoint.events.length,4);
    for(const midievt in keypoint.events) {
        evt.writeUInt8(Number(keypoint.events[midievt].track.slice(5)), 5 + Number(midievt)*2);
        evt.writeUInt8((keypoint.events[midievt].note & 127) | (Number(keypoint.events[midievt].type == "on") * 128), 6 + Number(midievt)*2)
    }
    timeline_buffers.push(evt);
}
const result = Buffer.concat(timeline_buffers);
console.log(result.length, result);
fs.writeFileSync("input.seqbin",result);