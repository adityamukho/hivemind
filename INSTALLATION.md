# Installation

## Hivemind Codebase

1. Clone this repository.
1. `yarn install`.
1. Copy the contents of `.env.local.example` into a new file called `.env.local`.

## Database

### Important

If you're setting up your database on your localhost or on a machine on your local network, you must ensure there is a secure tunnel established into your DB server:port in order for the Firebase cloud functions (to be setup later) are able to access the DB.
See the [ngrok](https://ngrok.com/) project for a way to achieve this.

Alternatively, you can install the DB on a publicly visible machine such as a cloud server. Either way, you must either configure your firewall rules or set up a secure tunnel in order to allow FB cloud functions (and your dev server) to directly access the database.

### Installation

1. Install ArangoDB and the RecallGraph extension by following the instructions [here](https://docs.recallgraph.tech/working-with-recallgraph/installation#from-source).
1. Fill in the database access point, credentials and the RecallGraph service mount point in the `.env.local` file at the root of this project.

### Database Scaffold

Run the scripts in the `db-setup` folder using the command below. These are idempotent scripts and is safe to execute them multiple times. In case of a partial or incomplete setup from a prior run, these scripts will pick up where they left the last time. It effectively behaves like a sync operation.

`node db-setup`

## Configure Firebase

1. Create a project at the [Firebase console](https://console.firebase.google.com/).
1. Get your account credentials from the Firebase console at _Project settings > Service accounts_, where you can click on _Generate new private key_ and download the credentials as a json file. It will contain keys such as `project_id`, `client_email` and `client_id`. Set them as environment variables in the `.env.local` file at the root of this project.
1. Go to **Develop**, click on **Authentication** and in the **Sign-in method** tab enable authentication for the app.
1. In the `.firebaserc` file at the root of this project, update the project ID for the `default` key.

### Uploading Firebase Cloud Functions

1. Install the Firebase CLI tool: `npm install -g firebase-tools`
1. `firebase login`.
1. Configure environment variables for cloud functions:
   1. `firebase functions:config:set arango.host=<db host> # Make sure this host is publicly accessible.`
   1. `firebase functions:config:set arango.port=<db port> # Make sure this port is publicly open.`
   1. `firebase functions:config:set arango.db=<db name>`
   1. `firebase functions:config:set arango.user=<db user>`
   1. `firebase functions:config:set arango.password=<db password>`
   1. `firebase functions:config:set arango.svc.mount=<recallgraph mount point>`
1. Inside the `functions` directory at the root of the project: `npm install`. Note that this needs a specific version of node to run. Use [nvm](https://github.com/nvm-sh/nvm) to manage multiple node versions on your system.
1. Deploy cloud functions: `firebase deploy --only functions`

Your installation is now complete!
