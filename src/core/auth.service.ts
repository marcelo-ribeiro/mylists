import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { first, switchMap } from "rxjs/operators";

import { Platform } from "@ionic/angular";

import { AngularFireAuth } from "@angular/fire/auth";
import { GooglePlus } from "@ionic-native/google-plus/ngx";
import { auth } from "firebase";

import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";

import { User } from "./user.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user$: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private googlePlus: GooglePlus,
    public platform: Platform
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  getUser() {
    return this.user$.pipe(first()).toPromise();
  }

  async googleLogin() {
    if (this.platform.is("cordova")) {
      console.log("googleLogin");
      return this.googlePlus
        .login({
          webClientId:
            "1073164028328-or16gi85heqv3ihg1nnahfcga5hme7m3.apps.googleusercontent.com",
          offline: true,
        })
        .then((user) => {
          console.log("googleLogin > user", user);

          const credential = auth.GoogleAuthProvider.credential(user.idToken);
          console.log("credential", credential);

          const credentialUser = this.afAuth
            .signInWithCredential(credential)
            .then((response) => {
              console.log("credentialUser", response);
              return this.updateUserData(response.user);
            });

          return credentialUser;
        });
    } else {
      const provider = new auth.GoogleAuthProvider();
      return this.oAuthLogin(provider);
    }
  }

  githubLogin() {
    const provider = new auth.GithubAuthProvider();
    return this.oAuthLogin(provider);
  }

  facebookLogin() {
    const provider = new auth.FacebookAuthProvider();
    return this.oAuthLogin(provider);
  }

  twitterLogin() {
    const provider = new auth.TwitterAuthProvider();
    return this.oAuthLogin(provider);
  }

  private async oAuthLogin(provider: any) {
    const credential = await this.afAuth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  async signOut() {
    await this.afAuth.signOut();
    this.googlePlus.logout();
    return this.router.navigate(["/login"]);
  }

  // Sets user data to firestore after succesful login
  private updateUserData({ uid, email, displayName, photoURL }: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${uid}`
    );

    const data: User = {
      uid,
      email,
      displayName,
      photoURL,
    };

    return userRef.set(data, { merge: true });
  }
}
