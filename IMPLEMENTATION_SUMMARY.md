# Implementation Summary

## Task 1: Chat Messages Display

Built a chat viewer that fetches messages from the API and displays them in a list. Each message shows the author, content, timestamp, and type.

Added a few extra features:
- Workspace selector dropdown (persists selection)
- Auto-refresh every 30 seconds
- Search filter
- Load more pagination
- Quick send message form
- Skeleton loading


## Task 2: Create Workspace & Send Messages

Two-step form: create workspace first, then send messages to it.

Used Reactive Forms with basic validation (name required, min 3 chars). Shows success/error feedback and loading states during API calls.

## Notes

- Kept styles scoped to components
- Used TypeScript interfaces for type safety
- localStorage for remembering selected workspace
