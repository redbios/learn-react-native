const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const fs = require("fs");
const UUID = require("uuid-v4");
const { Storage } = require("@google-cloud/storage");
const strg = new Storage({
  projectId: "awesome-places-1550104733636",
  keyFilename: "awesome-places-keyFirebase.json"
});

admin.initializeApp({
  credential: admin.credential.cert(
    require("./awesome-places-keyFirebase.json")
  )
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.storeImage = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    if (
      !request.headers.authorization ||
      !request.headers.authorization.startsWith("Bearer ")
    ) {
      console.log("No token present!");
      response.status(403).json({ error: "Unauthorized" });
      return;
    }
    let idToken = request.headers.authorization.split("Bearer ")[1];
    admin
      .auth()
      .verifyIdToken(idToken)
      .then(decodedToken => {
        const body = JSON.parse(request.body);
        fs.writeFileSync(
          "/tmp/uploaded-image.jpg",
          body.image,
          "base64",
          err => {
            console.log(err);
            return response.status(500).json({ error: err });
          }
        );
        const bucket = strg.bucket("awesome-places-1550104733636.appspot.com");
        const uid = UUID();

        bucket.upload(
          "/tmp/uploaded-image.jpg",
          {
            uploadType: "media",
            destination: "/places/" + uid + ".jpg",
            metadata: {
              metadata: {
                contentType: "image/jpeg",
                firebaseStorageDownloadTokens: uid
              }
            }
          },
          (err, file) => {
            if (!err) {
              return response.status(201).json({
                imageUrl:
                  "https://firebasestorage.googleapis.com/v0/b/" +
                  bucket.name +
                  "/o/" +
                  encodeURIComponent(file.name) +
                  "?alt=media&token=" +
                  uid,
                imagePath: "/places/" + uid + ".jpg"
              });
            } else {
              console.log(err);
              return response.status(500).json({ error: err });
            }
          }
        );
        return;
      })
      .catch(error => {
        console.log("Token is invalid");
        return response.status(403).json({ error: "Unauthorized" });
      });
  });
});

exports.deleteImage = functions.database
  .ref("/places/{placeId}")
  .onDelete(event => {
    const placeData = event.val();
    const imagePath = placeData.imagePath;

    const bucket = strg.bucket("awesome-places-1550104733636.appspot.com");
    return bucket.file(imagePath).delete();
  });
