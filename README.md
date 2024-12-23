# WritemyCV 
This repository contains the code for the WritemyCV project. The tech stack has following components:

- Frontend: React, Typescript, TailwindCSS
- Backend: Firebase Functions, Firebase Admin SDK, Firebase Storage, Firebase Firestore
- Authentication: Firebase Authentication
- Hosting: Firebase Hosting

Besides above, the project uses Stripe for payment processing, Recapcha for spam protection, Resend for email sending. The login email for resend is `hello@writemycv.uk` and use the google login to login into resend. For stripe the email is `hello@writemycv.uk` and get the password from client. 

All the frontend code is in the `frontend` folder and the backend code is in the `backend` folder.

## OpenAI: 
The project uses OpenAI for all the AI features. Update the OpenAI API key in the `.env` file. Also, look at .env.example file for more details.

## GCP Configurations 

```
gcloud cors set bucketCors.json gs://writemycv.appspot.com
```

## Deployment to Firebase 

### Deploying the Howell ENV 
```
source .env.howell
firebase deploy --only hosting:howell-writemycv
```

### Deploying the General ENV 
```
source .env.prod
firebase deploy --only functions  --project $GCLOUD_PROJECT
firebase deploy --only hosting:writemycv
```

