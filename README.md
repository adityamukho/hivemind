# Hivemind
A collaborative, version-controlled mindmap. Built during the [FOSS 2020 Hackathon](https://fossunited.org/hackathon) organized by FOSS United.

Hivemind is intended to let users collaboratively create and edit shared mind maps. All changes are automatically revision-controlled, and users can time-travel to any point in the past to look at historic versions of their work.

Hivemind will also let users tag specific versions of their work for easy future reference, and allow them to share their maps with other users (with admin/read-write/read-only access) or publicly (via link, read-only).

## Demo
https://hivemind.vercel.app/

## Video Link
https://youtu.be/bjZC0nFcoRw

## Vision
Hivemind was envisioned to have the following features:
1. Version control - rewind your mindmap to any previous state.
2. Sharing - share your mindmap with read/write/admin access to authenticated users, or make it publicly visible (read-only) to everyone.
3. Collaborative, realtime editing - all users with write access to a mindmap should be able to simultaneously edit it, and view each other's changes in real time.

## Features Implemented During the Hackathon
1. Authentication (using Firebase)
2. Mindmap List
3. Mindmap view/edit and timelines on an interactive canvas.

## Tech Stack
1. [Next.js](https://nextjs.org/)
1. [RecallGraph](https://github.com/RecallGraph/RecallGraph)
1. [Cytoscape](https://js.cytoscape.org/)
1. [Firebase](https://firebase.google.com/) for auth and real-time sync.
