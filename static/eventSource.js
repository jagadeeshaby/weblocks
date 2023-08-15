const sse = new EventSource("/events");

/*
 * This will listen only for events
 * similar to the following:
 *
 * event: notice
 * data: useful data
 * id: someid
 */

sse.addEventListener("ContactConnected", (e,...rest) => {
  console.log(e, rest);
});

/*
 * Similarly, this will listen for events
 * with the field `event: update`
 */
sse.addEventListener("ContactIncoming", (e) => {
  console.log(e.data);
});

/*
 * Similarly, this will listen for events
 * with the field `event: update`
 */
sse.addEventListener("ContactEnded", (e) => {
    console.log(e.data);
  });
  

/*
 * The event "message" is a special case, as it
 * will capture events without an event field
 * as well as events that have the specific type
 * `event: message` It will not trigger on any
 * other event type.
 */
sse.addEventListener("message", (e) => {
  console.log(e.data);
});
