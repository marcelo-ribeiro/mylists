import { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";

import { defineCustomElements as ionDefineCustomElements } from "@ionic/core/loader";

import "core/firebase";

import { ListsProvider } from "contexts/lists";
import { auth } from "core/auth";
import { User } from "core/user.model";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import Login from "pages/login";

/* Core CSS required for Ionic components to work properly */
import "@ionic/core/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/core/css/normalize.css";
import "@ionic/core/css/structure.css";
import "@ionic/core/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/core/css/display.css";
import "@ionic/core/css/flex-utils.css";
import "@ionic/core/css/float-elements.css";
import "@ionic/core/css/padding.css";
import "@ionic/core/css/text-alignment.css";
import "@ionic/core/css/text-transformation.css";

/* Theme variables */
import "pages/list/index.scss";
import "pages/login/index.scss";
import "styles/global.scss";
import "styles/variables.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    ionDefineCustomElements(window);
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log({ user });
        setUser(user);
      } else {
        // User is signed out
        router.replace("/login");
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />

        {/* add to homescreen for ios */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />

        {/* <link
          href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;700&display=swap"
          rel="stylesheet"
        /> */}

        {/* <script
          type="module"
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
        ></script> */}

        <script src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
      </Head>
      <ion-app>
        {!user ? (
          <Login />
        ) : (
          <ListsProvider>
            <Component {...pageProps} />
          </ListsProvider>
        )}
      </ion-app>
    </>
  );
}
