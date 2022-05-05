import { defineCustomElements } from "@ionic/pwa-elements/loader";
import Home from "./home";

// Call the element loader after the platform has been bootstrapped
typeof window !== "undefined" && defineCustomElements(window);

export default function Index() {
  // useEffect(() => {
  //   defineCustomElements(window);
  // }, []);

  return (
    <>
      <Home />
      {/* <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/" exact={true}>
            <Redirect to="/home" />
          </Route>
          <Route path="/home" exact={true}>
            <Home />
          </Route>
          <Route path="/message/:id">
            <ViewMessage />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter> */}
    </>
  );
}
