

## GCP Configurations 

```
gcloud cors set bucketCors.json gs://resu-me-a5cff.appspot.com
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

