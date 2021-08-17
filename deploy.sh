GOOGLE_PROJECT_ID=crested-athlete-314512
PROJECT_NAME=serverless

gcloud builds submit --tag asia.gcr.io/$GOOGLE_PROJECT_ID/$PROJECT_NAME --project=$GOOGLE_PROJECT_ID

gcloud run deploy $PROJECT_NAME \
 --image asia.gcr.io/$GOOGLE_PROJECT_ID/$PROJECT_NAME \
 --platform managed \
 --region asia-east1 \
 --allow-unauthenticated \
 --project=$GOOGLE_PROJECT_ID