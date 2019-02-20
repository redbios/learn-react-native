const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const fs = require("fs");
const UUID = require("uuid-v4");
const { Storage } = require("@google-cloud/storage");
const strg = new Storage({
  projectId: "awesome-places-1550104733636",
  keyFilename: "awesome-places-keyFirebase.json"
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.storeImage = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    const body = JSON.parse(request.body);
    fs.writeFileSync("/tmp/uploaded-image.jpg", body.image, "base64", err => {
      console.log(err);
      return response.status(500).json({ error: err });
    });
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
              uid
          });
        } else {
          console.log(err);
          return response.status(500).json({ error: err });
        }
      }
    );
  });
});
