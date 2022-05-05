import {
  getAuth,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
} from "firebase/auth";

export const auth = getAuth();
console.log({ auth });

const getRecaptchaVerifier = () => {
  return new RecaptchaVerifier(
    "signup-button",
    {
      size: "invisible",
      callback: (response) => {
        console.log({ RecaptchaVerifier_response: response });
      },
    },
    auth
  );
};

export function loginWithPhoneNumber(phoneNumber: string) {
  const recaptchaVerifier = getRecaptchaVerifier();
  return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
}

export function googleLogin() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}
