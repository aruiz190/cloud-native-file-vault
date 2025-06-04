const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const storage = firebase.storage();
const db = firebase.firestore();

function signIn() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(result => {
      document.getElementById("status").innerText = `Signed in as ${result.user.email}`;
    })
    .catch(error => {
      console.error("Sign-in failed:", error);
    });
}

function uploadEncryptedFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  if (!file) return alert("Please select a file first.");

  const reader = new FileReader();
  reader.onload = async function (e) {
    const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
    const encrypted = CryptoJS.AES.encrypt(wordArray, "password123").toString();

    const blob = new Blob([encrypted], { type: "text/plain" });
    const storageRef = storage.ref().child(`vault/${file.name}`);
    await storageRef.put(blob);

    await db.collection("logs").add({
      user: auth.currentUser.email,
      file: file.name,
      timestamp: new Date().toISOString()
    });

    alert("File encrypted and uploaded successfully.");
  };
  reader.readAsArrayBuffer(file);
}

