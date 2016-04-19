export { WORKER_SCRIPT, WORKER_RENDER_PLATFORM, initializeGenericWorkerRenderer, WORKER_RENDER_APPLICATION_COMMON } from 'angular2/src/platform/worker_render_common';
export { WORKER_RENDER_APPLICATION, WebWorkerInstance } from 'angular2/src/platform/worker_render';
export { ClientMessageBroker, ClientMessageBrokerFactory, FnArg, UiArguments } from '../src/web_workers/shared/client_message_broker';
export { ReceivedMessage, ServiceMessageBroker, ServiceMessageBrokerFactory } from '../src/web_workers/shared/service_message_broker';
export { PRIMITIVE } from '../src/web_workers/shared/serializer';
export * from '../src/web_workers/shared/message_bus';
import { WORKER_RENDER_APPLICATION } from 'angular2/src/platform/worker_render';
/**
 * @deprecated Use WORKER_RENDER_APPLICATION
 */
export const WORKER_RENDER_APP = WORKER_RENDER_APPLICATION;
export { WORKER_RENDER_ROUTER } from 'angular2/src/web_workers/ui/router_providers';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2VyX3JlbmRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtdlNiN3k1NW0udG1wL2FuZ3VsYXIyL3BsYXRmb3JtL3dvcmtlcl9yZW5kZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsU0FDRSxhQUFhLEVBQ2Isc0JBQXNCLEVBQ3RCLCtCQUErQixFQUMvQixnQ0FBZ0MsUUFDM0IsNENBQTRDLENBQUM7QUFDcEQsU0FBUSx5QkFBeUIsRUFBRSxpQkFBaUIsUUFBTyxxQ0FBcUMsQ0FBQztBQUNqRyxTQUNFLG1CQUFtQixFQUNuQiwwQkFBMEIsRUFDMUIsS0FBSyxFQUNMLFdBQVcsUUFDTixpREFBaUQsQ0FBQztBQUN6RCxTQUNFLGVBQWUsRUFDZixvQkFBb0IsRUFDcEIsMkJBQTJCLFFBQ3RCLGtEQUFrRCxDQUFDO0FBQzFELFNBQVEsU0FBUyxRQUFPLHNDQUFzQyxDQUFDO0FBQy9ELGNBQWMsdUNBQXVDLENBQUM7T0FDL0MsRUFBQyx5QkFBeUIsRUFBQyxNQUFNLHFDQUFxQztBQUU3RTs7R0FFRztBQUNILE9BQU8sTUFBTSxpQkFBaUIsR0FBRyx5QkFBeUIsQ0FBQztBQUMzRCxTQUFRLG9CQUFvQixRQUFPLDhDQUE4QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IHtcbiAgV09SS0VSX1NDUklQVCxcbiAgV09SS0VSX1JFTkRFUl9QTEFURk9STSxcbiAgaW5pdGlhbGl6ZUdlbmVyaWNXb3JrZXJSZW5kZXJlcixcbiAgV09SS0VSX1JFTkRFUl9BUFBMSUNBVElPTl9DT01NT05cbn0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL3dvcmtlcl9yZW5kZXJfY29tbW9uJztcbmV4cG9ydCB7V09SS0VSX1JFTkRFUl9BUFBMSUNBVElPTiwgV2ViV29ya2VySW5zdGFuY2V9IGZyb20gJ2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS93b3JrZXJfcmVuZGVyJztcbmV4cG9ydCB7XG4gIENsaWVudE1lc3NhZ2VCcm9rZXIsXG4gIENsaWVudE1lc3NhZ2VCcm9rZXJGYWN0b3J5LFxuICBGbkFyZyxcbiAgVWlBcmd1bWVudHNcbn0gZnJvbSAnLi4vc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9jbGllbnRfbWVzc2FnZV9icm9rZXInO1xuZXhwb3J0IHtcbiAgUmVjZWl2ZWRNZXNzYWdlLFxuICBTZXJ2aWNlTWVzc2FnZUJyb2tlcixcbiAgU2VydmljZU1lc3NhZ2VCcm9rZXJGYWN0b3J5XG59IGZyb20gJy4uL3NyYy93ZWJfd29ya2Vycy9zaGFyZWQvc2VydmljZV9tZXNzYWdlX2Jyb2tlcic7XG5leHBvcnQge1BSSU1JVElWRX0gZnJvbSAnLi4vc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9zZXJpYWxpemVyJztcbmV4cG9ydCAqIGZyb20gJy4uL3NyYy93ZWJfd29ya2Vycy9zaGFyZWQvbWVzc2FnZV9idXMnO1xuaW1wb3J0IHtXT1JLRVJfUkVOREVSX0FQUExJQ0FUSU9OfSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vd29ya2VyX3JlbmRlcic7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgVXNlIFdPUktFUl9SRU5ERVJfQVBQTElDQVRJT05cbiAqL1xuZXhwb3J0IGNvbnN0IFdPUktFUl9SRU5ERVJfQVBQID0gV09SS0VSX1JFTkRFUl9BUFBMSUNBVElPTjtcbmV4cG9ydCB7V09SS0VSX1JFTkRFUl9ST1VURVJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy91aS9yb3V0ZXJfcHJvdmlkZXJzJztcbiJdfQ==