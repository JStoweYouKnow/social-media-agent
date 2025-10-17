# Firebase CI setup (GitHub Actions)

This project contains a GitHub Actions workflow to deploy the built React app to Firebase Hosting. The workflow does not attempt to create a Google Cloud service account automatically — that step commonly fails when the account running the workflow lacks organization/GCP permissions. Instead, create a service account manually and add its JSON key as a GitHub secret.

Steps to create the service account and configure GitHub:

1. Create a service account in your GCP project

   - Go to the Google Cloud Console: https://console.cloud.google.com/iam-admin/serviceaccounts
   - Select your Firebase project (the same project shown in the Firebase Console).
   - Click "Create Service Account".
   - Give it a name like `github-firebase-deploy`.
   - Grant the following roles (minimum recommended):
     - Firebase Hosting Admin
     - Service Account User
   - Finish creating the service account.

2. Create a JSON key

   - After creating the account, select it and go to the "Keys" tab.
   - Add a new key, choose JSON, and download it.

3. Add the key to GitHub repository secrets

   - In your GitHub repo, go to Settings → Secrets → Actions → New repository secret.
   - Create a secret named `FIREBASE_SERVICE_ACCOUNT` and paste the entire JSON file content as the value.
   - Also add a secret `FIREBASE_PROJECT_ID` with the value of your Firebase project ID (e.g. `my-project-12345`).

Optional alternative using a Firebase CLI token:

 - You can also create a long-lived CLI token using `firebase login:ci` locally and store it in the `FIREBASE_CLI_TOKEN` secret. The workflow supports either method; using the service account key is recommended for CI.

Notes:

 - The workflow `/.github/workflows/firebase-hosting.yml` expects one of these authentication methods to be present:
   - `FIREBASE_SERVICE_ACCOUNT` (preferred) AND `FIREBASE_PROJECT_ID` set.
   - OR `FIREBASE_CLI_TOKEN` set.
 - Do NOT commit the JSON key to the repository. Store it only in GitHub Secrets.
